export function useBreakpoint() {
  const width = ref(0);

  const update = () => {
    if (import.meta.client) {
      width.value = window.innerWidth;
    }
  };

  onMounted(() => {
    update();
    window.addEventListener('resize', update, { passive: true });
  });

  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', update);
    }
  });

  const isMobile = computed(() => width.value > 0 && width.value < 640);
  const isTablet = computed(() => width.value >= 640 && width.value < 1024);
  const isDesktop = computed(() => width.value >= 1024);

  return { width, isMobile, isTablet, isDesktop };
}
