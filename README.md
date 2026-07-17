# Iran Food

Landing page + upload API + admin panel for the Iran Food visual dataset.

## Stack

- **Frontend:** Nuxt 3, Tailwind CSS, Composition API (SSR)
- **Backend:** Express.js
- **Database:** MongoDB + Mongoose

## Prerequisites

- Node.js 20+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

## Setup

```bash
# root
npm install

# backend
cd backend
npm install
cp .env.example .env

# frontend
cd ../frontend
npm install
```

Or from root after installing dependencies in both packages:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Run

```bash
# from root (both apps)
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Admin login: http://localhost:3000/admin/login

Default admin (auto-seeded on backend start):

- Email: `admin@iranfood.ir`
- Password: `Admin@123456`

Change these in `backend/.env` before production.

## Pages

| Path | Description |
|------|-------------|
| `/` | Landing page + upload modal |
| `/admin/login` | Admin login (JWT) |
| `/admin` | Uploaded images management |

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/auth/me` | JWT | Current admin |
| POST | `/api/uploads` | No | Upload one image (`name`, `phone?`, `image`) |
| GET | `/api/uploads` | JWT | List uploads |
| DELETE | `/api/uploads/:id` | JWT | Delete record + file |

## Security

- Helmet, CORS, rate limiting
- Input sanitization (XSS + mongo sanitize)
- Server & client validation
- Image type whitelist (JPG/PNG/WEBP) + magic-byte check
- File size limit (default 5MB)
- Password hashing (bcrypt)
- JWT auth for admin routes

## SEO

- SSR, meta tags, Open Graph, Twitter Card
- Canonical URL, Schema.org JSON-LD
- `robots.txt`, sitemap module
- Lazy-loaded images with alt text
