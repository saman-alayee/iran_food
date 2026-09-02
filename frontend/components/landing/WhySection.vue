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
    <div class="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:items-stretch lg:gap-x-8 lg:gap-y-6">
      <h2 id="apps" class="section-title-right order-1 w-full text-right lg:col-start-1 lg:row-start-1">
        {{ siteContent.whyTitle }}
      </h2>

      <div class="order-3 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-start-1 lg:row-start-2">
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

      <div class="relative order-2 mx-auto aspect-square w-full max-w-md lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:aspect-auto lg:h-full lg:max-w-none">
        <img
          :src="whyImageUrl"
          alt="کاسه چوبی مواد غذایی ایران فود"
          width="1024"
          height="1024"
          loading="lazy"
          decoding="async"
          class="h-auto w-full object-contain lg:absolute lg:inset-0 lg:h-full lg:w-full"
        />
      </div>
    </div>
  </section>
</template>
