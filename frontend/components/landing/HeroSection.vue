<script setup lang="ts">
import { assetUrl } from '~/composables/useSiteContent';

const { siteContent } = useSiteContent();
const { apiBase } = useApi();

const emit = defineEmits<{ openUpload: [] }>();

const visibleThumbs = computed(() =>
  (siteContent.value.heroThumbs || [])
    .filter((item) => item.src)
    .map((item, index) => ({
      id: index + 1,
      src: assetUrl(item.src, apiBase),
      alt: item.alt || item.name || 'غذای ایرانی',
    }))
);

function scrollRewards() {
  document.getElementById('rewards')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <section id="home" class="section-shell relative py-8 sm:py-10 lg:py-12">
    <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div class="text-center lg:order-1 lg:text-right">
        <div class="mb-4 lg:items-start">
          <h1 class="text-3xl font-extrabold text-brand-green sm:text-4xl">Iran Food</h1>
          <p class="mt-2 text-base font-semibold text-slate-700 sm:text-lg">
            {{ siteContent.tagline }}
          </p>
        </div>

        <p class="mb-5 text-xs font-medium text-brand-muted sm:text-sm">
          {{ siteContent.supervisedBy }}
        </p>

        <ul class="mb-7 space-y-3 text-right">
          <li
            v-for="(feature, idx) in siteContent.heroFeatures"
            :key="feature.text"
            class="flex items-center justify-center gap-3 text-sm text-slate-700 lg:justify-start"
          >
            <span
              class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-green-light text-brand-green"
            >
              <svg v-if="idx === 0" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 5h4l2-2h4l2 2h4v14H4V5zm8 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 8z" />
              </svg>
              <svg v-else-if="idx === 1" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" />
              </svg>
              <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5L9 16.2z" />
              </svg>
            </span>
            <span>{{ feature.text }}</span>
          </li>
        </ul>

        <div class="btn-stack justify-center lg:justify-start">
          <button type="button" class="btn-green min-w-[180px]" @click="scrollRewards">
            {{ siteContent.participateButtonLabel }}
          </button>
          <button type="button" class="btn-orange min-w-[180px]" @click="emit('openUpload')">
            {{ siteContent.uploadButtonLabel }}
          </button>
        </div>
      </div>

      <div class="mx-auto w-full max-w-md lg:order-2 lg:max-w-none lg:justify-self-start">
        <div class="grid grid-cols-5 gap-2 sm:gap-2.5">
          <div
            v-for="thumb in visibleThumbs"
            :key="thumb.id"
            class="aspect-square overflow-hidden rounded-none border border-brand-line/70 bg-white shadow-sm"
          >
            <img
              :src="thumb.src"
              :alt="thumb.alt"
              width="120"
              height="120"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
