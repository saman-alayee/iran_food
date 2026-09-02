<script setup lang="ts">
import type { SiteContent } from '~/composables/useSiteContent';
import {
  computeCountdownRemaining,
  defaultSiteContent,
  fromDatetimeLocalValue,
  normalizeSiteContent,
  parseCountdownTarget,
  toDatetimeLocalValue,
} from '~/composables/useSiteContent';

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useSeoMeta({ title: 'مدیریت محتوا | Iran Food', robots: 'noindex, nofollow' });

const { apiFetch, apiBase } = useApi();
const { token, admin, loadToken, clearSession } = useAuth();

const tabs = [
  { id: 'about', label: 'درباره ما / تایمر' },
  { id: 'why', label: 'چرا ایران فود + کاربردها' },
  { id: 'upload', label: 'آپلود تصویر' },
  { id: 'hero', label: 'Hero / کلاژ عکس' },
  { id: 'progress', label: 'پیشرفت و جوایز' },
  { id: 'events', label: 'رویدادها' },
  { id: 'gallery', label: 'گالری فرآیند' },
  { id: 'general', label: 'عمومی' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const activeTab = ref<TabId>('about');
const content = ref<SiteContent>(structuredClone(defaultSiteContent) as SiteContent);
const loading = ref(true);
const saving = ref(false);
const uploadingField = ref<string | null>(null);
const message = ref('');
const error = ref('');
const countdownLocal = ref('');
const previewNow = ref(Date.now());
let previewTimer: ReturnType<typeof setInterval> | null = null;

const countdownPreview = computed(() => {
  const target = parseCountdownTarget(content.value.countdownTargetDate);
  if (!target) return null;
  return computeCountdownRemaining(target, previewNow.value);
});

const countdownTargetValid = computed(() => !!parseCountdownTarget(content.value.countdownTargetDate));

function syncCountdownLocalFromContent() {
  countdownLocal.value = toDatetimeLocalValue(content.value.countdownTargetDate);
}

function onCountdownLocalChange() {
  content.value.countdownTargetDate = fromDatetimeLocalValue(countdownLocal.value);
}

function setCountdownDaysAhead(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setSeconds(0, 0);
  content.value.countdownTargetDate = date.toISOString();
  countdownLocal.value = toDatetimeLocalValue(content.value.countdownTargetDate);
}

function mediaUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/uploads/')) {
    const root = apiBase.replace(/\/api\/?$/, '');
    return `${root}${path}`;
  }
  return path;
}

async function fetchContent() {
  loading.value = true;
  error.value = '';
  try {
    loadToken();
    const res = await apiFetch<{ success: boolean; data: SiteContent }>('/api/content', {
      token: token.value,
    });
    content.value = normalizeSiteContent(res.data as SiteContent & Record<string, unknown>);
    syncCountdownLocalFromContent();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'خطا در دریافت محتوا';
    if (String(error.value).includes('توکن')) {
      clearSession();
      await navigateTo('/admin/login');
    }
  } finally {
    loading.value = false;
  }
}

async function saveContent() {
  saving.value = true;
  message.value = '';
  error.value = '';

  if (content.value.countdownTargetDate && !parseCountdownTarget(content.value.countdownTargetDate)) {
    error.value = 'تاریخ تایمر نامعتبر است. از تقویم زیر تاریخ را انتخاب کنید.';
    saving.value = false;
    return;
  }

  try {
    loadToken();
    const payload = { ...content.value } as Record<string, unknown>;
    if (payload.countdownTargetDate) {
      payload.countdownTarget = payload.countdownTargetDate;
    }
    if (payload.countdownImage) {
      payload.images = {
        ...(payload.images as object),
        countdownHero: payload.countdownImage,
      };
    }
    if (payload.whyImage) {
      payload.images = {
        ...(payload.images as object),
        whyHero: String(payload.whyImage).replace(/^\//, ''),
      };
    }
    const res = await apiFetch<{ success: boolean; message: string; data: SiteContent }>(
      '/api/content',
      {
        method: 'PUT',
        token: token.value,
        body: { content: payload },
      }
    );
    content.value = normalizeSiteContent(res.data as SiteContent & Record<string, unknown>);
    syncCountdownLocalFromContent();
    message.value = res.message || 'ذخیره شد';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ذخیره ناموفق بود';
    if (String(error.value).includes('توکن')) {
      clearSession();
      await navigateTo('/admin/login');
    }
  } finally {
    saving.value = false;
  }
}

async function uploadImage(field: keyof SiteContent, file: File) {
  uploadingField.value = String(field);
  error.value = '';
  message.value = '';
  try {
    loadToken();
    if (!token.value) {
      clearSession();
      await navigateTo('/admin/login');
      return;
    }
    const form = new FormData();
    form.append('image', file);
    const res = await apiFetch<{ success: boolean; data: { path: string } }>(
      '/api/content/assets',
      {
        method: 'POST',
        token: token.value,
        formData: form,
      }
    );
    (content.value as Record<string, unknown>)[field as string] = res.data.path;
    message.value = 'فایل آپلود شد — برای اعمال نهایی «ذخیره تغییرات» را بزنید';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'آپلود فایل ناموفق بود';
    if (String(error.value).includes('توکن')) {
      clearSession();
      await navigateTo('/admin/login');
    }
  } finally {
    uploadingField.value = null;
  }
}

async function uploadGalleryImage(index: number, file: File) {
  uploadingField.value = `gallery-${index}`;
  error.value = '';
  try {
    loadToken();
    if (!token.value) {
      clearSession();
      await navigateTo('/admin/login');
      return;
    }
    const form = new FormData();
    form.append('image', file);
    const res = await apiFetch<{ success: boolean; data: { path: string } }>(
      '/api/content/assets',
      { method: 'POST', token: token.value, formData: form }
    );
    content.value.processGallery[index].src = res.data.path;
    message.value = 'تصویر گالری آپلود شد — ذخیره تغییرات را بزنید';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'آپلود تصویر ناموفق بود';
    if (String(error.value).includes('توکن')) {
      clearSession();
      await navigateTo('/admin/login');
    }
  } finally {
    uploadingField.value = null;
  }
}

async function uploadEventImage(index: number, file: File) {
  uploadingField.value = `event-${index}`;
  error.value = '';
  try {
    loadToken();
    if (!token.value) {
      clearSession();
      await navigateTo('/admin/login');
      return;
    }
    const form = new FormData();
    form.append('image', file);
    const res = await apiFetch<{ success: boolean; data: { path: string } }>(
      '/api/content/assets',
      { method: 'POST', token: token.value, formData: form }
    );
    content.value.events[index].image = res.data.path;
    message.value = 'تصویر رویداد آپلود شد — ذخیره تغییرات را بزنید';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'آپلود تصویر ناموفق بود';
    if (String(error.value).includes('توکن')) {
      clearSession();
      await navigateTo('/admin/login');
    }
  } finally {
    uploadingField.value = null;
  }
}

function onGalleryImagePick(index: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadGalleryImage(index, file);
  input.value = '';
}

function onEventImagePick(index: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadEventImage(index, file);
  input.value = '';
}

function addNavItem() {
  content.value.nav.push({ label: '', href: '#home' });
}

function removeNavItem(index: number) {
  content.value.nav.splice(index, 1);
}

function addProgressStep() {
  content.value.progressSteps.push({ title: '', status: 'pending', value: 0 });
}

function removeProgressStep(index: number) {
  content.value.progressSteps.splice(index, 1);
}

function addProgressBar() {
  content.value.progressBars.push({ label: '', value: 0 });
}

function removeProgressBar(index: number) {
  content.value.progressBars.splice(index, 1);
}

function addGalleryItem() {
  content.value.processGallery.push({ src: '', alt: '', caption: '' });
}

function removeGalleryItem(index: number) {
  content.value.processGallery.splice(index, 1);
}

function addEvent() {
  content.value.events.push({ title: '', text: '', date: '', image: '', alt: '' });
}

function removeEvent(index: number) {
  content.value.events.splice(index, 1);
}

async function uploadHeroThumb(index: number, file: File) {
  uploadingField.value = `hero-thumb-${index}`;
  error.value = '';
  try {
    loadToken();
    if (!token.value) {
      clearSession();
      await navigateTo('/admin/login');
      return;
    }
    const form = new FormData();
    form.append('image', file);
    const res = await apiFetch<{ success: boolean; data: { path: string } }>(
      '/api/content/assets',
      { method: 'POST', token: token.value, formData: form }
    );
    content.value.heroThumbs[index].src = res.data.path;
    message.value = 'تصویر کلاژ آپلود شد — ذخیره تغییرات را بزنید';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'آپلود تصویر ناموفق بود';
    if (String(error.value).includes('توکن')) {
      clearSession();
      await navigateTo('/admin/login');
    }
  } finally {
    uploadingField.value = null;
  }
}

function onHeroThumbPick(index: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadHeroThumb(index, file);
  input.value = '';
}

function addHeroThumb() {
  content.value.heroThumbs.push({ src: '', alt: '', name: '' });
}

function removeHeroThumb(index: number) {
  content.value.heroThumbs.splice(index, 1);
}

function removeHeroFeature(index: number) {
  content.value.heroFeatures.splice(index, 1);
}

function onImagePick(field: keyof SiteContent, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadImage(field, file);
  input.value = '';
}

function addLine(field: 'countdownItems', value = '') {
  content.value[field].push(value);
}

function removeLine(field: 'countdownItems', index: number) {
  content.value[field].splice(index, 1);
}

function addWhyCard() {
  content.value.whyCards.push({ title: '', text: '' });
}

function removeWhyCard(index: number) {
  content.value.whyCards.splice(index, 1);
}

function addApp() {
  content.value.apps.push({ title: '', icon: 'research' });
}

function removeApp(index: number) {
  content.value.apps.splice(index, 1);
}

function addSpec() {
  content.value.uploadPhotoSpecs.push({ label: '', value: '' });
}

function removeSpec(index: number) {
  content.value.uploadPhotoSpecs.splice(index, 1);
}

function addReward() {
  content.value.rewards.push({ title: '', text: '' });
}

function removeReward(index: number) {
  content.value.rewards.splice(index, 1);
}

function addCollaboration() {
  content.value.collaborations.push({ title: '', text: '' });
}

function removeCollaboration(index: number) {
  content.value.collaborations.splice(index, 1);
}

function addPoint() {
  content.value.points.push({ action: '', points: '' });
}

function removePoint(index: number) {
  content.value.points.splice(index, 1);
}

function logout() {
  clearSession();
  navigateTo('/admin/login');
}

onMounted(() => {
  fetchContent().then(() => syncCountdownLocalFromContent());
  previewTimer = setInterval(() => {
    previewNow.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (previewTimer) clearInterval(previewTimer);
});
</script>

<template>
  <div class="min-h-screen bg-brand-cream">
    <header class="sticky top-0 z-40 border-b border-brand-line bg-white">
      <div class="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-extrabold text-brand-green">مدیریت محتوای لندینگ</h1>
          <p class="text-xs text-slate-500">{{ admin?.email }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink to="/admin" class="rounded-full border border-brand-line px-4 py-2 text-sm">
            آپلودها
          </NuxtLink>
          <NuxtLink to="/" class="rounded-full border border-brand-line px-4 py-2 text-sm">
            سایت
          </NuxtLink>
          <button type="button" class="btn-orange !py-2 text-sm" @click="logout">خروج</button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6">
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="rounded-full px-4 py-2 text-xs font-semibold transition"
          :class="
            activeTab === tab.id
              ? 'bg-brand-green text-white'
              : 'border border-brand-line bg-white text-slate-600'
          "
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-500">در حال بارگذاری...</p>

      <template v-else>
        <p v-if="message" class="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {{ message }}
        </p>
        <p v-if="error" class="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {{ error }}
        </p>

        <div class="card-soft space-y-4 border border-brand-line/60 p-5">
          <!-- About / Countdown -->
          <template v-if="activeTab === 'about'">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان بخش درباره ما</span>
              <input v-model="content.countdownTitle" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">برچسب تایمر (کنار روز و ساعت)</span>
              <input v-model="content.countdownTimerLabel" class="field-input" />
            </label>
            <div class="rounded-xl border border-brand-line/60 bg-brand-cream/50 p-4">
              <span class="mb-2 block text-sm font-semibold">تاریخ و ساعت پایان شمارش معکوس</span>
              <input
                v-model="countdownLocal"
                type="datetime-local"
                class="field-input"
                dir="ltr"
                @change="onCountdownLocalChange"
              />
              <div class="mt-3 flex flex-wrap gap-2">
                <button type="button" class="btn-muted" @click="setCountdownDaysAhead(30)">+۳۰ روز</button>
                <button type="button" class="btn-muted" @click="setCountdownDaysAhead(45)">+۴۵ روز</button>
                <button type="button" class="btn-muted" @click="setCountdownDaysAhead(60)">+۶۰ روز</button>
              </div>
              <p v-if="!countdownTargetValid" class="mt-3 text-xs text-amber-700">
                تاریخ تنظیم نشده یا نامعتبر است (مثلاً متن فارسی). یک تاریخ از تقویم انتخاب کنید.
              </p>
              <div
                v-else-if="countdownPreview"
                class="mt-3 rounded-xl bg-brand-green px-4 py-3 text-center text-white"
              >
                <p class="text-xs text-white/85">پیش‌نمایش زنده</p>
                <p v-if="countdownPreview.expired" class="mt-1 text-lg font-bold">منتشر شد!</p>
                <p v-else class="mt-1 text-xl font-extrabold tabular-nums">
                  {{ countdownPreview.days }} روز : {{ countdownPreview.hours }} ساعت
                  <span class="text-sm font-normal text-white/80">
                    ({{ countdownPreview.minutes }} دقیقه)
                  </span>
                </p>
              </div>
            </div>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold text-slate-400">ISO ذخیره‌شده (خودکار)</span>
              <input
                :value="content.countdownTargetDate"
                class="field-input bg-slate-50 text-slate-500"
                dir="ltr"
                readonly
              />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">متن‌های لیست</span>
              <div v-for="(item, idx) in content.countdownItems" :key="`ci-${idx}`" class="mb-2 flex gap-2">
                <input v-model="content.countdownItems[idx]" class="field-input flex-1" />
                <button type="button" class="btn-muted" @click="removeLine('countdownItems', idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted mt-1" @click="addLine('countdownItems')">+ خط جدید</button>
            </div>
            <div>
              <span class="mb-2 block text-sm font-semibold">تصویر بخش</span>
              <img
                v-if="content.countdownImage"
                :src="mediaUrl(content.countdownImage)"
                alt=""
                class="mb-2 h-32 rounded-xl object-cover"
              />
              <input
                type="file"
                accept="image/*"
                :disabled="uploadingField === 'countdownImage'"
                @change="onImagePick('countdownImage', $event)"
              />
            </div>
          </template>

          <!-- Why + Apps -->
          <template v-else-if="activeTab === 'why'">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان بخش (چرا ایران فود)</span>
              <input v-model="content.whyTitle" class="field-input" />
            </label>
            <div v-for="(card, idx) in content.whyCards" :key="`wc-${idx}`" class="rounded-xl border border-brand-line/60 p-3">
              <input v-model="card.title" class="field-input mb-2" placeholder="عنوان کارت" />
              <textarea v-model="card.text" class="field-input min-h-[72px]" placeholder="متن کارت" />
              <button type="button" class="btn-muted mt-2" @click="removeWhyCard(idx)">حذف کارت</button>
            </div>
            <button type="button" class="btn-muted" @click="addWhyCard">+ کارت جدید</button>
            <div>
              <span class="mb-2 block text-sm font-semibold">تصویر دایره‌ای</span>
              <img v-if="content.whyImage" :src="mediaUrl(content.whyImage)" alt="" class="mb-2 h-32 rounded-full object-cover" />
              <input type="file" accept="image/*" @change="onImagePick('whyImage', $event)" />
            </div>
            <hr class="border-brand-line/50" />
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان کاربردها</span>
              <input v-model="content.appsTitle" class="field-input" />
            </label>
            <div v-for="(app, idx) in content.apps" :key="`app-${idx}`" class="flex flex-wrap gap-2">
              <input v-model="app.title" class="field-input flex-1" placeholder="عنوان کاربرد" />
              <select v-model="app.icon" class="field-input w-36">
                <option value="health">health</option>
                <option value="benchmark">benchmark</option>
                <option value="api">api</option>
                <option value="ai">ai</option>
                <option value="app">app</option>
                <option value="research">research</option>
              </select>
              <button type="button" class="btn-muted" @click="removeApp(idx)">حذف</button>
            </div>
            <button type="button" class="btn-muted" @click="addApp">+ کاربرد جدید</button>
          </template>

          <!-- Upload -->
          <template v-else-if="activeTab === 'upload'">
            <p class="rounded-xl bg-brand-cream px-4 py-3 text-sm leading-7 text-slate-600">
              ویدیوی راهنمای تصویربرداری و شرایط ارسال عکس را اینجا تنظیم کنید. کاربران در مودال آپلود، ابتدا راهنما را می‌بینند و سپس تصویر ارسال می‌کنند.
            </p>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان مودال آپلود</span>
              <input v-model="content.uploadModalTitle" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">زیرعنوان مودال</span>
              <input v-model="content.uploadModalSubtitle" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">متن دکمه آپلود (در صفحه)</span>
              <input v-model="content.uploadButtonLabel" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">متن دکمه ارسال (مودال)</span>
              <input v-model="content.uploadSubmitLabel" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان راهنمای تصویربرداری</span>
              <input v-model="content.uploadGuideTitle" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">آدرس ویدیو/تصویر راهنما</span>
              <input v-model="content.uploadGuideVideoUrl" class="field-input" dir="ltr" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">پوستر ویدیو (اختیاری)</span>
              <input v-model="content.uploadGuideVideoPoster" class="field-input" dir="ltr" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">آپلود ویدیوی راهنمای تصویربرداری</span>
              <p class="mb-2 text-xs text-slate-500">
                فرمت‌های مجاز: MP4، WEBM، OGG (تا ۵۰ مگابایت) — یا تصویر JPG/PNG/WEBP
              </p>
              <input type="file" accept="image/*,video/mp4,video/webm,video/ogg" @change="onImagePick('uploadGuideVideoUrl', $event)" />
            </div>
            <div>
              <span class="mb-2 block text-sm font-semibold">آپلود پوستر ویدیو (اختیاری)</span>
              <input type="file" accept="image/*" @change="onImagePick('uploadGuideVideoPoster', $event)" />
            </div>
            <p class="text-sm font-semibold text-brand-green">شرایط و مشخصات تصویربرداری</p>
            <div v-if="content.uploadGuideVideoUrl" class="rounded-xl border border-brand-line/60 p-3">
              <p class="mb-2 text-xs font-semibold text-slate-500">پیش‌نمایش راهنما</p>
              <video
                v-if="/\.(mp4|webm|ogg)(\?|$)/i.test(content.uploadGuideVideoUrl)"
                :src="mediaUrl(content.uploadGuideVideoUrl)"
                class="h-40 w-full rounded-lg object-cover"
                controls
                playsinline
              />
              <img
                v-else
                :src="mediaUrl(content.uploadGuideVideoUrl)"
                alt=""
                class="h-40 w-full rounded-lg object-cover"
              />
            </div>
            <div v-for="(spec, idx) in content.uploadPhotoSpecs" :key="`spec-${idx}`" class="flex flex-wrap gap-2">
              <input v-model="spec.label" class="field-input w-28" placeholder="برچسب" />
              <input v-model="spec.value" class="field-input flex-1" placeholder="مقدار" />
              <button type="button" class="btn-muted" @click="removeSpec(idx)">حذف</button>
            </div>
            <button type="button" class="btn-muted" @click="addSpec">+ مشخصه جدید</button>
          </template>

          <!-- Hero -->
          <template v-else-if="activeTab === 'hero'">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">شعار (tagline)</span>
              <input v-model="content.tagline" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">متن نظارت</span>
              <input v-model="content.supervisedBy" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">متن دکمه مشارکت</span>
              <input v-model="content.participateButtonLabel" class="field-input" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">ویژگی‌های Hero</span>
              <div v-for="(f, idx) in content.heroFeatures" :key="`hf-${idx}`" class="mb-2 flex gap-2">
                <input v-model="f.text" class="field-input flex-1" />
                <button type="button" class="btn-muted" @click="removeHeroFeature(idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted" @click="addHeroFeature">+ ویژگی جدید</button>
            </div>
            <hr class="border-brand-line/50" />
            <div>
              <span class="mb-1 block text-sm font-semibold">عکس‌های کلاژ بالای صفحه</span>
              <p class="mb-3 text-xs leading-6 text-slate-500">
                تعداد عکس‌ها را کم یا زیاد کنید، تصویر را عوض کنید و ذخیره را بزنید. چیدمان دایره‌ای ۵ ستونه مثل صفحه اصلی است.
              </p>
              <div class="mb-4 grid grid-cols-5 gap-2">
                <div
                  v-for="(thumb, idx) in content.heroThumbs"
                  :key="`preview-${idx}`"
                  class="aspect-square overflow-hidden rounded-none border border-brand-line/70 bg-brand-cream"
                >
                  <img
                    v-if="thumb.src"
                    :src="mediaUrl(thumb.src)"
                    :alt="thumb.alt || thumb.name"
                    class="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div
                v-for="(thumb, idx) in content.heroThumbs"
                :key="`ht-${idx}`"
                class="mb-3 rounded-xl border border-brand-line/60 p-3"
              >
                <div class="mb-2 flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-500">عکس {{ idx + 1 }}</span>
                  <button type="button" class="btn-muted" @click="removeHeroThumb(idx)">حذف</button>
                </div>
                <img
                  v-if="thumb.src"
                  :src="mediaUrl(thumb.src)"
                  alt=""
                  class="mb-2 h-20 w-20 rounded-none object-cover"
                />
                <input
                  type="file"
                  accept="image/*"
                  class="mb-2 block text-sm"
                  :disabled="uploadingField === `hero-thumb-${idx}`"
                  @change="onHeroThumbPick(idx, $event)"
                />
                <input v-model="thumb.name" class="field-input mb-2" placeholder="نام غذا" />
                <input v-model="thumb.alt" class="field-input mb-2" placeholder="متن جایگزین" />
                <input v-model="thumb.src" class="field-input" dir="ltr" placeholder="مسیر تصویر" />
              </div>
              <button type="button" class="btn-muted" @click="addHeroThumb">+ عکس جدید</button>
            </div>
          </template>

          <!-- Progress -->
          <template v-else-if="activeTab === 'progress'">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان پیشرفت</span>
              <input v-model="content.progressTitle" class="field-input" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">مراحل پیشرفت</span>
              <div
                v-for="(step, idx) in content.progressSteps"
                :key="`ps-${idx}`"
                class="mb-3 rounded-xl border border-brand-line/60 p-3"
              >
                <input v-model="step.title" class="field-input mb-2" placeholder="عنوان مرحله" />
                <div class="mb-2 flex flex-wrap gap-2">
                  <select v-model="step.status" class="field-input w-36">
                    <option value="done">تکمیل شده</option>
                    <option value="progress">در حال انجام</option>
                    <option value="pending">در انتظار</option>
                  </select>
                  <input v-model.number="step.value" type="number" min="0" max="100" class="field-input w-24" placeholder="٪" />
                </div>
                <button type="button" class="btn-muted" @click="removeProgressStep(idx)">حذف مرحله</button>
              </div>
              <button type="button" class="btn-muted" @click="addProgressStep">+ مرحله جدید</button>
            </div>
            <hr class="border-brand-line/50" />
            <div>
              <span class="mb-2 block text-sm font-semibold">نوارهای پیشرفت</span>
              <div v-for="(bar, idx) in content.progressBars" :key="`pb-${idx}`" class="mb-2 flex flex-wrap gap-2">
                <input v-model="bar.label" class="field-input flex-1" placeholder="برچسب" />
                <input v-model.number="bar.value" type="number" min="0" max="100" class="field-input w-24" />
                <button type="button" class="btn-muted" @click="removeProgressBar(idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted" @click="addProgressBar">+ نوار جدید</button>
            </div>
            <hr class="border-brand-line/50" />
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان جوایز / مزایا</span>
              <input v-model="content.rewardsTitle" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">متن intro جوایز</span>
              <textarea v-model="content.rewardsIntro" class="field-input min-h-[72px]" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">مزایا</span>
              <div
                v-for="(reward, idx) in content.rewards"
                :key="`rw-${idx}`"
                class="mb-3 rounded-xl border border-brand-line/60 p-3"
              >
                <input v-model="reward.title" class="field-input mb-2" placeholder="عنوان" />
                <textarea v-model="reward.text" class="field-input min-h-[60px]" placeholder="توضیح" />
                <button type="button" class="btn-muted mt-2" @click="removeReward(idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted" @click="addReward">+ مزیت جدید</button>
            </div>
            <hr class="border-brand-line/50" />
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان بخش همکاری‌ها</span>
              <input v-model="content.collaborationsTitle" class="field-input" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">همکاری‌ها</span>
              <div
                v-for="(item, idx) in content.collaborations"
                :key="`col-${idx}`"
                class="mb-3 rounded-xl border border-brand-line/60 p-3"
              >
                <input v-model="item.title" class="field-input mb-2" placeholder="عنوان همکاری" />
                <textarea v-model="item.text" class="field-input min-h-[60px]" placeholder="توضیح" />
                <button type="button" class="btn-muted mt-2" @click="removeCollaboration(idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted" @click="addCollaboration">+ همکاری جدید</button>
            </div>
            <hr class="border-brand-line/50" />
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان امتیازدهی (اختیاری)</span>
              <input v-model="content.pointsTitle" class="field-input" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">جدول امتیاز</span>
              <div v-for="(row, idx) in content.points" :key="`pt-${idx}`" class="mb-2 flex flex-wrap gap-2">
                <input v-model="row.action" class="field-input flex-1" placeholder="فعالیت" />
                <input v-model="row.points" class="field-input w-28" placeholder="امتیاز" />
                <button type="button" class="btn-muted" @click="removePoint(idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted" @click="addPoint">+ ردیف امتیاز</button>
            </div>
          </template>

          <!-- Events -->
          <template v-else-if="activeTab === 'events'">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان رویدادها</span>
              <input v-model="content.eventsTitle" class="field-input" />
            </label>
            <div v-for="(ev, idx) in content.events" :key="`ev-${idx}`" class="rounded-xl border border-brand-line/60 p-3">
              <input v-model="ev.title" class="field-input mb-2" placeholder="عنوان" />
              <textarea v-model="ev.text" class="field-input mb-2 min-h-[60px]" placeholder="متن" />
              <input v-model="ev.date" class="field-input mb-2" placeholder="تاریخ" />
              <input v-model="ev.alt" class="field-input mb-2" placeholder="متن جایگزین تصویر" />
              <img v-if="ev.image" :src="mediaUrl(ev.image)" alt="" class="mb-2 h-24 rounded-lg object-cover" />
              <input type="file" accept="image/*" class="mb-2" @change="onEventImagePick(idx, $event)" />
              <input v-model="ev.image" class="field-input mb-2" dir="ltr" placeholder="مسیر تصویر" />
              <button type="button" class="btn-muted" @click="removeEvent(idx)">حذف رویداد</button>
            </div>
            <button type="button" class="btn-muted" @click="addEvent">+ رویداد جدید</button>
          </template>

          <!-- Gallery -->
          <template v-else-if="activeTab === 'gallery'">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">عنوان گالری</span>
              <input v-model="content.processGalleryTitle" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">توضیح گالری</span>
              <textarea v-model="content.processGalleryIntro" class="field-input min-h-[72px]" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">آیتم‌های گالری</span>
              <div
                v-for="(item, idx) in content.processGallery"
                :key="`pg-${idx}`"
                class="mb-3 rounded-xl border border-brand-line/60 p-3"
              >
                <input v-model="item.caption" class="field-input mb-2" placeholder="عنوان" />
                <input v-model="item.alt" class="field-input mb-2" placeholder="متن جایگزین" />
                <img v-if="item.src" :src="mediaUrl(item.src)" alt="" class="mb-2 h-24 rounded-lg object-cover" />
                <input type="file" accept="image/*" class="mb-2" @change="onGalleryImagePick(idx, $event)" />
                <input v-model="item.src" class="field-input mb-2" dir="ltr" placeholder="مسیر تصویر" />
                <button type="button" class="btn-muted" @click="removeGalleryItem(idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted" @click="addGalleryItem">+ آیتم گالری</button>
            </div>
          </template>

          <!-- General -->
          <template v-else-if="activeTab === 'general'">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">شعار فوتر</span>
              <input v-model="content.footerSlogan" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">ایمیل</span>
              <input v-model="content.contact.email" class="field-input" dir="ltr" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">تلفن</span>
              <input v-model="content.contact.phone" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">آدرس</span>
              <input v-model="content.contact.address" class="field-input" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">اینستاگرام</span>
              <input v-model="content.contact.instagram" class="field-input" dir="ltr" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">تلگرام</span>
              <input v-model="content.contact.telegram" class="field-input" dir="ltr" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">لینکدین</span>
              <input v-model="content.contact.linkedin" class="field-input" dir="ltr" />
            </label>
            <div>
              <span class="mb-2 block text-sm font-semibold">منوی ناوبری</span>
              <div v-for="(item, idx) in content.nav" :key="`nav-${idx}`" class="mb-2 flex flex-wrap gap-2">
                <input v-model="item.label" class="field-input w-32" placeholder="برچسب" />
                <input v-model="item.href" class="field-input flex-1" dir="ltr" placeholder="#about" />
                <button type="button" class="btn-muted" @click="removeNavItem(idx)">حذف</button>
              </div>
              <button type="button" class="btn-muted" @click="addNavItem">+ آیتم منو</button>
            </div>
            <p class="text-xs text-slate-500">
              «درباره ما» باید به #about اشاره کند. «کاربردها» می‌تواند #apps باشد.
            </p>
          </template>
        </div>

        <button
          type="button"
          class="btn-green mt-6 w-full sm:w-auto"
          :disabled="saving"
          @click="saveContent"
        >
          {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
        </button>
      </template>
    </main>
  </div>
</template>

<style scoped>
.field-input {
  @apply w-full rounded-xl border border-brand-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-green;
}
.btn-muted {
  @apply rounded-full border border-brand-line bg-white px-3 py-1.5 text-xs font-semibold text-slate-600;
}
</style>
