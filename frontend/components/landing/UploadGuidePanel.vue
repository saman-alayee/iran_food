<script setup lang="ts">
import { assetUrl } from '~/composables/useSiteContent';

withDefaults(
  defineProps<{
    compact?: boolean;
  }>(),
  { compact: false }
);

const { siteContent } = useSiteContent();
const { apiBase } = useApi();

const guideMediaUrl = computed(() =>
  assetUrl(siteContent.value.uploadGuideVideoUrl || '', apiBase)
);
const guidePosterUrl = computed(() =>
  assetUrl(siteContent.value.uploadGuideVideoPoster || '', apiBase)
);

const isVideoGuide = computed(() =>
  /\.(mp4|webm|ogg)(\?|$)/i.test(siteContent.value.uploadGuideVideoUrl || '')
);

const hasGuide = computed(
  () =>
    !!siteContent.value.uploadGuideTitle &&
    (!!guideMediaUrl.value || (siteContent.value.uploadPhotoSpecs?.length ?? 0) > 0)
);
</script>

<template>
  <div
    v-if="hasGuide"
    class="rounded-2xl border border-brand-line/70 bg-brand-cream/60"
    :class="compact ? 'p-4' : 'p-4 sm:p-5'"
  >
    <h3 class="text-sm font-bold text-brand-green sm:text-base">
      {{ siteContent.uploadGuideTitle }}
    </h3>
    <p v-if="isVideoGuide" class="mt-1 text-xs text-slate-500">
      ویدیوی راهنمای تصویربرداری — قبل از ارسال عکس حتماً مشاهده کنید
    </p>

    <div v-if="guideMediaUrl" class="mt-3 overflow-hidden rounded-xl bg-black/5 ring-1 ring-brand-line/40">
      <video
        v-if="isVideoGuide"
        class="w-full object-cover"
        :class="compact ? 'h-44 sm:h-48' : 'h-48 sm:h-64'"
        controls
        playsinline
        preload="metadata"
        :poster="guidePosterUrl || undefined"
        :src="guideMediaUrl"
      />
      <img
        v-else
        :src="guideMediaUrl"
        :alt="siteContent.uploadGuideTitle"
        class="w-full object-cover"
        :class="compact ? 'h-40' : 'h-48 sm:h-56'"
        loading="lazy"
      />
    </div>

    <ul v-if="siteContent.uploadPhotoSpecs?.length" class="mt-4 space-y-2">
      <li
        v-for="spec in siteContent.uploadPhotoSpecs"
        :key="spec.label"
        class="rounded-xl bg-white px-3 py-2.5 text-xs leading-6 text-slate-700 sm:text-sm sm:leading-7"
      >
        <span class="font-bold text-brand-green">{{ spec.label }}:</span>
        {{ spec.value }}
      </li>
    </ul>
  </div>
</template>
