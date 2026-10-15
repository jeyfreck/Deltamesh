export interface Task {
  id: string;
  title: string;
  column: 'todo' | 'doing' | 'done';
  hlc: string;
}

export interface QueuedMutation {
  id: string;
  entityId: string;
  field: string;
  value: string;
  hlc: string;
  createdAt: number;
}
