<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'auth',
});

useSeoMeta({
  title: 'مدیریت محتوا | Iran Food',
  robots: 'noindex, nofollow',
});

const { apiFetch } = useApi();
const { token, admin, loadToken, clearSession } = useAuth();

const tabs = [
  { id: 'general', label: 'عمومی' },
  { id: 'theme', label: 'رنگ‌ها و لوگو' },
  { id: 'sections', label: 'بخش‌ها' },
  { id: 'hero', label: 'Hero' },
  { id: 'countdown', label: 'شمارش معکوس' },
  { id: 'why', label: 'چرا ایران فود' },
  { id: 'apps', label: 'کاربردها' },
  { id: 'progress', label: 'پیشرفت' },
  { id: 'rewards', label: 'جوایز' },
  { id: 'events', label: 'رویدادها' },
  { id: 'nav', label: 'منو و تماس' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const activeTab = ref<TabId>('general');
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const success = ref('');
const content = reactive(cloneContent(defaultSiteContent));

async function loadContent() {
  loading.value = true;
  error.value = '';
  try {
    loadToken();
    const res = await apiFetch<{ success: boolean; data: SiteContentData }>('/api/content', {
      token: token.value,
    });
    Object.assign(content, cloneContent(res.data));
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'خطا در بارگذاری محتوا';
  } finally {
    loading.value = false;
  }
}

async function saveContent() {
  saving.value = true;
  error.value = '';
  success.value = '';
  try {
    loadToken();
    const res = await apiFetch<{ success: boolean; message: string; data: SiteContentData }>(
      '/api/content',
      {
        method: 'PUT',
        token: token.value,
        body: { content },
      }
    );
    Object.assign(content, cloneContent(res.data));
    success.value = res.message || 'ذخیره شد';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ذخیره ناموفق بود';
  } finally {
    saving.value = false;
  }
}

function logout() {
  clearSession();
  navigateTo('/admin/login');
}

function addNavItem() {
  content.nav.push({ label: 'لینک جدید', href: '#' });
}

function addWhyCard() {
  content.whyCards.push({ title: 'عنوان', text: 'توضیح' });
}

function addEvent() {
  content.events.push({
    title: 'رویداد جدید',
    text: 'توضیح',
    date: '۱۴۰۳/۰۱/۰۱',
    image: '/images/events/team-strategy.png',
    alt: 'رویداد',
  });
}

function addHeroFeature() {
  content.heroFeatures.push({ icon: 'standard', text: 'ویژگی جدید' });
}

onMounted(() => loadContent());
</script>

<template>
  <div class="min-h-screen bg-brand-cream">
    <header class="border-b border-brand-line bg-white">
      <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-lg font-extrabold text-brand-green">مدیریت محتوای سایت</h1>
          <p class="text-xs text-slate-500">{{ admin?.email }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink to="/admin" class="rounded-full border border-brand-line px-4 py-2 text-sm">
            آپلودهای کاربران
          </NuxtLink>
          <NuxtLink to="/" class="rounded-full border border-brand-line px-4 py-2 text-sm">
            صفحه اصلی
          </NuxtLink>
          <button type="button" class="btn-orange !py-2" @click="logout">خروج</button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-semibold transition"
          :class="
            activeTab === tab.id
              ? 'bg-brand-green text-white'
              : 'border border-brand-line bg-white text-slate-700 hover:bg-brand-green-light'
          "
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-500">در حال بارگذاری...</p>

      <form v-else class="space-y-4" @submit.prevent="saveContent">
        <section v-show="activeTab === 'general'" class="card-soft space-y-3 border border-brand-line p-4">
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">نام برند</span>
            <input v-model="content.brand" class="field" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">شعار</span>
            <input v-model="content.tagline" class="field" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">متن نظارت دانشگاه</span>
            <input v-model="content.supervisedBy" class="field" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">شعار فوتر</span>
            <input v-model="content.footerSlogan" class="field" />
          </label>
        </section>

        <section v-show="activeTab === 'theme'" class="card-soft space-y-4 border border-brand-line p-4">
          <AdminImageUpload v-model="content.images.logo" label="لوگو سایت" />
          <AdminImageUpload v-model="content.images.countdownHero" label="تصویر بخش شمارش معکوس" />
          <AdminImageUpload v-model="content.images.whyHero" label="تصویر بخش چرا ایران فود" />

          <div class="grid gap-3 sm:grid-cols-2">
            <label v-for="(value, key) in content.theme" :key="key" class="block text-sm">
              <span class="mb-1 block font-semibold">{{ key }}</span>
              <div class="flex gap-2">
                <input v-model="content.theme[key as keyof typeof content.theme]" type="color" class="h-10 w-14 rounded-lg border border-brand-line" />
                <input v-model="content.theme[key as keyof typeof content.theme]" class="field" />
              </div>
            </label>
          </div>
        </section>

        <section v-show="activeTab === 'sections'" class="card-soft space-y-3 border border-brand-line p-4">
          <label
            v-for="(enabled, key) in content.sections"
            :key="key"
            class="flex items-center justify-between rounded-xl bg-brand-cream px-3 py-2.5 text-sm"
          >
            <span>{{ key }}</span>
            <input v-model="content.sections[key as keyof typeof content.sections]" type="checkbox" />
          </label>
        </section>

        <section v-show="activeTab === 'hero'" class="card-soft space-y-3 border border-brand-line p-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">دکمه مشارکت</span>
              <input v-model="content.buttons.participate.label" class="field" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">لینک مشارکت</span>
              <input v-model="content.buttons.participate.href" class="field" />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="content.buttons.participate.enabled" type="checkbox" />
              نمایش دکمه مشارکت
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">دکمه آپلود Hero</span>
              <input v-model="content.buttons.uploadHero.label" class="field" />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="content.buttons.uploadHero.enabled" type="checkbox" />
              نمایش دکمه آپلود Hero
            </label>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold">ویژگی‌های Hero</h3>
              <button type="button" class="text-xs text-brand-green" @click="addHeroFeature">+ افزودن</button>
            </div>
            <div
              v-for="(feature, idx) in content.heroFeatures"
              :key="idx"
              class="grid gap-2 rounded-xl border border-brand-line p-3 sm:grid-cols-[120px_1fr_auto]"
            >
              <input v-model="feature.icon" class="field" placeholder="icon" />
              <input v-model="feature.text" class="field" />
              <button type="button" class="text-xs text-red-600" @click="content.heroFeatures.splice(idx, 1)">
                حذف
              </button>
            </div>
          </div>
        </section>

        <section v-show="activeTab === 'countdown'" class="card-soft space-y-3 border border-brand-line p-4">
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">عنوان</span>
            <input v-model="content.countdownTitle" class="field" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">تاریخ هدف (ISO، مثال: 2026-09-01T00:00:00.000Z)</span>
            <input v-model="content.countdownTarget" class="field ltr" dir="ltr" placeholder="خالی = ۴۵ روز از امروز" />
          </label>
          <div class="space-y-2">
            <div
              v-for="(item, idx) in content.countdownItems"
              :key="idx"
              class="flex gap-2"
            >
              <input v-model="content.countdownItems[idx]" class="field" />
              <button type="button" class="text-xs text-red-600" @click="content.countdownItems.splice(idx, 1)">
                حذف
              </button>
            </div>
            <button type="button" class="text-xs text-brand-green" @click="content.countdownItems.push('متن جدید')">
              + افزودن مورد
            </button>
          </div>
        </section>

        <section v-show="activeTab === 'why'" class="card-soft space-y-3 border border-brand-line p-4">
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">عنوان بخش</span>
            <input v-model="content.whyTitle" class="field" />
          </label>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold">کارت‌ها</h3>
              <button type="button" class="text-xs text-brand-green" @click="addWhyCard">+ افزودن</button>
            </div>
            <div
              v-for="(card, idx) in content.whyCards"
              :key="idx"
              class="grid gap-2 rounded-xl border border-brand-line p-3"
            >
              <input v-model="card.title" class="field" placeholder="عنوان" />
              <textarea v-model="card.text" class="field min-h-20" placeholder="متن" />
              <button type="button" class="text-xs text-red-600" @click="content.whyCards.splice(idx, 1)">
                حذف کارت
              </button>
            </div>
          </div>
        </section>

        <section v-show="activeTab === 'apps'" class="card-soft space-y-3 border border-brand-line p-4">
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">عنوان بخش</span>
            <input v-model="content.appsTitle" class="field" />
          </label>
          <div
            v-for="(app, idx) in content.apps"
            :key="idx"
            class="grid gap-2 rounded-xl border border-brand-line p-3 sm:grid-cols-[120px_1fr_auto]"
          >
            <input v-model="app.icon" class="field" />
            <input v-model="app.title" class="field" />
            <button type="button" class="text-xs text-red-600" @click="content.apps.splice(idx, 1)">حذف</button>
          </div>
        </section>

        <section v-show="activeTab === 'progress'" class="card-soft space-y-3 border border-brand-line p-4">
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">عنوان</span>
            <input v-model="content.progressTitle" class="field" />
          </label>
          <div
            v-for="(step, idx) in content.progressSteps"
            :key="idx"
            class="grid gap-2 rounded-xl border border-brand-line p-3 sm:grid-cols-3"
          >
            <input v-model="step.title" class="field sm:col-span-2" />
            <input v-model.number="step.value" type="number" min="0" max="100" class="field" />
            <select v-model="step.status" class="field sm:col-span-3">
              <option value="done">انجام شده</option>
              <option value="progress">در حال انجام</option>
              <option value="pending">در انتظار</option>
            </select>
          </div>
          <div
            v-for="(bar, idx) in content.progressBars"
            :key="`bar-${idx}`"
            class="grid gap-2 rounded-xl border border-brand-line p-3 sm:grid-cols-2"
          >
            <input v-model="bar.label" class="field" />
            <input v-model.number="bar.value" type="number" min="0" max="100" class="field" />
          </div>
        </section>

        <section v-show="activeTab === 'rewards'" class="card-soft space-y-3 border border-brand-line p-4">
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">عنوان</span>
            <input v-model="content.rewardsTitle" class="field" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">متن intro</span>
            <textarea v-model="content.rewardsIntro" class="field min-h-20" />
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">عنوان جدول امتیاز</span>
            <input v-model="content.pointsTitle" class="field" />
          </label>
          <div
            v-for="(reward, idx) in content.rewards"
            :key="idx"
            class="grid gap-2 rounded-xl border border-brand-line p-3"
          >
            <input v-model="reward.title" class="field" />
            <textarea v-model="reward.text" class="field min-h-16" />
          </div>
          <div
            v-for="(point, idx) in content.points"
            :key="`p-${idx}`"
            class="grid gap-2 rounded-xl border border-brand-line p-3 sm:grid-cols-2"
          >
            <input v-model="point.action" class="field" />
            <input v-model="point.points" class="field" />
          </div>
        </section>

        <section v-show="activeTab === 'events'" class="card-soft space-y-3 border border-brand-line p-4">
          <label class="block text-sm">
            <span class="mb-1 block font-semibold">عنوان بخش</span>
            <input v-model="content.eventsTitle" class="field" />
          </label>
          <div class="flex justify-end">
            <button type="button" class="text-xs text-brand-green" @click="addEvent">+ رویداد جدید</button>
          </div>
          <div
            v-for="(event, idx) in content.events"
            :key="idx"
            class="space-y-2 rounded-xl border border-brand-line p-3"
          >
            <input v-model="event.title" class="field" placeholder="عنوان" />
            <textarea v-model="event.text" class="field min-h-16" placeholder="توضیح" />
            <input v-model="event.date" class="field" placeholder="تاریخ" />
            <input v-model="event.alt" class="field" placeholder="alt تصویر" />
            <AdminImageUpload v-model="event.image" label="تصویر رویداد" />
            <button type="button" class="text-xs text-red-600" @click="content.events.splice(idx, 1)">
              حذف رویداد
            </button>
          </div>
        </section>

        <section v-show="activeTab === 'nav'" class="card-soft space-y-3 border border-brand-line p-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">ایمیل</span>
              <input v-model="content.contact.email" class="field ltr" dir="ltr" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">تلفن</span>
              <input v-model="content.contact.phone" class="field" />
            </label>
            <label class="block text-sm sm:col-span-2">
              <span class="mb-1 block font-semibold">آدرس</span>
              <input v-model="content.contact.address" class="field" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">اینستاگرام</span>
              <input v-model="content.social.instagram" class="field ltr" dir="ltr" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">تلگرام</span>
              <input v-model="content.social.telegram" class="field ltr" dir="ltr" />
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">دکمه آپلود منو</span>
              <input v-model="content.buttons.uploadNav.label" class="field" />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="content.buttons.uploadNav.enabled" type="checkbox" />
              نمایش آپلود در منو
            </label>
            <label class="block text-sm">
              <span class="mb-1 block font-semibold">دکمه آپلود فوتر</span>
              <input v-model="content.buttons.uploadFooter.label" class="field" />
            </label>
            <label class="flex items-center gap-2 text-sm">
              <input v-model="content.buttons.uploadFooter.enabled" type="checkbox" />
              نمایش آپلود در فوتر
            </label>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold">منوی سایت</h3>
              <button type="button" class="text-xs text-brand-green" @click="addNavItem">+ لینک</button>
            </div>
            <div
              v-for="(item, idx) in content.nav"
              :key="idx"
              class="grid gap-2 rounded-xl border border-brand-line p-3 sm:grid-cols-2"
            >
              <input v-model="item.label" class="field" placeholder="برچسب" />
              <input v-model="item.href" class="field ltr" dir="ltr" placeholder="#section" />
              <button type="button" class="text-xs text-red-600 sm:col-span-2" @click="content.nav.splice(idx, 1)">
                حذف
              </button>
            </div>
          </div>
        </section>

        <p v-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{{ error }}</p>
        <p v-if="success" class="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{{ success }}</p>

        <div class="sticky bottom-4 z-20 flex justify-end">
          <button type="submit" class="btn-green shadow-soft" :disabled="saving">
            {{ saving ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<style scoped>
.field {
  @apply w-full rounded-2xl border border-brand-line px-3 py-2.5 text-sm outline-none focus:border-brand-green;
}
</style>
