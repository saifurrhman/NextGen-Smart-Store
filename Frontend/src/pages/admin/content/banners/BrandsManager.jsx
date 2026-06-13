import React, { useState, useEffect } from 'react';
import {
  Award, Plus, Trash2, Edit3, Eye, EyeOff, Save, X,
  GripVertical, Image as ImageIcon, ToggleLeft, ToggleRight, RotateCcw
} from 'lucide-react';

const LS_KEY = 'ng_trusted_brands';

const DEFAULT_BRANDS = [
  { id: 'b1', name: 'Apple',   logoUrl: '', displayName: 'Apple',   fontStyle: 'font-bold tracking-tight text-lg',   is_active: true },
  { id: 'b2', name: 'Samsung', logoUrl: '', displayName: 'SAMSUNG', fontStyle: 'font-black tracking-[0.15em] text-base', is_active: true },
  { id: 'b3', name: 'Sony',    logoUrl: '', displayName: 'SONY',    fontStyle: 'font-black tracking-[0.2em] text-lg',   is_active: true },
  { id: 'b4', name: 'Nike',    logoUrl: '', displayName: 'NIKE',    fontStyle: 'font-black italic tracking-widest text-base', is_active: true },
  { id: 'b5', name: 'Adidas',  logoUrl: '', displayName: 'adidas',  fontStyle: 'font-bold text-sm lowercase',            is_active: true },
  { id: 'b6', name: 'Rolex',   logoUrl: '', displayName: 'ROLEX',   fontStyle: 'tracking-[0.2em] text-xs font-bold',     is_active: true },
];

function getStored() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_BRANDS;
}

const EMPTY_FORM = { name: '', displayName: '', logoUrl: '', fontStyle: 'font-bold tracking-tight text-lg', is_active: true };

export default function BrandsManager() {
  const [brands, setBrands] = useState(getStored);
  const [sectionTitle, setSectionTitle] = useState(
    () => localStorage.getItem('ng_brands_title') || 'Trusted by world-class brands'
  );
  const [sectionVisible, setSectionVisible] = useState(
    () => localStorage.getItem('ng_brands_visible') !== 'false'
  );
  const [saved, setSaved] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imgMode, setImgMode] = useState('url');

  const persist = (updatedBrands, title = sectionTitle, visible = sectionVisible) => {
    localStorage.setItem(LS_KEY, JSON.stringify(updatedBrands));
    localStorage.setItem('ng_brands_title', title);
    localStorage.setItem('ng_brands_visible', String(visible));
    window.dispatchEvent(new Event('brandsUpdated'));
  };

  const handleSaveAll = () => {
    persist(brands, sectionTitle, sectionVisible);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset brands to default (Apple, Samsung, Sony, Nike, Adidas, Rolex)?')) {
      setBrands(DEFAULT_BRANDS);
      setSectionTitle('Trusted by world-class brands');
      setSectionVisible(true);
      persist(DEFAULT_BRANDS, 'Trusted by world-class brands', true);
    }
  };

  const handleToggleBrand = (id) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this brand?')) {
      setBrands(prev => prev.filter(b => b.id !== id));
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImgMode('url');
    setIsFormOpen(true);
  };

  const openEdit = (brand) => {
    setEditingId(brand.id);
    setForm({ name: brand.name, displayName: brand.displayName, logoUrl: brand.logoUrl || '', fontStyle: brand.fontStyle || 'font-bold tracking-tight text-lg', is_active: brand.is_active });
    setImgMode('url');
    setIsFormOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, logoUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.displayName.trim()) {
      alert('Brand Name and Display Name are required.');
      return;
    }
    if (editingId) {
      setBrands(prev => prev.map(b => b.id === editingId ? { ...b, ...form } : b));
    } else {
      const newBrand = { id: 'b_' + Date.now(), ...form };
      setBrands(prev => [...prev, newBrand]);
    }
    setIsFormOpen(false);
  };

  const activeBrands = brands.filter(b => b.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award size={22} className="text-emerald-500" />
            Trusted Brands Manager
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit, and manage the "Trusted by world-class brands" section on the homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer shadow-md">
            <Plus size={16} /> Add Brand
          </button>
          <button onClick={handleSaveAll} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black shadow-md transition-all cursor-pointer ${saved ? 'bg-green-500 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
            <Save size={16} />{saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Settings + Table ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Section Settings */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm border-b border-gray-100 pb-3">Section Settings</h3>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm">Section Visibility</p>
                <p className="text-xs text-gray-400 mt-0.5">Show or hide the brands bar on the homepage</p>
              </div>
              <button
                onClick={() => setSectionVisible(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${sectionVisible ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${sectionVisible ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* Section Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section Heading Text</label>
              <input
                type="text"
                value={sectionTitle}
                onChange={e => setSectionTitle(e.target.value)}
                placeholder="Trusted by world-class brands"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
              />
            </div>
          </div>

          {/* Brands Table */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-bold text-gray-800 text-sm">{brands.length} Brands &nbsp;·&nbsp; <span className="text-emerald-600">{activeBrands.length} Active</span></p>
            </div>

            {brands.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Award size={40} className="text-gray-200 mb-3" />
                <p className="font-bold text-gray-700">No brands yet</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Brand" to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-5 py-3">Brand</th>
                      <th className="px-5 py-3">Display Name</th>
                      <th className="px-5 py-3">Logo</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {brands.map(brand => (
                      <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 font-bold text-gray-900">{brand.name}</td>
                        <td className="px-5 py-3">
                          <span className={`${brand.fontStyle} text-gray-700`}>{brand.displayName}</span>
                        </td>
                        <td className="px-5 py-3">
                          {brand.logoUrl ? (
                            <img src={brand.logoUrl} alt={brand.name} className="h-7 w-auto object-contain rounded" />
                          ) : (
                            <span className="text-xs text-gray-400 italic">Text only</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleToggleBrand(brand.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border cursor-pointer transition-colors ${
                              brand.is_active
                                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {brand.is_active ? <><Eye size={11} /> Active</> : <><EyeOff size={11} /> Hidden</>}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(brand)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer" title="Edit">
                              <Edit3 size={15} />
                            </button>
                            <button onClick={() => handleDelete(brand.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Homepage Preview</p>
            <div className={`bg-white rounded-2xl border shadow-lg overflow-hidden ${sectionVisible ? 'border-emerald-200' : 'border-gray-200 opacity-50'}`}>
              {!sectionVisible && (
                <div className="bg-gray-100 text-center py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Section Hidden
                </div>
              )}
              <div className="p-5">
                <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">
                  {sectionTitle || 'Trusted by world-class brands'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {activeBrands.length === 0 ? (
                    <p className="text-xs text-gray-300 text-center py-4">No active brands</p>
                  ) : activeBrands.map(brand => (
                    <div key={brand.id} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt={brand.name} className="h-5 w-auto object-contain" />
                      ) : (
                        <span className={`${brand.fontStyle} text-sm`}>{brand.displayName}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">Click "Save Changes" to apply</p>
          </div>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-gray-150 shadow-2xl w-full max-w-lg p-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Award size={20} className="text-emerald-500" />
                {editingId ? 'Edit Brand' : 'Add New Brand'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Brand Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Nike"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Display Text *</label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                    placeholder="e.g. NIKE"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Font Style */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Text Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Bold Normal', value: 'font-bold tracking-tight text-lg' },
                    { label: 'Black Wide', value: 'font-black tracking-[0.15em] text-base' },
                    { label: 'Serif Spaced', value: 'font-black tracking-[0.2em] text-lg' },
                    { label: 'Italic Bold', value: 'font-black italic tracking-widest text-base' },
                    { label: 'Lowercase', value: 'font-bold text-sm lowercase' },
                    { label: 'Extra Spaced', value: 'tracking-[0.2em] text-xs font-bold' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, fontStyle: opt.value }))}
                      className={`px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer text-left ${
                        form.fontStyle === opt.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className={opt.value}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logo (Optional)</label>
                <div className="flex gap-2 mb-2">
                  {['url', 'upload'].map(m => (
                    <button key={m} type="button" onClick={() => setImgMode(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${imgMode === m ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {m === 'url' ? 'Image URL' : 'Upload'}
                    </button>
                  ))}
                </div>
                {imgMode === 'url' ? (
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                    placeholder="https://... (leave blank for text only)"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                ) : (
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-400 transition-colors">
                      <ImageIcon size={18} className="text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload logo...</span>
                    </div>
                  </div>
                )}
                {form.logoUrl && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <img src={form.logoUrl} alt="preview" className="h-8 w-auto object-contain" />
                    <span className="text-xs text-gray-500">Logo preview</span>
                    <button type="button" onClick={() => setForm(f => ({ ...f, logoUrl: '' }))} className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer"><X size={14} /></button>
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Active on homepage</span>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-sm transition-colors shadow-md flex items-center gap-2 cursor-pointer">
                  <Save size={15} />{editingId ? 'Update Brand' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
