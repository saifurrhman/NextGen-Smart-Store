import React from 'react';
import { Users, ShoppingBag, DollarSign, Activity, Shield } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className="card p-6 flex items-center space-x-4 border border-gray-100 shadow-sm">
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 text-${colorClass.replace('bg-', '')}`}>
            <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-sm text-text-sub">{label}</p>
            <h3 className="text-2xl font-bold text-brand-dark">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                    <Shield className="text-brand" /> Super Admin Control
                </h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-brand-dark text-white rounded-lg hover:bg-brand transition-colors">Manage Users</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-brand-dark rounded-lg hover:bg-gray-50 transition-colors">System Settings</button>
                </div>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} label="Total Revenue" value="$45,230" colorClass="bg-functional-success" />
                <StatCard icon={Users} label="Active Users" value="1,240" colorClass="bg-brand" />
                <StatCard icon={ShoppingBag} label="Orders Today" value="85" colorClass="bg-action" />
                <StatCard icon={Activity} label="System Health" value="99.9%" colorClass="bg-brand-accent" />
            </div>

            {/* Recent Activity / Verification Requests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-brand-dark mb-4">Pending Vendor Approvals</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                        S{i}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-brand-dark">Store #{i}</p>
                                        <p className="text-xs text-text-sub">Applied 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-xs px-3 py-1 bg-green-100 text-functional-success rounded hover:bg-green-200">Approve</button>
                                    <button className="text-xs px-3 py-1 bg-red-100 text-functional-error rounded hover:bg-red-200">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full text-center text-sm text-brand mt-4 font-medium hover:underline">View All Requests</button>
                </div>

                <div className="card p-6 border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-brand-dark mb-4">System Alerts</h2>
                    <div className="space-y-3">
                        <div className="flex gap-3 text-sm p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
                            <Activity size={18} />
                            <span>High traffic detected on Product Listing page.</span>
                        </div>
                        <div className="flex gap-3 text-sm p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                            <Users size={18} />
                            <span>50 new customers registered today.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
