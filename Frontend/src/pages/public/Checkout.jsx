import React, { useState } from 'react';
import { CreditCard, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Info, 2: Payment

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            alert("Order Placed Successfully!");
            navigate('/');
        }, 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-8 text-center">Checkout</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Form */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <form onSubmit={handlePlaceOrder}>
                        {/* Steps Indicator */}
                        <div className="flex items-center mb-6 text-sm">
                            <span className={`font-bold ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>1. Shipping</span>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className={`font-bold ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>2. Payment</span>
                        </div>

                        {/* Shipping Info */}
                        <div className="space-y-4">
                            <h2 className="font-bold flex items-center gap-2">
                                <Truck size={20} /> Shipping Address
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="p-3 border rounded-lg w-full" required />
                                <input type="text" placeholder="Last Name" className="p-3 border rounded-lg w-full" required />
                            </div>
                            <input type="email" placeholder="Email Address" className="p-3 border rounded-lg w-full" required />
                            <input type="text" placeholder="Street Address" className="p-3 border rounded-lg w-full" required />
                            <div className="grid grid-cols-3 gap-4">
                                <input type="text" placeholder="City" className="p-3 border rounded-lg w-full" required />
                                <input type="text" placeholder="State" className="p-3 border rounded-lg w-full" required />
                                <input type="text" placeholder="ZIP Code" className="p-3 border rounded-lg w-full" required />
                            </div>
                        </div>

                        {/* Payment Mock */}
                        <div className="mt-8 space-y-4 pt-6 border-t border-gray-100">
                            <h2 className="font-bold flex items-center gap-2">
                                <CreditCard size={20} /> Payment Method
                            </h2>
                            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                                    <span className="font-medium">Credit Card</span>
                                </div>
                                <div className="flex gap-2">
                                    {/* Icons */}
                                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                            <input type="text" placeholder="Card Number" className="p-3 border rounded-lg w-full" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM / YY" className="p-3 border rounded-lg w-full" />
                                <input type="text" placeholder="CVC" className="p-3 border rounded-lg w-full" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-8 hover:bg-blue-700 transition-colors">
                            Place Order ($225.50)
                        </button>
                    </form>
                </div>

                {/* Mini Summary */}
                <div className="md:w-80">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
                        <h3 className="font-bold mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Nike Air Zoom AR</span><span>$120.00</span></div>
                            <div className="flex justify-between"><span>Urban Hoodie</span><span>$85.00</span></div>
                            <div className="h-px bg-gray-200 my-2"></div>
                            <div className="flex justify-between font-bold"><span>Total</span><span>$225.50</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
