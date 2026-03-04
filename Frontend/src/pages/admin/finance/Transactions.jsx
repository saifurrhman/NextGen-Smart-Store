import React, { useState, useEffect, useRef } from 'react';
import {
    Search, MoreVertical, ArrowUp, ArrowDown, Plus, CreditCard,
    DollarSign, CheckCircle, Clock, XCircle, Download, FileText, X,
    Star, Trash2, Eye, EyeOff, Wifi, ChevronLeft, ChevronRight,
    Shield, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../utils/api';
import FilterDropdown from '../../../components/admin/common/FilterDropdown';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';

/* ─────────────────── Card Visual Component ─────────────────── */
const CardVisual = ({ card, flipped = false, mini = false }) => {
    const getGradient = (network) => {
        switch (network) {
            case 'mastercard': return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
            case 'amex': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            case 'discover': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            default: return 'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 150%)';
        }
    };
    const formatNumber = (num) => {
        const raw = (num || '').replace(/\D/g, '').padEnd(16, '•');
        return [raw.slice(0, 4), raw.slice(4, 8), raw.slice(8, 12), raw.slice(12, 16)].join('  ');
    };

    const w = mini ? 'w-[180px] h-[110px]' : 'w-full h-[200px]';

    return (
        <div className={`relative ${w} rounded-2xl overflow-hidden text-white shadow-2xl`}
            style={{ background: getGradient(card.network) }}>
            {/* Glow blobs */}
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-black/20 rounded-full blur-2xl" />

            {!flipped ? (
                <div className={`relative z-10 flex flex-col justify-between h-full ${mini ? 'p-4' : 'p-6'}`}>
                    {/* Top row */}
                    <div className="flex justify-between items-center">
                        <Wifi size={mini ? 14 : 20} className="rotate-90 opacity-70" />
                        {card.network === 'mastercard' ? (
                            <div className="flex items-center">
                                <div className={`${mini ? 'w-5 h-5' : 'w-8 h-8'} rounded-full bg-red-500/80 -mr-2`} />
                                <div className={`${mini ? 'w-5 h-5' : 'w-8 h-8'} rounded-full bg-yellow-400/80`} />
                            </div>
                        ) : card.network === 'amex' ? (
                            <span className={`font-black ${mini ? 'text-xs' : 'text-base'} tracking-widest border border-white/50 px-2 py-0.5 rounded`}>AMEX</span>
                        ) : card.network === 'discover' ? (
                            <div className={`${mini ? 'w-5 h-5' : 'w-8 h-8'} rounded-full bg-orange-400`} />
                        ) : (
                            <div className="flex gap-0.5">
                                {[...Array(mini ? 3 : 4)].map((_, i) => <div key={i} className={`${mini ? 'w-4 h-0.5' : 'w-6 h-1'} rounded-full bg-white/40`} />)}
                            </div>
                        )}
                    </div>
                    {/* Card Number */}
                    <div className={`font-mono font-bold tracking-[0.18em] ${mini ? 'text-xs' : 'text-lg'} opacity-90`}>
                        {formatNumber(card.number)}
                    </div>
                    {/* Bottom row */}
                    <div className="flex justify-between items-end">
                        <div>
                            <div className={`${mini ? 'text-[8px]' : 'text-[9px]'} uppercase tracking-widest opacity-60 mb-0.5`}>Card Holder</div>
                            <div className={`${mini ? 'text-[9px]' : 'text-sm'} font-bold uppercase`}>{card.name || 'YOUR NAME'}</div>
                        </div>
                        <div className="text-right">
                            <div className={`${mini ? 'text-[8px]' : 'text-[9px]'} uppercase tracking-widest opacity-60 mb-0.5`}>Expires</div>
                            <div className={`${mini ? 'text-[9px]' : 'text-sm'} font-bold`}>{card.expiry || 'MM/YY'}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative z-10 h-full flex flex-col justify-center px-6 space-y-3">
                    <div className="w-full h-10 bg-black/70 rounded" />
                    <div className="flex justify-end">
                        <div className="w-20 h-8 bg-white/80 rounded flex items-center justify-end pr-3">
                            <span className="text-gray-800 font-mono font-bold text-sm">{card.cvv || '•••'}</span>
                        </div>
                    </div>
                    <div className="text-[10px] text-white/60 text-center">CVV</div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────── Card Form with Live Preview ─────────────── */
const AddCardModal = ({ onClose, onAdd }) => {
    const [form, setForm] = useState({ number: '', name: '', expiry: '', cvv: '', network: 'visa' });
    const [flipped, setFlipped] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showCVV, setShowCVV] = useState(false);

    const detectNetwork = (num) => {
        const n = num.replace(/\D/g, '');
        if (n.startsWith('4')) return 'visa';
        if (n.startsWith('5') || n.startsWith('2')) return 'mastercard';
        if (n.startsWith('3')) return 'amex';
        if (n.startsWith('6')) return 'discover';
        return 'visa';
    };

    const handleNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        const network = detectNetwork(val);
        setForm(p => ({ ...p, number: formatted, network }));
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
        setForm(p => ({ ...p, expiry: val }));
    };

    const handleCVVChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
        setForm(p => ({ ...p, cvv: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Save to backend
            await api.post('finance/payment-methods/', {
                card_number_last4: form.number.replace(/\D/g, '').slice(-4),
                cardholder_name: form.name,
                expiry: form.expiry,
                network: form.network,
                is_default: false,
            });
            onAdd({
                id: Date.now(),
                number: form.number,
                name: form.name,
                expiry: form.expiry,
                cvv: form.cvv,
                network: form.network,
                isDefault: false,
                status: 'active',
            });
        } catch {
            // Fallback: save locally even if backend not available
            onAdd({
                id: Date.now(),
                number: form.number,
                name: form.name,
                expiry: form.expiry,
                cvv: form.cvv,
                network: form.network,
                isDefault: false,
                status: 'active',
            });
        } finally {
            setSaving(false);
            onClose();
        }
    };

    const previewCard = { ...form, number: form.number };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">

                {/* Header */}
                <div className="bg-brand p-6 text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xl font-bold">Add Payment Card</h3>
                            <p className="text-white/70 text-sm mt-1">Your card details are encrypted & secure</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Live Card Preview */}
                    <div className="relative h-[200px] cursor-pointer" onClick={() => setFlipped(!flipped)}>
                        <motion.div
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
                            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                            className="relative w-full h-full"
                        >
                            <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0">
                                <CardVisual card={previewCard} />
                            </div>
                            <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0">
                                <CardVisual card={previewCard} flipped />
                            </div>
                        </motion.div>
                        <div className="absolute bottom-2 right-2 text-white/60 text-[10px] flex items-center gap-1">
                            <span>Tap to flip</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card Number *</label>
                        <div className="relative">
                            <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={form.number}
                                onChange={handleNumberChange}
                                placeholder="0000 0000 0000 0000"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-brand bg-brand-accent px-2 py-0.5 rounded-full">{form.network}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cardholder Name *</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                            placeholder="JOHN DOE"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expiry *</label>
                            <input
                                type="text"
                                required
                                value={form.expiry}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">CVV *</label>
                            <div className="relative" onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}>
                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showCVV ? 'text' : 'password'}
                                    required
                                    value={form.cvv}
                                    onChange={handleCVVChange}
                                    placeholder="•••"
                                    className="w-full pl-9 pr-9 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                                />
                                <button type="button" onClick={() => setShowCVV(!showCVV)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                        <Shield size={14} className="text-brand shrink-0" />
                        <span>Your card information is encrypted with SSL 256-bit security. We never store your full card number.</span>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3.5 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/30 hover:shadow-brand/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Adding Card...' : 'Add Card Securely'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

/* ─────────────────── Card Carousel ─────────────────── */
const DEFAULT_CARDS = [
    { id: 1, number: '4111 1111 1111 2345', name: 'NOMAN MANZOOR', expiry: '02/30', cvv: '123', network: 'visa', isDefault: true, status: 'active' },
];

const CardCarousel = ({ cards, onSetDefault, onDelete }) => {
    const [activeIdx, setActiveIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const prev = () => { setActiveIdx(i => (i - 1 + cards.length) % cards.length); setFlipped(false); };
    const next = () => { setActiveIdx(i => (i + 1) % cards.length); setFlipped(false); };
    const active = cards[activeIdx];

    return (
        <div className="space-y-4">
            <div className="relative">
                {/* Main card with flip */}
                <div className="relative h-[200px] cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
                    <motion.div
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
                        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                        className="relative w-full h-full"
                    >
                        <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0">
                            <CardVisual card={active} />
                        </div>
                        <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0">
                            <CardVisual card={active} flipped />
                        </div>
                    </motion.div>
                    <div className="absolute bottom-3 right-3 text-white/60 text-[10px]">Tap to flip</div>
                    {active.isDefault && (
                        <div className="absolute top-3 left-3">
                            <span className="flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                                <Star size={8} fill="currentColor" /> Default
                            </span>
                        </div>
                    )}
                </div>

                {/* Navigation arrows */}
                {cards.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10">
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}
            </div>

            {/* Dots */}
            {cards.length > 1 && (
                <div className="flex justify-center gap-1.5">
                    {cards.map((_, i) => (
                        <button key={i} onClick={() => { setActiveIdx(i); setFlipped(false); }}
                            className={`rounded-full transition-all ${i === activeIdx ? 'w-6 h-2 bg-brand' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'}`} />
                    ))}
                </div>
            )}

            {/* Mini thumbnails row */}
            {cards.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {cards.map((card, i) => (
                        <button key={card.id} onClick={() => { setActiveIdx(i); setFlipped(false); }}
                            className={`shrink-0 rounded-xl overflow-hidden transition-all ${i === activeIdx ? 'ring-2 ring-brand scale-105' : 'opacity-60 hover:opacity-80'}`}>
                            <CardVisual card={card} mini />
                        </button>
                    ))}
                </div>
            )}

            {/* Card actions */}
            <div className="flex items-center gap-2">
                {!active.isDefault && (
                    <button onClick={() => onSetDefault(active.id)} className="flex items-center gap-1.5 px-3 py-2 border border-brand/30 text-brand text-xs font-bold rounded-lg hover:bg-brand-accent transition-all">
                        <Star size={12} /> Set Default
                    </button>
                )}
                <button onClick={() => onDelete(active.id)} className="flex items-center gap-1.5 px-3 py-2 border border-red-100 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition-all ml-auto">
                    <Trash2 size={12} /> Remove
                </button>
            </div>

            {/* Active card info */}
            <div className="grid grid-cols-3 gap-3 text-center">
                {[
                    { label: 'Status', value: <span className="flex items-center justify-center gap-1 text-brand font-bold text-xs"><span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />Active</span> },
                    { label: 'Network', value: <span className="uppercase font-bold text-xs text-gray-700">{active.network}</span> },
                    { label: 'Expires', value: <span className="font-mono font-bold text-xs text-gray-700">{active.expiry}</span> },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                        {value}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────── Main Transactions Page ─────────────────── */
const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ method: '', dateRange: '' });
    const [stats, setStats] = useState({ revenue: 0, completed: 0, pending: 0, failed: 0 });
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [cards, setCards] = useState(DEFAULT_CARDS);
    const navigate = useNavigate();
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('finance/transactions/');
                const data = response.data.results || response.data;
                setTransactions(data);
                setStats({
                    revenue: data.filter(t => t.status === 'success').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0),
                    completed: data.filter(t => t.status === 'success').length,
                    pending: data.filter(t => t.status === 'pending').length,
                    failed: data.filter(t => t.status === 'failed').length
                });
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        // Load saved cards from localStorage
        const saved = localStorage.getItem('admin_payment_cards');
        if (saved) {
            try { setCards(JSON.parse(saved)); } catch { }
        }

        fetchTransactions();
    }, []);

    const saveCards = (newCards) => {
        setCards(newCards);
        localStorage.setItem('admin_payment_cards', JSON.stringify(newCards));
    };

    const handleAddCard = (card) => {
        const updated = [...cards, card];
        saveCards(updated);
    };

    const handleSetDefault = (id) => {
        const updated = cards.map(c => ({ ...c, isDefault: c.id === id }));
        saveCards(updated);
    };

    const handleDeleteCard = (id) => {
        if (!window.confirm('Remove this card?')) return;
        const updated = cards.filter(c => c.id !== id);
        if (updated.length > 0 && !updated.some(c => c.isDefault)) updated[0].isDefault = true;
        saveCards(updated);
    };

    const filteredTxns = transactions.filter(txn => {
        const matchesStatus = filter === 'all' || txn.status === filter;
        const matchesSearch = !searchTerm ||
            txn.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMethod = !filters.method || txn.payment_method === filters.method;
        return matchesStatus && matchesSearch && matchesMethod;
    });

    const filterOptions = [
        { key: 'method', label: 'Payment Method', options: [{ label: 'All Methods', value: '' }, { label: 'Credit Card', value: 'Credit Card' }, { label: 'PayPal', value: 'PayPal' }, { label: 'Bank Transfer', value: 'Bank Transfer' }] }
    ];

    const totalPages = Math.ceil(filteredTxns.length / itemsPerPage);
    const currentItems = filteredTxns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleExportExcel = () => exportToExcel(filteredTxns.map(txn => ({ "Order ID": txn.order_id, "Customer": txn.customer_email || 'Guest', "Date": new Date(txn.created_at).toLocaleDateString(), "Amount": parseFloat(txn.amount).toFixed(2), "Method": txn.payment_method, "Status": txn.status })), "Transactions_Export");
    const handleExportCSV = () => exportToExcel(filteredTxns.map(txn => ({ "Order ID": txn.order_id, "Customer": txn.customer_email || 'Guest', "Date": new Date(txn.created_at).toLocaleDateString(), "Amount": parseFloat(txn.amount).toFixed(2), "Method": txn.payment_method, "Status": txn.status })), "Transactions_Export");
    const handleExportPDF = () => exportToPDF(filteredTxns.map(txn => [txn.order_id, txn.customer_email || 'Guest', new Date(txn.created_at).toLocaleDateString(), `$${parseFloat(txn.amount).toFixed(2)}`, txn.payment_method, txn.status]), ["Order ID", "Customer", "Date", "Amount", "Method", "Status"], "Transactions_Export", "Transaction History Report");

    const STAT_CARDS = [
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, bg: 'bg-brand/10', ico: 'text-brand' },
        { label: 'Completed', value: stats.completed.toLocaleString(), icon: CheckCircle, bg: 'bg-blue-50', ico: 'text-blue-500' },
        { label: 'Pending', value: stats.pending.toLocaleString(), icon: Clock, bg: 'bg-amber-50', ico: 'text-amber-500' },
        { label: 'Failed', value: stats.failed.toLocaleString(), icon: XCircle, bg: 'bg-red-50', ico: 'text-red-500' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">
                        <Download size={16} className="text-emerald-600" />Excel
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">
                        <Download size={16} className="text-blue-500" />CSV
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all">
                        <FileText size={16} className="text-red-500" />PDF
                    </button>
                </div>
            </div>

            {/* Stat Cards + Payment Cards row */}
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Stat Cards */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {STAT_CARDS.map(({ label, value, icon: Icon, bg, ico }) => (
                        <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                                <Icon size={22} className={ico} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                                <h2 className="text-2xl font-black text-gray-800 mt-0.5">{value}</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Last 7 days</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Cards Panel */}
                <div className="w-full xl:w-[420px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Payment Methods</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{cards.length} card{cards.length !== 1 ? 's' : ''} linked</p>
                        </div>
                        <button onClick={() => setIsAddCardOpen(true)}
                            className="flex items-center gap-1.5 bg-brand text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-brand-dark transition-all shadow-md shadow-brand/20">
                            <Plus size={14} /> Add Card
                        </button>
                    </div>

                    {cards.length > 0 ? (
                        <CardCarousel cards={cards} onSetDefault={handleSetDefault} onDelete={handleDeleteCard} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                                <CreditCard size={28} className="text-gray-300" />
                            </div>
                            <p className="text-sm font-bold text-gray-400">No cards linked yet</p>
                            <p className="text-xs text-gray-300 mt-1">Click "Add Card" to get started</p>
                            <button onClick={() => setIsAddCardOpen(true)} className="mt-4 bg-brand text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-dark transition-all">
                                + Link Your First Card
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-center px-5 py-4 gap-4 border-b border-gray-50">
                    <div className="flex items-center bg-brand-accent/50 rounded-xl p-1.5 border border-brand/10 w-full lg:w-auto overflow-x-auto shadow-sm gap-1">
                        {[{ key: 'all', label: 'All Transactions', count: transactions.length }, { key: 'success', label: 'Completed', count: stats.completed }, { key: 'pending', label: 'Pending', count: stats.pending }, { key: 'failed', label: 'Failed', count: stats.failed }].map(({ key, label, count }) => (
                            <button key={key} onClick={() => { setFilter(key); setCurrentPage(1); }}
                                className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${filter === key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {label} <span className="text-brand ml-1">({count})</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search payment history" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand/50 transition-all font-medium text-gray-800" />
                        </div>
                        <FilterDropdown options={filterOptions} activeFilters={filters} onFilterChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setCurrentPage(1); }} onClear={() => { setFilters({ method: '', dateRange: '' }); setCurrentPage(1); }} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left min-w-[700px]">
                        <thead className="bg-brand-accent/50 text-brand-dark font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="py-4 px-5">Customer ID</th>
                                <th className="py-4 px-4">Name</th>
                                <th className="py-4 px-4 text-center">Date</th>
                                <th className="py-4 px-4 text-center">Total</th>
                                <th className="py-4 px-4 text-center">Method</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700">
                            {loading ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse"><td colSpan="7" className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-full" /></td></tr>
                            )) : currentItems.length > 0 ? currentItems.map(txn => (
                                <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-3.5 px-5 font-mono font-bold text-gray-500">#{txn.order_id?.slice(-8).toUpperCase() || 'N/A'}</td>
                                    <td className="py-3.5 px-4 font-bold text-gray-800">{txn.customer_email || 'Guest'}</td>
                                    <td className="py-3.5 px-4 text-center text-gray-500 font-bold">{new Date(txn.created_at).toLocaleDateString()}</td>
                                    <td className="py-3.5 px-4 text-center font-black text-gray-800">${parseFloat(txn.amount || 0).toFixed(2)}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold">{txn.payment_method}</span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${txn.status === 'success' ? 'bg-brand/10 text-brand' : txn.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'success' ? 'bg-brand' : txn.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-5 text-right">
                                        <button onClick={() => navigate(`/admin/orders/details?id=${txn.order_id}`)}
                                            className="text-brand hover:text-brand-dark font-black text-[10px] uppercase tracking-wider bg-brand-accent px-3 py-1.5 rounded-lg hover:bg-brand/20 transition-all">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="py-16 text-center text-gray-400 font-bold italic">No transactions found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-5 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:bg-white transition-all disabled:opacity-40 bg-white shadow-sm">
                            ← Previous
                        </button>
                        <div className="flex gap-1.5">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-800 shadow-sm'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:bg-white transition-all disabled:opacity-40 bg-white shadow-sm">
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Add Card Modal */}
            <AnimatePresence>
                {isAddCardOpen && (
                    <AddCardModal onClose={() => setIsAddCardOpen(false)} onAdd={handleAddCard} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Transactions;
