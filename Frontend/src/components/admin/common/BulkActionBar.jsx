import { Download, FileText, X, Trash2 } from 'lucide-react';

/**
 * Reusable Bulk Action Bar component.
 * 
 * @param {Object} props
 * @param {Array} props.selectedIds - List of selected row IDs
 * @param {Function} props.onClear - Callback to clear selection
 * @param {Array} props.actions - List of actions to show (optional)
 * @param {string} props.label - Label for selection (e.g. "users", "orders")
 * @param {Function} props.onExportExcel - Callback for Excel export
 * @param {Function} props.onExportCSV - Callback for CSV export
 * @param {Function} props.onExportPDF - Callback for PDF export
 * @param {Function} props.onDelete - Callback for deleting selected items
 */
const BulkActionBar = ({
    selectedIds,
    onClear,
    label = "items",
    onExportExcel,
    onExportCSV,
    onExportPDF,
    onDelete
}) => {
    if (!selectedIds || selectedIds.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-4 px-6 py-3.5 bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-xs font-black text-white">
                    {selectedIds.length}
                </span>
                <span className="text-sm font-bold text-gray-200">
                    {selectedIds.length === 1 ? `${label.singular || label} selected` : `${label.plural || label + 's'} selected`}
                </span>
            </div>

            <div className="w-px h-5 bg-gray-600" />

            <div className="flex items-center gap-2">
                {onExportExcel && (
                    <button
                        onClick={onExportExcel}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                        <Download size={13} /> Excel
                    </button>
                )}

                {onExportCSV && (
                    <button
                        onClick={onExportCSV}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                        <FileText size={13} /> CSV
                    </button>
                )}

                {onExportPDF && (
                    <button
                        onClick={onExportPDF}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                        <FileText size={13} /> PDF
                    </button>
                )}

                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold transition-colors shadow-sm ml-2"
                    >
                        <Trash2 size={13} /> Delete
                    </button>
                )}
            </div>

            <div className="w-px h-5 bg-gray-600" />

            <button
                onClick={onClear}
                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Clear selection"
            >
                <X size={15} />
            </button>
        </div>
    );
};

export default BulkActionBar;
