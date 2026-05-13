import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import { useTheme, themes } from '../../context/ThemeContext';

const CAT_COLORS = ['#EAF8E7','#EFF6FF','#FEF3C7','#FDF2F8','#EDE9FE','#FFF1F2','#F0F9FF','#F0FDF4','#FFF7ED','#F0FDFA'];
const CAT_TEXT   = ['#16a34a','#2563eb','#d97706','#db2777','#7c3aed','#e11d48','#0284c7','#15803d','#ea580c','#0f766e'];

const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8000/media/${url.startsWith('/') ? url.slice(1) : url}`;
};

const Categories = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('categories/?page_size=50').then(r => {
      setCategories((r.data.results || r.data).filter(c => c.is_active));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">All Categories</span>
        </nav>
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-black uppercase tracking-wider mb-2" style={{ color: p.primary }}>Browse</p>
          <h1 className="text-4xl font-black text-gray-900 mb-3">All Categories</h1>
          <p className="text-gray-500">Explore our complete range of product categories</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(null).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Grid size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="font-black text-gray-400 text-lg">No Categories Yet</h3>
            <p className="text-gray-400 text-sm mt-2">Admin is setting up categories. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              const bg = CAT_COLORS[i % CAT_COLORS.length];
              const tc = CAT_TEXT[i % CAT_TEXT.length];
              const img = getMediaUrl(cat.icon) || getMediaUrl(cat.image);
              return (
                <Link key={cat.slug || i} to={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-transparent hover:border-current hover:shadow-xl transition-all hover:-translate-y-1 text-center overflow-hidden"
                  style={{ background: bg, color: tc }}>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 flex items-center justify-center shadow-sm" style={{ background: `${tc}20` }}>
                    {img ? <img src={img} alt={cat.name} className="w-full h-full object-cover" />
                      : <span className="font-black text-3xl">{cat.name[0]}</span>}
                  </div>
                  <h3 className="font-black text-lg mb-1">{cat.name}</h3>
                  {cat.description && <p className="text-xs opacity-70 line-clamp-2 mb-3">{cat.description}</p>}
                  <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider">Explore <ArrowRight size={12} /></span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
