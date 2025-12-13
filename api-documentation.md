# 360° Best Employee Survey - API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Assessment Endpoints](#assessment-endpoints)
  - [Period Management](#period-management)
  - [Survey Management](#survey-management)
  - [Master Data](#master-data)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)

---

## Overview

API ini menyediakan layanan untuk sistem **360° Best Employee Survey** yang memungkinkan karyawan untuk:
- Melihat daftar orang yang harus dinilai
- Melakukan penilaian terhadap rekan kerja, atasan, dan bawahan
- Melihat progress assessment
- Mengelola periode, pillar, dan pertanyaan survey (untuk HRD)

**Base URL**: `https://your-domain.test/api`

---

## Authentication

Semua endpoint memerlukan autentikasi menggunakan **Sanctum Token**.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "date_of_birth": "1990-01-15"
}
```

**Response:**
```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Menggunakan Token
Sertakan token di header untuk setiap request:
```http
Authorization: Bearer 1|abc123...
```

---

## API Endpoints

### Assessment Endpoints

#### 1. Get Assessment Targets
Mendapatkan daftar orang yang harus dinilai oleh user yang sedang login.

```http
GET /api/assessments/targets?period_month=11&period_year=2025
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period_month` | integer | No | Bulan periode (1-12) |
| `period_year` | integer | No | Tahun periode |

**Response:**
```json
[
  {
    "target_employee": {
      "id": 2,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "department": {
        "id": 1,
        "name": "Front Office Department",
        "code": "FO"
      },
      "property": {
        "id": 1,
        "name": "LPP Garden Hotel",
        "code": "LPP"
      }
    },
    "role": "peer",
    "is_completed": false,
    "total_questions": 20,
    "answered_questions": 0
  },
  {
    "target_employee": {
      "id": 3,
      "name": "Siti Aminah",
      "email": "siti@example.com",
      "department": {
        "id": 1,
        "name": "Front Office Department",
        "code": "FO"
      }
    },
    "role": "peer",
    "is_completed": true,
    "total_questions": 20,
    "answered_questions": 20
  },
  {
    "target_employee": {
      "id": 4,
      "name": "Ratna Sari",
      "email": "ratna@example.com",
      "department": {
        "id": 1,
        "name": "Front Office Department",
        "code": "FO"
      }
    },
    "role": "supervisor",
    "is_completed": false,
    "total_questions": 20,
    "answered_questions": 5
  }
]
```

**Role Types:**
- `peer` - Rekan kerja (same level, same department)
- `supervisor` - Atasan (higher level)
- `subordinate` - Bawahan (lower level)

---

#### 2. Get Assessment Progress
Mendapatkan summary progress penilaian user yang sedang login.

```http
GET /api/assessments/progress?period_month=11&period_year=2025
Authorization: Bearer {token}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period_month` | integer | No | Bulan periode (1-12) |
| `period_year` | integer | No | Tahun periode |

**Response:**
```json
{
  "total_targets": 3,
  "completed_targets": 1,
  "completion_percentage": 33.33,
  "targets": [
    {
      "target_id": 2,
      "target_name": "Budi Santoso",
      "role": "peer",
      "is_completed": false
    },
    {
      "target_id": 3,
      "target_name": "Siti Aminah",
      "role": "peer",
      "is_completed": true
    },
    {
      "target_id": 4,
      "target_name": "Ratna Sari",
      "role": "supervisor",
      "is_completed": false
    }
  ]
}
```

---

#### 3. Get Engagement Questions
Mendapatkan daftar pertanyaan survey yang aktif, dikelompokkan berdasarkan pillar.

```http
GET /api/engagement/questions
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "key": "leadership",
    "title": "Kepemimpinan",
    "description": "Kemampuan memimpin dan menginspirasi tim",
    "order": 1,
    "is_active": true,
    "questions": [
      {
        "id": 1,
        "text": "Mampu memberikan arahan yang jelas kepada tim",
        "order": 1,
        "is_active": true,
        "pillar_id": 1
      },
      {
        "id": 2,
        "text": "Mampu memotivasi anggota tim untuk mencapai target",
        "order": 2,
        "is_active": true,
        "pillar_id": 1
      }
    ]
  },
  {
    "id": 2,
    "key": "teamwork",
    "title": "Kerjasama Tim",
    "description": "Kemampuan bekerja sama dengan rekan kerja",
    "order": 2,
    "is_active": true,
    "questions": [
      {
        "id": 3,
        "text": "Aktif berkontribusi dalam diskusi tim",
        "order": 1,
        "is_active": true,
        "pillar_id": 2
      },
      {
        "id": 4,
        "text": "Membantu rekan kerja yang membutuhkan",
        "order": 2,
        "is_active": true,
        "pillar_id": 2
      }
    ]
  }
]
```

---

#### 4. Submit Bulk Answers
Submit jawaban penilaian untuk satu target employee.

```http
POST /api/engagement/answers/bulk
Authorization: Bearer {token}
Content-Type: application/json

{
  "target_user_id": 2,
  "period_month": 11,
  "period_year": 2025,
  "role": "peer",
  "answers": [
    {
      "question_id": 1,
      "score": 8,
      "feedback": "Sangat baik dalam memberikan arahan"
    },
    {
      "question_id": 2,
      "score": 7,
      "feedback": "Cukup memotivasi tim"
    },
    {
      "question_id": 3,
      "score": 9,
      "feedback": null
    }
  ]
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `target_user_id` | integer | Yes | ID user yang dinilai |
| `period_month` | integer | Yes | Bulan periode (1-12) |
| `period_year` | integer | Yes | Tahun periode (min: 2024) |
| `role` | string | No | Role: self, peer, supervisor, subordinate |
| `answers` | array | Yes | Array of answers (min: 1) |
| `answers[].question_id` | integer | Yes | ID pertanyaan |
| `answers[].score` | integer | Yes | Nilai (1-10) |
| `answers[].feedback` | string | No | Feedback text (max: 1000 chars) |

**Response:**
```json
{
  "message": "Assessment submitted successfully",
  "total_answers": 3
}
```

**Validation Rules:**
- `score` harus antara 1-10
- `target_user_id` tidak boleh sama dengan user yang login
- Semua `question_id` harus valid dan exists
- Jika submit ulang, jawaban lama akan di-replace

---

### Period Management

#### 5. Get Active Period
Mendapatkan periode yang sedang aktif saat ini.

```http
GET /api/periods/active
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "name": "Semester 2 - 2024",
  "start_date": "2024-07-01",
  "end_date": "2024-12-31",
  "is_active": true,
  "month": 7,
  "year": 2024,
  "description": "Periode penilaian semester 2 tahun 2024",
  "created_at": "2024-06-15T08:00:00+07:00",
  "updated_at": "2024-06-15T08:00:00+07:00"
}
```

**Note:** Jika tidak ada periode aktif, response akan `null`.

---

#### 6. Get All Periods
Mendapatkan semua periode survey (sorted by year & month desc).

```http
GET /api/periods
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 2,
    "name": "Semester 1 - 2025",
    "start_date": "2025-01-01",
    "end_date": "2025-06-30",
    "is_active": true,
    "month": 1,
    "year": 2025,
    "description": "Periode penilaian semester 1 tahun 2025"
  },
  {
    "id": 1,
    "name": "Semester 2 - 2024",
    "start_date": "2024-07-01",
    "end_date": "2024-12-31",
    "is_active": false,
    "month": 7,
    "year": 2024,
    "description": "Periode penilaian semester 2 tahun 2024"
  }
]
```

---

#### 7. Create Period (HRD Only)
Membuat periode baru.

```http
POST /api/periods
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Semester 1 - 2025",
  "start_date": "2025-01-01",
  "end_date": "2025-06-30",
  "month": 1,
  "year": 2025,
  "description": "Periode penilaian semester 1 tahun 2025",
  "is_active": false
}
```

**Response:** `201 Created`
```json
{
  "id": 3,
  "name": "Semester 1 - 2025",
  "start_date": "2025-01-01",
  "end_date": "2025-06-30",
  "is_active": false,
  "month": 1,
  "year": 2025,
  "description": "Periode penilaian semester 1 tahun 2025"
}
```

---

#### 8. Update Period (HRD Only)
Update data periode.

```http
PUT /api/periods/{period_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Semester 1 - 2025 (Updated)",
  "start_date": "2025-01-01",
  "end_date": "2025-06-30",
  "month": 1,
  "year": 2025,
  "description": "Updated description"
}
```

**Response:** `200 OK`

---

#### 9. Delete Period (HRD Only)
Menghapus periode.

```http
DELETE /api/periods/{period_id}
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

#### 10. Activate Period (HRD Only)
Mengaktifkan periode (otomatis menonaktifkan periode lain).

```http
POST /api/periods/{period_id}/activate
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Period activated successfully"
}
```

---

### Survey Management

#### 11. Get Survey Overview
Mendapatkan overview lengkap untuk halaman survey management (periods, pillars, questions).

```http
GET /api/survey/overview
Authorization: Bearer {token}
```

**Response:**
```json
{
  "periods": [...],
  "pillars": [...],
  "questions": [...]
}
```

---

#### 12. Get Pillars
Mendapatkan daftar engagement pillars.

```http
GET /api/engagement/pillars
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "key": "leadership",
    "title": "Kepemimpinan",
    "description": "Kemampuan memimpin dan menginspirasi tim",
    "order": 1,
    "is_active": true
  },
  {
    "id": 2,
    "key": "teamwork",
    "title": "Kerjasama Tim",
    "description": "Kemampuan bekerja sama dengan rekan kerja",
    "order": 2,
    "is_active": true
  }
]
```

---

#### 13. Create Pillar (HRD Only)
Membuat pillar baru.

```http
POST /api/engagement/pillars
Authorization: Bearer {token}
Content-Type: application/json

{
  "key": "communication",
  "title": "Komunikasi",
  "description": "Kemampuan berkomunikasi efektif",
  "order": 3,
  "is_active": true
}
```

**Response:** `201 Created`

---

#### 14. Update Pillar (HRD Only)
Update data pillar.

```http
PUT /api/engagement/pillars/{pillar_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Komunikasi Efektif",
  "description": "Updated description",
  "order": 3,
  "is_active": true
}
```

**Response:** `200 OK`

---

#### 15. Delete Pillar (HRD Only)
Menghapus pillar.

```http
DELETE /api/engagement/pillars/{pillar_id}
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

#### 16. Get Questions List
Mendapatkan daftar pertanyaan survey.

```http
GET /api/engagement/questions-list
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "text": "Mampu memberikan arahan yang jelas kepada tim",
    "order": 1,
    "is_active": true,
    "pillar_id": 1,
    "pillar": {
      "id": 1,
      "title": "Kepemimpinan",
      "key": "leadership"
    }
  },
  {
    "id": 2,
    "text": "Mampu memotivasi anggota tim untuk mencapai target",
    "order": 2,
    "is_active": true,
    "pillar_id": 1,
    "pillar": {
      "id": 1,
      "title": "Kepemimpinan",
      "key": "leadership"
    }
  }
]
```

---

#### 17. Create Question (HRD Only)
Membuat pertanyaan baru.

```http
POST /api/engagement/questions-create
Authorization: Bearer {token}
Content-Type: application/json

{
  "pillar_id": 1,
  "text": "Mampu mengambil keputusan dengan cepat dan tepat",
  "order": 3,
  "is_active": true
}
```

**Response:** `201 Created`

---

#### 18. Update Question (HRD Only)
Update data pertanyaan.

```http
PUT /api/engagement/questions-edit/{question_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "pillar_id": 1,
  "text": "Updated question text",
  "order": 3,
  "is_active": true
}
```

**Response:** `200 OK`

---

#### 19. Delete Question (HRD Only)
Menghapus pertanyaan.

```http
DELETE /api/engagement/questions-delete/{question_id}
Authorization: Bearer {token}
```

**Response:** `204 No Content`

---

### Master Data

#### 20. Get Properties
Mendapatkan daftar properties (hotel/lokasi).

```http
GET /api/properties
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "LPP Garden Hotel",
    "code": "LPP",
    "address": "Jl. Garden No. 123, Jakarta"
  },
  {
    "id": 2,
    "name": "MICS Hotel",
    "code": "MICS",
    "address": "Jl. MICS No. 456, Bandung"
  }
]
```

---

#### 21. Get Departments
Mendapatkan daftar departments.

```http
GET /api/departments
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Front Office Department",
    "code": "FO"
  },
  {
    "id": 2,
    "name": "Housekeeping Department",
    "code": "HK"
  }
]
```

---

#### 22. Get Positions
Mendapatkan daftar posisi/jabatan.

```http
GET /api/positions
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Front Office Staff",
    "level": 1
  },
  {
    "id": 2,
    "title": "Front Office Supervisor",
    "level": 2
  },
  {
    "id": 3,
    "title": "Front Office Manager",
    "level": 3
  }
]
```

---

## Request/Response Examples

### Example 1: Complete Assessment Flow

```javascript
// 1. Login
const loginResponse = await fetch('https://dashboard.test/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'budi@example.com',
    date_of_birth: '1990-01-15'
  })
});
const { token } = await loginResponse.json();

// 2. Get Active Period
const periodResponse = await fetch('https://dashboard.test/api/periods/active', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const period = await periodResponse.json();

// 3. Get Assessment Targets
const targetsResponse = await fetch(
  `https://dashboard.test/api/assessments/targets?period_month=${period.month}&period_year=${period.year}`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const targets = await targetsResponse.json();

// 4. Get Questions
const questionsResponse = await fetch('https://dashboard.test/api/engagement/questions', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const questions = await questionsResponse.json();

// 5. Submit Assessment for First Target
const firstTarget = targets[0];
const answers = questions.flatMap(pillar => 
  pillar.questions.map(q => ({
    question_id: q.id,
    score: 8,
    feedback: "Good performance"
  }))
);

const submitResponse = await fetch('https://dashboard.test/api/engagement/answers/bulk', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    target_user_id: firstTarget.target_employee.id,
    period_month: period.month,
    period_year: period.year,
    role: firstTarget.role,
    answers: answers
  })
});
const result = await submitResponse.json();
console.log(result); // { message: "Assessment submitted successfully", total_answers: 20 }

// 6. Check Progress
const progressResponse = await fetch(
  `https://dashboard.test/api/assessments/progress?period_month=${period.month}&period_year=${period.year}`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const progress = await progressResponse.json();
console.log(`Progress: ${progress.completion_percentage}%`);
// Progress: 33.33%
```

---

### Example 2: TypeScript Interface

```typescript
// Types
interface Period {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  month: number;
  year: number;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  department: {
    id: number;
    name: string;
    code: string;
  };
  property?: {
    id: number;
    name: string;
    code: string;
  };
}

interface AssessmentTarget {
  target_employee: User;
  role: 'peer' | 'supervisor' | 'subordinate';
  is_completed: boolean;
  total_questions: number;
  answered_questions: number;
}

interface AssessmentProgress {
  total_targets: number;
  completed_targets: number;
  completion_percentage: number;
  targets: Array<{
    target_id: number;
    target_name: string;
    role: string;
    is_completed: boolean;
  }>;
}

interface EngagementPillar {
  id: number;
  key: string;
  title: string;
  description: string;
  order: number;
  is_active: boolean;
  questions: EngagementQuestion[];
}

interface EngagementQuestion {
  id: number;
  text: string;
  order: number;
  is_active: boolean;
  pillar_id: number;
}

interface AnswerSubmission {
  target_user_id: number;
  period_month: number;
  period_year: number;
  role?: 'peer' | 'supervisor' | 'subordinate';
  answers: Array<{
    question_id: number;
    score: number; // 1-10
    feedback?: string;
  }>;
}

// API Service
class SurveyApiService {
  private baseUrl = 'https://dashboard.test/api';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async fetch(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getActivePeriod(): Promise<Period | null> {
    return this.fetch('/periods/active');
  }

  async getAssessmentTargets(month?: number, year?: number): Promise<AssessmentTarget[]> {
    const params = new URLSearchParams();
    if (month) params.append('period_month', month.toString());
    if (year) params.append('period_year', year.toString());
    return this.fetch(`/assessments/targets?${params}`);
  }

  async getAssessmentProgress(month?: number, year?: number): Promise<AssessmentProgress> {
    const params = new URLSearchParams();
    if (month) params.append('period_month', month.toString());
    if (year) params.append('period_year', year.toString());
    return this.fetch(`/assessments/progress?${params}`);
  }

  async getQuestions(): Promise<EngagementPillar[]> {
    return this.fetch('/engagement/questions');
  }

  async submitAnswers(data: AnswerSubmission): Promise<{ message: string; total_answers: number }> {
    return this.fetch('/engagement/answers/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Usage
const api = new SurveyApiService('your-token-here');

const period = await api.getActivePeriod();
if (period) {
  const targets = await api.getAssessmentTargets(period.month, period.year);
  const progress = await api.getAssessmentProgress(period.month, period.year);
  
  console.log(`You need to assess ${targets.length} people`);
  console.log(`Progress: ${progress.completion_percentage}%`);
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "target_user_id": [
      "Target user does not exist"
    ],
    "answers.0.score": [
      "Score must be between 1 and 10"
    ]
  }
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created successfully |
| `204` | Deleted successfully (no content) |
| `400` | Bad Request |
| `401` | Unauthorized (token invalid/expired) |
| `403` | Forbidden (no permission) |
| `404` | Not Found |
| `422` | Validation Error |
| `500` | Internal Server Error |

### Common Validation Errors

**1. Invalid Score Range**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "answers.0.score": ["Score must be between 1 and 10"]
  }
}
```

**2. Cannot Rate Yourself**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "target_user_id": ["You cannot rate yourself using this endpoint"]
  }
}
```

**3. Invalid Period**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "period_month": ["Period month must be between 1 and 12"],
    "period_year": ["Period year must be at least 2024"]
  }
}
```

**4. Missing Required Fields**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "target_user_id": ["Target user is required"],
    "answers": ["Answers are required"]
  }
}
```

---

## Best Practices

### 1. Always Check Active Period First
```javascript
const period = await api.getActivePeriod();
if (!period) {
  console.error('No active period found');
  return;
}
```

### 2. Handle Token Expiration
```javascript
const response = await fetch('/api/assessments/targets', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (response.status === 401) {
  // Token expired, redirect to login
  window.location.href = '/login';
}
```

### 3. Validate Before Submit
```javascript
const validateAnswers = (answers) => {
  return answers.every(a => 
    a.score >= 1 && a.score <= 10 &&
    a.question_id > 0
  );
};

if (!validateAnswers(answers)) {
  console.error('Invalid answers');
  return;
}
```

### 4. Use Query Parameters for Filtering
```javascript
// Good
const targets = await api.getAssessmentTargets(11, 2025);

// Also good (without period)
const allTargets = await api.getAssessmentTargets();
```

### 5. Group Targets by Role
```javascript
const groupByRole = (targets) => {
  return {
    peers: targets.filter(t => t.role === 'peer'),
    supervisors: targets.filter(t => t.role === 'supervisor'),
    subordinates: targets.filter(t => t.role === 'subordinate')
  };
};

const grouped = groupByRole(targets);
console.log(`Peers: ${grouped.peers.length}`);
console.log(`Supervisors: ${grouped.supervisors.length}`);
console.log(`Subordinates: ${grouped.subordinates.length}`);
```

---

## Additional Notes

### Assessment Rules
1. **Self Assessment**: User menilai dirinya sendiri
2. **Peer Assessment**: Staff menilai 3 rekan kerja (same level, same dept)
3. **Supervisor Assessment**: Staff menilai 1 atasan (higher level)
4. **Subordinate Assessment**: 
   - SPV (level 60) menilai 2 bawahan
   - Manager (level 80) menilai 3 bawahan
   - GM (level 100) menilai 4 bawahan

### Score Scale
- **1-3**: Poor performance
- **4-6**: Average performance
- **7-8**: Good performance
- **9-10**: Excellent performance

### Data Retention
- Jawaban lama akan di-replace jika user submit ulang untuk target yang sama pada periode yang sama
- Gunakan endpoint ini untuk save draft dan final submission

---

## Support

Untuk pertanyaan atau issue terkait API ini, silakan hubungi:
- **Email**: dev@example.com
- **Documentation**: `/documentation/survey-assessment-api.md`
- **Postman Collection**: Available on request

---

**Last Updated**: November 30, 2025
**API Version**: 1.0.0
