import React from 'react';
import { PlusCircle, Search, Filter, Download, Plus, MoreVertical, Edit2, Trash2, Home, ChevronRight, Image as ImageIcon, X, Box, Upload } from 'lucide-react';

const AddProduct = () => {
    return (
        <div className="max-w-[1600px] mx-auto pb-10 space-y-6">

            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Home size={16} />
                    <ChevronRight size={14} className="text-gray-400" />
                    <span>eCommerce</span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="text-emerald-500 font-bold">Add Product</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 border border-gray-200 text-gray-600 bg-white font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm">
                        Cancel
                    </button>
                    <button className="px-5 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors text-sm shadow-sm">
                        Submit Product
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 items-start">

                {/* LEFT COLUMN (Forms) */}
                <div className="flex-1 space-y-6 w-full">

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                                <input type="text" placeholder="Type name here" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                {/* Toolbars mockup */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20">
                                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 shrink-0 flex-wrap">
                                        <button className="w-8 h-8 rounded hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 font-serif font-bold transition-all">B</button>
                                        <button className="w-8 h-8 rounded hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 font-serif italic transition-all">I</button>
                                        <button className="w-8 h-8 rounded hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 font-serif underline transition-all">U</button>
                                        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                                        <select className="bg-transparent text-sm text-gray-600 outline-none font-medium cursor-pointer py-1">
                                            <option>Paragraph</option>
                                            <option>Heading 1</option>
                                            <option>Heading 2</option>
                                        </select>
                                        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                                        <button className="px-2 h-8 rounded hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 font-medium text-xs transition-all flex items-center justify-center">Link</button>
                                        <button className="px-2 h-8 rounded hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 font-medium text-xs transition-all flex items-center justify-center">List</button>
                                    </div>
                                    <textarea rows="6" placeholder="Type Description here" className="w-full p-4 text-sm focus:outline-none bg-white min-h-[120px] resize-y"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">Pricing</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Price</label>
                                <input type="number" placeholder="$ 0.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Price</label>
                                <input type="number" placeholder="$ 0.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Type</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white font-medium text-gray-700">
                                    <option>No Discount</option>
                                    <option>Percentage</option>
                                    <option>Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Value</label>
                                <input type="number" placeholder="10" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50" />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center gap-3">
                            <label className="flex items-center cursor-pointer relative">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                            <span className="text-sm font-medium text-gray-700">Tax Included</span>
                        </div>
                    </div>

                    {/* Product Variants (Colors & Sizes) */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                            <h2 className="text-lg font-bold text-gray-800">Product Variants</h2>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Attributes</span>
                        </div>

                        <div className="space-y-6">
                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Available Colors</label>
                                <div className="flex flex-wrap gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500" />
                                        <div className="w-5 h-5 rounded-full bg-red-500 border border-gray-200"></div>
                                        <span className="text-sm font-medium text-gray-600">Red</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500" />
                                        <div className="w-5 h-5 rounded-full bg-blue-500 border border-gray-200"></div>
                                        <span className="text-sm font-medium text-gray-600">Blue</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500" />
                                        <div className="w-5 h-5 rounded-full bg-black border border-gray-200"></div>
                                        <span className="text-sm font-medium text-gray-600">Black</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500" />
                                        <div className="w-5 h-5 rounded-full bg-white border border-gray-300"></div>
                                        <span className="text-sm font-medium text-gray-600">White</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500" />
                                        <div className="w-5 h-5 rounded-full bg-green-500 border border-gray-200"></div>
                                        <span className="text-sm font-medium text-gray-600">Green</span>
                                    </label>

                                    <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors">
                                        <Plus size={14} /> Add Color
                                    </button>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100"></div>

                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 hover:bg-gray-50 transition-all">XS</div>
                                    </label>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" className="peer sr-only" defaultChecked />
                                        <div className="px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 hover:bg-gray-50 transition-all">S</div>
                                    </label>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" className="peer sr-only" defaultChecked />
                                        <div className="px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 hover:bg-gray-50 transition-all">M</div>
                                    </label>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" className="peer sr-only" defaultChecked />
                                        <div className="px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 hover:bg-gray-50 transition-all">L</div>
                                    </label>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 hover:bg-gray-50 transition-all">XL</div>
                                    </label>
                                    <label className="relative cursor-pointer">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 hover:bg-gray-50 transition-all">XXL</div>
                                    </label>

                                    <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-md hover:bg-emerald-100 transition-colors ml-2">
                                        <Plus size={14} /> Add Size
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">Inventory</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
                                <input type="text" placeholder="SKU-1234" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Barcode</label>
                                <input type="text" placeholder="1234567890" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
                                <input type="number" placeholder="100" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN (Images & Tags) */}
            <div className="w-full xl:w-[350px] shrink-0 space-y-6">

                {/* Image Upload */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-800 mb-4">Product Image</h2>

                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-emerald-400 transition-colors cursor-pointer group mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ImageIcon size={20} className="text-emerald-500" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700 text-center mb-1">Click to upload or drag & drop</p>
                        <p className="text-[10px] text-gray-400 text-center">SVG, PNG, JPG (MAX. 800x400px)</p>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-2 overflow-x-auto pt-2">
                        <div className="w-14 h-14 rounded-lg border border-emerald-500 bg-white shadow-sm flex items-center justify-center p-1 shrink-0 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <Trash2 size={14} className="text-white cursor-pointer hover:text-red-400" />
                            </div>
                            <div className="w-full h-full bg-emerald-50 rounded flex items-center justify-center text-[8px] font-bold text-emerald-600">IMG 1</div>
                        </div>
                        <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50/50 flex items-center justify-center shrink-0 hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer text-gray-400 hover:text-emerald-500">
                            <Plus size={16} />
                        </div>
                        <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50/50 flex items-center justify-center shrink-0 hover:border-emerald-400 hover:bg-emerald-50 transition-colors cursor-pointer text-gray-400 hover:text-emerald-500">
                            <Plus size={16} />
                        </div>
                    </div>
                </div>

                {/* 3D Model View */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <Box size={16} className="text-indigo-500" /> 3D Preview
                        </h2>
                        <span className="text-[10px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">FYP Core</span>
                    </div>

                    <div className="border border-indigo-100 bg-gray-50/50 rounded-lg overflow-hidden mb-4 relative h-[250px] flex items-center justify-center">
                        <model-viewer
                            src="https://modelviewer.dev/shared-assets/models/Shoe.glb"
                            alt="A 3D model"
                            auto-rotate
                            camera-controls
                            shadow-intensity="1"
                            style={{ width: '100%', height: '100%', outline: 'none' }}
                        ></model-viewer>
                    </div>

                    <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 flex flex-col items-center justify-center bg-indigo-50/20 hover:bg-indigo-50 hover:border-indigo-400 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Upload size={14} className="text-indigo-600" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700 text-center mb-1">Upload .GLB/.GLTF File</p>
                        <p className="text-[10px] text-gray-400 text-center">Enable 3D rotate for customers</p>
                    </div>
                </div>

                {/* Categories Config */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">

                    <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-3">Categories</h2>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white font-medium text-gray-700">
                            <option>Select a category</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Accessories</option>
                            <option>Home & Kitchen</option>
                        </select>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-gray-800 mb-3">Tags</h2>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Find or create tags" className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-gray-50/50 mb-3" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">
                                Wireless <button className="hover:text-emerald-900"><X size={12} /></button>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">
                                Bluetooth <button className="hover:text-emerald-900"><X size={12} /></button>
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-semibold hover:bg-gray-100 cursor-pointer transition-colors">
                                Headphones
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-semibold hover:bg-gray-100 cursor-pointer transition-colors">
                                Audio
                            </span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AddProduct;
