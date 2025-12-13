import React from 'react';
import Button from '../ui/Button';

const types = [
  { key: 'self', label: 'Penilaian Diri Sendiri' },
  { key: 'peer', label: 'Penilaian Rekan Kerja' },
  { key: 'manager', label: 'Penilaian Atasan' },
];

export default function SurveyTabs({ activeType, onChange }) {
  return (
    <div className="flex gap-2 mt-4">
      {types.map(t => (
        <Button
          key={t.key}
          onClick={() => onChange(t.key)}
          variant={activeType === t.key ? 'primary' : 'outline'}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
