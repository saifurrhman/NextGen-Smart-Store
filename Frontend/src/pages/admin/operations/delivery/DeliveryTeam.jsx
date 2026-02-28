import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Mail, Phone, ChevronLeft, ChevronRight, User } from 'lucide-react';
import api from '../../../../utils/api';

const DeliveryTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

    useEffect(() => {
        fetchTeam();
    }, [page, searchTerm]);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            // Fetch users with role=DELIVERY
            const response = await api.get(`/api/v1/users/?role=DELIVERY&page=${page}&search=${searchTerm}`);
            setTeam(response.data.results);
            setPagination({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch delivery team:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(pagination.count / 20);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Users size={22} className="text-brand" />
                        Delivery Team
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor your delivery personnel</p>
                </div>
                <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                    <Plus size={16} />
                    Add Member
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-xl border border-gray-100"></div>
                        ))
                    ) : team.length > 0 ? (
                        team.map((member) => (
                            <div key={member.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow group relative">
                                <div className="absolute top-4 right-4 group-hover:block hidden">
                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-brand transition-colors"><MoreVertical size={16} /></button>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl border-2 border-emerald-100">
                                        {member.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{member.username}</h3>
                                        <p className="text-xs text-brand font-semibold uppercase tracking-wider">Delivery Specialist</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> {member.email}</div>
                                    <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {member.phone_number || 'No Phone'}</div>
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase border border-green-100">Active Now</span>
                                        <span className="text-[10px] text-gray-300 ml-auto italic">Joined {new Date(member.date_joined).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-400 italic">No delivery team members found.</div>
                    )}
                </div>

                {pagination.count > 20 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {team.length} specialists</span>
                        <div className="flex gap-1">
                            {/* Pagination buttons */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryTeam;
