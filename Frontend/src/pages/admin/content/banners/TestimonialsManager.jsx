import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Edit3, Eye, EyeOff, Save, X, Star, RotateCcw, Image as ImageIcon } from 'lucide-react';

const LS_KEY = 'ng_testimonials';
const LS_SETTINGS = 'ng_testimonials_settings';

const DEFAULT_REVIEWS = [
  { id: 't1', text: "Absolutely phenomenal shoes! The leather feels extremely premium and the fit is perfect.", name: "David Jenkins", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=8", rating: 5, is_active: true },
  { id: 't2', text: "Clean, modern sneakers. Extremely comfortable all day. Excellent quality!", name: "Michael Chang", role: "Sneaker Enthusiast", img: "https://i.pravatar.cc/100?img=11", rating: 5, is_active: true },
  { id: 't3', text: "Customer service is top-notch. Resolved my sizing question in minutes.", name: "Marcus Watson", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=12", rating: 5, is_active: true },
  { id: 't4', text: "Best boots I've ever owned. Worth every penny. Will buy again.", name: "James Porter", role: "Repeat Customer", img: "https://i.pravatar.cc/100?img=14", rating: 5, is_active: true },
  { id: 't5', text: "Fast shipping, beautiful packaging, and the jacket is stunning.", name: "Amir Hassan", role: "Verified Buyer", img: "https://i.pravatar.cc/100?img=15", rating: 5, is_active: true },
  { id: 't6', text: "Great variety and prices. My go-to store for all menswear.", name: "Ryan Brooks", role: "Loyal Member", img: "https://i.pravatar.cc/100?img=33", rating: 5, is_active: true },
];

const DEFAULT_SETTINGS = { is_active: true, badge: 'Testimonials', heading: "Don't Just Take Our Word", subtext: '4.9/5 from 50,000+ reviews' };

function getStored() { try { const r = localStorage.getItem(LS_KEY); if (r) return JSON.parse(r); } catch {} return DEFAULT_REVIEWS; }
function getSettings() { try { const r = localStorage.getItem(LS_SETTINGS); if (r) return { ...DEFAULT_SETTINGS, ...JSON.parse(r) }; } catch {} return DEFAULT_SETTINGS; }

const EMPTY = { text: '', name: '', role: 'Verified Buyer', img: '', rating: 5, is_active: true };

export default function TestimonialsManager() {
  const [reviews, setReviews] = useState(getStored);
  const [settings, setSettings] = useState(getSettings);
  const [saved, setSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const persist = (r = reviews, s = settings) => {
    localStorage.setItem(LS_KEY, JSON.stringify(r));
    localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
    window.dispatchEvent(new Event('testimonialsUpdated'));
  };

  const handleSave = () => { persist(reviews, settings); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const handleReset = () => { if (window.confirm('Reset testimonials to defaults?')) { setReviews(DEFAULT_REVIEWS); setSettings(DEFAULT_SETTINGS); persist(DEFAULT_REVIEWS, DEFAULT_SETTINGS); }};

  const openAdd = () => { setEditId(null); setForm(EMPTY); setIsOpen(true); };
  const openEdit = (r) => { setEditId(r.id); setForm({ text: r.text, name: r.name, role: r.role, img: r.img, rating: r.rating, is_active: r.is_active }); setIsOpen(true); };
  const handleDelete = (id) => { if (window.confirm('Delete this review?')) setReviews(prev => prev.filter(r => r.id !== id)); };
  const toggleActive = (id) => setReviews(prev => prev.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r));

  const handleImgUpload = (e) => { const f = e.target.files[0]; if (!f) return; const reader = new FileReader(); reader.onload = ev => setForm(prev => ({ ...prev, img: ev.target.result })); reader.readAsDataURL(f); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim() || !form.name.trim()) { alert('Review text and name are required.'); return; }
    if (editId) { setReviews(prev => prev.map(r => r.id === editId ? { ...r, ...form } : r)); }
    else { setReviews(prev => [...prev, { id: 't_' + Date.now(), ...form }]); }
    setIsOpen(false);
  };

  const active = reviews.filter(r => r.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={22} className="text-emerald-500" />
            Testimonials Manager
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage customer reviews shown on the homepage.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"><RotateCcw size={14} /> Reset</button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-md"><Plus size={16} /> Add Review</button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black shadow-md transition-all cursor-pointer ${saved ? 'bg-green-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}><Save size={16} />{saved ? '✓ Saved!' : 'Save Changes'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Settings + Table */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section Settings */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">Section Settings</h3>
            <div className="flex items-center justify-between">
              <div><p className="font-semibold text-gray-800 text-sm">Section Visibility</p><p className="text-xs text-gray-400 mt-0.5">Show or hide testimonials on homepage</p></div>
              <button onClick={() => setSettings(s => ({ ...s, is_active: !s.is_active }))} className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.is_active ? 'translate-x-6' : ''}`} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Badge</label>
                <input type="text" value={settings.badge} onChange={e => setSettings(s => ({ ...s, badge: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800" />
              </div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Heading</label>
                <input type="text" value={settings.heading} onChange={e => setSettings(s => ({ ...s, heading: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800" />
              </div>
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sub-Text</label>
                <input type="text" value={settings.subtext} onChange={e => setSettings(s => ({ ...s, subtext: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800" />
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100"><p className="font-bold text-gray-800 text-sm">{reviews.length} Reviews · <span className="text-emerald-600">{active.length} Active</span></p></div>
            {reviews.length === 0 ? (
              <div className="p-12 flex flex-col items-center text-center"><MessageSquare size={40} className="text-gray-200 mb-3" /><p className="font-bold text-gray-700">No reviews yet</p></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map(r => (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                    <img src={r.img || 'https://i.pravatar.cc/100?img=1'} alt={r.name} className="w-9 h-9 rounded-full object-cover shadow-sm flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{r.name}</p>
                      <p className="text-xs text-gray-400 truncate">"{r.text}"</p>
                    </div>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= r.rating ? '#f59e0b' : '#e5e7eb'} stroke={s <= r.rating ? '#f59e0b' : '#e5e7eb'} />)}</div>
                    <button onClick={() => toggleActive(r.id)} className={`px-2.5 py-1 rounded-full text-[10px] font-black border cursor-pointer ${r.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                      {r.is_active ? <><Eye size={10} className="inline mr-1" />Active</> : <><EyeOff size={10} className="inline mr-1" />Hidden</>}
                    </button>
                    <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Preview</p>
            <div className={`bg-gray-50 rounded-2xl border shadow-lg p-5 ${settings.is_active ? 'border-emerald-200' : 'border-gray-200 opacity-50'}`}>
              {!settings.is_active && <div className="bg-gray-100 text-center py-1 text-[10px] font-black uppercase text-gray-400 rounded-t-xl -mx-5 -mt-5 mb-4">Hidden</div>}
              <p className="text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-1">{settings.badge}</p>
              <p className="text-sm font-black text-gray-900 mb-1">{settings.heading}</p>
              <p className="text-[10px] text-gray-400 mb-3">{settings.subtext}</p>
              <div className="space-y-2">
                {active.slice(0, 3).map(r => (
                  <div key={r.id} className="bg-white border border-gray-100 rounded-xl px-3 py-2">
                    <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(s => <Star key={s} size={8} fill={s <= r.rating ? '#f59e0b' : '#e5e7eb'} stroke={s <= r.rating ? '#f59e0b' : '#e5e7eb'} />)}</div>
                    <p className="text-[10px] text-gray-600 leading-snug line-clamp-2 mb-1.5">"{r.text}"</p>
                    <div className="flex items-center gap-1.5">
                      <img src={r.img || 'https://i.pravatar.cc/100?img=1'} className="w-5 h-5 rounded-full object-cover" alt="" />
                      <span className="text-[9px] font-bold text-gray-800">{r.name}</span>
                    </div>
                  </div>
                ))}
                {active.length > 3 && <p className="text-[9px] text-gray-400 text-center">+{active.length - 3} more scrolling</p>}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">Click "Save Changes" to apply</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border shadow-2xl w-full max-w-lg p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><MessageSquare size={20} className="text-emerald-500" />{editId ? 'Edit Review' : 'Add New Review'}</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Review Text *</label>
                <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={3} required placeholder="What the customer said..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Role / Title</label>
                  <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              {/* Rating */}
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</label>
                <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))} className="cursor-pointer"><Star size={20} fill={s <= form.rating ? '#f59e0b' : '#e5e7eb'} stroke={s <= form.rating ? '#f59e0b' : '#e5e7eb'} /></button>)}</div>
              </div>
              {/* Avatar */}
              <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avatar (URL or Upload)</label>
                <div className="flex gap-2">
                  <input type="text" value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="https://..." className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                  <div className="relative"><input type="file" accept="image/*" onChange={handleImgUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div className="px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1"><ImageIcon size={14} /> Upload</div>
                  </div>
                </div>
                {form.img && <img src={form.img} className="w-10 h-10 rounded-full mt-2 object-cover border border-gray-200" alt="preview" />}
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-sm shadow-md flex items-center gap-2 cursor-pointer"><Save size={15} />{editId ? 'Update' : 'Add Review'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
