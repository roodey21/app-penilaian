import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function EmployeeList({ targets, activeTargetId, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      {targets.map(t => (
        <Card
          key={t.id}
          className={`p-3 cursor-pointer ${activeTargetId === t.id ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => onSelect(t)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-gray-500">{t.title}</p>
            </div>
            {t.is_completed ? (
              <Badge color="green">Selesai</Badge>
            ) : (
              <Badge>Sisa</Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
