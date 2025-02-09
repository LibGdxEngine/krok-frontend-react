// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nextI18NextConfig from './next-i18next.config.mjs';

// Import translations (optional if you want to preload them)
import common_en from './public/locales/en/common.json';
import common_uk from './public/locales/uk/common.json';

i18n
    .use(initReactI18next) // Passes i18n instance to react-i18next
    .init({
        ...nextI18NextConfig.i18n, // Use your next-i18next config for initialization
        fallbackLng: 'en', // Fallback language
        debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
        resources: {
            en: {
                common: common_en, // 'common' is the namespace here
            },
            uk: {
                common: common_uk,
            },
        },
        react: {
            useSuspense: false, // Optional: Disable suspense if you are not using it
        },
    });

export default i18n;
