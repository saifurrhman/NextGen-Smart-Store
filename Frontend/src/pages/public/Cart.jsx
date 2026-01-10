import React from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart (2 items)</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-4">
                    {/* Mock Item 1 */}
                    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" alt="Shoe" className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900">Nike Air Zoom AR</h3>
                                <span className="font-bold">$120.00</span>
                            </div>
                            <p className="text-sm text-gray-500">Color: Red | Size: 9</p>
                            <div className="flex justify-between items-end mt-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600">-</button>
                                    <span className="px-3 py-1 font-medium">1</span>
                                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600">+</button>
                                </div>
                                <button className="text-red-500 hover:text-red-600 p-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mock Item 2 */}
                    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                        <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80" alt="Hoodie" className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900">Urban Hoodie</h3>
                                <span className="font-bold">$85.00</span>
                            </div>
                            <p className="text-sm text-gray-500">Color: Grey | Size: M</p>
                            <div className="flex justify-between items-end mt-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600">-</button>
                                    <span className="px-3 py-1 font-medium">1</span>
                                    <button className="px-3 py-1 hover:bg-gray-50 text-gray-600">+</button>
                                </div>
                                <button className="text-red-500 hover:text-red-600 p-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$205.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>$20.50</span>
                            </div>
                            <div className="h-px bg-gray-200 my-4"></div>
                            <div className="flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>$225.50</span>
                            </div>
                        </div>
                        <Link to="/checkout" className="mt-6 w-full block text-center bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                            Proceed to Checkout
                        </Link>
                        <Link to="/products" className="mt-3 w-full block text-center text-gray-500 text-sm hover:text-gray-900">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
