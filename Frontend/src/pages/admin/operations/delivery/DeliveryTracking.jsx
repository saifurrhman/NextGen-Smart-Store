import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, Plus, MoreVertical, Edit2, Trash2, ChevronLeft, ChevronRight, MapPin, Package } from 'lucide-react';
import api from '../../../../utils/api';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DeliveryTracking = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        fetchDeliveries();
    }, [page, searchTerm]);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/v1/operations/delivery/?page=${page}&search=${searchTerm}`);
            setDeliveries(response.data.results);
            setPagination({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous
            });
        } catch (error) {
            console.error("Failed to fetch deliveries:", error);
        } finally {
            setLoading(false);
        }
    };

    const mapDeliveries = deliveries.filter(d => d.latitude && d.longitude);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Truck size={22} className="text-brand" />
                        Live Tracking Console
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time status and visual map for all active shipments</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${showMap ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}
                    >
                        <MapPin size={16} />
                        {showMap ? 'Close Map' : 'View Live Map'}
                    </button>
                    <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                        <Plus size={16} />
                        New Shipment
                    </button>
                </div>
            </div>

            {showMap && (
                <div className="h-[400px] w-full rounded-2xl overflow-hidden border-4 border-white shadow-xl relative z-10 animate-in fade-in zoom-in duration-300">
                    <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {mapDeliveries.map(d => (
                            <Marker key={d.id} position={[parseFloat(d.latitude), parseFloat(d.longitude)]}>
                                <Popup>
                                    <div className="p-1">
                                        <p className="font-bold text-emerald-600">Order #{d.order}</p>
                                        <p className="text-xs text-gray-500 font-medium">Status: {d.status}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">ID: {d.tracking_id}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                    <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-gray-100 shadow-sm text-[10px] font-bold text-gray-600">
                        {mapDeliveries.length} Packages Active
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Tracking ID or Order ID..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f0fdf4] text-emerald-800 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Tracking ID</th>
                                <th className="px-6 py-3">Order</th>
                                <th className="px-6 py-3">Delivery Boy</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Estimated Delivery</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : deliveries.length > 0 ? (
                                deliveries.map((delivery) => (
                                    <tr key={delivery.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Package size={16} className="text-gray-400" />
                                                <span className="font-mono font-bold text-gray-700">{delivery.tracking_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-brand">Order #{delivery.order}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{delivery.delivery_boy_details?.username || 'Unassigned'}</span>
                                                <span className="text-xs text-gray-500">{delivery.delivery_boy_details?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${delivery.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                delivery.status === 'in_transit' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                    delivery.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                                        'bg-red-50 text-red-700 border border-red-100'
                                                }`}>
                                                <span className={`w-1 h-1 rounded-full ${delivery.status === 'delivered' ? 'bg-emerald-500' :
                                                    delivery.status === 'in_transit' ? 'bg-blue-500' :
                                                        delivery.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}></span>
                                                {delivery.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {delivery.estimated_delivery ? new Date(delivery.estimated_delivery).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                {delivery.latitude && (
                                                    <button
                                                        onClick={() => setShowMap(true)}
                                                        className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors animate-pulse"
                                                        title="Live on Map"
                                                    >
                                                        <MapPin size={16} />
                                                    </button>
                                                )}
                                                <button className="p-1.5 hover:bg-gray-100 rounded hover:text-brand transition-colors"><Edit2 size={16} /></button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50">
                                        No deliveries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.count > 20 && (
                    <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                        <span>Showing {deliveries.length} entries of {pagination.count}</span>
                        <div className="flex gap-1">
                            {/* Pagination buttons */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryTracking;
