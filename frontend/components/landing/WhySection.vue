<script setup lang="ts">
const { siteContent, mediaUrl } = useSiteContent();
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

    <div class="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:gap-10">
      <div class="order-2 min-w-0 lg:order-none lg:col-start-1 lg:row-start-1">
        <div
          class="scrollbar-hide -mx-[var(--section-x)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--section-x)] pb-1 sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          <article
            v-for="card in siteContent.whyCards"
            :key="card.title"
            class="card-soft flex aspect-square w-[148px] shrink-0 snap-start flex-col border border-brand-line/70 p-3 sm:w-[160px] sm:p-4 lg:w-full lg:min-w-0"
          >
            <div
              class="mb-2 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-green-light text-brand-green sm:mb-3 sm:h-10 sm:w-10"
            >
              <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5L9 16.2z" />
              </svg>
            </div>
            <h3 class="text-xs font-bold leading-5 text-slate-800 sm:text-sm sm:leading-6">
              {{ card.title }}
            </h3>
            <p class="mt-auto pt-1.5 text-[11px] leading-5 text-slate-600 sm:pt-2 sm:text-xs sm:leading-6">
              {{ card.text }}
            </p>
          </article>
        </div>
      </div>

      <div class="order-1 mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:order-none lg:col-start-2 lg:row-start-1 lg:max-w-none">
        <img
          :src="mediaUrl(siteContent.images.whyHero)"
          alt="ایران فود — کاسه غذاهای سالم ایرانی"
          width="640"
          height="640"
          loading="lazy"
          decoding="async"
          class="mx-auto h-auto w-full max-w-[420px] object-contain lg:max-w-none lg:scale-105"
        />
      </div>
    </div>
  </section>
</template>
