import React, { useState, useEffect } from 'react';
import { Percent, Globe, BookText, Scale, Plus, Search, Edit2, Trash2, ShieldCheck, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import api from '../../../utils/api';

const TaxConfiguration = () => {
    const [loading, setLoading] = useState(true);
    const [taxRegions, setTaxRegions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTax, setSelectedTax] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const defaultForm = { region: '', tax_class: 'Standard', rate: '', is_compound: false, status: 'active' };
    const [formData, setFormData] = useState(defaultForm);

    const fetchTaxRegions = async () => {
        setLoading(true);
        try {
            // Fix: remove /api/v1 prefix as it's already in baseURL
            const response = await api.get('settings/tax-regions/');
            setTaxRegions(response.data.results || response.data);
        } catch (error) {
            console.error("Error fetching tax regions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxRegions();
    }, []);

    const handleOpenAdd = () => {
        setFormData(defaultForm);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleOpenEdit = (tax) => {
        setSelectedTax(tax);
        setFormData({
            region: tax.region,
            tax_class: tax.tax_class,
            rate: tax.rate,
            is_compound: tax.is_compound,
            status: tax.status
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const payload = {
                ...formData,
                rate: parseFloat(formData.rate)
            };
            if (isEditing) {
                await api.put(`settings/tax-regions/${selectedTax.id}/`, payload);
            } else {
                await api.post('settings/tax-regions/', payload);
            }
            setShowModal(false);
            fetchTaxRegions();
        } catch (error) {
            console.error("Failed to save tax rule:", error.response?.data || error.message);
            alert(`Failed to save tax rule: ${JSON.stringify(error.response?.data || error.message)}`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async () => {
        setSubmitLoading(true);
        try {
            await api.delete(`settings/tax-regions/${selectedTax.id}/`);
            setShowDeleteConfirm(false);
            fetchTaxRegions();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete tax rule.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const stats = [
        { label: 'Configured Regions', value: taxRegions.length, icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        {
            label: 'Standard Rate',
            value: taxRegions.length > 0
                ? `${Math.max(...taxRegions.map(r => parseFloat(r.rate) || 0))}%`
                : '0.00%',
            icon: Percent,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Active Rules',
            value: taxRegions.filter(r => r.status === 'active').length,
            icon: Scale,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        {
            label: 'Compliance Status',
            value: taxRegions.length > 0 && taxRegions.every(r => r.status === 'active') ? 'Full' : 'Partial',
            icon: ShieldCheck,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        }
    ];

    const filteredRegions = taxRegions.filter(r =>
        r.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tax_class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tax Configuration</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage tax rules, classes and regional tax settings for automation.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={16} />
                    <span>Add Tax Rule</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <h3 className="text-xl font-bold text-gray-800 mt-1">{loading ? '...' : stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Tax Regions & Rules</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search regions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-50 border-none rounded-lg pl-9 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500/20 w-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 font-bold text-xs text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Tax Region</th>
                                <th className="px-6 py-4">Tax Class</th>
                                <th className="px-6 py-4 text-center">Tax Rate (%)</th>
                                <th className="px-6 py-4 text-center">Type</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-400 italic">Calculating local tax rules...</td></tr>
                            ) : filteredRegions.length > 0 ? filteredRegions.map((tax) => (
                                <tr key={tax.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                                <Globe size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800">{tax.region}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <BookText size={14} className="text-gray-400" />
                                            {tax.tax_class}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-bold text-emerald-600">{tax.rate}%</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${tax.is_compound ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {tax.is_compound ? 'Compound' : 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${tax.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {tax.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(tax)}
                                                className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedTax(tax); setShowDeleteConfirm(true); }}
                                                className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-400 italic">No tax rules found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">{isEditing ? 'Edit Tax Rule' : 'Add New Tax Rule'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Region Name</label>
                                <input
                                    type="text" required
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    placeholder="e.g. Sindh, Punjab, Federal"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tax Class</label>
                                    <input
                                        type="text" required
                                        value={formData.tax_class}
                                        onChange={(e) => setFormData({ ...formData, tax_class: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate (%)</label>
                                    <input
                                        type="number" step="0.01" required
                                        value={formData.rate}
                                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox" id="is_compound"
                                    checked={formData.is_compound}
                                    onChange={(e) => setFormData({ ...formData, is_compound: e.target.checked })}
                                    className="w-4 h-4 accent-emerald-500"
                                />
                                <label htmlFor="is_compound" className="text-sm font-medium text-gray-700">Compound Tax Rule</label>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">Cancel</button>
                                <button type="submit" disabled={submitLoading} className="flex-1 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2">
                                    {submitLoading ? 'Saving...' : 'Save Rule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 p-6 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Delete Tax Rule?</h3>
                        <p className="text-sm text-gray-500 mt-2">Are you sure you want to delete the rule for {selectedTax?.region}? This action cannot be undone.</p>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button onClick={() => setShowDeleteConfirm(false)} className="py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                            <button onClick={handleDelete} disabled={submitLoading} className="py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">
                                {submitLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-amber-900">Compliance Warning</h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        Automatic tax calculations for Punjab and Sindh have been updated based on the latest regional guidelines.
                        Please ensure all <span className="font-bold">NTN/GST</span> numbers are valid for proper invoicing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TaxConfiguration;
