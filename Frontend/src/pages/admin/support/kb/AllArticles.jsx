import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Plus, MoreVertical, Edit2, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const AllArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [formData, setFormData] = useState({ title: '', category: '', content: '' });
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, [searchTerm]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            // Using relative path for api utility
            const response = await api.get(`support/knowledge-base/?search=${searchTerm}`);
            setArticles(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleOpenCreate = () => {
        setFormData({ title: '', category: '', content: '' });
        setIsEditing(false);
        setSelectedArticle(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (article) => {
        setFormData({ title: article.title, category: article.category, content: article.content });
        setSelectedArticle(article);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await api.delete(`support/knowledge-base/${id}/`);
            showMsg('Article deleted successfully!', 'success');
            fetchArticles();
        } catch (error) {
            showMsg('Failed to delete article.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditing) {
                await api.put(`support/knowledge-base/${selectedArticle.id}/`, formData);
                showMsg('Article updated successfully!', 'success');
            } else {
                await api.post('support/knowledge-base/', formData);
                showMsg('Article created successfully!', 'success');
            }
            setIsModalOpen(false);
            fetchArticles();
        } catch (error) {
            showMsg('Failed to save article. Please check all fields.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <BookOpen size={22} className="text-brand" />
                        Knowledge Base Articles
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your internal and public help articles</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark transition-all shadow-sm"
                >
                    <Plus size={16} />
                    Create Article
                </button>
            </div>

            {msg.text && (
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold border ${msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {msg.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand shadow-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-emerald-800 font-bold bg-[#eaf4f0]">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">Views</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : articles.length > 0 ? (
                                articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-800">{article.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand/10 text-brand border border-brand/20">
                                                {article.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-500 font-medium">{article.views || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <button
                                                    onClick={() => handleOpenEdit(article)}
                                                    className="p-1.5 hover:bg-gray-100 rounded hover:text-brand transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center text-gray-400 font-bold italic">
                                        No articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <BookOpen size={20} className="text-brand" />
                                    {isEditing ? 'Edit Article' : 'Create New Article'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Title *</label>
                                    <input type="text" required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium" placeholder="E.g. How to track my order?" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Category *</label>
                                    <input type="text" required value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand font-medium" placeholder="E.g. Shipping, Account, Orders" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Content *</label>
                                    <textarea required rows="6" value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none font-medium" placeholder="Write the full content of the article..." />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-dark shadow-lg shadow-brand/20 transition-all disabled:opacity-50">
                                        {submitting ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllArticles;
