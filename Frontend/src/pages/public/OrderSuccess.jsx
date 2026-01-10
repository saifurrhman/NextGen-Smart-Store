import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    // In a real app, we'd get the order ID from state passed via navigation
    const orderId = location.state?.orderId || 'ORD-' + Math.floor(Math.random() * 100000);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="text-green-500 h-20 w-20" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. Your order <span className="font-bold text-gray-900">#{orderId}</span> has been placed successfully.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                            You will receive an email confirmation shortly.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                            We are processing your order for delivery.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                            Estimated Delivery: 3-5 Business Days.
                        </li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <Link
                        to="/profile"
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-base"
                    >
                        <Package className="mr-2 h-5 w-5" /> Track Order
                    </Link>
                    <Link
                        to="/"
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-base"
                    >
                        Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
