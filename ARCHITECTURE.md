# Component Architecture

## Overview
```
┌─────────────────────────────────────────────────────────┐
│                      App.jsx                            │
│  - Main routing logic                                   │
│  - Page state management                                │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
     ┌─────▼──────┐                 ┌──────▼──────┐
     │  Sidebar   │                 │    Pages    │
     └────────────┘                 └─────────────┘
           │                               │
           │                    ┌──────────┼──────────┐
           │                    │          │          │
     ┌─────▼──────┐      ┌──────▼───┐ ┌───▼────┐ ┌──▼────┐
     │ menuItems  │      │Dashboard │ │Employees│ │Reports│
     │ (constants)│      │   Home   │ │  Page   │ │ Page  │
     └────────────┘      └──────────┘ └─────────┘ └───────┘
                                │           │          │
                    ┌───────────┴───────────┴──────────┘
                    │
          ┌─────────▼─────────┐
          │ Common Components │
          │  - StatCard       │
          │  - Modal          │
          │  - SearchBar      │
          │  - PageHeader     │
          └───────────────────┘
                    │
          ┌─────────▼─────────┐
          │   Utils/Helpers   │
          │  - getLevelColor  │
          │  - calculateNPS   │
          │  - getRankBadge   │
          └───────────────────┘
```

## Component Dependencies

### App.jsx
```javascript
imports:
  - Sidebar (layout)
  - All Pages (DashboardHome, EmployeesPage, etc)

exports:
  - LPPIntegratedDashboard
```

### Sidebar.jsx
```javascript
imports:
  - menuItems (constants)
  - lucide-react icons

props:
  - currentPage: string
  - onPageChange: function
```

### DashboardHome.jsx
```javascript
imports:
  - StatCard (common)
  - PageHeader (layout)
  - lucide-react icons

props:
  - setCurrentPage: function
```

### EmployeesPage.jsx
```javascript
imports:
  - StatCard, Modal, SearchBar (common)
  - PageHeader (layout)
  - getLevelColor (utils)

features:
  - CRUD operations
  - Search functionality
  - Modal forms
```

### ParametersPage.jsx
```javascript
imports:
  - StatCard, Modal (common)
  - PageHeader (layout)

features:
  - Pillar management
  - Question management
  - Expand/collapse
```

### PeriodsPage.jsx
```javascript
imports:
  - StatCard, Modal (common)
  - PageHeader (layout)

features:
  - Period CRUD
  - Progress tracking
  - Status badges
```

### ReportsPage.jsx
```javascript
imports:
  - StatCard (common)
  - PageHeader (layout)
  - calculateNPS, getRankBadge (utils)

features:
  - Staff/Leader ranking
  - NPS calculations
  - Export functions
```

## Data Flow

```
┌──────────┐
│   User   │
│  Action  │
└────┬─────┘
     │
     ▼
┌────────────┐
│  App.jsx   │ ─── currentPage state
│            │
└────┬───────┘
     │
     ▼
┌────────────┐
│   Pages    │ ─── local state (employees, periods, etc)
│            │
└────┬───────┘
     │
     ▼
┌────────────┐
│ Components │ ─── props (data, handlers)
│            │
└────┬───────┘
     │
     ▼
┌────────────┐
│   Render   │
└────────────┘
```

## State Management

### App Level
- `currentPage` - routing state

### Page Level
- **EmployeesPage**: employees, searchTerm, modal states
- **ParametersPage**: pillars, expanded, modal states
- **PeriodsPage**: periods, modal state
- **ReportsPage**: selectedLevel (Staff/Leader)

### Component Level
- **Modal**: controlled by parent via isOpen prop
- **SearchBar**: controlled input via value & onChange
- **StatCard**: stateless, pure presentation

## File Size Comparison

### Before (Single File)
```
App.jsx: ~650 lines
```

### After (Modular)
```
App.jsx:                 ~27 lines   ✅ 96% reduction
Sidebar.jsx:             ~60 lines
PageHeader.jsx:          ~20 lines
DashboardHome.jsx:       ~60 lines
EmployeesPage.jsx:       ~195 lines
ParametersPage.jsx:      ~220 lines
PeriodsPage.jsx:         ~120 lines
ReportsPage.jsx:         ~155 lines
Common Components:       ~100 lines
Utils:                   ~30 lines
Constants:               ~10 lines
─────────────────────────────────
Total: ~997 lines (but organized!)
```

## Benefits

✅ **Maintainability**: Easy to find and update specific features
✅ **Reusability**: Common components used across pages
✅ **Testability**: Isolated components easy to test
✅ **Scalability**: Easy to add new pages/features
✅ **Readability**: Clear structure and responsibilities
✅ **Collaboration**: Team members can work on different files
