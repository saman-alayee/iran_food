<script setup lang="ts">
import { assetUrl } from '~/composables/useSiteContent';

const { siteContent } = useSiteContent();
const { apiBase } = useApi();

const whyImageUrl = computed(() =>
  assetUrl(siteContent.value.whyImage || '/images/why-section-hero.png', apiBase)
);
</script>

<template>
  <section id="why" class="section-shell pb-10 sm:pb-12">
    <div class="mb-6 flex items-center justify-center gap-2 sm:mb-8">
      <svg class="h-5 w-5 shrink-0 text-brand-green" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3c4 3.2 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7.8 6-11z" />
      </svg>
      <h2 class="section-title !text-right sm:!text-center">
        {{ siteContent.whyTitle }}
      </h2>
    </div>

    <div class="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
      <div class="order-2 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:order-1">
        <article
          v-for="card in siteContent.whyCards"
          :key="card.title"
          class="card-soft border border-brand-line/70 p-4 sm:p-5"
        >
          <div class="mb-3 grid h-10 w-10 place-items-center rounded-full bg-brand-green-light text-brand-green">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5L9 16.2z" />
            </svg>
          </div>
          <h3 class="text-sm font-bold leading-6 text-slate-800">{{ card.title }}</h3>
          <p class="mt-2 text-xs leading-6 text-slate-600">{{ card.text }}</p>
        </article>
      </div>

      <div
        class="relative order-1 mx-auto flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72 lg:order-2 lg:h-80 lg:w-80"
      >
        <div
          class="absolute inset-0 rounded-full border-2 border-dashed border-brand-green/30"
          aria-hidden="true"
        />
        <div class="absolute -inset-2 hidden overflow-hidden rounded-full sm:block">
          <svg viewBox="0 0 300 300" class="h-full w-full">
            <defs>
              <path id="circlePath" d="M150,150 m-120,0 a120,120 0 1,1 240,0 a120,120 0 1,1 -240,0" />
            </defs>
            <text fill="#0B5C3B" font-size="14" font-weight="700" letter-spacing="4">
              <textPath href="#circlePath" startOffset="0%">
                IRAN FOOD • IRAN FOOD • IRAN FOOD •
              </textPath>
            </text>
          </svg>
        </div>
        <div
          class="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-soft sm:h-52 sm:w-52 lg:h-60 lg:w-60"
        >
          <img
            :src="whyImageUrl"
            alt="قرمه سبزی — نمونه غذای ایرانی"
            width="480"
            height="480"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>
