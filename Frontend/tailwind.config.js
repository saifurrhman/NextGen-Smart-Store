/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors
                brand: {
                    DEFAULT: '#4EA674', // Ocean Green
                    dark: '#023337',    // Cyprus
                    light: '#C1E6BA',   // Surf Crest
                    accent: '#EAF8E7',  // Aqua Spring
                },
                // Action / Primary CTA
                action: {
                    DEFAULT: '#6467F2', // Primary (Purple)
                    hover: '#5356D0',
                },
                // Functional Colors
                functional: {
                    success: '#21C45D',
                    pending: '#F0D411',
                    error: '#EF4343',
                },
                // Text Colors
                text: {
                    main: '#023337', // Cyprus
                    sub: '#7C7C7C',  // Grey
                }
            },
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
            },
            fontSize: {
                // Typography Specs
                'display': ['57px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.25%' }],     // Header 1
                'h2': ['32px', { lineHeight: '1.2', fontWeight: '400', letterSpacing: '0' }],               // Header 2
                'dashboard': ['18px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-2%' }],      // Title for Dashboard
                'body-large': ['22px', { lineHeight: '1.4', fontWeight: '500' }],                           // Title/Body Large
                'body': ['16px', { lineHeight: '1.4', fontWeight: '500' }],                                 // Body
                'btn': ['16px', { lineHeight: '1', fontWeight: '700', letterSpacing: '0' }],                // Button Text
            },
            boxShadow: {
                // Effect Specs (Ambient Shadows)
                'effect-1': '0px 2px 4px rgba(0, 0, 0, 0.08)',   // 1 Ambient
                'effect-3': '0px 4px 12px rgba(0, 0, 0, 0.12)',  // 3 Ambient
                'effect-6': '0px 8px 24px rgba(0, 0, 0, 0.16)',  // 6 Ambient
            }
        },
    },
    plugins: [],
}
