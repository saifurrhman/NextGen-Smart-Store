import React from 'react';
import { Store, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const AllVendors = () => {
    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Store size={22} className="text-brand" />
                        All Vendors
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your all vendors</p>
                </div>
                {!false && (
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <Download size={16} />
                            Export
                        </button>
                        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                            <Plus size={16} />
                            Create New
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search in All Vendors..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto shadow-sm">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>
                
                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                
                                <th className="px-6 py-3">Store ID</th>
                                
                                <th className="px-6 py-3">Store Name</th>
                                
                                <th className="px-6 py-3">Owner</th>
                                
                                <th className="px-6 py-3">Products</th>
                                
                                <th className="px-6 py-3">Revenue</th>
                                
                                <th className="px-6 py-3">Status</th>
                                
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-900">STR-001</td>
                                <td className="px-6 py-4 text-gray-600">
                                    Tech Hub
                                </td>
                                <td className="px-6 py-4 text-gray-600">Bilal A.</td>
                                <td className="px-6 py-4 text-gray-600">145</td>
                                <td className="px-6 py-4 text-gray-600">PKR 1.2M</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Active</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"><Edit2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                            
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-900">STR-002</td>
                                <td className="px-6 py-4 text-gray-600">
                                    Style Studio
                                </td>
                                <td className="px-6 py-4 text-gray-600">Sana K.</td>
                                <td className="px-6 py-4 text-gray-600">420</td>
                                <td className="px-6 py-4 text-gray-600">PKR 800K</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Active</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"><Edit2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                    <span>Showing 2 entries</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-brand text-white rounded">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AllVendors;
