export default function ProductCard({
  product,
  onAdd,
  onQuickView,
  isFavorite = false,
  onToggleFavorite,
  viewMode = 'grid',
}) {
  const out = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  // Render List View
  if (viewMode === 'list') {
    return (
      <div className="group glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-amber-400/40 hover:shadow-[0_15px_40px_rgba(245,158,11,0.12)] transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 relative">
        {/* Image */}
        <div
          className="w-full sm:w-44 h-44 rounded-xl bg-slate-900 overflow-hidden relative shrink-0 cursor-pointer"
          onClick={() => onQuickView && onQuickView(product)}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-display text-4xl text-slate-700">
              {product.name.charAt(0)}
            </div>
          )}

          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
            {product.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {out ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                In Stock ({product.stock})
              </span>
            )}
            <span className="text-xs text-amber-400 font-semibold">★ 4.9 (120+ reviews)</span>
          </div>

          <h3
            className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer"
            onClick={() => onQuickView && onQuickView(product)}
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed max-w-xl">
            {product.description || 'Precision crafted with top-tier materials, guaranteed atomic 5-min checkout reservation.'}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">⚡ <span>Instant ACID hold</span></span>
            <span className="flex items-center gap-1">📦 <span>Free delivery</span></span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="sm:border-l border-white/10 sm:pl-6 text-center sm:text-right flex flex-col items-center sm:items-end justify-center shrink-0 space-y-3">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Current Price</span>
            <span className="text-2xl font-display font-extrabold text-white">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Save to Wishlist"
            >
              {isFavorite ? '♥' : '♡'}
            </button>

            <button
              onClick={() => onQuickView && onQuickView(product)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-all"
            >
              Quick View
            </button>

            <button
              disabled={out}
              onClick={() => onAdd(product)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                out
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
              }`}
            >
              {out ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Grid View
  return (
    <div className="group glass-panel rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_15px_40px_rgba(245,158,11,0.14)] hover:-translate-y-1.5 relative">
      {/* Image container with subtle zoom effect */}
      <div
        className="aspect-[4/3] sm:aspect-square bg-slate-900/80 overflow-hidden relative flex items-center justify-center cursor-pointer"
        onClick={() => onQuickView && onQuickView(product)}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800 text-slate-600 font-display text-5xl font-bold">
            {product.name.charAt(0)}
          </div>
        )}

        {/* Hover Quick View Overlay Pill */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-4 py-2 rounded-xl bg-white/95 text-slate-950 font-bold text-xs shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Quick View
          </span>
        </div>

        {/* Top Floating Badges: Category & Wishlist */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
            {product.category}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite && onToggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        {/* Bottom Stock status badge inside image */}
        <div className="absolute bottom-3 left-3">
          {out ? (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-rose-500/90 text-white shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold backdrop-blur-md">
              ⚡ Only {product.stock} left
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-emerald-300 backdrop-blur-md">
              In Stock ({product.stock})
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span>★</span>
              <span>4.9</span>
            </span>
            <span className="text-[11px] text-slate-400">Guaranteed 5m Lock</span>
          </div>

          <h3
            className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
            onClick={() => onQuickView && onQuickView(product)}
          >
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description || 'Premium craftsmanship with high-grade components.'}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Price</span>
            <span className="text-xl font-display font-black text-white">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            disabled={out}
            onClick={() => onAdd(product)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
              out
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-white text-slate-950 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 hover:text-slate-950 shadow-md'
            }`}
          >
            {out ? (
              'Sold Out'
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
