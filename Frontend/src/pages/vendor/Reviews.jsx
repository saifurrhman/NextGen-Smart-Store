import React, { useState } from 'react';
import {
    Star,
    MessageSquare,
    ThumbsUp,
    Flag,
    Search,
    Filter,
    ChevronRight,
    User,
    CheckCircle2,
    AlertCircle,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const SentimentCard = ({ label, value, percentage, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                {percentage}
            </span>
        </div>
        <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{value}</h3>
        <div className="w-full h-1.5 bg-gray-50 rounded-full mt-4 overflow-hidden">
            <div className={`h-full ${color.replace('bg-', 'bg-opacity-100 bg-')}`} style={{ width: percentage }} />
        </div>
    </div>
);

const Reviews = () => {
    const [filter, setFilter] = useState('All');

    const reviews = [
        { id: 1, user: 'Alex Rivera', rating: 5, comment: 'Exceptional service and the product quality exceeded my expectations. Delivery was surprisingly fast!', date: '2 hours ago', product: 'Ultra-Slim Pro Laptop', status: 'Replied' },
        { id: 2, user: 'Sarah Chen', rating: 4, comment: 'Great products but the packaging could be better. Overall very satisfied with the purchase.', date: '1 day ago', product: 'Wireless Headphones', status: 'Pending' },
        { id: 3, user: 'Marco V.', rating: 5, comment: 'The best merchant on this platform. Reliable and professional communication.', date: '3 days ago', product: 'Mechanical Keyboard', status: 'Replied' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight uppercase">Sentiment Analysis</h1>
                    <p className="text-sm text-gray-500 font-medium">Monitoring customer feedback and storefront reputation metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SentimentCard label="Average Rating" value="4.8 / 5.0" percentage="96%" color="bg-emerald-500" />
                <SentimentCard label="Positive Sentiment" value="128 Reviews" percentage="88%" color="bg-blue-500" />
                <SentimentCard label="Response Rate" value="92.4%" percentage="92%" color="bg-purple-500" />
            </div>

            {/* Reviews Stream */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em]">Customer Discourse</h3>
                    <div className="flex items-center gap-4">
                        <select className="bg-gray-50 border-none text-[10px] font-bold uppercase tracking-widest rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
                            <option>All Ratings</option>
                            <option>5 Stars</option>
                            <option>4 Stars</option>
                        </select>
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {reviews.map((review, i) => (
                        <div key={review.id} className="p-8 hover:bg-neutral-50/50 transition-colors group">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{review.user}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{review.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4">"{review.comment}"</p>
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-50/50">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <TrendingUp size={12} className="text-emerald-500" />
                                            Product: <span className="text-gray-800">{review.product}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${review.status === 'Replied' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {review.status === 'Replied' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                            {review.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-48 flex flex-col gap-2">
                                    <button className="w-full py-2.5 bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-gray-100">Initialize Reply</button>
                                    <button className="w-full py-2.5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-rose-600 transition-all flex items-center justify-center gap-2">
                                        <Flag size={12} /> Flag Audit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-gray-50/30 border-t border-gray-50 text-center">
                    <button className="text-[10px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-all">
                        Synchronize Global Feedback Archives
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Reviews;
