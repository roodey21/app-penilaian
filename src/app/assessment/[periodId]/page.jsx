"use client";
import React, { useMemo, useState, useEffect } from 'react';
import SurveyHeader from '../../../components/assessment/SurveyHeader';
import SurveyTabs from '../../../components/assessment/SurveyTabs';
import EmployeeList from '../../../components/assessment/EmployeeList';
import useAssessmentData from '../../../hooks/useAssessmentData';
import { getAssessmentGroupMapping } from '../../../services/assessmentService';
import { useRouter, useParams } from 'next/navigation';

export default function AssessmentPeriodPage() {
  const params = useParams();
  const periodId = params?.periodId;
  const router = useRouter();
  const { currentUser, period, targets, progress, loading, error } = useAssessmentData();
  const [activeType, setActiveType] = useState('self');
  const [groupMapping, setGroupMapping] = useState(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState(null);

  // Fetch group mapping data
  useEffect(() => {
    const fetchGroupMapping = async () => {
      try {
        setGroupLoading(true);
        const response = await getAssessmentGroupMapping();
        setGroupMapping(response?.data || response);
        setGroupError(null);
      } catch (err) {
        console.error('Error fetching group mapping:', err);
        setGroupError('Gagal memuat data grup');
      } finally {
        setGroupLoading(false);
      }
    };

    fetchGroupMapping();
  }, []);

  // Filter targets by active group (self or peer)
  const filteredTargets = useMemo(() => {
    if (!groupMapping || !Array.isArray(groupMapping)) {
      return [];
    }

    // Find the group based on activeType
    let targetGroup = null;
    if (activeType === 'self') {
      targetGroup = groupMapping.find(g => g.group_name === 'Diri Sendiri');
    } else if (activeType === 'peer') {
      targetGroup = groupMapping.find(g => g.group_name === 'Rekan Kerja');
    }

    // Return users from the selected group
    return targetGroup?.users || [];
  }, [groupMapping, activeType]);

  // When user selects a type tab, update URL
  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  // When user selects a target, navigate directly to the form page
  const handleTargetSelect = (target) => {
    router.push(`/assessment/${periodId}/${activeType}/${target.id}`);
  };

  if (loading || groupLoading) {
    return (
      <div className="max-w-5xl p-4 mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600">Memuat data penilaian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl p-4 mx-auto">
      {error && (
        <div className="alert alert-warning mb-4">
          <span>{error}</span>
        </div>
      )}
      {groupError && (
        <div className="alert alert-warning mb-4">
          <span>{groupError}</span>
        </div>
      )}
      
      <SurveyHeader period={period} currentUser={currentUser} progress={progress} />
      <SurveyTabs activeType={activeType} onChange={handleTypeChange} />
      <EmployeeList targets={filteredTargets} onSelect={handleTargetSelect} />
    </div>
  );
}
