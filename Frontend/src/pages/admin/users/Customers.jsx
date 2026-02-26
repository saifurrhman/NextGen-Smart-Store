import React from 'react';
import {
    Search, Filter, MoreVertical, Bell,
    MessageSquare, Trash2, Copy, MapPin,
    Phone, Mail, ArrowUp
} from 'lucide-react';

const Customers = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">

                {/* LEFT & CENTER COLUMN (Stats + Chart + Table) */}
                <div className="flex-1 space-y-6">

                    {/* STAT CARDS & CHART ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* 3 Stat Cards Column */}
                        <div className="space-y-4">
                            {/* Total Customers */}
                            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative">
                                <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={18} />
                                </button>
                                <h3 className="text-sm font-semibold text-gray-800 mb-4">Total Customers</h3>
                                <div className="flex items-end gap-3 mb-1">
                                    <h2 className="text-3xl font-bold text-gray-800">11,040</h2>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                        <ArrowUp size={12} /> <span>14.4%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Last 7 days</p>
                            </div>

                            {/* New Customers */}
                            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative">
                                <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={18} />
                                </button>
                                <h3 className="text-sm font-semibold text-gray-800 mb-4">New Customers</h3>
                                <div className="flex items-end gap-3 mb-1">
                                    <h2 className="text-3xl font-bold text-gray-800">2,370</h2>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                        <ArrowUp size={12} /> <span>20%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Last 7 days</p>
                            </div>

                            {/* Visitor */}
                            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative">
                                <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={18} />
                                </button>
                                <h3 className="text-sm font-semibold text-gray-800 mb-4">Visitor</h3>
                                <div className="flex items-end gap-3 mb-1">
                                    <h2 className="text-3xl font-bold text-gray-800">250k</h2>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                        <ArrowUp size={12} /> <span>20%</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Last 7 days</p>
                            </div>
                        </div>

                        {/* BIG CHART PANEL */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-gray-800">Customer Overview</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
                                        <button className="px-3 py-1 text-emerald-600 font-medium bg-emerald-50 border-r border-gray-200 shadow-inner">This week</button>
                                        <button className="px-3 py-1 text-gray-500 font-medium hover:bg-gray-50">Last week</button>
                                    </div>
                                    <MoreVertical size={16} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Chart Stats Row */}
                            <div className="flex gap-12 mb-8 border-b border-gray-100 pb-4">
                                <div className="relative">
                                    <h2 className="text-2xl font-bold text-gray-800">25k</h2>
                                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">Active Customers</p>
                                    <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-emerald-400"></div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">5.6k</h2>
                                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">Repeat Customers</p>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">250k</h2>
                                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">Shop Visitor</p>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">5.5%</h2>
                                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">Conversion Rate</p>
                                </div>
                            </div>

                            {/* Simple SVG Chart Representation */}
                            <div className="relative flex-1 w-full min-h-[220px] mt-4">
                                {/* Y-axis Labels */}
                                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-6">
                                    <span>50k</span>
                                    <span>40k</span>
                                    <span>30k</span>
                                    <span>20k</span>
                                    <span>10k</span>
                                    <span>0k</span>
                                </div>

                                {/* Chart Area */}
                                <div className="absolute left-8 right-0 h-full pb-6">
                                    {/* SVG Line & Area Fill */}
                                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <defs>
                                            <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Reference Dashed Line Tooltip */}
                                        <line x1="55" y1="0" x2="55" y2="100" stroke="#10b981" strokeDasharray="2" strokeWidth="0.5" />

                                        <path
                                            d="M0,60 C10,60 15,25 25,25 C35,25 40,65 50,65 C60,65 65,10 75,10 C85,10 90,60 95,60 L100,60 L100,100 L0,100 Z"
                                            fill="url(#customerGradient)"
                                        />
                                        <path
                                            d="M0,60 C10,60 15,25 25,25 C35,25 40,65 50,65 C60,65 65,10 75,10 C85,10 90,60 95,60 L100,60"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="2"
                                        />
                                        <circle cx="55" cy="65" r="3" fill="white" stroke="#10b981" strokeWidth="2" />
                                    </svg>

                                    {/* Tooltip Overlay */}
                                    <div className="absolute left-[55%] -translate-x-1/2 bottom-[35%] bg-[#d2f4e1] text-[#136138] px-3 py-1.5 rounded-lg text-xs text-center border border-emerald-200 z-10 shadow-sm">
                                        <span className="text-[10px] block font-medium">Thursday</span>
                                        <span className="font-bold block">25,400</span>
                                        {/* Triangle point */}
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#d2f4e1] border-b border-r border-emerald-200 transform rotate-45"></div>
                                    </div>
                                </div>

                                {/* X-axis Labels */}
                                <div className="absolute left-8 right-0 bottom-0 flex justify-between text-[10px] text-gray-400 font-medium">
                                    <span>Sun</span>
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span className="text-gray-800 font-bold">Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* DATA TABLE */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">Customer Details</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-[#eaf4f0] text-emerald-800 font-semibold tracking-wider">
                                    <tr>
                                        <th className="py-3 px-5 rounded-l-lg">Customer Id</th>
                                        <th className="py-3 px-3">Name</th>
                                        <th className="py-3 px-3">Phone</th>
                                        <th className="py-3 px-3 text-center">Order Count</th>
                                        <th className="py-3 px-3">Total Spend</th>
                                        <th className="py-3 px-3">Status</th>
                                        <th className="py-3 px-5 text-center rounded-r-lg">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                                    {[
                                        { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active', color: 'bg-emerald-500', textCol: 'text-emerald-500' },
                                        { id: '#CUST002', name: 'John Doe', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active', color: 'bg-emerald-500', textCol: 'text-emerald-500' },
                                        { id: '#CUST003', name: 'John Doe', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active', color: 'bg-emerald-500', textCol: 'text-emerald-500' },
                                        { id: '#CUST004', name: 'John Doe', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active', color: 'bg-emerald-500', textCol: 'text-emerald-500' },
                                        { id: '#CUST005', name: 'Jane Smith', phone: '+1234567890', orders: 5, spend: '250.00', status: 'Inactive', color: 'bg-red-500', textCol: 'text-red-500' },
                                        { id: '#CUST006', name: 'Emily Davis', phone: '+1234567890', orders: 30, spend: '4,600.00', status: 'VIP', color: 'bg-yellow-400', textCol: 'text-yellow-500' },
                                        { id: '#CUST007', name: 'Jane Smith', phone: '+1234567890', orders: 5, spend: '250.00', status: 'Inactive', color: 'bg-red-500', textCol: 'text-red-500' },
                                        { id: '#CUST008', name: 'John Doe', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active', color: 'bg-emerald-500', textCol: 'text-emerald-500' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="py-4 px-5 text-gray-500">{row.id}</td>
                                            <td className="py-4 px-3">{row.name}</td>
                                            <td className="py-4 px-3">{row.phone}</td>
                                            <td className="py-4 px-3 text-center">{row.orders}</td>
                                            <td className="py-4 px-3">{row.spend}</td>
                                            <td className="py-4 px-3">
                                                <span className={`flex items-center gap-1.5 ${row.textCol}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${row.color}`}></span>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center justify-center gap-2 text-gray-400">
                                                    <button className="hover:text-gray-600 transition-colors bg-gray-50 p-1.5 rounded-md border border-gray-100"><MessageSquare size={14} /></button>
                                                    <button className="hover:text-red-500 transition-colors bg-gray-50 p-1.5 rounded-md border border-gray-100"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                                ← Previous
                            </button>
                            <div className="flex gap-1.5">
                                <button className="w-8 h-8 flex items-center justify-center bg-[#d2f4e1] text-emerald-700 font-semibold rounded text-xs border border-emerald-200">1</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">2</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">3</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">4</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">5</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">....</button>
                                <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50">24</button>
                            </div>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                                Next →
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR (User Profile) */}
                <div className="w-full xl:w-[320px] bg-white rounded-xl border border-gray-100 shadow-sm p-5 self-start sticky top-6">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-14 h-14 rounded-full bg-blue-100 overflow-hidden shrink-0 border border-gray-200">
                            {/* Dummy Profile Avatar */}
                            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                <title>John Doe</title>
                                <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                                </mask>
                                <g mask="url(#mask__beam)">
                                    <rect width="36" height="36" fill="#f0be86"></rect>
                                    <rect x="0" y="0" width="36" height="36" transform="translate(4 4) rotate(168 18 18) scale(1)" fill="#4d5382" rx="36"></rect>
                                    <g transform="translate(-4 -2) rotate(-8 18 18)">
                                        <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path>
                                        <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
                                        <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div className="flex-1 mt-1 break-all">
                            <h2 className="text-sm font-bold text-gray-800">John Doe</h2>
                            <p className="text-[11px] text-gray-500">john.doe@example.com</p>
                        </div>
                        <button className="text-blue-500 hover:bg-blue-50 p-1.5 rounded transition-colors mt-1">
                            <Copy size={16} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div>
                            <h3 className="text-[11px] font-semibold text-gray-400 mb-3">Customer Info</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 px-3 py-2.5 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50/50">
                                    <Phone size={14} className="text-gray-500" />
                                    <span>+1234567890</span>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2.5 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50/50">
                                    <MapPin size={14} className="text-gray-500" />
                                    <span>123 Main St, NY</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className="text-[11px] font-semibold text-gray-400 mb-3">Social Media</h3>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] hover:bg-blue-200 transition-colors">f</button>
                                <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
                                    <MessageSquare size={13} />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center font-bold font-serif italic text-xs hover:bg-sky-200 transition-colors">y</button>
                                <button className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center hover:bg-indigo-200 transition-colors">in</button>
                                <button className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </button>
                            </div>
                        </div>

                        {/* Activity */}
                        <div>
                            <h3 className="text-[11px] font-semibold text-gray-400 mb-3">Activity</h3>
                            <div className="text-xs text-gray-600 space-y-2 font-medium">
                                <p>Registration: <span className="text-gray-800">15.01.2025</span></p>
                                <p>Last purchase: <span className="text-gray-800">10.01.2025</span></p>
                            </div>
                        </div>

                        {/* Order Overview */}
                        <div>
                            <h3 className="text-[11px] font-semibold text-gray-400 mb-3">Order overview</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="border border-gray-100 rounded-lg p-2 text-center bg-gray-50/50">
                                    <h4 className="font-bold text-gray-800 text-sm">150</h4>
                                    <p className="text-[9px] text-blue-500 font-semibold uppercase mt-1">Total order</p>
                                </div>
                                <div className="border border-gray-100 rounded-lg p-2 text-center bg-gray-50/50">
                                    <h4 className="font-bold text-gray-800 text-sm">140</h4>
                                    <p className="text-[9px] text-emerald-500 font-semibold uppercase mt-1">Completed</p>
                                </div>
                                <div className="border border-gray-100 rounded-lg p-2 text-center bg-gray-50/50">
                                    <h4 className="font-bold text-gray-800 text-sm">10</h4>
                                    <p className="text-[9px] text-red-500 font-semibold uppercase mt-1">Canceled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Customers;
