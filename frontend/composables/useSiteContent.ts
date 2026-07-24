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
    { title: 'پزشکی سبک زندگی', icon: 'lifestyle' },
    { title: 'اپلیکیشن‌های تغذیه و رژیم درمانی', icon: 'app' },
    { title: 'تحقیقات علمی و پروژه‌های دانشگاهی', icon: 'research' },
  ],
  progressTitle: 'وضعیت پیشرفت پروژه',
  progressSteps: [
    { title: 'جمع‌آوری تصاویر', status: 'done', value: 100 },
    { title: 'لیبل‌گذاری (برچسب‌گذاری تصاویر)', status: 'done', value: 100 },
    { title: 'پاکسازی تصاویر و کنترل کیفیت', status: 'progress', value: 68 },
    { title: 'آماده‌سازی مدل هوش مصنوعی', status: 'progress', value: 42 },
    { title: 'انتشار نسخه Beta', status: 'pending', value: 18 },
    { title: 'انتشار API', status: 'pending', value: 8 },
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
      image: '/images/events/team-strategy.png',
      alt: 'جلسه تیم ایران فود — آماده‌سازی انتشار API',
    },
    {
      title: 'کارگاه لیبل‌گذاری',
      text: 'آموزش برچسب‌گذاری استاندارد تصاویر غذایی',
      date: '۱۴۰۳/۱۰/۰۵',
      image: '/images/events/labeling-tool.png',
      alt: 'جمع‌آوری تصاویر و لیبل‌زدن — کارگاه آموزشی',
    },
    {
      title: 'جمع‌آوری داده‌های جدید',
      text: 'فراخوان ارسال تصاویر غذاهای ایرانی',
      date: '۱۴۰۳/۰۹/۱۲',
      image: '/images/events/food-photography.png',
      alt: 'عکاسی حرفه‌ای غذاهای ایرانی برای دیتاست',
    },
    {
      title: 'جلسه تیم تحقیقاتی',
      text: 'بررسی پیشرفت پروژه تحت نظارت دانشگاه علوم پزشکی تهران',
      date: '۱۴۰۳/۰۸/۲۸',
      image: '/images/events/research-meeting.png',
      alt: 'جلسه تیم تحقیقاتی ایران فود',
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
