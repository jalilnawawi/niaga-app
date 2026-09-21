import type { UpdateUser, User } from '@niaga/shared';
import { ResetPasswordForm } from './ResetPasswordForm';

type Props = { users: User[]; onUpdate: (id: string, input: UpdateUser) => Promise<boolean> };

export function UserTable({ users, onUpdate }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Nama</th>
          <th scope="col">Email</th>
          <th scope="col">Peran</th>
          <th scope="col">Status</th>
          <th scope="col">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.role === 'owner' ? 'Owner' : 'Kasir'}</td>
            <td>{u.active ? 'Aktif' : 'Nonaktif'}</td>
            <td>
              {u.role === 'cashier' && (
                <>
                  <button type="button" onClick={() => onUpdate(u.id, { active: !u.active })}>
                    {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <ResetPasswordForm userName={u.name} onSubmit={(password) => onUpdate(u.id, { password })} />
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
