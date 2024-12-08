# API Documentation (api-cc.md)

## Introduction
Selamat datang di dokumentasi lengkap API. File ini akan menjelaskan detail penggunaan API dari seluruh kode yang telah diberikan, termasuk endpoint publik, endpoint terproteksi, autentikasi, validasi input, serta contoh request dan response. Tujuan dokumentasi ini adalah memberikan panduan komprehensif bagi pengembang atau pengguna API untuk dapat mengintegrasikan layanan ini secara efisien.

## Daftar Isi
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi & Konfigurasi](#instalasi--konfigurasi)
- [Struktur Project](#struktur-project)
- [Environment Variables](#environment-variables)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Autentikasi](#autentikasi)
- [Endpoints](#endpoints)
  - [Public Endpoints](#public-endpoints)
    - [GET `/`](#get-)
    - [POST `/api/v1/register`](#post-apiv1register)
    - [POST `/api/v1/login`](#post-apiv1login)
    - [GET `/api/articles`](#get-apiarticles)
    - [GET `/api/articles/:id`](#get-apiarticlesid)
  - [Protected Endpoints](#protected-endpoints)
    - [GET `/api/v1/me`](#get-apiv1me)
    - [PATCH `/api/v2/me`](#patch-apiv2me)
    - [POST `/api/v1/measure`](#post-apiv1measure)
    - [GET `/api/v1/measures`](#get-apiv1measures)
    - [GET `/api/v1/measure/:measure_id`](#get-apiv1measuremeasure_id)
    - [POST `/api/v1/nutrition`](#post-apiv1nutrition)
    - [GET `/api/v1/nutritions`](#get-apiv1nutritions)
    - [GET `/api/v1/nutrition/:nutrition_id`](#get-apiv1nutritionnutrition_id)
- [Validasi Input](#validasi-input)
- [Format Respon](#format-respon)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Catatan Lain](#catatan-lain)

---

## Persyaratan Sistem
- Node.js versi 14 atau lebih baru
- NPM atau Yarn sebagai package manager
- Database Postgres (dengan Prisma sebagai ORM)
- Beberapa service eksternal untuk ML measure dan prediksi nutrisi (jika diperlukan)

## Instalasi & Konfigurasi
1. Clone repository:
   ```bash
   git clone https://your-repo-url.git
   cd nama-folder
   ```
   
2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Migrasi database:
   ```bash
   npx prisma migrate dev
   ```

4. Buat file `.env` berdasarkan `.env.example` dan isi dengan variabel environment yang diperlukan.

## Struktur Project (Contoh)
```
.
├── controllers/
│   ├── user.controller.js
│   ├── measure.controller.js
│   └── article.controller.js
├── services/
│   ├── user.service.js
│   ├── measure.service.js
│   └── ...
├── validations/
│   ├── user.validation.js
│   ├── measure.validation.js
│   └── ...
├── middlewares/
│   ├── authentication.middlewares.js
│   ├── uploadImage.middleware.js
│   └── ...
├── utils/
│   ├── axios.js
│   ├── bcrypt.js
│   ├── jsonwebtoken.js
│   ├── validation.js
│   └── ...
├── configs/
│   ├── db.js
│   └── ...
├── routes/
│   ├── public.js
│   └── api.js
├── app.js
├── server.js
└── api-cc.md
```

## Environment Variables
Beberapa contoh variabel environment:
- `DATABASE_URL` : URL database Postgres untuk prisma
- `JWT_SECRET` : Secret key untuk JWT
- `PORT` : Port yang digunakan server
- Variabel lain untuk integrasi API eksternal

Contoh `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"
JWT_SECRET="yoursecretkey"
PORT=3000
```

## Menjalankan Aplikasi
Setelah konfigurasi:
```bash
npm run dev
```
Akses API melalui `http://localhost:3000/`.

## Autentikasi
- Beberapa endpoint membutuhkan autentikasi JWT.
- Dapatkan token dengan `/api/v1/login`.
- Sertakan `Authorization: Bearer <token>` pada request ke endpoint yang dilindungi.

---

## Endpoints

### Public Endpoints

#### GET `/`
**Deskripsi:**  
Cek apakah API berjalan.

**Response Example:**
```json
{
  "message": "API is ready for you"
}
```

#### POST `/api/v1/register`
**Deskripsi:**  
Mendaftarkan user baru.

**Request Body:**
```json
{
  "email": "user@example.com",
  "full_name": "User Name",
  "gender": "male", 
  "birth_day": "2020-01-01",
  "password": "StrongPassw0rd!"
}
```

**Response Example:**
```json
{
  "error": false,
  "message": "Account created successfully",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "full_name": "User Name",
    "gender": "male",
    "birth_day": "2020-01-01",
    "foto_url": null
  }
}
```

#### POST `/api/v1/login`
**Deskripsi:**  
Login dengan email dan password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassw0rd!"
}
```

**Response Example:**
```json
{
  "error": false,
  "message": "Login successful",
  "data": "JWT_TOKEN_HERE"
}
```

#### GET `/api/articles`
**Deskripsi:**  
Mengambil daftar artikel.

**Response Example:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "article-id",
      "title": "Article Title",
      "content": "Article Content"
    }
  ]
}
```

#### GET `/api/articles/:id`
**Deskripsi:**  
Mengambil detail artikel berdasarkan `id`.

**Response Example:**
```json
{
  "status": "success",
  "data": {
    "id": "article-id",
    "title": "Article Title",
    "content": "Article Content"
  }
}
```

---

### Protected Endpoints
Perlu header `Authorization: Bearer <JWT_TOKEN>`.

#### GET `/api/v1/me`
**Deskripsi:**  
Mengambil data user yang sedang login.

**Response Example:**
```json
{
  "error": false,
  "message": "Successfully retrieved user data",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "full_name": "User Name",
    "gender": "male",
    "birth_day": "2020-01-01",
    "foto_url": null
  }
}
```

#### PATCH `/api/v2/me`
**Deskripsi:**  
Mengedit data user.

**Request Body (opsional):**
```json
{
  "email": "newemail@example.com",
  "full_name": "New Name",
  "gender": "female",
  "birth_day": "2020-02-01",
  "password": "NewStr0ngPass!",
  "foto_url": "http://example.com/photo.jpg"
}
```

**Response Example:**
```json
{
  "error": false,
  "message": "User data updated successfully",
  "data": {
    "id": "user-id",
    "email": "newemail@example.com",
    "full_name": "New Name",
    "gender": "female",
    "birth_day": "2020-02-01",
    "foto_url": "http://example.com/photo.jpg"
  }
}
```

#### POST `/api/v1/measure`
**Deskripsi:**  
Menambahkan data pengukuran bayi. Upload file gambar (form-data).

**Form Data:**
- `date_measure` (string, `YYYY-MM-DD`)
- `level_activity` (valid: `Rendah`, `Sedang`, `Aktif`, `Sangat_Aktif`)
- `weight` (number)
- `status_asi` (valid: `ASI_Eksklusif`, `ASI+MPASI`, `MPASI`)
- `baby_photo` (file image, form-data)

**Response Example:**
```json
{
  "error": false,
  "message": "data created successfully",
  "data": {
    "measurement": {
      "id": "measure-id",
      "user_id": "user-id",
      "date_measure": "2024-12-08",
      "level_activity": "Sedang",
      "weight": 7.5,
      "baby_photo_url": "https://your-host.com/images/uploadedfile.jpg",
      "status_asi": "ASI_Eksklusif"
    },
    "imt_result": {
      "baby_length": 70,
      "z_score_bb_tb": 0.5,
      "status_imt": "Normal",
      "imt": 15.5,
      "z_score_length": 1.2,
      "z_score_weight": 0.8,
      "nitritional_status_weight": "Normal",
      "nitritional_status_length": "Normal",
      "status_bb_tb": "Normal"
    },
    "measurement_result": {
      "calories_needed": 600,
      "protein_needed": 12,
      "fat_needed": 20,
      "carbohydrate_needed": 80
    }
  }
}
```

#### GET `/api/v1/measures`
**Deskripsi:**  
Mengambil riwayat pengukuran bayi.

Query Parameter opsional:  
- `date` (format `YYYY-MM-DD`)
- `range` (0 = 0-6 bulan, 1 = 0-12 bulan, 2 = 0-24 bulan)

**Response Example:**
```json
{
  "status": "success",
  "message": "data get successfully",
  "data": [
    {
      "id": "measure-id",
      "user_id": "user-id",
      "date_measure": "2024-12-08",
      "level_activity": "Sedang",
      "weight": 7.5,
      "baby_photo_url": "http://...",
      "status_asi": "ASI_Eksklusif",
      "measuremenet_result": {
        "calories_needed": 600,
        "protein_needed": 12,
        ...
      },
      "IMT_Result": {
        "baby_length": 70,
        ...
      },
      "user": {
        "id": "user-id",
        "email": "user@example.com",
        ...
      }
    }
  ]
}
```

#### GET `/api/v1/measure/:measure_id`
**Deskripsi:**  
Detail pengukuran berdasarkan `measure_id`.

**Response Example:**
```json
{
  "error": false,
  "message": "get detail data successfully",
  "data": {
    "id": "measure-id",
    "user_id": "user-id",
    "date_measure": "2024-12-08",
    "level_activity": "Sedang",
    "weight": 7.5,
    "baby_photo_url": "http://...",
    "status_asi": "ASI_Eksklusif",
    "measuremenet_result": {
      "calories_needed": 600,
      ...
    },
    "IMT_Result": {
      "baby_length": 70,
      ...
    }
  }
}
```

#### POST `/api/v1/nutrition`
**Deskripsi:**  
Menambahkan data nutrisi makanan bayi.

**Request Body:**
```json
{
  "food_name": "Bubur Ayam",
  "date": "2024-12-08",
  "portion": 1
}
```

**Response Example:**
```json
{
  "succes": "false", 
  "message": "Data successfully created",
  "data": {
    "id": "nutrition-id",
    "food_name": "Bubur Ayam",
    "date": "2024-12-08",
    "portion": 1,
    "created_at": "2024-12-08T10:00:00Z",
    "Nutrition_Result": {
      "id": "nutrition-result-id",
      "notes": "Some notes",
      "calciums": 50,
      "calories": 200,
      "carbohydrates": 30,
      "fats": 5,
      "proteins": 10
    }
  }
}
```
*Catatan:* "succes": "false" tampaknya typo di kode asli. Asumsikan `"error": false` untuk konsistensi.

#### GET `/api/v1/nutritions`
**Deskripsi:**  
Mengambil riwayat nutrisi yang pernah dicatat.

**Response Example:**
```json
{
  "error": false,
  "message": "Get nutrition histories successfully",
  "data": {
    "histories": [
      {
        "id": "nutrition-id",
        "food_name": "Bubur Ayam",
        "date": "2024-12-08",
        "portion": 1,
        "created_at": "2024-12-08T10:00:00Z",
        "nutrition_details": {
          "notes": "Some notes",
          "calciums": 50,
          "calories": 200,
          "carbohydrates": 30,
          "fats": 5,
          "proteins": 10
        }
      }
    ],
    "total_nutrition": {
      "total_calories": 200,
      "total_proteins": 10,
      "total_carbohydrates": 30,
      "total_fats": 5,
      "total_calciums": 50
    }
  }
}
```

#### GET `/api/v1/nutrition/:nutrition_id`
**Deskripsi:**  
Detail data nutrisi berdasarkan `nutrition_id`.

**Response Example:**
```json
{
  "error": false,
  "message": "Get nutrition detail successfully",
  "data": {
    "id": "nutrition-id",
    "food_name": "Bubur Ayam",
    "date": "2024-12-08",
    "portion": 1,
    "created_at": "2024-12-08T10:00:00Z",
    "updated_at": "2024-12-08T10:00:00Z",
    "nutrition_result": {
      "id": "nutrition-result-id",
      "notes": "Some notes",
      "calciums": 50,
      "calories": 200,
      "carbohydrates": 30,
      "fats": 5,
      "proteins": 10
    }
  }
}
```

---

## Validasi Input
Validasi input dilakukan dengan Joi. Misalnya untuk registrasi:
- `email`: wajib, email valid
- `full_name`: wajib
- `gender`: `male` atau `female`
- `birth_day`: wajib, format tanggal
- `password`: minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol spesial

Jika validasi gagal, API akan mengembalikan error yang sesuai.

## Format Respon
- Berhasil: `error: false` atau `status: "success"`, disertai `data` dan `message`.
- Gagal: `error: true`, `message` menjelaskan error, status code 4xx/5xx.

## Error Handling
Kesalahan ditangani dengan `try-catch` dan `ResponseError`.  
Format response error:
```json
{
  "error": true,
  "message": "Error message"
}
```

## Logging
Setiap request dan error dicatat oleh logger, memudahkan debugging dan pemantauan sistem.

## Catatan Lain
- Pastikan endpoint eksternal (ML measure, nutrition predict) telah dikonfigurasi.
- Pastikan folder `images` ada dan memiliki permission untuk upload.
- Dokumentasi dapat disesuaikan jika terjadi perubahan pada kode atau fitur baru.

---

