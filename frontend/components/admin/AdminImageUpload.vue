<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  label: string;
  hint?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const { apiFetch, apiBase } = useApi();
const { token, loadToken } = useAuth();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const error = ref('');

const MAX_MB = 5;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

const previewUrl = computed(() => {
  if (!props.modelValue) return '';
  if (props.modelValue.startsWith('http')) return props.modelValue;
  if (props.modelValue.startsWith('/images') || props.modelValue.startsWith('/favicon')) {
    return props.modelValue;
  }
  if (props.modelValue.startsWith('uploads/')) {
    return `${apiBase.replace(/\/$/, '')}/${props.modelValue}`;
  }
  return props.modelValue;
});

function pickFile() {
  fileInput.value?.click();
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  error.value = '';
  if (!file) return;

  if (!ALLOWED.includes(file.type)) {
    error.value = 'فقط JPG، PNG، WEBP یا SVG مجاز است.';
    input.value = '';
    return;
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    error.value = `حداکثر حجم ${MAX_MB} مگابایت است.`;
    input.value = '';
    return;
  }

  uploading.value = true;
  try {
    loadToken();
    const form = new FormData();
    form.append('image', file);
    const res = await apiFetch<{
      success: boolean;
      data: { path: string };
    }>('/api/media', {
      method: 'POST',
      token: token.value,
      formData: form,
    });
    emit('update:modelValue', res.data.path);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'آپلود ناموفق بود';
  } finally {
    uploading.value = false;
    input.value = '';
  }
}

async function removeImage() {
  if (!props.modelValue.startsWith('uploads/cms/')) {
    emit('update:modelValue', '');
    return;
  }

  const filename = props.modelValue.split('/').pop();
  if (!filename) return;
  if (!confirm('این تصویر حذف شود؟')) return;

  try {
    loadToken();
    await apiFetch(`/api/media/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      token: token.value,
    });
    emit('update:modelValue', '');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'حذف ناموفق بود';
  }
}
</script>

<template>
  <div class="rounded-2xl border border-brand-line bg-brand-cream/40 p-3">
    <div class="mb-2 flex items-center justify-between gap-2">
      <span class="text-sm font-semibold text-slate-700">{{ label }}</span>
      <span v-if="hint" class="text-[11px] text-slate-500">{{ hint }}</span>
    </div>

    <div v-if="previewUrl" class="mb-3 overflow-hidden rounded-xl border border-brand-line bg-white">
      <img :src="previewUrl" :alt="label" class="max-h-40 w-full object-contain p-2" />
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/svg+xml"
      class="hidden"
      @change="onFileChange"
    />

    <div class="flex flex-wrap gap-2">
      <button type="button" class="btn-green !py-2 text-xs" :disabled="uploading" @click="pickFile">
        {{ uploading ? 'در حال بارگذاری...' : previewUrl ? 'تغییر تصویر' : 'بارگذاری تصویر' }}
      </button>
      <button
        v-if="modelValue"
        type="button"
        class="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
        @click="removeImage"
      >
        حذف
      </button>
    </div>

    <input
      :value="modelValue"
      type="text"
      class="mt-2 w-full rounded-xl border border-brand-line px-3 py-2 text-xs outline-none focus:border-brand-green"
      placeholder="مسیر تصویر"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="mt-2 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
