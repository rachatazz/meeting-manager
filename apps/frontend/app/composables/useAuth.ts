import { useAuthStore, type AuthUser } from '~/stores/auth';
import type { ApiSuccess } from '@meeting-manager/shared';

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function useAuth() {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const router = useRouter();
  const { request } = useApi();

  const baseUrl = config.public.apiUrl as string;

  async function handleAuthSuccess(data: ApiSuccess<AuthResponse>) {
    const { user, accessToken, refreshToken } = data.data;
    authStore.setAuth(user, accessToken, refreshToken);
    await router.push('/dashboard');
  }

  async function login(email: string, password: string) {
    const data = await $fetch<ApiSuccess<AuthResponse>>(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { email, password },
    });
    await handleAuthSuccess(data);
  }

  async function register(fullName: string, email: string, password: string, role: string) {
    const data = await $fetch<ApiSuccess<AuthResponse>>(`${baseUrl}/auth/register`, {
      method: 'POST',
      body: { fullName, email, password, role },
    });
    await handleAuthSuccess(data);
  }

  async function registerGuest(fullName: string) {
    const fingerprint = getOrCreateFingerprint();
    const data = await $fetch<ApiSuccess<AuthResponse>>(`${baseUrl}/auth/register/guest`, {
      method: 'POST',
      body: { fullName, fingerprint },
    });
    await handleAuthSuccess(data);
  }

  async function loginGuest(fingerprint: string) {
    const data = await $fetch<ApiSuccess<AuthResponse>>(`${baseUrl}/auth/login/guest`, {
      method: 'POST',
      body: { fingerprint },
    });
    await handleAuthSuccess(data);
    return true;
  }

  async function logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // Logout should always clear local state regardless of API result
    }
    authStore.clearAuth();
    await router.push('/auth/login');
  }

  async function getMe(): Promise<AuthUser | null> {
    try {
      const data = await request<ApiSuccess<{ user: AuthUser }>>('/auth/me');
      if (data.success) {
        authStore.setUser(data.data.user);
        return data.data.user;
      }
    } catch {
      // Silently fail — caller can check null return
    }
    return null;
  }

  function getOrCreateFingerprint(): string {
    if (!import.meta.client) return '';
    let fp = localStorage.getItem('guest_fingerprint');
    if (!fp) {
      fp = crypto.randomUUID();
      localStorage.setItem('guest_fingerprint', fp);
    }
    return fp;
  }

  function getStoredFingerprint(): string | null {
    if (!import.meta.client) return null;
    return localStorage.getItem('guest_fingerprint');
  }

  return {
    login,
    register,
    registerGuest,
    loginGuest,
    logout,
    getMe,
    getOrCreateFingerprint,
    getStoredFingerprint,
  };
}
