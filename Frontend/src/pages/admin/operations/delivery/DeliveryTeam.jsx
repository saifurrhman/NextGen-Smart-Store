import { Users, Search, Filter, Plus, Mail, Phone, ChevronLeft, ChevronRight, User, MoreVertical, Truck, Calendar, CheckCircle, Clock } from 'lucide-react';
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
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-brand-dark tracking-tight">Delivery Squad</h2>
                        <p className="text-xs text-gray-500 font-medium">Monitoring {pagination.count} field specialists</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1">
                    <Plus size={18} />
                    Onboard Specialist
                </button>
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
                                <div className="absolute top-6 right-6 group-hover:block hidden">
                                    <button className="p-2 hover:bg-emerald-50 rounded-xl text-gray-400 hover:text-emerald-600 transition-all"><MoreVertical size={18} /></button>
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
                        <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 bg-gray-50/30 rounded-[3rem] border-4 border-dashed border-gray-100">
                            <Users size={48} className="text-gray-200" />
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Specialists In View</p>
                        </div>
                    )}
                </div>

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
