import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  allProducts = [],
  loading,
  onAdd,
  category,
  onCategory,
  categories = [],
  onQuickView,
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [stockOnly, setStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [maxPrice, setMaxPrice] = useState(300);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('techloom_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('techloom_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // Base list for computing category counts and totals
  const masterList = allProducts.length > 0 ? allProducts : products;

  // Master list of unique categories so ALL categories always appear
  const masterCategories = useMemo(() => {
    const fromMaster = [...new Set(masterList.map((p) => p.category))].filter(Boolean);
    return fromMaster.length > 0 ? fromMaster : categories;
  }, [masterList, categories]);

  // Advanced Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // In-Stock Filter
    if (stockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Max Price Filter
    list = list.filter((p) => Number(p.price) <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'stock') {
      list.sort((a, b) => b.stock - a.stock);
    }

    return list;
  }, [products, sortBy, stockOnly, maxPrice]);

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <h2 className="text-xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Curated Catalog
            </h2>
            <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono font-bold">
              {filteredProducts.length} Products
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time atomic reservation enabled. Stock holds lock instantly upon checkout.
          </p>
        </div>

        {/* Controls Toolbar: View Switcher, Stock Filter, Price Slider & Sort */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
          
          {/* Grid vs List View Switcher */}
          <div className="flex items-center bg-[#151B26] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* In-Stock Toggle */}
          <button
            onClick={() => setStockOnly(!stockOnly)}
            className={`text-xs px-3 sm:px-3.5 py-2 rounded-xl border flex items-center gap-1.5 sm:gap-2 transition-all ${
              stockOnly
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${stockOnly ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
            <span className="hidden sm:inline">In-Stock Only</span>
            <span className="sm:hidden">In-Stock</span>
          </button>

          {/* Price Range Slider Quick Filter */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#151B26] border border-white/10 text-xs text-slate-300">
            <span>Max: <strong className="text-amber-400 font-mono">${maxPrice}</strong></span>
            <input
              type="range"
              min="30"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-16 sm:w-20 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#151B26] border border-white/10 text-xs text-slate-200 py-2 pl-2.5 sm:pl-3 pr-7 sm:pr-8 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer appearance-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Stock Availability</option>
              <option value="name">Alphabetical</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-4 mb-8">
        <button
          onClick={() => onCategory('')}
          className={`text-xs px-4 py-2 rounded-xl border transition-all shrink-0 font-medium ${
            category === ''
              ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
          }`}
        >
          All Categories ({masterList.length})
        </button>
        {masterCategories.map((c) => {
          const count = masterList.filter((p) => p.category === c).length;
          return (
            <button
              key={c}
              onClick={() => onCategory(c)}
              className={`text-xs px-4 py-2 rounded-xl border transition-all shrink-0 font-medium flex items-center gap-1.5 ${
                category === c
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{c}</span>
              <span className="text-[10px] opacity-80 font-mono font-bold">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-white/5 rounded-2xl border border-white/5"></div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="glass-panel p-16 text-center rounded-3xl border border-white/10 my-8 animate-fade-in">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-white">No products match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your maximum price slider, category filters, or toggle off 'In-Stock Only'.
          </p>
          <button
            onClick={() => {
              onCategory('');
              setStockOnly(false);
              setMaxPrice(300);
            }}
            className="mt-4 px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Product Display Container: Grid or List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in'
            : 'space-y-4 animate-fade-in'
        }
      >
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={onAdd}
            onQuickView={onQuickView}
            isFavorite={favorites.includes(p.id)}
            onToggleFavorite={toggleFavorite}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
