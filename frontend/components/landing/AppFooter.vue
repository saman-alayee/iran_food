<script setup lang="ts">
const { siteContent, mediaUrl } = useSiteContent();
const emit = defineEmits<{ openUpload: [] }>();
const year = new Date().getFullYear();

function scrollParticipate() {
  const href = siteContent.value.buttons.participate.href || '#rewards';
  if (href.startsWith('#')) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  window.location.href = href;
}
</script>

<template>
  <footer id="contact" class="mt-2 sm:mt-4">
    <div class="bg-brand-green px-4 py-3.5 text-center text-sm font-semibold leading-7 text-white sm:py-4 sm:text-base">
      {{ siteContent.footerSlogan }}
    </div>

    <div class="bg-[#0a4a31] text-white">
      <div class="section-shell grid gap-8 py-8 sm:py-10 md:grid-cols-2 lg:grid-cols-3">
        <div class="text-center md:text-right">
          <div class="flex items-center justify-center gap-2 text-lg font-extrabold md:justify-start">
            <img
              :src="mediaUrl(siteContent.images.logo)"
              :alt="siteContent.brand"
              class="h-10 w-auto max-w-[120px] object-contain"
            />
            {{ siteContent.brand }}
          </div>
          <p class="mt-3 text-sm leading-7 text-white/80">
            {{ siteContent.supervisedBy }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
          <div>
            <h3 class="mb-3 font-bold">دسترسی سریع</h3>
            <ul class="space-y-2 text-white/80">
              <li v-for="item in siteContent.nav.slice(0, 3)" :key="`f1-${item.href}`">
                <a :href="item.href" class="inline-block py-0.5 hover:text-white">{{ item.label }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="mb-3 font-bold">منابع</h3>
            <ul class="space-y-2 text-white/80">
              <li v-for="item in siteContent.nav.slice(3)" :key="`f2-${item.href}`">
                <a :href="item.href" class="inline-block py-0.5 hover:text-white">{{ item.label }}</a>
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
            <button
              v-if="siteContent.buttons.participate.enabled"
              type="button"
              class="btn-green w-full !bg-white !text-brand-green sm:w-auto"
              @click="scrollParticipate"
            >
              {{ siteContent.buttons.participate.label }}
            </button>
            <button
              v-if="siteContent.buttons.uploadFooter.enabled"
              type="button"
              class="btn-orange w-full sm:w-auto"
              @click="emit('openUpload')"
            >
              {{ siteContent.buttons.uploadFooter.label }}
            </button>
          </div>
        </div>

        <div class="text-center text-sm md:text-right lg:col-span-1">
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

      <div class="border-t border-white/10 px-4 py-4 text-center text-xs leading-6 text-white/70">
        © {{ year }} Iran Food Dataset. All rights reserved.
      </div>
    </div>
  </footer>
</template>
