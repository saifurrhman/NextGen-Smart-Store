import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    BarChart2, Search, Filter, Download, Plus, Calendar,
    FileText, ChevronLeft, ChevronRight, X, TrendingUp, TrendingDown, Minus,
    RefreshCw, Trash2
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
function DateRangeModal({ isOpen, onClose, onApply, initialFrom, initialTo, initialLabel }) {
    const [from, setFrom] = useState(initialFrom || null);
    const [to, setTo] = useState(initialTo || null);
    const [label, setLabel] = useState(initialLabel || '');
    const [step, setStep] = useState('from'); // 'from' | 'to'

    useEffect(() => {
        if (isOpen) {
            setFrom(initialFrom || null);
            setTo(initialTo || null);
            setLabel(initialLabel || '');
            setStep('from');
        }
    }, [isOpen, initialFrom, initialTo, initialLabel]);

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
            onApply({ from, to, label });
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
                        {/* Report Name Input */}
                        <div className="mb-5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Report Label (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Q1 Sales, Holiday Season"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-800 placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                            />
                        </div>

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
                        onClick={() => { setFrom(null); setTo(null); setStep('from'); setLabel(''); }}
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
                            Generate & Save →
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
    const [savedReports, setSavedReports] = useState([]);

    // Preset report rows (not saved to DB, always relative to TODAY)
    const presetRows = [
        { id: 'last7', label: 'Last 7 Days', days: 7, isPreset: true },
        { id: 'last30', label: 'Last 30 Days', days: 30, isPreset: true },
        { id: 'last90', label: 'Last 90 Days', days: 90, isPreset: true },
    ];

    const [reportRows, setReportRows] = useState([]);

    // Calendar modal state
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection } = useRowSelection('id');

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

    const fetchOrdersAndReports = async () => {
        setLoading(true);
        try {
            const [ordersRes, reportsRes] = await Promise.all([
                api.get('orders/'),
                api.get('orders/reports/')
            ]);

            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.results || []);
            setAllOrders(orders);

            const reports = Array.isArray(reportsRes.data) ? reportsRes.data : (reportsRes.data.results || []);
            setSavedReports(reports);

            assembleRows(orders, reports);
        } catch (err) {
            console.error('Failed to fetch data:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const assembleRows = useCallback((orders, reports) => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        // 1. Process Presets
        const pRows = presetRows.map(row => {
            const from = new Date();
            from.setDate(from.getDate() - row.days);
            from.setHours(0, 0, 0, 0);
            return {
                ...row,
                from,
                to: now,
                stats: calcStatsForRange(orders, from, now)
            };
        });

        // 2. Process Saved Reports
        const sRows = reports.map(r => {
            const from = new Date(r.start_date);
            const to = new Date(r.end_date);
            return {
                id: r.id,
                label: r.label,
                from,
                to,
                isCustom: true,
                stats: calcStatsForRange(orders, from, to)
            };
        });

        setReportRows([...pRows, ...sRows]);
    }, [calcStatsForRange]);

    useEffect(() => {
        fetchOrdersAndReports();
    }, []);

    // ── Calendar apply ──
    const handleDateRangeApply = async ({ from, to, label }) => {
        const autoLabel = `${from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} → ${to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        const finalLabel = label || autoLabel;

        const payload = {
            label: finalLabel,
            start_date: from.toISOString(),
            end_date: to.toISOString(),
        };

        try {
            if (editingRow && !editingRow.isPreset) {
                // Update existing custom report
                await api.put(`orders/reports/${editingRow.id}/`, payload);
            } else {
                // Create new report
                await api.post('orders/reports/', payload);
            }
            fetchOrdersAndReports();
        } catch (err) {
            console.error('Failed to save report:', err.response?.data || err.message);
            alert('Failed to save report: ' + JSON.stringify(err.response?.data || err.message));
        }
    };

    const openCalendar = (row) => {
        setEditingRow(row);
        setCalendarOpen(true);
    };

    const deleteRow = async (rowId) => {
        if (!window.confirm('Are you sure you want to delete this report range?')) return;
        try {
            await api.delete(`orders/reports/${rowId}/`);
            fetchOrdersAndReports();
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete report.');
        }
    };

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
                    <p className="text-sm text-gray-500 mt-1 font-medium">Analyze sales performance and save custom report configurations.</p>
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
                        onClick={() => openCalendar(null)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                    >
                        <Calendar size={16} /> New Report
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search report ranges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium text-gray-700 shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchOrdersAndReports}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Refresh Data"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={() => openCalendar(null)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-xl transition-all shadow-sm"
                        >
                            <Plus size={16} /> Create Custom
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#eaf4f0] text-emerald-800 font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="pl-5 pr-2 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 accent-emerald-500 cursor-pointer"
                                        checked={isAllSelected(visibleRows)}
                                        onChange={() => toggleAll(visibleRows)}
                                    />
                                </th>
                                <th className="px-4 py-4">Report Description</th>
                                <th className="px-6 py-4 text-center">Orders</th>
                                <th className="px-6 py-4 text-center">Revenue</th>
                                <th className="px-6 py-4 text-center">Avg Value</th>
                                <th className="px-6 py-4 text-center">Returns</th>
                                <th className="px-6 py-4 text-center">Trend</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && reportRows.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <RefreshCw size={18} className="animate-spin text-emerald-500" />
                                            <span className="text-gray-400 font-medium text-sm">Synchronizing data...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {reportRows.length > 0 && visibleRows.map((row) => (
                                <tr
                                    key={row.id}
                                    className={`hover:bg-gray-50/60 transition-colors group ${selectedIds.includes(row.id) ? 'bg-emerald-50/40' : ''
                                        }`}
                                >
                                    <td className="pl-5 pr-2 py-4 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 accent-emerald-500 cursor-pointer"
                                            checked={selectedIds.includes(row.id)}
                                            onChange={() => toggleOne(row.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 border shadow-sm ${row.isPreset ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>
                                                {row.isPreset ? <TrendingUp size={15} /> : <Calendar size={15} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-800 text-sm">{row.label}</p>
                                                    {row.isCustom && (
                                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[9px] font-black uppercase rounded-full border border-blue-100">Saved</span>
                                                    )}
                                                </div>
                                                {row.from && row.to && (
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        {row.from.toLocaleDateString()} – {row.to.toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

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
                                            {!row.isPreset && (
                                                <>
                                                    <button
                                                        onClick={() => openCalendar(row)}
                                                        title="Edit Config"
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <RefreshCw size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteRow(row.id)}
                                                        title="Delete Report"
                                                        className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && visibleRows.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center">
                                        <BarChart2 size={36} className="mx-auto mb-3 text-gray-200" />
                                        <p className="text-gray-400 font-bold text-sm">No match found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                    const customIds = selectedIds.filter(id => !presetRows.find(p => p.id === id));
                    if (customIds.length === 0) {
                        alert("Preset ranges cannot be deleted.");
                        return;
                    }
                    if (window.confirm(`Delete ${customIds.length} custom reports?`)) {
                        Promise.all(customIds.map(id => api.delete(`orders/reports/${id}/`)))
                            .then(() => {
                                fetchOrdersAndReports();
                                clearSelection();
                            });
                    }
                }}
            />

            <DateRangeModal
                isOpen={calendarOpen}
                onClose={() => { setCalendarOpen(false); setEditingRow(null); }}
                onApply={handleDateRangeApply}
                initialFrom={editingRow?.from}
                initialTo={editingRow?.to}
                initialLabel={editingRow?.label}
            />
        </div>
    );
};

export default OrderReports;
