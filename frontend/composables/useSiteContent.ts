import { foodImages } from './useFoodImages';

export const defaultSiteContent = {
  brand: 'Iran Food',
  tagline: 'اولین دیتاست تصویری غذاهای ایرانی',
  supervisedBy: 'پژوهش تحت نظارت دانشگاه علوم پزشکی تهران',
  footerSlogan: 'با هم برای تغذیه بهتر، سبک زندگی سالم‌تر، آینده روشن‌تر',
  countdownTitle: 'نسخه اولیه ایران فود به زودی منتشر می‌شود',
  countdownTargetDate: '',
  countdownTimerLabel: 'زمان باقی‌مانده تا انتشار',
  countdownItems: [
    'اولین نفری باشید که از انتشار آن مطلع می‌شود.',
    'با ارسال عکس غذاهای خود در این پروژه مشارکت کنید.',
    'با هم برای تغذیه بهتر، زندگی سالم‌تر، آینده روشن‌تر',
  ],
  countdownImage: '/images/coming-soon-hero.png',
  whyTitle: 'چرا ایران فود مهم است؟',
  whyImage: '/images/why-section-hero.png',
  whyCards: [
    { title: 'اولین دیتاست استاندارد', text: 'اولین دیتاست استاندارد جامع غذاهای ایرانی' },
    { title: 'بهبود دقت مدل‌های هوش مصنوعی', text: 'آموزش مدل‌های دقیق‌تر با داده‌های واقعی و بومی' },
    { title: 'به‌روز و قابل توسعه', text: 'افزودن مداوم تصاویر جدید و صنایع غذایی بیشتر' },
    {
      title: 'کاربرد گسترده در اپلیکیشن‌ها',
      text: 'مناسب برای حوزه سلامت، تغذیه، پزشکی سبک زندگی و صنایع غذایی دیجیتال',
    },
  ],
  appsTitle: 'کاربردهای دیتاست ایران فود',
  apps: [
    { title: 'سلامت دیجیتال و پایش تغذیه', icon: 'health' },
    { title: 'Benchmark و ارزیابی مدل‌ها', icon: 'benchmark' },
    { title: 'API برای توسعه‌دهندگان', icon: 'api' },
    { title: 'پزشکی سبک زندگی', icon: 'ai' },
    { title: 'اپلیکیشن‌های تغذیه و رژیم درمانی', icon: 'app' },
    { title: 'تحقیقات علمی و پروژه‌های دانشگاهی', icon: 'research' },
  ],
  progressTitle: 'وضعیت پیشرفت پروژه',
  progressSteps: [
    { title: 'جمع‌آوری تصاویر', status: 'done', value: 100 },
    { title: 'لیبل‌گذاری (برچسب‌گذاری تصاویر)', status: 'done', value: 100 },
    { title: 'پاکسازی تصاویر و کنترل کیفیت', status: 'progress', value: 62 },
    { title: 'آماده‌سازی مدل هوش مصنوعی', status: 'progress', value: 45 },
    { title: 'انتشار نسخه Beta', status: 'pending', value: 0 },
    { title: 'انتشار API', status: 'pending', value: 0 },
  ],
  progressBars: [
    { label: 'پیشرفت جمع‌آوری داده‌ها', value: 65 },
    { label: 'پیشرفت توسعه سیستم', value: 45 },
  ],
  rewardsTitle: 'جوایز و امتیازات مشارکت‌کنندگان',
  rewardsIntro: 'با ارسال عکس غذا امتیاز دریافت کنید و از جوایز ویژه بهره‌مند شوید:',
  rewards: [
    { title: 'دسترسی زودهنگام', text: 'دسترسی اولیه به نسخه Beta و API پروژه' },
    { title: 'جوایز ویژه', text: 'شرکت در قرعه‌کشی‌ها و جایزه‌های تشویقی' },
    { title: 'گواهی مشارکت', text: 'دریافت گواهی همکاری در پروژه ایران فود' },
    { title: 'امتیاز مشارکت', text: 'برای هر تصویر تأییدشده امتیاز دریافت کنید' },
  ],
  pointsTitle: 'سیستم امتیازدهی',
  points: [
    { action: 'آپلود تصویر تأییدشده', points: '+۱۰' },
    { action: 'لیبل‌گذاری تصاویر', points: '+۵' },
    { action: 'معرفی دوست', points: '+۱۵' },
  ],
  collaborationsTitle: 'همکاری‌ها',
  collaborations: [
    { title: 'رستوران‌ها و مراکز تهیه غذا', text: 'ارسال تصاویر استاندارد غذاهای منو' },
    { title: 'کارخانجات صنایع غذایی', text: 'مشارکت در غنی‌سازی دیتاست ملی' },
  ],
  eventsTitle: 'رویدادها و اخبار پروژه',
  events: [
    {
      title: 'انتشار API',
      text: 'دسترسی توسعه‌دهندگان به API دیتاست ایران فود',
      date: '۱۴۰۳/۱۲/۲۰',
      image: '/images/events/team-strategy.png',
      alt: 'انتشار API',
    },
    {
      title: 'کارگاه لیبل‌گذاری',
      text: 'آموزش برچسب‌گذاری استاندارد تصاویر غذایی',
      date: '۱۴۰۳/۱۰/۰۵',
      image: '/images/events/labeling-tool.png',
      alt: 'کارگاه لیبل‌گذاری',
    },
  ],
  nav: [
    { label: 'خانه', href: '#home' },
    { label: 'درباره ما', href: '#about' },
    { label: 'کاربردها', href: '#apps' },
    { label: 'رویدادها', href: '#events' },
    { label: 'مشارکت', href: '#rewards' },
    { label: 'تماس با ما', href: '#contact' },
  ],
  contact: {
    email: 'info@iranfood.ir',
    phone: '۰۲۱-۸۸۸۸۸۸۸۸',
    address: 'تهران، دانشگاه علوم پزشکی تهران',
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    linkedin: 'https://linkedin.com',
  },
  uploadGuideTitle: 'دستورالعمل استاندارد عملیاتی (SOP)',
  uploadModalTitle: 'آپلود عکس',
  uploadModalSubtitle: 'پروتکل تصویربرداری از نمونه‌های غذایی',
  uploadButtonLabel: 'آپلود عکس',
  participateButtonLabel: 'مشارکت در پروژه',
  uploadSubmitLabel: 'ارسال',
  uploadGuideVideoUrl: '/images/project/photo-shoot.png',
  uploadGuideVideoPoster: '/images/project/photo-shoot.png',
  uploadPhotoSpecs: [
    {
      label: 'کیفیت دوربین',
      value:
        'بالاترین کیفیت JPEG؛ وضوح ۷۲۰ پیکسل یا DPI ۳۰۰ — کافی برای دیده شدن دانه‌های برنج و جزئیات غذا',
    },
    {
      label: 'زاویه تصویربرداری',
      value: 'از ۳ زاویه اجباری: بالا (عمودی)، روبرو، و مورب ۴۵ درجه — فقط یک زاویه کافی نیست',
    },
    {
      label: 'نور و فلاش',
      value: 'از فلاش استفاده نکنید؛ نور یکنواخت (ترجیحاً طبیعی کنار پنجره) — فلاش خاموش',
    },
    {
      label: 'رنگ‌ها (وایت‌بالانس)',
      value: 'حالت خودکار خاموش؛ تنظیم دستی متناسب با نور محیط',
    },
    {
      label: 'پس‌زمینه',
      value: 'ساده و غیربراق؛ منو، لیوان و اشیاء اضافی را از کادر خارج کنید',
    },
    {
      label: 'کارت مرجع',
      value: 'یک قاشق یا چنگال غذاخوری کنار بشقاب در لبه قاب قرار دهید',
    },
    {
      label: 'فاصله تا بشقاب',
      value: '۳۰ تا ۴۰ سانتی‌متر (یک تا دو وجب)، ثابت برای همه زاویه‌ها',
    },
    {
      label: 'غذاهای ترکیبی',
      value:
        'در صورت امکان قبل از مخلوط کردن جداگانه عکس بگیرید؛ در غیر این صورت برچسب «مخلوط شده» روی عکس بنویسید',
    },
    {
      label: 'فیلم چرخشی ۳۶۰°',
      value: '۱۵ ثانیه، حرکت آرام و ثابت دور بشقاب — بدون لرزش و عجله',
    },
    {
      label: 'یادداشت نام غذا',
      value: 'نام رایج و کامل غذا را بلافاصله در گوشی یادداشت کنید',
    },
    {
      label: 'بررسی نهایی',
      value: 'وضوح، رنگ‌ها، عدم وجود سایه و تار بودن را قبل از ارسال کنترل کنید',
    },
    {
      label: 'ثابت نگه داشتن گوشی',
      value: 'دوربین را روی میز تکیه دهید یا با دو دست بگیرید',
    },
  ],
  heroFeatures: [
    { icon: 'images', text: 'بیش از ۵۰٬۰۰۰ تصویر غذای ایرانی' },
    { icon: 'ai', text: 'مناسب برای هوش مصنوعی و حوزه سلامت' },
    { icon: 'standard', text: 'دیتاست استاندارد، به‌روز و قابل توسعه' },
  ],
  heroThumbs: foodImages.map((item) => ({
    src: item.src,
    alt: item.alt,
    name: item.name,
  })),
  processGalleryTitle: 'فرآیند ساخت دیتاست',
  processGalleryIntro: 'نگاهی به مراحل جمع‌آوری، لیبل‌گذاری و کنترل کیفیت تصاویر در پروژه ایران فود.',
  processGallery: [
    { src: '/images/project/team-planning.png', alt: 'برنامه‌ریزی تیم', caption: 'برنامه‌ریزی و طراحی' },
    { src: '/images/project/photo-shoot.png', alt: 'عکاسی غذا', caption: 'عکاسی استاندارد' },
    { src: '/images/project/labeling-tool.png', alt: 'ابزار لیبل‌گذاری', caption: 'لیبل‌گذاری دقیق' },
    { src: '/images/project/team-collaboration.png', alt: 'همکاری تیم', caption: 'کنترل کیفیت' },
  ],
} as const;

export type SiteContent = typeof defaultSiteContent;

export function parseCountdownTarget(raw: string | undefined | null): Date | null {
  if (!raw || !String(raw).trim()) return null;
  const text = String(raw).trim();
  const iso = Date.parse(text);
  if (!Number.isNaN(iso)) return new Date(iso);

  const faMatch = text.match(/(\d+)\s*روز[\s\S]*?(\d+)\s*ساعت/);
  if (faMatch) {
    const date = new Date();
    date.setDate(date.getDate() + Number(faMatch[1]));
    date.setHours(date.getHours() + Number(faMatch[2]), 0, 0, 0);
    return date;
  }
  return null;
}

export function resolveCountdownRaw(data: Record<string, unknown>): string {
  const dateField = data.countdownTargetDate;
  if (dateField && parseCountdownTarget(String(dateField))) {
    return String(dateField).trim();
  }
  const legacy = data.countdownTarget;
  if (legacy) {
    const parsed = parseCountdownTarget(String(legacy));
    if (parsed) return parsed.toISOString();
  }
  return '';
}

export function normalizeSiteContent(data: Partial<SiteContent> & Record<string, unknown>): SiteContent {
  const merged = { ...structuredClone(defaultSiteContent), ...data } as SiteContent &
    Record<string, unknown>;

  const images = data.images as { countdownHero?: string; whyHero?: string } | undefined;
  if (images?.countdownHero && !data.countdownImage) {
    merged.countdownImage = images.countdownHero.startsWith('/')
      ? images.countdownHero
      : `/${images.countdownHero}`;
  }
  if (images?.whyHero && !data.whyImage) {
    merged.whyImage = images.whyHero.startsWith('/') ? images.whyHero : `/${images.whyHero}`;
  }
  if (images?.logo) {
    (merged as SiteContent & { images?: { logo?: string } }).images = {
      ...(merged as SiteContent & { images?: { logo?: string } }).images,
      logo: images.logo.startsWith('/') ? images.logo : `/${images.logo}`,
    };
  }

  const appIcons = ['health', 'benchmark', 'api', 'ai', 'app', 'research'] as const;
  const whyLooksLikeApps = /کاربرد/.test(String(merged.whyTitle || ''));
  if (!merged.apps?.length) {
    if (whyLooksLikeApps && merged.whyCards?.length) {
      merged.apps = merged.whyCards.map((card, index) => ({
        title: card.title,
        icon: appIcons[index % appIcons.length],
      }));
      merged.appsTitle = merged.whyTitle || defaultSiteContent.appsTitle;
      merged.whyTitle = defaultSiteContent.whyTitle;
      merged.whyCards = [...defaultSiteContent.whyCards];
    } else {
      merged.apps = [...defaultSiteContent.apps];
    }
  }
  if (!String(merged.appsTitle || '').trim()) {
    merged.appsTitle = defaultSiteContent.appsTitle;
  }

  const countdownRaw = resolveCountdownRaw(data);
  merged.countdownTargetDate = countdownRaw
    ? (parseCountdownTarget(countdownRaw)?.toISOString() ?? '')
    : '';

  if (Array.isArray(merged.nav)) {
    merged.nav = merged.nav.map((item) => {
      let href = item.href;
      if (item.label === 'درباره ما' || href === '#countdown' || href === '#why-old') {
        href = '#about';
      }
      if (item.label === 'کاربردها' || href === '#apps' || href === '#why') href = '#apps';
      return { ...item, href };
    });
  }

  if (!merged.collaborations?.length && Array.isArray(merged.points)) {
    merged.collaborations = merged.points
      .filter((p) => String(p.action || '').trim())
      .map((p) => ({
        title: String(p.action).trim(),
        text: String(p.points || '').trim(),
      }));
  }

  if (!merged.uploadGuideTitle) merged.uploadGuideTitle = defaultSiteContent.uploadGuideTitle;
  if (!merged.uploadModalTitle) merged.uploadModalTitle = defaultSiteContent.uploadModalTitle;
  if (!merged.uploadModalSubtitle) merged.uploadModalSubtitle = defaultSiteContent.uploadModalSubtitle;
  if (!merged.uploadButtonLabel) merged.uploadButtonLabel = defaultSiteContent.uploadButtonLabel;
  if (!merged.participateButtonLabel) {
    merged.participateButtonLabel = defaultSiteContent.participateButtonLabel;
  }
  if (!merged.uploadSubmitLabel) merged.uploadSubmitLabel = defaultSiteContent.uploadSubmitLabel;
  if (!merged.uploadGuideVideoUrl) {
    merged.uploadGuideVideoUrl = defaultSiteContent.uploadGuideVideoUrl;
  }
  if (!merged.uploadPhotoSpecs?.length) {
    merged.uploadPhotoSpecs = [...defaultSiteContent.uploadPhotoSpecs];
  }
  if (!merged.countdownTimerLabel) {
    merged.countdownTimerLabel = defaultSiteContent.countdownTimerLabel;
  }

  return merged;
}

export function useSiteContent() {
  const { apiFetch } = useApi();
  const siteContentState = useState<SiteContent>('site-content', () =>
    structuredClone(defaultSiteContent) as SiteContent
  );
  const siteContentLoaded = useState('site-content-loaded', () => false);

  async function loadSiteContent(force = false) {
    if (siteContentLoaded.value && !force) return siteContentState.value;
    try {
      const res = await apiFetch<{ success: boolean; data: SiteContent }>('/api/content');
      siteContentState.value = normalizeSiteContent(res.data as SiteContent & Record<string, unknown>);
      siteContentLoaded.value = true;
    } catch {
      siteContentState.value = structuredClone(defaultSiteContent) as SiteContent;
    }
    return siteContentState.value;
  }

  if (import.meta.client && !siteContentLoaded.value) {
    loadSiteContent();
  }

  return {
    siteContent: computed(() => siteContentState.value),
    loadSiteContent,
  };
}

export function resolveCountdownTarget(raw: string | undefined | null) {
  const target = parseCountdownTarget(raw);
  if (target) return target;
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 45);
  fallback.setHours(fallback.getHours() + 12, 0, 0, 0);
  return fallback;
}

export function computeCountdownRemaining(target: Date, nowMs = Date.now()) {
  const diff = Math.max(0, target.getTime() - nowMs);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    expired: target.getTime() <= nowMs,
  };
}

export function toDatetimeLocalValue(iso: string | undefined | null) {
  const date = parseCountdownTarget(iso);
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(local: string) {
  if (!local || !local.trim()) return '';
  const date = new Date(local);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

export function assetUrl(path: string, apiBase: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.startsWith('/uploads/')) {
    const root = apiBase.replace(/\/api\/?$/, '').replace(/\/dataset\/v1\/?$/, '');
    return `${root}${normalized}`;
  }
  return normalized;
}
