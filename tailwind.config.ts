import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#3b82f6' },
        accent: '#5AB78D'
      },
      boxShadow: { soft: '0 8px 24px rgba(0,0,0,0.08)' }
    }
  },
  plugins: []
} satisfies Config
