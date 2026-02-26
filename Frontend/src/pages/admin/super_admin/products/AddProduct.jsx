import React from 'react';
import { PlusCircle, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const AddProduct = () => {
    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <PlusCircle size={22} className="text-brand" />
                        Add Product
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your add product</p>
                </div>
                {!true && (
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <Download size={16} />
                            Export
                        </button>
                        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                            <Plus size={16} />
                            Create New
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                
                <div className="p-6">
                    <div className="max-w-2xl space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            <div className="space-y-1.5 ">
                                <label className="text-sm font-medium text-gray-700">Product Name</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter product name" />
                            </div>
                            
                            <div className="space-y-1.5 ">
                                <label className="text-sm font-medium text-gray-700">SKU</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter sku" />
                            </div>
                            
                            <div className="space-y-1.5 ">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter category" />
                            </div>
                            
                            <div className="space-y-1.5 ">
                                <label className="text-sm font-medium text-gray-700">Price</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter price" />
                            </div>
                            
                            <div className="space-y-1.5 ">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter description" />
                            </div>
                            
                            <div className="space-y-1.5 ">
                                <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter stock quantity" />
                            </div>
                            
                            <div className="space-y-1.5 ">
                                <label className="text-sm font-medium text-gray-700">Tags</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter tags" />
                            </div>
                            
                        </div>
                        <div className="pt-4 flex items-center gap-3">
                            <button className="px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors shadow-sm">
                                Save Details
                            </button>
                            <button className="px-5 py-2.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AddProduct;
