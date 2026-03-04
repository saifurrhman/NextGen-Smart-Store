import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, ShieldCheck, Zap, Plus, Search, Edit2, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';

const PaymentGateways = () => {
    const [loading, setLoading] = useState(true);
    const [gateways, setGateways] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const defaultForm = { name: '', provider: '', transaction_fee: '0.00%', success_rate: '99.0', status: 'active' };
    const [formData, setFormData] = useState(defaultForm);

    const fetchGateways = async () => {
        setLoading(true);
        try {
            // Fix: remove /api/v1 prefix as it's already in baseURL
            const response = await api.get('settings/payment-gateways/');
            setGateways(response.data.results || response.data);
        } catch (error) {
            console.error("Error fetching payment gateways:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGateways();
    }, []);

    const handleOpenAdd = () => {
        setFormData(defaultForm);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleOpenEdit = (gateway) => {
        setSelectedGateway(gateway);
        setFormData({
            name: gateway.name,
            provider: gateway.provider,
            transaction_fee: gateway.transaction_fee,
            success_rate: gateway.success_rate,
            status: gateway.status
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
                success_rate: parseFloat(formData.success_rate)
            };
            if (isEditing) {
                await api.put(`settings/payment-gateways/${selectedGateway.id}/`, payload);
            } else {
                await api.post('settings/payment-gateways/', payload);
            }
            setShowModal(false);
            fetchGateways();
        } catch (error) {
            console.error("Failed to save gateway:", error.response?.data || error.message);
            alert(`Failed to save gateway: ${JSON.stringify(error.response?.data || error.message)}`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async () => {
        setSubmitLoading(true);
        try {
            await api.delete(`settings/payment-gateways/${selectedGateway.id}/`);
            setShowDeleteConfirm(false);
            fetchGateways();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete gateway.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const stats = [
        { label: 'Active Gateways', value: gateways.filter(g => g.status === 'active').length, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        {
            label: 'Total Volume',
            value: gateways.length > 0 ? '$0.00' : '$0.00',
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Avg. Success Rate',
            value: gateways.length > 0
                ? `${(gateways.reduce((acc, g) => acc + parseFloat(g.success_rate || 0), 0) / gateways.length).toFixed(1)}%`
                : '0%',
            icon: Zap,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        { label: 'Saved Cards', value: '0', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' }
    ];

    const filteredGateways = gateways.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payment Gateways</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure and manage payment methods for your store.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={16} />
                    <span>Add New Gateway</span>
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

            {/* Main Table Content */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Connected Gateways</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search gateways..."
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
                                <th className="px-6 py-4">Gateway Name</th>
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4">Transaction Fee</th>
                                <th className="px-6 py-4 text-center">Success Rate</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-400 italic">Connecting to payment server...</td></tr>
                            ) : filteredGateways.length > 0 ? filteredGateways.map((gateway) => (
                                <tr key={gateway.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 text-xs uppercase">
                                                {gateway.name.substring(0, 2)}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800">{gateway.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{gateway.provider}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{gateway.transaction_fee}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-bold text-emerald-600">{gateway.success_rate}%</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${gateway.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {gateway.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(gateway)}
                                                className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedGateway(gateway); setShowDeleteConfirm(true); }}
                                                className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-400 italic">No gateways configured.</td></tr>
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
                            <h3 className="font-bold text-gray-800">{isEditing ? 'Edit Payment Gateway' : 'Add New Gateway'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gateway Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. PayPal, Stripe"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Provider</label>
                                    <input
                                        type="text" required
                                        value={formData.provider}
                                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                        placeholder="e.g. MasterCard, Visa"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transaction Fee</label>
                                    <input
                                        type="text" required
                                        value={formData.transaction_fee}
                                        onChange={(e) => setFormData({ ...formData, transaction_fee: e.target.value })}
                                        placeholder="e.g. 2.9% + 30c"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Success Rate (%)</label>
                                    <input
                                        type="number" step="0.1" required
                                        value={formData.success_rate}
                                        onChange={(e) => setFormData({ ...formData, success_rate: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
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
                                    {submitLoading ? 'Saving...' : 'Save Gateway'}
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
                            <CreditCard size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Delete Gateway?</h3>
                        <p className="text-sm text-gray-500 mt-2">Are you sure you want to remove {selectedGateway?.name}? This might affect active payment processes.</p>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button onClick={() => setShowDeleteConfirm(false)} className="py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                            <button onClick={handleDelete} disabled={submitLoading} className="py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">
                                {submitLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentGateways;
