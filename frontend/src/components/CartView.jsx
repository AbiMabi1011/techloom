import { useState, useEffect } from 'react';

export default function CartView({ cart, onUpdateQty, onRemove, onCheckout, busy, checkoutOrder, onPay }) {
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  // Countdown timer for RESERVED state (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (checkoutOrder?.status === 'RESERVED') {
      const expiresAt = checkoutOrder.reservationExpiresAt
        ? new Date(checkoutOrder.reservationExpiresAt).getTime()
        : Date.now() + 300000;

      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [checkoutOrder]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Render Checkout / Payment Simulation View
  if (checkoutOrder) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Header banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Order Verification</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                Order #{checkoutOrder.id}
              </h2>
            </div>

            {/* Status indicator badge */}
            <div>
              {checkoutOrder.status === 'RESERVED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  STOCK RESERVED
                </span>
              )}
              {checkoutOrder.status === 'PAID' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ✓ PAID &amp; CONFIRMED
                </span>
              )}
              {checkoutOrder.status === 'FAILED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  ✕ FAILED
                </span>
              )}
              {checkoutOrder.status === 'EXPIRED' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  ⏱ EXPIRED
                </span>
              )}
            </div>
          </div>

          {/* Reserved countdown alert */}
          {checkoutOrder.status === 'RESERVED' && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-300 text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⏳</span>
                <div>
                  <div className="font-semibold text-white">Stock Lock Active</div>
                  <div className="text-xs text-amber-200/80">Inventory reserved exclusively for this session.</div>
                </div>
              </div>
              <div className="font-mono text-base font-bold bg-black/40 px-3 py-1 rounded-lg border border-amber-500/30">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            </div>
          )}

          {/* Order Details list */}
          <div className="mt-6 divide-y divide-white/5">
            <div className="py-3 flex justify-between text-sm">
              <span className="text-slate-400">Total Charged</span>
              <span className="font-display font-bold text-white text-lg">
                ${Number(checkoutOrder.totalAmount).toFixed(2)}
              </span>
            </div>
            <div className="py-3 flex justify-between text-sm">
              <span className="text-slate-400">Idempotency Key</span>
              <span className="font-mono text-xs text-slate-300 truncate max-w-xs">{checkoutOrder.idempotencyKey}</span>
            </div>
          </div>

          {/* Simulation Gateway Action Buttons */}
          {checkoutOrder.status === 'RESERVED' && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Mock Gateway Payment Simulation
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  disabled={busy}
                  onClick={() => onPay('SUCCESS')}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-glow transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <span>✓ Authorize Success</span>
                </button>

                <button
                  disabled={busy}
                  onClick={() => onPay('FAILURE')}
                  className="px-4 py-3 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <span>✕ Simulate Decline</span>
                </button>

                <button
                  disabled={busy}
                  onClick={() => onPay('TIMEOUT')}
                  className="px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <span>⏱ Simulate Timeout</span>
                </button>
              </div>

              {/* Idempotency Test Helper Button */}
              <div className="mt-3 flex justify-center">
                <button
                  disabled={busy}
                  onClick={() => onPay('DUPLICATE')}
                  className="text-xs px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2"
                >
                  <span>🛡️ Test Duplicate Attempt (Re-send Same Attempt Key)</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-3 text-center">
                All requests carry an atomic transaction lock. Duplicate attempts return cached result idempotently without double-charging or overselling.
              </p>
            </div>
          )}

          {/* Confirmation messages */}
          {checkoutOrder.status === 'PAID' && (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-slide-up">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ✓
              </div>
              <h4 className="text-lg font-bold text-white">Payment Received Successfully</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your order is confirmed and locked in inventory. You can track or request refunds under Orders.
              </p>
            </div>
          )}

          {checkoutOrder.status === 'FAILED' && (
            <div className="mt-8 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center animate-slide-up">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ✕
              </div>
              <h4 className="text-lg font-bold text-white">Transaction Declined</h4>
              <p className="text-xs text-slate-300 mt-1">
                Stock reservation was automatically released back into inventory. No charges were made.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Cart View
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-white">Your Shopping Cart</h2>
          <p className="text-xs text-slate-400 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} selected
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Discover our curated inventory and add items to your cart.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1.8fr_1fr] gap-8">
          {/* Cart items list */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-3 sm:p-5 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Thumb */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-slate-600">{item.product.name.charAt(0)}</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-[140px] sm:min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{item.product.name}</h4>
                  <span className="text-[11px] sm:text-xs text-slate-400">${Number(item.product.price).toFixed(2)} each</span>
                </div>

                {/* Stepper & Total on Mobile */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Stepper */}
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQty(item.productId, Math.max(0, item.quantity - 1))}
                      className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 sm:w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                      className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Item total */}
                  <div className="text-right min-w-[60px] sm:min-w-[70px]">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemove(item.productId)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout summary card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 h-fit space-y-5">
            <h3 className="font-display text-lg font-bold text-white pb-3 border-b border-white/10">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-white font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Atomic Reservation</span>
                <span className="text-accent-emerald font-semibold">FREE (5m Lock)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="font-display text-2xl font-extrabold text-white">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              disabled={busy || items.length === 0}
              onClick={onCheckout}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-glow-indigo transition-all transform active:scale-95 disabled:opacity-40"
            >
              {busy ? 'Reserving Inventory...' : 'Reserve & Checkout Now'}
            </button>

            <div className="text-[11px] text-slate-500 text-center leading-tight">
              🔒 Locks stock instantaneously via ACID conditional-write transactions.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
