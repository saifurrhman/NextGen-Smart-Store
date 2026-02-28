import React, { useState, useEffect } from 'react';
import {
    Users, UserPlus, UserCheck, UserX, Search, Filter,
    Download, MoreVertical, Mail, Phone, MapPin, Calendar,
    ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Trash2,
    Edit, Eye, ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell,
    MessageSquare, Copy, ArrowUp
} from 'lucide-react';
import api from '../../../utils/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, active: 0, new: 0, vips: 0 });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get('/api/v1/users/customers/');
                setCustomers(response.data);

                // Real stats calculation
                setStats({
                    total: response.data.length,
                    active: response.data.length, // Simple assumption for now
                    new: response.data.filter(u => new Date(u.date_joined) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
                    vips: 0
                });
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Manage and view your customer base</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* 4 STAT CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                                <Users size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Customers</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-2xl font-bold text-gray-800">{stats.total.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Active Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                                <UserCheck size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-1">Active Customers</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-2xl font-bold text-gray-800">{stats.active.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>

                    {/* New Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                                <UserPlus size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-1">New Customers</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-2xl font-bold text-gray-800">{stats.new.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Churned Customers Card */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10">
                            <MoreVertical size={18} />
                        </button>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                                <UserX size={20} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-1">VIP Customers</h3>
                            <div className="flex items-end gap-3">
                                <h2 className="text-2xl font-bold text-gray-800">{stats.vips.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                                <Filter size={18} /> Filters
                            </button>
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                                <Download size={18} /> Export
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                    <th className="py-4 px-6 rounded-tl-xl text-emerald-600">ID</th>
                                    <th className="py-4 px-4 text-emerald-600">Customer</th>
                                    <th className="py-4 px-4 text-emerald-600">Phone</th>
                                    <th className="py-4 px-4 text-center text-emerald-600">Orders</th>
                                    <th className="py-4 px-4 text-emerald-600">Spend</th>
                                    <th className="py-4 px-4 text-emerald-600">Status</th>
                                    <th className="py-4 px-6 rounded-tr-xl text-right text-emerald-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 font-medium divide-y divide-gray-50">
                                {customers.map((customer, idx) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6 font-bold text-gray-400 group-hover:text-emerald-500 transition-colors">
                                            #{customer.id.toString().slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shadow-sm capitalize">
                                                    {customer.first_name?.[0] || customer.email[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">
                                                        {customer.first_name || 'N/A'} {customer.last_name || ''}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 font-medium">{customer.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600 font-bold">{customer.phone_number || 'N/A'}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">0</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-bold text-gray-800">$0.00</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-full ${customer.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${customer.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-400 hover:text-emerald-500 bg-gray-50 rounded-lg hover:shadow-sm transition-all"><Mail size={16} /></button>
                                                <button className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg hover:shadow-sm transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Users size={40} className="text-gray-200" />
                                                <p className="text-gray-400 font-bold">No customers found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customers;
