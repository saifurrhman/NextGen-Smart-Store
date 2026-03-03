import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    BarChart2, Search, Filter, Download, Plus, Calendar,
    FileText, ChevronLeft, ChevronRight, X, TrendingUp, TrendingDown, Minus,
    RefreshCw
} from 'lucide-react';
import api from '../../../utils/api';
import { exportToExcel, exportToPDF, exportToCSV } from '../../../utils/exportUtils';
import useRowSelection from '../../../hooks/useRowSelection';
import BulkActionBar from '../../../components/admin/common/BulkActionBar';

// ─── Mini Calendar Component ───────────────────────────────
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function MiniCalendar({ value, onChange, minDate, maxDate }) {
    const today = new Date();
    const [viewYear, setViewYear] = useState((value || today).getFullYear());
    const [viewMonth, setViewMonth] = useState((value || today).getMonth());

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

    const isSelected = (d) => d && value && d.toDateString() === value.toDateString();
    const isToday = (d) => d && d.toDateString() === today.toDateString();
    const isDisabled = (d) => {
        if (!d) return false;
        if (minDate && d < minDate) return true;
        if (maxDate && d > maxDate) return true;
        return false;
    };

    return (
        <div className="w-64 select-none">
            <div className="flex items-center justify-between mb-3 px-1">
                <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-gray-700">{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                    <ChevronRight size={16} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAYS.map(d => <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {cells.map((d, i) => (
                    <button
                        key={i}
                        disabled={!d || isDisabled(d)}
                        onClick={() => d && !isDisabled(d) && onChange(d)}
                        className={`h-8 w-full rounded-lg text-xs font-bold transition-all
                            ${!d ? 'invisible' : ''}
                            ${isSelected(d) ? 'bg-emerald-500 text-white shadow-sm' : ''}
                            ${isToday(d) && !isSelected(d) ? 'border border-emerald-400 text-emerald-600' : ''}
                            ${!isSelected(d) && !isDisabled(d) ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' : ''}
                            ${isDisabled(d) ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >{d ? d.getDate() : ''}</button>
                ))}
            </div>
        </div>
    );
}

// ─── Date Range Picker Modal ────────────────────────────────
function DateRangeModal({ isOpen, onClose, onApply, initialFrom, initialTo }) {
    const [from, setFrom] = useState(initialFrom || null);
    const [to, setTo] = useState(initialTo || null);
    const [step, setStep] = useState('from'); // 'from' | 'to'

    const PRESETS = [
        { label: 'Today', days: 0 },
        { label: 'Yesterday', days: 1 },
        { label: 'Last 7 Days', days: 7 },
        { label: 'Last 30 Days', days: 30 },
        { label: 'Last 90 Days', days: 90 },
        { label: 'Last 365 Days', days: 365 },
    ];

    const applyPreset = (days) => {
        const today = new Date(); today.setHours(23, 59, 59, 999);
        const start = new Date(); start.setHours(0, 0, 0, 0);
        if (days === 0) { setFrom(start); setTo(today); }
        else if (days === 1) {
            const y = new Date(); y.setDate(y.getDate() - 1); y.setHours(0, 0, 0, 0);
            const ye = new Date(); ye.setDate(ye.getDate() - 1); ye.setHours(23, 59, 59, 999);
            setFrom(y); setTo(ye);
        } else {
            const s = new Date(); s.setDate(s.getDate() - days); s.setHours(0, 0, 0, 0);
            setFrom(s); setTo(today);
        }
        setStep('to');
    };

    const handleFromChange = (d) => {
        d.setHours(0, 0, 0, 0);
        setFrom(d);
        if (to && d > to) setTo(null);
        setStep('to');
    };

    const handleToChange = (d) => {
        d.setHours(23, 59, 59, 999);
        setTo(d);
    };

    const handleApply = () => {
        if (from && to) {
            onApply({ from, to });
            onClose();
        }
    };

    const fmtDate = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not selected';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-2xl shadow-2xl relative z-10 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <Calendar size={20} />
                        <div>
                            <h3 className="font-bold text-base">Select Date Range</h3>
                            <p className="text-emerald-100 text-xs font-medium mt-0.5">
                                {step === 'from' ? 'Pick a start date' : 'Now pick an end date'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all"><X size={18} /></button>
                </div>

                <div className="flex">
                    {/* Presets Sidebar */}
                    <div className="w-48 border-r border-gray-100 p-4 bg-gray-50/50 flex-shrink-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Quick Select</p>
                        <div className="space-y-1">
                            {PRESETS.map(p => (
                                <button
                                    key={p.label}
                                    onClick={() => applyPreset(p.days)}
                                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendars */}
                    <div className="flex-1 p-6">
                        {/* Selected range display */}
                        <div className="flex items-center gap-3 mb-5">
                            <div
                                onClick={() => setStep('from')}
                                className={`flex-1 border-2 rounded-xl p-3 cursor-pointer transition-all ${step === 'from' ? 'border-emerald-400 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Start Date</p>
                                <p className={`text-sm font-bold ${from ? 'text-gray-800' : 'text-gray-300'}`}>{fmtDate(from)}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
                            <div
                                onClick={() => from && setStep('to')}
                                className={`flex-1 border-2 rounded-xl p-3 cursor-pointer transition-all ${step === 'to' ? 'border-emerald-400 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">End Date</p>
                                <p className={`text-sm font-bold ${to ? 'text-gray-800' : 'text-gray-300'}`}>{fmtDate(to)}</p>
                            </div>
                        </div>

                        {/* Two calendars side by side */}
                        <div className="flex gap-8 justify-center">
                            <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 text-center">
                                    {step === 'from' ? '→ Start Date' : 'Start Date ✓'}
                                </p>
                                <MiniCalendar
                                    value={from}
                                    onChange={handleFromChange}
                                    maxDate={new Date()}
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 text-center">
                                    {step === 'to' ? '→ End Date' : 'End Date'}
                                </p>
                                <MiniCalendar
                                    value={to}
                                    onChange={handleToChange}
                                    minDate={from}
                                    maxDate={new Date()}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <button
                        onClick={() => { setFrom(null); setTo(null); setStep('from'); }}
                        className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Clear
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!from || !to}
                            className="px-6 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Generate Report →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────
const OrderReports = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Preset report rows
    const [reportRows, setReportRows] = useState([
        { id: 'last7', label: 'Last 7 Days', days: 7, from: null, to: null, stats: null },
        { id: 'last30', label: 'Last 30 Days', days: 30, from: null, to: null, stats: null },
        { id: 'last90', label: 'Last 90 Days', days: 90, from: null, to: null, stats: null },
    ]);

    // Calendar modal state
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

    // ── Fetch orders ──
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('orders/');
                const data = res.data;
                const orders = Array.isArray(data) ? data : (data.results || []);
                setAllOrders(orders);
                initStats(orders);
            } catch (err) {
                console.error('Failed to fetch orders:', err.message);
                initStats([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const calcStatsForRange = useCallback((orders, from, to) => {
        const filtered = orders.filter(o => {
            const d = new Date(o.created_at || o.date || o.created);
            return d >= from && d <= to;
        });
        const total = filtered.length;
        const revenue = filtered.reduce((acc, o) => acc + parseFloat(o.total_amount || o.total || 0), 0);
        const avg = total > 0 ? (revenue / total) : 0;
        const returns = filtered.filter(o => (o.status || '').toLowerCase().includes('return')).length;
        const returnPct = total > 0 ? Math.round((returns / total) * 100) : 0;
        const trend = revenue > 0 ? 'Up' : (total > 0 ? 'Stable' : 'Stable');
        return { total, revenue, avg, returns: returnPct, trend };
    }, []);

    const initStats = useCallback((orders) => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        setReportRows(prev => prev.map(row => {
            if (!row.days) return row;
            const from = new Date();
            from.setDate(from.getDate() - row.days);
            from.setHours(0, 0, 0, 0);
            return {
                ...row,
                from,
                to: now,
                stats: calcStatsForRange(orders, from, now)
            };
        }));
    }, [calcStatsForRange]);

    // When orders are loaded, also recompute any custom rows
    useEffect(() => {
        if (allOrders.length > 0) initStats(allOrders);
    }, [allOrders, initStats]);

    // ── Calendar apply ──
    const handleDateRangeApply = ({ from, to }) => {
        const stats = calcStatsForRange(allOrders, from, to);
        const label = `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} → ${to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

        if (editingRowId === 'new') {
            // Add a new custom row
            setReportRows(prev => [...prev, {
                id: `custom_${Date.now()}`,
                label,
                days: null,
                from,
                to,
                stats,
                isCustom: true,
            }]);
        } else {
            // Update existing row
            setReportRows(prev => prev.map(row =>
                row.id === editingRowId ? { ...row, label, from, to, stats, isCustom: true } : row
            ));
        }
    };

    const openCalendar = (rowId) => {
        setEditingRowId(rowId);
        setCalendarOpen(true);
    };

    const deleteRow = (rowId) => {
        setReportRows(prev => prev.filter(r => r.id !== rowId));
    };

    // ── Export helpers ──
    const buildExportData = (rows) => rows
        .filter(r => r.stats)
        .map(r => ({
            'Date Range': r.label,
            'From': r.from ? r.from.toLocaleDateString() : '',
            'To': r.to ? r.to.toLocaleDateString() : '',
            'Total Orders': r.stats.total,
            'Revenue (PKR)': r.stats.revenue.toFixed(2),
            'Avg Order Value (PKR)': r.stats.avg.toFixed(2),
            'Return Rate': r.stats.returns + '%',
            'Trend': r.stats.trend,
        }));

    const visibleRows = reportRows.filter(r =>
        !searchTerm || r.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportExcel = () => exportToExcel(buildExportData(visibleRows), 'Order_Reports');
    const handleExportCSV = () => exportToCSV(buildExportData(visibleRows), 'Order_Reports');
    const handleExportPDF = () => {
        const cols = ['Date Range', 'From', 'To', 'Total Orders', 'Revenue (PKR)', 'Avg Value', 'Returns', 'Trend'];
        const data = visibleRows.filter(r => r.stats).map(r => [
            r.label, r.from?.toLocaleDateString() || '', r.to?.toLocaleDateString() || '',
            r.stats.total, `PKR ${r.stats.revenue.toLocaleString()}`,
            `PKR ${r.stats.avg.toFixed(0)}`, r.stats.returns + '%', r.stats.trend
        ]);
        exportToPDF(data, cols, 'Order_Reports', 'Order Performance Report');
    };

    // Per-row download
    const downloadRowExcel = (row) => {
        if (!row.stats) return;
        exportToExcel([{
            'Date Range': row.label,
            'From': row.from?.toLocaleDateString() || '',
            'To': row.to?.toLocaleDateString() || '',
            'Total Orders': row.stats.total,
            'Revenue (PKR)': row.stats.revenue.toFixed(2),
            'Avg Order Value (PKR)': row.stats.avg.toFixed(2),
            'Return Rate': row.stats.returns + '%',
            'Trend': row.stats.trend,
        }], `Order_Report_${row.label.replace(/\s/g, '_')}`);
    };

    const downloadRowCSV = (row) => {
        if (!row.stats) return;
        exportToCSV([{
            'Date Range': row.label,
            'From': row.from?.toLocaleDateString() || '',
            'To': row.to?.toLocaleDateString() || '',
            'Total Orders': row.stats.total,
            'Revenue (PKR)': row.stats.revenue.toFixed(2),
            'Avg Order Value (PKR)': row.stats.avg.toFixed(2),
            'Return Rate': row.stats.returns + '%',
            'Trend': row.stats.trend,
        }], `Order_Report_${row.label.replace(/\s/g, '_')}`);
    };

    const TrendIcon = ({ t }) => {
        if (t === 'Up') return <TrendingUp size={14} className="text-emerald-500" />;
        if (t === 'Down') return <TrendingDown size={14} className="text-red-500" />;
        return <Minus size={14} className="text-gray-400" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart2 size={24} className="text-emerald-500" />
                        Order Reports
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Click any row's calendar icon to pick a custom date range</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">
                            <Download size={16} className="text-emerald-600" /> Excel
                        </button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 border-r border-gray-100 transition-all">
                            <Download size={16} className="text-blue-500" /> CSV
                        </button>
                        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all">
                            <FileText size={16} className="text-red-500" /> PDF
                        </button>
                    </div>
                    <button
                        onClick={() => openCalendar('new')}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                    >
                        <Calendar size={16} /> Custom Range
                    </button>
                </div>
            </div>


            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search report ranges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => openCalendar('new')}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-xl transition-all shadow-sm"
                    >
                        <Plus size={16} /> Add Custom Range
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                {/* Select All checkbox */}
                                <th className="pl-5 pr-2 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 accent-emerald-500 cursor-pointer"
                                        checked={isAllSelected(visibleRows)}
                                        onChange={() => toggleAll(visibleRows)}
                                        title="Select All"
                                    />
                                </th>
                                <th className="px-4 py-4">Date Range</th>
                                <th className="px-6 py-4 text-center">Total Orders</th>
                                <th className="px-6 py-4 text-center">Revenue</th>
                                <th className="px-6 py-4 text-center">Avg Order Value</th>
                                <th className="px-6 py-4 text-center">Return Rate</th>
                                <th className="px-6 py-4 text-center">Trend</th>
                                <th className="px-6 py-4 text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <RefreshCw size={18} className="animate-spin text-emerald-500" />
                                            <span className="text-gray-400 font-medium text-sm">Loading order data...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && visibleRows.map((row) => (
                                <tr
                                    key={row.id}
                                    className={`hover:bg-gray-50/60 transition-colors group ${selectedIds.includes(row.id) ? 'bg-emerald-50/40' : ''
                                        }`}
                                >
                                    {/* Individual checkbox */}
                                    <td className="pl-5 pr-2 py-4 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 accent-emerald-500 cursor-pointer"
                                            checked={selectedIds.includes(row.id)}
                                            onChange={() => toggleOne(row.id)}
                                        />
                                    </td>
                                    {/* Date Range Cell */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openCalendar(row.id)}
                                                className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0 border border-emerald-100 shadow-sm"
                                                title="Click to change date range"
                                            >
                                                <Calendar size={15} />
                                            </button>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{row.label}</p>
                                                {row.from && row.to && (
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        {row.from.toLocaleDateString()} – {row.to.toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            {row.isCustom && (
                                                <span className="ml-1 px-2 py-0.5 bg-blue-50 text-blue-500 text-[9px] font-black uppercase rounded-full border border-blue-100">
                                                    Custom
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Stats */}
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-lg font-black text-gray-800">{row.stats?.total ?? '—'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-black text-gray-800">
                                            PKR {row.stats ? row.stats.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-bold text-gray-600">
                                            PKR {row.stats ? row.stats.avg.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.stats && (
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${row.stats.returns > 0 ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
                                                {row.stats.returns}%
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {row.stats && (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${row.stats.trend === 'Up' ? 'bg-emerald-50 text-emerald-600' : row.stats.trend === 'Down' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
                                                <TrendIcon t={row.stats.trend} />
                                                {row.stats.trend}
                                            </span>
                                        )}
                                    </td>

                                    {/* Per-row download actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => downloadRowExcel(row)}
                                                title="Download Excel"
                                                className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-500 transition-colors"
                                            >
                                                <Download size={15} />
                                            </button>
                                            <button
                                                onClick={() => downloadRowCSV(row)}
                                                title="Download CSV"
                                                className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                            >
                                                <FileText size={15} />
                                            </button>
                                            {row.isCustom && (
                                                <button
                                                    onClick={() => deleteRow(row.id)}
                                                    title="Remove range"
                                                    className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && visibleRows.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center">
                                        <BarChart2 size={36} className="mx-auto mb-3 text-gray-200" />
                                        <p className="text-gray-400 font-bold text-sm">No report ranges found.</p>
                                        <button
                                            onClick={() => openCalendar('new')}
                                            className="mt-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                                        >
                                            + Add Custom Range
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Bulk Action Bar (appears when rows selected) ── */}
            <BulkActionBar
                selectedIds={selectedIds}
                onClear={clearSelection}
                label={{ singular: "row", plural: "rows" }}
                onExportExcel={() => {
                    const sel = reportRows.filter(r => selectedIds.includes(r.id));
                    exportToExcel(buildExportData(sel), 'Order_Reports_Selected');
                }}
                onExportCSV={() => {
                    const sel = reportRows.filter(r => selectedIds.includes(r.id));
                    exportToCSV(buildExportData(sel), 'Order_Reports_Selected');
                }}
                onExportPDF={() => {
                    const sel = reportRows.filter(r => selectedIds.includes(r.id));
                    const cols = ['Date Range', 'From', 'To', 'Total Orders', 'Revenue (PKR)', 'Avg Value', 'Returns', 'Trend'];
                    const data = sel.filter(r => r.stats).map(r => [
                        r.label, r.from?.toLocaleDateString() || '', r.to?.toLocaleDateString() || '',
                        r.stats.total, `PKR ${r.stats.revenue.toLocaleString()}`,
                        `PKR ${r.stats.avg.toFixed(0)}`, r.stats.returns + '%', r.stats.trend
                    ]);
                    exportToPDF(data, cols, 'Order_Reports_Selected', 'Order Performance Report');
                }}
                onDelete={() => {
                    if (window.confirm(`Remove ${selectedIds.length} selected report ranges?`)) {
                        setReportRows(prev => prev.filter(r => !selectedIds.includes(r.id)));
                        clearSelection();
                    }
                }}
            />

            {/* Date Range Modal */}
            <DateRangeModal
                isOpen={calendarOpen}
                onClose={() => { setCalendarOpen(false); setEditingRowId(null); }}
                onApply={handleDateRangeApply}
                initialFrom={editingRowId && editingRowId !== 'new' ? reportRows.find(r => r.id === editingRowId)?.from : null}
                initialTo={editingRowId && editingRowId !== 'new' ? reportRows.find(r => r.id === editingRowId)?.to : null}
            />
        </div>
    );
};

export default OrderReports;
