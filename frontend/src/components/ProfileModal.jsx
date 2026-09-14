import { useState, useEffect, useRef } from 'react';

export default function ProfileModal({
  isOpen,
  onClose,
  customerId,
  ordersCount = 0,
  onResetSession,
}) {
  const [activeTab, setActiveTab] = useState('account');
  const [copied, setCopied] = useState(false);

  // Settings State with localStorage persistence
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('techloom_profile_data');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Alex Vance',
          email: 'alex.vance@techloom.studio',
          phone: '+1 (555) 234-5678',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          currency: 'USD ($)',
          language: 'English (US)',
          twoFactor: true,
          emailNotifications: true,
          smsAlerts: false,
          stockAlerts: true,
          shippingAddress: {
            street: '742 Evergreen Terrace, Suite 400',
            city: 'San Francisco',
            state: 'CA',
            zip: '94107',
            country: 'United States',
          },
        };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('techloom_profile_data', JSON.stringify(profileData));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const copyCustomerId = () => {
    navigator.clipboard.writeText(customerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.85)] z-10 animate-slide-up flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#111622]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
              ⚡
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight">Account &amp; Settings</h2>
              <p className="text-xs text-slate-400">Manage identity, preferences, security, and checkout data</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Tabs & Main Content */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Left Tab Nav */}
          <div className="w-full md:w-64 p-4 bg-[#0D111A]/60 shrink-0 space-y-1">
            {/* User Quick Info Badge */}
            <div className="p-3 mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <img
                src={profileData.avatarUrl}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border border-amber-400/40 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-white truncate">{profileData.name}</div>
                <div className="text-[11px] text-amber-400 font-medium">Verified Member</div>
                <div className="text-[10px] text-slate-400">{ordersCount} Total Orders</div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'account'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>👤</span>
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'shipping'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>📍</span>
              <span>Addresses &amp; Shipping</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'preferences'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>⚙️</span>
              <span>Preferences &amp; Regional</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'security'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>🛡️</span>
              <span>Security &amp; API Keys</span>
            </button>

            {/* Session Token Box */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Client Session ID
              </span>
              <div className="flex items-center gap-1.5 p-2 bg-black/40 rounded-lg border border-white/5">
                <span className="font-mono text-[10px] text-slate-300 truncate">{customerId}</span>
                <button
                  onClick={copyCustomerId}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white shrink-0"
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Tab Content */}
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            
            {/* TAB 1: Account Information */}
            {activeTab === 'account' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-white">Personal Information</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Update your display name, contact email, and avatar</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Avatar Image URL</label>
                    <input
                      type="text"
                      value={profileData.avatarUrl}
                      onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                      className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Notification preferences */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Communication Alerts</h4>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-semibold text-white">Order Status &amp; Refund Email Confirmations</div>
                      <div className="text-[11px] text-slate-400">Receive real-time transactional receipts</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.emailNotifications}
                      onChange={(e) => setProfileData({ ...profileData, emailNotifications: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-white/20"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                    <div>
                      <div className="text-xs font-semibold text-white">Low Stock Restock Alerts</div>
                      <div className="text-[11px] text-slate-400">Be notified the moment sold-out items return</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.stockAlerts}
                      onChange={(e) => setProfileData({ ...profileData, stockAlerts: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-white/20"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: Shipping & Delivery Addresses */}
            {activeTab === 'shipping' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-white">Default Shipping Destination</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Applied automatically during one-click stock reservation</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Street Address</label>
                    <input
                      type="text"
                      value={profileData.shippingAddress.street}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          shippingAddress: { ...profileData.shippingAddress, street: e.target.value },
                        })
                      }
                      className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">City</label>
                      <input
                        type="text"
                        value={profileData.shippingAddress.city}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            shippingAddress: { ...profileData.shippingAddress, city: e.target.value },
                          })
                        }
                        className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">State / Province</label>
                      <input
                        type="text"
                        value={profileData.shippingAddress.state}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            shippingAddress: { ...profileData.shippingAddress, state: e.target.value },
                          })
                        }
                        className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Postal / ZIP Code</label>
                      <input
                        type="text"
                        value={profileData.shippingAddress.zip}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            shippingAddress: { ...profileData.shippingAddress, zip: e.target.value },
                          })
                        }
                        className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Country / Territory</label>
                    <input
                      type="text"
                      value={profileData.shippingAddress.country}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          shippingAddress: { ...profileData.shippingAddress, country: e.target.value },
                        })
                      }
                      className="w-full bg-[#151B26] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <span>✓</span>
                  <span>Verified for Express Air Freight and Insured Parcel Delivery</span>
                </div>
              </div>
            )}

            {/* TAB 3: Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-white">Regional &amp; Display Preferences</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Customize your currency, localization, and storefront UI</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Currency</label>
                    <select
                      value={profileData.currency}
                      onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                      className="w-full bg-[#151B26] border border-white/10 px-3 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>CAD ($)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Language</label>
                    <select
                      value={profileData.language}
                      onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                      className="w-full bg-[#151B26] border border-white/10 px-3 py-2 text-xs text-white rounded-xl focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>German (Deutsch)</option>
                      <option>French (Français)</option>
                      <option>Japanese (日本語)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-white">Storefront Acceleration Mode</div>
                    <p className="text-[11px] text-slate-400">
                      Optimized for low-latency row locks and instant payment simulation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Security & Keys */}
            {activeTab === 'security' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-white">Security &amp; Session Controls</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage session identity and cryptographic idempotency keys</p>
                </div>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">Two-Factor Authorization for Checkout</div>
                    <div className="text-[11px] text-slate-400">Require token verification on reservations over $500</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.twoFactor}
                    onChange={(e) => setProfileData({ ...profileData, twoFactor: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-800 border-white/20"
                  />
                </label>

                {/* Session Reset Button */}
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">Danger Zone</h4>
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Reset Shopper Identity</div>
                      <div className="text-[11px] text-slate-400">Clears current customerId &amp; starts a new session</div>
                    </div>
                    <button
                      onClick={onResetSession}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white border border-rose-500/30 transition-all"
                    >
                      Reset Session
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0F1420] flex items-center justify-between">
          <div className="text-xs text-emerald-400 font-medium">
            {savedSuccess && '✓ Settings saved to local profile successfully!'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-all transform active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
