import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "Platform Settings": "Platform Settings",
            "General": "General",
            "Localization": "Localization",
            "Store Details": "Store Details",
            "API Configs": "API Configurations",
            "Select Language": "Select Language",
            "Select Currency": "Select Currency",
            "Save Changes": "Save Changes",
            "Choose the default language for the platform.": "Choose the default language for the platform.",
            "Choose the default currency for the platform.": "Choose the default currency for the platform."
        }
    },
    ur: {
        translation: {
            "Platform Settings": "پلیٹ فارم کی ترتیبات",
            "General": "عام ترتیبات",
            "Localization": "مقامی زبان",
            "Store Details": "اسٹور کی تفصیلات",
            "API Configs": "اے پی آئی کی ترتیبات",
            "Select Language": "زبان منتخب کریں",
            "Select Currency": "کرنسی منتخب کریں",
            "Save Changes": "تبدیلیاں محفوظ کریں",
            "Choose the default language for the platform.": "پلیٹ فارم کے لیے ڈیفالٹ زبان منتخب کریں۔",
            "Choose the default currency for the platform.": "پلیٹ فارم کے لیے ڈیفالٹ کرنسی منتخب کریں۔"
        }
    },
    hi: {
        translation: {
            "Platform Settings": "प्लेटफ़ॉर्म सेटिंग्स",
            "General": "सामान्य",
            "Localization": "स्थानीयकरण",
            "Store Details": "स्टोर विवरण",
            "API Configs": "एपीआई कॉन्फ़िगरेशन",
            "Select Language": "भाषा चुनें",
            "Select Currency": "मुद्रा चुनें",
            "Save Changes": "परिवर्तन सहेजें",
            "Choose the default language for the platform.": "प्लेटफ़ॉर्म के लिए डिफ़ॉल्ट भाषा चुनें।",
            "Choose the default currency for the platform.": "प्लेटफ़ॉर्म के लिए डिफ़ॉल्ट मुद्रा चुनें।"
        }
    },
    es: {
        translation: {
            "Platform Settings": "Configuración de la plataforma",
            "General": "General",
            "Localization": "Localización",
            "Store Details": "Detalles de la tienda",
            "API Configs": "Configuración de API",
            "Select Language": "Seleccionar idioma",
            "Select Currency": "Seleccionar moneda",
            "Save Changes": "Guardar cambios",
            "Choose the default language for the platform.": "Elija el idioma predeterminado de la plataforma.",
            "Choose the default currency for the platform.": "Elija la moneda predeterminada de la plataforma."
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
