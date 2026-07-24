export default defineNuxtPlugin(() => {
  const { loadContent } = useSiteContent();
  loadContent();
});
