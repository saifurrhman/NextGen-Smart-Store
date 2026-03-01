import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Store, Factory, ShieldCheck, Truck } from 'lucide-react';

const portals = [
    { id: 'customer', name: 'Shopping', icon: ShoppingBag, path: '/login', color: 'text-brand', bg: 'bg-brand/5' },
    { id: 'vendor', name: 'Vendor', icon: Factory, path: '/vendor/login', color: 'text-action', bg: 'bg-action/5' },
    { id: 'seller', name: 'Seller', icon: Store, path: '/seller/login', color: 'text-action', bg: 'bg-action/5' },
    { id: 'admin', name: 'Admin', icon: ShieldCheck, path: '/admin/login', color: 'text-gray-900', bg: 'bg-gray-900/5' },
    { id: 'delivery', name: 'Delivery', icon: Truck, path: '/delivery/login', color: 'text-orange-600', bg: 'bg-orange-600/5' },
];

const PortalSwitcher = () => {
    const location = useLocation();

    return (
        <div className="mt-12 space-y-6 relative z-10">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                    <span className="px-5 bg-white text-gray-400 font-black uppercase tracking-[0.2em]">Switch Ecosystem</span>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 px-2">
                {portals.map((portal) => {
                    const isActive = location.pathname.startsWith(portal.path.split('/login')[0]);
                    const Icon = portal.icon;

                    return (
                        <Link
                            key={portal.id}
                            to={portal.path}
                            className={`flex flex-col items-center gap-2 group p-2 rounded-2xl transition-all duration-500 hover:scale-105 ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:shadow-md ${isActive ? 'bg-white border border-gray-100' : 'bg-gray-50 border border-transparent'}`}>
                                <Icon size={16} className={`${portal.color} ${isActive ? 'scale-110 opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'} transition-all duration-500`} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tighter transition-all duration-500 ${isActive ? 'text-gray-900' : 'text-gray-300 group-hover:text-gray-600'}`}>
                                {portal.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default PortalSwitcher;
