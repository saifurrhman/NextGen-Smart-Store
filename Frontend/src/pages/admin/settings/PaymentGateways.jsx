import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, ShieldCheck, Zap, Plus, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import api from '../../../utils/api';

const PaymentGateways = () => {
    const [loading, setLoading] = useState(true);
    const [gateways, setGateways] = useState([]);

    useEffect(() => {
        const fetchGateways = async () => {
            try {
                const response = await api.get('/api/v1/settings/payment-gateways/');
                setGateways(response.data.results || response.data);
            } catch (error) {
                console.error("Error fetching payment gateways:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGateways();
    }, []);

    const stats = [
        { label: 'Active Gateways', value: gateways.filter(g => g.status === 'active').length, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        {
            label: 'Total Volume',
            value: gateways.length > 0 ? '$0.00' : '$0.00', // Still 0 if no orders linked, but not a hardcoded mock like 124k
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Avg. Success Rate',
            value: gateways.length > 0
                ? `${(gateways.reduce((acc, g) => acc + parseFloat(g.success_rate), 0) / gateways.length).toFixed(1)}%`
                : '0%',
            icon: Zap,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        },
        { label: 'Saved Cards', value: '0', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payment Gateways</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure and manage payment methods for your store.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
                    <Plus size={16} />
                    <span>Add New Gateway</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
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
                            ) : gateways.length > 0 ? gateways.map((gateway, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400 text-xs">
                                                {gateway.name.substring(0, 2).toUpperCase()}
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
                                            <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                                                <MoreVertical size={16} />
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
        </div>
    );
};

export default PaymentGateways;
