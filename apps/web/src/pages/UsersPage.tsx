import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { UpdateUser, User } from '@niaga/shared';
import { createCashierSchema, updateUserSchema } from '@niaga/shared';
import { errorMessage } from '../api/error-message';
import { createCashier, listUsers, updateUser } from '../api/user.api';
import { CashierForm } from '../components/user/CashierForm';
import { UserTable } from '../components/user/UserTable';

export function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((e: unknown) => setError(errorMessage(e)));
  }, []);

  // Returns true on success so forms know to clear themselves.
  async function run(action: () => Promise<void>, done: string) {
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(done);
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    }
  }

  const create = (values: Record<string, string>) =>
    run(async () => {
      const user = await createCashier(createCashierSchema.parse(values));
      setUsers((prev) => [...(prev ?? []), user]);
    }, 'Kasir ditambahkan.');

  const update = (id: string, input: UpdateUser) =>
    run(async () => {
      const user = await updateUser(id, updateUserSchema.parse(input));
      setUsers((prev) => prev?.map((u) => (u.id === id ? user : u)) ?? null);
    }, input.password ? 'Password direset. Kasir perlu login ulang.' : 'Status kasir diubah.');

  return (
    <main>
      <p>
        <Link to="/">← Beranda</Link>
      </p>
      <h1>Kelola kasir</h1>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <CashierForm onSubmit={create} />
      {users === null && !error && <p>Loading…</p>}
      {users?.every((u) => u.role === 'owner') && <p>Belum ada kasir.</p>}
      {users && <UserTable users={users} onUpdate={update} />}
    </main>
  );
}
