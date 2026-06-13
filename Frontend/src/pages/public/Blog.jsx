import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, User } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const posts = [
  { id: 1, title: '10 Fashion Trends to Watch in 2026', excerpt: 'From sustainable fashion to AI-curated wardrobes, discover the top trends shaping the industry this year.', category: 'Fashion', author: 'Style Team', date: 'May 8, 2026', readTime: '5 min', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&auto=format&fit=crop' },
  { id: 2, title: 'How to Style Sneakers for Every Occasion', excerpt: 'Sneakers are no longer just for the gym. Here is how to incorporate them into every outfit in your wardrobe.', category: 'Style', author: 'Fashion Editor', date: 'May 5, 2026', readTime: '4 min', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop' },
  { id: 3, title: 'Sustainable Fashion: Why It Matters in 2026', excerpt: 'The fashion industry is changing. Learn how sustainable choices can reduce your carbon footprint and still look great.', category: 'Sustainability', author: 'Green Team', date: 'May 2, 2026', readTime: '6 min', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop' },
  { id: 4, title: 'NextGen Store Launch: Pakistan\'s First AI E-Commerce', excerpt: 'We are thrilled to announce the launch of NextGen Smart Store — redefining how Pakistan shops online.', category: 'News', author: 'NextGen Team', date: 'Apr 28, 2026', readTime: '3 min', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop' },
  { id: 5, title: 'Ultimate Guide to Online Shopping Safety', excerpt: 'Stay safe while shopping online. Follow these essential tips to protect your personal and financial information.', category: 'Tips', author: 'Security Team', date: 'Apr 25, 2026', readTime: '5 min', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop' },
  { id: 6, title: 'How Vendors Can Grow on NextGen Store', excerpt: 'A comprehensive guide for new and existing vendors on how to maximize sales and grow your business on our platform.', category: 'Business', author: 'Vendor Team', date: 'Apr 20, 2026', readTime: '7 min', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop' },
  { id: 7, title: 'The Ultimate Guide to Men\'s Shoe Care', excerpt: 'Keep your leather sneakers, boots, and suede shoes looking brand new with our expert maintenance tips and product guide.', category: 'Tips', author: 'Shoe Expert', date: 'Apr 18, 2026', readTime: '5 min', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop' },
];

const Blog = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">Blog</span>
        </nav>

        {/* Featured Post */}
        <div className="relative rounded-3xl overflow-hidden mb-12 h-80 md:h-96">
          <img src={posts[0].img} alt={posts[0].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <span className="inline-block px-3 py-1 text-xs font-black rounded-full mb-3 text-white" style={{ background: p.primary }}>{posts[0].category}</span>
            <h2 className="text-3xl font-black mb-2">{posts[0].title}</h2>
            <p className="text-white/70 text-sm mb-4 max-w-xl">{posts[0].excerpt}</p>
            <Link to={`/blog/${posts[0].id}`} className="flex items-center gap-2 text-white font-bold text-sm hover:gap-3 transition-all">
              Read More <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map(post => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="inline-block px-3 py-1 text-xs font-black rounded-full mb-3" style={{ background: p.primaryLight, color: p.primary }}>{post.category}</span>
                <h3 className="font-black text-gray-900 mb-2 leading-tight group-hover:text-gray-700 transition-colors">{post.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1"><User size={12} />{post.author}</div>
                  <div className="flex items-center gap-1"><Clock size={12} />{post.readTime} read</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
