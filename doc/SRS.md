# SRS — Software Requirements Specification

**Produk:** Ajarin
**Versi:** 1.0 (MVP)
**Tanggal:** 16 Mei 2026
**Status:** Draft
**Referensi Dokumen:** PRD Ajarin v1.1, BRD Ajarin v1.0

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Deskripsi Umum Sistem](#2-deskripsi-umum-sistem)
3. [Aktor & Peran](#3-aktor--peran)
4. [Kebutuhan Fungsional](#4-kebutuhan-fungsional)
5. [Kebutuhan Non-Fungsional](#5-kebutuhan-non-fungsional)
6. [Kebutuhan Antarmuka Eksternal](#6-kebutuhan-antarmuka-eksternal)
7. [Spesifikasi API](#7-spesifikasi-api)
8. [Kebutuhan Keamanan](#8-kebutuhan-keamanan)
9. [Kebutuhan Database](#9-kebutuhan-database)
10. [Batasan Sistem](#10-batasan-sistem)
11. [Kasus Uji Penerimaan](#11-kasus-uji-penerimaan)
12. [Glosarium](#12-glosarium)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini merupakan Software Requirements Specification (SRS) untuk platform Ajarin. Dokumen ini mendefinisikan seluruh kebutuhan perangkat lunak secara teknis dan terperinci, mencakup kebutuhan fungsional, non-fungsional, antarmuka, keamanan, dan database. Dokumen ini ditujukan untuk tim engineering, QA, dan technical stakeholder sebagai acuan implementasi.

### 1.2 Ruang Lingkup Sistem

Ajarin adalah aplikasi web berbasis C2C (Consumer-to-Consumer) yang memfasilitasi pertemuan antara Mentee dan Mentor melalui mekanisme request dan proposal. Sistem ini mencakup:

- Aplikasi web yang dapat diakses melalui browser desktop dan mobile.
- Backend API untuk mengelola seluruh logika bisnis.
- Database relasional untuk menyimpan data pengguna, request, proposal, match, chat, dan review.
- Integrasi dengan layanan pihak ketiga: Google OAuth, Supabase Realtime, dan layanan email.

Sistem ini **tidak** mencakup:
- Aplikasi mobile native (iOS/Android).
- Payment gateway dan escrow.
- Video call terintegrasi.

### 1.3 Definisi Singkatan

| Singkatan | Kepanjangan |
|-----------|------------|
| SRS | Software Requirements Specification |
| FR | Functional Requirement (Kebutuhan Fungsional) |
| NFR | Non-Functional Requirement (Kebutuhan Non-Fungsional) |
| API | Application Programming Interface |
| OAuth | Open Authorization |
| JWT | JSON Web Token |
| ERD | Entity Relationship Diagram |
| MVP | Minimum Viable Product |
| SSR | Server-Side Rendering |
| LCP | Largest Contentful Paint |

### 1.4 Referensi

- PRD Ajarin v1.1
- BRD Ajarin v1.0
- IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications
- UU PDP No. 27 Tahun 2022 (Undang-Undang Perlindungan Data Pribadi)
- Google OAuth 2.0 Documentation

---

## 2. Deskripsi Umum Sistem

### 2.1 Perspektif Produk

Ajarin adalah sistem mandiri berbasis web yang tidak bergantung pada platform lain untuk fungsi utamanya. Sistem ini berinteraksi dengan layanan eksternal berikut:

- **Google OAuth 2.0:** Sebagai satu-satunya mekanisme autentikasi pengguna.
- **Supabase:** Sebagai penyedia database PostgreSQL, storage file, dan layanan real-time (WebSocket).
- **Resend:** Sebagai layanan pengiriman email transaksional.
- **Vercel:** Sebagai platform hosting untuk frontend dan API Routes.

### 2.2 Fungsi Utama Sistem

Secara garis besar, sistem harus mampu menjalankan fungsi-fungsi berikut:

1. Mengautentikasi pengguna melalui Google OAuth dan mengelola sesi.
2. Menyimpan dan menampilkan profil Mentee dan Mentor.
3. Menerima, menyimpan, dan menampilkan request belajar dari Mentee.
4. Menerima, menyimpan, dan menampilkan proposal dari Mentor.
5. Memproses keputusan match dari Mentee dan memperbarui status seluruh entitas terkait.
6. Menyediakan kanal chat real-time antara pasangan yang sudah matched.
7. Menyimpan dan menampilkan review serta rating pasca sesi.
8. Mengirimkan notifikasi email pada setiap event penting.

### 2.3 Karakteristik Pengguna

| Peran | Karakteristik Teknis | Frekuensi Penggunaan |
|-------|---------------------|----------------------|
| Mentee | Familiar dengan browser dan Google login, tidak perlu keahlian teknis khusus | Sesekali, ketika ada kebutuhan belajar baru |
| Mentor | Familiar dengan browser dan Google login, memiliki keahlian di bidang yang diajarkan | Rutin, untuk memantau request baru dan mengelola proposal |

### 2.4 Asumsi Teknis

- Pengguna mengakses sistem melalui browser modern yang mendukung JavaScript ES6 ke atas.
- Pengguna memiliki koneksi internet aktif dengan kecepatan minimal 1 Mbps.
- Pengguna sudah memiliki akun Google yang aktif.
- Server berjalan di lingkungan Node.js 18 ke atas.

---

## 3. Aktor & Peran

### 3.1 Daftar Aktor

| Aktor | Deskripsi |
|-------|-----------|
| **Mentee** | Pengguna terdaftar yang membuat request belajar, mereview proposal, dan memilih Mentor. |
| **Mentor** | Pengguna terdaftar yang membrowse request aktif, mengirim proposal, dan menerima Mentee. |
| **Sistem** | Proses otomatis yang dijalankan oleh server, seperti pengiriman email dan pembaruan status. |
| **Google OAuth** | Layanan eksternal yang memverifikasi identitas pengguna saat login. |

### 3.2 Matriks Akses Fitur per Aktor

| Fitur | Mentee | Mentor | Sistem |
|-------|:------:|:------:|:------:|
| Login dengan Google | Ya | Ya | Tidak |
| Membuat request | Ya | Tidak | Tidak |
| Melihat list request | Tidak | Ya | Tidak |
| Mengirim proposal | Tidak | Ya | Tidak |
| Mereview proposal | Ya | Tidak | Tidak |
| Memilih Mentor (trigger match) | Ya | Tidak | Tidak |
| Mengakses chat | Ya (post-match) | Ya (post-match) | Tidak |
| Memberi review | Ya | Tidak | Tidak |
| Membalas review | Tidak | Ya | Tidak |
| Mengirim email notifikasi | Tidak | Tidak | Ya |
| Menutup request | Ya | Tidak | Ya (otomatis H+7) |

---

## 4. Kebutuhan Fungsional

Setiap kebutuhan fungsional diberi ID unik dengan format **FR-XX** dan dikaitkan ke fitur di PRD.

---

### 4.1 Modul Autentikasi & Onboarding

#### FR-01: Login dengan Google OAuth

- **Deskripsi:** Sistem menyediakan tombol "Login dengan Google" yang mengarahkan pengguna ke alur Google OAuth 2.0.
- **Input:** Klik tombol login.
- **Proses:**
  1. Sistem melakukan redirect ke halaman otorisasi Google.
  2. Google mengembalikan authorization code ke callback URL sistem.
  3. Sistem menukar authorization code dengan access token dan data profil Google.
  4. Sistem memeriksa apakah email pengguna sudah terdaftar di database.
  5. Jika sudah terdaftar: sistem membuat session aktif dan mengarahkan ke Dashboard.
  6. Jika belum terdaftar: sistem membuat akun baru dan mengarahkan ke halaman Onboarding.
- **Output:** Session pengguna aktif, pengguna diarahkan ke halaman yang sesuai.
- **Kondisi Error:**
  - Jika Google mengembalikan error atau pengguna membatalkan proses, sistem menampilkan pesan: "Login gagal. Silakan coba lagi."
  - Jika terjadi kesalahan server saat menyimpan akun baru, sistem menampilkan pesan: "Terjadi kesalahan. Silakan coba beberapa saat lagi."

#### FR-02: Onboarding Pengguna Baru

- **Deskripsi:** Pengguna yang pertama kali login diwajibkan memilih role dan mengisi profil dasar sebelum dapat mengakses fitur utama.
- **Input:** Pilihan role dan data profil.
- **Proses:**
  1. Sistem menampilkan halaman pemilihan role: Mentee atau Mentor.
  2. Setelah memilih role, sistem menampilkan form profil sesuai role.
  3. Sistem memvalidasi semua field wajib sebelum menyimpan.
  4. Sistem menyimpan data profil dan menandai onboarding sebagai selesai.
- **Field Profil Mentee:**

  | Field | Tipe | Wajib | Validasi |
  |-------|------|-------|---------|
  | Nama | Text | Ya | Maks. 100 karakter |
  | Foto profil | Upload (JPG/PNG) | Tidak | Maks. 2 MB |
  | Bio singkat | Textarea | Tidak | Maks. 300 karakter |

- **Field Profil Mentor:**

  | Field | Tipe | Wajib | Validasi |
  |-------|------|-------|---------|
  | Nama | Text | Ya | Maks. 100 karakter |
  | Foto profil | Upload (JPG/PNG) | Tidak | Maks. 2 MB |
  | Bio | Textarea | Ya | Min. 50, maks. 500 karakter |
  | Skill/expertise tags | Multi-select | Ya | Min. 1 tag, maks. 10 tag |
  | Pengalaman | Number | Ya | Nilai antara 0 sampai 50 tahun |
  | Ketersediaan | Text | Ya | Maks. 100 karakter |
  | Harga minimum per sesi | Number | Ya | Nilai antara Rp 50.000 sampai Rp 5.000.000 |

- **Output:** Profil tersimpan, pengguna diarahkan ke Dashboard.

#### FR-03: Logout

- **Deskripsi:** Pengguna dapat mengakhiri sesi aktif mereka.
- **Proses:** Sistem menghapus session token dan mengarahkan pengguna ke halaman Landing Page.

---

### 4.2 Modul Dashboard

#### FR-04: Dashboard Mentee

- **Deskripsi:** Halaman utama Mentee setelah login menampilkan ringkasan aktivitas.
- **Konten yang ditampilkan:**
  - Daftar request milik Mentee beserta status (Aktif / Matched / Selesai / Ditutup).
  - Jumlah proposal yang masuk per request.
  - Notifikasi terbaru (proposal baru masuk, request matched).
  - Tombol akses cepat untuk membuat request baru.

#### FR-05: Dashboard Mentor

- **Deskripsi:** Halaman utama Mentor setelah login menampilkan ringkasan aktivitas.
- **Konten yang ditampilkan:**
  - Daftar request aktif yang baru atau relevan berdasarkan skill tags Mentor.
  - History proposal yang pernah dikirim beserta statusnya (Pending / Diterima / Ditolak).
  - Daftar match aktif yang sedang berjalan.
  - Notifikasi terbaru (keputusan match dari Mentee).

---

### 4.3 Modul Request

#### FR-06: Membuat Request Baru

- **Deskripsi:** Mentee dapat membuat request belajar baru dengan mengisi form terstruktur.
- **Input:** Data form request.
- **Validasi per field:**

  | Field | Aturan Validasi |
  |-------|----------------|
  | Judul | Wajib diisi. Min. 10 karakter, maks. 100 karakter. |
  | Topik / Tags | Wajib diisi. Min. 1 tag, maks. 5 tag. |
  | Level Mentee | Wajib dipilih salah satu: Pemula, Menengah, atau Mahir. |
  | Deskripsi kebutuhan | Wajib diisi. Min. 100 karakter, maks. 2.000 karakter. |
  | Budget minimum | Wajib diisi. Nilai antara Rp 50.000 sampai Rp 1.000.000. |
  | Budget maksimum | Wajib diisi. Nilai harus lebih besar atau sama dengan budget minimum. |
  | Jumlah pertemuan | Wajib diisi. Nilai antara 1 sampai 50 sesi. |
  | Deadline | Wajib diisi. Tanggal tidak boleh di masa lalu. |

- **Proses:**
  1. Sistem memvalidasi semua field.
  2. Jika validasi gagal, sistem menampilkan pesan error di bawah field yang bermasalah.
  3. Jika validasi berhasil, sistem menyimpan request dengan status "Aktif".
  4. Sistem menampilkan konfirmasi: "Request berhasil dibuat."
- **Output:** Request tersimpan dengan status Aktif, Mentee diarahkan ke halaman detail request.

#### FR-07: Melihat List Request (Mentor)

- **Deskripsi:** Mentor dapat melihat semua request aktif dari Mentee, dengan kemampuan filter dan sort.
- **Filter yang tersedia:**
  - Topik / Tags: multi-select.
  - Level: Pemula, Menengah, Mahir, atau Semua.
  - Budget range: nilai minimum dan maksimum.
- **Urutan tampilan:**
  - Default: terbaru (berdasarkan `created_at` descending).
  - Opsi alternatif: budget tertinggi.
- **Kondisi:** Hanya request dengan status "Aktif" yang ditampilkan.

#### FR-08: Melihat Detail Request

- **Deskripsi:** Pengguna dapat melihat semua informasi dari satu request secara lengkap.
- **Konten yang ditampilkan:** Judul, topik/tags, level, deskripsi, budget, jumlah pertemuan, deadline, nama Mentee (tanpa kontak pribadi), dan jumlah proposal yang masuk.
- **Akses:** Dapat diakses oleh Mentor yang belum apply maupun yang sudah apply.

#### FR-09: Menutup Request

- **Deskripsi:** Mentee dapat menutup request miliknya secara manual sebelum atau sesudah match.
- **Proses:**
  1. Mentee menekan tombol "Tutup Request".
  2. Sistem menampilkan konfirmasi: "Yakin ingin menutup request ini? Semua proposal yang masuk akan ditolak secara otomatis."
  3. Jika dikonfirmasi, sistem mengubah status request menjadi "Ditutup" dan status semua proposal yang masih Pending menjadi "Ditolak".
  4. Sistem mengirimkan email notifikasi ke semua Mentor yang proposalnya ditolak.

#### FR-10: Penutupan Request Otomatis

- **Deskripsi:** Sistem secara otomatis mengirimkan notifikasi jika request tidak mendapatkan proposal selama 7 hari.
- **Proses:**
  1. Sistem menjalankan scheduled job setiap hari untuk memeriksa request yang berusia lebih dari 7 hari dan belum memiliki proposal.
  2. Sistem mengirimkan email ke Mentee dengan pesan: "Request Anda belum mendapat proposal. Pertimbangkan untuk mengedit deskripsi atau menyesuaikan budget."
  3. Request tidak ditutup secara otomatis. Keputusan ada di tangan Mentee.

---

### 4.4 Modul Proposal

#### FR-11: Mengirim Proposal

- **Deskripsi:** Mentor dapat mengirim proposal ke request yang sedang aktif.
- **Kondisi Pra-syarat:**
  - Request dalam status Aktif.
  - Mentor belum pernah mengirim proposal ke request yang sama.
- **Validasi per field:**

  | Field | Aturan Validasi |
  |-------|----------------|
  | Keunggulan diri | Wajib diisi. Min. 50 karakter, maks. 500 karakter. |
  | Metode mengajar | Wajib diisi. Min. 50 karakter, maks. 500 karakter. |
  | Penawaran harga | Wajib diisi. Nilai antara Rp 50.000 sampai Rp 5.000.000. |
  | Pesan ke Mentee | Tidak wajib. Maks. 300 karakter. |

- **Proses:**
  1. Sistem memvalidasi kondisi pra-syarat dan field.
  2. Sistem menyimpan proposal dengan status "Pending".
  3. Sistem memicu pengiriman email notifikasi ke Mentee.
- **Output:** Proposal tersimpan, Mentor mendapatkan konfirmasi: "Proposal berhasil dikirim."

#### FR-12: Melihat Daftar Proposal (Mentee)

- **Deskripsi:** Mentee dapat melihat semua Mentor yang sudah apply ke request miliknya.
- **Konten per kartu proposal:**
  - Foto dan nama Mentor.
  - Rating rata-rata Mentor.
  - Preview keunggulan diri (50 karakter pertama).
  - Harga yang ditawarkan.
  - Tombol "Lihat Profil Lengkap" dan "Pilih Mentor Ini".
- **Kondisi:** Hanya tersedia jika request dalam status Aktif atau Matched.

#### FR-13: Memilih Mentor (Trigger Match)

- **Deskripsi:** Mentee memilih satu Mentor dari daftar proposal yang masuk untuk memulai proses match.
- **Kondisi Pra-syarat:** Request dalam status Aktif dan terdapat minimal satu proposal.
- **Proses:**
  1. Mentee menekan tombol "Pilih Mentor Ini" pada salah satu kartu proposal.
  2. Sistem menampilkan konfirmasi: "Yakin memilih mentor ini? Proposal dari mentor lain akan ditolak."
  3. Jika dikonfirmasi, sistem menjalankan proses berikut secara atomik (atomic transaction):
     - Mengubah status request menjadi "Matched".
     - Mengubah status proposal yang dipilih menjadi "Diterima".
     - Mengubah status semua proposal lain di request yang sama menjadi "Ditolak".
     - Membuat record baru di tabel `matches`.
     - Membuka akses chat antara Mentee dan Mentor terpilih.
  4. Sistem mengirimkan email ke Mentor yang diterima dan email terpisah ke Mentor yang ditolak.
- **Output:** Pengguna diarahkan ke halaman chat dengan Mentor yang dipilih.
- **Kondisi Error:** Jika terjadi kegagalan pada salah satu langkah dalam atomic transaction, seluruh perubahan dibatalkan (rollback) dan sistem menampilkan pesan error.

---

### 4.5 Modul Profil Mentor

#### FR-14: Halaman Profil Publik Mentor

- **Deskripsi:** Setiap Mentor memiliki halaman profil publik yang dapat diakses tanpa login.
- **URL:** `/mentor/[username]`
- **Konten yang ditampilkan:**
  - Foto profil, nama, bio.
  - Skill/expertise tags.
  - Pengalaman (dalam tahun).
  - Ketersediaan.
  - Harga minimum per sesi.
  - Rating rata-rata dan jumlah ulasan.
  - Daftar review dari Mentee (terbaru di atas).
- **Tombol aksi (hanya tampil jika pengguna sudah login sebagai Mentee):** "Ajukan Request ke Mentor Ini".

#### FR-15: Mengedit Profil

- **Deskripsi:** Pengguna dapat mengedit informasi profil mereka kapan saja.
- **Field yang bisa diedit:** Semua field profil yang diisi saat onboarding.
- **Field yang tidak bisa diedit:** Email (terikat ke akun Google) dan role (tidak dapat diubah setelah onboarding).

---

### 4.6 Modul Chat

#### FR-16: Mengirim dan Menerima Pesan

- **Deskripsi:** Mentee dan Mentor yang sudah matched dapat saling berkirim pesan secara real-time.
- **Kondisi Pra-syarat:** Terdapat record `match` yang valid yang menghubungkan kedua pengguna.
- **Konten yang didukung:**
  - Pesan teks (maks. 2.000 karakter per pesan).
  - Tautan URL (ditampilkan sebagai hyperlink yang bisa diklik).
  - File lampiran: format PDF dan gambar (JPG, PNG), ukuran maks. 5 MB per file.
- **Mekanisme real-time:** Sistem menggunakan Supabase Realtime (WebSocket) untuk memastikan pesan muncul di sisi penerima tanpa perlu refresh halaman.
- **Penyimpanan:** Seluruh riwayat pesan disimpan di database dan dapat diakses kembali selama akun aktif.

#### FR-17: Notifikasi Pesan Baru

- **Deskripsi:** Jika pengguna tidak sedang membuka halaman chat, sistem mengirimkan email notifikasi untuk pesan baru.
- **Aturan:** Email notifikasi dikirim maksimal sekali per 30 menit untuk menghindari spam, meskipun ada banyak pesan masuk dalam periode tersebut.

---

### 4.7 Modul Review & Rating

#### FR-18: Menandai Sesi Selesai

- **Deskripsi:** Mentee dapat menandai sesi sebagai selesai untuk membuka form review.
- **Kondisi Pra-syarat:** Status match adalah "Aktif".
- **Proses:** Sistem mengubah status match menjadi "Selesai" dan menampilkan form review.

#### FR-19: Memberikan Review

- **Deskripsi:** Mentee dapat memberikan review kepada Mentor setelah sesi ditandai selesai.
- **Validasi per field:**

  | Field | Aturan Validasi |
  |-------|----------------|
  | Rating | Wajib diisi. Nilai bilangan bulat antara 1 sampai 5. |
  | Ulasan teks | Wajib diisi. Min. 20 karakter, maks. 1.000 karakter. |

- **Proses setelah review disimpan:**
  1. Sistem menyimpan review ke tabel `reviews`.
  2. Sistem menghitung ulang `rating_avg` dan memperbarui `rating_count` di tabel `users` untuk Mentor yang bersangkutan.
  3. Review langsung tampil di halaman profil publik Mentor.
- **Batasan:** Setiap match hanya menghasilkan satu review. Mentee tidak dapat mengubah review setelah dikirim.

#### FR-20: Membalas Review

- **Deskripsi:** Mentor dapat memberikan satu balasan untuk setiap review yang diterimanya.
- **Validasi:** Maks. 500 karakter.
- **Batasan:** Hanya satu balasan per review. Balasan tidak dapat diedit setelah dikirim.

---

### 4.8 Modul Search & Filter

#### FR-21: Pencarian Global

- **Deskripsi:** Pengguna dapat mencari konten di platform melalui search bar global.
- **Cakupan pencarian:**
  - Request: berdasarkan judul dan deskripsi.
  - Mentor: berdasarkan nama, bio, dan skill tags.
- **Perilaku:** Sistem mengembalikan hasil dalam waktu kurang dari 1 detik untuk query dengan panjang minimal 3 karakter.

#### FR-22: Filter dan Sort

- **Filter request (untuk Mentor):**
  - Topik/Tags: multi-select.
  - Level: Pemula, Menengah, Mahir.
  - Budget range: input nilai minimum dan maksimum.
  - Status: Aktif saja (default).
- **Filter mentor (untuk Mentee):**
  - Skill tags: multi-select.
  - Rating minimum: pilihan 3 ke atas, 4 ke atas, atau 4.5 ke atas.
  - Ketersediaan: filter berdasarkan teks ketersediaan.
- **Sort request:** Terbaru (default) atau Budget Tertinggi.
- **Sort mentor:** Rating tertinggi (default) atau Pengalaman terlama.

---

### 4.9 Modul Notifikasi Email

#### FR-23: Pengiriman Email Notifikasi

- **Deskripsi:** Sistem secara otomatis mengirimkan email notifikasi kepada pengguna pada event-event berikut.

  | Kode Event | Trigger | Penerima | Subjek Email |
  |-----------|---------|----------|-------------|
  | NE-01 | Proposal baru masuk ke request | Mentee | "Ada mentor baru yang apply ke request Anda" |
  | NE-02 | Proposal diterima (match terjadi) | Mentor terpilih | "Selamat! Proposal Anda diterima oleh Mentee" |
  | NE-03 | Proposal ditolak | Mentor tidak terpilih | "Pembaruan status proposal Anda di Ajarin" |
  | NE-04 | Pesan baru di chat | Pihak yang tidak aktif | "Anda memiliki pesan baru di Ajarin" |
  | NE-05 | Request belum mendapat proposal selama 7 hari | Mentee | "Request Anda belum mendapat proposal" |

- **Ketentuan teknis:**
  - Email dikirim melalui layanan Resend.
  - Sistem harus mencatat status pengiriman (berhasil atau gagal) di log internal.
  - Jika pengiriman gagal, sistem melakukan 2 kali retry dengan interval 5 menit.
  - Email NE-04 hanya dikirim sekali per 30 menit per pasangan match untuk menghindari spam.

---

## 5. Kebutuhan Non-Fungsional

### 5.1 Performa

| ID | Kebutuhan | Target |
|----|-----------|--------|
| NFR-01 | Waktu loading halaman utama (LCP) | Kurang dari 2,5 detik pada koneksi 4G (10 Mbps) |
| NFR-02 | Waktu respons API untuk operasi baca | Kurang dari 500ms untuk 95% request |
| NFR-03 | Waktu respons API untuk operasi tulis | Kurang dari 1.000ms untuk 95% request |
| NFR-04 | Latensi pesan chat real-time | Kurang dari 300ms dari kirim ke tampil di penerima |
| NFR-05 | Kapasitas concurrent users | Sistem stabil dengan minimal 1.000 pengguna aktif bersamaan |

### 5.2 Ketersediaan dan Keandalan

| ID | Kebutuhan | Target |
|----|-----------|--------|
| NFR-06 | Uptime sistem | Minimal 99% per bulan (sesuai SLA Vercel dan Supabase) |
| NFR-07 | Recovery time setelah downtime | Kurang dari 1 jam untuk downtime yang tidak terencana |
| NFR-08 | Data loss tolerance | Sistem tidak boleh kehilangan data transaksi yang sudah terkonfirmasi |
| NFR-09 | Backup database | Backup otomatis harian oleh Supabase, retensi minimal 7 hari |

### 5.3 Skalabilitas

| ID | Kebutuhan |
|----|-----------|
| NFR-10 | Arsitektur backend menggunakan stateless API Routes sehingga dapat di-scale secara horizontal. |
| NFR-11 | Database menggunakan connection pooling untuk menangani lonjakan koneksi. |
| NFR-12 | File upload disimpan di object storage (Supabase Storage), bukan di server aplikasi. |

### 5.4 Kegunaan (Usability)

| ID | Kebutuhan |
|----|-----------|
| NFR-13 | Antarmuka harus responsif dan dapat digunakan pada viewport mulai dari 360px (mobile) hingga 1440px (desktop). |
| NFR-14 | Pengguna harus dapat menyelesaikan alur membuat request dalam kurang dari 5 menit. |
| NFR-15 | Pengguna harus dapat menyelesaikan alur mengirim proposal dalam kurang dari 10 menit. |
| NFR-16 | Setiap pesan error harus ditulis dalam Bahasa Indonesia yang jelas dan menyertakan saran tindakan. |
| NFR-17 | Elemen interaktif utama (tombol, link, form) harus memenuhi standar WCAG 2.1 Level AA. |

### 5.5 Kompatibilitas Browser

Sistem harus berfungsi penuh pada browser-browser berikut dalam versi dua tahun terakhir:

| Browser | Versi Minimum |
|---------|--------------|
| Google Chrome | 110 ke atas |
| Mozilla Firefox | 110 ke atas |
| Safari (macOS dan iOS) | 16 ke atas |
| Microsoft Edge | 110 ke atas |

### 5.6 Lokalisasi

| ID | Kebutuhan |
|----|-----------|
| NFR-18 | Seluruh teks antarmuka menggunakan Bahasa Indonesia. |
| NFR-19 | Format tanggal menggunakan format lokal Indonesia: DD Bulan YYYY (contoh: 16 Mei 2026). |
| NFR-20 | Format mata uang menggunakan Rupiah dengan format: Rp [nilai] (contoh: Rp 150.000). |

---

## 6. Kebutuhan Antarmuka Eksternal

### 6.1 Antarmuka Pengguna

- Sistem menggunakan konfigurasi font sebagai berikut untuk seluruh antarmuka:
  - **Sans:** `Plus Jakarta Sans, ui-sans-serif, sans-serif`
  - **Mono:** `JetBrains Mono, ui-monospace, monospace`
- Sistem menggunakan Tailwind CSS sebagai framework styling dan shadcn/ui sebagai library komponen.
- Seluruh halaman harus memiliki navigasi yang konsisten: header dengan logo, menu utama, dan akses ke profil pengguna.

### 6.2 Antarmuka dengan Google OAuth 2.0

- **Endpoint otorisasi:** `https://accounts.google.com/o/oauth2/v2/auth`
- **Scope yang diminta:** `openid`, `email`, `profile`
- **Callback URL:** `/api/auth/callback/google`
- **Library:** NextAuth.js Google Provider
- **Data yang diterima dari Google:** `sub` (Google ID), `email`, `name`, `picture`
- **Kondisi Error:** Jika Google mengembalikan status error, sistem mencatat log error dan menampilkan pesan kepada pengguna.

### 6.3 Antarmuka dengan Supabase

- **Database:** Koneksi melalui Prisma ORM menggunakan `DATABASE_URL` dari environment variable.
- **Realtime:** Koneksi WebSocket melalui Supabase JS Client menggunakan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.
- **Storage:** Upload file melalui Supabase Storage API ke bucket `chat-attachments`.
- **Kebijakan akses (Row Level Security):** Diaktifkan untuk semua tabel. Pengguna hanya dapat membaca dan menulis data yang relevan dengan akun mereka.

### 6.4 Antarmuka dengan Resend (Email Service)

- **Endpoint:** `https://api.resend.com/emails`
- **Autentikasi:** API Key disimpan di environment variable `RESEND_API_KEY`.
- **Format pengirim:** `Ajarin <noreply@ajarin.id>`
- **Format email:** HTML dengan fallback plain text.
- **Mekanisme retry:** 2 kali retry dengan interval 5 menit jika pengiriman gagal.

---

## 7. Spesifikasi API

Seluruh API menggunakan format JSON dan memerlukan autentikasi session (kecuali endpoint publik). Base URL: `/api`.

### 7.1 Autentikasi

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/auth/signin` | Memulai alur Google OAuth | Publik |
| GET | `/api/auth/callback/google` | Callback dari Google setelah otorisasi | Publik |
| POST | `/api/auth/signout` | Mengakhiri sesi pengguna | Terautentikasi |

### 7.2 Pengguna & Profil

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/users/me` | Mengambil data profil pengguna yang sedang login | Terautentikasi |
| PATCH | `/api/users/me` | Memperbarui profil pengguna | Terautentikasi |
| GET | `/api/mentors/[username]` | Mengambil profil publik Mentor | Publik |

### 7.3 Request

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/requests` | Mengambil list request aktif dengan filter | Mentor |
| POST | `/api/requests` | Membuat request baru | Mentee |
| GET | `/api/requests/[id]` | Mengambil detail satu request | Terautentikasi |
| PATCH | `/api/requests/[id]` | Memperbarui atau menutup request | Mentee (pemilik) |
| DELETE | `/api/requests/[id]` | Menghapus request (hanya jika belum ada proposal) | Mentee (pemilik) |

### 7.4 Proposal

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/requests/[id]/proposals` | Mengambil semua proposal untuk satu request | Mentee (pemilik) |
| POST | `/api/requests/[id]/proposals` | Mengirim proposal ke satu request | Mentor |
| POST | `/api/requests/[id]/match` | Memilih Mentor dan memicu proses match | Mentee (pemilik) |

### 7.5 Chat

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/matches/[id]/messages` | Mengambil riwayat pesan dalam satu match | Peserta match |
| POST | `/api/matches/[id]/messages` | Mengirim pesan baru | Peserta match |
| POST | `/api/matches/[id]/messages/attachment` | Mengunggah file lampiran | Peserta match |

### 7.6 Review

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| POST | `/api/matches/[id]/review` | Membuat review untuk match yang sudah selesai | Mentee (peserta match) |
| POST | `/api/reviews/[id]/reply` | Menambahkan balasan Mentor atas review | Mentor (peserta review) |

### 7.7 Format Respons API

**Sukses:**
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operasi berhasil."
}
```

**Error:**
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Deskripsi kebutuhan minimal 100 karakter.",
  "field": "description"
}
```

**Kode Error Standar:**

| Kode | HTTP Status | Deskripsi |
|------|------------|-----------|
| `UNAUTHORIZED` | 401 | Pengguna belum login atau sesi tidak valid |
| `FORBIDDEN` | 403 | Pengguna tidak memiliki izin untuk operasi ini |
| `NOT_FOUND` | 404 | Resource yang dicari tidak ditemukan |
| `VALIDATION_ERROR` | 422 | Input tidak memenuhi aturan validasi |
| `CONFLICT` | 409 | Operasi bertentangan dengan data yang sudah ada (contoh: Mentor sudah apply ke request yang sama) |
| `INTERNAL_ERROR` | 500 | Kesalahan internal server |

---

## 8. Kebutuhan Keamanan

### 8.1 Autentikasi dan Otorisasi

| ID | Kebutuhan |
|----|-----------|
| SEC-01 | Seluruh komunikasi antara client dan server menggunakan HTTPS (TLS 1.2 ke atas). |
| SEC-02 | Session token menggunakan JWT dengan masa berlaku 7 hari dan diperbarui otomatis jika pengguna aktif. |
| SEC-03 | Setiap API endpoint yang memerlukan autentikasi harus memverifikasi session token sebelum memproses request. |
| SEC-04 | Pengguna hanya dapat mengakses dan memodifikasi data milik mereka sendiri. Verifikasi kepemilikan dilakukan di level server, bukan hanya di UI. |
| SEC-05 | Row Level Security (RLS) diaktifkan di seluruh tabel Supabase sebagai lapisan keamanan tambahan di level database. |

### 8.2 Perlindungan Data

| ID | Kebutuhan |
|----|-----------|
| SEC-06 | Password pengguna tidak disimpan di sistem. Autentikasi sepenuhnya didelegasikan ke Google OAuth. |
| SEC-07 | Seluruh data sensitif di database dienkripsi at rest oleh Supabase. |
| SEC-08 | API key dan credential layanan pihak ketiga disimpan di environment variable server-side dan tidak pernah dikirim ke client. |
| SEC-09 | File yang diunggah ke Supabase Storage diakses melalui signed URL yang memiliki masa berlaku, bukan URL publik permanen. |

### 8.3 Pencegahan Serangan Umum

| ID | Kebutuhan | Mekanisme |
|----|-----------|-----------|
| SEC-10 | Proteksi terhadap SQL Injection | Seluruh query database menggunakan Prisma ORM dengan parameterized queries. |
| SEC-11 | Proteksi terhadap XSS (Cross-Site Scripting) | Seluruh input pengguna di-sanitasi sebelum disimpan dan di-escape sebelum ditampilkan. |
| SEC-12 | Proteksi terhadap CSRF (Cross-Site Request Forgery) | NextAuth.js menyertakan CSRF token pada seluruh form action. |
| SEC-13 | Rate limiting pada API | Endpoint write (POST, PATCH) dibatasi maksimal 60 request per menit per pengguna. |
| SEC-14 | Validasi tipe file upload | Sistem memvalidasi MIME type dan ekstensi file di server-side sebelum menyimpan ke storage. |

---

## 9. Kebutuhan Database

### 9.1 Skema Database

Sistem menggunakan PostgreSQL dengan 6 tabel utama. Berikut adalah spesifikasi lengkap setiap tabel.

**Tabel: `users`**

| Kolom | Tipe Data | Constraints | Deskripsi |
|-------|-----------|------------|-----------|
| `id` | `SERIAL` | PRIMARY KEY | ID unik pengguna |
| `google_id` | `VARCHAR(255)` | UNIQUE, NOT NULL | ID dari Google OAuth |
| `email` | `VARCHAR(255)` | UNIQUE, NOT NULL | Email dari akun Google |
| `name` | `VARCHAR(100)` | NOT NULL | Nama tampilan pengguna |
| `avatar_url` | `TEXT` | NULL | URL foto profil |
| `role` | `VARCHAR(10)` | NOT NULL, CHECK (role IN ('mentee', 'mentor')) | Peran pengguna |
| `bio` | `TEXT` | NULL | Deskripsi diri |
| `skill_tags` | `TEXT[]` | NULL | Array tag keahlian (khusus Mentor) |
| `experience_years` | `SMALLINT` | NULL | Pengalaman dalam tahun (khusus Mentor) |
| `availability` | `VARCHAR(100)` | NULL | Deskripsi ketersediaan (khusus Mentor) |
| `min_price_per_session` | `INTEGER` | NULL | Harga minimum per sesi dalam Rupiah (khusus Mentor) |
| `rating_avg` | `DECIMAL(3,2)` | DEFAULT 0 | Rata-rata rating (khusus Mentor) |
| `rating_count` | `INTEGER` | DEFAULT 0 | Jumlah ulasan yang diterima (khusus Mentor) |
| `onboarding_completed` | `BOOLEAN` | DEFAULT false | Status onboarding |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu akun dibuat |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu terakhir diperbarui |

**Tabel: `requests`**

| Kolom | Tipe Data | Constraints | Deskripsi |
|-------|-----------|------------|-----------|
| `id` | `SERIAL` | PRIMARY KEY | ID unik request |
| `mentee_id` | `INTEGER` | FK ke `users.id`, NOT NULL | Pemilik request |
| `title` | `VARCHAR(100)` | NOT NULL | Judul request |
| `tags` | `TEXT[]` | NOT NULL | Topik atau tag request |
| `level` | `VARCHAR(10)` | NOT NULL, CHECK (level IN ('pemula', 'menengah', 'mahir')) | Level Mentee |
| `description` | `TEXT` | NOT NULL | Deskripsi kebutuhan |
| `budget_min` | `INTEGER` | NOT NULL | Budget minimum per sesi |
| `budget_max` | `INTEGER` | NOT NULL | Budget maksimum per sesi |
| `session_count` | `SMALLINT` | NOT NULL | Jumlah pertemuan yang diinginkan |
| `deadline` | `DATE` | NOT NULL | Target selesai belajar |
| `status` | `VARCHAR(10)` | NOT NULL, DEFAULT 'aktif', CHECK (status IN ('aktif', 'matched', 'selesai', 'ditutup')) | Status request |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu request dibuat |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu terakhir diperbarui |

**Tabel: `proposals`**

| Kolom | Tipe Data | Constraints | Deskripsi |
|-------|-----------|------------|-----------|
| `id` | `SERIAL` | PRIMARY KEY | ID unik proposal |
| `request_id` | `INTEGER` | FK ke `requests.id`, NOT NULL | Request yang dituju |
| `mentor_id` | `INTEGER` | FK ke `users.id`, NOT NULL | Mentor pengirim |
| `strength` | `TEXT` | NOT NULL | Keunggulan diri Mentor |
| `method` | `TEXT` | NOT NULL | Metode mengajar |
| `message` | `TEXT` | NULL | Pesan tambahan ke Mentee |
| `offered_price` | `INTEGER` | NOT NULL | Harga yang ditawarkan |
| `status` | `VARCHAR(10)` | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending', 'diterima', 'ditolak')) | Status proposal |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu proposal dikirim |

**Unique constraint:** `(request_id, mentor_id)` untuk memastikan satu Mentor hanya bisa mengirim satu proposal per request.

**Tabel: `matches`**

| Kolom | Tipe Data | Constraints | Deskripsi |
|-------|-----------|------------|-----------|
| `id` | `SERIAL` | PRIMARY KEY | ID unik match |
| `request_id` | `INTEGER` | FK ke `requests.id`, UNIQUE, NOT NULL | Request yang menghasilkan match |
| `proposal_id` | `INTEGER` | FK ke `proposals.id`, UNIQUE, NOT NULL | Proposal yang dipilih |
| `mentee_id` | `INTEGER` | FK ke `users.id`, NOT NULL | Mentee dalam match |
| `mentor_id` | `INTEGER` | FK ke `users.id`, NOT NULL | Mentor dalam match |
| `status` | `VARCHAR(10)` | NOT NULL, DEFAULT 'aktif', CHECK (status IN ('aktif', 'selesai')) | Status match |
| `matched_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu match terjadi |
| `completed_at` | `TIMESTAMPTZ` | NULL | Waktu sesi ditandai selesai |

**Tabel: `messages`**

| Kolom | Tipe Data | Constraints | Deskripsi |
|-------|-----------|------------|-----------|
| `id` | `SERIAL` | PRIMARY KEY | ID unik pesan |
| `match_id` | `INTEGER` | FK ke `matches.id`, NOT NULL | Match tempat pesan dikirim |
| `sender_id` | `INTEGER` | FK ke `users.id`, NOT NULL | Pengirim pesan |
| `content` | `TEXT` | NULL | Isi pesan teks |
| `file_url` | `TEXT` | NULL | URL file lampiran (jika ada) |
| `file_name` | `VARCHAR(255)` | NULL | Nama file asli lampiran |
| `sent_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu pesan dikirim |

**Tabel: `reviews`**

| Kolom | Tipe Data | Constraints | Deskripsi |
|-------|-----------|------------|-----------|
| `id` | `SERIAL` | PRIMARY KEY | ID unik review |
| `match_id` | `INTEGER` | FK ke `matches.id`, UNIQUE, NOT NULL | Match yang diulas |
| `mentee_id` | `INTEGER` | FK ke `users.id`, NOT NULL | Penulis review |
| `mentor_id` | `INTEGER` | FK ke `users.id`, NOT NULL | Penerima review |
| `rating` | `SMALLINT` | NOT NULL, CHECK (rating BETWEEN 1 AND 5) | Nilai bintang |
| `comment` | `TEXT` | NOT NULL | Isi ulasan |
| `mentor_reply` | `TEXT` | NULL | Balasan dari Mentor |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu review dibuat |

### 9.2 Indeks Database

Indeks berikut dibuat untuk mengoptimalkan performa query yang paling sering dijalankan:

| Tabel | Kolom | Alasan |
|-------|-------|--------|
| `requests` | `mentee_id` | Mengambil semua request milik satu Mentee |
| `requests` | `status` | Memfilter request berdasarkan status |
| `requests` | `tags` (GIN index) | Pencarian dan filter berdasarkan tag |
| `proposals` | `request_id` | Mengambil semua proposal untuk satu request |
| `proposals` | `mentor_id` | Mengambil semua proposal milik satu Mentor |
| `messages` | `match_id` | Mengambil riwayat chat dalam satu match |
| `reviews` | `mentor_id` | Mengambil semua review yang diterima satu Mentor |

---

## 10. Batasan Sistem

| ID | Batasan |
|----|---------|
| BC-01 | Sistem hanya mendukung login melalui Google. Tidak ada metode autentikasi lain di MVP. |
| BC-02 | Bahasa antarmuka hanya Bahasa Indonesia. Internasionalisasi tidak masuk scope MVP. |
| BC-03 | Sistem tidak memproses atau menyimpan data pembayaran. Transaksi finansial dilakukan di luar platform. |
| BC-04 | Satu pengguna hanya memiliki satu role (Mentee atau Mentor) yang dipilih saat onboarding. |
| BC-05 | Satu Mentor hanya dapat mengirim satu proposal per request. |
| BC-06 | Satu request hanya dapat menghasilkan satu match. |
| BC-07 | Chat hanya tersedia antara pasangan Mentee-Mentor yang sudah matched. Tidak ada fitur grup chat. |
| BC-08 | Ukuran file lampiran di chat dibatasi maksimal 5 MB per file, dengan format PDF, JPG, dan PNG saja. |
| BC-09 | Satu match hanya menghasilkan satu review dari Mentee dan satu balasan dari Mentor. |
| BC-10 | Sistem tidak menyediakan mekanisme video call. Koordinasi sesi dilakukan via chat dan dilanjutkan di platform eksternal. |

---

## 11. Kasus Uji Penerimaan

Bagian ini mendefinisikan skenario uji minimum yang harus lulus sebelum sistem dinyatakan siap untuk soft launch.

### 11.1 Autentikasi

| ID Uji | Skenario | Hasil yang Diharapkan |
|--------|---------|----------------------|
| UAT-01 | Pengguna baru login dengan Google | Diarahkan ke halaman onboarding |
| UAT-02 | Pengguna lama login dengan Google | Diarahkan langsung ke Dashboard |
| UAT-03 | Pengguna membatalkan alur Google OAuth | Kembali ke landing page dengan pesan error yang jelas |
| UAT-04 | Pengguna logout | Session dihapus, diarahkan ke landing page |

### 11.2 Request

| ID Uji | Skenario | Hasil yang Diharapkan |
|--------|---------|----------------------|
| UAT-05 | Mentee membuat request dengan semua field valid | Request tersimpan dengan status Aktif |
| UAT-06 | Mentee submit form dengan field wajib kosong | Form tidak terkirim, pesan error muncul per field |
| UAT-07 | Mentee menutup request yang masih Aktif | Status berubah menjadi Ditutup, Mentor dengan proposal Pending mendapat email notifikasi |
| UAT-08 | Mentor mencoba membuat request | Aksi ditolak, pesan error "Role Anda tidak memiliki izin untuk ini" ditampilkan |

### 11.3 Proposal dan Match

| ID Uji | Skenario | Hasil yang Diharapkan |
|--------|---------|----------------------|
| UAT-09 | Mentor mengirim proposal ke request Aktif | Proposal tersimpan dengan status Pending, Mentee mendapat email notifikasi |
| UAT-10 | Mentor mencoba mengirim proposal kedua ke request yang sama | Sistem menolak dengan pesan error "Anda sudah mengirim proposal ke request ini" |
| UAT-11 | Mentee memilih salah satu Mentor dari daftar proposal | Status request berubah menjadi Matched, status proposal terpilih berubah menjadi Diterima, status proposal lain berubah menjadi Ditolak, chat terbuka |
| UAT-12 | Email notifikasi dikirim ke Mentor terpilih dan Mentor yang tidak terpilih | Email terkirim dalam 2 menit setelah match terjadi |

### 11.4 Chat

| ID Uji | Skenario | Hasil yang Diharapkan |
|--------|---------|----------------------|
| UAT-13 | Mentee dan Mentor yang sudah matched mengirim pesan | Pesan muncul real-time di kedua sisi tanpa perlu refresh |
| UAT-14 | Pengguna mencoba mengakses chat tanpa match | Sistem mengembalikan error 403 Forbidden |
| UAT-15 | Pengguna mengunggah file PDF berukuran 3 MB | File berhasil diunggah dan tautan unduh muncul di chat |
| UAT-16 | Pengguna mencoba mengunggah file berukuran 6 MB | Sistem menolak dengan pesan "Ukuran file maksimal adalah 5 MB" |

### 11.5 Review

| ID Uji | Skenario | Hasil yang Diharapkan |
|--------|---------|----------------------|
| UAT-17 | Mentee menandai sesi selesai dan mengisi review | Review tersimpan, `rating_avg` Mentor diperbarui, review tampil di profil publik Mentor |
| UAT-18 | Mentee mencoba mengirim review kedua ke match yang sama | Sistem menolak dengan pesan "Anda sudah memberikan review untuk sesi ini" |
| UAT-19 | Mentor membalas review | Balasan tersimpan dan tampil di bawah review di profil publik |

---

## 12. Glosarium

| Istilah | Definisi |
|---------|---------|
| **Mentee** | Pengguna yang membuat request belajar dan mencari Mentor di platform Ajarin. |
| **Mentor** | Pengguna yang menawarkan kemampuan mengajar dengan mengirimkan proposal ke request Mentee. |
| **Request** | Formulir yang dibuat Mentee untuk mendeskripsikan kebutuhan belajar secara spesifik. |
| **Proposal** | Jawaban Mentor atas sebuah request, berisi metode mengajar, harga, dan pesan kepada Mentee. |
| **Match** | Kondisi ketika Mentee sudah memilih satu Mentor dari daftar proposal yang masuk. |
| **Onboarding** | Proses awal setelah pertama kali login: memilih role dan mengisi profil dasar. |
| **Atomic Transaction** | Serangkaian operasi database yang harus berhasil seluruhnya atau dibatalkan seluruhnya jika ada satu yang gagal. |
| **Row Level Security (RLS)** | Fitur keamanan database yang membatasi baris mana saja yang dapat dibaca atau dimodifikasi oleh pengguna tertentu. |
| **Signed URL** | URL file yang dilindungi oleh token dan hanya valid selama periode waktu tertentu. |
| **Scheduled Job** | Tugas otomatis yang dijalankan sistem pada waktu atau interval tertentu tanpa intervensi manual. |
| **Real-time** | Mekanisme komunikasi di mana data disampaikan ke penerima segera setelah dikirim, tanpa perlu memuat ulang halaman. |
| **Rate Limiting** | Pembatasan jumlah request yang dapat dilakukan oleh satu pengguna dalam periode waktu tertentu. |

---

*Dokumen ini bersifat living document dan akan diperbarui seiring perkembangan spesifikasi teknis.*
*Versi berikutnya (v1.1) akan menyertakan spesifikasi endpoint yang lebih lengkap dan hasil dari sesi technical review bersama tim engineering.*
