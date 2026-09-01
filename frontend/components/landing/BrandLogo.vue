<script setup lang="ts">
import { assetUrl } from '~/composables/useSiteContent';

const { siteContent } = useSiteContent();
const { apiBase } = useApi();

withDefaults(
  defineProps<{
    size?: 'sm' | 'md';
    showName?: boolean;
    light?: boolean;
  }>(),
  { size: 'md', showName: false, light: true }
);

const logoSrc = computed(() => {
  const images = (siteContent.value as { images?: { logo?: string } }).images;
  const path = images?.logo || '/images/iran-food-logo.png';
  return assetUrl(path, apiBase);
});
</script>

<template>
  <span class="inline-flex min-w-0 items-center gap-2.5">
    <img
      :src="logoSrc"
      :alt="siteContent.brand || 'Iran Food Dataset'"
      class="shrink-0 object-contain"
      :class="
        size === 'sm'
          ? 'h-7 w-auto max-w-[120px] sm:max-w-[132px]'
          : 'h-8 w-auto max-w-[132px] sm:h-9 sm:max-w-[156px]'
      "
      width="156"
      height="36"
      loading="eager"
      decoding="async"
    />
    <span
      v-if="showName"
      class="truncate font-extrabold"
      :class="[size === 'sm' ? 'text-sm' : 'text-sm sm:text-base', light ? 'text-white' : 'text-brand-green']"
    >
      {{ siteContent.brand || 'Iran Food' }}
    </span>
  </span>
</template>
