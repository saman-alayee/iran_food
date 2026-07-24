<script setup lang="ts">
const { siteContent } = useSiteContent();

function barColor(status: string) {
  if (status === 'done') return 'bg-brand-green';
  if (status === 'progress') return 'bg-brand-orange';
  return 'bg-slate-300';
}
</script>

<template>
  <section id="rewards" class="section-shell pb-10 sm:pb-12">
    <div class="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <div class="card-soft border border-brand-line/60 p-4 sm:p-6">
        <h2 class="mb-4 text-base font-extrabold text-brand-green sm:mb-5 sm:text-lg">
          {{ siteContent.progressTitle }}
        </h2>

        <div class="mb-5 rounded-2xl bg-brand-cream px-2 py-4 sm:mb-6 sm:px-4 sm:py-5">
          <div class="grid grid-cols-6 gap-1 sm:gap-2">
            <div
              v-for="(step, idx) in siteContent.progressSteps"
              :key="`bar-${step.title}`"
              class="flex min-w-0 flex-col items-center"
            >
              <div class="mb-2 flex h-5 w-full items-center justify-center sm:h-6">
                <span class="text-[10px] font-bold tabular-nums text-slate-700 sm:text-xs">
                  {{ step.value }}٪
                </span>
              </div>

              <div
                class="relative h-24 w-full max-w-10 overflow-hidden rounded-t-lg bg-white ring-1 ring-brand-line/60 sm:h-28 sm:max-w-11 sm:rounded-t-xl"
              >
                <div
                  class="absolute inset-x-0 bottom-0 rounded-t-lg transition-all sm:rounded-t-xl"
                  :class="barColor(step.status)"
                  :style="{ height: `${step.value}%` }"
                />
              </div>

              <div class="mt-2 w-full text-center sm:mt-2.5">
                <span
                  class="mx-auto mb-1 grid h-5 w-5 place-items-center rounded-full bg-brand-green text-[10px] font-bold text-white"
                >
                  {{ idx + 1 }}
                </span>
                <p
                  class="line-clamp-2 text-[9px] leading-4 text-slate-600 sm:text-[10px] sm:leading-5"
                  :title="step.title"
                >
                  {{ step.title }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 space-y-4 sm:mt-6">
          <div v-for="bar in siteContent.progressBars" :key="bar.label">
            <div class="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-slate-600">
              <span class="min-w-0">{{ bar.label }}</span>
              <span class="shrink-0">{{ bar.value }}٪</span>
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-brand-line/70">
              <div
                class="h-full rounded-full bg-brand-green transition-all"
                :style="{ width: `${bar.value}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card-soft border border-brand-line/60 p-4 sm:p-6">
        <h2 class="mb-2 text-base font-extrabold text-brand-green sm:text-lg">
          {{ siteContent.rewardsTitle }}
        </h2>
        <p class="mb-4 text-sm leading-7 text-slate-600 sm:mb-5">
          {{ siteContent.rewardsIntro }}
        </p>

        <div class="grid gap-3 sm:grid-cols-2">
          <article
            v-for="reward in siteContent.rewards"
            :key="reward.title"
            class="rounded-2xl bg-brand-cream p-4"
          >
            <h3 class="text-sm font-bold text-brand-green">{{ reward.title }}</h3>
            <p class="mt-2 text-xs leading-6 text-slate-600">{{ reward.text }}</p>
          </article>
        </div>

        <div class="mt-4 overflow-x-auto rounded-2xl border border-brand-line sm:mt-5">
          <div class="min-w-[280px] bg-brand-green px-4 py-2 text-sm font-bold text-white">
            {{ siteContent.pointsTitle }}
          </div>
          <table class="min-w-[280px] w-full text-sm">
            <tbody>
              <tr
                v-for="(row, idx) in siteContent.points"
                :key="row.action"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-brand-cream'"
              >
                <td class="px-3 py-2.5 text-slate-700 sm:px-4">{{ row.action }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 text-left font-bold text-brand-orange sm:px-4">
                  {{ row.points }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
