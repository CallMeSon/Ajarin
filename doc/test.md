# Data Akun Testing - Ajarin Platform

Berikut adalah daftar akun testing yang telah di-seed ke dalam database untuk keperluan pengujian dan QA.

> [!WARNING]
> Jangan publikasikan atau letakkan informasi akun testing ini di antarmuka publik/halaman login produksi untuk mencegah risiko keamanan.

## Daftar Kredensial (Password = username + 123)

| Username | Password | Role | Nama Lengkap | Detail Profil / Keterangan |
|----------|----------|------|--------------|-----------------------------|
| `admin` | `admin123` | **admin** | Super Admin Ajarin | Memiliki hak akses penuh untuk mengelola verifikasi mentor di halaman `/admin/verifications`. |
| `mentee1` | `mentee123` | **mentee** | Budi Mentee | Pengguna biasa (murid). Sudah menyelesaikan onboarding. Siap untuk membuat request mentoring baru. |
| `mentor1` | `mentor123` | **mentor** | Sari Mentor | Mentor terverifikasi. Sudah menyelesaikan onboarding dan status verifikasi diatur ke *Approved*. Siap menerima proposal bimbingan. |

## Cara Menggunakan
1. Pastikan Anda telah melakukan migrasi dan seeding database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
2. Buka halaman login di `/login`.
3. Masukkan **Username** dan **Password** sesuai tabel di atas untuk masuk ke dashboard role terkait.
