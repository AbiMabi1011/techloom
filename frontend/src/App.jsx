import { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import ProfileModal from './components/ProfileModal';
import AdminPanel from './components/AdminPanel';
import CartView from './components/CartView';
import OrderHistory from './components/OrderHistory';
import { api } from './api';
import { getCustomerId } from './customerId';

function makeKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const customerId = getCustomerId();

  const [view, setView] = useState('shop');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const handleResetSession = () => {
    localStorage.removeItem('techloom_customer_id');
    localStorage.removeItem('techloom_profile_data');
    window.location.reload();
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Derive master categories from allProducts so all options remain visible
  const categories = [...new Set(allProducts.map((p) => p.category))].filter(Boolean);

  // Load the full master catalog once (or after mutations) to preserve categories & category counts
  const loadMasterCatalog = useCallback(async () => {
    try {
      const fullList = await api.getProducts({});
      setAllProducts(fullList);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await api.getProducts({ search, category });
      setProducts(data);
      // If we don't have allProducts yet or neither filter is active, sync master list
      if (!search && !category) {
        setAllProducts(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [search, category]);

  useEffect(() => {
    loadMasterCatalog();
  }, [loadMasterCatalog]);

  const loadCart = useCallback(async () => {
    try {
      const data = await api.getCart(customerId);
      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  }, [customerId]);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getOrderHistory(customerId);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  }, [customerId]);

  useEffect(() => {
    const t = setTimeout(loadProducts, 200);
    return () => clearTimeout(t);
  }, [loadProducts]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (view === 'orders') loadOrders();
  }, [view, loadOrders]);

  const handleAdd = async (product) => {
    setError(null);
    try {
      const updated = await api.addToCart(customerId, product.id, 1);
      setCart(updated);
      showToast(`Added "${product.name}" to cart!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateQty = async (productId, quantity) => {
    setError(null);
    try {
      const updated = await api.updateCartItem(customerId, productId, quantity);
      setCart(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (productId) => {
    setError(null);
    try {
      const updated = await api.removeCartItem(customerId, productId);
      setCart(updated);
      showToast('Item removed from cart', 'info');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    setBusy(true);
    setError(null);
    try {
      const order = await api.checkout(customerId, makeKey());
      setCheckoutOrder(order);
      showToast(`Order #${order.id} reserved for 5 minutes!`, 'success');
      loadCart();
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const [lastPaymentKey, setLastPaymentKey] = useState(null);

  const handlePay = async (forceOutcome) => {
    setBusy(true);
    setError(null);
    try {
      let key = makeKey();

      if (forceOutcome === 'DUPLICATE') {
        if (!lastPaymentKey) {
          showToast('Please run an initial payment attempt first before testing duplicate idempotency.', 'info');
          setBusy(false);
          return;
        }
        key = lastPaymentKey; // Reuse previous attempt key
      } else {
        setLastPaymentKey(key);
      }

      const result = await api.pay(checkoutOrder.id, key, forceOutcome === 'DUPLICATE' ? undefined : forceOutcome);
      
      if (forceOutcome === 'DUPLICATE') {
        showToast('Idempotency verified: Re-sent attempt key was recognized without duplicate charge.', 'info');
        setBusy(false);
        return;
      }

      if (result.order) {
        setCheckoutOrder(result.order);
        if (result.order.status === 'PAID') {
          showToast('Payment successful! Order confirmed.', 'success');
        } else if (result.order.status === 'FAILED') {
          showToast('Payment declined. Stock released.', 'error');
        } else {
          showToast('Reservation expired / timed out.', 'error');
        }
      }
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleCancelOrder = async (id) => {
    setBusy(true);
    try {
      await api.cancelOrder(id);
      showToast(`Order #${id} cancelled. Stock restored.`, 'info');
      loadOrders();
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRefundOrder = async (id) => {
    setBusy(true);
    try {
      await api.refundOrder(id);
      showToast(`Order #${id} successfully refunded!`, 'success');
      loadOrders();
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const navigate = (next) => {
    if (next === 'shop') setCheckoutOrder(null);
    setView(next);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const cartCount = (cart?.items || []).reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className={`min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-accent-indigo selection:text-white ${view === 'admin' ? '' : 'pb-20'}`}>
      {/* Only show storefront Header when NOT in Admin Panel */}
      {view !== 'admin' && (
        <Header
          view={view}
          onNavigate={navigate}
          search={search}
          onSearch={setSearch}
          cartCount={cartCount}
          ordersCount={orders.length}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {/* Floating Interactive Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-200'
            }`}
          >
            <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4 animate-fade-in">
          <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm px-5 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-xs text-rose-400 hover:text-white">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Views */}
      <main>
        {view === 'shop' && (
          <>
            <Hero
              onExplore={scrollToCatalog}
              onCategorySelect={setCategory}
              categories={categories}
              products={allProducts.length > 0 ? allProducts : products}
            />
            <ProductGrid
              products={products}
              allProducts={allProducts}
              loading={loadingProducts}
              onAdd={handleAdd}
              category={category}
              onCategory={setCategory}
              categories={categories}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          </>
        )}

        {/* Product Quick View Modal */}
        <ProductModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          onAdd={handleAdd}
        />

        {/* Profile & Professional Settings Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          customerId={customerId}
          ordersCount={orders.length}
          onResetSession={handleResetSession}
        />

        {view === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
            onCheckout={handleCheckout}
            busy={busy}
            checkoutOrder={checkoutOrder}
            onPay={handlePay}
          />
        )}

        {view === 'orders' && (
          <OrderHistory
            orders={orders}
            loading={loadingOrders}
            onCancel={handleCancelOrder}
            onRefund={handleRefundOrder}
            busy={busy}
          />
        )}

        {view === 'admin' && (
          <AdminPanel
            onNavigate={navigate}
            onProductsChange={() => {
              loadMasterCatalog();
              loadProducts();
            }}
          />
        )}
      </main>
    </div>
  );
}
