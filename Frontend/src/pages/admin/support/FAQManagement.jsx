import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Search, ChevronDown, AlertCircle, CheckCircle2, X } from 'lucide-react';
import api from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const FAQManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({ title: '', category: '', content: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, [page, searchTerm]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            let url = `support/knowledge-base/?page=${page}&search=${searchTerm}`;
            const res = await api.get(url);
            setArticles(res.data.results || res.data);
            setPagination({ count: res.data.count || 0, next: res.data.next, previous: res.data.previous });
        } catch (err) {
            console.error('Failed to fetch FAQs', err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const resetForm = () => {
        setFormData({ title: '', category: '', content: '' });
        setIsEditing(false);
        setSelectedArticle(null);
    };

    const handleEdit = (article) => {
        setFormData({ title: article.title, category: article.category, content: article.content });
        setSelectedArticle(article);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this FAQ article?')) return;
        try {
            await api.delete(`support/knowledge-base/${id}/`);
            showMsg('Article deleted.', 'success');
            fetchArticles();
        } catch {
            showMsg('Failed to delete article.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEditing) {
                await api.put(`support/knowledge-base/${selectedArticle.id}/`, formData);
                showMsg('Article updated!', 'success');
            } else {
                await api.post('support/knowledge-base/', formData);
                showMsg('Article created!', 'success');
            }
            setIsModalOpen(false);
            resetForm();
            fetchArticles();
        } catch {
            showMsg('Failed to save article.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const totalPages = Math.ceil(pagination.count / 10);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <BookOpen size={22} className="text-brand" />
                        FAQ Management
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Create and manage knowledge base articles and FAQs</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-sm"
                    style={{ background: '#4EA674' }}
                >
                    <Plus size={16} />
                    New Article
                </button>
            </div>

            {/* Message */}
            {msg.text && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {msg.text}
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/30">
                    <div className="relative w-full max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Articles Accordion List */}
                <div className="divide-y divide-gray-100 min-h-[400px]">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-5 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/4" />
                            </div>
                        ))
                    ) : articles.length > 0 ? (
                        articles.map(article => (
                            <div key={article.id} className="bg-white">
                                <div
                                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                                    onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                                            style={{ background: '#4EA674' }}>
                                            {(article.category || 'F')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{article.title}</p>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={e => { e.stopPropagation(); handleEdit(article); }}
                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDelete(article.id); }}
                                            className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform ${expandedId === article.id ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedId === article.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 pt-1">
                                                <div className="pl-11 text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                    {article.content}
                                                </div>
                                                <p className="text-xs text-gray-400 pl-11 mt-2">
                                                    Last updated: {new Date(article.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-400 font-bold">
                            No FAQ articles found.
                        </div>
                    )}
                </div>

                {pagination.count > 10 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <span>Showing {articles.length} of {pagination.count} articles</span>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.previous}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">←</button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button key={i} onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1 rounded font-bold ${page === i + 1 ? 'bg-brand text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => setPage(p => p + 1)} disabled={!pagination.next}
                                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">→</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100" style={{ background: 'linear-gradient(to right, #EAF8E7, white)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4EA674' }}>
                                        <BookOpen size={16} className="text-white" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-800">
                                        {isEditing ? 'Edit Article' : 'New FAQ Article'}
                                    </h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Title *</label>
                                    <input type="text" name="title" required value={formData.title}
                                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                        placeholder="How do I reset my password?" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Category *</label>
                                    <input type="text" name="category" required value={formData.category}
                                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                        placeholder="Account, Orders, Shipping..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Content *</label>
                                    <textarea name="content" required rows={5} value={formData.content}
                                        onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
                                        placeholder="Write the full answer here..." />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitting}
                                        className="px-5 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-60"
                                        style={{ background: '#4EA674' }}>
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

export default FAQManagement;
