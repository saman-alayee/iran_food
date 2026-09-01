<script setup lang="ts">
import { assetUrl } from '~/composables/useSiteContent';

const { siteContent } = useSiteContent();
const { apiBase } = useApi();
</script>
<template>
  <section id="process" class="section-shell pb-10 sm:pb-12">
    <div class="card-soft border border-brand-line/50 p-5 sm:p-8">
      <div class="mb-6 text-center sm:mb-8">
        <h2 class="section-title mb-3 !text-lg sm:!text-xl">
          {{ siteContent.processGalleryTitle }}
        </h2>
        <p class="mx-auto max-w-2xl text-sm leading-7 text-slate-600">
          {{ siteContent.processGalleryIntro }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 sm:gap-5">
      <figure
        v-for="item in siteContent.processGallery"
        :key="item.src"
        class="group card-soft overflow-hidden border border-brand-line/60"
      >
        <div class="aspect-[4/3] overflow-hidden bg-brand-cream">
          <img
            :src="assetUrl(item.src, apiBase)"
            :alt="item.alt"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <figcaption class="border-t border-brand-line/50 px-4 py-3 text-sm font-bold text-brand-green">
          {{ item.caption }}
        </figcaption>
      </figure>
      </div>
    </div>
  </section>
</template>
