const STATUS_BADGE = {
  PENDING: {
    label: 'Pending',
    classes: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  },
  RESERVED: {
    label: 'Stock Reserved',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  PAID: {
    label: 'Paid & Confirmed',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-glow',
  },
  CANCELLED: {
    label: 'Cancelled',
    classes: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  },
  EXPIRED: {
    label: 'Hold Expired',
    classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  FAILED: {
    label: 'Payment Failed',
    classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  REFUNDED: {
    label: 'Refunded',
    classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
};

export default function OrderHistory({ orders, loading, onCancel, onRefund, busy }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-white">Order History &amp; Audits</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time state transitions, idempotency records, and instant refunds.
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="glass-panel p-16 text-center rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
            📦
          </div>
          <h3 className="text-lg font-bold text-white">No orders recorded yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Once you reserve inventory or complete a transaction, your orders will appear here.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const badge = STATUS_BADGE[order.status] || STATUS_BADGE.PENDING;
          return (
            <div
              key={order.id}
              className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-white text-base">
                    Order #{order.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.classes}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                      <span>{item.product?.name || `Product #${item.productId}`}</span>
                    </div>
                    <span className="font-mono text-slate-400">
                      ${Number(item.priceAtOrder || item.product?.price || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer details and actions */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-semibold block">Total Amount</span>
                  <span className="text-lg font-display font-extrabold text-white">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {['PENDING', 'RESERVED'].includes(order.status) && (
                    <button
                      disabled={busy}
                      onClick={() => onCancel(order.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all active:scale-95 disabled:opacity-40"
                    >
                      Cancel &amp; Release Stock
                    </button>
                  )}

                  {order.status === 'PAID' && (
                    <button
                      disabled={busy}
                      onClick={() => onRefund(order.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 transition-all active:scale-95 disabled:opacity-40"
                    >
                      ↩ Request Reversal &amp; Refund
                    </button>
                  )}

                  {order.status === 'REFUNDED' && (
                    <span className="text-xs text-slate-400 font-mono">
                      Refunded on {new Date(order.refundedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
