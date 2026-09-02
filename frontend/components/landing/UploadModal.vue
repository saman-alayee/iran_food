<script setup lang="ts">
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: []; success: [] }>();

const { siteContent } = useSiteContent();
const {
  name,
  phone,
  file,
  fileInput,
  loading,
  error,
  success,
  resetMessages,
  onFileChange,
  submit,
} = usePhotoUpload();

watch(
  () => props.open,
  (val) => {
    if (val) resetMessages();
  }
);

async function handleSubmit() {
  const ok = await submit(() => emit('success'));
  if (ok) {
    // keep modal open briefly so user sees success message
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
        class="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-soft sm:max-w-lg sm:rounded-3xl sm:p-6"
      >
        <div class="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="upload-title" class="text-lg font-extrabold text-brand-green">
              {{ siteContent.uploadModalTitle }}
            </h2>
            <p class="mt-1 text-xs text-slate-500">{{ siteContent.uploadModalSubtitle }}</p>
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

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <LandingUploadGuidePanel compact />

          <div class="rounded-2xl border border-brand-line/60 bg-white p-4">
            <h3 class="mb-3 text-sm font-bold text-brand-green">فرم ارسال تصویر</h3>

            <div class="space-y-4">
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
                  @input="resetMessages"
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
                  @input="resetMessages"
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
            </div>
          </div>

          <p v-if="error" class="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ error }}
          </p>
          <p v-if="success" class="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {{ success }}
          </p>

          <button type="submit" class="btn-orange w-full" :disabled="loading">
            {{ loading ? 'در حال ارسال...' : siteContent.uploadSubmitLabel || 'ارسال' }}
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
