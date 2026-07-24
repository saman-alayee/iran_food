<script setup lang="ts">
const { siteContent } = useSiteContent();
</script>

<template>
  <section id="apps" class="section-shell pb-10 sm:pb-12">
    <h2 class="section-title mb-6 sm:mb-8">
      {{ siteContent.appsTitle }}
    </h2>

    <div class="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      <article
        v-for="app in siteContent.apps"
        :key="app.title"
        class="card-soft flex items-start gap-3 border border-brand-line/60 px-4 py-3.5 sm:items-center sm:gap-4 sm:px-5 sm:py-4"
      >
        <span
          class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-green-light text-brand-green sm:h-12 sm:w-12"
        >
          <svg v-if="app.icon === 'health'" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg v-else-if="app.icon === 'benchmark'" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17h2v-7H3v7zm4 0h2V7H7v10zm4 0h2v-4h-2v4zm4 0h2V4h-2v13zm4 0h2v-9h-2v9z" />
          </svg>
          <svg v-else-if="app.icon === 'api'" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h2v10H7zm4-3h2v16h-2zm4 6h2v7h-2z" />
          </svg>
          <svg v-else-if="app.icon === 'lifestyle'" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C8.5 2 6 4.5 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.5-2.5-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
            />
            <path d="M4 20h16v2H4v-2z" opacity="0.35" />
          </svg>
          <svg v-else-if="app.icon === 'ai'" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 0 6h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1 0-6h1V6a4 4 0 0 1 4-4zm-1 8H8a1 1 0 0 0 0 2h3v2a2 2 0 1 0 4 0v-2h3a1 1 0 0 0 0-2h-3V8a2 2 0 1 0-4 0v2z" />
          </svg>
          <svg v-else-if="app.icon === 'app'" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 18H7V5h10v14z" />
          </svg>
          <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
          </svg>
        </span>
        <h3 class="min-w-0 text-sm font-bold leading-6 text-slate-800">{{ app.title }}</h3>
      </article>
    </div>
  </section>
</template>
