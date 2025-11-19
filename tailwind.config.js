/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // Blue 500
                secondary: '#10b981', // Emerald 500
                background: '#0f172a', // Slate 900
                surface: '#1e293b', // Slate 800
                muted: '#64748b', // Slate 500
            },
        },
    },
    plugins: [],
}
