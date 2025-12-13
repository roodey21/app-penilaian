# Authentication Setup

## Overview
Aplikasi ini menggunakan autentikasi sederhana berbasis email + tanggal lahir yang akan diverifikasi ke API KPI Dashboard.

## Flow Autentikasi

1. **Landing Page** (`/` - `src/app/page.jsx`)
   - User pertama kali mengakses halaman login
   - Input email terdaftar
   - Input tanggal lahir untuk verifikasi
   - Setelah berhasil, redirect ke `/assessment`

2. **Assessment Page** (`/assessment` - `src/app/assessment/page.jsx`)
   - Hanya bisa diakses setelah autentikasi
   - Jika belum login, otomatis redirect ke `/`
   - Session disimpan di localStorage selama 1 hari

## Environment Variables

Tambahkan di `.env.local`:

```env
NEXT_PUBLIC_KPI_API_URL=https://your-kpi-api-url.com/api
```

## API Endpoint Required

Backend KPI Dashboard harus menyediakan endpoint:

### POST `/verify-dob`

**Request:**
```json
{
  "email": "employee@lpphotel.com",
  "birth_date": "1990-01-23"
}
```

**Response (Success):**
```json
{
  "token": "session-token-here",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@lpphotel.com",
    "username": "johndoe",
    "department_id": 1,
    "property_id": 1
  }
}
```

**Response (Error):**
```json
{
  "message": "Invalid credentials"
}
```

## Session Management

Session disimpan menggunakan `src/utils/session.js`:
- Token dan user data disimpan di `localStorage`
- Expiry: 24 jam
- Auto-redirect ke login jika session expired

## Files Structure

```
src/
├── app/
│   ├── page.jsx                    # Login page (root)
│   └── assessment/
│       └── page.jsx                # Assessment page (protected)
├── utils/
│   └── session.js                  # Session management
└── components/
    └── auth/                       # (removed - logic moved to page.jsx)
```

## Development

Run dev server:
```bash
npm run dev
```

Access:
- Login: http://localhost:3000
- Assessment: http://localhost:3000/assessment (auto-redirect if not logged in)

## Production Deployment

1. Set environment variable `NEXT_PUBLIC_KPI_API_URL` di hosting platform
2. Build: `npm run build`
3. Start: `npm start`

## Notes

- Desain login menggunakan gradient emerald-sky dengan Lucide icons
- Responsive untuk mobile dan desktop
- Error handling untuk API failures
- Loading states untuk better UX
