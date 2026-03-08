import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{vue,ts,js}', './stores/**/*.{ts,js}', './composables/**/*.{ts,js}'],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#F97316',
          600: '#EA580C',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
          900: '#1E3A8A',
        },
        navy: '#0F172A',
        neutral: '#F8FAFC',
        muted: '#64748B',
        'border-gray': '#E2E8F0',
        status: {
          confirmed: { bg: '#D1FAE5', text: '#065F46' },
          pending: { bg: '#FEF3C7', text: '#92400E' },
          cancelled: { bg: '#FEE2E2', text: '#991B1B' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.1)',
        xl: '0 20px 25px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        md: '0.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
