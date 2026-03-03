import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Download, CheckCircle, Clock, X, Info, Trash2 } from 'lucide-react';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import api from '../../../utils/api';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';

const TaxManagement = () => {
    const [taxRules, setTaxRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: ''
    });

    // Form State
    const [formData, setFormData] = useState({
        region: '',
        tax_class: '',
        rate: '',
        is_compound: false,
        status: 'active'
    });

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    useEffect(() => {
        fetchTaxRules();
    }, [searchTerm, filters]);

    const fetchTaxRules = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/v1/settings/tax-regions/?search=${searchTerm}`);
            setTaxRules(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch tax rules:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: '' });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/api/v1/settings/tax-regions/', {
                ...formData,
                rate: parseFloat(formData.rate)
            });
            await fetchTaxRules();
            setIsModalOpen(false);
            setFormData({ region: '', tax_class: '', rate: '', is_compound: false, status: 'active' });
            alert('Tax region added successfully!');
        } catch (error) {
            console.error("Failed to add tax region:", error);
            alert('Failed to add tax region. Please check your data.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} tax rules?`)) return;
        try {
            await Promise.all(selectedIds.map(id => api.delete(`/api/v1/settings/tax-regions/${id}/`)));
            setTaxRules(prev => prev.filter(r => !selectedIds.includes(r.id)));
            clearSelection();
            alert('Tax rules deleted successfully');
        } catch (error) {
            console.error("Bulk delete failed:", error);
            alert('Failed to delete some rules.');
        }
    };

    const handleExportExcel = () => {
        const selectedData = taxRules.filter(r => selectedIds.includes(r.id));
        const dataToExport = selectedData.map(r => ({
            "Region": r.region,
            "Class": r.tax_class,
            "Rate": `${r.rate}%`,
            "Status": r.status,
            "Compound": r.is_compound ? 'Yes' : 'No'
        }));
        exportToExcel(dataToExport, "Tax_Rules_Export");
    };

    const handleExportCSV = () => {
        const selectedData = taxRules.filter(r => selectedIds.includes(r.id));
        const dataToExport = selectedData.map(r => ({
            "Region": r.region,
            "Class": r.tax_class,
            "Rate": `${r.rate}%`,
            "Status": r.status,
            "Compound": r.is_compound ? 'Yes' : 'No'
        }));
        exportToCSV(dataToExport, "Tax_Rules_Export");
    };

    const handleExportPDF = () => {
        const selectedData = taxRules.filter(r => selectedIds.includes(r.id));
        const columns = ["Region", "Class", "Rate", "Status", "Compound"];
        const dataToExport = selectedData.map(r => [
            r.region,
            r.tax_class,
            `${r.rate}%`,
            r.status,
            r.is_compound ? 'Yes' : 'No'
        ]);
        exportToPDF(dataToExport, columns, "Tax_Rules_Export", "Tax Configuration Summary");
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
            ]
        }
    ];

    const filteredRules = taxRules; // API filters

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={24} className="text-emerald-500" />
                        Tax Management
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Configure regional tax brackets and reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold"
                        >
                            <Download size={16} className="text-emerald-600" />
                            Excel
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all font-bold"
                        >
                            <Download size={16} className="text-blue-500" />
                            CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold"
                        >
                            <FileText size={16} className="text-red-500" />
                            PDF
                        </button>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 font-bold"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[400px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tax rules by region or class..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <FilterDropdown
                        options={filterOptions}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        checked={isAllSelected(taxRules)}
                                        onChange={() => toggleAll(taxRules)}
                                    />
                                </th>
                                <th className="px-6 py-4">Tax Region Detail</th>
                                <th className="px-6 py-4">Tax Class</th>
                                <th className="px-6 py-4">Rate</th>
                                <th className="px-6 py-4">Compound</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredRules.length > 0 ? (
                                filteredRules.map((rule) => (
                                    <tr key={rule.id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(rule.id) ? 'bg-emerald-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                checked={selectedIds.includes(rule.id)}
                                                onChange={() => toggleOne(rule.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{rule.region}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{rule.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-600">
                                            {rule.tax_class}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-gray-800">{rule.rate}%</span>
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
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-black text-emerald-500 hover:text-emerald-600 uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 px-3 py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest">
                                        No tax regions found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <BulkActionBar
                    selectedIds={selectedIds}
                    onClear={clearSelection}
                    label={{ singular: "rule", plural: "rules" }}
                    onExportExcel={handleExportExcel}
                    onExportCSV={handleExportCSV}
                    onExportPDF={handleExportPDF}
                    onDelete={handleBulkDelete}
                />
            </div>

            {/* Add New Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#eaf4f0]/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Add New Tax Region</h3>
                                    <p className="text-xs text-gray-500 font-medium">Configure a new regional tax rule</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Region Name</label>
                                    <input
                                        type="text"
                                        name="region"
                                        required
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        placeholder="e.g. California"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Tax Class</label>
                                    <input
                                        type="text"
                                        name="tax_class"
                                        required
                                        value={formData.tax_class}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Retail Sales"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        name="rate"
                                        required
                                        step="0.01"
                                        value={formData.rate}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 7.5"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                <input
                                    type="checkbox"
                                    name="is_compound"
                                    id="is_compound"
                                    checked={formData.is_compound}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="is_compound" className="text-xs font-bold text-gray-600 cursor-pointer flex items-center gap-1.5">
                                    Compound Tax
                                    <Info size={14} className="text-blue-500" />
                                </label>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 uppercase tracking-widest disabled:opacity-50"
                                >
                                    {submitLoading ? 'Saving...' : 'Create Rule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxManagement;
