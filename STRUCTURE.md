# App Penilaian - Project Structure

Aplikasi 360° Best Employee Survey yang telah direfaktor menjadi struktur yang modular dan mudah dimaintenance.

## 📁 Struktur Folder

```
src/
├── components/          # Komponen-komponen reusable
│   ├── common/         # Komponen umum yang digunakan di banyak tempat
│   │   ├── Modal.jsx          # Modal dialog reusable
│   │   ├── SearchBar.jsx      # Search bar dengan icon
│   │   └── StatCard.jsx       # Card untuk menampilkan statistik
│   │
│   └── layout/         # Komponen layout aplikasi
│       ├── PageHeader.jsx     # Header halaman dengan title & actions
│       └── Sidebar.jsx        # Sidebar navigasi
│
├── pages/              # Halaman-halaman utama aplikasi
│   ├── DashboardHome.jsx      # Dashboard overview
│   ├── EmployeesPage.jsx      # Manajemen karyawan
│   ├── ParametersPage.jsx     # Manajemen parameter survey
│   ├── PeriodsPage.jsx        # Manajemen periode survey
│   └── ReportsPage.jsx        # Reports & NPS rankings
│
├── constants/          # Konstanta dan konfigurasi
│   └── menuItems.js           # Menu items untuk sidebar
│
├── utils/              # Helper functions dan utilities
│   └── helpers.js             # Helper functions (getLevelColor, calculateNPS, etc)
│
├── App.jsx             # Main app component (simplified)
├── index.js            # Entry point
└── index.css           # Global styles
```

## 🎯 Komponen Utama

### Layout Components
- **Sidebar** - Navigasi samping dengan menu items dan user profile
- **PageHeader** - Header halaman yang konsisten dengan title, subtitle, dan action buttons

### Common Components
- **StatCard** - Card untuk menampilkan statistik (dapat diklik/non-clickable)
- **Modal** - Modal dialog reusable dengan header, content, dan footer
- **SearchBar** - Search bar dengan icon search

### Pages
- **DashboardHome** - Overview dengan statistik dan quick actions
- **EmployeesPage** - CRUD employees dengan table, search, dan modal form
- **ParametersPage** - Manajemen pillars dan questions dengan expand/collapse
- **PeriodsPage** - Manajemen periode survey dengan progress tracking
- **ReportsPage** - Ranking dan analytics dengan tab staff/leader

## 🔧 Utilities

### helpers.js
- `getLevelColor(level)` - Return Tailwind classes untuk badge level
- `getStatusBadge(status)` - Return badge config untuk status period
- `getRankBadge(rank)` - Return badge config untuk ranking
- `calculateNPS(promoters, detractors, total)` - Kalkulasi NPS score

### constants/menuItems.js
- Export menu items untuk sidebar navigation

## 💡 Best Practices

### Import Organization
```javascript
// 1. React & libraries
import React, { useState } from 'react';

// 2. Icons
import { Plus, Edit2, Trash2 } from 'lucide-react';

// 3. Components
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';

// 4. Utils & constants
import { getLevelColor } from '../utils/helpers';
```

### Component Structure
```javascript
const ComponentName = () => {
  // 1. State declarations
  const [state, setState] = useState();

  // 2. Handler functions
  const handleAction = () => {};

  // 3. Render helpers
  const renderSomething = () => {};

  // 4. Return JSX
  return (
    <div>...</div>
  );
};
```

## 🚀 Development

### Running the App
```bash
npm start
```

### Adding New Components
1. **Common components** → `src/components/common/`
2. **Layout components** → `src/components/layout/`
3. **Pages** → `src/pages/`
4. **Helpers** → `src/utils/`
5. **Constants** → `src/constants/`

### Code Style
- Use functional components with hooks
- Keep components focused and single-responsibility
- Extract reusable logic to helpers
- Use descriptive variable names
- Add comments for complex logic

## 📝 Future Improvements

1. **State Management** - Implement Context API atau Redux untuk global state
2. **API Integration** - Connect dengan backend API
3. **Form Validation** - Add Formik + Yup untuk validasi form
4. **Error Handling** - Implement error boundaries
5. **Loading States** - Add skeleton loaders
6. **Testing** - Add unit tests dengan Jest & React Testing Library
7. **TypeScript** - Convert ke TypeScript untuk type safety

## 🔄 Migration dari Single File

File `App.jsx` yang sebelumnya 600+ baris kini hanya ~25 baris dengan struktur:
- ✅ Separation of concerns
- ✅ Reusable components
- ✅ Easy to maintain
- ✅ Scalable architecture
- ✅ Better code organization
