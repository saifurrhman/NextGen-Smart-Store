import React, { useState } from 'react';
import { Mail, Save, Eye, EyeOff, RotateCcw, Type, AlignLeft, Zap } from 'lucide-react';

const LS_KEY = 'ng_newsletter';

const DEFAULT_NL = {
  is_active: true,
  heading: 'Stay in the Loop',
  description: 'Get exclusive deals, early access to new drops, and style tips — delivered straight to your inbox every week.',
  btnText: 'Subscribe',
  placeholder: 'Enter your email...',
  badges: ['No spam', 'Unsubscribe anytime', 'Weekly drops'],
};

function getStored() { try { const r = localStorage.getItem(LS_KEY); if (r) return { ...DEFAULT_NL, ...JSON.parse(r) }; } catch {} return DEFAULT_NL; }

export default function NewsletterManager() {
  const [nl, setNl] = useState(getStored);
  const [saved, setSaved] = useState(false);
  const [badgeInput, setBadgeInput] = useState('');

  const update = (k, v) => setNl(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(nl));
    window.dispatchEvent(new Event('newsletterUpdated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset newsletter to defaults?')) {
      setNl(DEFAULT_NL);
      localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_NL));
      window.dispatchEvent(new Event('newsletterUpdated'));
    }
  };

  const addBadge = () => {
    if (badgeInput.trim() && nl.badges.length < 5) {
      update('badges', [...nl.badges, badgeInput.trim()]);
      setBadgeInput('');
    }
  };
  const removeBadge = (idx) => update('badges', nl.badges.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mail size={22} className="text-emerald-500" />
            Newsletter Section Manager
          </h2>
          <p className="text-sm text-gray-500 mt-1">Control the "Stay in the Loop" newsletter section on the homepage.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"><RotateCcw size={14} /> Reset</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black shadow-md transition-all cursor-pointer ${saved ? 'bg-green-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}><Save size={16} />{saved ? '✓ Saved!' : 'Save Changes'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-3 space-y-5">

          {/* Visibility */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div><p className="font-bold text-gray-800 text-sm">Section Visibility</p><p className="text-xs text-gray-400 mt-0.5">Show or hide the newsletter section</p></div>
              <button onClick={() => update('is_active', !nl.is_active)} className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${nl.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${nl.is_active ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${nl.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
              {nl.is_active ? <><Eye size={11} /> Visible</> : <><EyeOff size={11} /> Hidden</>}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-100 pb-3"><AlignLeft size={16} className="text-emerald-500" /> Content</h3>

            <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><Type size={10} /> Heading</label>
              <input type="text" value={nl.heading} onChange={e => update('heading', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800" />
            </div>

            <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
              <textarea value={nl.description} onChange={e => update('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none text-gray-800" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Button Text</label>
                <input type="text" value={nl.btnText} onChange={e => update('btnText', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800" />
              </div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Input Placeholder</label>
                <input type="text" value={nl.placeholder} onChange={e => update('placeholder', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800" />
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">Trust Badges</h3>
            <div className="flex flex-wrap gap-2">
              {nl.badges.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                  ✓ {b}
                  <button onClick={() => removeBadge(i)} className="text-emerald-400 hover:text-red-500 cursor-pointer ml-1">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={badgeInput} onChange={e => setBadgeInput(e.target.value)} placeholder="e.g. Free shipping" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800" />
              <button type="button" onClick={addBadge} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 cursor-pointer">Add</button>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Homepage Preview</p>
            <div className={`rounded-2xl border overflow-hidden shadow-lg ${nl.is_active ? 'border-emerald-200' : 'border-gray-200 opacity-50'}`}>
              {!nl.is_active && <div className="bg-gray-100 text-center py-1 text-[10px] font-black uppercase text-gray-400">Hidden</div>}
              <div className="relative p-6 bg-white/80">
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10 text-center">
                  <div className="w-8 h-8 mx-auto mb-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Zap size={14} className="text-white" fill="white" /></div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">{nl.heading || 'Newsletter Title'}</h3>
                  <p className="text-[10px] text-gray-500 mb-3 leading-relaxed line-clamp-2">{nl.description}</p>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] text-gray-400 text-left">{nl.placeholder}</div>
                    <button className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black rounded-lg">{nl.btnText}</button>
                  </div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {nl.badges.map((b, i) => <span key={i} className="text-[8px] font-bold text-gray-400">✓ {b}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">Click "Save Changes" to apply</p>
          </div>
        </div>
      </div>
    </div>
  );
}
