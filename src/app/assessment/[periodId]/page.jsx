"use client";
import React, { useMemo, useState, useEffect } from 'react';
import SurveyHeader from '../../../components/assessment/SurveyHeader';
import SurveyTabs from '../../../components/assessment/SurveyTabs';
import EmployeeList from '../../../components/assessment/EmployeeList';
import AssessmentForm from '../../../components/assessment/AssessmentForm';
import useAssessmentData from '../../../hooks/useAssessmentData';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AssessmentPeriodPage({ params }) {
  const periodId = params?.periodId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, period, targets, progress, loading, error } = useAssessmentData();
  const [activeType, setActiveType] = useState('self');
  const [activeTarget, setActiveTarget] = useState(null);

  // Sync state with URL search params
  useEffect(() => {
    const sType = searchParams.get('type');
    const sTargetId = searchParams.get('targetId');
    if (sType) setActiveType(sType);
    if (sTargetId && targets.length) {
      const found = targets.find(t => String(t.id) === String(sTargetId));
      if (found) setActiveTarget(found);
    }
  }, [searchParams, targets]);

  // Filter targets by type
  const filteredTargets = useMemo(() => targets.filter(t => t.category === activeType), [targets, activeType]);

  // When user selects a type tab, update URL
  const handleTypeChange = (type) => {
    setActiveType(type);
    setActiveTarget(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', type);
    params.delete('targetId');
    router.replace(`?${params.toString()}`);
  };

  // When user selects a target, update URL
  const handleTargetSelect = (target) => {
    setActiveTarget(target);
    const params = new URLSearchParams(searchParams.toString());
    params.set('type', activeType);
    params.set('targetId', target.id);
    router.replace(`?${params.toString()}`);
  };

  // Back to list
  const handleBack = () => {
    setActiveTarget(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('targetId');
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl p-4 mx-auto">
      <SurveyHeader period={period} currentUser={currentUser} progress={progress} />
      <SurveyTabs activeType={activeType} onChange={handleTypeChange} />
      <EmployeeList targets={filteredTargets} activeTargetId={activeTarget?.id} onSelect={handleTargetSelect} />
      {activeTarget && (
        <AssessmentForm
          periodId={periodId}
          type={activeType}
          targetId={activeTarget.id}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
