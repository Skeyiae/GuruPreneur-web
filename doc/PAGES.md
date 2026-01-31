# Dokumentasi Halaman (Pages)

Dokumen ini menjelaskan **setiap halaman** pada aplikasi **GuruPreneur / SkillMentor** berbasis **Next.js App Router** (`src/app`).  
Fokus dokumentasi: **URL/Route**, **tujuan halaman**, **hak akses**, **data/API yang digunakan**, dan **komponen terkait**.

---

## Catatan Umum

- **Layout global**: semua halaman (kecuali yang menggunakan layout lain) dibungkus oleh `src/app/layout.tsx` yang memasang:
  - `ClerkProvider` (auth & session)
  - `Navbar` dan `Footer`
- **Auth**: menggunakan **Clerk**. Beberapa halaman memakai `useUser()` (client) atau `auth()` (server).
- **Data**: data course/tutor/lesson banyak diambil via **Prisma** (server component) atau `fetch()` ke API route (client component).
- **Dynamic Rendering**: beberapa halaman mengaktifkan `export const dynamic = "force-dynamic"` untuk memastikan data selalu terbaru.

---

## Layout

### 1) Root Layout
- **File**: `src/app/layout.tsx`
- **Berlaku untuk**: seluruh aplikasi (kecuali segmen yang override layout)
- **Fungsi**:
  - Membungkus app dengan `ClerkProvider`
  - Menampilkan `Navbar` dan `Footer`
  - Meletakkan konten halaman di `<main className="flex-1 w-full">`

### 2) Admin Layout (Proteksi Admin)
- **File**: `src/app/admin/layout.tsx`
- **Berlaku untuk**: semua halaman di bawah `/admin/*`
- **Hak akses**: **Admin-only**
- **Mekanisme**:
  - Jika belum login → redirect ke `/sign-in`
  - Ambil user dari Clerk (`clerkClient().users.getUser(userId)`)
  - Cek email user harus ada di allowlist `ADMIN_EMAILS`
  - Jika bukan admin → redirect ke `/`

---

## Halaman Public (umumnya bisa diakses semua user)

### 1) Home (Landing / Beranda)
- **URL**: `/`
- **File**: `src/app/page.tsx`
- **Tipe**: Client Component (`"use client"`)
- **Fungsi**:
  - Menampilkan sambutan “Welcome back” (jika login) + avatar user (Clerk)
  - Menampilkan `HeroSection`
  - Menampilkan `CourseList` (daftar course)
- **Data/API**:
  - Mengambil data user dari Clerk via `useUser()`
  - Data daftar course ditangani oleh komponen `CourseList` (lihat `src/components/course-list.tsx`)
- **Komponen**:
  - `src/components/header.tsx` (`HeroSection`)
  - `src/components/course-list.tsx` (`CourseList`)

### 2) Homepage (Hero saja)
- **URL**: `/homepage`
- **File**: `src/app/homepage/page.tsx`
- **Tipe**: Client Component (`"use client"`)
- **Fungsi**:
  - Menampilkan `HeroSection`
  - Melog userId ke console (debug)
- **Data/API**:
  - Mengambil `userId` dari Clerk via `useAuth()` (hanya untuk logging)

### 3) About
- **URL**: `/about`
- **File**: `src/app/about/page.tsx`
- **Tipe**: Server Component (default)
- **Fungsi**:
  - Halaman informasi “Tentang SkillMentor”
  - Menampilkan misi, fitur, dan CTA menuju daftar tutor / mulai belajar
- **Data/API**: tidak ada (konten statis)

### 4) Benefits
- **URL**: `/benefits`
- **File**: `src/app/benefits/page.tsx`
- **Tipe**: Server Component (default)
- **Fungsi**:
  - Menampilkan daftar benefit (statis) + CTA
- **Data/API**: tidak ada (konten statis)

### 5) All Courses (Daftar semua course)
- **URL**: `/courses`
- **File**: `src/app/courses/page.tsx`
- **Tipe**: Server Component
- **Dynamic**: `force-dynamic`
- **Fungsi**:
  - Menampilkan daftar course terbaru (grid) dan link ke detail course
- **Data/API**:
  - Prisma: `prisma.course.findMany({ include: { tutor: true }, orderBy: { createdAt: "desc" } })`
- **Komponen**:
  - `next/link` untuk navigasi ke `/courses/[id]`

### 6) Course Detail (Detail course + enroll + materi)
- **URL**: `/courses/[id]`
- **File**: `src/app/courses/[id]/page.tsx`
- **Tipe**: Server Component
- **Dynamic**: `force-dynamic`
- **Fungsi**:
  - Menampilkan detail course (judul, deskripsi, harga, mentor)
  - Menentukan apakah user sudah **enroll** atau belum
  - Jika sudah enroll: tampilkan seluruh materi (chapters + lessons + video/file/text)
  - Jika belum: tampilkan preview daftar chapter
- **Data/API**:
  - Clerk server auth: `auth()` untuk ambil `userId`
  - Prisma:
    - Cari `User` via `clerkId`
    - Cek `Enrollment` untuk course ini
    - Ambil course lengkap via `prisma.course.findUnique({ include: tutor, chapters->lessons })`
- **Komponen**:
  - `src/components/enroll-button.tsx` (`EnrollButton`)
  - `src/components/video-player.tsx` (`VideoPlayer`)

---

## Halaman Tutor (untuk user yang mendaftar/berperan sebagai tutor)

### 1) Apply Tutor (Form pendaftaran tutor)
- **URL**: `/tutor/apply-tutor`
- **File**: `src/app/tutor/apply-tutor/page.tsx`
- **Tipe**: Client Component
- **Hak akses**: user harus login (jika belum login tampil pesan)
- **Fungsi**:
  - Form pengajuan tutor: nama, bio, portfolio (comma-separated), skills (comma-separated), teaching plan
  - Submit ke API dan menampilkan status sukses
- **Data/API**:
  - `POST /api/tutor/apply` dengan body JSON hasil parsing array `portfolioLinks` dan `skills`
- **Komponen UI**:
  - `Button`, `Input`, `Textarea`, `Card`, `Label`, `Alert`

### 2) Status Pengajuan Tutor
- **URL**: `/tutor/status`
- **File**: `src/app/tutor/status/page.tsx`
- **Tipe**: Client Component
- **Hak akses**: login required (kalau belum login → redirect `/sign-in`)
- **Fungsi**:
  - Mengambil status aplikasi tutor: `PENDING` / `APPROVED` / `REJECTED`
  - Tombol menuju dashboard bila approved
- **Data/API**:
  - `GET /api/tutor/application`
  - Jika 404 → redirect ke `/tutor/apply` (catatan: route ini berbeda dengan `/tutor/apply-tutor`)

### 3) Tutor Dashboard (ringkasan & daftar course tutor)
- **URL**: `/tutor/dashboard`
- **File**: `src/app/tutor/dashboard/page.tsx`
- **Tipe**: Server Component
- **Dynamic**: `force-dynamic`
- **Hak akses**: login required (server redirect `/sign-in`)
- **Fungsi**:
  - Menampilkan statistik: total courses & total chapters
  - Menampilkan daftar course tutor & fitur create/edit/delete via komponen client
- **Data/API**:
  - Clerk server auth: `auth()`
  - Prisma: `prisma.tutor.findUnique({ where: { clerkId }, include: { courses: { include: { chapters: true }}}})`
  - Redirect jika tutor belum ada (`/tutor/register`) atau belum aktif (`/tutor/pending`)
- **Komponen**:
  - `src/app/tutor/dashboard/tutor-dashboard-client.tsx` (`TutorDashboardClient`)

### 4) Tutor Dashboard Client (create/edit/delete course)
- **URL**: (bagian dari `/tutor/dashboard`)
- **File**: `src/app/tutor/dashboard/tutor-dashboard-client.tsx`
- **Tipe**: Client Component
- **Fungsi**:
  - Tombol “Create Course” membuka modal form
  - Edit membuka modal form berisi data awal
  - Delete memanggil API lalu reload halaman
- **Data/API**:
  - `DELETE /api/tutor/courses/[id]`
  - Form create/edit menggunakan `CourseForm` (lihat `src/app/tutor/dashboard/courses/course-form.tsx`)

### 5) Course Form (create/edit course + upload image)
- **URL**: (dipakai di dashboard tutor)
- **File**: `src/app/tutor/dashboard/courses/course-form.tsx`
- **Tipe**: Client Component
- **Fungsi**:
  - Upload gambar course ke Cloudinary (validasi tipe & ukuran)
  - Submit create/edit course ke API tutor
- **Data/API**:
  - Cloudinary upload: `POST https://api.cloudinary.com/v1_1/<cloud>/image/upload`
  - Create: `POST /api/tutor/courses`
  - Update: `PUT /api/tutor/courses/[courseId]`

### 6) Manage Course (Tutor side: daftar chapter + tambah chapter)
- **URL**: `/tutor/courses/[courseId]`
- **File**: `src/app/tutor/courses/[courseId]/page.tsx`
- **Tipe**: Server Component
- **Dynamic**: `force-dynamic`
- **Fungsi**:
  - Menampilkan detail course tutor
  - Form tambah chapter (`CreateChapterForm`)
  - Daftar chapter + link ke manage lesson
- **Data/API**:
  - Prisma: `prisma.course.findUnique({ include: chapters->lessons })`
- **Komponen**:
  - `src/components/tutor/create-chapter-form.tsx`

### 7) Manage Chapter (Tutor side: daftar lesson + tambah lesson)
- **URL**: `/tutor/chapters/[chapterId]`
- **File**: `src/app/tutor/chapters/[chapterId]/page.tsx`
- **Tipe**: Server Component
- **Dynamic**: `force-dynamic`
- **Fungsi**:
  - Menampilkan detail chapter + info course
  - Form tambah lesson (`CreateLessonForm`)
  - Menampilkan daftar lesson (video/file/text)
- **Data/API**:
  - Prisma: `prisma.chapter.findUnique({ include: course, lessons(orderBy: order asc) })`
- **Komponen**:
  - `src/components/tutor/create-lesson-form.tsx`
  - `src/components/video-player.tsx`

---

## Halaman Tutor (varian lain di folder dashboard)

### 1) Tutor Dashboard Course Detail (Client fetch)
- **URL**: `/tutor/dashboard/courses/[id]`
- **File**: `src/app/tutor/dashboard/courses/[id]/page.tsx`
- **Tipe**: Client Component
- **Fungsi**:
  - Fetch detail course via API tutor dan menampilkan judul + deskripsi
- **Data/API**:
  - `GET /api/tutor/courses/[id]`

### 2) Tutor Dashboard Edit Course (Server fetch + CourseForm)
- **URL**: `/tutor/dashboard/courses/[id]/edit`
- **File**: `src/app/tutor/dashboard/courses/[id]/edit/page.tsx`
- **Tipe**: Server Component
- **Fungsi**:
  - Mengambil data course via Prisma lalu membuka `CourseForm` dalam mode edit
- **Data/API**:
  - Prisma: `prisma.course.findUnique({ where: { id } })`
  - Redirect ke `/tutor/dashboard` jika course tidak ditemukan

---

## Halaman Admin (khusus admin, dilindungi Admin Layout)

### 1) List Tutor Applications
- **URL**: `/admin/tutor-applications`
- **File**: `src/app/admin/tutor-applications/page.tsx`
- **Tipe**: Client Component
- **Hak akses**: admin-only (dijaga oleh `src/app/admin/layout.tsx`)
- **Fungsi**:
  - Menampilkan tabel semua aplikasi tutor (nama, status, tanggal apply)
  - Tombol “View” ke detail aplikasi
- **Data/API**:
  - `GET /api/admin/tutor-applications` (dengan `credentials: "include"`)
- **Komponen UI**:
  - `Table`, `Badge`, `Card`, `Button`

### 2) Tutor Application Detail (approve/reject)
- **URL**: `/admin/tutor-applications/[id]`
- **File**: `src/app/admin/tutor-applications/[id]/page.tsx`
- **Tipe**: Client Component
- **Hak akses**: admin-only
- **Fungsi**:
  - Menampilkan detail aplikasi: bio, skills, portfolio, teaching plan
  - Jika status `PENDING`: admin bisa `Approve` atau `Reject` (dengan alasan)
- **Data/API**:
  - `GET /api/admin/tutor-applications/[id]`
  - `POST /api/admin/tutor-applications/[id]/approve`
  - `POST /api/admin/tutor-applications/[id]/reject` (body `{ reason }`)
- **Komponen**:
  - `src/components/admin/rejectdialog.tsx` (`RejectDialog`)

---

## Catatan Kualitas (untuk laporan dosen)

- **Pemilihan Server vs Client Component**:
  - Halaman yang butuh akses DB langsung & proteksi server-side (mis. dashboard tutor, detail course) banyak dibuat sebagai **Server Component** dengan Prisma.
  - Halaman yang banyak interaksi form/UX (apply tutor, admin list) dibuat sebagai **Client Component** dan memanggil API route.
- **Keamanan**:
  - Area admin diproteksi dengan pemeriksaan session + allowlist email.
  - Area tutor dashboard memakai `auth()` server dan redirect jika tidak login.
- **Catatan route**:
  - Terdapat dua halaman pendaftaran tutor: `/tutor/apply-tutor` (ada) dan redirect di status page menuju `/tutor/apply` (cek konsistensi route bila diperlukan).

