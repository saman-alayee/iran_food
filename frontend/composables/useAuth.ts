const TOKEN_KEY = 'iranfood_admin_token';
const ADMIN_KEY = 'iranfood_admin_user';

type AdminUser = { id: string; name: string; email: string };

export function useAuth() {
  const token = useState<string | null>('admin-token', () => null);
  const admin = useState<AdminUser | null>('admin-user', () => null);

  function loadToken() {
    if (import.meta.client) {
      token.value = localStorage.getItem(TOKEN_KEY);
      if (!admin.value) {
        const raw = localStorage.getItem(ADMIN_KEY);
        if (raw) {
          try {
            admin.value = JSON.parse(raw) as AdminUser;
          } catch {
            localStorage.removeItem(ADMIN_KEY);
          }
        }
      }
    }
    return token.value;
  }

  function setSession(newToken: string, user: AdminUser) {
    token.value = newToken;
    admin.value = user;
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
    }
  }

  function clearSession() {
    token.value = null;
    admin.value = null;
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
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
