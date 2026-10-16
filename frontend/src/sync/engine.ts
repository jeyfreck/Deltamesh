import { db, type QueuedMutation, type TaskStatus, type LocalTask } from '../db';
import { localClock } from './hlc';
// @ts-ignore - Generado por protobufjs
import { sync } from '../proto/sync';

type ConnectionState = 'connected' | 'connecting' | 'disconnected';

export class SyncEngine {
  private ws: WebSocket | null = null;
  private attempt = 0;
  private baseDelay = 1000;
  private maxDelay = 30000;
  private stateListeners: Set<(state: ConnectionState) => void> = new Set();
  private currentState: ConnectionState = 'disconnected';
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.connect();
    // Escuchar eventos físicos de red del navegador
    window.addEventListener('online', () => this.connect());
  }

  public subscribeState(listener: (state: ConnectionState) => void) {
    this.stateListeners.add(listener);
    listener(this.currentState);
    return () => this.stateListeners.delete(listener);
  }

  private setState(state: ConnectionState) {
    this.currentState = state;
    this.stateListeners.forEach((l) => l(state));
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.setState('connecting');
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = async () => {
      this.attempt = 0;
      this.setState('connected');
      await this.flushQueue();
    };

    this.ws.onmessage = async (event) => {
      if (event.data instanceof ArrayBuffer) {
        const bytes = new Uint8Array(event.data);
        const response = sync.ServerSyncResponse.decode(bytes);
        await this.handleServerResponse(response);
      }
    };

    this.ws.onclose = () => {
      this.setState('disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private scheduleReconnect() {
    const jitter = Math.random() * 500;
    const delay = Math.min(this.maxDelay, this.baseDelay * Math.pow(2, this.attempt)) + jitter;
    this.attempt += 1;

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Despacha mutaciones locales pendientes al servidor Rust
  public async flushQueue() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const pending = await db.mutation_queue.toArray();
    if (pending.length === 0) return;

    const ops = pending.map((item) => ({
      mutationId: item.mutationId,
      entityId: item.entityId,
      entityType: item.entityType,
      opType: item.opType,
      fields: [
        {
          fieldName: item.fieldName,
          valueJson: item.fieldValue,
          timestamp: item.timestamp,
        },
      ],
      timestamp: item.timestamp,
    }));

    const request = sync.ClientSyncRequest.create({
      clientId: localClock.getNodeId(),
      pendingMutations: ops,
    });

    const buffer = sync.ClientSyncRequest.encode(request).finish();
    this.ws.send(buffer);
  }

  private async handleServerResponse(res: any) {
    // 1. Limpiar de la cola local las mutaciones confirmadas por Postgres
    if (res.acknowledgedMutationIds && res.acknowledgedMutationIds.length > 0) {
      await db.mutation_queue.bulkDelete(res.acknowledgedMutationIds);
    }

    // 2. Aplicar deltas remotos provenientes de otros clientes vía Redis
    if (res.appliedDeltas && res.appliedDeltas.length > 0) {
      for (const delta of res.appliedDeltas) {
        for (const field of delta.fields) {
          const ts = field.timestamp;
          localClock.receive(ts);

          const existing = await db.tasks.get(delta.entityId);
          const isRemoteNewer =
            !existing ||
            ts.wallTime > existing.wallTime ||
            (ts.wallTime === existing.wallTime && ts.counter > existing.counter);

          if (isRemoteNewer) {
            const rawVal = JSON.parse(field.valueJson);
            const updatedTask: LocalTask = {
              id: delta.entityId,
              title: field.fieldName === 'title' ? rawVal : (existing?.title ?? ''),
              status: field.fieldName === 'status' ? (rawVal as TaskStatus) : (existing?.status ?? 'todo'),
              wallTime: ts.wallTime,
              counter: ts.counter,
              nodeId: ts.nodeId,
            };
            await db.tasks.put(updatedTask);
          }
        }
      }
    }
  }

  // Mutación offline-first invocada por la interfaz de usuario
  public async mutateTaskField(
    taskId: string,
    fieldName: 'title' | 'status',
    value: string,
    currentTask?: LocalTask
  ) {
    const ts = localClock.now();
    const mutationId = crypto.randomUUID();

    // 1. Actualización inmediata en IndexedDB (0ms de latencia visual)
    const taskData: LocalTask = {
      id: taskId,
      title: fieldName === 'title' ? value : (currentTask?.title ?? 'Nueva Tarea'),
      status: fieldName === 'status' ? (value as TaskStatus) : (currentTask?.status ?? 'todo'),
      wallTime: ts.wallTime,
      counter: ts.counter,
      nodeId: ts.nodeId,
    };
    await db.tasks.put(taskData);

    // 2. Registro en la cola local de pendientes
    const queued: QueuedMutation = {
      mutationId,
      entityId: taskId,
      entityType: 'task',
      opType: currentTask ? 1 : 0,
      fieldName,
      fieldValue: JSON.stringify(value),
      timestamp: ts,
      createdAt: Date.now(),
    };
    await db.mutation_queue.put(queued);

    // 3. Intento de vaciado asíncrono si el socket está activo
    await this.flushQueue();
  }
}

export const syncEngine = new SyncEngine('ws://localhost:3000/ws');
