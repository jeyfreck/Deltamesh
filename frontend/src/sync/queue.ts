import { db } from '../db/client';
import type { QueuedMutation } from '../db/schema';

export async function enqueue(m: QueuedMutation) {
  await db.queue.put(m);
}

/** Sends queued mutations in order; removes each one when sent successfully. */
export async function flush(send: (m: QueuedMutation) => boolean) {
  const pending = await db.queue.orderBy('createdAt').toArray();
  for (const m of pending) {
    if (!send(m)) return;
    await db.queue.delete(m.id);
  }
}
