<script setup lang="ts">
const { siteContent } = useSiteContent();
const emit = defineEmits<{ openUpload: [] }>();

const menuOpen = ref(false);

function closeMenu() {
  menuOpen.value = false;
}

function openUpload() {
  closeMenu();
  emit('openUpload');
}

function navTo(href: string, e: MouseEvent) {
  onNavClick(href, e);
  closeMenu();
}
watch(
  () => menuOpen.value,
  (open) => {
    if (import.meta.client) {
      document.body.style.overflow = open ? 'hidden' : '';
    }
  }
);

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-brand-green shadow-nav">
    <nav
      class="section-shell flex items-center justify-between gap-3 py-3 sm:py-3.5"
      aria-label="منوی اصلی"
    >
      <a
        href="#home"
        class="shrink-0 text-white"
        @click="closeMenu"
      >
        <LandingBrandLogo />
      </a>

      <ul
        class="hidden flex-1 items-center justify-center gap-4 text-xs font-medium text-white/95 lg:flex xl:gap-6 xl:text-sm"
      >
        <li v-for="item in siteContent.nav" :key="item.href">
          <a :href="item.href" class="whitespace-nowrap transition hover:text-white" @click="navTo(item.href, $event)">
            {{ item.label }}
          </a>
        </li>
      </ul>

      <div class="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <a
          href="#about"
          class="hidden h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:grid"
          aria-label="درباره ما"
          @click="navTo('#about', $event)"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c4 3.2 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7.8 6-11z" />
          </svg>
        </a>
        <div class="hidden items-center gap-1 text-white/90 md:flex">
          <a
            v-if="siteContent.contact.instagram"
            :href="siteContent.contact.instagram"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/15"
            aria-label="اینستاگرام"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
              />
            </svg>
          </a>
          <a
            v-if="siteContent.contact.telegram"
            :href="siteContent.contact.telegram"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/15"
            aria-label="تلگرام"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M9.04 15.3 8.9 19.2c.4 0 .57-.17.78-.37l1.87-1.8 3.88 2.85c.71.39 1.22.19 1.41-.66l2.56-12.03c.23-1.03-.37-1.43-1.07-1.18L4.3 10.3c-1 .39-.98.95-.17 1.2l4.1 1.28 9.52-6c.45-.27.86-.12.52.15"
              />
            </svg>
          </a>
          <a
            v-if="siteContent.contact.linkedin"
            :href="siteContent.contact.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/15"
            aria-label="لینکدین"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M6.5 8.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zM4.75 20.25V9.5H8.25v10.75H4.75zM10 9.5h3.38v1.45h.05c.47-.88 1.62-1.8 3.34-1.8 3.57 0 4.23 2.35 4.23 5.41v5.69H17.5v-5.05c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.31-1.93 2.66v5.13H10V9.5z"
              />
            </svg>
          </a>
          <a
            :href="`mailto:${siteContent.contact.email}`"
            class="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/15"
            aria-label="ایمیل"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
              />
            </svg>
          </a>
        </div>

        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-full text-white lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          aria-label="منو"
          @click="menuOpen = !menuOpen"
        >
          <svg v-if="!menuOpen" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
          </svg>
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6L17.6 19l1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6 6.4 5z" />
          </svg>
        </button>
      </div>
    </nav>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="menuOpen" id="mobile-menu" class="border-t border-white/10 bg-brand-green lg:hidden">
        <ul class="section-shell divide-y divide-white/10 py-1">
          <li v-for="item in siteContent.nav" :key="`m-${item.href}`">
            <a
              :href="item.href"
              class="block py-3.5 text-sm font-medium text-white"
              @click="navTo(item.href, $event)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
        <div class="section-shell flex gap-2 border-t border-white/10 py-3">
          <button type="button" class="btn-orange flex-1 text-xs" @click="openUpload">
            {{ siteContent.uploadButtonLabel }}
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>
