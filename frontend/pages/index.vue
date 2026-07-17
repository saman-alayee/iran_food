<script setup lang="ts">
const uploadOpen = ref(false);
const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl as string;

useSeoMeta({
  title: 'Iran Food | اولین دیتاست تصویری غذاهای ایرانی',
  description:
    'Iran Food اولین دیتاست تصویری استاندارد و قابل توسعه از غذاهای ایرانی؛ پژوهش تحت نظارت دانشگاه علوم پزشکی تهران.',
  ogTitle: 'Iran Food | اولین دیتاست تصویری غذاهای ایرانی',
  ogDescription:
    'اولین دیتاست تصویری استاندارد غذاهای ایرانی با بیش از ۵۰٬۰۰۰ تصویر.',
  ogImage: `${siteUrl}/images/foods/baghali-polo-01.png`,
  ogUrl: siteUrl,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Iran Food | اولین دیتاست تصویری غذاهای ایرانی',
  twitterDescription:
    'اولین دیتاست تصویری استاندارد غذاهای ایرانی با بیش از ۵۰٬۰۰۰ تصویر.',
  twitterImage: `${siteUrl}/images/foods/baghali-polo-01.png`,
});

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Iran Food',
        url: siteUrl,
        description:
          'اولین دیتاست تصویری استاندارد غذاهای ایرانی',
        inLanguage: 'fa-IR',
        publisher: {
          '@type': 'Organization',
          name: 'Iran Food',
          url: siteUrl,
        },
      }),
    },
  ],
});
</script>

<template>
  <div class="leaf-bg">
    <LandingAppNavbar @open-upload="uploadOpen = true" />
    <main>
      <LandingHeroSection @open-upload="uploadOpen = true" />
      <LandingCountdownSection />
      <LandingWhySection />
      <LandingApplicationsSection />
      <LandingProgressRewardsSection />
      <LandingEventsSection />
    </main>
    <LandingAppFooter @open-upload="uploadOpen = true" />
    <LandingUploadModal :open="uploadOpen" @close="uploadOpen = false" />
  </div>
</template>
