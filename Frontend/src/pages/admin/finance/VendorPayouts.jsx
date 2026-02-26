import React from 'react';
import { Wallet, Plus, Search, Filter, Download } from 'lucide-react';

const VendorPayouts = () => {
    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <Wallet size={22} className="text-brand" />
                        Vendor Payouts
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Overview of all pending and completed vendor payouts</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        <Download size={16} />
                        Export
                    </button>
                    
                    <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                        <Plus size={16} />
                        Add New
                    </button>
                    
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search records..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors w-full sm:w-auto">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>
                
                {/* Empty State */}
                <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-4">
                        <Wallet size={32} className="text-brand" />
                    </div>
                    <h3 className="text-lg font-medium text-brand-dark">No records found</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm">No data is currently available for Vendor Payouts. Try adjusting your filters or search terms.</p>
                </div>
            </div>
        </div>
    );
};

export default VendorPayouts;
