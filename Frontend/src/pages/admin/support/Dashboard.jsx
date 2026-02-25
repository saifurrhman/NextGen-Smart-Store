import React from 'react';
import { HeadphonesIcon, MessageSquare, Mail, BookOpen, BarChart3, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const stats = [
    { label: 'Open Tickets', value: '23', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Resolved Today', value: '15', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Avg Response', value: '12 min', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pending Refunds', value: '4', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
];

const tickets = [
    { id: 'TKT-481', subject: 'Order not received', customer: 'Hamza Malik', priority: 'High', status: 'Open', time: '10 min ago' },
    { id: 'TKT-480', subject: 'Wrong item delivered', customer: 'Zainab Shah', priority: 'High', status: 'In Progress', time: '45 min ago' },
    { id: 'TKT-479', subject: 'Payment failed but charged', customer: 'Danish Rauf', priority: 'Medium', status: 'Open', time: '1 hr ago' },
    { id: 'TKT-478', subject: 'Product quality issue', customer: 'Nadia Farooq', priority: 'Low', status: 'Resolved', time: '3 hrs ago' },
    { id: 'TKT-477', subject: 'Coupon not working', customer: 'Imran Siddiqui', priority: 'Low', status: 'Resolved', time: '5 hrs ago' },
];

const SupportDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                    <HeadphonesIcon size={22} className="text-brand" />
                    Support Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">Tickets, chat & customer help</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                                <Icon size={20} className={stat.color} />
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
                    { label: 'Live Chat', desc: 'Answer customer chats', icon: MessageSquare },
                    { label: 'Email Support', desc: 'Reply to tickets', icon: Mail },
                    { label: 'Knowledge Base', desc: 'Manage help articles', icon: BookOpen },
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

            {/* Recent Tickets */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-brand-dark">Recent Tickets</h3>
                    <span className="text-xs text-gray-400">{tickets.length} tickets</span>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Ticket</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Subject</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Customer</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Priority</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-gray-500">Status</th>
                            <th className="text-right px-5 py-2.5 font-semibold text-gray-500">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((t) => (
                            <tr key={t.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-3 font-medium text-gray-700">{t.id}</td>
                                <td className="px-5 py-3 text-gray-600">{t.subject}</td>
                                <td className="px-5 py-3 text-gray-500">{t.customer}</td>
                                <td className="px-5 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.priority === 'High' ? 'bg-red-50 text-red-600' :
                                            t.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                'bg-gray-100 text-gray-500'
                                        }`}>{t.priority}</span>
                                </td>
                                <td className="px-5 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'Open' ? 'bg-amber-50 text-amber-600' :
                                            t.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                                'bg-green-50 text-green-600'
                                        }`}>{t.status}</span>
                                </td>
                                <td className="px-5 py-3 text-right text-gray-400 text-xs">{t.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupportDashboard;
