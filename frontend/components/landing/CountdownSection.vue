<script setup lang="ts">
const { siteContent, mediaUrl } = useSiteContent();

const target = computed(() => {
  if (siteContent.value.countdownTarget) {
    const parsed = new Date(siteContent.value.countdownTarget);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 45);
  fallback.setHours(fallback.getHours() + 12);
  return fallback;
});

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

const remaining = computed(() => {
  const diff = Math.max(0, target.value.getTime() - now.value);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return { days, hours };
});

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 60_000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section class="section-shell pb-8 sm:pb-10">
    <div
      class="card-soft grid items-stretch gap-4 overflow-hidden p-4 sm:gap-6 sm:p-6 md:grid-cols-2 lg:grid-cols-[minmax(180px,220px)_1fr_minmax(220px,280px)]"
    >
      <div class="overflow-hidden rounded-2xl md:row-span-1 lg:row-auto">
        <img
          :src="mediaUrl(siteContent.images.countdownHero)"
          alt="زن جوان با بشقاب غذای ایرانی — ایران فود"
          width="640"
          height="480"
          loading="lazy"
          decoding="async"
          class="h-44 w-full object-cover object-[center_20%] sm:h-52 md:h-full md:min-h-[220px]"
        />
      </div>

      <div class="text-center md:text-right lg:px-2">
        <h2 class="text-base font-bold leading-7 text-brand-green sm:text-lg lg:text-xl">
          {{ siteContent.countdownTitle }}
        </h2>
        <ul class="mt-3 space-y-2 text-sm text-slate-600 sm:mt-4">
          <li
            v-for="(item, idx) in siteContent.countdownItems"
            :key="`${idx}-${item}`"
            class="flex items-start justify-center gap-2 md:justify-start"
          >
            <span
              class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-green-light text-[10px] font-bold text-brand-green"
            >
              {{ idx + 1 }}
            </span>
            <span class="text-right leading-6">{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col items-center justify-center md:col-span-2 lg:col-span-1">
        <p class="mb-4 text-center text-sm font-bold text-brand-green sm:text-base">
          زمان باقی‌مانده تا انتشار
        </p>
        <div class="flex items-center justify-center gap-3 sm:gap-4">
          <div
            class="flex min-w-[104px] flex-col items-center rounded-3xl bg-brand-green px-6 py-5 shadow-md sm:min-w-[120px] sm:px-7 sm:py-6"
          >
            <span class="text-5xl font-extrabold leading-none text-white sm:text-6xl">
              {{ remaining.hours }}
            </span>
            <span class="mt-2 text-base font-bold text-white/95 sm:text-lg">ساعت</span>
          </div>

          <span class="pb-6 text-4xl font-extrabold leading-none text-brand-green sm:text-5xl" aria-hidden="true">
            :
          </span>

          <div
            class="flex min-w-[104px] flex-col items-center rounded-3xl bg-brand-green px-6 py-5 shadow-md sm:min-w-[120px] sm:px-7 sm:py-6"
          >
            <span class="text-5xl font-extrabold leading-none text-white sm:text-6xl">
              {{ remaining.days }}
            </span>
            <span class="mt-2 text-base font-bold text-white/95 sm:text-lg">روز</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
