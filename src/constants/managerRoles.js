export const MANAGER_ROLES = [
  'HR Manager'
];

export function isManagerRole(name) {
  if (!name) return false;
  return MANAGER_ROLES.includes(name);
}
