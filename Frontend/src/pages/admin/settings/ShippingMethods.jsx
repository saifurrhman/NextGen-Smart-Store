import React, { useState } from 'react';
import {
    Truck, Map, Clock, Plus,
    MoreVertical, Edit2, Trash2, Globe,
    Home, ChevronRight, CheckCircle2, Shield
} from 'lucide-react';

const ShippingMethods = () => {
    const [methods, setMethods] = useState([
        { id: 1, name: 'Standard Shipping', provider: 'Leopards Courier', cost: 250, time: '3-5 Business Days', status: 'Active' },
        { id: 2, name: 'Express Delivery', provider: 'NextGen Delivery', cost: 500, time: '24 Hours', status: 'Active' },
        { id: 3, name: 'International Shipping', provider: 'DHL Express', cost: 4500, time: '7-12 Days', status: 'Inactive' },
    ]);

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Truck size={24} className="text-emerald-500" />
                        Shipping & Logistics
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Settings</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Shipping Methods</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                    <Plus size={18} /> Add New Method
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <Globe size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regions</p>
                        <h4 className="text-xl font-bold text-gray-800">Nationwide</h4>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Methods</p>
                        <h4 className="text-xl font-bold text-gray-800">2 Carriers</h4>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security</p>
                        <h4 className="text-xl font-bold text-gray-800">Insured</h4>
                    </div>
                </div>
            </div>

            {/* Methods Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/20">
                    <h3 className="text-lg font-bold text-gray-800">Carrier Configuration</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Method Name</th>
                                <th className="px-6 py-4">Carrier</th>
                                <th className="px-6 py-4">Base Cost</th>
                                <th className="px-6 py-4">EST. Delivery</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {methods.map(method => (
                                <tr key={method.id} className="hover:bg-gray-50/30 transition-colors group text-sm">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-800">{method.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter shrink-0 border border-gray-200">
                                                {method.provider[0]}
                                            </div>
                                            <span className="font-medium text-gray-600">{method.provider}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">PKR {method.cost}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                            <Clock size={12} /> {method.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${method.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                                            }`}>
                                            {method.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-emerald-500 transition-all shadow-sm"><Edit2 size={14} /></button>
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-all shadow-sm"><Trash2 size={14} /></button>
                                            <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-gray-800 transition-all shadow-sm"><MoreVertical size={14} /></button>
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

export default ShippingMethods;
