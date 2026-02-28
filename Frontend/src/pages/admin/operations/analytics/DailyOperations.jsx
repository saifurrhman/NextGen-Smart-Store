import React, { useState, useEffect } from 'react';
import { Sun, Search, Filter, Download as ExportIcon, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import api from '../../../../utils/api';

const DailyOperations = () => {
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDailyStats();
    }, []);

    const fetchDailyStats = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/operations/daily-stats/');
            setOperations(response.data);
        } catch (error) {
            console.error("Failed to fetch daily operations:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOps = operations.filter(op =>
        op.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Sun size={22} className="text-brand" />
                        Daily Operations
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your daily operations</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <ExportIcon size={16} />
                        Export
                    </button>
                    <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search in Daily Operations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto shadow-sm">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 font-bold bg-white">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total Orders</th>
                                <th className="px-6 py-4">Packed</th>
                                <th className="px-6 py-4">Shipped</th>
                                <th className="px-6 py-4">Exceptions</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredOps.length > 0 ? (
                                filteredOps.map((op, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{op.date}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.total_orders.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.packed.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.shipped.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{op.exceptions.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${op.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${op.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                {op.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-gray-400 font-bold italic">
                                        No operation logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredOps.length > 0 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {filteredOps.length} entries</span>
                        <div className="flex gap-1">
                            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-gray-400">Prev</button>
                            <button className="px-3 py-1 bg-brand text-white rounded font-bold shadow-sm">1</button>
                            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyOperations;
