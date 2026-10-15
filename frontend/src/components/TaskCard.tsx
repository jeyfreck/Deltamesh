import type { Task } from '../db/schema';

export function TaskCard({ task }: { task: Task }) {
  return <div className="task-card">{task.title}</div>;
}
