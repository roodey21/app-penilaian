/**
 * Get list of people that a specific employee should assess
 * @param {Object} employee - The employee who will do the assessment
 * @param {Array} allEmployees - All employees in the system
 * @returns {Object} - Object containing categorized assessment targets
 */
export const getAssessmentTargets = (employee, allEmployees) => {
  const targets = {
    self: [],
    peer: [],
    subordinates: [],
    supervisor: [],
    managerial: [],
    gm: []
  };

  if (!employee || !allEmployees) return targets;

  const level = employee.level.toLowerCase();

  // Self assessment (always included)
  targets.self.push(employee);

  if (level === 'staff') {
    // Staff menilai:
    // 1. Rekan kerja dalam 1 department yang sama
    targets.peer = allEmployees.filter(emp => 
      emp.id !== employee.id &&
      emp.level === 'Staff' &&
      emp.department === employee.department &&
      emp.property === employee.property
    );

    // 2. Atasan langsung (Supervisor di department yang sama)
    targets.supervisor = allEmployees.filter(emp =>
      (emp.level === 'Leader' || emp.level === 'Supervisor') &&
      emp.department === employee.department &&
      emp.property === employee.property
    );
  } 
  else if (level === 'leader' || level === 'supervisor') {
    // Supervisor menilai:
    // 1. Supervisor lain di property yang sama (Peer)
    targets.peer = allEmployees.filter(emp =>
      emp.id !== employee.id &&
      (emp.level === 'Leader' || emp.level === 'Supervisor') &&
      emp.property === employee.property
    );

    // 2. Staff di bawahnya (dalam department yang sama)
    targets.subordinates = allEmployees.filter(emp =>
      emp.level === 'Staff' &&
      emp.department === employee.department &&
      emp.property === employee.property
    );

    // 3. Managerial (HR Coordinator, Chief Accounting, Sales Marketing Manager)
    targets.managerial = allEmployees.filter(emp =>
      emp.level === 'Managerial' ||
      ['HR Coordinator', 'Chief Accounting', 'Sales Marketing Manager'].includes(emp.position)
    );

    // 4. General Manager
    targets.gm = allEmployees.filter(emp =>
      emp.level === 'GM'
    );
  }
  else if (level === 'managerial') {
    // Managerial menilai:
    // 1. Managerial lain
    targets.peer = allEmployees.filter(emp =>
      emp.id !== employee.id &&
      emp.level === 'Managerial'
    );

    // 2. Semua Supervisor di semua property
    targets.subordinates = allEmployees.filter(emp =>
      emp.level === 'Leader' || emp.level === 'Supervisor'
    );

    // 3. General Manager
    targets.gm = allEmployees.filter(emp =>
      emp.level === 'GM'
    );
  }
  else if (level === 'gm') {
    // GM menilai:
    // 1. Managerial
    targets.managerial = allEmployees.filter(emp =>
      emp.level === 'Managerial'
    );

    // 2. Semua Supervisor
    targets.subordinates = allEmployees.filter(emp =>
      emp.level === 'Leader' || emp.level === 'Supervisor'
    );
  }

  return targets;
};

/**
 * Get assessment category for a target employee
 * @param {Object} assessor - The employee doing the assessment
 * @param {Object} target - The employee being assessed
 * @returns {String} - Category ID
 */
export const getAssessmentCategory = (assessor, target) => {
  if (assessor.id === target.id) return 'self';

  const assessorLevel = assessor.level.toLowerCase();
  const targetLevel = target.level.toLowerCase();

  if (assessorLevel === 'staff') {
    if (targetLevel === 'staff') return 'peer';
    if (targetLevel === 'leader' || targetLevel === 'supervisor') return 'supervisor';
  }

  if (assessorLevel === 'leader' || assessorLevel === 'supervisor') {
    if (targetLevel === 'staff') return 'subordinate';
    if (targetLevel === 'leader' || targetLevel === 'supervisor') return 'peer';
    if (targetLevel === 'managerial') return 'managerial';
    if (targetLevel === 'gm') return 'gm';
  }

  if (assessorLevel === 'managerial') {
    if (targetLevel === 'managerial') return 'peer';
    if (targetLevel === 'leader' || targetLevel === 'supervisor') return 'subordinate';
    if (targetLevel === 'gm') return 'gm';
  }

  if (assessorLevel === 'gm') {
    if (targetLevel === 'managerial') return 'managerial';
    if (targetLevel === 'leader' || targetLevel === 'supervisor') return 'subordinate';
  }

  return 'other';
};

/**
 * Calculate total assessments an employee needs to complete
 * @param {Object} employee - The employee
 * @param {Array} allEmployees - All employees
 * @returns {Number} - Total number of assessments
 */
export const calculateTotalAssessments = (employee, allEmployees) => {
  const targets = getAssessmentTargets(employee, allEmployees);
  return 1 + // self
         targets.peer.length +
         targets.subordinates.length +
         targets.supervisor.length +
         targets.managerial.length +
         targets.gm.length;
};

/**
 * Check if an employee can assess another employee
 * @param {Object} assessor - The employee doing the assessment
 * @param {Object} target - The employee being assessed
 * @param {Array} allEmployees - All employees
 * @returns {Boolean}
 */
export const canAssess = (assessor, target, allEmployees) => {
  const targets = getAssessmentTargets(assessor, allEmployees);
  const allTargets = [
    ...targets.self,
    ...targets.peer,
    ...targets.subordinates,
    ...targets.supervisor,
    ...targets.managerial,
    ...targets.gm
  ];
  
  return allTargets.some(emp => emp.id === target.id);
};

/**
 * Get assessment progress for an employee
 * @param {Object} employee - The employee
 * @param {Array} completedAssessments - Array of completed assessment IDs
 * @param {Array} allEmployees - All employees
 * @returns {Object} - Progress information
 */
export const getAssessmentProgress = (employee, completedAssessments, allEmployees) => {
  const total = calculateTotalAssessments(employee, allEmployees);
  const completed = completedAssessments.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    remaining: total - completed,
    percentage,
    isComplete: completed >= total
  };
};
