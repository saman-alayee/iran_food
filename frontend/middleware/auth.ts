export default defineNuxtRouteMiddleware(() => {
  const { loadToken } = useAuth();
  const token = loadToken();
  if (!token) {
    return navigateTo('/admin/login');
  }
});
