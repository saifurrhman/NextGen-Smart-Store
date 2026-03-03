import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, Check } from 'lucide-react';

const FilterDropdown = ({ options, activeFilters, onFilterChange, onClear }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionSelect = (groupKey, value) => {
        onFilterChange(groupKey, value);
    };

    const activeCount = Object.values(activeFilters).filter(val => val !== '').length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${isOpen || activeCount > 0
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm shadow-emerald-50'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <Filter size={16} />
                Filters
                {activeCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-emerald-500 text-white rounded-full text-[10px] ml-1">
                        {activeCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Filter By</span>
                        <div className="flex items-center gap-2">
                            {activeCount > 0 && (
                                <button
                                    onClick={onClear}
                                    className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-tighter"
                                >
                                    Clear All
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                        </div>
                    </div>

                    <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
                        {options.map((group) => (
                            <div key={group.key} className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                    {group.label}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {group.options.map((option) => {
                                        const isActive = activeFilters[group.key] === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleOptionSelect(group.key, option.value)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${isActive
                                                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100'
                                                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-emerald-200'
                                                    }`}
                                            >
                                                {isActive && <Check size={12} strokeWidth={3} />}
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 bg-gray-50/80 border-t border-gray-50 flex justify-end">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-black transition-all"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
