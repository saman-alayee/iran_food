<script setup lang="ts">
import { assetUrl, useSiteContent } from '~/composables/useSiteContent';

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: 'ورود ادمین | Iran Food',
  description: 'ورود به پنل مدیریت Iran Food',
  robots: 'noindex, nofollow',
});

const { apiFetch, apiBase } = useApi();
const { setSession, loadToken } = useAuth();
const { siteContent, loadSiteContent } = useSiteContent();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const loginLogoSrc = computed(() => {
  const data = siteContent.value as { loginLogo?: string; siteLogo?: string };
  const path = data.loginLogo || data.siteLogo || '/images/iran-food-logo.png';
  return assetUrl(path, apiBase);
});

onMounted(async () => {
  await loadSiteContent();
  if (loadToken()) {
    navigateTo('/admin');
  }
});

async function submit() {
  error.value = '';
  if (!email.value.trim() || !password.value) {
    error.value = 'ایمیل و رمز عبور را وارد کنید.';
    return;
  }

  loading.value = true;
  try {
    const res = await apiFetch<{
      success: boolean;
      data: {
        token: string;
        admin: { id: string; name: string; email: string };
      };
    }>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value.trim(),
        password: password.value,
      },
    });

    setSession(res.data.token, res.data.admin);
    await navigateTo('/admin');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ورود ناموفق بود.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-brand-cream px-4 py-6">
    <form
      class="w-full max-w-md rounded-2xl bg-white p-5 shadow-soft sm:rounded-3xl sm:p-8"
      @submit.prevent="submit"
    >
      <div class="mb-4 flex justify-center">
        <img
          :src="loginLogoSrc"
          alt="Iran Food Dataset"
          class="h-12 w-auto max-w-[220px] object-contain sm:h-14 sm:max-w-[260px]"
          width="260"
          height="72"
        />
      </div>
      <h1 class="text-center text-xl font-extrabold text-brand-green">ورود ادمین</h1>
      <p class="mt-2 text-center text-sm text-slate-500">پنل مدیریت Iran Food</p>

      <div class="mt-6 space-y-4">
        <div>
          <label for="email" class="mb-1.5 block text-sm font-semibold">ایمیل</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="username"
            class="w-full rounded-xl border border-brand-line bg-brand-cream px-3 py-2.5 text-sm outline-none focus:border-brand-green"
          />
        </div>
        <div>
          <label for="password" class="mb-1.5 block text-sm font-semibold">رمز عبور</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-xl border border-brand-line bg-brand-cream px-3 py-2.5 text-sm outline-none focus:border-brand-green"
          />
        </div>
      </div>

      <p v-if="error" class="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ error }}
      </p>

      <button type="submit" class="btn-green mt-6 w-full" :disabled="loading">
        {{ loading ? 'در حال ورود...' : 'ورود' }}
      </button>

      <NuxtLink to="/" class="mt-4 block text-center text-sm text-brand-green hover:underline">
        بازگشت به صفحه اصلی
      </NuxtLink>
    </form>
  </div>
</template>
