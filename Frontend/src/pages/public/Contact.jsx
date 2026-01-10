import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would send data to backend /api/support/contact/
        setSubmitted(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Get in Touch</h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
                    <p className="text-gray-600">Have a query? Fill out the form or reach us directly.</p>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Phone</h3>
                            <p className="text-gray-600">+1 (555) 123-4567</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Email</h3>
                            <p className="text-gray-600">support@nextgenstore.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Office</h3>
                            <p className="text-gray-600">123 Innovation Drive, Tech Valley, CA 94043</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="bg-green-100 p-4 rounded-full text-green-600 inline-block mb-4">
                                <Send size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                            <p className="text-gray-600 mt-2">We'll get back to you within 24 hours.</p>
                            <button onClick={() => setSubmitted(false)} className="mt-6 text-blue-600 underline">Send another message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows="4" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
