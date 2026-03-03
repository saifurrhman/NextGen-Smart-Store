import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, User, MapPin, Phone, CreditCard,
    ShoppingBag, Package, StickyNote, Mail, Trash2,
    CheckCircle, CheckCircle2, AlertCircle, Headphones,
    Shirt, Wallet, Dumbbell, Coffee, Camera, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../utils/api';

// ─── Helpers ────────────────────────────────────────────
const getIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('shirt')) return Shirt;
    if (n.includes('wallet')) return Wallet;
    if (n.includes('dumbbell')) return Dumbbell;
    if (n.includes('coffee')) return Coffee;
    if (n.includes('webcam') || n.includes('camera')) return Camera;
    return Headphones;
};

const PAYMENT_METHODS = [
    { value: 'cash_on_delivery', label: 'Cash on Delivery', short: 'COD' },
    { value: 'bank_transfer', label: 'Bank Transfer', short: 'Bank' },
    { value: 'card', label: 'Card Payment', short: 'Card' },
];

// ─────────────────────────────────────────────────────────
const CreateOrder = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');

    const [orderDetails, setOrderDetails] = useState({
        shipping_address: '',
        city: '',
        postal_code: '',
        payment_method: 'cash_on_delivery',
        notes: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // ── Fetch data ──────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [custRes, prodRes] = await Promise.all([
                    api.get('/api/v1/users/customers/'),
                    api.get('/api/v1/products/'),
                ]);
                setCustomers(custRes.data);
                setProducts(prodRes.data);
            } catch (err) {
                console.error('Failed to load data:', err);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    // ── Product helpers ─────────────────────────────────
    const addProduct = (prod) => {
        if (selectedProducts.find(p => p.id === prod.id)) return;
        setSelectedProducts(prev => [...prev, { ...prod, quantity: 1 }]);
        setProductSearch('');
    };

    const removeProduct = (id) =>
        setSelectedProducts(prev => prev.filter(p => p.id !== id));

    const updateQty = (id, q) => {
        if (q < 1) return;
        setSelectedProducts(prev =>
            prev.map(p => (p.id === id ? { ...p, quantity: q } : p))
        );
    };

    const total = selectedProducts.reduce(
        (acc, p) => acc + parseFloat(p.price) * p.quantity, 0
    );

    // ── Filtered lists ──────────────────────────────────
    const filteredCustomers = customers.filter(c =>
        `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(customerSearch.toLowerCase())
    );

    const filteredProducts = products.filter(p =>
        p.title?.toLowerCase().includes(productSearch.toLowerCase()) &&
        !selectedProducts.find(sp => sp.id === p.id)
    );

    // ── Submit ──────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCustomer) return setMsg({ type: 'error', text: 'Please select a customer.' });
        if (selectedProducts.length === 0) return setMsg({ type: 'error', text: 'Add at least one product.' });
        if (!orderDetails.shipping_address) return setMsg({ type: 'error', text: 'Shipping address is required.' });

        setSubmitting(true);
        setMsg({ type: '', text: '' });
        try {
            const addressFull = [orderDetails.shipping_address, orderDetails.city, orderDetails.postal_code]
                .filter(Boolean).join(', ');
            await api.post('/api/v1/orders/create/', {
                user: selectedCustomer.id,
                status: 'pending',
                shipping_address: addressFull,
                payment_method: orderDetails.payment_method,
                notes: orderDetails.notes,
                items: selectedProducts.map(p => ({
                    product: p.id,
                    quantity: p.quantity,
                    price: p.price,
                })),
            });
            setMsg({ type: 'success', text: 'Order created successfully! Redirecting...' });
            setTimeout(() => navigate('/admin/orders/all'), 1800);
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to create order.' });
            setSubmitting(false);
        }
    };

    // ═══════════════════════════════════════════════════
    return (
        <div className="max-w-[1400px] mx-auto pb-12">

            {/* ── Page Header ───────────────────────────── */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/orders/all')}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-emerald-300 transition-all shadow-sm text-gray-500"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Create New Order</h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Fill in the details below to manually place an order</p>
                </div>
            </div>

            {/* ── Alert ─────────────────────────────────── */}
            {msg.text && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl font-bold text-sm flex items-center gap-3 border ${msg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}
                >
                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {msg.text}
                </motion.div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* ══════════════════════════════════════
                        LEFT + CENTRE — Form sections
                    ══════════════════════════════════════ */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* ── 1. Customer ───────────────────── */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">1</span>
                                Customer
                            </h2>

                            {/* search + dropdown */}
                            <div className="relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={customerSearch}
                                    onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); }}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-sm font-bold text-gray-800 transition-all"
                                />
                            </div>

                            {/* dropdown results */}
                            {customerSearch && !selectedCustomer && filteredCustomers.length > 0 && (
                                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-md max-h-52 overflow-y-auto">
                                    {filteredCustomers.map(c => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => { setSelectedCustomer(c); setCustomerSearch(''); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 font-black flex items-center justify-center text-sm shrink-0">
                                                {c.first_name?.[0] || c.email[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{c.first_name} {c.last_name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{c.email}</p>
                                            </div>
                                            <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${c.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                                                {c.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* selected customer card */}
                            {selectedCustomer && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center shrink-0">
                                        {selectedCustomer.first_name?.[0] || selectedCustomer.email[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-black text-gray-800">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                                        <p className="text-xs text-gray-500 font-bold flex items-center gap-1 truncate"><Mail size={11} /> {selectedCustomer.email}</p>
                                        {selectedCustomer.phone_number && (
                                            <p className="text-xs text-gray-500 font-bold flex items-center gap-1"><Phone size={11} /> {selectedCustomer.phone_number}</p>
                                        )}
                                    </div>
                                    <button type="button" onClick={() => setSelectedCustomer(null)} className="text-xs text-gray-400 hover:text-red-500 font-bold transition-colors">
                                        Change
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* ── 2. Products ────────────────────── */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">2</span>
                                Products
                            </h2>

                            {/* product search */}
                            <div className="relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search and add products..."
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-sm font-bold text-gray-800 transition-all"
                                />
                            </div>

                            {/* product results */}
                            {productSearch && filteredProducts.length > 0 && (
                                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-md max-h-52 overflow-y-auto">
                                    {filteredProducts.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => addProduct(p)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left border-b border-gray-50 last:border-0 group"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-emerald-500 shrink-0">
                                                {React.createElement(getIcon(p.title), { size: 16 })}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{p.title}</p>
                                                <p className="text-xs text-gray-400 font-medium">${parseFloat(p.price).toFixed(2)}</p>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                                                <Plus size={12} /> Add
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* selected products list */}
                            {selectedProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedProducts.map(p => (
                                        <div key={p.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-xl group">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
                                                {React.createElement(getIcon(p.title), { size: 18 })}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{p.title}</p>
                                                <p className="text-xs text-emerald-600 font-black">${parseFloat(p.price).toFixed(2)} × {p.quantity} = <span className="text-gray-800">${(parseFloat(p.price) * p.quantity).toFixed(2)}</span></p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button type="button" onClick={() => updateQty(p.id, p.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 font-black transition-all">−</button>
                                                <span className="w-8 text-center text-sm font-black text-gray-800">{p.quantity}</span>
                                                <button type="button" onClick={() => updateQty(p.id, p.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 font-black transition-all">+</button>
                                                <button type="button" onClick={() => removeProduct(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-all ml-1">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                    <ShoppingBag size={38} className="mb-2" />
                                    <p className="text-xs font-bold">Search above to add products</p>
                                </div>
                            )}
                        </div>

                        {/* ── 3. Shipping Address ────────────── */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">3</span>
                                Shipping Address
                            </h2>
                            <div className="space-y-3">
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Street address, house / flat no."
                                        value={orderDetails.shipping_address}
                                        onChange={e => setOrderDetails(p => ({ ...p, shipping_address: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-sm font-bold text-gray-800 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={orderDetails.city}
                                        onChange={e => setOrderDetails(p => ({ ...p, city: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-sm font-bold text-gray-800 transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Postal / ZIP code"
                                        value={orderDetails.postal_code}
                                        onChange={e => setOrderDetails(p => ({ ...p, postal_code: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-sm font-bold text-gray-800 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── 4. Payment Method ─────────────── */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">4</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-3 gap-3">
                                {PAYMENT_METHODS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setOrderDetails(p => ({ ...p, payment_method: opt.value }))}
                                        className={`py-4 px-3 rounded-xl text-xs font-black border-2 transition-all text-center flex flex-col items-center gap-2 ${orderDetails.payment_method === opt.value
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100'
                                                : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-emerald-300'
                                            }`}
                                    >
                                        <CreditCard size={20} />
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── 5. Order Notes ────────────────── */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">5</span>
                                Order Notes <span className="normal-case text-gray-400 font-bold">(optional)</span>
                            </h2>
                            <textarea
                                rows={4}
                                placeholder="Any special instructions, delivery preferences, or remarks..."
                                value={orderDetails.notes}
                                onChange={e => setOrderDetails(p => ({ ...p, notes: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-emerald-500 outline-none text-sm font-bold text-gray-800 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* ══════════════════════════════════════
                        RIGHT — Sticky Order Summary
                    ══════════════════════════════════════ */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-6 space-y-4">

                            {/* Summary Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                                <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                                    <ShoppingBag size={15} className="text-emerald-500" /> Order Summary
                                </h2>

                                {/* Products */}
                                {selectedProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-200">
                                        <Package size={36} className="mb-2" />
                                        <p className="text-xs font-bold text-gray-300">No products added</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 mb-5">
                                        {selectedProducts.map(p => (
                                            <div key={p.id} className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-500">
                                                    {React.createElement(getIcon(p.title), { size: 15 })}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-gray-700 truncate">{p.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">×{p.quantity}</p>
                                                </div>
                                                <span className="text-xs font-black text-gray-800 shrink-0">${(parseFloat(p.price) * p.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Totals */}
                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between text-xs text-gray-500 font-bold">
                                        <span>Subtotal ({selectedProducts.reduce((a, p) => a + p.quantity, 0)} items)</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 font-bold">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                                        <span>Total</span>
                                        <span className="text-emerald-500">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Details */}
                            {(selectedCustomer || orderDetails.shipping_address || orderDetails.payment_method) && (
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
                                    {selectedCustomer && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                                            <User size={12} className="text-emerald-500 shrink-0" />
                                            <span className="truncate">{selectedCustomer.first_name} {selectedCustomer.last_name}</span>
                                        </div>
                                    )}
                                    {orderDetails.shipping_address && (
                                        <div className="flex items-start gap-2 text-xs text-gray-600 font-bold">
                                            <MapPin size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{[orderDetails.shipping_address, orderDetails.city, orderDetails.postal_code].filter(Boolean).join(', ')}</span>
                                        </div>
                                    )}
                                    {orderDetails.payment_method && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                                            <CreditCard size={12} className="text-emerald-500 shrink-0" />
                                            <span>{PAYMENT_METHODS.find(m => m.value === orderDetails.payment_method)?.label}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider active:scale-[0.98]"
                            >
                                {submitting ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Order...</>
                                ) : (
                                    <><CheckCircle size={18} />Place Order</>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/orders/all')}
                                className="w-full py-3 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all text-sm uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default CreateOrder;
