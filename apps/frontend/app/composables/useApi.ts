import type { ApiError, ApiSuccess } from '@meeting-manager/shared';
import { useAuthStore } from '~/stores/auth';

let refreshPromise: Promise<string | null> | null = null;

export interface ApiErrorResponse {
  status?: number;
  data?: ApiError;
}

function isApiError(err: unknown): err is ApiErrorResponse {
  return typeof err === 'object' && err !== null && 'status' in err;
}

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();

  const baseUrl = config.public.apiUrl as string;

  async function refreshAccessToken(): Promise<string | null> {
    if (!authStore.refreshToken) return null;

    if (refreshPromise) return refreshPromise;

    refreshPromise = $fetch<ApiSuccess<{ accessToken: string }>>(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      body: { refreshToken: authStore.refreshToken },
    })
      .then((res) => {
        if (res.success) {
          authStore.setAccessToken(res.data.accessToken);
          return res.data.accessToken;
        }
        return null;
      })
      .catch(() => {
        authStore.clearAuth();
        router.push('/auth/login');
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  }

  function buildHeaders(options: Parameters<typeof $fetch>[1] = {}): Record<string, string> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };
    if (authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`;
    }
    return headers;
  }

  async function request<T>(path: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    try {
      return await $fetch<T>(`${baseUrl}${path}`, {
        ...options,
        headers: buildHeaders(options),
      });
    } catch (err: unknown) {
      if (isApiError(err) && err.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await $fetch<T>(`${baseUrl}${path}`, {
            ...options,
            headers: {
              ...(options.headers as Record<string, string>),
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }
      throw err;
    }
  }

  return { request };
}
