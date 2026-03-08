import { useAuthStore } from '~/stores/auth';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/register-guest', '/'];

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (import.meta.server) {
    // On server, plugin hasn't run — check cookie existence as a hint
    const token = useCookie('auth_access_token');
    if (!token.value && !PUBLIC_ROUTES.includes(to.path)) {
      return navigateTo('/auth/login');
    }
    if (token.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
      return navigateTo('/dashboard');
    }
    return;
  }

  // On client, wait for auth plugin to finish validating tokens
  if (!authStore.initialized) return;

  if (!authStore.isAuthenticated && !PUBLIC_ROUTES.includes(to.path)) {
    return navigateTo('/auth/login');
  }

  if (authStore.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/dashboard');
  }
});
