<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth',
});

useSeoMeta({
  title: 'پنل مدیریت | Iran Food',
  robots: 'noindex, nofollow',
});

type UploadItem = {
  _id: string;
  name: string;
  phone?: string;
  path: string;
  originalName: string;
  createdAt: string;
};

const { apiFetch, apiBase } = useApi();
const { token, admin, loadToken, clearSession } = useAuth();

const items = ref<UploadItem[]>([]);
const loading = ref(true);
const error = ref('');
const deletingId = ref<string | null>(null);

function imageUrl(path: string) {
  return `${apiBase}/${path.replace(/^\/+/, '')}`;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

async function fetchUploads() {
  loading.value = true;
  error.value = '';
  try {
    loadToken();
    const res = await apiFetch<{
      success: boolean;
      data: { items: UploadItem[] };
    }>('/api/uploads?limit=100', {
      token: token.value,
    });
    items.value = res.data.items;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'خطا در دریافت داده‌ها';
    if (String(error.value).includes('احراز') || String(error.value).includes('توکن')) {
      clearSession();
      await navigateTo('/admin/login');
    }
  } finally {
    loading.value = false;
  }
}

async function removeItem(id: string) {
  if (!confirm('آیا از حذف این رکورد و تصویر مطمئن هستید؟')) return;
  deletingId.value = id;
  try {
    await apiFetch(`/api/uploads/${id}`, {
      method: 'DELETE',
      token: token.value,
    });
    items.value = items.value.filter((item) => item._id !== id);
  } catch (err) {
    alert(err instanceof Error ? err.message : 'حذف ناموفق بود');
  } finally {
    deletingId.value = null;
  }
}

function logout() {
  clearSession();
  navigateTo('/admin/login');
}

onMounted(fetchUploads);
</script>

<template>
  <div class="min-h-screen bg-brand-cream">
    <header class="border-b border-brand-line bg-white">
      <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-extrabold text-brand-green">پنل مدیریت</h1>
          <p class="truncate text-xs text-slate-500">{{ admin?.email || 'Admin' }}</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <NuxtLink
            to="/"
            class="rounded-full border border-brand-line px-4 py-2.5 text-center text-sm"
          >
            صفحه اصلی
          </NuxtLink>
          <button type="button" class="btn-orange !py-2.5" @click="logout">خروج</button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-base font-bold text-slate-800">تصاویر آپلود شده</h2>
        <button type="button" class="btn-green !py-2 text-xs" @click="fetchUploads">
          بروزرسانی
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-500">در حال بارگذاری...</p>
      <p v-else-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ error }}
      </p>
      <p v-else-if="!items.length" class="text-sm text-slate-500">هنوز تصویری ثبت نشده است.</p>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in items"
          :key="item._id"
          class="overflow-hidden rounded-3xl border border-brand-line bg-white shadow-soft"
        >
          <a :href="imageUrl(item.path)" target="_blank" rel="noopener noreferrer">
            <img
              :src="imageUrl(item.path)"
              :alt="`تصویر آپلود شده توسط ${item.name}`"
              width="640"
              height="360"
              loading="lazy"
              decoding="async"
              class="h-44 w-full object-cover"
            />
          </a>
          <div class="space-y-2 p-4 text-sm">
            <p>
              <span class="font-semibold text-slate-500">نام:</span>
              {{ item.name }}
            </p>
            <p v-if="item.phone">
              <span class="font-semibold text-slate-500">تماس:</span>
              {{ item.phone }}
            </p>
            <p>
              <span class="font-semibold text-slate-500">تاریخ:</span>
              {{ formatDate(item.createdAt) }}
            </p>
            <button
              type="button"
              class="mt-2 w-full rounded-full bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              :disabled="deletingId === item._id"
              @click="removeItem(item._id)"
            >
              {{ deletingId === item._id ? 'در حال حذف...' : 'حذف رکورد و تصویر' }}
            </button>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>
