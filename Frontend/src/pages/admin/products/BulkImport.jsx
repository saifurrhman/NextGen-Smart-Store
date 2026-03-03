import React, { useState, useRef, useCallback } from 'react';
import {
    Upload, Download, FileText, CheckCircle2, AlertCircle,
    X, Package, RefreshCw, ChevronRight, Info, Zap,
    FileSpreadsheet, AlertTriangle, Eye, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../utils/api';

// ─── CSV Template Generator ────────────────────────────────
const generateCSVTemplate = () => {
    const headers = [
        'name', 'slug', 'sku', 'price', 'sale_price', 'stock_quantity',
        'category', 'brand', 'description', 'short_description',
        'weight', 'length', 'width', 'height',
        'color', 'size', 'material', 'tags',
        'is_active', 'featured'
    ];
    const sample1 = [
        'Premium Wireless Headphones', 'premium-wireless-headphones', 'SKU-001', '149.99', '119.99', '50',
        'Electronics', 'SoundPro', 'High-quality wireless headphones with 40-hour battery life.', 'Premium sound quality.',
        '0.35', '20', '18', '8',
        'Black', 'One Size', 'Plastic|Metal', 'wireless,headphones,audio',
        'true', 'true'
    ];
    const sample2 = [
        'Classic Cotton T-Shirt', 'classic-cotton-tshirt', 'SKU-002', '29.99', '', '200',
        'Clothing', 'StyleWear', '100% organic cotton t-shirt available in multiple colors.', 'Soft and comfortable.',
        '0.2', '30', '25', '2',
        'White|Black|Blue', 'S|M|L|XL|XXL', 'Cotton', 'clothing,tshirt,cotton',
        'true', 'false'
    ];
    const csvContent = [headers, sample1, sample2].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'products_import_template.csv'; a.click();
    URL.revokeObjectURL(url);
};

// ─── Step Badge ────────────────────────────────────────────
const StepBadge = ({ n, label, active, done }) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : done ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${active ? 'bg-white text-emerald-600' : done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {done ? <CheckCircle2 size={14} /> : n}
        </div>
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </div>
);

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════
const BulkImport = () => {
    const [step, setStep] = useState(1);  // 1: upload, 2: map/review, 3: importing, 4: complete
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);   // { headers, rows }
    const [importMode, setImportMode] = useState('add_new'); // add_new | add_update | update_only
    const [updateExisting, setUpdateExisting] = useState(true);
    const [skipImages, setSkipImages] = useState(false);
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [errors, setErrors] = useState([]);
    const fileRef = useRef();

    // ─── File Handling ──────────────────────────────────────
    const parseCSV = (text) => {
        const lines = text.trim().split('\n').filter(Boolean);
        if (lines.length < 2) return null;
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const rows = lines.slice(1, 6).map(line => {
            const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            return headers.reduce((acc, h, i) => { acc[h] = cols[i] || ''; return acc; }, {});
        });
        const total = lines.length - 1;
        return { headers, rows, total };
    };

    const handleFile = useCallback((f) => {
        if (!f) return;
        const ext = f.name.split('.').pop().toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(ext)) {
            alert('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
            return;
        }
        setFile(f);
        if (ext === 'csv') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const parsed = parseCSV(e.target.result);
                setPreview(parsed);
            };
            reader.readAsText(f);
        } else {
            setPreview({ headers: ['Loading Excel...'], rows: [], total: 'Excel' });
        }
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer.files[0];
        handleFile(f);
    }, [handleFile]);

    const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const onDragLeave = () => setDragOver(false);

    // ─── Import Simulation ──────────────────────────────────
    const handleImport = async () => {
        if (!file) return;
        setStep(3); setImporting(true); setProgress(0); setErrors([]);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('import_mode', importMode);
        formData.append('update_existing', updateExisting);
        formData.append('skip_images', skipImages);

        // Animate progress bar
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 90) { clearInterval(interval); return 90; }
                return p + Math.random() * 12;
            });
        }, 400);

        try {
            const res = await api.post('/api/v1/products/bulk-import/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            clearInterval(interval);
            setProgress(100);
            setResults(res.data);
            setStep(4);
        } catch (err) {
            clearInterval(interval);
            setProgress(100);
            const errData = err.response?.data;
            setErrors(errData?.errors || ['Import failed. Please check your file format and try again.']);
            setResults({ created: errData?.created || 0, updated: errData?.updated || 0, skipped: errData?.skipped || 0, failed: errData?.errors?.length || 1 });
            setStep(4);
        } finally {
            setImporting(false);
        }
    };

    const reset = () => {
        setStep(1); setFile(null); setPreview(null); setProgress(0);
        setResults(null); setErrors([]); setImportMode('add_new');
    };

    // ─── STEP 1: Upload ─────────────────────────────────────
    const renderUpload = () => (
        <div className="space-y-6">
            {/* Drop zone */}
            <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${dragOver ? 'border-emerald-400 bg-emerald-50' : file ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/30'}`}
                onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                onClick={() => fileRef.current?.click()}
            >
                <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                    onChange={e => handleFile(e.target.files[0])} />

                <AnimatePresence mode="wait">
                    {file ? (
                        <motion.div key="file" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                <FileSpreadsheet size={32} />
                            </div>
                            <p className="font-black text-gray-800 text-base">{file.name}</p>
                            <p className="text-sm text-gray-500 font-medium">{(file.size / 1024).toFixed(1)} KB — {preview?.total || '?'} product{preview?.total !== 1 ? 's' : ''} detected</p>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full">
                                <CheckCircle2 size={14} /> File ready to import
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragOver ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <Upload size={32} />
                            </div>
                            <div>
                                <p className="font-black text-gray-700 text-base">{dragOver ? 'Drop your file here!' : 'Drag & drop your file here'}</p>
                                <p className="text-sm text-gray-400 font-medium mt-1">or <span className="text-emerald-600 font-black underline">click to browse</span></p>
                            </div>
                            <p className="text-xs text-gray-400 font-bold">Supports: .CSV, .XLSX, .XLS</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {file && (
                    <button
                        onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); }}
                        className="absolute top-4 right-4 p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* CSV Preview */}
            {preview && preview.headers && preview.headers.length > 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
                        <Eye size={16} className="text-emerald-500" />
                        <h3 className="text-sm font-black text-gray-700">File Preview <span className="text-gray-400 font-medium">(first 5 rows)</span></h3>
                        <span className="ml-auto text-[10px] text-gray-400 font-black uppercase">{preview.total} total rows</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-[#eaf4f0]">
                                <tr>
                                    {preview.headers.map(h => (
                                        <th key={h} className="px-4 py-3 text-emerald-800 font-black uppercase text-[10px] tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {preview.rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50">
                                        {preview.headers.map(h => (
                                            <td key={h} className="px-4 py-2.5 text-gray-600 font-medium max-w-[140px] truncate">{row[h]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Import settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="text-sm font-black text-gray-800 flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" /> Import Settings
                </h3>

                {/* Mode */}
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Update Existing Products</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { val: 'add_new', label: 'Add New Only', desc: 'Skip existing products (matched by SKU or slug)' },
                            { val: 'add_update', label: 'Add & Update', desc: 'Import new products and update existing ones' },
                            { val: 'update_only', label: 'Update Only', desc: 'Only update existing products, skip new ones' },
                        ].map(opt => (
                            <button key={opt.val} type="button" onClick={() => setImportMode(opt.val)}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${importMode === opt.val ? 'border-emerald-400 bg-emerald-50' : 'border-gray-100 bg-gray-50 hover:border-emerald-200'}`}>
                                <p className={`text-xs font-black ${importMode === opt.val ? 'text-emerald-700' : 'text-gray-700'}`}>{opt.label}</p>
                                <p className={`text-[10px] font-medium mt-1 leading-relaxed ${importMode === opt.val ? 'text-emerald-600' : 'text-gray-400'}`}>{opt.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-emerald-200 transition-all">
                        <div>
                            <p className="text-xs font-black text-gray-700">Skip Image Import</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Don't import product image URLs</p>
                        </div>
                        <input type="checkbox" checked={skipImages} onChange={e => setSkipImages(e.target.checked)} className="sr-only peer" />
                        <div className="relative w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-emerald-200 transition-all">
                        <div>
                            <p className="text-xs font-black text-gray-700">Generate Thumbnails</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Auto-generate after import</p>
                        </div>
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="relative w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
                <button onClick={() => setStep(2)} disabled={!file}
                    className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]">
                    <ArrowRight size={18} /> Continue to Review & Import
                </button>
            </div>
        </div>
    );

    // ─── STEP 2: Review ─────────────────────────────────────
    const renderReview = () => (
        <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-black text-emerald-800">All looks good!</p>
                    <p className="text-sm text-emerald-700 font-medium mt-1">
                        <strong>{file?.name}</strong> with <strong>{preview?.total || '?'} products</strong> is ready to import.
                        Mode: <strong>{importMode.replace(/_/g, ' ')}</strong>
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-black text-gray-800 mb-4">Import Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Rows', val: preview?.total || '?', color: 'gray' },
                        { label: 'Columns Detected', val: preview?.headers?.length || '?', color: 'blue' },
                        { label: 'Import Mode', val: importMode.replace(/_/g, ' '), color: 'amber' },
                        { label: 'Skip Images', val: skipImages ? 'Yes' : 'No', color: skipImages ? 'red' : 'emerald' },
                    ].map(item => (
                        <div key={item.label} className={`p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-100`}>
                            <p className={`text-xl font-black text-${item.color}-700 capitalize`}>{item.val}</p>
                            <p className={`text-[10px] font-black text-${item.color}-500 uppercase tracking-widest mt-1`}>{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 font-medium">
                    <span className="font-black">Important:</span> This action may modify your product catalog. We recommend taking a backup before proceeding. Large imports may take a few minutes.
                </p>
            </div>

            <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all text-sm">
                    ← Back
                </button>
                <button onClick={handleImport}
                    className="flex-[2] py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 text-sm active:scale-[0.99]">
                    <Upload size={18} /> Run Importer
                </button>
            </div>
        </div>
    );

    // ─── STEP 3: Importing ──────────────────────────────────
    const renderImporting = () => (
        <div className="flex flex-col items-center justify-center py-16 space-y-8">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Upload size={40} className="text-emerald-400 animate-bounce" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-30" />
            </div>
            <div className="text-center">
                <p className="text-xl font-black text-gray-800">Importing Products...</p>
                <p className="text-sm text-gray-400 font-medium mt-1">Please don't close this page</p>
            </div>
            <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-xs font-black text-gray-500">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <p className="text-[10px] text-gray-400 font-medium text-center">
                    {progress < 30 ? 'Parsing file...' : progress < 60 ? 'Validating products...' : progress < 90 ? 'Saving to database...' : 'Finishing up...'}
                </p>
            </div>
        </div>
    );

    // ─── STEP 4: Complete ───────────────────────────────────
    const renderComplete = () => {
        const hasErrors = errors.length > 0;
        return (
            <div className="space-y-6">
                <div className={`rounded-2xl p-6 flex items-start gap-4 ${hasErrors ? 'bg-amber-50 border border-amber-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                    {hasErrors ? <AlertCircle size={28} className="text-amber-500 shrink-0" /> : <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />}
                    <div>
                        <p className={`text-lg font-black ${hasErrors ? 'text-amber-800' : 'text-emerald-800'}`}>
                            {hasErrors ? 'Import completed with issues' : '🎉 Import successful!'}
                        </p>
                        <p className={`text-sm font-medium mt-1 ${hasErrors ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {hasErrors ? 'Some products could not be imported. Review the errors below.' : 'All products have been imported successfully!'}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Created', val: results?.created || 0, icon: CheckCircle2, color: 'emerald' },
                        { label: 'Updated', val: results?.updated || 0, icon: RefreshCw, color: 'blue' },
                        { label: 'Skipped', val: results?.skipped || 0, icon: ChevronRight, color: 'amber' },
                        { label: 'Failed', val: results?.failed || errors.length, icon: AlertCircle, color: 'red' },
                    ].map(({ label, val, icon: Icon, color }) => (
                        <div key={label} className={`p-5 rounded-2xl bg-${color}-50 border border-${color}-100 text-center`}>
                            <Icon size={20} className={`text-${color}-500 mx-auto mb-2`} />
                            <p className={`text-3xl font-black text-${color}-700`}>{val}</p>
                            <p className={`text-[10px] font-black text-${color}-500 uppercase tracking-widest mt-1`}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* Errors list */}
                {errors.length > 0 && (
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 bg-red-50 border-b border-red-100 flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-500" />
                            <h3 className="text-sm font-black text-red-700">Import Errors ({errors.length})</h3>
                        </div>
                        <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                            {errors.map((err, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-red-600 font-medium p-2 bg-red-50 rounded-lg">
                                    <X size={12} className="shrink-0 mt-0.5" /> {typeof err === 'string' ? err : JSON.stringify(err)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <button onClick={reset}
                        className="flex-1 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2">
                        <RefreshCw size={16} /> Import More Products
                    </button>
                    <a href="/admin/products/all"
                        className="flex-1 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 text-sm flex items-center justify-center gap-2">
                        <Package size={16} /> View All Products
                    </a>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Upload size={22} className="text-emerald-500" /> Bulk Import Products
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Import products from a WooCommerce CSV, Shopify export, or our standard template.
                    </p>
                </div>
                <button onClick={generateCSVTemplate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-black rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm">
                    <Download size={16} className="text-emerald-500" /> Download Template CSV
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT: Steps Progress */}
                <div className="xl:col-span-1 space-y-4">
                    {/* Steps */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Import Steps</p>
                        <StepBadge n={1} label="Upload File" active={step === 1} done={step > 1} />
                        <StepBadge n={2} label="Review & Configure" active={step === 2} done={step > 2} />
                        <StepBadge n={3} label="Importing" active={step === 3} done={step > 3} />
                        <StepBadge n={4} label="Complete" active={step === 4} done={false} />
                    </div>

                    {/* Tips box */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-xs font-black text-gray-700 flex items-center gap-2 mb-3">
                            <Info size={14} className="text-blue-500" /> Tips & Notes
                        </h3>
                        <ul className="space-y-2.5 text-xs text-gray-500 font-medium">
                            <li className="flex items-start gap-2"><ChevronRight size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Max file size: 50MB</li>
                            <li className="flex items-start gap-2"><ChevronRight size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Supported: .CSV, .XLSX, .XLS</li>
                            <li className="flex items-start gap-2"><ChevronRight size={12} className="text-emerald-400 shrink-0 mt-0.5" /> <strong>SKU</strong> or <strong>slug</strong> is used to match existing products</li>
                            <li className="flex items-start gap-2"><ChevronRight size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Multiple values (e.g. colors) can be pipe-separated: <code className="bg-gray-100 px-1 rounded">Red|Blue|Green</code></li>
                            <li className="flex items-start gap-2"><ChevronRight size={12} className="text-emerald-400 shrink-0 mt-0.5" /> WooCommerce and Shopify exports are supported natively</li>
                            <li className="flex items-start gap-2"><ChevronRight size={12} className="text-emerald-400 shrink-0 mt-0.5" /> Download our template for the correct column format</li>
                        </ul>
                    </div>

                    {/* Supported formats */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-xs font-black text-gray-700 mb-3">Compatible Formats</h3>
                        <div className="space-y-2">
                            {[
                                { name: 'WooCommerce Export', color: 'purple' },
                                { name: 'Shopify Export', color: 'green' },
                                { name: 'NextGen Template', color: 'emerald' },
                                { name: 'Custom CSV', color: 'blue' },
                            ].map(f => (
                                <div key={f.name} className={`flex items-center gap-3 p-2.5 rounded-xl bg-${f.color}-50 border border-${f.color}-100`}>
                                    <FileSpreadsheet size={14} className={`text-${f.color}-500`} />
                                    <span className={`text-xs font-black text-${f.color}-700`}>{f.name}</span>
                                    <CheckCircle2 size={13} className={`text-${f.color}-400 ml-auto`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Step Content */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-50">
                            <h2 className="font-black text-gray-800">
                                {step === 1 && '1. Upload your product file'}
                                {step === 2 && '2. Review & confirm import settings'}
                                {step === 3 && '3. Importing your products...'}
                                {step === 4 && '4. Import complete!'}
                            </h2>
                            {file && step <= 2 && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100">
                                    <FileSpreadsheet size={12} /> {file.name}
                                </span>
                            )}
                        </div>

                        {step === 1 && renderUpload()}
                        {step === 2 && renderReview()}
                        {step === 3 && renderImporting()}
                        {step === 4 && renderComplete()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkImport;
