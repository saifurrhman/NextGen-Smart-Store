import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, Download as ExportIcon } from 'lucide-react';
import api from '../../../../utils/api';

const InventoryAlerts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLowStock();
    }, []);

    const fetchLowStock = async () => {
        setLoading(true);
        try {
            // Fetch products and filter for low stock (e.g., < 10)
            const response = await api.get('/api/v1/products/');
            const allProducts = response.data.results || response.data;
            setProducts(allProducts.filter(p => p.stock < 10));
        } catch (error) {
            console.error("Failed to fetch inventory alerts:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
                        <AlertTriangle size={22} className="text-red-500" />
                        Inventory Alerts
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Products running low on stock</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 font-bold bg-white border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4 text-center">Current Stock</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="3" className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                                        <td className="px-6 py-4 text-center text-red-600 font-bold">{product.stock}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                                                Low Stock
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-20 text-center text-gray-400 font-bold italic">
                                        No inventory alerts. All items are well-stocked.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryAlerts;
