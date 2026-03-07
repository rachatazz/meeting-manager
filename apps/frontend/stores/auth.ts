import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
  },

  actions: {
    setAuth(user: User, accessToken: string, refreshToken: string) {
      this.user = user;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },

    clearAuth() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
    },
  },
});
