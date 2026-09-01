<script setup lang="ts">
const { siteContent } = useSiteContent();

const emit = defineEmits<{ openUpload: [] }>();
const year = new Date().getFullYear();
</script>

<template>
  <footer id="contact">
    <div class="bg-brand-green px-4 py-8 text-center text-white sm:py-10">
      <div class="mb-4 flex justify-center">
        <LandingBrandLogo />
      </div>
      <p class="mx-auto max-w-2xl text-base font-bold leading-8 sm:text-lg">
        {{ siteContent.footerSlogan }}
      </p>
      <div class="btn-stack mx-auto mt-6 max-w-md justify-center">
        <a href="#rewards" class="btn-green !bg-white !text-brand-green hover:!bg-brand-cream">
          {{ siteContent.participateButtonLabel }}
        </a>
        <button type="button" class="btn-orange" @click="emit('openUpload')">
          {{ siteContent.uploadButtonLabel }}
        </button>
      </div>
    </div>

    <div class="border-t border-brand-line/60 bg-white">
      <div class="section-shell grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div class="lg:col-span-1">
          <div class="flex items-center justify-center md:justify-start">
            <LandingBrandLogo :light="false" />
          </div>
          <p class="mt-3 text-center text-sm leading-7 text-slate-600 md:text-right">
            {{ siteContent.tagline }}. {{ siteContent.supervisedBy }}
          </p>
        </div>

        <div>
          <h3 class="mb-3 text-center text-sm font-bold text-brand-green md:text-right">دسترسی سریع</h3>
          <ul class="space-y-2 text-center text-sm text-slate-600 md:text-right">
            <li v-for="item in siteContent.nav.slice(0, 3)" :key="`f1-${item.href}`">
              <a :href="item.href" class="hover:text-brand-green">{{ item.label }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-3 text-center text-sm font-bold text-brand-green md:text-right">منابع</h3>
          <ul class="space-y-2 text-center text-sm text-slate-600 md:text-right">
            <li v-for="item in siteContent.nav.slice(3)" :key="`f2-${item.href}`">
              <a :href="item.href" class="hover:text-brand-green">{{ item.label }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-3 text-center text-sm font-bold text-brand-green md:text-right">تماس با ما</h3>
          <ul class="space-y-2 text-center text-sm leading-7 text-slate-600 md:text-right">
            <li>
              <a :href="`mailto:${siteContent.contact.email}`" class="hover:text-brand-green">
                {{ siteContent.contact.email }}
              </a>
            </li>
            <li>{{ siteContent.contact.phone }}</li>
            <li>{{ siteContent.contact.address }}</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-brand-line/60 px-4 py-4 text-center text-xs text-slate-500">
        © {{ year }} Iran Food Dataset. All rights reserved.
      </div>
    </div>
  </footer>
</template>
