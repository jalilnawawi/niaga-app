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
import { rupiah } from '../components/ui/rupiah';
import { useAction } from '../hooks/use-action';
import type { CartLine } from '../types/cart';

type Props = { me: Me };

export function PosPage({ me }: Props) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [receipt, setReceipt] = useState<Order | null>(null);
  const [hasShift, setHasShift] = useState<boolean | null>(null);
  // Phone only: the cart sheet. Tablet always shows the cart column.
  const [cartOpen, setCartOpen] = useState(false);
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
    // Functional update: two quick taps before a re-render must still add 2, not two lines of 1.
    setCart((prev) =>
      prev.some((l) => l.product.id === product.id)
        ? prev.map((l) => (l.product.id === product.id ? { ...l, qty: Math.min(l.qty + 1, 999) } : l))
        : [...prev, { product, qty: 1 }],
    );
  }

  const total = cart.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const count = cart.reduce((sum, l) => sum + l.qty, 0);
  const qtyOf = (productId: string) => cart.find((l) => l.product.id === productId)?.qty ?? 0;

  const pay = (payment: CreateOrder['payment']) =>
    run(async () => {
      const items = cart.map((l) => ({ productId: l.product.id, qty: l.qty }));
      setReceipt(await createOrder(createOrderSchema.parse({ items, payment })));
      setCart([]);
    }, 'Transaksi tersimpan.');

  return (
    <main className="pos">
      <section className="pos-products" aria-labelledby="pos-heading">
        <h1 id="pos-heading">Jual</h1>
        {error && <p role="alert">{error}</p>}
        {hasShift === false && (
          <p role="alert">
            Belum ada shift yang dibuka.
            <br />
            <Link to="/shift" className="button primary">
              Buka shift
            </Link>
          </p>
        )}
        {products === null && !error && <p>Memuat produk…</p>}
        {products?.length === 0 && (
          <p>
            Belum ada produk aktif.{' '}
            {me.role === 'owner' ? <Link to="/katalog">Tambah produk di Katalog</Link> : 'Minta owner menambah produk.'}
          </p>
        )}
        {products && <ProductGrid products={products} qtyOf={qtyOf} onAdd={add} />}
      </section>
      {(cart.length > 0 || receipt) && (
        <button type="button" className="cart-bar" onClick={() => setCartOpen(true)}>
          {cart.length > 0 ? `${count} item` : 'Struk'}
          <span>{rupiah.format(total)}</span>
        </button>
      )}
      <aside className="pos-cart" data-open={cartOpen} aria-labelledby="cart-heading">
        <header>
          <h2 id="cart-heading">Keranjang</h2>
          <button type="button" className="sheet-close" onClick={() => setCartOpen(false)}>
            Tutup
          </button>
        </header>
        {error && cartOpen && <p role="alert">{error}</p>}
        <Cart lines={cart} onQty={setQty} />
        {cart.length > 0 && <PaymentForm total={total} onPay={pay} />}
        {receipt && (
          <>
            <Receipt order={receipt} tenantName={me.tenant.name} />
            <button type="button" className="primary" onClick={() => window.print()}>
              Cetak struk
            </button>
          </>
        )}
      </aside>
    </main>
  );
}
