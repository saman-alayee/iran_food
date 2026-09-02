<script setup lang="ts">
const { siteContent } = useSiteContent();

const emit = defineEmits<{ openUpload: [] }>();
const year = new Date().getFullYear();
</script>

<template>
  <footer id="contact" class="mt-2 sm:mt-4">
    <div
      class="bg-brand-green px-4 py-3.5 text-center text-sm font-semibold leading-7 text-white sm:py-4 sm:text-base"
    >
      {{ siteContent.footerSlogan }}
    </div>

    <div class="bg-brand-footer text-white">
      <div class="section-shell grid gap-8 py-8 sm:py-10 md:grid-cols-2 lg:grid-cols-4">
        <div class="text-center md:text-right">
          <div class="flex items-center justify-center md:justify-start">
            <LandingBrandLogo framed light />
          </div>
          <p class="mt-3 text-sm leading-7 text-white/80">
            {{ siteContent.tagline }}. {{ siteContent.supervisedBy }}
          </p>
        </div>

        <div>
          <h3 class="mb-3 text-center text-sm font-bold md:text-right">دسترسی سریع</h3>
          <ul class="space-y-2 text-center text-sm text-white/80 md:text-right">
            <li v-for="item in siteContent.nav.slice(0, 3)" :key="`f1-${item.href}`">
              <a :href="item.href" class="inline-block py-0.5 hover:text-white">{{ item.label }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-3 text-center text-sm font-bold md:text-right">منابع</h3>
          <ul class="space-y-2 text-center text-sm text-white/80 md:text-right">
            <li v-for="item in siteContent.nav.slice(3)" :key="`f2-${item.href}`">
              <a :href="item.href" class="inline-block py-0.5 hover:text-white">{{ item.label }}</a>
            </li>
          </ul>
        </div>

        <div class="text-center text-sm md:text-right">
          <h3 class="mb-3 font-bold">تماس با ما</h3>
          <ul class="space-y-2 text-white/80">
            <li>
              <a :href="`mailto:${siteContent.contact.email}`" class="break-all hover:text-white">
                {{ siteContent.contact.email }}
              </a>
            </li>
            <li>{{ siteContent.contact.phone }}</li>
            <li class="leading-7">{{ siteContent.contact.address }}</li>
          </ul>
        </div>
      </div>

      <div class="section-shell flex flex-col items-center justify-center gap-3 pb-8 sm:flex-row sm:gap-4">
        <a
          href="#rewards"
          class="btn-green w-full min-w-[180px] !bg-white !text-brand-green hover:!bg-brand-cream sm:w-auto"
        >
          {{ siteContent.participateButtonLabel }}
        </a>
        <button type="button" class="btn-orange w-full min-w-[180px] sm:w-auto" @click="emit('openUpload')">
          {{ siteContent.uploadButtonLabel }}
        </button>
      </div>
    </div>

    <div class="border-t border-brand-line/60 bg-brand-cream px-4 py-4 text-center text-xs text-slate-500">
      © {{ year }} Iran Food Dataset. All rights reserved.
    </div>
  </footer>
</template>
