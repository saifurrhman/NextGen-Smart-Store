import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#f9fafb]">
            <AlertTriangle className="text-emerald-600 h-24 w-24 mb-6 animate-pulse" />
            <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-black rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md"
            >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
