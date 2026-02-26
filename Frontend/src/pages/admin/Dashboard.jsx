import React, { useState, useEffect } from 'react';
import {
    MoreVertical, ArrowUp, ArrowDown, Search, Filter,
    Smartphone, Shirt, Home as HomeIcon, Plus, ChevronRight,
    Globe
} from 'lucide-react';
import api from '../../utils/api';
import { useCurrency } from '../../context/CurrencyContext';

const Dashboard = () => {
    const { formatCurrency } = useCurrency();
    const [trafficStats, setTrafficStats] = useState({ total_visits: 0, sources: [], countries: [], states: [] });
    const [locationTab, setLocationTab] = useState('countries'); // 'countries' or 'states'

    useEffect(() => {
        const fetchTraffic = async () => {
            try {
                const response = await api.get('/api/v1/analytics/traffic_stats/');
                setTrafficStats(response.data);
            } catch (error) {
                console.error("Failed to fetch traffic stats:", error);
            }
        };
        fetchTraffic();
    }, []);

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
            {/* Header / Title */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* 1. TOP CARDS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Sales */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Sales</h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{formatCurrency(350, 0)}K</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1">
                            <span>Sales</span> <ArrowUp size={12} /> <span>10.4%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                        Previous 7days <span className="font-semibold text-blue-500">({formatCurrency(235, 0)})</span>
                    </p>
                    <div className="flex justify-end mt-2">
                        <button className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Orders</h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    <div className="flex items-end gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">10.7K</h2>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1">
                            <span>order</span> <ArrowUp size={12} /> <span>14.4%</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                        Previous 7days <span className="font-semibold text-blue-500">(7.6k)</span>
                    </p>
                    <div className="flex justify-end mt-2">
                        <button className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Pending & Canceled */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm relative">
                    <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Pending & Canceled</h3>
                    <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
                    <div className="flex divide-x divide-gray-100">
                        <div className="flex-1 pr-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">Pending</p>
                            <div className="flex items-end gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">509</h2>
                                <span className="text-xs text-emerald-500 font-medium mb-1">user 204</span>
                            </div>
                        </div>
                        <div className="flex-1 pl-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">Canceled</p>
                            <div className="flex items-end gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">94</h2>
                                <div className="flex items-center gap-0.5 text-xs text-red-500 font-medium mb-1">
                                    <ArrowDown size={12} /> <span>14.4%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* BIG CHART PANEL */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800">Report for this week</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
                                <button className="px-3 py-1 text-emerald-600 font-medium bg-emerald-50 border-r border-gray-200">This week</button>
                                <button className="px-3 py-1 text-gray-500 font-medium hover:bg-gray-50">Last week</button>
                            </div>
                            <MoreVertical size={16} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Chart Stats Row */}
                    <div className="flex gap-8 mb-8 border-b border-gray-100 pb-4">
                        <div className="relative">
                            <h2 className="text-xl font-bold text-gray-800">52k</h2>
                            <p className="text-xs text-gray-400">Customers</p>
                            <div className="absolute -bottom-4 left-0 w-full h-[3px] bg-emerald-400 rounded-t"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">3.5k</h2>
                            <p className="text-xs text-gray-400">Total Products</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">2.5k</h2>
                            <p className="text-xs text-gray-400">Stock Products</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">0.5k</h2>
                            <p className="text-xs text-gray-400">Out of Stock</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{formatCurrency(250, 0)}k</h2>
                            <p className="text-xs text-gray-400">Revenue</p>
                        </div>
                    </div>

                    {/* Simple SVG Chart Representation */}
                    <div className="relative h-48 w-full mt-8">
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
                            {/* Grid Lines */}
                            <div className="w-full h-full flex flex-col justify-between">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="w-full border-b border-gray-50"></div>
                                ))}
                            </div>

                            {/* SVG Line & Area Fill */}
                            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,80 C10,80 15,40 25,40 C35,40 40,80 50,80 C60,80 65,30 75,30 C85,30 90,60 100,60 L100,100 L0,100 Z"
                                    fill="url(#chartGradient)"
                                />
                                <path
                                    d="M0,80 C10,80 15,40 25,40 C35,40 40,80 50,80 C60,80 65,30 75,30 C85,30 90,60 100,60"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                />
                                {/* Tooltip Marker (Thursday) */}
                                <circle cx="50" cy="80" r="4" fill="white" stroke="#10b981" strokeWidth="2" />
                            </svg>

                            {/* Tooltip Overlay */}
                            <div className="absolute left-1/2 -ml-8 bottom-4 bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs text-center border border-emerald-200">
                                <span className="font-bold block">14k</span>
                                <span className="text-[10px]">Thursday</span>
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

                {/* SIDE STATS PANEL */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-8 flex flex-col">

                    {/* Users in last 30 min */}
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xs font-semibold text-blue-600">Users in last 30 minutes</h3>
                            <MoreVertical size={14} className="text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">21.5K</h2>
                        <p className="text-[10px] text-gray-400 mb-3">Users per minute</p>

                        {/* Bar Chart Mockup */}
                        <div className="flex items-end gap-1 h-10">
                            {[4, 10, 8, 5, 9, 3, 7, 10, 5, 8, 4, 3, 10, 7, 5, 8, 9, 4, 10, 6, 8, 10, 10, 8, 5].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500 rounded-sm hover:opacity-80 transition-opacity" style={{ height: `${h * 10}%` }}></div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Visits by Location */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-800">Visits by Location</h3>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-gray-100 mb-4 text-xs font-semibold">
                            <button
                                onClick={() => setLocationTab('countries')}
                                className={`pb-2 border-b-2 transition-colors ${locationTab === 'countries' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Countries</button>
                            <button
                                onClick={() => setLocationTab('states')}
                                className={`pb-2 border-b-2 transition-colors ${locationTab === 'states' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>States/Regions</button>
                        </div>

                        {/* Location List */}
                        <div className="space-y-4">
                            {trafficStats[locationTab]?.slice(0, 5).map((loc, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Globe size={12} className="text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-semibold text-gray-800">{loc.value} <span className="font-normal text-gray-400">{loc.name}</span></span>
                                            <span className="text-gray-500 flex items-center text-[10px]">{loc.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${loc.percentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!trafficStats[locationTab] || trafficStats[locationTab].length === 0) && (
                                <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-lg">No location data available</div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-6"></div>

                    {/* Traffic Sources */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-800">Traffic Sources</h3>
                            <span className="text-xs font-semibold text-gray-500">{trafficStats.total_visits} Visits</span>
                        </div>

                        <div className="space-y-4">
                            {trafficStats.sources.map((source, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Globe size={12} className="text-gray-500" style={{ color: source.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-semibold text-gray-800">{source.value} <span className="font-normal text-gray-400 capitalize">{source.name}</span></span>
                                            <span className="text-gray-500 flex items-center text-[10px]">{source.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${source.percentage}%`, backgroundColor: source.color || '#10b981' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {trafficStats.sources.length === 0 && (
                                <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded-lg">No traffic data available</div>
                            )}
                        </div>
                    </div>

                    <button className="w-full py-2 border border-blue-200 text-blue-600 rounded-full text-xs font-semibold hover:bg-blue-50 transition-colors mt-6">
                        View Insight
                    </button>
                </div>
            </div>

            {/* 3. TRANSACTIONS & TOP PRODUCTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transactions Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-gray-800">Transaction</h3>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                            Filter <Filter size={12} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-gray-400 font-medium border-b border-gray-50">
                                <tr>
                                    <th className="pb-3 px-2 font-medium">No</th>
                                    <th className="pb-3 px-2 font-medium">Id Customer</th>
                                    <th className="pb-3 px-2 font-medium">Order Date</th>
                                    <th className="pb-3 px-2 font-medium">Status</th>
                                    <th className="pb-3 px-2 font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 font-medium">
                                <tr className="border-b border-gray-50/50">
                                    <td className="py-4 px-2">1.</td>
                                    <td className="py-4 px-2">#6545</td>
                                    <td className="py-4 px-2 text-gray-500">01 Oct | 11:29 am</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Paid</span>
                                    </td>
                                    <td className="py-4 px-2">{formatCurrency(64)}</td>
                                </tr>
                                <tr className="border-b border-gray-50/50">
                                    <td className="py-4 px-2">2.</td>
                                    <td className="py-4 px-2">#5412</td>
                                    <td className="py-4 px-2 text-gray-500">01 Oct | 11:29 am</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>Pending</span>
                                    </td>
                                    <td className="py-4 px-2">{formatCurrency(557)}</td>
                                </tr>
                                <tr className="border-b border-gray-50/50">
                                    <td className="py-4 px-2">3.</td>
                                    <td className="py-4 px-2">#6622</td>
                                    <td className="py-4 px-2 text-gray-500">01 Oct | 11:29 am</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Paid</span>
                                    </td>
                                    <td className="py-4 px-2">{formatCurrency(156)}</td>
                                </tr>
                                <tr className="border-b border-gray-50/50">
                                    <td className="py-4 px-2">4.</td>
                                    <td className="py-4 px-2">#6462</td>
                                    <td className="py-4 px-2 text-gray-500">01 Oct | 11:29 am</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Paid</span>
                                    </td>
                                    <td className="py-4 px-2">{formatCurrency(265)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Top Products</h3>
                        <button className="text-[10px] text-blue-600 font-semibold hover:underline">All product</button>
                    </div>

                    <div className="relative mb-6">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Smartphone size={18} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-semibold text-gray-800 truncate">Apple iPhone 13</p>
                                    <p className="text-[10px] text-gray-400">Item: #FXZ-4567</p>
                                </div>
                                <span className="text-xs font-bold text-gray-800 ml-2">{formatCurrency(999)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Shirt size={18} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-semibold text-gray-800 truncate">Nike Air Jordan</p>
                                    <p className="text-[10px] text-gray-400">Item: #FXZ-4567</p>
                                </div>
                                <span className="text-xs font-bold text-gray-800 ml-2">{formatCurrency(72.40)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">T</span>
                            </div>
                            <div className="flex-1 min-w-0 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-semibold text-gray-800 truncate">T-shirt</p>
                                    <p className="text-[10px] text-gray-400">Item: #FXZ-4567</p>
                                </div>
                                <span className="text-xs font-bold text-gray-800 ml-2">{formatCurrency(35.40)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-800 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">👜</span>
                            </div>
                            <div className="flex-1 min-w-0 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-semibold text-gray-800 truncate">Assorted Cross Bag</p>
                                    <p className="text-[10px] text-gray-400">Item: #FXZ-4567</p>
                                </div>
                                <span className="text-xs font-bold text-gray-800 ml-2">{formatCurrency(80)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. BEST SELLING & ADD PRODUCT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Best Selling Product */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-gray-800">Best selling product</h3>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                            Filter <Filter size={12} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-[#eaf4f0] text-emerald-800 font-semibold text-[10px] tracking-wider uppercase">
                                <tr>
                                    <th className="py-2.5 px-4 rounded-l-lg">PRODUCT</th>
                                    <th className="py-2.5 px-2">TOTAL ORDER</th>
                                    <th className="py-2.5 px-2">STATUS</th>
                                    <th className="py-2.5 px-4 rounded-r-lg">PRICE</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 font-medium">
                                <tr className="border-b border-gray-50/50">
                                    <td className="py-4 px-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                            <Smartphone size={14} className="text-gray-600" />
                                        </div>
                                        <span>Apple iPhone 13</span>
                                    </td>
                                    <td className="py-4 px-2">104</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Stock</span>
                                    </td>
                                    <td className="py-4 px-4">{formatCurrency(999)}</td>
                                </tr>
                                <tr className="border-b border-gray-50/50">
                                    <td className="py-4 px-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                            <Shirt size={14} className="text-gray-600" />
                                        </div>
                                        <span>Nike Air Jordan</span>
                                    </td>
                                    <td className="py-4 px-2">56</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5 text-red-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Stock out</span>
                                    </td>
                                    <td className="py-4 px-4">{formatCurrency(999)}</td>
                                </tr>
                                <tr className="border-b border-gray-50/50">
                                    <td className="py-4 px-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-900 flex items-center justify-center text-white text-[10px]">T</div>
                                        <span>T-shirt</span>
                                    </td>
                                    <td className="py-4 px-2">266</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Stock</span>
                                    </td>
                                    <td className="py-4 px-4">{formatCurrency(999)}</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-amber-800 flex items-center justify-center text-white text-[10px]">👜</div>
                                        <span>Cross Bag</span>
                                    </td>
                                    <td className="py-4 px-2">506</td>
                                    <td className="py-4 px-2">
                                        <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Stock</span>
                                    </td>
                                    <td className="py-4 px-4">{formatCurrency(999)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button className="px-5 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Add New Product Panel */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Add New Product</h3>
                        <button className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold hover:underline border border-transparent hover:border-blue-200 px-2 py-1 rounded">
                            <Plus size={10} /> Add New
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-400 mb-3">Categories</p>

                    <div className="space-y-2 mb-4">
                        <button className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                    <Smartphone size={14} className="text-gray-600" />
                                </div>
                                <span className="text-xs font-semibold text-gray-800">Electronic</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                    <Shirt size={14} className="text-gray-600" />
                                </div>
                                <span className="text-xs font-semibold text-gray-800">Fashion</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                    <HomeIcon size={14} className="text-gray-600" />
                                </div>
                                <span className="text-xs font-semibold text-gray-800">Home</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                        </button>
                    </div>
                    <div className="text-center mb-6">
                        <button className="text-[10px] text-blue-600 hover:underline">See more</button>
                    </div>

                    <p className="text-[10px] text-gray-400 mb-3">Product</p>

                    <div className="space-y-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">⌚</div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Smart Fitness Tracker</p>
                                    <p className="text-[10px] text-emerald-500 font-bold">{formatCurrency(39.99)}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-semibold hover:bg-emerald-600 transition-colors">
                                <Plus size={10} /> Add
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-amber-800 flex items-center justify-center text-white text-[10px]">👛</div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Leather Wallet</p>
                                    <p className="text-[10px] text-emerald-500 font-bold">{formatCurrency(19.99)}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-semibold hover:bg-emerald-600 transition-colors">
                                <Plus size={10} /> Add
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">✂️</div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Electric Hair Trimmer</p>
                                    <p className="text-[10px] text-emerald-500 font-bold">{formatCurrency(34.99)}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-semibold hover:bg-emerald-600 transition-colors">
                                <Plus size={10} /> Add
                            </button>
                        </div>
                    </div>

                    <div className="text-center">
                        <button className="text-[10px] text-blue-600 hover:underline">See more</button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
