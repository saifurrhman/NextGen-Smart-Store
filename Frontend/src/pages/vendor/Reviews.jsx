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
    Loader2,
    Download
} from 'lucide-react';
import api from '../../services/api';
import { exportToPDF } from '../../utils/exportUtils'; // Importing the PDF Export utility

const SentimentCard = ({ label, value, colorName = "emerald" }) => {
    // Determine specific basic colors instead of arbitrary tailwind classes
    let colorClass = "text-emerald-600 bg-emerald-50";
    if (colorName === "blue") colorClass = "text-blue-600 bg-blue-50";
    if (colorName === "purple") colorClass = "text-purple-600 bg-purple-50";

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-gray-700">{label}</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
    );
};

const Reviews = () => {
    const [filter, setFilter] = useState('All Ratings');
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        avgRating: "0.0 / 5.0",
        avgRatingValue: 0,
        positiveSentiment: "0 Reviews",
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

    const filteredReviews = reviews.filter(review => {
        if (filter === 'All Ratings') return true;
        if (filter === '5 Stars') return review.rating === 5;
        if (filter === '4 Stars') return review.rating === 4;
        return true;
    });

    // Implement Generate Report functionality
    const handleGenerateReport = () => {
        if (filteredReviews.length === 0) {
            alert('No reviews data available to export.');
            return;
        }

        const columns = ["Customer", "Date", "Rating", "Product", "Status", "Comment"];
        const dataToExport = filteredReviews.map(review => [
            review.user || 'Unknown',
            review.date || 'N/A',
            `${review.rating} Stars`,
            review.product || 'N/A',
            review.status || 'N/A',
            (review.comment && review.comment.length > 50) ? review.comment.substring(0, 50) + "..." : (review.comment || 'N/A')
        ]);

        exportToPDF(dataToExport, columns, "Vendor_Reviews_Report", "Shop Reviews Summary");
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Shop Reviews</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <Download size={16} />
                        Generate Report
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SentimentCard label="Average Rating" value={metrics.avgRating} colorName="emerald" />
                        <SentimentCard label="Positive Sentiment" value={metrics.positiveSentiment} colorName="blue" />
                        <SentimentCard label="Response Rate" value={metrics.responseRate} colorName="purple" />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <h3 className="font-semibold text-gray-800">Customer Feedback</h3>
                            <div className="flex items-center gap-4">
                                <select
                                    className="bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-sm"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option>All Ratings</option>
                                    <option>5 Stars</option>
                                    <option>4 Stars</option>
                                </select>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {filteredReviews.length === 0 ? (
                                <div className="p-10 text-center text-gray-500 text-sm font-medium italic">
                                    No reviews yet or no reviews matching the filter.
                                </div>
                            ) : (
                                filteredReviews.map((review) => (
                                    <div key={review.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{review.user}</p>
                                                            <p className="text-xs text-gray-500">{review.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={14} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-4">"{review.comment}"</p>
                                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <TrendingUp size={14} className="text-emerald-500" />
                                                        Product: <span className="text-gray-800 font-bold">{review.product}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded border ${review.status === 'Replied' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                        }`}>
                                                        {review.status === 'Replied' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                        {review.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:w-48 flex flex-col gap-2 justify-start mt-2 md:mt-0">
                                                <button className="w-full py-2 bg-white text-emerald-600 text-xs font-semibold rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200">
                                                    Reply
                                                </button>
                                                <button className="w-full py-2 text-gray-500 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2">
                                                    <Flag size={14} /> Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reviews;
