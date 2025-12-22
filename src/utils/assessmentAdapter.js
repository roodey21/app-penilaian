// Normalization helper for assessment targets
// Ensures consistent shape for UI consumption regardless of backend variations.

export function normalizeTargets(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const emp = item?.target_employee || {};
    const departmentObj = emp?.department || emp?.department_id || null;
    const departmentName = typeof departmentObj === 'object' ? departmentObj?.name : emp?.department_name || null;
    return {
      raw: item,
      id: emp.id ?? null,
      name: emp.name ?? '-',
      email: emp.email ?? '-',
      date_of_birth: emp.date_of_birth ?? null,
      department: departmentName ?? '-',
      department_code: departmentObj?.code || emp?.department_code || null,
      property: emp.property?.name || emp.property_name || '-',
      level: emp.level || emp.employee_level || '-',
      position: emp.position || emp.job_title || '-',
      category: item.role || item.assessment_role || 'peer',
      is_completed: !!item.is_completed,
      total_questions: item.total_questions ?? 0,
      answered_questions: item.answered_questions ?? 0,
    };
  });
}

export function derivePeriodId(period) {
  if (!period) return 'current';
  return period.id || period.period_id || 'current';
}

// Map /assessments/group-mapping response to UI groups format
export function mapGroupMappingToUI(apiResponse) {
  if (!apiResponse?.data || !Array.isArray(apiResponse.data)) return [];
  
  const groupKeyMap = {
    'Self': 'self',
    'Penilaian Diri Sendiri': 'self',
    'Peer': 'peer',
    'Penilaian Rekan Kerja': 'peer',
    'Rekan Kerja': 'peer',
    'Supervisor & Manajerial': 'supervisor',
    'Supervisor': 'supervisor',
    'Manajerial': 'supervisor',
    'Atasan': 'atasan',
    'Penilaian Atasan': 'atasan',
  };

  return apiResponse.data.map((group) => {
    const groupName = group.group_name || 'Unknown';
    const groupKey = groupKeyMap[groupName] || groupName.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: groupKey,
      label: groupName,
      description: getGroupDescription(groupKey),
      targets: (group.users || []).map((user) => ({
        id: user.id,
        name: user.name || '-',
        role: user.level || user.position || user.department || '-',
        email: user.email,
        department: user.department,
        level: user.level,
        isCompleted: user.is_completed || false,
        totalQuestions: user.total_questions || 0,
        answeredQuestions: user.answered_questions || 0,
      })),
    };
  });
}

function getGroupDescription(groupKey) {
  const descriptions = {
    self: 'Evaluasi performa Anda sendiri',
    peer: 'Nilai rekan kerja dalam department Anda',
    supervisor: 'Nilai supervisor dan manajer langsung',
    atasan: 'Nilai atasan lebih tinggi',
  };
  return descriptions[groupKey] || 'Berikan penilaian';
}

// Map /assessments/questions response to UI sections format
export function mapQuestionsToSections(apiResponse) {
  if (!Array.isArray(apiResponse)) return [];
  
  return apiResponse
    .filter((pillar) => pillar.is_active)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((pillar) => ({
      id: pillar.key || pillar.title?.toLowerCase().replace(/\s+/g, '-') || `section-${pillar.id}`,
      title: pillar.title || pillar.key || 'Section',
      description: pillar.description || '',
      questions: (pillar.questions || [])
        .filter((q) => q.is_active)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((q) => ({
          id: q.id,
          text: q.text || '',
          helper: q.helper || '',
        })),
    }));
}

export default { normalizeTargets, derivePeriodId, mapGroupMappingToUI, mapQuestionsToSections };
