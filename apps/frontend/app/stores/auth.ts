import { defineStore } from 'pinia';
import type { UserRole } from '@meeting-manager/shared';

export interface AuthUser {
  id: string;
  email?: string | null;
  fullName: string;
  role: UserRole;
  userType: 'user' | 'guest';
}

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 7,
  sameSite: 'lax' as const,
  path: '/',
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const initialized = ref(false);

  const accessTokenCookie = useCookie<string | null>('auth_access_token', COOKIE_OPTIONS);
  const refreshTokenCookie = useCookie<string | null>('auth_refresh_token', COOKIE_OPTIONS);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const isGuest = computed(() => user.value?.userType === 'guest');

  function setAuth(authUser: AuthUser, newAccessToken: string, newRefreshToken: string) {
    user.value = authUser;
    accessToken.value = newAccessToken;
    refreshToken.value = newRefreshToken;
    accessTokenCookie.value = newAccessToken;
    refreshTokenCookie.value = newRefreshToken;
  }

  function setUser(authUser: AuthUser) {
    user.value = authUser;
  }

  function setAccessToken(newAccessToken: string) {
    accessToken.value = newAccessToken;
    accessTokenCookie.value = newAccessToken;
  }

  function clearAuth() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
  }

  function loadFromCookies() {
    accessToken.value = accessTokenCookie.value ?? null;
    refreshToken.value = refreshTokenCookie.value ?? null;
  }

  function setInitialized() {
    initialized.value = true;
  }

  return {
    user,
    accessToken,
    refreshToken,
    initialized,
    isAuthenticated,
    isGuest,
    setAuth,
    setUser,
    setAccessToken,
    clearAuth,
    loadFromCookies,
    setInitialized,
  };
});
