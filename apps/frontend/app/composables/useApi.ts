export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  async function request<T>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> {
    const headers: Record<string, string> = {};
    if (authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`;
    }

    return $fetch<T>(`${config.public.apiUrl}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });
  }

  return { request };
}
