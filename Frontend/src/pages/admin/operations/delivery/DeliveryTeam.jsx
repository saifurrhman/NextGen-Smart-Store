import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Mail, Phone, ChevronLeft, ChevronRight, User, MoreVertical, Truck, Calendar, CheckCircle, Clock, ChevronDown, Download as ExportIcon, FileText, UserPlus, XCircle, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import api from '../../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../../utils/exportUtils';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showExportOptions, setShowExportOptions] = useState(false);

    // Onboard Specialist Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        is_active: true
    });

    useEffect(() => {
        fetchTeam();
    }, [page, searchTerm]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleOnboardSpecialist = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await api.post('/api/v1/users/', {
                ...formData,
                username: formData.email,
                role: 'DELIVERY'
            });
            setMsg({ type: 'success', text: 'Specialist account created successfully!' });
            setFormData({ first_name: '', last_name: '', email: '', password: '', phone_number: '', is_active: true });
            // Refresh list
            fetchTeam();
            setTimeout(() => {
                setShowAddModal(false);
                setMsg({ type: '', text: '' });
            }, 1500);
        } catch (error) {
            console.error("Failed to onboard specialist:", error);
            const errorMsg = error.response?.data?.detail ||
                (error.response?.data?.email ? error.response.data.email[0] : null) ||
                'Failed to onboard specialist. Please check if email is unique.';
            setMsg({ type: 'error', text: errorMsg });
        } finally {
            setCreateLoading(false);
        }
    };

    const fetchTeam = async () => {
        setLoading(true);
        try {
            // Fetch users with role=DELIVERY
            const response = await api.get(`/api/v1/users/?role=DELIVERY&page=${page}&search=${searchTerm}`);
            setTeam(response.data.results || []);
            setPagination({
                count: response.data.count || 0,
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch delivery team:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        const dataToExport = team.map(member => ({
            "Username": member.username,
            "Email": member.email,
            "Phone": member.phone_number || 'N/A',
            "Total Deliveries": member.stats?.total || 0,
            "Success": member.stats?.delivered || 0,
            "Pending": member.stats?.pending || 0,
            "Onboarded": new Date(member.date_joined).toLocaleDateString()
        }));
        exportToExcel(dataToExport, "Delivery_Squad_Report");
        setShowExportOptions(false);
    };

    const handleExportCSV = () => {
        const dataToExport = team.map(member => ({
            "Username": member.username,
            "Email": member.email,
            "Phone": member.phone_number || 'N/A',
            "Total Deliveries": member.stats?.total || 0,
            "Success": member.stats?.delivered || 0,
            "Pending": member.stats?.pending || 0,
            "Onboarded": new Date(member.date_joined).toLocaleDateString()
        }));
        exportToCSV(dataToExport, "Delivery_Squad_Report");
        setShowExportOptions(false);
    };

    const handleExportPDF = () => {
        const columns = ["Username", "Email", "Total", "Success", "Pending", "Onboarded"];
        const dataToExport = team.map(member => [
            member.username,
            member.email,
            member.stats?.total || 0,
            member.stats?.delivered || 0,
            member.stats?.pending || 0,
            new Date(member.date_joined).toLocaleDateString()
        ]);
        exportToPDF(dataToExport, columns, "Delivery_Squad_Report", "Delivery Squad Performance Summary");
        setShowExportOptions(false);
    };

    const totalPages = Math.ceil(pagination.count / 20);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-brand-dark tracking-tight">Delivery Squad</h2>
                        <p className="text-xs text-gray-500 font-medium">Monitoring {pagination.count} field specialists</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportOptions(!showExportOptions)}
                            className="flex items-center gap-2 bg-white border border-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm group"
                        >
                            <ExportIcon size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                            Download Data
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportOptions ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showExportOptions && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowExportOptions(false)}
                                    ></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-1">
                                            <button
                                                onClick={handleExportExcel}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors border-none"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-emerald-500" />
                                                </div>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={handleExportCSV}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border-none"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                    <ExportIcon size={14} className="text-blue-500" />
                                                </div>
                                                Export CSV
                                            </button>
                                            <button
                                                onClick={handleExportPDF}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border-none"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                                    <FileText size={14} className="text-red-500" />
                                                </div>
                                                Export PDF
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-emerald-600 transition-all shadow-[0_8px_30px_rgb(16,185,129,0.2)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus size={20} className="stroke-[3px]" />
                        Onboard Specialist
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find a specialist..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                            Real-time Stats Active
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-50 animate-pulse rounded-[2rem] border border-gray-100"></div>
                        ))
                    ) : team.length > 0 ? (
                        team.map((member) => (
                            <div key={member.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-emerald-200/20 transition-all group relative">
                                <div className="absolute top-6 right-6 group-hover:block hidden z-10">
                                    <button
                                        onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                                        className="p-2 hover:bg-emerald-50 rounded-xl text-gray-400 hover:text-emerald-600 transition-all"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {activeMenuId === member.id && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenuId(null)}></div>
                                            <div className="absolute right-0 top-10 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 py-1.5 overflow-hidden">
                                                <button
                                                    onClick={() => alert(`Editing specialist: ${member.username}`)}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-black text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors uppercase tracking-widest text-left"
                                                >
                                                    <User size={14} /> Profile
                                                </button>
                                                <button
                                                    onClick={() => alert(`Reseting password for: ${member.username}`)}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors uppercase tracking-widest text-left"
                                                >
                                                    <Key size={14} /> Reset Pass
                                                </button>
                                                <div className="h-px bg-gray-50 my-1"></div>
                                                <button
                                                    onClick={() => { if (window.confirm(`Deactivate ${member.username}?`)) alert('Deactivated.'); }}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-black text-red-600 hover:bg-red-50 transition-colors uppercase tracking-widest text-left"
                                                >
                                                    <XCircle size={14} /> Deactivate
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl border-2 border-emerald-100 shadow-inner">
                                        {member.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 tracking-tight">{member.username}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Active Specialist</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Real Stats */}
                                <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total</p>
                                        <p className="text-sm font-black text-gray-900">{member.stats?.total || 0}</p>
                                    </div>
                                    <div className="text-center border-x border-gray-100">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Success</p>
                                        <p className="text-sm font-black text-emerald-600">{member.stats?.delivered || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">Pending</p>
                                        <p className="text-sm font-black text-amber-600">{member.stats?.pending || 0}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-xs font-bold text-gray-500">
                                    <div className="flex items-center gap-3 bg-gray-50/30 p-2 rounded-xl border border-gray-100/30">
                                        <Mail size={14} className="text-emerald-500" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50/30 p-2 rounded-xl border border-gray-100/30">
                                        <Phone size={14} className="text-emerald-500" />
                                        <span>{member.phone_number || 'Not Linked'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                        <Calendar size={12} className="text-gray-300" />
                                        <span className="text-[10px] text-gray-400 font-bold">Onboarded: {new Date(member.date_joined).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center flex flex-col items-center gap-6 bg-gradient-to-b from-gray-50/50 to-white rounded-[4rem] border-2 border-dashed border-emerald-100 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-50/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-200 group-hover:text-emerald-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                                <Users size={48} />
                            </div>
                            <div className="space-y-2 relative z-10">
                                <p className="text-lg font-black text-gray-900 tracking-tight lowercase">no specialists in view</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest max-w-[200px] leading-relaxed mx-auto">
                                    your delivery squad is empty. start by onboarding your first field agent.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 px-8 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
                            >
                                add first specialist
                            </button>
                        </div>
                    )}
                </div>

                {/* Onboard Specialist Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !createLoading && setShowAddModal(false)}></div>
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <UserPlus size={22} /> Onboard New Specialist
                                    </h3>
                                    <p className="text-emerald-50 text-xs mt-1 font-medium">Create a delivery agent account</p>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-all"
                                >
                                    <XCircle size={22} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleOnboardSpecialist} className="p-6 space-y-5">
                                {msg.text && (
                                    <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {msg.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            required
                                            value={formData.first_name}
                                            onChange={handleFormChange}
                                            placeholder="Specialist's first name"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            required
                                            value={formData.last_name}
                                            onChange={handleFormChange}
                                            placeholder="Specialist's last name"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                placeholder="delivery@example.com"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleFormChange}
                                                placeholder="+92 300 1234567"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                                        <div className="relative">
                                            <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleFormChange}
                                                placeholder="Minimum 8 characters"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div>
                                                <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Active Specialist</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Enable delivery assignments</p>
                                            </div>
                                            <label className="flex items-center cursor-pointer relative">
                                                <input
                                                    type="checkbox"
                                                    name="is_active"
                                                    checked={formData.is_active}
                                                    onChange={handleFormChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        disabled={createLoading}
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-3 text-sm font-black text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="flex-1 py-3 bg-emerald-500 text-white text-sm font-black rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {createLoading ? 'Finalizing...' : <><Plus size={18} /> Onboard Specialist</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {pagination.count > 20 && (
                    <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                disabled={!pagination.previous}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={!pagination.next}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryTeam;
