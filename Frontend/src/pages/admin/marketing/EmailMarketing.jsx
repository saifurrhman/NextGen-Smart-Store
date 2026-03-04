import React, { useState } from 'react';
import { Mail, Search, Send, CheckCircle, Clock, AlertCircle, Plus, Filter, Download } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';

const EmailMarketing = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const CAMPAIGNS = [
        { id: 1, subject: 'Your Items are Waiting!', segment: 'Abandoned Cart', sent: 1245, openRate: '42.3%', clickRate: '12.1%', status: 'Sending', date: '2024-03-20' },
        { id: 2, subject: 'Exclusive Summer Preview', segment: 'VIP Customers', sent: 850, openRate: '58.7%', clickRate: '24.5%', status: 'Completed', date: '2024-03-18' },
        { id: 3, subject: 'Welcome to the club', segment: 'New Subscribers', sent: 4102, openRate: '61.2%', clickRate: '18.9%', status: 'Automated', date: 'Ongoing' },
    ];

    const filtered = CAMPAIGNS.filter(c => c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || c.segment.toLowerCase().includes(searchTerm.toLowerCase()));

    const STATS = [
        { label: 'Avg Open Rate', value: '54.2%', icon: CheckCircle, color: 'text-emerald-500' },
        { label: 'Avg Click Rate', value: '18.5%', icon: Send, color: 'text-blue-500' },
        { label: 'Total Sent', value: '12.4K', icon: Mail, color: 'text-purple-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Mail size={24} className="text-brand" />
                        Email Marketing
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Create and track your email outreach campaigns</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={() => exportToExcel(CAMPAIGNS, "Email_Campaigns")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">Excel</button>
                        <button onClick={() => exportToPDF(CAMPAIGNS.map(c => [c.subject, c.segment, c.sent, c.openRate, c.status]), ["Subject", "Segment", "Sent", "Open Rate", "Status"], "Email_Campaigns", "Email Marketing Performance")} className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-bold">PDF</button>
                    </div>
                    <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-dark transition-all shadow-sm">
                        <Plus size={16} /> New Campaign
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STATS.map((s) => (
                    <div key={s.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0`}>
                            <s.icon size={22} className={s.color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                            <h3 className="text-xl font-black text-gray-800">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search campaigns or segments..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand transition-all shadow-sm font-medium"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f8faf9] text-gray-800 font-bold text-[10px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Campaign Name</th>
                                <th className="px-6 py-4">Target Segment</th>
                                <th className="px-6 py-4 text-center">Sent</th>
                                <th className="px-6 py-4 text-center">Open Rate</th>
                                <th className="px-6 py-4 text-center">Click Rate</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800 group-hover:text-brand transition-colors">{c.subject}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{c.date}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-black uppercase">{c.segment}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-gray-700">{c.sent.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-emerald-600 font-black">{c.openRate}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-blue-600 font-black">{c.clickRate}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {c.status === 'Sending' && <Clock size={12} className="text-amber-500 animate-pulse" />}
                                            {c.status === 'Completed' && <CheckCircle size={12} className="text-emerald-500" />}
                                            {c.status === 'Automated' && <Send size={12} className="text-brand" />}
                                            <span className={`text-[10px] font-black uppercase ${c.status === 'Sending' ? 'text-amber-600' : c.status === 'Completed' ? 'text-emerald-600' : 'text-brand'}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmailMarketing;
