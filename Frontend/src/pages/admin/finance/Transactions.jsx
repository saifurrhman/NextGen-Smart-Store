import React from 'react';
import {
    Search, Filter, MoreVertical, ArrowUp, ArrowDown, Plus, CreditCard
} from 'lucide-react';

const Transactions = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Transaction</h1>
            </div>

            {/* TOP STAT CARDS & PAYMENT METHOD ROW */}
            <div className="flex flex-col xl:flex-row gap-6 mb-6">

                {/* 4 STAT CARDS GRID */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Total Revenue Card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative flex flex-col justify-center">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Total Revenue</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">$15,045</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                <ArrowUp size={12} strokeWidth={3} /> <span>14.4%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>

                    {/* Completed Transactions Card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative flex flex-col justify-center">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Completed Transactions</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">3,150</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                <ArrowUp size={12} strokeWidth={3} /> <span>20%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>

                    {/* Pending Transactions Card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative flex flex-col justify-center">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Pending Transactions</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">150</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                <span className="text-emerald-500">85%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>

                    {/* Failed Transactions Card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative flex flex-col justify-center">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Failed Transactions</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">75</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mb-1.5">
                                <span className="text-red-500">15%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>
                </div>

                {/* PAYMENT METHOD CARD */}
                <div className="w-full xl:w-[460px] bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800">Payment Method</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 mb-6">
                        {/* Credit Card Visual */}
                        <div className="relative w-full sm:w-[240px] h-[150px] rounded-2xl overflow-hidden shadow text-white p-5 flex flex-col justify-between shrink-0"
                            style={{ background: 'linear-gradient(135deg, #18b38a 0%, #118162 100%)' }}>
                            {/* Card Background elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="flex justify-between items-start z-10 w-full">
                                <span className="font-bold tracking-wider text-base">Finaci</span>
                                {/* Master card circles */}
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm -mr-2"></div>
                                    <div className="w-6 h-6 rounded-full bg-white/50 backdrop-blur-sm relative border border-white/20"></div>
                                </div>
                            </div>

                            <div className="text-base tracking-[0.2em] font-medium z-10 opacity-90 font-mono text-center w-full mt-2">
                                **** **** **** 2345
                            </div>

                            <div className="flex justify-between items-end z-10 text-[9px] opacity-80 uppercase tracking-wider w-full pt-1">
                                <div>
                                    <div className="mb-0.5 opacity-80">Card holder name</div>
                                    <div className="font-semibold text-xs text-white capitalize normal-case">Noman Manzoor</div>
                                </div>
                                <div>
                                    <div className="mb-0.5 text-right opacity-80">Expiry Date</div>
                                    <div className="font-semibold text-xs text-white text-right">02/30</div>
                                </div>
                            </div>
                        </div>

                        {/* Card Details Sidebar */}
                        <div className="flex flex-col justify-center space-y-3.5 w-full">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px]">Status:</span>
                                <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px]">Transactions:</span>
                                <span className="text-[13px] font-bold text-gray-800">1,250</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 w-[80px]">Revenue:</span>
                                <span className="text-[13px] font-bold text-gray-800">$50,000</span>
                            </div>
                            <a href="#" className="text-[13px] font-medium text-indigo-500 hover:text-indigo-600 mt-1 inline-block">
                                View Transactions
                            </a>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-auto w-full">
                        <button className="flex items-center justify-center gap-2 h-10 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors w-[240px]">
                            <Plus size={16} /> Add Card
                        </button>
                        <button className="h-10 px-4 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto flex-1">
                            Deactivate
                        </button>
                    </div>
                </div>

            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-center px-4 py-4 gap-4">
                    {/* Tabs */}
                    <div className="flex items-center bg-[#f0f9f4] rounded-lg p-1.5 border border-emerald-50 w-full lg:w-auto overflow-x-auto">
                        <button className="px-5 py-2 text-xs font-semibold text-gray-800 bg-white rounded-md shadow-sm whitespace-nowrap">
                            All order <span className="text-emerald-500 ml-1">(240)</span>
                        </button>
                        <button className="px-5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Completed</button>
                        <button className="px-5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Pending</button>
                        <button className="px-5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors whitespace-nowrap">Canceled</button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[260px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search payment history"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium text-gray-600 placeholder-gray-400"
                            />
                        </div>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0">
                            <Filter size={16} />
                        </button>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0">
                            <div className="flex flex-col -space-y-[6px]">
                                <ArrowUp size={11} />
                                <ArrowDown size={11} />
                            </div>
                        </button>
                        <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center shrink-0">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-xs text-left min-w-[800px]">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-semibold tracking-wider">
                            <tr>
                                <th className="py-4 px-6 rounded-l-lg">Customer Id</th>
                                <th className="py-4 px-4">Name</th>
                                <th className="py-4 px-4 text-center">Date</th>
                                <th className="py-4 px-4 text-center">Total</th>
                                <th className="py-4 px-4 text-center">Method</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-6 rounded-r-lg text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {[
                                { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Complete', statusColor: 'emerald', dotCol: 'bg-emerald-500', action: 'View Details' },
                                { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Complete', statusColor: 'emerald', dotCol: 'bg-emerald-500', action: 'View Details' },
                                { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Complete', statusColor: 'emerald', dotCol: 'bg-emerald-500', action: 'View Details' },
                                { id: '#CUST001', name: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Canceled', statusColor: 'red', dotCol: 'bg-red-500', action: 'View Details' },
                                { id: '#CUST001', name: 'Emily Davis', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Pending', statusColor: 'amber', dotCol: 'bg-yellow-400', action: 'View Details' },
                                { id: '#CUST001', name: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Canceled', statusColor: 'red', dotCol: 'bg-red-500', action: 'View Details' },
                                { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Complete', statusColor: 'emerald', dotCol: 'bg-emerald-500', action: 'View Details' },
                                { id: '#CUST001', name: 'Emily Davis', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Pending', statusColor: 'amber', dotCol: 'bg-yellow-400', action: 'View Details' },
                                { id: '#CUST001', name: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'Bank', status: 'Canceled', statusColor: 'red', dotCol: 'bg-red-500', action: 'View Details' },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="py-4 px-6 text-gray-600 font-medium">{row.id}</td>
                                    <td className="py-4 px-4 font-medium text-gray-800">{row.name}</td>
                                    <td className="py-4 px-4 text-center text-gray-600">{row.date}</td>
                                    <td className="py-4 px-4 text-center font-bold text-gray-800">{row.total}</td>
                                    <td className="py-4 px-4 text-center font-semibold text-gray-800">{row.method}</td>
                                    <td className="py-4 px-4">
                                        <span className={`flex items-center gap-1.5 text-${row.statusColor}-500 font-semibold`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.dotCol}`}></span>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <a href="#" className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors">
                                            {row.action}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-5 flex items-center justify-between border-t border-gray-50 text-sm">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        ← Previous
                    </button>
                    <div className="flex gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center bg-[#eaf4f0] text-emerald-700 font-bold rounded text-xs">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-100 text-gray-500 font-medium rounded text-xs hover:bg-gray-50 transition-colors">2</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-100 text-gray-500 font-medium rounded text-xs hover:bg-gray-50 transition-colors">3</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-100 text-gray-500 font-medium rounded text-xs hover:bg-gray-50 transition-colors">4</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-100 text-gray-500 font-medium rounded text-xs hover:bg-gray-50 transition-colors">5</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-100 text-gray-500 font-medium rounded text-xs hover:bg-gray-50 transition-colors">....</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-100 text-gray-500 font-medium rounded text-xs hover:bg-gray-50 transition-colors">24</button>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                        Next →
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Transactions;
