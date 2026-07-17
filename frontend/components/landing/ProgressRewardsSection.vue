<script setup lang="ts">
import { siteContent } from '~/composables/useSiteContent';

const statusMap: Record<string, { label: string; class: string }> = {
  done: { label: 'انجام شده', class: 'bg-emerald-100 text-emerald-700' },
  progress: { label: 'در حال انجام', class: 'bg-amber-100 text-amber-700' },
  pending: { label: 'در انتظار', class: 'bg-slate-100 text-slate-600' },
};
</script>

<template>
  <section id="rewards" class="section-shell pb-10 sm:pb-12">
    <div class="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <div class="card-soft border border-brand-line/60 p-4 sm:p-6">
        <h2 class="mb-4 text-base font-extrabold text-brand-green sm:mb-5 sm:text-lg">
          {{ siteContent.progressTitle }}
        </h2>

        <ul class="space-y-2.5 sm:space-y-3">
          <li
            v-for="(step, idx) in siteContent.progressSteps"
            :key="step.title"
            class="flex flex-col gap-2 rounded-2xl bg-brand-cream px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-2.5"
          >
            <div class="flex min-w-0 items-start gap-3 sm:items-center">
              <span
                class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-green text-xs font-bold text-white"
              >
                {{ idx + 1 }}
              </span>
              <span class="min-w-0 text-sm font-medium leading-6 text-slate-700">
                {{ step.title }}
              </span>
            </div>
            <span
              class="self-start rounded-full px-2.5 py-1 text-[11px] font-semibold sm:shrink-0 sm:self-auto"
              :class="statusMap[step.status].class"
            >
              {{ statusMap[step.status].label }}
            </span>
          </li>
        </ul>

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
