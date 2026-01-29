import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        brand: ''
    });

    const handleImageChange = (e) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);
        if (formData.brand) data.append('brand', formData.brand);

        images.forEach((img, index) => {
            data.append('images', img.file);
        });

        try {
            await api.post('/vendor/products/create/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Product Created Successfully!');
            // Reset form or redirect
            setFormData({ name: '', description: '', price: '', category: '', stock: '', brand: '' });
            setImages([]);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-main">Add New Product</h1>
                <Link to="/vendor/dashboard" className="text-brand hover:underline">Back to Dashboard</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {/* 1. Basic Information */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold text-text-main mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-text-sub mb-1">Product Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:outline-none"
                                placeholder="e.g. Wireless Noise Cancelling Headphones"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-text-sub mb-1">Description</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:outline-none h-32"
                                placeholder="Detailed product description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Media */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold text-text-main mb-4">Product Images</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <img src={img.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand hover:bg-brand-accent/10 transition-colors">
                            <Upload className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Upload Image</span>
                            <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                </div>

                {/* 3. Pricing & Inventory */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold text-text-main mb-4">Pricing & Inventory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-sub mb-1">Price ($)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:outline-none"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-sub mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:outline-none"
                                placeholder="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-sub mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:outline-none bg-white"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="home">Home & Garden</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold" disabled={loading}>Cancel</button>
                    <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                        {loading ? 'Creating...' : <><Plus size={20} /> Create Product</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
