const MAX_MB = 5;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export function usePhotoUpload() {
  const { apiFetch } = useApi();

  const name = ref('');
  const phone = ref('');
  const file = ref<File | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);
  const loading = ref(false);
  const error = ref('');
  const success = ref('');

  function resetMessages() {
    error.value = '';
    success.value = '';
  }

  function resetForm() {
    name.value = '';
    phone.value = '';
    file.value = null;
    if (fileInput.value) fileInput.value.value = '';
  }

  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const selected = input.files?.[0] || null;
    resetMessages();

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

  async function submit(onSuccess?: () => void) {
    resetMessages();
    if (!validateClient() || !file.value) return false;

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
      resetForm();
      onSuccess?.();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'ارسال ناموفق بود.';
      if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg.includes('Load failed')) {
        error.value =
          'ارتباط با سرور API برقرار نشد. اگر مرورگر «Not secure» نشان می‌دهد، ابتدا SSL را در cPanel (AutoSSL) فعال کنید، یا یک‌بار https://api.iranfoodd.ir/api/health را باز کنید و گواهی را تأیید کنید، سپس دوباره تلاش کنید.';
      } else {
        error.value = msg;
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    name,
    phone,
    file,
    fileInput,
    loading,
    error,
    success,
    maxMb: MAX_MB,
    resetMessages,
    resetForm,
    onFileChange,
    submit,
  };
}
