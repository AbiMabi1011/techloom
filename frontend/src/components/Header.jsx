import { useState, useRef, useEffect } from 'react';

export default function Header({
  view,
  onNavigate,
  search,
  onSearch,
  cartCount,
  onOpenProfile,
  ordersCount = 0,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Retrieve saved profile name/avatar
  const savedProfile = (() => {
    try {
      const data = localStorage.getItem('techloom_profile_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  const userName = savedProfile?.name || 'Alex Vance';
  const userAvatar =
    savedProfile?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onNavigate('shop')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] font-black text-slate-950 text-lg">
            ⚡
          </div>
          <div>
            <span className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TECHLOOM
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
              STORE
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products, gear, audio, home..."
            className="w-full bg-[#151B26] border border-white/10 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-full transition-all shadow-inner"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-3 text-xs font-medium">
          <button
            onClick={() => onNavigate('shop')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              view === 'shop'
                ? 'bg-white/10 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Catalog
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              view === 'orders'
                ? 'bg-white/10 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Orders</span>
            {ordersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-slate-300">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Admin Console Switcher */}
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border ${
              view === 'admin'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 border-white/10 text-amber-300 hover:text-white hover:bg-white/10 hover:border-amber-400/40'
            }`}
            title="Open Admin Console"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Cart Pill */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative px-4 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              view === 'cart'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'bg-[#151B26] border-white/10 text-slate-200 hover:border-white/20 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile Section with Dropdown & Settings Trigger */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-full bg-[#151B26] hover:bg-[#1A2230] border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer shadow-sm group"
            >
              <img
                src={userAvatar}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
              />
              <span className="hidden md:inline font-semibold text-white max-w-[100px] truncate text-xs">
                {userName.split(' ')[0]}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-2 z-50 animate-slide-up bg-[#101520]">
                {/* Header info */}
                <div className="p-3 border-b border-white/10 flex items-center gap-3">
                  <img
                    src={userAvatar}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{userName}</div>
                    <div className="text-[10px] text-amber-400 font-medium">Pro Shopper Account</div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-left text-slate-200 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span>⚙️</span>
                      <span>Account Settings</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">⌘S</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('orders');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-left text-slate-200 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span>📦</span>
                      <span>My Orders &amp; Receipts</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {ordersCount}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('cart');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-left text-slate-200 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span>🛒</span>
                      <span>Active Shopping Cart</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold">{cartCount} items</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-left text-amber-300 hover:text-amber-200 hover:bg-amber-400/10 flex items-center justify-between transition-colors font-bold"
                  >
                    <span className="flex items-center gap-2.5">
                      <span>⚡</span>
                      <span>Admin Management Console</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400">
                      PRO
                    </span>
                  </button>
                </div>

                {/* Footer action */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-left text-amber-300 hover:bg-amber-400/10 flex items-center gap-2 font-semibold transition-colors"
                  >
                    <span>🛡️</span>
                    <span>Manage Security &amp; Sessions</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

      </div>
    </header>
  );
}
