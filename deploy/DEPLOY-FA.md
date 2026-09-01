# راهنمای استقرار Iran Food روی هاست میهن وب

## وضعیت فعلی

| بخش | وضعیت |
|-----|--------|
| فرانت‌اند (Nuxt) | ✅ آپلود شده در `public_html` |
| ساب‌دامین API | ✅ `api.iranfoodd.ir` → `~/iran_food/backend` |
| بک‌اند (Express + Node 20) | ✅ Passenger + `app.cjs` + **MySQL** |
| MySQL | ✅ `zjdekntt_iranfood` + کاربر `zjdekntt_ifoodu` (localhost) |
| DNS دامنه | ⏳ NS یا رکورد A به `89.39.208.237` |
| SSL | ⏳ پس از فعال شدن DNS (AutoSSL) |

---

## ۱. تنظیم DNS دامنه

اگر دامنه را از جای دیگری خریده‌اید، این DNSها را ست کنید:

```
ns869.mihanwebhost.com
ns870.mihanwebhost.com
```

یا رکورد A:
```
iranfoodd.ir     →  89.39.208.237
www.iranfoodd.ir →  89.39.208.237
api.iranfoodd.ir →  89.39.208.237
```

---

## ۲. فعال‌سازی Node.js (API)

Node.js **روی اکانت فعال است** (CloudLinux Selector + Passenger). اپ با **`app.cjs`** و Node **20** اجرا می‌شود.

اگر API خطا داد، در cPanel → **Setup Node.js App**:
- **Application root:** `iran_food/backend`
- **Application URL:** `api.iranfoodd.ir`
- **Startup file:** `app.cjs`
- **Run NPM Install** و **Restart**

### اپلیکیشن API (بک‌اند) — مرجع
- **Application root:** `iran_food/backend`
- **Application URL:** `api.iranfoodd.ir`
- **Startup file:** `app.cjs`
- **Node version:** 20 یا بالاتر
- **Run NPM Install** و سپس **Restart**

### متغیرهای محیطی (Environment Variables)
```
PORT=4000
NODE_ENV=production
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=zjdekntt_...
MYSQL_PASSWORD=...
MYSQL_DATABASE=zjdekntt_iranfood
JWT_SECRET=<مقدار از فایل .env>
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://iranfoodd.ir
UPLOAD_MAX_SIZE_MB=5
ADMIN_EMAIL=admin@iranfood.ir
ADMIN_PASSWORD=<رمز قوی>
ADMIN_NAME=Admin
```

---

## ۳. MySQL (روی همان هاست)

1. cPanel → **MySQL® Databases**
2. Database جدید (مثلاً `iranfood`) → نام کامل: `zjdekntt_iranfood`
3. User جدید با رمز قوی → **Add User To Database** → همه دسترسی‌ها (ALL PRIVILEGES)
4. مقادیر را در `~/iran_food/backend/.env` بگذارید (`MYSQL_HOST=127.0.0.1`)
5. جداول با اولین اجرای API ساخته می‌شوند (یا `npm run seed` در Node app)

---

## ۴. SSL (HTTPS)

پس از فعال شدن DNS:
1. cPanel → SSL/TLS Status → Run AutoSSL
2. یا از پشتیبانی بخواهید SSL رایگان Let's Encrypt فعال شود

---

## ۵. به‌روزرسانی سایت

```powershell
# بیلد فرانت‌اند
cd frontend
$env:NUXT_PUBLIC_API_BASE="https://api.iranfoodd.ir"
$env:NUXT_PUBLIC_SITE_URL="https://iranfoodd.ir"
npm run generate

# آپلود
powershell -ExecutionPolicy Bypass -File deploy/upload-ftp.ps1 `
  -LocalPath "frontend/.output/public" `
  -RemotePath "/public_html"
```

---

## آدرس‌ها

| سرویس | آدرس |
|--------|------|
| سایت | https://iranfoodd.ir |
| API | https://api.iranfoodd.ir |
| پنل ادمین | https://iranfoodd.ir/admin/login |
| cPanel | http://iranfoodd.ir/cpanel |

---

## FTP

- **Host:** `89.39.208.237`
- **User:** `zjdekntt`
- **Port:** 21
