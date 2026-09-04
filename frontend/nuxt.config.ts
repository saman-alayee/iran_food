// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Iran Food | اولین دیتاست تصویری غذاهای ایرانی',
      meta: [
        {
          name: 'description',
          content:
            'Iran Food اولین دیتاست تصویری استاندارد و قابل توسعه از غذاهای ایرانی؛ پژوهش زیر نظر دانشگاه علوم پزشکی تهران.',
        },
        { name: 'theme-color', content: '#0B5C3B' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fa_IR' },
        { property: 'og:site_name', content: 'Iran Food' },
        {
          property: 'og:title',
          content: 'Iran Food | اولین دیتاست تصویری غذاهای ایرانی',
        },
        {
          property: 'og:description',
          content:
            'اولین دیتاست تصویری استاندارد غذاهای ایرانی با بیش از ۵۰٬۰۰۰ تصویر.',
        },
        { property: 'og:image', content: '/images/foods/baghali-polo-01.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'Iran Food | اولین دیتاست تصویری غذاهای ایرانی',
        },
        {
          name: 'twitter:description',
          content:
            'اولین دیتاست تصویری استاندارد غذاهای ایرانی با بیش از ۵۰٬۰۰۰ تصویر.',
        },
        { name: 'twitter:image', content: '/images/foods/baghali-polo-01.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        (process.env.NODE_ENV === 'production'
          ? 'https://api.iranfoodd.ir'
          : 'http://localhost:4002'),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    name: 'Iran Food',
  },

  sitemap: {
    exclude: ['/admin/**'],
  },

  nitro: {
    compressPublicAssets: true,
  },

  routeRules: {
    '/admin/**': { ssr: false, robots: false },
  },
});
