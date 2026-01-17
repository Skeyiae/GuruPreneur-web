# API Documentation

Dokumentasi lengkap untuk semua API endpoints di GuruPreneur.

## Base URL
```
http://localhost:3000/api
```

---

## Authentication

Semua endpoint yang membutuhkan authentication menggunakan **Clerk**. Session akan otomatis dicek dari cookie.

---

## 📚 Courses

### Get All Courses
Mendapatkan daftar semua course yang tersedia.

**Endpoint:** `GET /api/courses`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Belajar JavaScript",
    "description": "Course lengkap JavaScript dari dasar",
    "imageUrl": "https://res.cloudinary.com/...",
    "price": 0,
    "tutor": {
      "fullName": "John Doe"
    }
  }
]
```

---

## 👤 Tutor

### Get Current Tutor
Mendapatkan data tutor yang sedang login.

**Endpoint:** `GET /api/tutor/me`

**Auth Required:** ✅

**Response:**
```json
{
  "id": 1,
  "clerkId": "user_xxx",
  "fullName": "John Doe",
  "bio": "Pengajar berpengalaman",
  "skills": ["JavaScript", "React"],
  "isActive": true,
  "courses": [...]
}
```

---

### Apply Menjadi Tutor
Mengajukan aplikasi untuk menjadi tutor.

**Endpoint:** `POST /api/tutor/apply`

**Auth Required:** ✅

**Request Body:**
```json
{
  "fullName": "John Doe",
  "bio": "Saya pengajar berpengalaman...",
  "skills": ["JavaScript", "React", "Node.js"],
  "portfolioLinks": ["https://github.com/johndoe"],
  "teachingPlan": "Saya berencana mengajar..."
}
```

**Response:**
```json
{
  "success": true,
  "application": {
    "id": 1,
    "status": "PENDING"
  }
}
```

---

### Get Application Status
Mendapatkan status aplikasi tutor.

**Endpoint:** `GET /api/tutor/application`

**Auth Required:** ✅

**Response:**
```json
{
  "id": 1,
  "status": "PENDING",
  "fullName": "John Doe",
  "createdAt": "2026-01-15T...",
  "rejectionReason": null
}
```

---

### Create Course
Membuat course baru (hanya untuk tutor aktif).

**Endpoint:** `POST /api/tutor/courses`

**Auth Required:** ✅ (Tutor only)

**Request Body:**
```json
{
  "title": "Belajar React",
  "description": "Course lengkap React dari dasar",
  "imageUrl": "https://res.cloudinary.com/...",
  "price": 100000,
  "benefits": ["Akses selamanya", "Sertifikat"]
}
```

**Response:**
```json
{
  "success": true,
  "course": {
    "id": 1,
    "title": "Belajar React"
  }
}
```

---

### Update Course
Mengupdate course yang dimiliki.

**Endpoint:** `PUT /api/tutor/courses/[id]`

**Auth Required:** ✅ (Tutor owner only)

**Request Body:**
```json
{
  "title": "Belajar React - Updated",
  "description": "Deskripsi baru"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Delete Course
Menghapus course yang dimiliki.

**Endpoint:** `DELETE /api/tutor/courses/[id]`

**Auth Required:** ✅ (Tutor owner only)

**Response:**
```json
{
  "success": true
}
```

---

## 📝 Enrollment

### Enroll to Course
Mendaftar ke course tertentu.

**Endpoint:** `POST /api/enroll`

**Auth Required:** ✅

**Request Body:**
```json
{
  "courseId": 1
}
```

**Response Success:**
```json
{
  "success": true
}
```

**Response Error - Already Enrolled:**
```json
{
  "error": "Already enrolled"
}
```

**Notes:**
- Jika user belum ada di database, akan otomatis dibuat
- Role user akan diupdate menjadi `STUDENT` setelah enroll pertama

---

## 🔐 Admin

### Get All Tutor Applications
Mendapatkan semua aplikasi tutor.

**Endpoint:** `GET /api/admin/tutor-applications`

**Auth Required:** ✅ (Admin only)

**Response:**
```json
[
  {
    "id": 1,
    "clerkId": "user_xxx",
    "fullName": "John Doe",
    "status": "PENDING",
    "createdAt": "2026-01-15T..."
  }
]
```

---

### Get Application Detail
Mendapatkan detail aplikasi tutor.

**Endpoint:** `GET /api/admin/tutor-applications/[id]`

**Auth Required:** ✅ (Admin only)

**Response:**
```json
{
  "id": 1,
  "clerkId": "user_xxx",
  "fullName": "John Doe",
  "bio": "...",
  "skills": ["JavaScript"],
  "portfolioLinks": ["https://..."],
  "teachingPlan": "...",
  "status": "PENDING"
}
```

---

### Approve Application
Menyetujui aplikasi tutor.

**Endpoint:** `POST /api/admin/tutor-applications/[id]/approve`

**Auth Required:** ✅ (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Tutor approved & activated"
}
```

**Notes:**
- Akan membuat/update User dengan role TUTOR
- Akan membuat record Tutor baru
- Status aplikasi berubah menjadi APPROVED

---

### Reject Application
Menolak aplikasi tutor.

**Endpoint:** `POST /api/admin/tutor-applications/[id]/reject`

**Auth Required:** ✅ (Admin only)

**Request Body:**
```json
{
  "reason": "Alasan penolakan"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application rejected"
}
```

---

## Error Responses

Semua endpoint menggunakan format error yang konsisten:

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Saat ini belum ada rate limiting yang diimplementasikan.

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |
