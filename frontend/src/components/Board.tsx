import { useEffect, useState } from 'react';
import { db } from '../db/client';
import type { Task } from '../db/schema';
import { TaskCard } from './TaskCard';

const COLUMNS: Task['column'][] = ['todo', 'doing', 'done'];

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    db.tasks.toArray().then(setTasks);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {COLUMNS.map((col) => (
        <section key={col} style={{ flex: 1 }}>
          <h2>{col}</h2>
          {tasks.filter((t) => t.column === col).map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </section>
      ))}
    </div>
  );
}
