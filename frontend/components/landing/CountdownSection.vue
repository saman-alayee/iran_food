<script setup lang="ts">
import {
  assetUrl,
  computeCountdownRemaining,
  parseCountdownTarget,
} from '~/composables/useSiteContent';

const { siteContent } = useSiteContent();
const { apiBase } = useApi();

const countdownImageUrl = computed(() =>
  assetUrl(siteContent.value.countdownImage || '/images/project/team-collaboration.png', apiBase)
);

const now = ref(Date.now());
const ready = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const target = computed(() => parseCountdownTarget(siteContent.value.countdownTargetDate));
const hasValidTarget = computed(() => !!target.value);

const remaining = computed(() => {
  if (!target.value) {
    return { days: 0, hours: 0, minutes: 0, expired: false };
  }
  return computeCountdownRemaining(target.value, now.value);
});

onMounted(() => {
  ready.value = true;
  now.value = Date.now();
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section id="about" class="section-shell pb-8 sm:pb-10">
    <div
      class="card-soft grid overflow-hidden border border-brand-line/50 md:grid-cols-[minmax(0,240px)_1fr_minmax(0,200px)] md:items-stretch"
    >
      <div class="overflow-hidden md:min-h-[240px]">
        <img
          :src="countdownImageUrl"
          alt="مشارکت در پروژه ایران فود"
          width="480"
          height="480"
          loading="lazy"
          decoding="async"
          class="h-48 w-full object-cover object-top md:h-full md:min-h-[240px]"
        />
      </div>

      <div class="border-y border-brand-line/40 p-5 md:border-y-0 md:border-x md:p-6">
        <h2 class="text-base font-extrabold leading-8 text-brand-green sm:text-lg">
          {{ siteContent.countdownTitle }}
        </h2>
        <ul class="mt-4 space-y-2.5">
          <li
            v-for="(item, idx) in siteContent.countdownItems"
            :key="item"
            class="flex items-start gap-2.5 text-sm leading-7 text-slate-600"
          >
            <span
              class="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-green text-[10px] font-bold text-white"
            >
              {{ idx + 1 }}
            </span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col items-center justify-center bg-brand-green px-4 py-6 text-white">
        <p class="text-xs font-medium text-white/85">
          {{ siteContent.countdownTimerLabel }}
        </p>
        <p v-if="!ready" class="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl" aria-hidden="true">
          — —
        </p>
        <p v-else-if="!hasValidTarget" class="mt-3 text-center text-sm font-semibold leading-7 text-white/90">
          تاریخ انتشار به‌زودی اعلام می‌شود
        </p>
        <p v-else-if="remaining.expired" class="mt-3 text-xl font-extrabold sm:text-2xl">
          منتشر شد!
        </p>
        <p v-else class="mt-3 text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">
          {{ remaining.days }}
          <span class="text-base font-semibold">روز</span>
          <span class="mx-1 text-white/70">:</span>
          {{ remaining.hours }}
          <span class="text-base font-semibold">ساعت</span>
        </p>
      </div>
    </div>
  </section>
</template>
