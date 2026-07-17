<script setup lang="ts">
import { siteContent } from '~/composables/useSiteContent';
import { foodThumbs } from '~/composables/useFoodImages';

const emit = defineEmits<{ openUpload: [] }>();
const { isMobile, isTablet } = useBreakpoint();

const visibleThumbs = computed(() => {
  if (isMobile.value) return foodThumbs.slice(0, 16);
  if (isTablet.value) return foodThumbs.slice(0, 25);
  return foodThumbs;
});

const gridCols = computed(() => {
  if (isMobile.value) return 'grid-cols-4';
  return 'grid-cols-5';
});

function scrollRewards() {
  document.getElementById('rewards')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <section id="home" class="section-shell relative py-6 sm:py-8 lg:py-12">
    <div class="grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
      <div class="order-2 lg:order-1">
        <div class="mb-4 flex items-center gap-3 sm:mb-5">
          <div
            class="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-green text-white shadow-soft sm:h-16 sm:w-16"
            aria-hidden="true"
          >
            <svg class="h-7 w-7 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M4 14c2-6 6-9 8-9s6 3 8 9" />
              <path d="M4 14h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2z" />
              <path d="M9 7c.5-2 2-3 3-3s2.5 1 3 3" />
            </svg>
          </div>
          <div class="min-w-0">
            <h1 class="text-2xl font-extrabold tracking-tight text-brand-green sm:text-3xl lg:text-4xl">
              Iran Food
            </h1>
            <p class="mt-1 text-sm font-semibold leading-6 text-slate-700 sm:text-base lg:text-lg">
              {{ siteContent.tagline }}
            </p>
          </div>
        </div>

        <div
          class="mb-4 inline-flex max-w-full items-start gap-2 rounded-2xl bg-brand-green-light px-3 py-2 text-[11px] font-semibold leading-5 text-brand-green sm:mb-5 sm:rounded-full sm:px-3 sm:py-1.5 sm:text-xs"
        >
          <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green sm:mt-0.5" />
          <span>{{ siteContent.supervisedBy }}</span>
        </div>

        <ul class="mb-6 space-y-2.5 sm:mb-7 sm:space-y-3">
          <li
            v-for="(feature, idx) in siteContent.heroFeatures"
            :key="feature.text"
            class="flex items-start gap-3 text-sm text-slate-700 sm:items-center sm:text-[15px]"
          >
            <span
              class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-brand-green shadow-sm"
            >
              <svg v-if="idx === 0" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 5h4l2-2h4l2 2h4v14H4V5zm8 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 8z" />
              </svg>
              <svg v-else-if="idx === 1" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3zm0 4v12.1C8.9 16.5 6.5 13 6.5 10.1V7.2L12 5.1V6z" />
              </svg>
              <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5L9 16.2z" />
              </svg>
            </span>
            <span class="min-w-0 leading-6">{{ feature.text }}</span>
          </li>
        </ul>

        <div class="btn-stack">
          <button type="button" class="btn-green" @click="scrollRewards">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              />
            </svg>
            مشارکت در پروژه
          </button>
          <button type="button" class="btn-orange" @click="emit('openUpload')">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
            </svg>
            آپلود عکس غذا
          </button>
        </div>
      </div>

      <div class="order-1 lg:order-2">
        <div
          class="mx-auto grid gap-1.5 sm:max-w-md sm:gap-2 lg:max-w-none lg:gap-3"
          :class="[gridCols, isMobile ? 'max-w-[280px]' : 'max-w-sm sm:max-w-md']"
        >
          <div
            v-for="thumb in visibleThumbs"
            :key="thumb.id"
            class="aspect-square overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-brand-line"
          >
            <img
              :src="thumb.src"
              :alt="thumb.alt"
              width="160"
              height="160"
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
