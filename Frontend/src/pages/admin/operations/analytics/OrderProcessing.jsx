import React, { useState, useEffect } from 'react';
import { Box, Search, Filter, Download as ExportIcon, Plus, MoreVertical } from 'lucide-react';
import api from '../../../../utils/api';

const OrderProcessing = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProcessingOrders();
    }, []);

    const fetchProcessingOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/orders/?status=processing');
            setOrders(response.data.results || response.data);
        } catch (error) {
            console.error("Failed to fetch processing orders:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Box size={22} className="text-brand" />
                        Order Processing
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your order processing</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 font-bold bg-white border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-400">#ORD-{order.id.toString().slice(-6)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.user_email || 'Guest'}</td>
                                        <td className="px-6 py-4 text-gray-600">${order.total_amount}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                Processing
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-400 font-bold italic">
                                        No orders in processing.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderProcessing;
