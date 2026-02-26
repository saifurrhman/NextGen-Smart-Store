import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    // Initialize currency from localStorage or default to USD
    const [currency, setCurrencyState] = useState(() => {
        return localStorage.getItem('appCurrency') || 'USD';
    });

    // Update localStorage whenever currency changes
    useEffect(() => {
        localStorage.setItem('appCurrency', currency);
    }, [currency]);

    // Custom function to handle currency changes and broadcast an event if needed
    const setCurrency = (newCurrency) => {
        setCurrencyState(newCurrency);
        // Optional: Dispatch a custom event if other non-React scripts need to know
        window.dispatchEvent(new Event('currencyChanged'));
    };

    /**
     * Formats a given amount into the appropriate localized currency string.
     * @param {number} amount - The numeric amount to format.
     * @param {number} minimumFractionDigits - The minimum decimal places (defaults to 2 for usual currencies).
     * @returns {string} - The formatted currency string (e.g., "$1,000.00" or "Rs 1,000.00")
     */
    const formatCurrency = (amount, minimumFractionDigits = 2) => {
        if (amount == null || isNaN(amount)) return '';

        try {
            // First, try using the native Intl.NumberFormat
            // Note: For some custom or unusual currencies (like 'PKT'), it might fallback gracefully.
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency === 'PKT' ? 'PKR' : currency, // Fallback PKT to PKR formatting rules natively
                minimumFractionDigits: minimumFractionDigits,
                maximumFractionDigits: minimumFractionDigits
            }).format(amount);

            // If the selected currency was our custom alias PKT, replace Rs with PKT
            if (currency === 'PKT') {
                return formatted.replace('PKR', 'PKT').replace('Rs', 'PKT');
            }

            return formatted;
        } catch (error) {
            // Fallback for unsupported currency codes in older browsers
            console.warn(`Currency format error for ${currency}:`, error);
            return `${currency} ${Number(amount).toFixed(minimumFractionDigits)}`;
        }
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};
