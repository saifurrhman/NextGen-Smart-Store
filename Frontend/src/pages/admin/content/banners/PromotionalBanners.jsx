import React, { useState, useEffect } from 'react';
import { Zap, Save, Eye, EyeOff, RotateCcw, Image as ImageIcon, Clock, AlignLeft, Tag, Link as LinkIcon, Type } from 'lucide-react';

const DEFAULT_FLASH_SALE = {
  is_active: true,
  badge: 'Limited Offer',
  title: 'Midnight Flash Sale',
  description: "Get up to 60% off on selected men's shoes, leather boots, and active styling essentials. Offer valid until the timer runs out!",
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop',
  btnText: 'Shop Flash Sale',
  btnLink: '/products?sale=true',
  // Timer: store end time as ISO string. Default = tonight 23:59
  timerMode: 'daily',   // 'daily' = resets daily at midnight | 'fixed' = a specific end datetime
  timerEndDate: '',     // used only when timerMode === 'fixed'
};

const LS_KEY = 'ng_flash_sale';

function getStoredSale() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_FLASH_SALE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_FLASH_SALE;
}

function useCountdownPreview(sale) {
  const getTime = () => {
    const now = new Date();
    let end;
    if (sale.timerMode === 'fixed' && sale.timerEndDate) {
      end = new Date(sale.timerEndDate);
    } else {
      end = new Date();
      end.setHours(23, 59, 59, 0);
    }
    const diff = Math.max(0, end - now);
    return {
      h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
      m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
      s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
    };
  };
  const [t, setT] = useState(getTime);
  useEffect(() => {
    const id = setInterval(() => setT(getTime()), 1000);
    return () => clearInterval(id);
  }, [sale.timerMode, sale.timerEndDate]);
  return t;
}

export default function PromotionalBanners() {
  const [sale, setSale] = useState(getStoredSale);
  const [saved, setSaved] = useState(false);
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
  const countdown = useCountdownPreview(sale);

  const update = (key, value) => setSale(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('image', ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(sale));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // Dispatch event so Home.jsx re-reads without refresh
    window.dispatchEvent(new Event('flashSaleUpdated'));
  };

  const handleReset = () => {
    if (window.confirm('Reset Flash Sale to default settings?')) {
      setSale(DEFAULT_FLASH_SALE);
      localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_FLASH_SALE));
      window.dispatchEvent(new Event('flashSaleUpdated'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap size={22} className="text-emerald-500" />
            Flash Sale Manager
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Control the Midnight Flash Sale section on the homepage — title, description, countdown timer, image & button.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black shadow-md transition-all cursor-pointer ${
              saved
                ? 'bg-green-500 text-white shadow-green-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
            }`}
          >
            <Save size={16} />
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Form Panel ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Active Toggle */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800 text-sm">Section Visibility</p>
                <p className="text-xs text-gray-400 mt-0.5">Show or hide the Flash Sale section on the homepage</p>
              </div>
              <button
                onClick={() => update('is_active', !sale.is_active)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  sale.is_active ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  sale.is_active ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
              sale.is_active
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}>
              {sale.is_active ? <><Eye size={11} /> Active — visible on homepage</> : <><EyeOff size={11} /> Hidden — not shown</>}
            </div>
          </div>

          {/* Text Content */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <AlignLeft size={16} className="text-emerald-500" />
              Text Content
            </h3>

            {/* Badge */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <Tag size={10} /> Badge Label
              </label>
              <input
                type="text"
                value={sale.badge}
                onChange={e => update('badge', e.target.value)}
                placeholder="e.g. Limited Offer"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800 transition-colors"
              />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <Type size={10} /> Section Title *
              </label>
              <input
                type="text"
                value={sale.title}
                onChange={e => update('title', e.target.value)}
                placeholder="e.g. Midnight Flash Sale"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
              <textarea
                value={sale.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Describe the offer..."
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800 resize-none transition-colors"
              />
            </div>

            {/* Button */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <LinkIcon size={10} /> Button Text
                </label>
                <input
                  type="text"
                  value={sale.btnText}
                  onChange={e => update('btnText', e.target.value)}
                  placeholder="Shop Flash Sale"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <LinkIcon size={10} /> Button Link
                </label>
                <input
                  type="text"
                  value={sale.btnLink}
                  onChange={e => update('btnLink', e.target.value)}
                  placeholder="/products?sale=true"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Countdown Timer Settings */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <Clock size={16} className="text-emerald-500" />
              Countdown Timer
            </h3>

            {/* Timer Mode */}
            <div className="flex gap-3">
              {[
                { id: 'daily', label: 'Daily Reset', desc: 'Resets every midnight' },
                { id: 'fixed', label: 'Fixed Deadline', desc: 'Set a specific end date/time' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => update('timerMode', mode.id)}
                  className={`flex-1 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                    sale.timerMode === mode.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-xs font-black ${sale.timerMode === mode.id ? 'text-emerald-700' : 'text-gray-700'}`}>{mode.label}</p>
                  <p className={`text-[10px] mt-0.5 ${sale.timerMode === mode.id ? 'text-emerald-500' : 'text-gray-400'}`}>{mode.desc}</p>
                </button>
              ))}
            </div>

            {sale.timerMode === 'fixed' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sale End Date & Time</label>
                <input
                  type="datetime-local"
                  value={sale.timerEndDate}
                  onChange={e => update('timerEndDate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                />
                {sale.timerEndDate && (
                  <p className="text-[10px] text-emerald-600 font-bold">
                    Sale ends: {new Date(sale.timerEndDate).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                )}
              </div>
            )}

            {/* Live Timer Preview */}
            <div className="pt-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Live Timer Preview</p>
              <div className="flex items-center gap-3">
                {[countdown.h, countdown.m, countdown.s].map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xl font-black text-emerald-600 font-mono">{v}</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mt-1">
                      {['Hours', 'Mins', 'Secs'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <ImageIcon size={16} className="text-emerald-500" />
              Sale Image
            </h3>
            <div className="flex gap-2 mb-2">
              {['url', 'upload'].map(m => (
                <button
                  key={m}
                  onClick={() => setImageMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageMode === m ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m === 'url' ? 'Image URL' : 'Upload File'}
                </button>
              ))}
            </div>
            {imageMode === 'url' ? (
              <input
                type="text"
                value={sale.image}
                onChange={e => update('image', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
              />
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-400 transition-colors">
                  <ImageIcon size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload image...</span>
                </div>
              </div>
            )}
            {sale.image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-32 flex items-center justify-center">
                <img src={sale.image} alt="preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* ── Live Preview Panel ── */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Homepage Preview</p>
            <div className={`rounded-2xl border overflow-hidden shadow-lg ${
              sale.is_active ? 'border-emerald-200' : 'border-gray-200 opacity-50'
            }`}>
              {!sale.is_active && (
                <div className="bg-gray-100 text-center py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Section Hidden
                </div>
              )}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
                <span className="inline-block px-2.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-red-200 mb-2">
                  {sale.badge || 'Limited Offer'}
                </span>
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">
                  {sale.title || 'Flash Sale Title'}
                </h3>
                <p className="text-gray-600 text-[11px] leading-relaxed mb-3 line-clamp-3">
                  {sale.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  {[countdown.h, countdown.m, countdown.s].map((v, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-sm font-black text-emerald-600 font-mono">{v}</span>
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">{['H', 'M', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button className="flex-shrink-0 px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-lg">
                    {sale.btnText || 'Shop Now'}
                  </button>
                  {sale.image && (
                    <div className="w-20 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                      <img src={sale.image} alt="sale" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">Changes appear live after saving</p>
          </div>
        </div>
      </div>
    </div>
  );
}
