import React from 'react';
import { Boxes, Package, Truck, AlertTriangle, ClipboardList, ShoppingCart, ArrowUpRight } from 'lucide-react';

const stats = [
    { label: 'Total Orders', value: '1,847', icon: ShoppingCart, change: '+34 today', up: true },
    { label: 'In Processing', value: '28', icon: Package, change: '12 packing', up: false },
    { label: 'Out for Delivery', value: '15', icon: Truck, change: '3 delayed', up: false },
    { label: 'Inventory Alerts', value: '7', icon: AlertTriangle, change: 'Low stock items', up: false },
];

const recentOrders = [
    { id: 'ORD-3842', customer: 'Ali Hassan', items: 3, total: 'PKR 7,500', status: 'Processing', time: '5 min ago' },
    { id: 'ORD-3841', customer: 'Fatima Noor', items: 1, total: 'PKR 12,990', status: 'Shipped', time: '20 min ago' },
    { id: 'ORD-3840', customer: 'Bilal Ahmed', items: 5, total: 'PKR 3,200', status: 'Packing', time: '45 min ago' },
    { id: 'ORD-3839', customer: 'Ayesha Khan', items: 2, total: 'PKR 8,800', status: 'Delivered', time: '2 hrs ago' },
];

const OperationsDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                    <Boxes size={22} className="text-brand" />
                    Operations Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">Orders, inventory & logistics</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                                    <Icon size={20} className="text-brand" />
                                </div>
                                {stat.up && <ArrowUpRight size={16} className="text-green-500" />}
                            </div>
                            <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={`text-xs mt-1 ${stat.up ? 'text-green-500' : 'text-amber-500'}`}>{stat.change}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { label: 'Order Processing', desc: 'Manage pending orders', icon: ClipboardList },
                    { label: 'Delivery Tracking', desc: 'Track shipments', icon: Truck },
                    { label: 'Inventory Alerts', desc: 'Low stock warnings', icon: AlertTriangle },
                ].map((action) => {
                    const Icon = action.icon;
                    return (
                        <button key={action.label} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand/30 transition-all text-left group">
                            <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand transition-colors">
                                <Icon size={20} className="text-brand group-hover:text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-brand-dark">{action.label}</p>
                                <p className="text-xs text-gray-400">{action.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-brand-dark">Recent Orders</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Order</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Customer</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Items</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Total</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Status</th>
                            <th className="text-right px-5 py-2.5 font-semibold text-gray-500">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3 font-medium text-gray-700">{order.id}</td>
                                <td className="px-5 py-3 text-gray-600">{order.customer}</td>
                                <td className="px-5 py-3 text-gray-500">{order.items}</td>
                                <td className="px-5 py-3 font-semibold text-brand-dark">{order.total}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                                order.status === 'Processing' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-purple-50 text-purple-600'
                                        }`}>{order.status}</span>
                                </td>
                                <td className="px-5 py-3 text-right text-gray-400 text-xs">{order.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OperationsDashboard;
