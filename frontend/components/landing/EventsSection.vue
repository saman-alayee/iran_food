<script setup lang="ts">
import { siteContent } from '~/composables/useSiteContent';

const scroller = ref<HTMLElement | null>(null);

function scrollByDir(dir: number) {
  if (!scroller.value) return;
  const card = scroller.value.querySelector('article');
  const cardWidth = card?.clientWidth || scroller.value.clientWidth * 0.85;
  scroller.value.scrollBy({ left: -dir * (cardWidth + 16), behavior: 'smooth' });
}
</script>

<template>
  <section id="events" class="section-shell pb-10 sm:pb-12">
    <div class="mb-4 flex items-center justify-between gap-3 sm:mb-6">
      <h2 class="min-w-0 text-lg font-extrabold text-brand-green sm:text-xl md:text-2xl">
        {{ siteContent.eventsTitle }}
      </h2>
      <div class="flex shrink-0 gap-2">
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-full border border-brand-line bg-white text-brand-green transition hover:bg-brand-green-light"
          aria-label="قبلی"
          @click="scrollByDir(-1)"
        >
          ›
        </button>
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-full border border-brand-line bg-white text-brand-green transition hover:bg-brand-green-light"
          aria-label="بعدی"
          @click="scrollByDir(1)"
        >
          ‹
        </button>
      </div>
    </div>

    <div
      ref="scroller"
      class="carousel-bleed flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scrollbar-hide sm:gap-4"
    >
      <article
        v-for="event in siteContent.events"
        :key="event.title"
        class="card-soft w-[min(85vw,280px)] shrink-0 snap-start overflow-hidden border border-brand-line/60 sm:w-[280px]"
      >
        <img
          :src="event.image"
          :alt="event.alt"
          width="640"
          height="360"
          loading="lazy"
          decoding="async"
          class="h-32 w-full object-cover sm:h-36"
        />
        <div class="p-3.5 sm:p-4">
          <h3 class="text-sm font-bold text-slate-800">{{ event.title }}</h3>
          <p class="mt-2 text-xs leading-6 text-slate-600">{{ event.text }}</p>
          <p class="mt-3 text-[11px] font-semibold text-brand-green">{{ event.date }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
