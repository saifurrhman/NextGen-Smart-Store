import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Trash2, Edit3, Eye, EyeOff, Save, X, Image as ImageIcon } from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    badge: "Men's Style Collection 2026",
    title: "Experience Premium Men's Shoes & Wear",
    subtitle: "Discover high-quality men's footwear, classic boots, outerwear, and activewear curated for the modern lifestyle. Styled for distinction and fit.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    btnText: "Shop Collection",
    btnLink: "/products",
    theme: "emerald",
    is_active: true
  },
  {
    id: 'default-2',
    badge: "Special Flash Deal",
    title: "Step Up Your Game With Performance Wear",
    subtitle: "Engineered for maximum comfort, durability, and breathability. Gear up with the finest jackets, shoes, and activewear designed to elevate your training.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    btnText: "Explore Sale",
    btnLink: "/products?sale=true",
    theme: "amber",
    is_active: true
  },
  {
    id: 'default-3',
    badge: "New Arrivals",
    title: "Minimalist Modern Jackets & Apparel",
    subtitle: "Uncompromising quality. Crafted with windproof fabrics and premium insulation, our new garments collection keeps you warm while maintaining a sleek profile.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
    btnText: "New Arrivals",
    btnLink: "/products",
    theme: "blue",
    is_active: true
  }
];

const THEMES = [
  { id: 'emerald', label: 'Emerald Green', gradient: 'bg-gradient-to-r from-emerald-50 to-teal-50' },
  { id: 'amber', label: 'Amber Orange', gradient: 'bg-gradient-to-r from-amber-50 to-orange-50' },
  { id: 'blue', label: 'Blue Indigo', gradient: 'bg-gradient-to-r from-blue-50 to-indigo-50' },
  { id: 'rose', label: 'Rose Red', gradient: 'bg-gradient-to-r from-rose-50 to-red-50' },
  { id: 'dark', label: 'Dark Charcoal', gradient: 'bg-gradient-to-r from-gray-100 to-gray-250' },
];

export default function HeroSliders() {
  const [sliders, setSliders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [btnText, setBtnText] = useState('Shop Now');
  const [btnLink, setBtnLink] = useState('/products');
  const [theme, setTheme] = useState('emerald');

  // Load from localStorage on mount
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('ng_hero_sliders') || '[]');
    if (local.length > 0) {
      setSliders(local);
    } else {
      setSliders(DEFAULT_SLIDES);
      localStorage.setItem('ng_hero_sliders', JSON.stringify(DEFAULT_SLIDES));
    }
  }, []);

  const saveToStorage = (updated) => {
    setSliders(updated);
    localStorage.setItem('ng_hero_sliders', JSON.stringify(updated));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setBadge('');
    setTitle('');
    setSubtitle('');
    setImage('');
    setBtnText('Shop Now');
    setBtnLink('/products');
    setTheme('emerald');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingId(slide.id);
    setBadge(slide.badge);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setImage(slide.image || '');
    setBtnText(slide.btnText || 'Shop Now');
    setBtnLink(slide.btnLink || '/products');
    setTheme(slide.theme || 'emerald');
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      const updated = sliders.filter(s => s.id !== id);
      saveToStorage(updated);
    }
  };

  const handleToggleActive = (id) => {
    const updated = sliders.map(s => s.id === id ? { ...s, is_active: s.is_active === false ? true : false } : s);
    saveToStorage(updated);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImage(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      alert('Please fill out all required fields (Title, Slide Image).');
      return;
    }

    if (editingId) {
      // Edit
      const updated = sliders.map(s => s.id === editingId ? {
        ...s,
        badge,
        title,
        subtitle,
        image,
        btnText,
        btnLink,
        theme
      } : s);
      saveToStorage(updated);
    } else {
      // Create new
      const newSlide = {
        id: 'slide_' + Date.now(),
        badge,
        title,
        subtitle,
        image,
        btnText,
        btnLink,
        theme,
        is_active: true
      };
      saveToStorage([...sliders, newSlide]);
    }
    setIsFormOpen(false);
  };

  const filteredSliders = sliders.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
            <Layers size={22} className="text-emerald-500" />
            Homepage Hero Sliders
          </h2>
          <p className="text-sm text-gray-500 mt-1">Add, update, and manage dynamic banners for the homepage hero carousel.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-md hover:shadow-emerald-500/10 cursor-pointer"
        >
          <Plus size={16} />
          Add Slider
        </button>
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search hero sliders by title or badge..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-800"
            />
          </div>
        </div>
        
        {filteredSliders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Layers size={32} />
            </div>
            <p className="text-lg font-medium text-gray-900">No sliders found</p>
            <p className="text-sm text-gray-400 mt-1">Get started by creating your first homepage banner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Slide Preview</th>
                  <th className="px-6 py-4">Badge & Title</th>
                  <th className="px-6 py-4">Theme</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredSliders.map((slide) => {
                  const preset = THEMES.find(t => t.id === slide.theme) || THEMES[0];
                  return (
                    <tr key={slide.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="px-6 py-4 shrink-0">
                        <div className="w-20 h-12 rounded-xl border border-gray-200 bg-white overflow-hidden flex items-center justify-center p-1 shadow-sm">
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-contain filter drop-shadow-sm" />
                        </div>
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4 max-w-md">
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{slide.badge || 'No Badge'}</span>
                        <h4 className="font-bold text-gray-800 mt-2 line-clamp-1">{slide.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{slide.subtitle}</p>
                      </td>

                      {/* Theme Preset */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                          slide.theme === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                          slide.theme === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                          slide.theme === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                          slide.theme === 'rose' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                          'bg-gray-150 border-gray-200 text-gray-850'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            slide.theme === 'emerald' ? 'bg-emerald-500' :
                            slide.theme === 'amber' ? 'bg-amber-500' :
                            slide.theme === 'blue' ? 'bg-blue-500' :
                            slide.theme === 'rose' ? 'bg-rose-500' :
                            'bg-gray-500'
                          }`} />
                          {preset.label}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleActive(slide.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-colors border cursor-pointer ${
                            slide.is_active !== false 
                              ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                              : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-150'
                          }`}
                        >
                          {slide.is_active !== false ? (
                            <>
                              <Eye size={12} /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} /> Hidden
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEdit(slide)}
                            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                            title="Edit Slide"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(slide.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Slide"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-gray-150 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative flex flex-col gap-6 animate-fade-in text-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Layers size={22} className="text-emerald-500" />
                {editingId ? 'Edit Hero Slide' : 'Create Hero Slide'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Slide Preview inside Modal */}
            {image && title && (
              <div className="border border-gray-200 rounded-[2rem] p-4 bg-gray-50 flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Slide Preview</p>
                <div className={`relative h-32 rounded-2xl overflow-hidden flex items-center justify-between p-4 border border-gray-150 bg-gradient-to-br ${
                  theme === 'emerald' ? 'from-emerald-50 to-teal-50' :
                  theme === 'amber' ? 'from-amber-50 to-orange-50' :
                  theme === 'blue' ? 'from-blue-50 to-indigo-50' :
                  theme === 'rose' ? 'from-rose-50 to-red-50' :
                  'from-gray-100 to-gray-200'
                }`}>
                  <div className="max-w-[65%] space-y-1">
                    {badge && <span className="text-[9px] font-bold text-emerald-600 bg-white border border-emerald-100 px-2 py-0.5 rounded-full">{badge}</span>}
                    <h4 className="font-extrabold text-sm text-gray-800 line-clamp-1">{title}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug">{subtitle}</p>
                  </div>
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-1 shadow-sm">
                    <img src={image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Badge */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Badge Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Special Discount 50% Off" 
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                </div>

                {/* Theme Preset */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Background Theme Preset</label>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800 capitalize font-medium cursor-pointer"
                  >
                    {THEMES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slide Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Elevate Your Run With Nike React" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slide Subtitle / Description</label>
                <textarea 
                  placeholder="Describe the promotion details..." 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800 resize-none"
                />
              </div>

              {/* Image Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slide Image (URL or Upload) *</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter image URL..." 
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <button 
                      type="button"
                      className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                      <ImageIcon size={16} />
                      Upload File
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Button Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Button CTA Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Shop Collection" 
                    value={btnText}
                    onChange={(e) => setBtnText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                </div>

                {/* Button Link */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Button Link URL</label>
                  <input 
                    type="text" 
                    placeholder="e.g. /products?sale=true" 
                    value={btnLink}
                    onChange={(e) => setBtnLink(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-sm transition-colors shadow-md hover:shadow-emerald-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <Save size={16} />
                  Save Slider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
