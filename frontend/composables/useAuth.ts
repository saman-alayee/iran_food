const TOKEN_KEY = 'iranfood_admin_token';

export function useAuth() {
  const token = useState<string | null>('admin-token', () => null);
  const admin = useState<{ id: string; name: string; email: string } | null>(
    'admin-user',
    () => null
  );

  function loadToken() {
    if (import.meta.client && !token.value) {
      token.value = localStorage.getItem(TOKEN_KEY);
    }
    return token.value;
  }

  function setSession(newToken: string, user: { id: string; name: string; email: string }) {
    token.value = newToken;
    admin.value = user;
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, newToken);
    }
  }

  function clearSession() {
    token.value = null;
    admin.value = null;
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  return {
    token,
    admin,
    loadToken,
    setSession,
    clearSession,
  };
}
