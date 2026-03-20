/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        'primary-hover': '#2563EB',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
};
