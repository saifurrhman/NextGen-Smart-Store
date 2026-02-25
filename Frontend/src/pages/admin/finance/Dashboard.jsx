import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Receipt, PiggyBank } from 'lucide-react';

const stats = [
    { label: 'Total Revenue', value: 'PKR 2,45,000', icon: DollarSign, change: '+12.5%', up: true },
    { label: 'Pending Payouts', value: 'PKR 34,500', icon: Wallet, change: '5 vendors', up: false },
    { label: 'Transactions', value: '1,247', icon: CreditCard, change: '+89 today', up: true },
    { label: 'Commission Earned', value: 'PKR 18,200', icon: TrendingUp, change: '+8.3%', up: true },
];

const recentTx = [
    { id: 'TXN-001', customer: 'Ahmed Khan', amount: 'PKR 4,500', type: 'Order Payment', status: 'Completed', time: '2 min ago' },
    { id: 'TXN-002', customer: 'Sara Ali', amount: 'PKR 12,000', type: 'Order Payment', status: 'Completed', time: '15 min ago' },
    { id: 'TXN-003', customer: 'Vendor: TechWorld', amount: 'PKR 8,900', type: 'Payout', status: 'Pending', time: '1 hr ago' },
    { id: 'TXN-004', customer: 'Usmaan Riaz', amount: 'PKR 2,200', type: 'Refund', status: 'Processing', time: '3 hrs ago' },
];

const FinanceDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                    <DollarSign size={22} className="text-brand" />
                    Finance Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">Transactions, payouts & revenue reports</p>
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
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-green-500' : 'text-amber-500'}`}>
                                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { label: 'Vendor Payouts', desc: 'Approve pending payouts', icon: Wallet },
                    { label: 'Revenue Reports', desc: 'View detailed analytics', icon: TrendingUp },
                    { label: 'Tax Management', desc: 'Configure tax rules', icon: Receipt },
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

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-brand-dark">Recent Transactions</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">ID</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Customer</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Amount</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Type</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Status</th>
                            <th className="text-right px-5 py-2.5 font-semibold text-gray-500">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTx.map((tx) => (
                            <tr key={tx.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3 font-medium text-gray-700">{tx.id}</td>
                                <td className="px-5 py-3 text-gray-600">{tx.customer}</td>
                                <td className="px-5 py-3 font-semibold text-brand-dark">{tx.amount}</td>
                                <td className="px-5 py-3 text-gray-500">{tx.type}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tx.status === 'Completed' ? 'bg-green-50 text-green-600' :
                                            tx.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>{tx.status}</span>
                                </td>
                                <td className="px-5 py-3 text-right text-gray-400 text-xs">{tx.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinanceDashboard;
