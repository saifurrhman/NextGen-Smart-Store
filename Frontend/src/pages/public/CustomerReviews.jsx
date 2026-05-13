import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';

const reviews = [
  { name: 'Ahmed Khan', rating: 5, date: 'May 2026', product: 'Nike Dri-FIT T-Shirt', comment: 'Amazing quality! The material is super soft and comfortable. Delivery was fast too. Highly recommend!', avatar: 'AK' },
  { name: 'Sara Malik', rating: 5, date: 'Apr 2026', product: 'Jordan 1 High Sneakers', comment: 'Exactly as described. Beautiful shoes, perfect fit. NextGen Store is now my go-to shopping platform.', avatar: 'SM' },
  { name: 'Usman Ali', rating: 4, date: 'Apr 2026', product: 'Fashion Accessories', comment: 'Good quality products. Delivery took 4 days which was acceptable. Will shop again!', avatar: 'UA' },
  { name: 'Fatima Noor', rating: 5, date: 'Mar 2026', product: 'Summer Collection', comment: 'Love the variety of products available. Customer support was very helpful when I had a question.', avatar: 'FN' },
  { name: 'Bilal Raza', rating: 5, date: 'Mar 2026', product: 'Sports Wear', comment: 'Best online shopping experience in Pakistan. Easy returns, fast delivery, and great prices!', avatar: 'BR' },
  { name: 'Zara Hassan', rating: 4, date: 'Feb 2026', product: 'Winter Collection', comment: 'The clothes quality is really good. Sizes are accurate as per description. Happy customer!', avatar: 'ZH' },
];

const CustomerReviews = () => {
  const { activeTheme } = useTheme();
  const p = themes[activeTheme] || themes.green;
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-gray-900">Home</Link><span>/</span>
          <span style={{ color: p.primary }} className="font-bold">Customer Reviews</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3">What Our Customers Say</h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => <Star key={s} size={28} fill="#f59e0b" stroke="#f59e0b" />)}
            </div>
            <span className="text-4xl font-black text-gray-900">{avg}</span>
          </div>
          <p className="text-gray-500">Based on {reviews.length} verified reviews</p>
        </div>

        {/* Rating Bars */}
        <div className="max-w-sm mx-auto mb-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = reviews.filter(r => r.rating === rating).length;
            const pct = (count / reviews.length) * 100;
            return (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-gray-600 w-4">{rating}</span>
                <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: p.primary }} />
                </div>
                <span className="text-xs text-gray-400 w-4">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md" style={{ background: p.primary }}>
                  {review.avatar}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? '#f59e0b' : 'none'} stroke={s <= review.rating ? '#f59e0b' : '#d1d5db'} />)}
              </div>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: p.primary }}>{review.product}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 text-white font-black rounded-xl shadow-lg" style={{ background: p.primary }}>
            Shop Now & Leave a Review
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
