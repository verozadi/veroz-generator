/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    purple: '#7C3AED',
                    pink: '#EC4899',
                    blue: '#3B82F6',
                    indigo: '#4F46E5',
                },
            },
            backgroundImage: {
                'gradient-futuristic':
                    'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 30%, #6d28d9 55%, #be185d 80%, #1d4ed8 100%)',
                'gradient-card':
                    'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                shimmer: 'shimmer 1.5s infinite',
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 10px rgba(139,92,246,0.3)' },
                    '50%': { boxShadow: '0 0 25px rgba(236,72,153,0.5), 0 0 50px rgba(139,92,246,0.3)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
            backdropBlur: { xs: '2px' },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
