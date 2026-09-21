import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { CreateOrder, Me, Order, Product } from '@niaga/shared';
import { createOrderSchema } from '@niaga/shared';
import { listProducts } from '../api/catalog.api';
import { errorMessage } from '../api/error-message';
import { createOrder } from '../api/order.api';
import { getCurrentShift } from '../api/shift.api';
import { Cart } from '../components/order/Cart';
import { PaymentForm } from '../components/order/PaymentForm';
import { ProductGrid } from '../components/order/ProductGrid';
import { Receipt } from '../components/order/Receipt';
import { useAction } from '../hooks/use-action';
import type { CartLine } from '../types/cart';

type Props = { me: Me };

export function PosPage({ me }: Props) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [hasShift, setHasShift] = useState<boolean | null>(null);
  const { error, setError, run } = useAction();

  useEffect(() => {
    getCurrentShift()
      .then((shift) => setHasShift(shift !== null))
      .catch((e: unknown) => setError(errorMessage(e)));
    listProducts()
      .then((all) => setProducts(all.filter((p) => p.active)))
      .catch((e: unknown) => setError(errorMessage(e)));
  }, [setError]);

  const setQty = (productId: string, qty: number) =>
    setCart((prev) => (qty <= 0 ? prev.filter((l) => l.product.id !== productId) : prev.map((l) => (l.product.id === productId ? { ...l, qty } : l))));

  function add(product: Product) {
    setReceipt(null);
    const line = cart.find((l) => l.product.id === product.id);
    if (line) setQty(product.id, Math.min(line.qty + 1, 999));
    else setCart((prev) => [...prev, { product, qty: 1 }]);
  }

  const total = cart.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  const pay = (payment: CreateOrder['payment']) =>
    run(async () => {
      const items = cart.map((l) => ({ productId: l.product.id, qty: l.qty }));
      setReceipt(await createOrder(createOrderSchema.parse({ items, payment })));
      setCart([]);
    }, 'Transaksi tersimpan.');

  return (
    <main>
      <p>
        <Link to="/">← Beranda</Link> · <Link to="/shift">Shift</Link> · <Link to="/riwayat">Riwayat hari ini</Link>
      </p>
      <h1>Kasir</h1>
      {error && <p role="alert">{error}</p>}
      {hasShift === false && (
        <p role="alert">
          Belum ada shift yang dibuka. <Link to="/shift">Buka shift</Link> sebelum berjualan.
        </p>
      )}
      {products === null && !error && <p>Loading…</p>}
      {products && <ProductGrid products={products} onAdd={add} />}
      <section aria-labelledby="cart-heading">
        <h2 id="cart-heading">Keranjang</h2>
        <Cart lines={cart} onQty={setQty} />
        {cart.length > 0 && <PaymentForm total={total} onPay={pay} />}
      </section>
      {receipt && (
        <>
          <Receipt order={receipt} tenantName={me.tenant.name} />
          <button type="button" onClick={() => window.print()}>
            Cetak struk
          </button>
        </>
      )}
    </main>
  );
}
