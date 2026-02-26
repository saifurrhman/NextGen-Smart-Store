import React from 'react';
import { History, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const ChatHistory = () => {
    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <History size={22} className="text-brand" />
                        Chat History
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your chat history</p>
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
                            placeholder="Search in Chat History..." 
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
                                
                                <th className="px-6 py-3">Session ID</th>
                                
                                <th className="px-6 py-3">Customer</th>
                                
                                <th className="px-6 py-3">Agent</th>
                                
                                <th className="px-6 py-3">Duration</th>
                                
                                <th className="px-6 py-3">Date</th>
                                
                                <th className="px-6 py-3">Transcript</th>
                                
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-900">CHAT-1005</td>
                                <td className="px-6 py-4 text-gray-600">
                                    Fatima N.
                                </td>
                                <td className="px-6 py-4 text-gray-600">Agent Zara</td>
                                <td className="px-6 py-4 text-gray-600">8m 30s</td>
                                <td className="px-6 py-4 text-gray-600">Today 9:45 AM</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    View
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
                                <td className="px-6 py-4 font-medium text-gray-900">CHAT-1004</td>
                                <td className="px-6 py-4 text-gray-600">
                                    Ahmed Ali
                                </td>
                                <td className="px-6 py-4 text-gray-600">Agent Hassan</td>
                                <td className="px-6 py-4 text-gray-600">15m 12s</td>
                                <td className="px-6 py-4 text-gray-600">Yesterday 4:20 PM</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    View
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
                                <td className="px-6 py-4 font-medium text-gray-900">CHAT-1003</td>
                                <td className="px-6 py-4 text-gray-600">
                                    Guest_8820
                                </td>
                                <td className="px-6 py-4 text-gray-600">Agent Sana</td>
                                <td className="px-6 py-4 text-gray-600">3m 45s</td>
                                <td className="px-6 py-4 text-gray-600">Yesterday 2:10 PM</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    View
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
                    <span>Showing 3 entries</span>
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

export default ChatHistory;
