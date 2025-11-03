// Properties data
export const properties = [
  { id: 1, code: 'LPP-HQ', name: 'LPP Hotel Group', type: 'headquarters' },
  { id: 2, code: 'LGH', name: 'LPP Garden Hotel', type: 'hotel' },
  { id: 3, code: 'LCH', name: 'LPP Convention Hotel', type: 'hotel' },
  { id: 4, code: 'LPG', name: 'LPP Planters Guesthouse', type: 'guesthouse' },
  { id: 5, code: 'LCM', name: 'LPP Cottage Mliwis', type: 'cottage' },
  { id: 6, code: 'LVK', name: 'LPP Villa Kaliurang', type: 'villa' },
  { id: 7, code: 'LAN', name: 'LAN Creative (EO)', type: 'eo' }
];

// Departments per property type
export const departments = {
  hotel: [
    'Front Office Department',
    'Housekeeping Department',
    'Engineering Department',
    'FB Service Department',
    'FB Product Department'
  ],
  headquarters: [
    'Sales Marketing Department',
    'Accounting Department',
    'HRD Department'
  ],
  guesthouse: ['Operasional GH'],
  cottage: ['Operasional Mliwis'],
  villa: ['Operasional Villa'],
  eo: ['Operasional Lan Creative']
};

// Job levels
export const jobLevels = {
  GM: {
    id: 'gm',
    name: 'General Manager',
    grouping: 'Top Management',
    scope: 'all', // applies to all properties
    remark: '1 orang'
  },
  MANAGERIAL: {
    id: 'managerial',
    name: 'Managerial',
    grouping: 'Managerial',
    scope: 'all', // applies to all properties
    positions: [
      'Sales Marketing Manager',
      'Chief Accounting',
      'HR Coordinator'
    ],
    remark: '1 orang per position'
  },
  SUPERVISOR: {
    id: 'supervisor',
    name: 'Supervisor',
    grouping: 'Supervisor Level',
    scope: 'property', // per property
    remark: '1 orang per department per property'
  },
  STAFF: {
    id: 'staff',
    name: 'Staff',
    grouping: 'Staff Level',
    scope: 'department', // per department
    remark: 'Multiple per department'
  }
};

// Assessment flow rules
export const assessmentRules = {
  supervisor: {
    canAssess: ['self', 'peer_supervisors', 'subordinates', 'managerial', 'gm'],
    description: 'Supervisor menilai: Diri sendiri, Supervisor lain (property sama), Staff bawahan, Managerial, GM'
  },
  staff: {
    canAssess: ['self', 'peer_staff', 'direct_supervisor'],
    description: 'Staff menilai: Diri sendiri, Rekan kerja (1 department), Atasan langsung'
  },
  managerial: {
    canAssess: ['self', 'peer_managerial', 'supervisors', 'gm'],
    description: 'Managerial menilai: Diri sendiri, Managerial lain, Supervisor, GM'
  },
  gm: {
    canAssess: ['self', 'managerial', 'supervisors'],
    description: 'GM menilai: Diri sendiri, Managerial, Supervisor'
  }
};

// Assessment categories based on who is being assessed
export const assessmentCategories = [
  { id: 'self', name: 'Menilai Diri Sendiri', color: 'bg-blue-100 text-blue-700' },
  { id: 'peer', name: 'Menilai Rekan Kerja', color: 'bg-green-100 text-green-700' },
  { id: 'subordinate', name: 'Menilai Bawahan', color: 'bg-purple-100 text-purple-700' },
  { id: 'supervisor', name: 'Menilai Atasan/Supervisor', color: 'bg-amber-100 text-amber-700' },
  { id: 'managerial', name: 'Menilai Managerial', color: 'bg-orange-100 text-orange-700' },
  { id: 'gm', name: 'Menilai General Manager', color: 'bg-red-100 text-red-700' }
];
