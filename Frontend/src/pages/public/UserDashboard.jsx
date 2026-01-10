import React, { useEffect, useState } from 'react';
import { User, Package, Heart, LogOut } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // In real implementation:
                // const res = await api.get('/orders/history/');
                // setOrders(res.data);

                // Mock data for demo
                const mockOrders = [
                    { id: 101, total: 299.99, status: 'Delivered', date: '2025-12-01', items: [{ name: 'Smart Watch X', qty: 1 }] },
                    { id: 102, total: 49.50, status: 'Processing', date: '2026-01-08', items: [{ name: 'Wireless Charger', qty: 2 }] }
                ];
                setOrders(mockOrders);
            } catch (err) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'orders') fetchOrders();
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-brand text-white' : 'bg-white text-text-sub hover:bg-gray-100'}`}
                    >
                        <User size={20} /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-brand text-white' : 'bg-white text-text-sub hover:bg-gray-100'}`}
                    >
                        <Package size={20} /> Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'wishlist' ? 'bg-brand text-white' : 'bg-white text-text-sub hover:bg-gray-100'}`}
                    >
                        <Heart size={20} /> Wishlist
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-functional-error hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm p-6 min-h-[400px]">
                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-brand-dark">Order History</h2>
                            {loading ? <p>Loading orders...</p> : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                                            <div>
                                                <p className="font-semibold text-brand-dark">Order #{order.id}</p>
                                                <p className="text-sm text-text-sub">{order.date}</p>
                                                <div className="mt-2 text-sm text-text-sub">
                                                    {order.items.map((item, idx) => (
                                                        <span key={idx}>{item.qty}x {item.name}{idx < order.items.length - 1 ? ', ' : ''}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-brand-dark">${order.total.toFixed(2)}</p>
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${order.status === 'Delivered' ? 'bg-green-100 text-functional-success' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <p className="text-text-sub">No orders found.</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-brand-dark">Profile Details</h2>
                            <div className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-text-sub">Display Name</label>
                                    <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 px-4 py-2 text-text-main" value="Demo User" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-sub">Email</label>
                                    <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 px-4 py-2 text-text-main" value="demo@example.com" readOnly />
                                </div>
                                <button className="px-4 py-2 bg-action text-white rounded-md hover:bg-action-hover">Update Profile</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <div className="text-center py-10">
                            <Heart className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-brand-dark">Your wishlist is empty</h3>
                            <button onClick={() => navigate('/products')} className="mt-4 text-action hover:text-action-hover">Explore Products &rarr;</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
