import {
    Ticket, Search, Filter, Download, Plus,
    MoreVertical, ArrowUp, ArrowDown, Headphones,
    Shirt, Wallet, Dumbbell, Coffee, Camera, Truck
} from 'lucide-react';

const AllOrders = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
            </div>

            {/* TOP STAT CARDS ROW */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Order List</h2>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                            <Plus size={14} /> Add Order
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                            More Action <MoreVertical size={14} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Orders Card */}
                    <div className="border border-gray-100 rounded-xl p-5 relative">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Total Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">1,240</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                <ArrowUp size={12} /> <span>14.4%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>

                    {/* New Orders Card */}
                    <div className="border border-gray-100 rounded-xl p-5 relative">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">New Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">240</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                <ArrowUp size={12} /> <span>20%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>

                    {/* Completed Orders Card */}
                    <div className="border border-gray-100 rounded-xl p-5 relative">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Completed Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">960</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mb-1.5">
                                <span>85%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>

                    {/* Canceled Orders Card */}
                    <div className="border border-gray-100 rounded-xl p-5 relative">
                        <button className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-800 mb-4">Canceled Orders</h3>
                        <div className="flex items-end gap-3 mb-1">
                            <h2 className="text-3xl font-bold text-gray-800">87</h2>
                            <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mb-1.5">
                                <ArrowDown size={12} /> <span>5%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Last 7 days</p>
                    </div>
                </div>

                {/* Table Header/Toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex items-center bg-gray-50/50 rounded-lg p-1 border border-gray-100">
                        <button className="px-4 py-2 text-xs font-bold text-gray-800 bg-white rounded-md shadow-sm border border-gray-200">
                            All order <span className="text-emerald-500 font-bold ml-1">(240)</span>
                        </button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Completed</button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Pending</button>
                        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">Canceled</button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search order report"
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <ArrowUp size={18} className="transform -rotate-45" />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-5 rounded-l-lg w-16">No.</th>
                                <th className="py-3 px-3">Order Id</th>
                                <th className="py-3 px-3">Product</th>
                                <th className="py-3 px-3">Date</th>
                                <th className="py-3 px-3 text-center">Price</th>
                                <th className="py-3 px-3">Payment</th>
                                <th className="py-3 px-5 rounded-r-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 font-medium divide-y divide-gray-50/50">
                            {[
                                { num: '1', id: '#ORD0001', icon: Headphones, iconColor: 'text-blue-500', name: 'Wireless Bluetooth Headphones', date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: Shirt, iconColor: 'text-gray-800', name: "Men's T-Shirt", date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Pending', statusColor: 'amber' },
                                { num: '1', id: '#ORD0001', icon: Wallet, iconColor: 'text-amber-800', name: "Men's Leather Wallet", date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: 'pillow', iconColor: 'text-gray-300', name: 'Memory Foam Pillow', date: '01-01-2025', price: '39.99', payment: 'Paid', status: 'Shipped', statusColor: 'gray' },
                                { num: '1', id: '#ORD0001', icon: Dumbbell, iconColor: 'text-gray-900', name: 'Adjustable Dumbbells', date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Pending', statusColor: 'amber' },
                                { num: '1', id: '#ORD0001', icon: Coffee, iconColor: 'text-gray-900', name: 'Coffee Maker', date: '01-01-2025', price: '79.99', payment: 'Unpaid', status: 'Cancelled', statusColor: 'red' },
                                { num: '1', id: '#ORD0001', icon: 'cap', iconColor: 'text-green-200', name: 'Casual Baseball Cap', date: '01-01-2025', price: '49.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: Camera, iconColor: 'text-gray-900', name: 'Full HD Webcam', date: '01-01-2025', price: '39.99', payment: 'Paid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: 'bulb', iconColor: 'text-blue-200', name: 'Smart LED Color Bulb', date: '01-01-2025', price: '79.99', payment: 'Unpaid', status: 'Delivered', statusColor: 'emerald' },
                                { num: '1', id: '#ORD0001', icon: Shirt, iconColor: 'text-gray-800', name: "Men's T-Shirt", date: '01-01-2025', price: '14.99', payment: 'Unpaid', status: 'Delivered', statusColor: 'emerald' },
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border border-gray-300 rounded-sm"></div>
                                            <span className="text-gray-500">{row.num}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 font-semibold text-gray-800">{row.id}</td>
                                    <td className="py-4 px-3 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                            {typeof row.icon === 'string' ? (
                                                <div className={`w-5 h-4 bg-current rounded-sm ${row.iconColor}`}></div>
                                            ) : (
                                                <row.icon size={18} className={row.iconColor} />
                                            )}
                                        </div>
                                        <span className="font-semibold max-w-[200px] leading-tight">{row.name}</span>
                                    </td>
                                    <td className="py-4 px-3 text-gray-500">{row.date}</td>
                                    <td className="py-4 px-3 text-center">{row.price}</td>
                                    <td className="py-4 px-3">
                                        <span className={`flex items-center gap-1.5 ${row.payment === 'Paid' ? 'text-emerald-500' : 'text-red-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.payment === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            {row.payment}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className={`inline-flex flex-row items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-md border text-${row.statusColor}-600 border-${row.statusColor}-200 bg-${row.statusColor}-50`}>
                                            <Truck size={12} className={`text-${row.statusColor}-500`} />
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
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
    );
};

export default AllOrders;
