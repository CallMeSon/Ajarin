# Kebijakan Keamanan (Security Policy)

Platform Ajarin berkomitmen untuk melindungi data pengguna dan menjaga keamanan sistem. Dokumen ini menjelaskan mekanisme keamanan utama yang diterapkan pada platform Ajarin berdasarkan analisis dokumen proyek.

## Versi yang Didukung

Platform ini masih dalam tahap pengembangan aktif. Saat ini, versi yang didukung dengan pembaruan keamanan adalah versi terbaru yang ada di branch `main`.

| Versi | Didukung |
|-------|----------|
| 1.0.x | :white_check_mark: |
| < 1.0 | :x: |

## Mekanisme Keamanan Utama

Berdasarkan spesifikasi sistem (SRS, PRD, dan BRD), berikut adalah pilar keamanan platform Ajarin:

1. **Autentikasi (Google OAuth 2.0)**
   - Autentikasi dilakukan secara eksklusif menggunakan Google OAuth 2.0 (melalui NextAuth.js).
   - Platform **tidak pernah** meminta, menerima, maupun menyimpan kata sandi (password) pengguna secara manual.
   - Mengelola sesi menggunakan token (Session Tokens) yang aman.

2. **Keamanan Database (Supabase)**
   - **Row Level Security (RLS):** Seluruh tabel diaktifkan fitur RLS. Pengguna hanya dapat membaca atau memodifikasi data yang relevan dengan akun mereka.
   - **Enkripsi Data:** Data sensitif pada database dienkripsi *at rest* oleh Supabase.
   - **Retensi Data:** Data obrolan (chat) teks tidak disimpan permanen dan file/materi pembelajaran yang diunggah akan dihapus secara otomatis setelah 1 bulan (30 hari).

3. **Komunikasi yang Aman**
   - **HTTPS Wajib:** Segala bentuk komunikasi antara klien dan server wajib melalui protokol HTTPS.
   - **CSRF Protection:** NextAuth.js menyertakan token CSRF (Cross-Site Request Forgery) bawaan pada setiap form action.

4. **Keamanan Finansial**
   - Platform tidak memproses transaksi keuangan secara langsung (transaksi *off-platform*), menghindari kompleksitas regulasi dan meminimalisir risiko finansial di awal.

## Pelaporan Celah Keamanan (Vulnerabilities)

Jika Anda menemukan celah keamanan dalam platform Ajarin, kami sangat menghargai kerja sama Anda untuk melaporkannya secara privat.

**Harap JANGAN membuat isu (Issue) publik terkait celah keamanan.**

### Cara Melapor:
1. Kirimkan email laporan Anda ke tim keamanan kami di: `[Email Keamanan Tim Anda, misalnya: security@ajarin.id]`
2. Sertakan detail temuan (vulnerability), langkah-langkah untuk mereproduksi (reproduce steps), dan potensi dampaknya.

Kami akan merespons laporan Anda secepat mungkin dan akan bekerja sama untuk memberikan perbaikan (patch).

## Kepatuhan (Compliance)
Kami secara tegas mematuhi *Ketentuan Layanan Google OAuth*, termasuk kepatuhan untuk tidak menyimpan kredensial (password) Google pengguna dalam bentuk apapun.
