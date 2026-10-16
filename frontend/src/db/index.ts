import Dexie, { type Table } from 'dexie';
import type { HlcTimestamp } from '../sync/hlc';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface LocalTask {
  id: string;
  title: string;
  status: TaskStatus;
  wallTime: number;
  counter: number;
  nodeId: string;
}

export interface QueuedMutation {
  mutationId: string;
  entityId: string;
  entityType: string;
  opType: number; // 0: INSERT, 1: UPDATE, 2: DELETE
  fieldName: string;
  fieldValue: string;
  timestamp: HlcTimestamp;
  createdAt: number;
}

export class DeltaMeshDatabase extends Dexie {
  tasks!: Table<LocalTask, string>;
  mutation_queue!: Table<QueuedMutation, string>;

  constructor() {
    super('DeltaMeshDB');
    this.version(1).stores({
      tasks: 'id, status, wallTime',
      mutation_queue: 'mutationId, entityId, createdAt',
    });
  }
}

export const db = new DeltaMeshDatabase();
