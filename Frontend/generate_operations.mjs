import fs from 'fs';
import path from 'path';

const pages = [
    // Delivery
    {
        path: 'analytics/DailyOperations.jsx', name: 'DailyOperations', title: 'Daily Operations', icon: 'Sun',
        cols: ['Date', 'Total Orders', 'Packed', 'Shipped', 'Exceptions', 'Status'],
        data: [
            { c1: 'Today', c2: '1,240', c3: '850', c4: '310', c5: '12', c6: 'Active' },
            { c1: 'Yesterday', c2: '980', c3: '980', c4: '980', c5: '4', c6: 'Completed' },
            { c1: 'Feb 24, 2026', c2: '1,105', c3: '1,105', c4: '1,100', c5: '5', c6: 'Completed' },
        ]
    },
    {
        path: 'analytics/OrderProcessing.jsx', name: 'OrderProcessing', title: 'Order Processing', icon: 'Box',
        cols: ['Order ID', 'Customer', 'Items', 'Assigned To', 'Time elapsed', 'Status'],
        data: [
            { c1: '#ORD-9982', c2: 'Ahmed Ali', c3: '4 items', c4: 'Waqas (Station 2)', c5: '15 mins', c6: 'Packing' },
            { c1: '#ORD-9981', c2: 'Sara Khan', c3: '1 item', c4: 'Unassigned', c5: '45 mins', c6: 'Pending' },
            { c1: '#ORD-9980', c2: 'Zainab Q.', c3: '12 items', c4: 'Ali (Station 1)', c5: '5 mins', c6: 'Picking' },
        ]
    },
    {
        path: 'analytics/InventoryAlerts.jsx', name: 'InventoryAlerts', title: 'Inventory Alerts', icon: 'AlertTriangle',
        cols: ['SKU', 'Product Name', 'Current Stock', 'Threshold', 'Supplier', 'Status'],
        data: [
            { c1: 'SKU-ELEC-002', c2: 'Smart Watch Pro V2', c3: '4 units', c4: '20 units', c5: 'TechTronics', c6: 'Critical' },
            { c1: 'SKU-HOME-491', c2: 'Ceramic Vase Set', c3: '12 units', c4: '15 units', c5: 'HomeDecor Inc.', c6: 'Low Stock' },
            { c1: 'SKU-BEAU-882', c2: 'Organic Face Serum', c3: '0 units', c4: '50 units', c5: 'NatureGlow', c6: 'Out of Stock' },
        ]
    },

    // Analytics
    {
        path: 'analytics/VendorSupport.jsx', name: 'VendorSupport', title: 'Vendor Support Tickets', icon: 'Headphones',
        cols: ['Ticket ID', 'Vendor Name', 'Issue Type', 'Priority', 'Created At', 'Status'],
        data: [
            { c1: 'TIC-001', c2: 'Gadget Hub', c3: 'Payout Delay', c4: 'High', c5: '2 hrs ago', c6: 'Open' },
            { c1: 'TIC-002', c2: 'Style Boutique', c3: 'Product Listing', c4: 'Medium', c5: '5 hrs ago', c6: 'In Progress' },
            { c1: 'TIC-003', c2: 'Home Essentials', c3: 'Account Access', c4: 'Low', c5: '1 day ago', c6: 'Resolved' },
        ]
    }
];

const template = (p) => `import React from 'react';
import { ${p.icon}, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const ${p.name} = () => {
    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <${p.icon} size={22} className="text-brand" />
                        ${p.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view your ${p.title.toLowerCase()}</p>
                </div>
                {!${p.isForm ? 'true' : 'false'} && (
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
                ${p.isForm ? `
                <div className="p-6">
                    <div className="max-w-2xl space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            ${p.fields.map(f => `
                            <div className="space-y-1.5 ${f.length > 20 ? 'md:col-span-2' : ''}">
                                <label className="text-sm font-medium text-gray-700">${f}</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all text-sm" placeholder="Enter ${f.toLowerCase()}" />
                            </div>
                            `).join('')}
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
                ` : `
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search in ${p.title}..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto shadow-sm">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>
                
                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                ${p.cols?.map(c => `
                                <th className="px-6 py-3">${c}</th>
                                `).join('') || ''}
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            ${p.data?.map((d, i) => `
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-900">${d.c1}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    ${d.c2 === 'Active' ? '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Active</span>' :
        d.c2 === 'Critical' || d.c2 === 'Out of Stock' ? '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>' + d.c2 + '</span>' :
            d.c2 === 'Low Stock' || d.c2 === 'Pending' ? '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>' + d.c2 + '</span>' :
                d.c2}
                                </td>
                                <td className="px-6 py-4 text-gray-600">${d.c3}</td>
                                <td className="px-6 py-4 text-gray-600">${d.c4}</td>
                                <td className="px-6 py-4 text-gray-600">${d.c5}</td>
                                ${d.c6 ? `<td className="px-6 py-4 text-gray-600 font-medium">
                                    ${d.c6 === 'Active' ? '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Active</span>' :
            d.c6 === 'Critical' || d.c6 === 'Out of Stock' ? '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>' + d.c6 + '</span>' :
                d.c6 === 'Low Stock' || d.c6 === 'Pending' || d.c6 === 'Open' ? '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>' + d.c6 + '</span>' :
                    d.c6 === 'Completed' || d.c6 === 'Resolved' ? '<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>' + d.c6 + '</span>' :
                        d.c6}
                                </td>` : ''}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-brand transition-colors"><Edit2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                            `).join('') || ''}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex items-center justify-between">
                    <span>Showing ${p.data?.length || 0} entries</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-brand text-white rounded">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
                `}
            </div>
        </div>
    );
};

export default ${p.name};
`;

const baseDir = 'D:/Semester/New folder/NextGen-Smart-Store/frontend/src/pages/admin/operations';

pages.forEach(p => {
    const fullPath = path.join(baseDir, p.path);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, template(p));
    console.log('Created/Updated Mock UI for:', fullPath);
});
