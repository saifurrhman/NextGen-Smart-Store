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
                    DEFAULT: 'var(--color-brand)',       // Ocean Green
                    dark: 'var(--color-brand-dark)',     // Cyprus
                    light: 'var(--color-brand-light)',   // Surf Crest
                    accent: 'var(--color-brand-accent)', // Aqua Spring
                },
                // Action / Primary CTA
                action: {
                    DEFAULT: 'var(--color-action)',       // Primary (Purple)
                    hover: 'var(--color-action-hover)',
                },
                // Functional Colors
                functional: {
                    success: 'var(--color-success)',
                    pending: 'var(--color-pending)',
                    error: 'var(--color-error)',
                },
                // Text Colors
                text: {
                    main: 'var(--color-text-main)', // Cyprus
                    sub: 'var(--color-text-sub)',   // Grey
                },
                // Background & Border Colors
                bg: {
                    page: 'var(--color-bg-page)',
                    card: 'var(--color-bg-card)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
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
                'caption': ['14px', { lineHeight: '1.4', fontWeight: '500' }],                              // Helper/Caption
            },
            boxShadow: {
                // Effect Specs (Ambient Shadows)
                'effect-1': '0px 2px 4px rgba(0, 0, 0, 0.08)',    // 1 Ambient
                'effect-3': '0px 4px 12px rgba(0, 0, 0, 0.12)',   // 3 Ambient
                'effect-6': '0px 8px 24px rgba(0, 0, 0, 0.16)',   // 6 Ambient
            },
            borderRadius: {
                'card': '12px',      // Standard card radius
                'btn': '8px',        // Standard button radius
                'input': '100px',    // Pill shape for inputs
            }
        },
    },
    plugins: [],
}
