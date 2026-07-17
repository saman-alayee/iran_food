<script setup lang="ts">
import { siteContent } from '~/composables/useSiteContent';

const target = new Date();
target.setDate(target.getDate() + 45);
target.setHours(target.getHours() + 12);

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

const remaining = computed(() => {
  const diff = Math.max(0, target.getTime() - now.value);
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
      class="card-soft grid items-stretch gap-4 overflow-hidden p-4 sm:gap-6 sm:p-6 md:grid-cols-2 lg:grid-cols-[minmax(180px,220px)_1fr_minmax(180px,220px)]"
    >
      <div class="overflow-hidden rounded-2xl md:row-span-1 lg:row-auto">
        <img
          src="/images/foods/kuku-sabzi.png"
          alt="کوکو سبزی — نمونه غذای ایرانی"
          width="440"
          height="440"
          loading="lazy"
          decoding="async"
          class="h-44 w-full object-cover sm:h-52 md:h-full md:min-h-[220px]"
        />
      </div>

      <div class="text-center md:text-right lg:px-2">
        <h2 class="text-base font-bold leading-7 text-brand-green sm:text-lg lg:text-xl">
          {{ siteContent.countdownTitle }}
        </h2>
        <ul class="mt-3 space-y-2 text-sm text-slate-600 sm:mt-4">
          <li
            v-for="(item, idx) in siteContent.countdownItems"
            :key="item"
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

      <div
        class="rounded-2xl bg-brand-green px-4 py-5 text-center text-white md:col-span-2 lg:col-span-1 lg:py-6"
      >
        <p class="text-xs opacity-80">زمان باقی‌مانده تا انتشار</p>
        <div class="mt-3 flex items-center justify-center gap-6 sm:gap-8 lg:flex-col lg:gap-2">
          <p class="text-3xl font-extrabold leading-none sm:text-4xl">
            {{ remaining.days }}
            <span class="text-base font-semibold">روز</span>
          </p>
          <p class="text-2xl font-bold sm:text-3xl lg:text-xl">
            {{ remaining.hours }}
            <span class="text-sm font-medium">ساعت</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
