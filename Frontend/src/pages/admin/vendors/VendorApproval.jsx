import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Filter, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import api from '../../../utils/api';

const VendorApproval = () => {
    const [pendingVendors, setPendingVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPending = async () => {
            setLoading(true);
            try {
                const response = await api.get('/vendors/');
                // Filter pending vendors on frontend or backend (better on backend)
                setPendingVendors(response.data.results.filter(v => v.status === 'pending'));
            } catch (error) {
                console.error("Failed to fetch pending vendors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await api.post(`/vendors/${id}/${action}/`);
            setPendingVendors(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            alert(`Failed to ${action} vendor`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <UserCheck size={22} className="text-brand" />
                        Vendor Approvals
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Review and approve new vendor registrations</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Store Details</th>
                                <th className="px-6 py-3">Owner Information</th>
                                <th className="px-6 py-3 text-center">Applied Date</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{vendor.store_name}</span>
                                            <span className="text-[10px] text-gray-400 line-clamp-1">{vendor.store_description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">{vendor.owner_name}</span>
                                            <span className="text-[10px] text-gray-400">{vendor.owner_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-400 text-xs">
                                        {new Date(vendor.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(vendor.id, 'approve')}
                                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(vendor.id, 'reject')}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Reject"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pendingVendors.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-400 font-bold italic">
                                        No pending registrations to review.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VendorApproval;
