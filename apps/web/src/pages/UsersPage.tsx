import { useEffect, useState } from 'react';
import type { UpdateUser, User } from '@niaga/shared';
import { createCashierSchema, updateUserSchema } from '@niaga/shared';
import { errorMessage } from '../api/error-message';
import { createCashier, listUsers, updateUser } from '../api/user.api';
import { CashierForm } from '../components/user/CashierForm';
import { UserTable } from '../components/user/UserTable';
import { useAction } from '../hooks/use-action';

export function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const { error, notice, setError, run } = useAction();

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((e: unknown) => setError(errorMessage(e)));
  }, [setError]);

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
    <main className="page">
      <h1>Kelola kasir</h1>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <div className="split side-first">
        <section className="card" aria-labelledby="add-cashier">
          <h2 id="add-cashier">Tambah kasir</h2>
          <CashierForm onSubmit={create} />
        </section>
        <div className="card">
          {users === null && !error && <p>Memuat…</p>}
          {users?.every((u) => u.role === 'owner') && <p>Belum ada kasir. Tambahkan kasir pertama di formulir.</p>}
          {users && <UserTable users={users} onUpdate={update} />}
        </div>
      </div>
    </main>
  );
}
