import React, { useState, useEffect } from 'react';
import {
    Tag, Plus, Search, Edit2, Trash2,
    ChevronRight, Home, AlertCircle, CheckCircle2, MoreVertical
} from 'lucide-react';
import api from '../../../../utils/api';

const AttributeManager = ({ type, title, placeholder }) => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newValue, setNewValue] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAttributes = async () => {
            setLoading(true);
            try {
                const response = await api.get('attributes/');
                const allAttrs = response.data.results || response.data;
                // Find the specific attribute by name (case insensitive)
                const target = allAttrs.find(a => a.name.toLowerCase() === type.toLowerCase());
                if (target && target.terms) {
                    setTerms(target.terms.split(',').map(t => t.trim()));
                }
            } catch (err) {
                console.error(`Error fetching ${type}:`, err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttributes();
    }, [type]);

    // Save current terms list to backend (find by name → PATCH or POST)
    const saveToBackend = async (updatedTerms) => {
        try {
            const res = await api.get('attributes/');
            const all = res.data.results || res.data;
            const target = all.find(a => a.name.toLowerCase() === type.toLowerCase());
            const termsStr = updatedTerms.join(',');
            if (target) {
                await api.patch(`attributes/${target.id}/`, { terms: termsStr });
            } else {
                await api.post('attributes/', { name: title, terms: termsStr });
            }
        } catch (err) {
            console.error('Backend sync error:', err);
            throw err;
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newValue.trim()) return;
        if (terms.includes(newValue.trim())) {
            setMsg({ type: 'error', text: `"${newValue.trim()}" already exists!` });
            return;
        }
        setIsSubmitting(true);
        try {
            const updatedTerms = [...terms, newValue.trim()];
            await saveToBackend(updatedTerms);
            setTerms(updatedTerms);
            setNewValue('');
            setMsg({ type: 'success', text: `"${newValue.trim()}" added and saved!` });
            setTimeout(() => setMsg({ type: '', text: '' }), 2500);
        } catch (err) {
            setMsg({ type: 'error', text: 'Failed to save. Check backend connection.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (termToDelete) => {
        const updatedTerms = terms.filter(t => t !== termToDelete);
        setTerms(updatedTerms);
        try {
            await saveToBackend(updatedTerms);
            setMsg({ type: 'success', text: `"${termToDelete}" removed.` });
        } catch {
            setMsg({ type: 'error', text: 'Removed locally but failed to sync to server.' });
        }
        setTimeout(() => setMsg({ type: '', text: '' }), 2000);
    };

    const filteredTerms = terms.filter(t =>
        t.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1200px] mx-auto pb-10 space-y-6">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <Home size={14} />
                    <ChevronRight size={12} />
                    <span>Catalog</span>
                    <ChevronRight size={12} />
                    <span>Attributes</span>
                    <ChevronRight size={12} />
                    <span className="text-emerald-500 font-bold">{title} Management</span>
                </div>
            </div>

            {msg.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm animate-in slide-in-from-top-2 duration-300 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {msg.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Add New Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Add New {title}</h3>
                        <p className="text-xs text-gray-400 mb-6 font-medium">Create a new term for your products.</p>
                    </div>

                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Term Name</label>
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                placeholder={placeholder}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newValue.trim()}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Plus size={18} />
                            Add {title}
                        </button>
                    </form>
                </div>

                {/* Right: List & Search */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            Available Terms
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{terms.length}</span>
                        </h3>
                        <div className="relative w-full sm:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search terms..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-medium"
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : filteredTerms.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredTerms.map((term, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-3 bg-gray-50 hover:bg-white hover:shadow-md hover:shadow-gray-100 border border-transparent hover:border-emerald-100 rounded-xl transition-all">
                                        <span className="text-sm font-bold text-gray-700">{term}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-gray-400 hover:text-emerald-500 transition-colors"><Edit2 size={13} /></button>
                                            <button
                                                onClick={() => handleDelete(term)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-gray-50 rounded-2xl">
                                <Tag className="mx-auto text-gray-200 mb-3" size={40} />
                                <p className="text-gray-400 font-bold">No terms found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttributeManager;
