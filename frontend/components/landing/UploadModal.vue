<script setup lang="ts">
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: []; success: [] }>();

const { apiFetch } = useApi();

const name = ref('');
const phone = ref('');
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const error = ref('');
const success = ref('');

const MAX_MB = 5;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

watch(
  () => props.open,
  (val) => {
    if (val) {
      error.value = '';
      success.value = '';
    }
  }
);

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const selected = input.files?.[0] || null;
  error.value = '';
  success.value = '';

  if (!selected) {
    file.value = null;
    return;
  }

  if (!ALLOWED.includes(selected.type)) {
    error.value = 'فقط فایل‌های JPG، PNG یا WEBP مجاز هستند.';
    file.value = null;
    input.value = '';
    return;
  }

  if (selected.size > MAX_MB * 1024 * 1024) {
    error.value = `حجم فایل نباید بیشتر از ${MAX_MB} مگابایت باشد.`;
    file.value = null;
    input.value = '';
    return;
  }

  file.value = selected;
}

function validateClient() {
  if (!name.value.trim() || name.value.trim().length < 2) {
    error.value = 'نام باید حداقل ۲ کاراکتر باشد.';
    return false;
  }
  if (phone.value && !/^[\d+\-\s()]{7,20}$/.test(phone.value.trim())) {
    error.value = 'شماره تماس معتبر نیست.';
    return false;
  }
  if (!file.value) {
    error.value = 'لطفاً یک تصویر انتخاب کنید.';
    return false;
  }
  return true;
}

async function submit() {
  error.value = '';
  success.value = '';
  if (!validateClient() || !file.value) return;

  loading.value = true;
  try {
    const form = new FormData();
    form.append('name', name.value.trim());
    form.append('phone', phone.value.trim());
    form.append('image', file.value);

    const res = await apiFetch<{ success: boolean; message: string }>('/api/uploads', {
      method: 'POST',
      formData: form,
    });

    success.value = res.message || 'ارسال با موفقیت انجام شد.';
    name.value = '';
    phone.value = '';
    file.value = null;
    if (fileInput.value) fileInput.value.value = '';
    emit('success');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'ارسال ناموفق بود.';
  } finally {
    loading.value = false;
  }
}

function close() {
  emit('close');
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="safe-bottom fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      @click.self="close"
    >
      <div
        class="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-soft sm:max-w-md sm:rounded-3xl sm:p-6"
      >
        <div class="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="upload-title" class="text-lg font-extrabold text-brand-green">
              آپلود عکس غذا
            </h2>
            <div class="mt-2 text-[11px] leading-5 text-slate-600 sm:text-xs sm:leading-6">
              <p class="font-bold text-brand-green">شرایط عکس:</p>
              <ul class="mt-1 space-y-0.5">
                <li><span class="font-semibold text-slate-700">فرمت:</span> JPG</li>
                <li>
                  <span class="font-semibold text-slate-700">حجم:</span>
                  ۵۰۰ کیلوبایت تا ۳ مگابایت (حداکثر ۵ مگابایت)
                </li>
                <li>
                  <span class="font-semibold text-slate-700">حداقل کیفیت:</span>
                  ۱۶۰۰×۱۶۰۰ پیکسل
                </li>
                <li>عکس واضح و با نور مناسب باشد.</li>
                <li>
                  ترجیحاً یک عکس از زاویه ۴۵ درجه و در صورت امکان یک عکس از بالا (۹۰ درجه) ارسال
                  کنید.
                </li>
              </ul>
              <p class="mb-0.5 mt-2 font-bold text-brand-green">پس‌زمینه:</p>
              <ul class="space-y-0.5">
                <li>بشقاب کامل داخل کادر باشد.</li>
                <li>پس‌زمینه ساده و تمیز</li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            class="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600"
            aria-label="بستن"
            @click="close"
          >
            ×
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label for="upload-name" class="mb-1.5 block text-sm font-semibold text-slate-700">
              نام
            </label>
            <input
              id="upload-name"
              v-model="name"
              type="text"
              maxlength="100"
              autocomplete="name"
              class="w-full rounded-xl border border-brand-line bg-brand-cream px-3 py-2.5 text-sm outline-none focus:border-brand-green"
              placeholder="نام خود را وارد کنید"
            />
          </div>

          <div>
            <label for="upload-phone" class="mb-1.5 block text-sm font-semibold text-slate-700">
              شماره تماس
              <span class="font-normal text-slate-400">(اختیاری)</span>
            </label>
            <input
              id="upload-phone"
              v-model="phone"
              type="tel"
              maxlength="20"
              autocomplete="tel"
              class="w-full rounded-xl border border-brand-line bg-brand-cream px-3 py-2.5 text-sm outline-none focus:border-brand-green"
              placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">انتخاب تصویر</label>
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-green file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              @change="onFileChange"
            />
            <p v-if="file" class="mt-2 text-xs text-slate-500">{{ file.name }}</p>
          </div>

          <p v-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ error }}
          </p>
          <p v-if="success" class="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {{ success }}
          </p>

          <button type="submit" class="btn-orange w-full" :disabled="loading">
            {{ loading ? 'در حال ارسال...' : 'ارسال' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
