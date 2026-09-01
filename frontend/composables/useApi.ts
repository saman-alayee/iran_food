export function useApi() {
  const config = useRuntimeConfig();
  const base = config.public.apiBase as string;

  async function apiFetch<T>(
    path: string,
    options: {
      method?: string;
      body?: BodyInit | Record<string, unknown> | null;
      token?: string | null;
      formData?: FormData;
    } = {}
  ): Promise<T> {
    const headers: Record<string, string> = {};

    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const isForm = !!options.formData;
    if (!isForm && options.body && typeof options.body === 'object') {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${base}${path}`, {
      method: options.method || 'GET',
      headers,
      body: isForm
        ? options.formData
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.message || 'خطا در ارتباط با سرور';
      if (res.status === 401 && import.meta.client) {
        const { clearSession } = useAuth();
        clearSession();
      }
      throw new Error(message);
    }
    return data as T;
  }

  return { apiFetch, apiBase: base };
}
