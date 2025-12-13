export const dummyPeriod = { id: 1, name: '360° Best Employee Survey', month: 11, year: 2025 };
export const dummyCurrentUser = { id: 100, name: 'Rudi Santoso', role: 'Front Office Staff' };

export const dummyTargets = [
  { id: 6, name: 'Budi Santoso', title: 'Front Office Staff', type: 'peer', is_completed: false },
  { id: 7, name: 'Siti Ayu', title: 'Front Office Staff', type: 'peer', is_completed: false },
  { id: 8, name: 'Andi Pratama', title: 'Supervisor', type: 'manager', is_completed: false },
  { id: 100, name: 'Rudi Santoso', title: 'Front Office Staff', type: 'self', is_completed: false },
];

export const dummyCategories = [
  { key: 'leadership', label: 'Leadership & Initiative' },
  { key: 'teamwork', label: 'Teamwork & Collaboration' },
  { key: 'service', label: 'Service Excellence' },
  { key: 'professional', label: 'Professional Development' },
];

export const dummyQuestions = {
  leadership: [
    { id: 'q1', text: 'Mampu mengambil inisiatif tanpa diminta' },
    { id: 'q2', text: 'Mampu memberi arahan yang jelas kepada tim' },
    { id: 'q3', text: 'Proaktif dalam menyelesaikan masalah' },
  ],
  teamwork: [
    { id: 'q4', text: 'Berkomunikasi dengan jelas dan efektif' },
    { id: 'q5', text: 'Mendukung rekan dalam menyelesaikan tugas' },
  ],
  service: [
    { id: 'q6', text: 'Memberikan pelayanan ramah dan profesional' },
    { id: 'q7', text: 'Menangani komplain dengan solusi tepat' },
  ],
  professional: [
    { id: 'q8', text: 'Meningkatkan kemampuan melalui pelatihan/Belajar mandiri' },
  ],
};

export const scoreScale = [1,2,3,4,5,6,7,8,9,10];
