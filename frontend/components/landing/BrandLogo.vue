<script setup lang="ts">
import { assetUrl } from '~/composables/useSiteContent';

const { siteContent } = useSiteContent();
const { apiBase } = useApi();

withDefaults(
  defineProps<{
    size?: 'sm' | 'md';
    showName?: boolean;
    light?: boolean;
    framed?: boolean;
  }>(),
  { size: 'md', showName: false, light: true, framed: false }
);

const logoSrc = computed(() => {
  const data = siteContent.value as { siteLogo?: string; images?: { logo?: string } };
  const path = data.siteLogo || data.images?.logo || '/images/iran-food-logo.png';
  return assetUrl(path, apiBase);
});
</script>

<template>
  <span class="inline-flex min-w-0 items-center gap-2.5">
    <span
      class="inline-flex shrink-0 items-center justify-center"
      :class="
        framed
          ? size === 'sm'
            ? 'rounded-lg bg-white px-2 py-1 shadow-sm ring-1 ring-black/5'
            : 'rounded-lg bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-black/5'
          : ''
      "
    >
      <img
        :src="logoSrc"
        :alt="siteContent.brand || 'Iran Food Dataset'"
        class="shrink-0 object-contain object-left"
        :class="
          size === 'sm'
            ? 'h-8 w-auto max-w-[128px] sm:h-9 sm:max-w-[144px]'
            : 'h-9 w-auto max-w-[148px] sm:h-10 sm:max-w-[168px]'
        "
        width="180"
        height="48"
        loading="eager"
        decoding="async"
      />
    </span>
    <span
      v-if="showName"
      class="truncate font-extrabold"
      :class="[size === 'sm' ? 'text-sm' : 'text-sm sm:text-base', light ? 'text-white' : 'text-brand-green']"
    >
      {{ siteContent.brand || 'Iran Food' }}
    </span>
  </span>
</template>
