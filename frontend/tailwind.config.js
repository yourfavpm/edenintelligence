/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Claeron Soft Hierarchy System
        claeron: {
          primary: '#6C63FF', // Primary Purple
          accent: '#A5A0FF',  // Lavender Accent
          indigo: '#4F46E5',  // Deep Indigo
          bg: '#F7F8FB',      // Neutral Global Background
          card: '#FFFFFF',    // Card Background
          text: '#1F2937',    // Primary Text
          muted: '#6B7280',   // Secondary Text
          border: '#E5E7EB',  // Borders
          divider: '#F1F5F9', // Muted Divider
        },
        // Status colors - soft pastel shades for backgrounds, darker text
        status: {
          success: { bg: '#DCFCE7', text: '#166534', base: '#22C55E' },
          processing: { bg: '#FEF3C7', text: '#92400E', base: '#F59E0B' },
          error: { bg: '#FEE2E2', text: '#B91C1C', base: '#EF4444' },
          info: { bg: '#DBEAFE', text: '#1E40AF', base: '#3B82F6' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'input': '8px',
        'button': '10px',
        'card': '14px',
        'modal': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0,0,0,0.05)',
        'hover-soft': '0 6px 12px rgba(0,0,0,0.08)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-soft': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
