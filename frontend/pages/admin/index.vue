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

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

const PAGE_SIZE = 12;

const { apiFetch, apiBase } = useApi();
const { token, admin, loadToken, clearSession } = useAuth();

const items = ref<UploadItem[]>([]);
const pagination = ref<Pagination>({
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  pages: 1,
});
const loading = ref(true);
const error = ref('');
const deletingId = ref<string | null>(null);

const pageNumbers = computed(() => {
  const { page, pages } = pagination.value;
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
});

const rangeLabel = computed(() => {
  const { page, limit, total } = pagination.value;
  if (!total) return '۰ مورد';
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return `${start.toLocaleString('fa-IR')} تا ${end.toLocaleString('fa-IR')} از ${total.toLocaleString('fa-IR')} مورد`;
});

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

async function fetchUploads(page = pagination.value.page) {
  loading.value = true;
  error.value = '';
  try {
    loadToken();
    const res = await apiFetch<{
      success: boolean;
      data: { items: UploadItem[]; pagination: Pagination };
    }>(`/api/uploads?page=${page}&limit=${PAGE_SIZE}`, {
      token: token.value,
    });

    items.value = res.data.items;
    pagination.value = res.data.pagination;

    if (!items.value.length && pagination.value.page > 1) {
      await fetchUploads(pagination.value.page - 1);
    }
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

function goToPage(page: number) {
  if (loading.value || page < 1 || page > pagination.value.pages || page === pagination.value.page) {
    return;
  }
  fetchUploads(page);
}

async function removeItem(id: string) {
  if (!confirm('آیا از حذف این رکورد و تصویر مطمئن هستید؟')) return;
  deletingId.value = id;
  try {
    await apiFetch(`/api/uploads/${id}`, {
      method: 'DELETE',
      token: token.value,
    });
    await fetchUploads(pagination.value.page);
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

onMounted(() => fetchUploads(1));
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
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-800">تصاویر آپلود شده</h2>
          <p v-if="pagination.total" class="mt-1 text-xs text-slate-500">
            {{ rangeLabel }}
          </p>
        </div>
        <button type="button" class="btn-green !py-2 text-xs" @click="fetchUploads(pagination.page)">
          بروزرسانی
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-500">در حال بارگذاری...</p>
      <p v-else-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ error }}
      </p>
      <p v-else-if="!items.length" class="text-sm text-slate-500">هنوز تصویری ثبت نشده است.</p>

      <template v-else>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <nav
          v-if="pagination.pages > 1"
          class="mt-8 flex flex-col items-center gap-3"
          aria-label="صفحه‌بندی تصاویر"
        >
          <div class="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              class="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-green-light disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="pagination.page <= 1 || loading"
              @click="goToPage(pagination.page - 1)"
            >
              قبلی
            </button>

            <button
              v-for="page in pageNumbers"
              :key="page"
              type="button"
              class="grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition"
              :class="
                page === pagination.page
                  ? 'bg-brand-green text-white'
                  : 'border border-brand-line bg-white text-slate-700 hover:bg-brand-green-light'
              "
              :disabled="loading"
              @click="goToPage(page)"
            >
              {{ page.toLocaleString('fa-IR') }}
            </button>

            <button
              type="button"
              class="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-green-light disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="pagination.page >= pagination.pages || loading"
              @click="goToPage(pagination.page + 1)"
            >
              بعدی
            </button>
          </div>

          <p class="text-xs text-slate-500">
            صفحه {{ pagination.page.toLocaleString('fa-IR') }} از
            {{ pagination.pages.toLocaleString('fa-IR') }}
          </p>
        </nav>
      </template>
    </main>
  </div>
</template>
