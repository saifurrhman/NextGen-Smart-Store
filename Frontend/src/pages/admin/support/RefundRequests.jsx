import React, { useState } from 'react';
import {
    RefreshCcw, Search, MoreVertical,
    Home, ChevronRight, CheckCircle2, XCircle, AlertCircle, Clock, Trash2
} from 'lucide-react';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';

const RefundRequests = () => {
    const initialRequests = [
        { id: 'REF-1001', orderId: 'ORD-5542', customer: 'John Doe', amount: 4500, reason: 'Damaged Product', status: 'Pending', date: '2025-03-01' },
        { id: 'REF-1002', orderId: 'ORD-5530', customer: 'Sarah Khan', amount: 1200, reason: 'Wrong Size', status: 'Approved', date: '2025-02-28' },
        { id: 'REF-1003', orderId: 'ORD-5512', customer: 'Mike Ross', amount: 8900, reason: 'Quality Issue', status: 'Rejected', date: '2025-02-25' },
    ];
    const [requests, setRequests] = useState(initialRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        reason: ''
    });

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Rejected', value: 'Rejected' },
            ]
        },
        {
            key: 'reason',
            label: 'Reason',
            options: [
                { label: 'All Reasons', value: '' },
                { label: 'Damaged Product', value: 'Damaged Product' },
                { label: 'Wrong Size', value: 'Wrong Size' },
                { label: 'Quality Issue', value: 'Quality Issue' },
                { label: 'Changed Mind', value: 'Changed Mind' },
            ]
        }
    ];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: '', reason: '' });
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status === '' || req.status === filters.status;
        const matchesReason = filters.reason === '' || req.reason === filters.reason;

        return matchesSearch && matchesStatus && matchesReason;
    });

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <RefreshCcw size={24} className="text-emerald-500" />
                        Refund & Return Requests
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Support</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Refunds</span>
                    </div>
                </div>
            </div>

            {/* Refund Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Clock size={20} /></span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Action Required</span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800">12 Pending</h4>
                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider font-montserrat">Refunds waiting for review</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><CheckCircle2 size={20} /></span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800">145 Approved</h4>
                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider font-montserrat">Processed this month</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="p-2 bg-red-50 text-red-500 rounded-lg"><XCircle size={20} /></span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800">8 Rejected</h4>
                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider font-montserrat">Policy violations found</p>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by Order ID, Refund ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700"
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
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Request Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRequests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-xs">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{req.id}</span>
                                            <span className="text-[10px] text-gray-400 font-bold tracking-widest">{req.orderId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{req.customer}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-600">{req.reason}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{req.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-extrabold text-gray-900">PKR {req.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 min-w-[70px] text-center py-1 rounded-md text-[10px] font-bold uppercase border ${req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100">Approve</button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                <RefreshCcw size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-gray-400">No refund requests matched your filters</p>
                                            <button onClick={clearFilters} className="text-xs font-bold text-emerald-500 hover:underline">Clear all filters</button>
                                        </div>
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

export default RefundRequests;
