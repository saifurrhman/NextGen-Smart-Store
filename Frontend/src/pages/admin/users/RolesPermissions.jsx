import React, { useState } from 'react';
import {
    Shield, Lock, Unlock, ShieldCheck,
    Home, ChevronRight, Plus, Save, Trash2, Edit2
} from 'lucide-react';

const RolesPermissions = () => {
    const [roles, setRoles] = useState([
        { id: 1, name: 'Super Admin', permissions: ['ALL'], users: 2, isSystem: true },
        { id: 2, name: 'Support Manager', permissions: ['VIEW_ORDERS', 'MANAGE_TICKETS', 'VIEW_USERS'], users: 5, isSystem: false },
        { id: 3, name: 'Marketing Staff', permissions: ['VIEW_ANALYTICS', 'MANAGE_BLOG', 'MANAGE_DISCOUNTS'], users: 3, isSystem: false },
        { id: 4, name: 'Catalog Manager', permissions: ['MANAGE_PRODUCTS', 'MANAGE_CATEGORIES'], users: 4, isSystem: false },
    ]);

    const allPermissions = [
        { key: 'MANAGE_PRODUCTS', label: 'Manage Products', group: 'Inventory' },
        { key: 'MANAGE_CATEGORIES', label: 'Manage Categories', group: 'Inventory' },
        { key: 'VIEW_ORDERS', label: 'View Orders', group: 'Sales' },
        { key: 'MANAGE_ORDERS', label: 'Manage Orders', group: 'Sales' },
        { key: 'VIEW_USERS', label: 'View Users', group: 'Staff' },
        { key: 'MANAGE_STAFF', label: 'Manage Staff', group: 'Staff' },
        { key: 'VIEW_ANALYTICS', label: 'View Analytics', group: 'Reports' },
        { key: 'MANAGE_BLOG', label: 'Manage Blog', group: 'Content' },
        { key: 'MANAGE_TICKETS', label: 'Manage Tickets', group: 'Support' },
        { key: 'MANAGE_SETTINGS', label: 'Manage Settings', group: 'System' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <ShieldCheck size={24} className="text-emerald-500" />
                        Roles & Permissions
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mt-1">
                        <Home size={14} />
                        <ChevronRight size={12} />
                        <span>Staff Management</span>
                        <ChevronRight size={12} />
                        <span className="text-emerald-500 font-bold">Roles</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200">
                    <Plus size={18} /> Create New Role
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Roles List */}
                <div className="xl:col-span-1 space-y-4">
                    {roles.map(role => (
                        <div key={role.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:border-emerald-200 transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-gray-800">{role.name}</h3>
                                {role.isSystem && (
                                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider">System</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                <span className="flex items-center gap-1"><Shield size={12} /> {role.permissions.includes('ALL') ? 'Full Access' : `${role.permissions.length} Permissions`}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{role.users} Active Users</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-gray-400 hover:text-emerald-500 transition-colors"><Edit2 size={14} /></button>
                                {!role.isSystem && (
                                    <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Permissions matrix (placeholder editor) */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Role Permissions</h3>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Editing: Support Manager</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-xs hover:bg-emerald-100 transition-colors border border-emerald-100">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>

                    <div className="space-y-8">
                        {['Inventory', 'Sales', 'Staff', 'Reports', 'Content', 'Support', 'System'].map(group => (
                            <div key={group}>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    {group} Module
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {allPermissions.filter(p => p.group === group).map(perm => (
                                        <div key={perm.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:border-emerald-100 transition-all cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-emerald-500">
                                                    <Unlock size={14} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{perm.label}</span>
                                            </div>
                                            <label className="flex items-center cursor-pointer relative">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={perm.key.includes('VIEW')} />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RolesPermissions;
