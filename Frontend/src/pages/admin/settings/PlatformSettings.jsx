import React, { useState } from 'react';
import { Globe, DollarSign, Settings, Store, Key, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { globalLanguages as languages, globalCurrencies as currencies } from '../../../utils/localizationData';
import { useCurrency } from '../../../context/CurrencyContext';

const PlatformSettings = () => {
    const { t, i18n } = useTranslation();
    const { currency, setCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState('localization');
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
    const [selectedCurrency, setSelectedCurrency] = useState(currency || 'USD');

    // Sync state if context changes externally
    React.useEffect(() => {
        setSelectedCurrency(currency);
    }, [currency]);

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
    };

    const handleCurrencyChange = (e) => {
        const curr = e.target.value;
        setSelectedCurrency(curr);
    };

    const handleSave = () => {
        i18n.changeLanguage(selectedLanguage);
        setCurrency(selectedCurrency); // Updates global context
    };

    const tabs = [
        { id: 'general', label: t('General'), icon: Settings },
        { id: 'localization', label: t('Localization'), icon: Globe },
        { id: 'store', label: t('Store Details'), icon: Store },
        { id: 'api', label: t('API Configs'), icon: Key }
    ];

    return (
        <div className="max-w-[1400px] mx-auto pb-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('Platform Settings')}</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-2 space-y-1">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-emerald-500' : 'text-gray-400'} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Localization Tab */}
                    {activeTab === 'localization' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Globe size={20} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{t('Localization')}</h2>
                                    <p className="text-sm text-gray-500 mt-1">Configure language, timezone, and currency settings.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Language */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 block">
                                        {t('Select Language')}
                                    </label>
                                    <p className="text-xs text-gray-500 pb-1">
                                        {t('Choose the default language for the platform.')}
                                    </p>
                                    <div className="relative">
                                        <select
                                            value={selectedLanguage}
                                            onChange={handleLanguageChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                        >
                                            {languages.map(l => (
                                                <option key={l.code} value={l.code}>{l.name}</option>
                                            ))}
                                        </select>
                                        <Globe size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Currency */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 block">
                                        {t('Select Currency')}
                                    </label>
                                    <p className="text-xs text-gray-500 pb-1">
                                        {t('Choose the default currency for the platform.')}
                                    </p>
                                    <div className="relative">
                                        <select
                                            value={selectedCurrency}
                                            onChange={handleCurrencyChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                        >
                                            {currencies.map(c => (
                                                <option key={c.code} value={c.code}>{c.name}</option>
                                            ))}
                                        </select>
                                        <DollarSign size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-emerald-200"
                                >
                                    <Save size={16} />
                                    {t('Save Changes')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* API Configs Tab */}
                    {activeTab === 'api' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Key size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">API Configurations</h2>
                                    <p className="text-sm text-gray-500 mt-1">Configure external services and integration keys.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 block">
                                        Google Analytics Tracking ID
                                    </label>
                                    <p className="text-xs text-gray-500 pb-1">
                                        Enter your GA4 Measurement ID (e.g., G-XXXXXXXXXX) to enable real-time traffic tracking.
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="G-XXXXXXXXXX"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                        />
                                        <Globe size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-200">
                                        <Save size={16} />
                                        Save Configurations
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {activeTab !== 'localization' && activeTab !== 'api' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center py-20">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                <Settings size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Almost There</h3>
                            <p className="text-gray-500 max-w-sm">This section is currently under development. Please check the Localization or API Configs tab.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlatformSettings;
