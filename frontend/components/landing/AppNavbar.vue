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
  <header class="section-shell sticky top-0 z-40 bg-brand-cream/95 pt-3 backdrop-blur-sm sm:pt-4">
    <nav
      class="flex items-center justify-between gap-2 rounded-2xl bg-brand-green px-3 py-2 text-white shadow-nav sm:gap-3 sm:rounded-pill sm:px-4 sm:py-2.5 lg:px-5"
      aria-label="منوی اصلی"
    >
      <a
        href="#home"
        class="flex min-w-0 shrink-0 items-center gap-2 rounded-xl bg-white/95 px-2 py-1 transition hover:bg-white"
        @click="closeMenu"
      >
        <img
          src="/images/iran-food-logo.png"
          alt="Iran Food"
          width="140"
          height="48"
          class="h-7 w-auto max-w-[120px] shrink-0 object-contain sm:h-8 sm:max-w-[132px]"
        />
      </a>

      <ul
        class="hidden flex-1 items-center justify-center gap-3 px-2 text-xs font-medium lg:flex xl:gap-5 xl:text-sm"
      >
        <li v-for="item in siteContent.nav" :key="item.href">
          <a :href="item.href" class="whitespace-nowrap transition hover:text-white/85">
            {{ item.label }}
          </a>
        </li>
      </ul>

      <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div class="hidden items-center gap-1.5 text-white/90 md:flex">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="اینستاگرام"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
              />
            </svg>
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="تلگرام"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M9.04 15.3 8.9 19.2c.4 0 .57-.17.78-.37l1.87-1.8 3.88 2.85c.71.39 1.22.19 1.41-.66l2.56-12.03c.23-1.03-.37-1.43-1.07-1.18L4.3 10.3c-1 .39-.98.95-.17 1.2l4.1 1.28 9.52-6c.45-.27.86-.12.52.15"
              />
            </svg>
          </a>
          <a
            :href="`mailto:${siteContent.contact.email}`"
            class="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="ایمیل"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
              />
            </svg>
          </a>
        </div>

        <button
          type="button"
          class="btn-orange !min-h-9 !px-3 !py-1.5 text-xs lg:!px-4"
          @click="openUpload"
        >
          <span class="hidden sm:inline">آپلود عکس</span>
          <span class="sm:hidden">آپلود</span>
        </button>

        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-full bg-white/10 lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          aria-label="باز کردن منو"
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
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="menuOpen"
        id="mobile-menu"
        class="mt-2 overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft lg:hidden"
      >
        <ul class="divide-y divide-brand-line/60">
          <li v-for="item in siteContent.nav" :key="`m-${item.href}`">
            <a
              :href="item.href"
              class="block px-4 py-3.5 text-sm font-medium text-brand-green"
              @click="closeMenu"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
        <div class="flex gap-2 border-t border-brand-line/60 p-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-10 w-10 place-items-center rounded-full bg-brand-green-light text-brand-green"
            aria-label="اینستاگرام"
          >
            IG
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-10 w-10 place-items-center rounded-full bg-brand-green-light text-brand-green"
            aria-label="تلگرام"
          >
            TG
          </a>
          <a
            :href="`mailto:${siteContent.contact.email}`"
            class="grid h-10 w-10 place-items-center rounded-full bg-brand-green-light text-brand-green"
            aria-label="ایمیل"
          >
            @
          </a>
        </div>
      </div>
    </Transition>
  </header>
</template>
