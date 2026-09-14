import { useState, useEffect } from 'react';

const SLIDES = [
  {
    id: 1,
    tag: 'ULTRA-PREMIUM TECH HARDWARE',
    titleMain: 'Engineered Precision.',
    titleAccent: 'Built for Performance.',
    accentGradient: 'from-cyan-200 via-teal-300 to-emerald-200',
    desc: 'CNC-machined mechanical keyboards, sub-1ms wireless gaming mice, and studio audio drivers engineered for high-performance setups.',
    image: '/hero-workspace.jpg',
    cta: 'Shop Peripherals & Gear',
    badge: '100% In-Stock Verified',
    promoCode: 'TECH26',
    discount: 'Free Express Delivery',
  },
  {
    id: 2,
    tag: 'CYBERNETIC AUDIO & WEARABLES',
    titleMain: 'Lossless Fidelity.',
    titleAccent: 'Zero Latency.',
    accentGradient: 'from-amber-200 via-amber-400 to-amber-100',
    desc: 'Audiophile active noise-cancelling planar magnetic headphones, titanium smartwatches, and spatial true-wireless audio.',
    image: '/hero-gadgets.jpg',
    cta: 'Explore Audio & Wearables',
    badge: 'Limited Stock Available',
    promoCode: 'STUDIO',
    discount: 'Instant 5m Reservation Lock',
  },
  {
    id: 3,
    tag: 'HIGH-SPEED CHARGING & DOCKS',
    titleMain: 'Thunderbolt 4.',
    titleAccent: 'Fast Power Delivery.',
    accentGradient: 'from-indigo-200 via-accent-cyan to-accent-emerald',
    desc: '12-Port 40Gbps Thunderbolt expansion stations, 3-in-1 magnetic wireless chargers, and asymmetric monitor lightbars.',
    image: '/ecommerce-hero.jpg',
    cta: 'Discover Tech Accessories',
    badge: 'Enterprise Grade',
    promoCode: 'POWERUP',
    discount: 'Complimentary Insured Shipping',
  },
];

export default function Hero({ onExplore, onCategorySelect, categories = [], products = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Derive dynamic slides from real database products
  const dynamicSlides = products.length > 0
    ? products.slice(0, 5).map((prod, i) => {
        const promoCodes = ['TECH26', 'STUDIO', 'POWERUP', 'PRO2026', 'SPEED'];
        const taglines = [
          'ULTRA-PREMIUM TECH HARDWARE',
          'STUDIO GRADE FIDELITY',
          'TITANIUM WEARABLE PERFORMANCE',
          'RAPID DOCKING & POWER',
          'WORKSTATION ILLUMINATION',
        ];
        const gradients = [
          'from-cyan-200 via-teal-300 to-emerald-200',
          'from-amber-200 via-amber-400 to-amber-100',
          'from-indigo-200 via-accent-cyan to-accent-emerald',
          'from-purple-200 via-pink-300 to-rose-200',
          'from-amber-200 via-orange-300 to-yellow-200',
        ];

        return {
          id: prod.id,
          tag: taglines[i % taglines.length],
          titleMain: prod.name.split(' ').slice(0, 2).join(' ') + '.',
          titleAccent: prod.name.split(' ').slice(2).join(' ') || 'Engineered Precision.',
          accentGradient: gradients[i % gradients.length],
          desc: prod.description || 'Precision engineered hardware with conditional stock reservation lock and atomic consistency.',
          image: prod.imageUrl || SLIDES[i % SLIDES.length].image,
          cta: `Shop ${prod.category} — $${Number(prod.price).toFixed(2)}`,
          badge: prod.stock > 0 ? `${prod.stock} Units In Stock` : 'Backorder Available',
          promoCode: promoCodes[i % promoCodes.length],
          discount: `$${Number(prod.price).toFixed(2)} • In Stock`,
          category: prod.category,
        };
      })
    : SLIDES;

  // Use database categories if available, fallback gracefully
  const displayCategories = categories.length > 0
    ? categories
    : ['Peripherals', 'Audio', 'Wearables', 'Accessories', 'Workspace'];

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoplay, dynamicSlides.length]);

  const slide = dynamicSlides[currentSlide] || dynamicSlides[0] || SLIDES[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0F1420] via-[#0B0F17] to-[#0B0F17] border-b border-white/10">
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-accent-indigo/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16 lg:pt-10 lg:pb-20 relative z-10">
        
        {/* Main Banner Interactive Carousel */}
        <div 
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] bg-[#121722]"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Slide Background Image with Smooth Crossfade */}
          <div className="relative min-h-[500px] lg:min-h-[550px] flex items-center">
            {dynamicSlides.map((s, idx) => (
              <img
                key={s.id}
                src={s.image}
                alt={s.titleMain}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
                  idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
              />
            ))}

            {/* Gradient Scrims for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/95 via-[#070A0F]/85 md:via-[#070A0F]/75 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-transparent to-[#070A0F]/30"></div>

            {/* Slide Text Content */}
            <div className="relative z-10 max-w-2xl p-8 sm:p-12 lg:p-16 space-y-6">
              
              {/* Promotional Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/15 bg-black/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold tracking-wider uppercase text-slate-200">
                  {slide.tag}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-amber-300 font-semibold">{slide.discount}</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                {slide.titleMain} <br />
                <span className={`bg-gradient-to-r ${slide.accentGradient} bg-clip-text text-transparent`}>
                  {slide.titleAccent}
                </span>
              </h1>

              {/* Sub-copy */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
                {slide.desc}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    if (slide.category && onCategorySelect) {
                      onCategorySelect(slide.category);
                    }
                    if (onExplore) onExplore();
                  }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <span>{slide.cta}</span>
                  <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-white text-xs font-medium">
                  <span className="text-amber-400 font-mono font-bold text-xs px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    CODE: {slide.promoCode}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-300">5-Min Stock Lock Guarantee</span>
                </div>
              </div>
            </div>

            {/* Floating Top Right Tag */}
            <div className="hidden sm:flex absolute top-8 right-8 backdrop-blur-xl bg-black/70 border border-white/15 px-4 py-2.5 rounded-2xl items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                ✓
              </div>
              <div className="text-left">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Real-Time Inventory</div>
                <div className="text-xs font-bold text-white">{slide.badge}</div>
              </div>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length)}
                className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center transition-all backdrop-blur-md active:scale-95"
                title="Previous banner"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length)}
                className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center transition-all backdrop-blur-md active:scale-95"
                title="Next banner"
              >
                →
              </button>
            </div>

            {/* Slide Indicators / Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {dynamicSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

        {/* Featured Category Quick-Filter Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trending Categories:</span>
            <div className="flex flex-wrap items-center gap-2">
              {displayCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect && onCategorySelect(cat)}
                  className="text-xs px-3.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-slate-300 hover:text-white transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div 
            className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold cursor-pointer hover:underline"
            onClick={onExplore}
          >
            <span>Browse All Products</span>
            <span>→</span>
          </div>
        </div>

      </div>
    </div>
  );
}
