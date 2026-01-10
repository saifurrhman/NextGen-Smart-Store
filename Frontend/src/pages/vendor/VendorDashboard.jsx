import React from 'react';
import { DollarSign, ShoppingCart, Package } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
            <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-text-sub">{label}</p>
            <h3 className="text-2xl font-bold text-brand-dark">{value}</h3>
        </div>
    </div>
);

const VendorDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-brand-dark">Vendor Overview</h1>
                <button className="px-4 py-2 bg-action text-white rounded-lg hover:bg-action-hover transition-colors shadow-sm">
                    Add New Product
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={DollarSign} label="Total Earnings" value="$12,450" colorClass="bg-functional-success" />
                <StatCard icon={ShoppingCart} label="Pending Orders" value="15" colorClass="bg-functional-pending" />
                <StatCard icon={Package} label="Total Products" value="48" colorClass="bg-action" />
            </div>

            {/* Recent Orders Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-brand-dark">Recent Orders</h2>
                </div>
                <div className="p-6 text-center text-text-sub">
                    No orders found. Start listing products!
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
