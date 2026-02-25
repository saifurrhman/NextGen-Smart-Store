import React from 'react';
import { FileText, Image, BookOpen, Layout, Globe, PenTool } from 'lucide-react';

const stats = [
    { label: 'Total Pages', value: '12', icon: FileText, change: '+2 this month' },
    { label: 'Blog Posts', value: '38', icon: BookOpen, change: '+5 this week' },
    { label: 'Banners', value: '8', icon: Image, change: '3 active' },
    { label: 'Media Files', value: '156', icon: Layout, change: '2.4 GB used' },
];

const quickActions = [
    { label: 'Manage Pages', desc: 'Edit homepage, about, contact & more', icon: Globe },
    { label: 'Blog Manager', desc: 'Create and publish blog posts', icon: PenTool },
    { label: 'Banner Slider', desc: 'Update hero banners & promotions', icon: Image },
    { label: 'Media Library', desc: 'Upload and manage media files', icon: Layout },
];

const ContentDashboard = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                    <FileText size={22} className="text-brand" />
                    Content Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage pages, blogs, banners & media</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                                    <Icon size={20} className="text-brand" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className="text-xs text-brand mt-1">{stat.change}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button key={action.label} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand/30 transition-all text-left group">
                                <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                                    <Icon size={20} className="text-brand group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-brand-dark">{action.label}</p>
                                    <p className="text-xs text-gray-400">{action.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ContentDashboard;
