# Assessment Flow Documentation

## Overview
Sistem penilaian 360° untuk LPP Hotel Group dengan flow yang disesuaikan berdasarkan level jabatan karyawan.

## Struktur Organisasi LPP Hotel Group

### 1. Properties
- **LPP Hotel Group** (Headquarters) - Pusat management
- **LPP Garden Hotel** (Hotel)
- **LPP Convention Hotel** (Hotel)
- **LPP Planters Guesthouse** (Guesthouse)
- **LPP Cottage Mliwis** (Cottage)
- **LPP Villa Kaliurang** (Villa)
- **LAN Creative** (Event Organizer)

### 2. Hierarki Jabatan

#### Top Management
- **General Manager** 
  - Jumlah: 1 orang untuk seluruh property
  - Scope: Mengatur semua property

#### Managerial Level
- **Sales Marketing Manager**
- **Chief Accounting**
- **HR Coordinator**
- Jumlah: Masing-masing 1 orang untuk seluruh property
- Scope: Mengatur semua property

#### Supervisor Level
- **Hotel Property**: 1 supervisor per department
  - FO Supervisor
  - HK Supervisor
  - Engineering Supervisor
  - FB Service Supervisor
  - FB Product Supervisor
  
- **Property Kecil**: 1 supervisor operasional
  - Supervisor Operasional GH Planters
  - Supervisor Operasional Cottage Mliwis
  - Supervisor Operasional Villa Kaliurang

#### Staff Level
- Multiple staff per department di setiap property

## Assessment Flow Rules

### 👨‍💼 Staff Level
Staff menilai:
1. ✅ **Diri Sendiri** (Self Assessment)
2. ✅ **Rekan Kerja** dalam 1 department yang sama (Peer)
3. ✅ **Atasan Langsung** - Supervisor department (Supervisor)

**Tidak menilai:**
- ❌ Supervisor dari department lain
- ❌ Managerial
- ❌ General Manager

**Contoh:**
- **Budi (FO Staff)** menilai:
  - Dirinya sendiri
  - Siti (FO Staff lainnya)
  - Ratna (FO Supervisor)

### 👔 Supervisor Level
Supervisor menilai:
1. ✅ **Diri Sendiri** (Self Assessment)
2. ✅ **Supervisor Lain** di property yang sama (Peer)
3. ✅ **Staff Bawahan** dalam department yang sama (Subordinates)
4. ✅ **Managerial** - HR Coord, Chief Accounting, Sales Mgr (Managerial)
5. ✅ **General Manager** (GM)

**Contoh:**
- **Ratna (FO Supervisor LGH)** menilai:
  - Dirinya sendiri
  - Ahmad (HK Supervisor LGH) - supervisor lain di property sama
  - Budi & Siti (FO Staff) - bawahannya
  - Dewi (HR Coordinator) - managerial
  - Agus (Chief Accounting) - managerial
  - Eko (General Manager)

### 🎯 Managerial Level
Managerial menilai:
1. ✅ **Diri Sendiri** (Self Assessment)
2. ✅ **Managerial Lain** (Peer)
3. ✅ **Semua Supervisor** di semua property (Subordinates)
4. ✅ **General Manager** (GM)

**Contoh:**
- **Dewi (HR Coordinator)** menilai:
  - Dirinya sendiri
  - Agus (Chief Accounting) - managerial lain
  - Semua supervisor (Ratna, Ahmad, dst)
  - Eko (General Manager)

### 👑 General Manager
GM menilai:
1. ✅ **Diri Sendiri** (Self Assessment)
2. ✅ **Semua Managerial** (Managerial)
3. ✅ **Semua Supervisor** di semua property (Subordinates)

**Contoh:**
- **Eko (GM)** menilai:
  - Dirinya sendiri
  - Dewi, Agus (Managerial)
  - Semua supervisor

## Kategori Penilaian

| Kategori | Deskripsi | Warna Badge |
|----------|-----------|-------------|
| Self | Menilai diri sendiri | Blue |
| Peer | Menilai rekan setingkat | Green |
| Subordinate | Menilai bawahan | Purple |
| Supervisor | Menilai atasan/supervisor | Amber |
| Managerial | Menilai managerial | Orange |
| GM | Menilai General Manager | Red |

## Implementasi Teknis

### File Structure
```
src/
├── constants/
│   └── organizationStructure.js    # Properties, departments, job levels
├── utils/
│   └── assessmentFlow.js           # Logic untuk menentukan siapa menilai siapa
└── pages/
    └── AssessmentPage.jsx          # UI untuk assessment
```

### Key Functions

#### 1. `getAssessmentTargets(employee, allEmployees)`
Mengembalikan daftar orang yang harus dinilai oleh employee tertentu.

**Return:**
```javascript
{
  self: [employee],
  peer: [employees...],
  subordinates: [employees...],
  supervisor: [employees...],
  managerial: [employees...],
  gm: [employees...]
}
```

#### 2. `getAssessmentCategory(assessor, target)`
Menentukan kategori penilaian berdasarkan hubungan assessor dan target.

**Return:** `'self' | 'peer' | 'subordinate' | 'supervisor' | 'managerial' | 'gm'`

#### 3. `calculateTotalAssessments(employee, allEmployees)`
Menghitung total jumlah penilaian yang harus diselesaikan.

**Return:** `Number`

#### 4. `canAssess(assessor, target, allEmployees)`
Mengecek apakah assessor boleh menilai target.

**Return:** `Boolean`

#### 5. `getAssessmentProgress(employee, completedAssessments, allEmployees)`
Menghitung progress penilaian.

**Return:**
```javascript
{
  total: Number,
  completed: Number,
  remaining: Number,
  percentage: Number,
  isComplete: Boolean
}
```

## UI Components

### AssessmentPage
Halaman utama untuk melakukan penilaian dengan fitur:
- ✅ Progress bar penilaian
- ✅ Statistik penilaian (total, selesai, tersisa)
- ✅ Kategori penilaian summary
- ✅ Daftar yang harus dinilai dengan badge kategori
- ✅ Status completed/pending per penilaian
- ✅ Aturan penilaian berdasarkan level

### Features
1. **Progress Tracking** - Progress bar dan statistik
2. **Categorized List** - Daftar ter-group berdasarkan kategori
3. **Visual Indicators** - Badge warna untuk kategori dan status
4. **Employee Detail** - Modal untuk melihat detail karyawan
5. **Assessment Rules** - Info box aturan penilaian per level

## Usage Example

```javascript
import { getAssessmentTargets } from '../utils/assessmentFlow';

// Get assessment targets for a staff
const staff = {
  id: 1,
  name: 'Budi',
  level: 'Staff',
  department: 'Front Office Department',
  property: 'LPP Garden Hotel'
};

const targets = getAssessmentTargets(staff, allEmployees);

console.log(targets);
// {
//   self: [Budi],
//   peer: [Siti],  // Staff FO lainnya
//   subordinates: [],
//   supervisor: [Ratna],  // FO Supervisor
//   managerial: [],
//   gm: []
// }
```

## Data Model

### Employee
```javascript
{
  id: Number,
  name: String,
  email: String,
  property: String,        // e.g., "LPP Garden Hotel"
  department: String,      // e.g., "Front Office Department"
  level: String,          // "Staff" | "Leader" | "Managerial" | "GM"
  position: String,       // e.g., "FO Staff", "HK Supervisor"
  supervisor: String      // Nama atasan
}
```

### Assessment
```javascript
{
  id: Number,
  periodId: Number,
  assessorId: Number,     // Yang menilai
  targetId: Number,       // Yang dinilai
  category: String,       // "self" | "peer" | "subordinate" | etc
  answers: Array,         // Jawaban per question
  status: String,         // "draft" | "completed"
  completedAt: Date
}
```

## Best Practices

1. **Always validate** - Pastikan assessor berhak menilai target sebelum save
2. **Use helpers** - Gunakan function dari `assessmentFlow.js`
3. **Visual feedback** - Berikan indikator jelas untuk status dan kategori
4. **Progress tracking** - Update progress real-time saat assessment completed
5. **Error handling** - Handle edge cases (employee tidak ada, dll)

## Future Enhancements

1. **Email Notifications** - Kirim reminder untuk assessment pending
2. **Deadline Management** - Sistem deadline per periode
3. **Assessment History** - Lihat hasil assessment periode sebelumnya
4. **Anonymous Mode** - Option untuk assessment anonymous
5. **Bulk Actions** - Complete multiple assessments at once
6. **Export Results** - Export daftar assessment ke Excel/PDF
7. **Real-time Sync** - WebSocket untuk update progress real-time

## Testing Scenarios

### Test Case 1: Staff Assessment Flow
```
Given: Budi adalah Staff FO di LGH
When: Budi membuka halaman assessment
Then: Budi melihat:
  - 1 self assessment (Budi)
  - 1 peer assessment (Siti - FO Staff lainnya)
  - 1 supervisor assessment (Ratna - FO Supervisor)
  Total: 3 assessments
```

### Test Case 2: Supervisor Assessment Flow
```
Given: Ratna adalah FO Supervisor di LGH
When: Ratna membuka halaman assessment
Then: Ratna melihat:
  - 1 self assessment (Ratna)
  - 1+ peer assessment (Supervisor lain di LGH)
  - 2+ subordinate assessment (Staff FO)
  - 3 managerial assessment (HR, Accounting, Sales)
  - 1 GM assessment (Eko)
```

### Test Case 3: Cannot Assess Validation
```
Given: Budi adalah Staff FO
When: Budi mencoba menilai Ahmad (HK Supervisor)
Then: System menolak karena Staff tidak boleh menilai Supervisor dept lain
```

---

**Last Updated:** October 30, 2025
**Version:** 1.0
**Author:** Development Team
