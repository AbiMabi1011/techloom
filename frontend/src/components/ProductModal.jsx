export default function ProductModal({ product, isOpen, onClose, onAdd }) {
  if (!isOpen || !product) return null;

  const out = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 animate-slide-up flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
          ✕
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 h-56 sm:h-72 md:h-auto bg-slate-950 relative overflow-hidden flex items-center justify-center shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <span className="font-display text-7xl font-bold text-slate-700">{product.name.charAt(0)}</span>
          )}

          <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
            {product.category}
          </span>
        </div>

        {/* Content Column */}
        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between space-y-4 sm:space-y-6 overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {out ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ⚡ High Demand: Only {product.stock} units left
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ✓ In Stock ({product.stock} available)
                </span>
              )}
            </div>

            <h2 className="text-2xl font-display font-extrabold text-white tracking-tight leading-snug">
              {product.name}
            </h2>

            <div className="text-3xl font-display font-black text-amber-400">
              ${Number(product.price).toFixed(2)}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/5">
              {product.description ||
                'Meticulously crafted with premium architectural materials and tested to meet high standards of quality and durability.'}
            </p>

            {/* Feature Checklist */}
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Atomic 5-minute checkout reservation guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Complimentary express insured delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Idempotent 1-click automated refund eligible</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-3">
            <button
              disabled={out}
              onClick={() => {
                onAdd(product);
                onClose();
              }}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                out
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-[0_10px_25px_rgba(245,158,11,0.3)]'
              }`}
            >
              {out ? (
                'Unavailable'
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Add To Cart • ${Number(product.price).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
