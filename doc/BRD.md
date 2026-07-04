# BRD — Business Requirements Document

**Produk:** Ajarin
**Versi:** 1.0
**Tanggal:** 16 Mei 2026
**Status:** Draft
**Referensi Dokumen:** PRD Ajarin v1.1

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Latar Belakang Bisnis](#2-latar-belakang-bisnis)
3. [Tujuan Bisnis](#3-tujuan-bisnis)
4. [Stakeholder](#4-stakeholder)
5. [Kebutuhan Bisnis](#5-kebutuhan-bisnis)
6. [Analisis Pasar & Kompetitor](#6-analisis-pasar--kompetitor)
7. [Model Bisnis](#7-model-bisnis)
8. [Asumsi & Ketergantungan](#8-asumsi--ketergantungan)
9. [Batasan Bisnis](#9-batasan-bisnis)
10. [Kriteria Keberhasilan](#10-kriteria-keberhasilan)
11. [Risiko Bisnis](#11-risiko-bisnis)
12. [Regulasi & Kepatuhan](#12-regulasi--kepatuhan)
13. [Roadmap Bisnis](#13-roadmap-bisnis)
14. [Persetujuan Dokumen](#14-persetujuan-dokumen)

---

## 1. Executive Summary

Ajarin adalah platform marketplace dua arah berbasis web yang dirancang untuk pasar Indonesia. Platform ini menghubungkan individu yang ingin belajar skill spesifik (Mentee) dengan individu yang memiliki kemampuan untuk mengajarkannya (Mentor).

Kebutuhan inti yang dijawab Ajarin adalah sebagai berikut: pengguna membutuhkan pembelajaran yang kontekstual dan personal, bukan kursus video generik. Ajarin menjawab kebutuhan tersebut melalui mekanisme proposal/bidding, di mana Mentee mengajukan kebutuhan belajar secara spesifik dan Mentor bersaing dengan proposal terbaik mereka.

Dokumen ini mendefinisikan seluruh kebutuhan bisnis yang harus dipenuhi oleh platform Ajarin pada fase MVP (Minimum Viable Product), termasuk tujuan bisnis, model monetisasi, analisis pasar, dan kriteria keberhasilan yang terukur.

---

## 2. Latar Belakang Bisnis

### 2.1 Konteks Pasar

Industri edukasi online di Indonesia tumbuh pesat pasca pandemi. Namun, pertumbuhan ini didominasi oleh platform kursus pre-recorded yang bersifat satu arah dan generik. Pengguna yang memiliki kebutuhan belajar yang sangat spesifik, misalnya ingin membangun fitur autentikasi pada aplikasi Next.js mereka, tidak terlayani dengan baik oleh format tersebut.

Di sisi lain, banyak profesional berpengalaman di Indonesia yang memiliki skill relevan tetapi tidak memiliki kanal yang efisien untuk memonetisasi keahlian mereka melalui mentoring personal.

### 2.2 Peluang yang Diidentifikasi

Terdapat gap signifikan antara dua kelompok pengguna ini. Gap tersebut belum diisi oleh pemain lokal yang fokus pada model matching berbasis kebutuhan spesifik dengan mekanisme proposal terbuka. Ajarin hadir untuk mengisi gap tersebut.

### 2.3 Urgensi

Segmen tech skill (coding, desain, dan data) di Indonesia terus tumbuh seiring meningkatnya permintaan talenta digital. Masuk lebih awal ke pasar ini memberikan keunggulan dalam membangun jaringan Mentor berkualitas dan loyalitas Mentee sebelum kompetitor yang lebih besar melihat peluang yang sama.

---

## 3. Tujuan Bisnis

### 3.1 Tujuan Jangka Pendek (0–6 Bulan)

| ID | Tujuan | Target |
|----|--------|--------|
| BG-01 | Meluncurkan platform MVP yang fungsional | Soft launch pada minggu ke-10 |
| BG-02 | Memvalidasi model matching berbasis proposal di pasar Indonesia | 100 request aktif dalam 3 bulan pertama |
| BG-03 | Membangun supply awal Mentor berkualitas | 50 Mentor aktif dalam 3 bulan pertama |
| BG-04 | Membuktikan bahwa pengguna mau kembali menggunakan platform | Repeat usage rate Mentee mencapai 25% |

### 3.2 Tujuan Jangka Menengah (6–18 Bulan)

| ID | Tujuan | Target |
|----|--------|--------|
| BG-05 | Mengaktifkan aliran pendapatan pertama dari platform | Revenue dari payment gateway aktif pada bulan ke-6 |
| BG-06 | Memperluas kategori skill di luar tech | Tambah kategori desain, bahasa, dan bisnis |
| BG-07 | Mencapai kemandirian finansial operasional | Biaya operasional tertutup dari komisi platform |

### 3.3 Tujuan Jangka Panjang (18 Bulan ke Atas)

- Menjadi platform mentoring C2C terbesar di Indonesia.
- Ekspansi ke Asia Tenggara, dimulai dari Malaysia dan Filipina.
- Membangun ekosistem belajar yang mencakup sertifikasi berbasis pencapaian sesi.

---

## 4. Stakeholder

### 4.1 Stakeholder Internal

| Peran | Tanggung Jawab dalam Proyek |
|-------|---------------------------|
| Founder / Product Owner | Pemilik visi produk, pengambil keputusan akhir |
| Product Manager | Mengelola backlog, prioritas fitur, dan komunikasi antar tim |
| Engineering Lead | Bertanggung jawab atas arsitektur teknis dan deliverable development |
| UI/UX Designer | Merancang pengalaman pengguna dan antarmuka visual |
| QA Engineer | Memastikan kualitas dan keandalan produk sebelum launch |

### 4.2 Stakeholder Eksternal

| Peran | Kepentingan |
|-------|------------|
| Mentee | Menemukan mentor yang tepat sesuai kebutuhan dan budget |
| Mentor | Mendapatkan murid yang serius dan kanal penghasilan tambahan |
| Investor (jika ada) | Return on investment dan pertumbuhan platform |
| Mitra Komunitas | Komunitas dev, Discord, dan LinkedIn sebagai kanal akuisisi awal |

### 4.3 Matriks RACI

| Keputusan | Responsible | Accountable | Consulted | Informed |
|-----------|-------------|-------------|-----------|----------|
| Prioritas fitur MVP | Product Manager | Founder | Engineering Lead | Seluruh tim |
| Arsitektur teknis | Engineering Lead | Engineering Lead | Product Manager | Founder |
| Desain UI/UX | UI/UX Designer | Product Manager | Engineering Lead | Founder |
| Peluncuran produk | Product Manager | Founder | Seluruh tim | Mitra komunitas |
| Kebijakan pengguna | Founder | Founder | Product Manager | Seluruh tim |

---

## 5. Kebutuhan Bisnis

Bagian ini mendefinisikan apa yang harus dipenuhi platform dari sisi bisnis. Kebutuhan teknis lebih lanjut dirinci di dokumen PRD.

### 5.1 Kebutuhan Fungsional Bisnis

**KB-01: Platform harus mampu mempertemukan Mentee dan Mentor secara mandiri.**
Proses matching tidak memerlukan intervensi manual dari tim internal. Mentee mengajukan request, Mentor mengirim proposal, dan Mentee memilih sendiri.

**KB-02: Platform harus memberikan transparansi penuh sebelum komitmen terjadi.**
Mentee dapat melihat profil, rating, metode mengajar, dan harga dari setiap Mentor yang apply sebelum memutuskan untuk memilih.

**KB-03: Platform harus dapat diakses tanpa hambatan teknis yang tinggi.**
Login menggunakan akun Google yang sudah dimiliki pengguna. Tidak ada proses registrasi manual yang panjang.

**KB-04: Platform harus memiliki mekanisme kepercayaan yang terukur.**
Sistem review dan rating pasca sesi menjadi sinyal kepercayaan utama yang membantu Mentee membuat keputusan.

**KB-05: Platform harus mendukung komunikasi antara Mentee dan Mentor setelah match.**
Chat terintegrasi menghilangkan kebutuhan berbagi kontak pribadi di tahap awal dan menjaga ekosistem tetap di dalam platform.

**KB-06: Platform harus memberikan notifikasi yang relevan dan tepat waktu.**
Setiap event penting (proposal masuk, match terjadi, pesan baru) harus dikomunikasikan via email agar pengguna tidak melewatkan aktivitas penting.

### 5.2 Kebutuhan Non-Fungsional Bisnis

**KB-07: Platform harus beroperasi dalam bahasa Indonesia.**
Bahasa Indonesia digunakan sebagai bahasa utama untuk memastikan aksesibilitas bagi seluruh segmen pengguna target di Indonesia.

**KB-08: Platform harus tersedia 99% dari waktu operasional.**
Downtime yang tidak terencana merusak kepercayaan pengguna, terutama pada fase awal ketika reputasi platform baru dibangun.

**KB-09: Platform tidak boleh menyimpan atau memproses data pembayaran di MVP.**
Untuk menghindari kompleksitas regulasi dan risiko keamanan di awal, seluruh transaksi finansial dilakukan di luar platform.

---

## 6. Analisis Pasar & Kompetitor

### 6.1 Ukuran Pasar

- Pasar edukasi online Indonesia diproyeksikan mencapai USD 2,5 miliar pada 2025.
- Penetrasi internet Indonesia mencapai lebih dari 215 juta pengguna, dengan segmen usia 18–35 tahun sebagai pengguna paling aktif.
- Permintaan talenta digital terus meningkat, didorong oleh pertumbuhan startup dan program digitalisasi pemerintah.

### 6.2 Analisis Kompetitor

| Kompetitor | Model | Kekuatan | Kelemahan vs Ajarin |
|-----------|-------|----------|---------------------|
| Ruangguru | B2C kursus pre-recorded | Brand kuat, skala besar | Tidak ada sesi personal 1-on-1 |
| Dicoding | B2C kursus + bootcamp | Komunitas tech yang besar | Tidak ada mekanisme matching berbasis kebutuhan |
| Superprof | C2C les privat | Model C2C mirip | Tidak ada sistem proposal/bidding, UX kurang optimal untuk Indonesia |
| MentorOnline | C2C mentoring | Fokus mentoring | Basis pengguna kecil, tidak ada mekanisme proposal terbuka |
| Upwork/Fiverr | C2C freelance | Jaringan besar | Tidak difokuskan untuk sesi belajar, bukan mentoring |

### 6.3 Keunggulan Kompetitif Ajarin

- **Sistem proposal terbuka:** Mentor bersaing dengan proposal terbaik mereka. Mentee mendapatkan pilihan yang lebih kaya dibanding platform yang menampilkan daftar statis.
- **Kebutuhan spesifik sebagai titik awal:** Alur dimulai dari kebutuhan Mentee, bukan dari katalog Mentor. Ini menghasilkan match yang lebih relevan.
- **Fokus lokal:** Bahasa Indonesia, konteks lokal, dan kanal komunitas yang relevan untuk pengguna Indonesia.

---

## 7. Model Bisnis

### 7.1 Segmen Pengguna

| Segmen | Peran di Platform | Nilai yang Diterima |
|--------|------------------|---------------------|
| Mentee | Pembeli jasa belajar | Akses ke Mentor berkualitas yang sesuai kebutuhan spesifik dan budget |
| Mentor | Penyedia jasa belajar | Kanal efisien untuk menemukan murid serius dan penghasilan tambahan |

### 7.2 Aliran Pendapatan

**Phase 1 (MVP): Tidak ada monetisasi langsung.**
Platform beroperasi gratis untuk membangun massa pengguna dan memvalidasi model.

**Phase 2 (Bulan 6+): Komisi Transaksi.**
Setelah payment gateway aktif, Ajarin mengambil komisi sebesar 10–15% dari setiap transaksi yang berhasil melalui platform.

**Phase 3 (Bulan 12+): Model Freemium untuk Mentor.**

| Tier | Harga | Benefit |
|------|-------|---------|
| Free | Rp 0 | Dapat apply ke request, profil publik dasar |
| Pro Mentor | Rp 99.000/bulan | Badge verifikasi, prioritas muncul di pencarian, analitik profil |

**Revenue stream tambahan yang direncanakan:**
- Fitur Boost Request: Mentee membayar untuk memprioritaskan request mereka di halaman browse Mentor.
- Iklan komunitas: Partner bootcamp atau perusahaan tech yang ingin menjangkau pengguna Ajarin.

### 7.3 Struktur Biaya Utama

| Komponen | Estimasi Biaya (MVP) | Keterangan |
|----------|---------------------|-----------|
| Hosting (Vercel) | Rp 0 (free tier) | Cukup untuk traffic MVP awal |
| Database (Supabase) | Rp 0 (free tier) | Cukup untuk 500 pengguna awal |
| Email (Resend) | Rp 0 (free tier) | 100 email/hari pada free tier |
| Domain | Rp 200.000/tahun | ajarin.id atau ajarin.co |
| Desain (Figma) | Rp 0 (free tier) | Untuk tim kecil |
| Biaya development | Variabel | Tergantung tim internal atau outsource |

---

## 8. Asumsi & Ketergantungan

### 8.1 Asumsi Bisnis

| ID | Asumsi |
|----|--------|
| A-01 | Pengguna target sudah memiliki akun Google dan terbiasa dengan login berbasis OAuth |
| A-02 | Segmen awal (mahasiswa dan junior developer) memiliki budget Rp 50.000–300.000 per sesi |
| A-03 | Mentor bersedia bergabung tanpa insentif finansial langsung di MVP, didorong oleh reputasi dan jaringan |
| A-04 | Komunitas developer Indonesia (Discord, LinkedIn) dapat menjadi kanal akuisisi yang efektif dan berbiaya rendah |
| A-05 | Pengguna bersedia menyelesaikan transaksi pembayaran di luar platform pada MVP |
| A-06 | Sesi belajar berlangsung via video call eksternal (Zoom, Google Meet) yang sudah familiar bagi pengguna |

### 8.2 Ketergantungan

| ID | Ketergantungan | Risiko jika Tidak Terpenuhi |
|----|---------------|----------------------------|
| D-01 | Google OAuth API tersedia dan stabil | Pengguna tidak bisa login sama sekali |
| D-02 | Supabase Realtime berfungsi untuk chat | Fitur chat real-time tidak dapat digunakan |
| D-03 | Layanan email (Resend) aktif dan terkirim | Notifikasi tidak sampai ke pengguna |
| D-04 | Tim development tersedia penuh selama 10 minggu | Timeline MVP molor |

---

## 9. Batasan Bisnis

Berikut adalah batasan yang harus dipahami oleh seluruh stakeholder sebelum development dimulai:

**BB-01: Tidak ada moderasi konten otomatis di MVP.**
Seluruh konten (request, proposal, review) dimoderasi secara manual oleh tim internal jika ada laporan dari pengguna.

**BB-02: Platform tidak memiliki tanggung jawab hukum atas kualitas sesi.**
Ajarin berfungsi sebagai fasilitator pertemuan. Kualitas sesi dan hasil belajar sepenuhnya menjadi tanggung jawab Mentor dan Mentee yang bersangkutan.

**BB-03: Tidak ada jaminan refund di MVP.**
Karena tidak ada payment gateway, tidak ada mekanisme refund formal. Kebijakan ini akan direvisi saat Phase 2 aktif.

**BB-04: Platform hanya tersedia dalam Bahasa Indonesia di MVP.**
Internasionalisasi (i18n) tidak masuk dalam scope MVP.

**BB-05: Pengguna harus berusia minimal 17 tahun.**
Batasan usia ini ditetapkan untuk memastikan kepatuhan terhadap peraturan perlindungan data anak di Indonesia.

---

## 10. Kriteria Keberhasilan

Berikut adalah definisi sukses dari perspektif bisnis, yang diukur pada akhir bulan ketiga setelah launch:

### 10.1 Kriteria Kuantitatif

| ID | Metrik | Target | Cara Ukur |
|----|--------|--------|-----------|
| KK-01 | Total pengguna terdaftar | 500 users | Database count |
| KK-02 | Mentor aktif (pernah apply minimal 1 proposal) | 50 Mentor | Dashboard internal |
| KK-03 | Total request aktif di platform | 100 request | Dashboard internal |
| KK-04 | Match Rate (request yang berhasil matched) | lebih dari atau sama dengan 40% | Matched / Total requests |
| KK-05 | Rata-rata proposal per request | lebih dari atau sama dengan 2 proposal | Avg per request |
| KK-06 | Time to First Match | kurang dari atau sama dengan 48 jam | Timestamp match dikurangi timestamp request |
| KK-07 | Repeat Usage Mentee | lebih dari atau sama dengan 25% | Cohort analysis bulan ke-2 |
| KK-08 | Average Rating Mentor | lebih dari atau sama dengan 4.2 dari 5 | Review aggregation |

### 10.2 Kriteria Kualitatif

| ID | Kriteria |
|----|---------|
| KL-01 | Mentee dapat menemukan dan memilih Mentor tanpa bantuan dari tim internal |
| KL-02 | Mentor merasa proses apply proposal cukup mudah dan tidak memakan waktu lebih dari 10 menit |
| KL-03 | Tidak ada keluhan mayor terkait keamanan data pengguna dalam 3 bulan pertama |
| KL-04 | Net Promoter Score (NPS) dari pengguna awal mencapai nilai positif (lebih dari 0) |

---

## 11. Risiko Bisnis

### 11.1 Matriks Risiko

| ID | Risiko | Kemungkinan | Dampak | Skor | Mitigasi |
|----|--------|-------------|--------|------|---------|
| R-01 | Cold start: tidak ada Mentor di awal launch | Tinggi | Tinggi | Kritis | Onboard 20–30 Mentor secara manual sebelum platform dibuka ke publik |
| R-02 | Request tidak mendapat proposal (platform terlihat sepi) | Sedang | Tinggi | Tinggi | Tim internal mengirim request ke Mentor secara manual di bulan pertama |
| R-03 | Pengguna bypass platform untuk deal langsung di luar | Tinggi | Sedang | Tinggi | Bangun nilai unik di dalam platform: history, review, dan trust yang tidak bisa didapat di luar |
| R-04 | Kualitas Mentor tidak terjaga dan merusak reputasi platform | Sedang | Tinggi | Tinggi | Sistem rating ketat, batas minimum rating untuk tetap aktif, kurasi manual awal |
| R-05 | Regulasi baru terkait platform digital atau edukasi di Indonesia | Rendah | Tinggi | Sedang | Pantau regulasi OJK dan Kemendikbud, konsultasi hukum sebelum Phase 2 |
| R-06 | Kompetitor besar masuk ke segmen yang sama | Rendah | Tinggi | Sedang | Percepat product-market fit dan bangun loyalitas komunitas sebelum kompetitor hadir |
| R-07 | Scope creep memperlambat timeline MVP | Sedang | Sedang | Sedang | Feature freeze setelah planning sprint pertama, backlog dikelola ketat |

### 11.2 Rencana Kontinjensi

Jika match rate di bawah 20% setelah bulan pertama, tim akan:
1. Melakukan user interview dengan Mentee yang tidak memilih mentor apapun.
2. Meninjau ulang kualitas profil Mentor yang apply.
3. Menambahkan fitur "Request Terfeatured" untuk mendorong lebih banyak proposal.

---

## 12. Regulasi & Kepatuhan

### 12.1 Undang-Undang Perlindungan Data Pribadi (UU PDP)

Platform Ajarin mengumpulkan dan memproses data pribadi pengguna. Kepatuhan terhadap UU PDP No. 27 Tahun 2022 wajib dipenuhi, dengan ketentuan sebagai berikut:

- Pengguna harus memberikan persetujuan eksplisit (consent) sebelum data mereka diproses.
- Platform wajib menyediakan kebijakan privasi yang jelas dan mudah diakses.
- Pengguna memiliki hak untuk meminta penghapusan akun dan data mereka.
- Data pribadi tidak boleh dibagikan kepada pihak ketiga tanpa consent pengguna.

### 12.2 Ketentuan Layanan Google OAuth

Penggunaan Google OAuth mengharuskan platform mematuhi ketentuan layanan Google, termasuk:

- Hanya meminta izin akses (scope) yang benar-benar dibutuhkan (email dan profil dasar).
- Tidak menyimpan password Google pengguna dalam bentuk apapun.
- Menampilkan informasi yang jelas kepada pengguna tentang data apa yang diakses saat login.

### 12.3 Syarat & Ketentuan Platform

Dokumen Syarat & Ketentuan harus dibuat sebelum launch dan mencakup:

- Definisi peran dan tanggung jawab Mentee dan Mentor.
- Pernyataan bahwa Ajarin adalah fasilitator dan bukan penyedia jasa edukasi langsung.
- Kebijakan konten yang dilarang (spam, konten berbahaya, informasi palsu).
- Mekanisme penyelesaian sengketa antar pengguna.

---

## 13. Roadmap Bisnis

### Phase 1: Validasi (Bulan 1–3)

**Fokus:** Membuktikan bahwa model matching berbasis proposal diminati pasar Indonesia.

| Aktivitas | Target Selesai |
|-----------|---------------|
| Soft launch platform MVP | Minggu ke-10 |
| Onboarding manual 30 Mentor awal | Minggu ke-8 |
| Kampanye akuisisi via komunitas dev | Minggu ke-10 |
| Pengumpulan feedback pengguna awal (user interview) | Bulan ke-2 |
| Evaluasi success metrics pertama | Akhir bulan ke-3 |

### Phase 2: Monetisasi (Bulan 4–9)

**Fokus:** Mengaktifkan aliran pendapatan pertama dan memperluas basis pengguna.

| Aktivitas | Target Selesai |
|-----------|---------------|
| Integrasi payment gateway (Midtrans atau Xendit) | Bulan ke-6 |
| Peluncuran fitur Boost Request | Bulan ke-7 |
| Ekspansi kategori skill di luar tech | Bulan ke-8 |
| Peluncuran dashboard analitik untuk Mentor | Bulan ke-9 |

### Phase 3: Skalabilitas (Bulan 10–18)

**Fokus:** Memperluas jangkauan produk dan mempersiapkan ekspansi.

| Aktivitas | Target Selesai |
|-----------|---------------|
| Peluncuran Mobile App (iOS dan Android) | Bulan ke-12 |
| Peluncuran Subscription Pro Mentor | Bulan ke-12 |
| Ekspansi kategori ke bahasa, desain, dan bisnis | Bulan ke-14 |
| Studi kelayakan ekspansi ke Malaysia dan Filipina | Bulan ke-18 |

---

## 14. Persetujuan Dokumen

Dokumen ini dianggap sah dan berlaku setelah ditandatangani oleh seluruh stakeholder kunci berikut:

| Nama | Jabatan | Tanda Tangan | Tanggal |
|------|---------|-------------|---------|
| | Founder / Product Owner | | |
| | Product Manager | | |
| | Engineering Lead | | |
| | UI/UX Designer | | |

---

### Riwayat Perubahan Dokumen

| Versi | Tanggal | Penulis | Perubahan |
|-------|---------|---------|-----------|
| 1.0 | 16 Mei 2026 | | Draft awal BRD berdasarkan PRD Ajarin v1.1 |

---

*Dokumen ini bersifat living document dan akan diperbarui seiring perkembangan bisnis dan produk.*
*Referensi teknis lebih lanjut tersedia di PRD Ajarin v1.1.*
