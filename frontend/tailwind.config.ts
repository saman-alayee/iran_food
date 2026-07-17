import type { Config } from 'tailwindcss';

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0B5C3B',
          'green-dark': '#08462D',
          'green-light': '#E8F3EC',
          'green-mid': '#1F7A4D',
          orange: '#F18A00',
          'orange-dark': '#D97800',
          cream: '#F7FAF6',
          muted: '#5F6B64',
          line: '#D7E3DA',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        nav: '0 10px 30px rgba(11, 92, 59, 0.22)',
        soft: '0 12px 40px rgba(15, 40, 28, 0.08)',
      },
      borderRadius: {
        pill: '9999px',
      },
      maxWidth: {
        content: '1180px',
      },
    },
  },
  plugins: [],
} satisfies Config;
