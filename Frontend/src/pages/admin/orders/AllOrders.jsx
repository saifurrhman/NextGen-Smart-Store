import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Download, Plus,
    MoreVertical, Headphones,
    Shirt, Wallet, Dumbbell, Coffee, Camera, Truck, FileText,
    Eye, XCircle, X
} from 'lucide-react';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';

const AllOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, new: 0, completed: 0, canceled: 0 });
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        payment: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [msg, setMsg] = useState({ type: '', text: '' });

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let url = 'orders/?';
                if (filter !== 'all') {
                    if (filter === 'completed') url += 'status=delivered&';
                    else if (filter === 'pending') url += 'status=pending&';
                    else if (filter === 'canceled') url += 'status=canceled&';
                }

                if (filters.status !== '') url += `status=${filters.status}&`;
                if (searchTerm) url += `search=${searchTerm}&`;

                const response = await api.get(url);
                setOrders(response.data);

                const total = response.data.length;
                const newOrders = response.data.filter(o => o.status === 'pending').length;
                const completed = response.data.filter(o => o.status === 'delivered').length;
                const canceled = response.data.filter(o => o.status === 'canceled').length;
                setStats({ total, new: newOrders, completed, canceled });
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [filter, filters, searchTerm]);

    const handleDropdownFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: '', payment: '' });
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        const dataToExport = filteredOrders.map(order => ({
            "Order ID": order.id,
            "Product": order.items?.[0]?.product_details?.title || 'No internal items',
            "Date": new Date(order.created_at).toLocaleDateString(),
            "Price": parseFloat(order.total_amount).toFixed(2),
            "Status": order.status
        }));
        exportToExcel(dataToExport, "All_Orders_Export");
    };

    const handleExportCSV = () => {
        const dataToExport = filteredOrders.map(order => ({
            "Order ID": order.id,
            "Product": order.items?.[0]?.product_details?.title || 'No internal items',
            "Date": new Date(order.created_at).toLocaleDateString(),
            "Price": parseFloat(order.total_amount).toFixed(2),
            "Status": order.status
        }));
        exportToCSV(dataToExport, "All_Orders_Export");
    };

    const handleExportPDF = () => {
        const columns = ["Order ID", "Product", "Date", "Price", "Status"];
        const dataToExport = filteredOrders.map(order => [
            order.id,
            order.items?.[0]?.product_details?.title || 'No internal items',
            new Date(order.created_at).toLocaleDateString(),
            `$${parseFloat(order.total_amount).toFixed(2)}`,
            order.status
        ]);
        exportToPDF(dataToExport, columns, "All_Orders_Export", "Order Management Summary Report");
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected orders?`)) return;
        try {
            await Promise.all(selectedIds.map(id => api.delete(`orders/${id}/`)));
            setOrders(prev => prev.filter(o => !selectedIds.includes(o.id)));
            setMsg({ type: 'success', text: `${selectedIds.length} orders deleted successfully!` });
            clearSelection();
            setTimeout(() => setMsg({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Failed to delete orders:", error);
            alert('Failed to delete some orders.');
        }
    };

    const handleBulkExportExcel = () => {
        const selectedData = orders.filter(o => selectedIds.includes(o.id));
        const dataToExport = selectedData.map(order => ({
            "Order ID": order.id,
            "Product": order.items?.[0]?.product_details?.title || '—',
            "Date": new Date(order.created_at).toLocaleDateString(),
            "Price": parseFloat(order.total_amount).toFixed(2),
            "Status": order.status
        }));
        exportToExcel(dataToExport, `Selected_Orders_${selectedIds.length}`);
    };

    const filterOptions = [
        {
            key: 'status',
            label: 'Order Status',
            options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Packed', value: 'packed' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Canceled', value: 'canceled' },
            ]
        },
        {
            key: 'payment',
            label: 'Payment Status',
            options: [
                { label: 'All', value: '' },
                { label: 'Paid', value: 'paid' },
                { label: 'Unpaid', value: 'unpaid' },
            ]
        }
    ];

    const getIcon = (productName) => {
        if (!productName) return Headphones;
        const name = productName.toLowerCase();
        if (name.includes('shirt')) return Shirt;
        if (name.includes('wallet')) return Wallet;
        if (name.includes('dumbbell')) return Dumbbell;
        if (name.includes('coffee')) return Coffee;
        if (name.includes('webcam') || name.includes('camera')) return Camera;
        return Headphones;
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'completed') return order.status === 'delivered';
        if (filter === 'pending') return order.status === 'pending';
        if (filter === 'canceled') return order.status === 'canceled';
        return true;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Order List</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                                onClick={handleExportExcel}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all"
                            >
                                <Download size={16} className="text-emerald-600" />
                                Excel
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all"
                            >
                                <Download size={16} className="text-blue-500" />
                                CSV
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                <FileText size={16} className="text-red-500" />
                                PDF
                            </button>
                        </div>
                        <button
                            onClick={() => navigate('/admin/orders/create')}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                        >
                            <Plus size={16} /> Add Order
                        </button>
                    </div>
                </div>

                {/* TOP STAT CARDS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Total Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-black text-gray-800">{stats.total.toLocaleString()}</h2>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Last 7 days</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">New Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-black text-gray-800">{stats.new.toLocaleString()}</h2>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Last 7 days</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Completed Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-black text-gray-800">{stats.completed.toLocaleString()}</h2>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Last 7 days</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative group transition-all hover:border-emerald-100">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Canceled Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-black text-gray-800">{stats.canceled.toLocaleString()}</h2>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Last 7 days</p>
                    </div>
                </div>

                {/* TABLE CONTAINER */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Table Header/Toolbar */}
                    <div className="flex flex-col lg:flex-row justify-between items-center p-4 gap-4 bg-gray-50/30 border-b border-gray-50">
                        {/* Tabs */}
                        <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100 w-full lg:w-auto overflow-x-auto shadow-sm">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'all' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                All Orders <span className={`ml-1.5 ${filter === 'all' ? 'text-white' : 'text-emerald-500'}`}>({stats.total})</span>
                            </button>
                            <button
                                onClick={() => handleFilterChange('completed')}
                                className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'completed' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Completed <span className={`ml-1.5 ${filter === 'completed' ? 'text-white' : 'text-emerald-500'}`}>({stats.completed})</span>
                            </button>
                            <button
                                onClick={() => handleFilterChange('pending')}
                                className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'pending' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Pending <span className={`ml-1.5 ${filter === 'pending' ? 'text-white' : 'text-emerald-500'}`}>({stats.new})</span>
                            </button>
                            <button
                                onClick={() => handleFilterChange('canceled')}
                                className={`px-5 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap ${filter === 'canceled' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                Canceled <span className={`ml-1.5 ${filter === 'canceled' ? 'text-white' : 'text-emerald-500'}`}>({stats.canceled})</span>
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-[280px]">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                                />
                            </div>
                            <FilterDropdown
                                options={filterOptions}
                                activeFilters={filters}
                                onFilterChange={handleDropdownFilterChange}
                                onClear={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-[#e9f5ee] text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
                                <tr>
                                    {/* Select All */}
                                    <th className="pl-5 pr-2 py-4 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 accent-emerald-500 cursor-pointer"
                                            checked={isAllSelected(currentItems)}
                                            onChange={() => toggleAll(currentItems)}
                                            title="Select All"
                                        />
                                    </th>
                                    <th className="py-4 px-4 w-16">No.</th>
                                    <th className="py-4 px-4">Order Id</th>
                                    <th className="py-4 px-4">Product</th>
                                    <th className="py-4 px-4 text-center">Date</th>
                                    <th className="py-4 px-4 text-center">Price</th>
                                    <th className="py-4 px-4 text-center">Payment</th>
                                    <th className="py-4 px-4 text-center">Status</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 font-medium divide-y divide-gray-50">
                                {currentItems.map((order, idx) => (
                                    <tr
                                        key={order.id}
                                        className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(order.id) ? 'bg-emerald-50/40' : ''
                                            }`}
                                    >
                                        {/* Individual checkbox */}
                                        <td className="pl-5 pr-2 py-4 w-10">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 accent-emerald-500 cursor-pointer"
                                                checked={selectedIds.includes(order.id)}
                                                onChange={() => toggleOne(order.id)}
                                            />
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-gray-400 font-bold">{indexOfFirstItem + idx + 1}.</span>
                                        </td>
                                        <td className="py-4 px-4 font-bold text-gray-800">#{order.id.toString().slice(-8).toUpperCase()}</td>
                                        <td className="py-4 px-4 flex items-center gap-4 min-w-[300px]">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm text-emerald-500">
                                                {React.createElement(getIcon(order.items?.[0]?.product_details?.title), { size: 20 })}
                                            </div>
                                            <span className="font-bold text-gray-800">
                                                {order.items?.[0]?.product_details?.title || 'No internal items'}
                                                {order.items?.length > 1 && <span className="text-emerald-500 ml-1">(+{order.items.length - 1})</span>}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center text-gray-500 font-bold text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="py-4 px-4 text-center font-black text-gray-800">${parseFloat(order.total_amount).toFixed(2)}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full bg-emerald-50 text-emerald-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Paid
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border ${order.status === 'delivered' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
                                                order.status === 'canceled' ? 'text-red-500 border-red-200 bg-red-50' :
                                                    'text-amber-600 border-amber-200 bg-amber-50'
                                                }`}>
                                                <Truck size={14} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => window.location.href = `/admin/orders/details?id=${order.id}`}
                                                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => alert(`Cancel order #${order.id.toString().slice(-8).toUpperCase()}?`)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="9" className="py-20 text-center text-gray-400 font-bold italic">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm bg-gray-50/30">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                            >
                                ← Previous
                            </button>
                            <div className="flex gap-1.5">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    if (totalPages > 7 && pageNum > 3 && pageNum < totalPages - 2 && Math.abs(pageNum - currentPage) > 1) {
                                        if (pageNum === 4 || pageNum === totalPages - 3) return <span key={pageNum} className="px-1 text-gray-400 font-bold text-xs self-center">...</span>;
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs transition-all font-black ${currentPage === pageNum ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-white border border-gray-100 text-gray-500 hover:text-gray-800 shadow-sm'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm bg-white"
                            >
                                Next →
                            </button>
                        </div>
                    )}

                </div>
            </div>

            <BulkActionBar
                selectedIds={selectedIds}
                onClear={clearSelection}
                label={{ singular: "order", plural: "orders" }}
                onExportExcel={handleBulkExportExcel}
                onExportCSV={() => {
                    const sel = orders.filter(o => selectedIds.includes(o.id));
                    exportToCSV(sel.map(order => ({
                        "Order ID": order.id,
                        "Product": order.items?.[0]?.product_details?.title || '—',
                        "Date": new Date(order.created_at).toLocaleDateString(),
                        "Price": parseFloat(order.total_amount).toFixed(2),
                        "Status": order.status
                    })), `Selected_Orders_${selectedIds.length}`);
                }}
                onExportPDF={() => {
                    const sel = orders.filter(o => selectedIds.includes(o.id));
                    const columns = ["Order ID", "Product", "Date", "Price", "Status"];
                    const data = sel.map(order => [
                        order.id,
                        order.items?.[0]?.product_details?.title || '—',
                        new Date(order.created_at).toLocaleDateString(),
                        `PKR ${parseFloat(order.total_amount).toFixed(2)}`,
                        order.status
                    ]);
                    exportToPDF(data, columns, `Selected_Orders_${selectedIds.length}`, 'Selected Order Report');
                }}
                onDelete={handleBulkDelete}
            />
        </>
    );
};

export default AllOrders;
