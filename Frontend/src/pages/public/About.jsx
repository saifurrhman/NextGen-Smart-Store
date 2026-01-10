import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">About NextGen Smart Store</h1>

            <div className="prose prose-lg mx-auto text-gray-600 space-y-6">
                <p>
                    Welcome to <span className="font-semibold text-blue-600">NextGen Smart Store</span>, your number one source for all things tech and lifestyle. We're dedicated to giving you the very best of online shopping, with a focus on dependability, customer service, and uniqueness.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8">Our Mission</h2>
                <p>
                    Founded in 2025, NextGen Smart Store has come a long way from its beginnings. When we first started out, our passion for "Eco-friendly and Smart Products" drove us to do tons of research so that NextGen Smart Store can offer you the world's most advanced shopping experience with AR/VR integration.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-12">
                    <div className="p-6 bg-blue-50 rounded-xl text-center">
                        <h3 className="font-bold text-xl text-blue-800 mb-2">Quality First</h3>
                        <p>We verify every vendor and product to ensure you get authentic items.</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-xl text-center">
                        <h3 className="font-bold text-xl text-blue-800 mb-2">Smart Tech</h3>
                        <p>Experience products in 3D/AR before you buy. The future of shopping is here.</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-xl text-center">
                        <h3 className="font-bold text-xl text-blue-800 mb-2">Fast Delivery</h3>
                        <p>Our distributed delivery network ensures your orders reach you in record time.</p>
                    </div>
                </div>

                <p>
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                </p>

                <p className="font-semibold mt-8">
                    Sincerely,<br />
                    <span className="text-blue-600">The NextGen Team</span>
                </p>
            </div>
        </div>
    );
};

export default About;
