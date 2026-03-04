import React, { useState, useEffect } from 'react';
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
    TrendingUp,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const SentimentCard = ({ label, value, percentage, colorName = "emerald" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${colorName}-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />

        <div className="flex justify-between items-start mb-6 relative z-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{label}</p>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg bg-${colorName}-50 text-${colorName}-600 tracking-widest`}>
                {percentage}
            </span>
        </div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter relative z-10">{value}</h3>
        <div className="w-full h-2 bg-gray-50 rounded-full mt-6 overflow-hidden relative z-10">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: percentage }}
                transition={{ duration: 1, ease: "circOut" }}
                className={`h-full bg-${colorName}-500/80 group-hover:bg-${colorName}-500 transition-colors`}
            />
        </div>
    </motion.div>
);

const Reviews = () => {
    const [filter, setFilter] = useState('All'); // This state is not used in the provided snippet, but kept for context
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        avgRating: "0.0 / 5.0",
        avgRatingValue: 0,
        positiveSentiment: "0 Reviews",
        sentimentPercentage: "0%",
        responseRate: "0%",
        totalReviews: 0
    });
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/vendors/reviews/');
                if (response.data) {
                    setMetrics(response.data.metrics);
                    setReviews(response.data.reviews || []);
                }
            } catch (error) {
                console.error("Failed to fetch shop reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Sentiment Analysis</h1>
                    <p className="text-sm text-gray-400 font-medium">Monitoring customer feedback and storefront reputation metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SentimentCard label="Average Rating" value={metrics.avgRating} percentage={metrics.sentimentPercentage} colorName="emerald" />
                <SentimentCard label="Positive Sentiment" value={metrics.positiveSentiment} percentage={metrics.sentimentPercentage} colorName="blue" />
                <SentimentCard label="Response Rate" value={metrics.responseRate} percentage={metrics.responseRate} colorName="purple" />
            </div>

            {/* Reviews Stream */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
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
                    {reviews.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 text-xs font-black uppercase tracking-widest">
                            No consumer feedback discovered yet.
                        </div>
                    ) : (
                        reviews.map((review, i) => (
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
                        ))
                    )}
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
