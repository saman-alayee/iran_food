export default defineNuxtPlugin(() => {
  const { loadSiteContent } = useSiteContent();
  loadSiteContent();
});
