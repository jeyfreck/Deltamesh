import Dexie, { type Table } from 'dexie';
import type { Task, QueuedMutation } from './schema';

class DeltaMeshDB extends Dexie {
  tasks!: Table<Task, string>;
  queue!: Table<QueuedMutation, string>;

  constructor() {
    super('deltamesh');
    this.version(1).stores({
      tasks: 'id, column',
      queue: 'id, createdAt',
    });
  }
}

export const db = new DeltaMeshDB();
