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

export default { normalizeTargets, derivePeriodId };
