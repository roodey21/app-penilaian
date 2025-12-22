import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Progress from '../ui/Progress';
import Button from '../ui/Button';

export default function EmployeeList({ targets, activeTargetId, onSelect, periodId, type }) {
  return (
    <div className="space-y-3 mt-4">
      {targets.map(t => {
        const progressPercent = t.total_questions > 0 
          ? Math.round((t.answered_questions / t.total_questions) * 100)
          : 0;
        
        return (
          <Card
            key={t.id}
            className="p-4"
          >
            <div className="flex items-start justify-between gap-4">
              {/* User Info & Progress */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.department || t.title}</p>
                  </div>
                  {t.is_completed ? (
                    <Badge variant="success">Selesai</Badge>
                  ) : (
                    <Badge variant="secondary">Berlangsung</Badge>
                  )}
                </div>
                
                {/* Progress Indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-emerald-600">
                      {t.answered_questions}/{t.total_questions}
                    </span>
                  </div>
                  <Progress value={progressPercent} />
                </div>
              </div>

              {/* Mulai Penilaian Button */}
              <div className="flex items-center">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelect(t)}
                  className="whitespace-nowrap"
                >
                  Mulai Penilaian
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
