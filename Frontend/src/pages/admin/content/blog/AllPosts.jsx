import React from 'react';
import { FileText, Plus, Search } from 'lucide-react';

const AllPosts = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <FileText size={22} className="text-brand" />
                        All Blog Posts
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage published and draft posts</p>
                </div>
                <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors shadow-sm">
                    <Plus size={16} />
                    Add New
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search all blog posts..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                        />
                    </div>
                </div>
                
                <div className="p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <FileText size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-medium text-gray-900">No items found</p>
                    <p className="text-sm text-gray-400 mt-1">Get started by adding your first item.</p>
                </div>
            </div>
        </div>
    );
};

export default AllPosts;
