import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, Filter, Truck, UserPlus, Package, ChevronRight } from 'lucide-react';
import api from '../../../../utils/api';

const AssignDelivery = () => {
    const [orders, setOrders] = useState([]);
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch pending orders (status=pending or similar)
            const ordersResponse = await api.get('orders/?status=pending');
            setOrders(ordersResponse.data.results || []);

            // Fetch available delivery boys
            const boysResponse = await api.get('users/?role=DELIVERY');
            setDeliveryBoys(boysResponse.data.results || []);
        } catch (error) {
            console.error("Failed to fetch assignment data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (orderId, boyId) => {
        try {
            // In a real app, this would create a Delivery record
            await api.post('operations/delivery/', {
                order_id: orderId,
                delivery_boy: boyId,
                tracking_id: `TRK${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                status: 'pending'
            });
            alert("Delivery assigned successfully!");
            fetchData();
            setSelectedOrder(null);
        } catch (error) {
            console.error("Failed to assign delivery:", error);
            alert("Error assigning delivery.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <ClipboardCheck size={22} className="text-brand" />
                        Assign Deliveries
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Assign pending orders to your delivery team members</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Orders */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/30">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Package size={18} className="text-brand" />
                            Pending Orders ({orders.length})
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-xl"></div>
                            ))
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`w-full p-4 rounded-xl text-left transition-all ${selectedOrder?.id === order.id ? 'bg-brand/5 ring-1 ring-brand' : 'bg-white border border-gray-100 hover:border-brand/40 shadow-sm'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-900">Order #{order.id}</span>
                                        <span className="text-brand font-bold">PKR {order.total_amount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="font-medium">{order.items?.length || 0} Items</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>Ordered {new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="py-20 text-center text-gray-400 italic">No pending orders to assign.</div>
                        )}
                    </div>
                </div>

                {/* Delivery Boy Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/30">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Truck size={18} className="text-brand" />
                            Select Delivery Personnel
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {!selectedOrder ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                <UserPlus size={48} className="mb-4 opacity-20" />
                                <p className="font-medium">Select an order first to assign a delivery boy.</p>
                            </div>
                        ) : (
                            deliveryBoys.map((boy) => (
                                <div key={boy.id} className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between group hover:border-brand/40 transition-all shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                            {boy.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{boy.username}</p>
                                            <p className="text-xs text-gray-500">3 active deliveries</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAssign(selectedOrder.id, boy.id)}
                                        className="px-4 py-2 bg-gray-50 text-brand font-bold text-xs rounded-lg hover:bg-brand hover:text-white transition-all border border-transparent hover:border-brand"
                                    >
                                        Assign Order
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignDelivery;
