import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Download, CheckCircle, Clock, X, Info, Trash2, Edit2 } from 'lucide-react';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import api from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FORM = { region: '', tax_class: '', rate: '', is_compound: false, status: 'active' };

const TaxManagement = () => {
    const [taxRules, setTaxRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => { fetchTaxRules(); }, [searchTerm, filters]);

    const fetchTaxRules = async () => {
        setLoading(true);
        try {
            let url = `settings/tax-regions/?search=${searchTerm}`;
            if (filters.status) url += `&status=${filters.status}`;
            const response = await api.get(url);
            setTaxRules(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch tax rules:", error);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: '' }), 3500);
    };

    const openCreate = () => {
        setFormData(EMPTY_FORM);
        setIsEditing(false);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEdit = (rule) => {
        setFormData({
            region: rule.region,
            tax_class: rule.tax_class,
            rate: String(rule.rate),
            is_compound: rule.is_compound,
            status: rule.status,
        });
        setEditingId(rule.id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            const payload = {
                ...formData,
                rate: parseFloat(formData.rate),
            };
            if (isEditing) {
                await api.put(`settings/tax-regions/${editingId}/`, payload);
                showMsg('Tax rule updated successfully!', 'success');
            } else {
                await api.post('settings/tax-regions/', payload);
                showMsg('Tax rule created successfully!', 'success');
            }
            await fetchTaxRules();
            setIsModalOpen(false);
            setFormData(EMPTY_FORM);
        } catch (error) {
            console.error("Failed to save tax rule:", error.response?.data);
            showMsg(
                error.response?.data?.detail || Object.values(error.response?.data || {})?.[0]?.[0] || 'Failed to save. Check your data.',
                'error'
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete tax rule "${name}"?`)) return;
        setDeleteLoading(id);
        try {
            await api.delete(`settings/tax-regions/${id}/`);
            setTaxRules(prev => prev.filter(r => r.id !== id));
            setSelectedIds(prev => prev.filter(s => s !== id));
            showMsg('Tax rule deleted.', 'success');
        } catch (error) {
            showMsg('Failed to delete. Please try again.', 'error');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} tax rule(s)?`)) return;
        const results = await Promise.allSettled(
            selectedIds.map(id => api.delete(`settings/tax-regions/${id}/`))
        );
        const successes = selectedIds.filter((_, i) => results[i].status === 'fulfilled');
        const failures = results.length - successes.length;
        setTaxRules(prev => prev.filter(r => !successes.includes(r.id)));
        setSelectedIds([]);
        if (failures > 0) showMsg(`${successes.length} deleted, ${failures} failed.`, 'error');
        else showMsg(`${successes.length} rule(s) deleted.`, 'success');
    };

    const toggleAll = () => {
        if (selectedIds.length === taxRules.length) setSelectedIds([]);
        else setSelectedIds(taxRules.map(r => r.id));
    };
    const toggleOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const handleExportExcel = () => exportToExcel(taxRules.map(r => ({ Region: r.region, Class: r.tax_class, Rate: `${r.rate}%`, Status: r.status, Compound: r.is_compound ? 'Yes' : 'No' })), "Tax_Rules_Export");
    const handleExportCSV = () => exportToCSV(taxRules.map(r => ({ Region: r.region, Class: r.tax_class, Rate: `${r.rate}%`, Status: r.status, Compound: r.is_compound ? 'Yes' : 'No' })), "Tax_Rules_Export");
    const handleExportPDF = () => exportToPDF(taxRules.map(r => [r.region, r.tax_class, `${r.rate}%`, r.status, r.is_compound ? 'Yes' : 'No']), ["Region", "Class", "Rate", "Status", "Compound"], "Tax_Rules_Export", "Tax Configuration Summary");

    const filterOptions = [{ key: 'status', label: 'Status', options: [{ label: 'All Status', value: '' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }] }];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={24} className="text-emerald-500" />Tax Management
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Configure regional tax brackets and rules</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all"><Download size={16} className="text-emerald-600" />Excel</button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all"><Download size={16} className="text-blue-500" />CSV</button>
                        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"><FileText size={16} className="text-red-500" />PDF</button>
                    </div>
                    <button onClick={openCreate} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100">
                        <Plus size={18} />Add New
                    </button>
                </div>
            </div>

            {/* Message */}
            {msg.text && (
                <div className={`px-4 py-3 rounded-xl text-sm font-semibold border ${msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{msg.text}</div>
            )}

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                    <span className="text-sm font-bold text-gray-700">{selectedIds.length} selected</span>
                    <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
                        <Trash2 size={12} />Delete Selected
                    </button>
                    <button onClick={() => setSelectedIds([])} className="text-xs text-gray-400 hover:text-gray-600 ml-auto">Clear</button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by region or class..." value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm" />
                    </div>
                    <FilterDropdown options={filterOptions} activeFilters={filters}
                        onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
                        onClear={() => setFilters({ status: '' })} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        checked={taxRules.length > 0 && selectedIds.length === taxRules.length}
                                        onChange={toggleAll} />
                                </th>
                                <th className="px-6 py-4">Tax Region</th>
                                <th className="px-6 py-4">Tax Class</th>
                                <th className="px-6 py-4">Rate</th>
                                <th className="px-6 py-4">Compound</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse"><td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full" /></td></tr>
                                ))
                            ) : taxRules.length > 0 ? (
                                taxRules.map(rule => (
                                    <tr key={rule.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(rule.id) ? 'bg-emerald-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                checked={selectedIds.includes(rule.id)} onChange={() => toggleOne(rule.id)} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{rule.region}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">ID: {rule.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-600">{rule.tax_class}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-gray-800">{Number(rule.rate).toFixed(2)}%</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rule.is_compound ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {rule.is_compound ? 'YES' : 'NO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full ${rule.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {rule.status === 'active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                {rule.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(rule)}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Edit2 size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(rule.id, rule.region)}
                                                    disabled={deleteLoading === rule.id}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-100">
                                                    {deleteLoading === rule.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                                    ) : <Trash2 size={15} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest">
                                        No tax regions found.
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#eaf4f0]/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                        {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Tax Rule' : 'Add New Tax Rule'}</h3>
                                        <p className="text-xs text-gray-500 font-medium">Configure regional tax settings</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Region Name *</label>
                                        <input type="text" name="region" required value={formData.region} onChange={handleInputChange}
                                            placeholder="e.g. California"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Tax Class *</label>
                                        <input type="text" name="tax_class" required value={formData.tax_class} onChange={handleInputChange}
                                            placeholder="e.g. Standard GST"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Tax Rate (%) *</label>
                                        <input type="number" name="rate" required step="0.01" min="0" max="100" value={formData.rate} onChange={handleInputChange}
                                            placeholder="e.g. 17.5"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                    <input type="checkbox" name="is_compound" id="is_compound"
                                        checked={formData.is_compound} onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                                    <label htmlFor="is_compound" className="text-xs font-bold text-gray-600 cursor-pointer flex items-center gap-1.5">
                                        Compound Tax <Info size={14} className="text-blue-500" />
                                    </label>
                                </div>

                                {/* Error display from submit */}
                                {msg.text && msg.type === 'error' && (
                                    <div className="px-3 py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100">{msg.text}</div>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                    <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all uppercase tracking-widest">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={submitLoading}
                                        className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 uppercase tracking-widest disabled:opacity-50">
                                        {submitLoading ? 'Saving...' : isEditing ? 'Update Rule' : 'Create Rule'}
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

export default TaxManagement;
