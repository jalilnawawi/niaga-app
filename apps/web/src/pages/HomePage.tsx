import type { Me } from '@niaga/shared';

type Props = { me: Me; onLogout: () => void };

export function HomePage({ me, onLogout }: Props) {
  return (
    <main>
      <h1>Niaga</h1>
      <p>
        {me.name} ({me.role}) · {me.tenant.name}
      </p>
      <button onClick={onLogout}>Logout</button>
    </main>
  );
}
