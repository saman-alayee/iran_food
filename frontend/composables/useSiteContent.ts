import { foodImages } from './useFoodImages';

export const siteContent = {
  brand: 'Iran Food',
  tagline: 'اولین دیتاست تصویری غذاهای ایرانی',
  supervisedBy: 'پژوهش تحت نظارت دانشگاه علوم پزشکی تهران',
  heroFeatures: [
    {
      icon: 'images',
      text: 'بیش از ۵۰٬۰۰۰ تصویر غذای ایرانی',
    },
    {
      icon: 'ai',
      text: 'مناسب برای هوش مصنوعی و حوزه سلامت',
    },
    {
      icon: 'standard',
      text: 'دیتاست استاندارد، به‌روز و قابل توسعه',
    },
  ],
  countdownTitle: 'نسخه اولیه ایران فود به زودی منتشر می‌شود',
  countdownItems: [
    'اولین نفری باشید که از انتشار آن مطلع می‌شود.',
    'با ارسال عکس غذاهای خود در این پروژه مشارکت کنید.',
    'با هم برای تغذیه بهتر، زندگی سالم‌تر، آینده روشن‌تر',
  ],
  whyTitle: 'چرا ایران فود مهم است؟',
  whyCards: [
    {
      title: 'اولین دیتاست استاندارد',
      text: 'اولین دیتاست استاندارد جامع غذاهای ایرانی',
    },
    {
      title: 'بهبود دقت مدل‌های هوش مصنوعی',
      text: 'آموزش مدل‌های دقیق‌تر با داده‌های واقعی و بومی',
    },
    {
      title: 'به‌روز و قابل توسعه',
      text: 'افزودن مداوم تصاویر جدید و صنایع غذایی بیشتر',
    },
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
    { title: 'تشخیص غذا با هوش مصنوعی', icon: 'ai' },
    { title: 'اپلیکیشن‌های تغذیه و رژیم درمانی', icon: 'app' },
    { title: 'تحقیقات علمی و پروژه‌های دانشگاهی', icon: 'research' },
  ],
  progressTitle: 'وضعیت پیشرفت پروژه',
  progressSteps: [
    { title: 'جمع‌آوری تصاویر', status: 'done' },
    { title: 'لیبل‌گذاری (برچسب‌گذاری تصاویر)', status: 'done' },
    { title: 'پاکسازی تصاویر و کنترل کیفیت', status: 'progress' },
    { title: 'آماده‌سازی مدل هوش مصنوعی', status: 'progress' },
    { title: 'انتشار نسخه Beta', status: 'pending' },
    { title: 'انتشار API', status: 'pending' },
  ],
  progressBars: [
    { label: 'پیشرفت جمع‌آوری داده‌ها', value: 65 },
    { label: 'پیشرفت توسعه سیستم', value: 45 },
  ],
  rewardsTitle: 'جوایز و امتیازات مشارکت‌کنندگان',
  rewardsIntro:
    'با ارسال عکس غذا امتیاز دریافت کنید و از جوایز ویژه بهره‌مند شوید:',
  rewards: [
    {
      title: 'دسترسی زودهنگام',
      text: 'دسترسی اولیه به نسخه Beta و API پروژه',
    },
    {
      title: 'جوایز ویژه',
      text: 'شرکت در قرعه‌کشی‌ها و جایزه‌های تشویقی',
    },
    {
      title: 'گواهی مشارکت',
      text: 'دریافت گواهی همکاری در پروژه ایران فود',
    },
    {
      title: 'امتیاز مشارکت',
      text: 'برای هر تصویر تأییدشده امتیاز دریافت کنید',
    },
  ],
  pointsTitle: 'سیستم امتیازدهی',
  points: [
    { action: 'آپلود تصویر تأییدشده', points: '+۱۰' },
    { action: 'لیبل‌گذاری تصاویر', points: '+۵' },
    { action: 'معرفی دوست', points: '+۱۵' },
  ],
  eventsTitle: 'رویدادها و اخبار پروژه',
  events: [
    {
      title: 'انتشار API',
      text: 'دسترسی توسعه‌دهندگان به API دیتاست ایران فود',
      date: '۱۴۰۳/۱۲/۲۰',
      image: foodImages[3].src,
      alt: foodImages[3].alt,
    },
    {
      title: 'نسخه Beta',
      text: 'انتشار نسخه آزمایشی و دسترسی اولیه مشارکت‌کنندگان',
      date: '۱۴۰۳/۱۱/۱۵',
      image: foodImages[15].src,
      alt: foodImages[15].alt,
    },
    {
      title: 'کارگاه لیبل‌گذاری',
      text: 'آموزش برچسب‌گذاری استاندارد تصاویر غذایی',
      date: '۱۴۰۳/۱۰/۰۵',
      image: foodImages[11].src,
      alt: foodImages[11].alt,
    },
    {
      title: 'جمع‌آوری داده‌های جدید',
      text: 'فراخوان ارسال تصاویر غذاهای ایرانی',
      date: '۱۴۰۳/۰۹/۱۲',
      image: foodImages[0].src,
      alt: foodImages[0].alt,
    },
    {
      title: 'جلسه تیم تحقیقاتی',
      text: 'بررسی پیشرفت پروژه تحت نظارت دانشگاه علوم پزشکی تهران',
      date: '۱۴۰۳/۰۸/۲۸',
      image: foodImages[16].src,
      alt: foodImages[16].alt,
    },
  ],
  footerSlogan: 'با هم برای تغذیه بهتر، سبک زندگی سالم‌تر، آینده روشن‌تر',
  nav: [
    { label: 'خانه', href: '#home' },
    { label: 'درباره ما', href: '#why' },
    { label: 'کاربردها', href: '#apps' },
    { label: 'رویدادها', href: '#events' },
    { label: 'مشارکت', href: '#rewards' },
    { label: 'تماس با ما', href: '#contact' },
  ],
  contact: {
    email: 'info@iranfood.ir',
    phone: '۰۲۱-۸۸۸۸۸۸۸۸',
    address: 'تهران، دانشگاه علوم پزشکی تهران',
  },
} as const;

export function useSiteContent() {
  return { siteContent };
}
