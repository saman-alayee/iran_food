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
          green: '#1A7A3A',
          'green-dark': '#145F2E',
          'green-light': '#E6F4EA',
          'green-mid': '#2E9B52',
          orange: '#F5A623',
          'orange-dark': '#E09000',
          cream: '#F8FBF9',
          muted: '#4A5C52',
          line: '#C8DDD0',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        nav: '0 10px 30px rgba(26, 122, 58, 0.28)',
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
