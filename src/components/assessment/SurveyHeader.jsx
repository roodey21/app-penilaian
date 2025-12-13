import React from 'react';
import Progress from '../ui/Progress';

export default function SurveyHeader({ period, currentUser, progress }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{period?.name}</h1>
          <p className="text-sm text-gray-500">{period?.month}/{period?.year}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{currentUser?.name}</p>
          <p className="text-xs text-gray-400">{currentUser?.role}</p>
        </div>
      </div>
      <div>
        <p className="text-sm mb-1">Progress Survey</p>
        <Progress value={progress?.percentage || 0} />
      </div>
    </div>
  );
}
