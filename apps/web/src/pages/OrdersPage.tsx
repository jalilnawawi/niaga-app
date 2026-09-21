import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Me, Order } from '@niaga/shared';
import { voidOrderSchema } from '@niaga/shared';
import { errorMessage } from '../api/error-message';
import { listTodayOrders, voidOrder } from '../api/order.api';
import { OrderList } from '../components/order/OrderList';
import { Receipt } from '../components/order/Receipt';
import { rupiah } from '../components/ui/rupiah';
import { useAction } from '../hooks/use-action';

type Props = { me: Me };

export function OrdersPage({ me }: Props) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [shown, setShown] = useState<Order | null>(null);
  const { error, notice, setError, run } = useAction();

  useEffect(() => {
    listTodayOrders()
      .then(setOrders)
      .catch((e: unknown) => setError(errorMessage(e)));
  }, [setError]);

  function voidIt(order: Order) {
    const reason = window.prompt(`Alasan void struk #${order.number}?`);
    if (reason === null) return;
    run(async () => {
      const updated = await voidOrder(order.id, voidOrderSchema.parse({ reason }));
      setOrders((prev) => prev?.map((o) => (o.id === updated.id ? updated : o)) ?? null);
      setShown((prev) => (prev?.id === updated.id ? updated : prev));
    }, `Struk #${order.number} di-void.`);
  }

  const paid = orders?.filter((o) => o.status === 'paid') ?? [];

  return (
    <main>
      <p>
        <Link to="/">← Beranda</Link> · <Link to="/jual">Kasir</Link>
      </p>
      <h1>Transaksi hari ini</h1>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {orders === null && !error && <p>Loading…</p>}
      {orders?.length === 0 && <p>Belum ada transaksi hari ini.</p>}
      {orders && orders.length > 0 && (
        <>
          <p>
            {paid.length} transaksi lunas · {rupiah.format(paid.reduce((sum, o) => sum + o.total, 0))}
          </p>
          <OrderList orders={orders} onShow={setShown} onVoid={me.role === 'owner' ? voidIt : undefined} />
        </>
      )}
      {shown && (
        <>
          <Receipt order={shown} tenantName={me.tenant.name} />
          <button type="button" onClick={() => window.print()}>
            Cetak struk
          </button>
        </>
      )}
    </main>
  );
}
