import { db } from '../db/client.js';

/** Single-user mode: the first user is the owner. Replace with auth later. */
export async function getCurrentUser() {
  const user = await db.query.users.findFirst();
  if (!user) throw new Error('No user found. Run `pnpm db:seed` first.');
  return user;
}
