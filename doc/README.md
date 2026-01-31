# GuruPreneur Web Documentation

## 📋 Daftar Isi
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Dokumentasi Halaman (Pages)](PAGES.md)
- [Fitur Utama](#fitur-utama)
- [Setup & Development](#setup--development)
- [Environment Variables](#environment-variables)

---

## Overview

**GuruPreneur** (SkillMentor) adalah platform penghubung mentor dan murid. Platform ini memungkinkan:
- **Tutor** untuk membuat dan mengelola course
- **Student** untuk mendaftar dan mengikuti course
- **Admin** untuk menyetujui/menolak aplikasi tutor

---

## Tech Stack

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Next.js | 14.2.x | React framework dengan App Router |
| React | 18.2.0 | UI library |
| TypeScript | 5.9.x | Type-safe JavaScript |
| Prisma | 7.2.0 | ORM untuk database |
| PostgreSQL | - | Database (via Vercel Postgres) |
| Clerk | 6.36.x | Authentication |
| Tailwind CSS | 4.x | Styling |
| Cloudinary | - | Media storage |

---

## Struktur Project

```
GuruPreneur-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── admin/          # Admin endpoints
│   │   │   ├── courses/        # Course endpoints
│   │   │   ├── enroll/         # Enrollment endpoint
│   │   │   └── tutor/          # Tutor endpoints
│   │   ├── admin/              # Admin pages
│   │   ├── courses/            # Course pages
│   │   ├── tutor/              # Tutor pages
│   │   └── ...
│   ├── components/             # Reusable components
│   └── lib/                    # Utility libraries
├── lib/
│   └── prisma.ts               # Prisma client
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── doc/                        # Documentation
```

---

## Database Schema

### Enums

```prisma
enum UserRole {
  USER      // User biasa
  STUDENT   // User yang sudah enroll course
  TUTOR     // Pengajar
  ADMIN     // Administrator
}

enum TutorApplicationStatus {
  PENDING   // Menunggu review
  APPROVED  // Disetujui
  REJECTED  // Ditolak
}
```

### Models

#### User
| Field | Type | Keterangan |
|-------|------|------------|
| id | Int | Primary key |
| clerkId | String | ID dari Clerk auth |
| role | UserRole | Role user |
| createdAt | DateTime | Tanggal dibuat |

#### Tutor
| Field | Type | Keterangan |
|-------|------|------------|
| id | Int | Primary key |
| userId | Int | Relasi ke User |
| clerkId | String | ID dari Clerk |
| fullName | String? | Nama lengkap |
| bio | String? | Bio tutor |
| skills | String[] | List keahlian |
| portfolioLinks | String[] | Link portfolio |
| isActive | Boolean | Status aktif |

#### Course
| Field | Type | Keterangan |
|-------|------|------------|
| id | Int | Primary key |
| tutorId | Int | Relasi ke Tutor |
| title | String | Judul course |
| description | String | Deskripsi |
| imageUrl | String? | Gambar course |
| price | Int | Harga (0 = gratis) |
| benefits | String[] | Manfaat course |

#### Chapter
| Field | Type | Keterangan |
|-------|------|------------|
| id | Int | Primary key |
| courseId | Int | Relasi ke Course |
| title | String | Judul chapter |

#### Lesson
| Field | Type | Keterangan |
|-------|------|------------|
| id | Int | Primary key |
| chapterId | Int | Relasi ke Chapter |
| title | String | Judul lesson |
| content | String? | Konten teks |
| videoUrl | String? | URL video |
| fileUrl | String? | URL file materi |
| order | Int | Urutan |

#### Enrollment
| Field | Type | Keterangan |
|-------|------|------------|
| id | Int | Primary key |
| userId | Int | Relasi ke User |
| courseId | Int | Relasi ke Course |
| createdAt | DateTime | Tanggal enroll |

#### TutorApplication
| Field | Type | Keterangan |
|-------|------|------------|
| id | Int | Primary key |
| clerkId | String | ID dari Clerk |
| fullName | String | Nama lengkap |
| bio | String | Bio |
| skills | String[] | Keahlian |
| teachingPlan | String | Rencana mengajar |
| status | TutorApplicationStatus | Status aplikasi |
| rejectionReason | String? | Alasan penolakan |

---

## API Endpoints

### Authentication
Menggunakan **Clerk** untuk authentication. Semua endpoint yang membutuhkan auth akan mengecek session dari Clerk.

### Tutor Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/tutor/me` | Get current tutor data |
| POST | `/api/tutor/apply` | Apply menjadi tutor |
| GET | `/api/tutor/application` | Get status aplikasi |
| PUT | `/api/tutor/update` | Update profil tutor |
| GET | `/api/tutor/courses` | Get courses milik tutor |
| POST | `/api/tutor/courses` | Create new course |
| PUT | `/api/tutor/courses/[id]` | Update course |
| DELETE | `/api/tutor/courses/[id]` | Delete course |

### Course Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/[id]` | Get course detail |

### Enrollment Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/enroll` | Enroll ke course |

### Admin Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/admin/tutor-applications` | Get semua aplikasi tutor |
| GET | `/api/admin/tutor-applications/[id]` | Get detail aplikasi |
| POST | `/api/admin/tutor-applications/[id]/approve` | Approve aplikasi |
| POST | `/api/admin/tutor-applications/[id]/reject` | Reject aplikasi |

---

## Fitur Utama

### 1. Authentication (Clerk)
- Sign up / Sign in
- Session management
- Protected routes

### 2. Tutor Management
- Apply menjadi tutor (form aplikasi)
- Admin review aplikasi
- Dashboard tutor untuk kelola course

### 3. Course Management
- Create, edit, delete course
- Tambah chapter dan lesson
- Upload gambar ke Cloudinary

### 4. Enrollment
- Student bisa enroll ke course
- Auto-create user jika belum ada
- Update role ke STUDENT setelah enroll

### 5. Admin Panel
- Review aplikasi tutor
- Approve/reject dengan alasan

---

## Setup & Development

### Prerequisites
- Node.js 20.x
- npm atau yarn
- PostgreSQL database (atau Vercel Postgres)

### Installation

```bash
# Clone repository
git clone https://github.com/Skeyiae/GuruPreneur-web.git
cd GuruPreneur-web

# Install dependencies
npm install

# Setup environment variables
# Copy .env.example ke .env dan isi nilai-nilainya

# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Jalankan development server
npm run dev
```

### Scripts

| Script | Keterangan |
|--------|------------|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build production |
| `npm run start` | Start production server |
| `npm run lint` | Jalankan ESLint |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema ke database |
| `npx prisma studio` | Buka Prisma Studio |

---

## Environment Variables

| Variable | Keterangan |
|----------|------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_FRONTEND_API` | Clerk frontend API URL |
| `guru_preneur_PRISMA_DATABASE_URL` | Prisma Accelerate URL |
| `guru_preneur_POSTGRES_URL` | Direct Postgres URL |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset |

---

## Git Workflow

### Branches
- `main` - Production branch
- `dev` - Development branch

### Commands

```bash
# Pindah ke branch dev
git checkout dev

# Pull perubahan terbaru
git pull origin dev

# Push perubahan
git add .
git commit -m "feat: description"
git push origin dev
```

---

## Contact

- **Repository**: https://github.com/Skeyiae/GuruPreneur-web
- **License**: ISC
