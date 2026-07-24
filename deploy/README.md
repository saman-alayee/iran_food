# استقرار و رفع خطای بک‌اند (Mihanwebhost)

## علت خطا

1. **BitNinja** روی `public_html` مسیرهای `/api/` و اسکریپت‌های PHP پروکسی را **۴۰۳** می‌کند؛ بنابراین `apiBase` خالی روی همان دامنه کار نمی‌کند.
2. **API واقعی** روی `https://api.iranfoodd.ir` سالم است (`/api/health` → JSON). CORS برای `https://iranfoodd.ir` فعال است.
3. تا وقتی **گواهی SSL معتبر** (Let's Encrypt) نصب نشود، مرورگر ممکن است درخواست `fetch` به ساب‌دامنه را به‌خاطر گواهی self-signed رد کند.

## وضعیت فعلی (پس از پچ)

- `index.html`: `apiBase:"https://api.iranfoodd.ir"`
- باندل‌های `_nuxt/*.js`: مسیرها `/api/...` (نه `/dataset/v1/`)

## SSL (رفع «Not Secure»)

در cPanel:

1. **SSL/TLS Status** → Run AutoSSL برای `iranfoodd.ir`, `www`, `api.iranfoodd.ir`
2. اگر AutoSSL خطای `Can't locate Cpanel/API/AutoSSL.pm` داد → تیکت به پشتیبانی میهن‌وب‌هاست.

بعد از نصب گواهی معتبر، سایت و آپلود بدون هشدار کار می‌کند.

**موقت:** یک‌بار در مرورگر باز کنید: `https://api.iranfoodd.ir/api/health` و در صورت هشدار، گواهی را بپذیرید؛ سپس صفحه اصلی را رفرش کنید.

## API روی همان دامنه (بدون ساب‌دامین)

Node با **Passenger** زیر `https://iranfoodd.ir/dataset/v1/` (فایل `public_html/dataset/v1/.htaccess`).

```powershell
python -u deploy/setup_main_domain_api.py
```

تست: `https://iranfoodd.ir/dataset/v1/api/health`

بعد از تأیید، در cPanel می‌توانید اپ Node روی `api.iranfoodd.ir` را حذف یا غیرفعال کنید.

## اسکریپت‌های FTP (رمز در `deploy/.ftp-secret.local` — commit نشود)

```powershell
python -u deploy/fix_production.py      # آپلود bridge + htaccess (در صورت نیاز)
python -u deploy/patch_api_base.py      # تنظیم apiBase روی فایل‌های استاتیک
```

## ری‌استارت Node (Passenger)

cPanel → **Setup Node.js App** → اپ `iran_food/backend` → **Restart**.

اگر در `logs/iran-food-api.log` خطای `MODULE_NOT_FOUND` دیدید ولی health جواب می‌دهد، لاگ قدیمی است؛ در غیر این case از File Manager بررسی کنید `iran_food/backend/node_modules/mysql2` وجود دارد.

## امنیت

رمز FTP/cPanel که در چت فرستاده شده را **حتماً عوض کنید**.
