import type { ApiSuccess } from '@meeting-manager/shared';
import { useAuthStore, type AuthUser } from '~/stores/auth';

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const { request } = useApi();

  authStore.loadFromCookies();

  if (!authStore.accessToken) {
    authStore.setInitialized();
    return;
  }

  try {
    const data = await request<ApiSuccess<{ user: AuthUser }>>('/auth/me');
    if (data.success) {
      authStore.setUser(data.data.user);
    }
  } catch {
    authStore.clearAuth();
  }

  authStore.setInitialized();
});
