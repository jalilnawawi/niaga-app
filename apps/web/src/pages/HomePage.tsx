import { Link } from 'react-router';
import type { Me } from '@niaga/shared';

type Props = { me: Me; onLogout: () => void };

export function HomePage({ me, onLogout }: Props) {
  return (
    <main>
      <h1>Niaga</h1>
      <p>
        {me.name} ({me.role}) · {me.tenant.name}
      </p>
      {me.role === 'owner' && (
        <nav>
          <Link to="/kasir">Kelola kasir</Link>
        </nav>
      )}
      <button onClick={onLogout}>Logout</button>
    </main>
  );
}
