import React, { useState, useEffect } from 'react';
import { Percent, Globe, BookText, Scale, Plus, Search, Edit2, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';

const TaxConfiguration = () => {
    const [loading, setLoading] = useState(true);
    const [taxRegions, setTaxRegions] = useState([]);

    useEffect(() => {
        const fetchTaxRegions = async () => {
            try {
                const response = await api.get('/api/v1/settings/tax-regions/');
                setTaxRegions(response.data.results || response.data);
            } catch (error) {
                console.error("Error fetching tax regions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTaxRegions();
    }, []);

    const stats = [
        { label: 'Configured Regions', value: taxRegions.length, icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        {
            label: 'Standard Rate',
            value: taxRegions.length > 0
                ? `${Math.max(...taxRegions.map(r => r.rate))}%`
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tax Configuration</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage tax rules, classes and regional tax settings for automation.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200">
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
                            ) : taxRegions.length > 0 ? taxRegions.map((tax, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
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
                                            <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
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
