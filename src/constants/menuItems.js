import { BarChart3, Users, ClipboardCheck, Calendar, TrendingUp, ClipboardList } from 'lucide-react';

export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'assessment', label: 'My Assessment', icon: ClipboardList },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'parameters', label: 'Parameters', icon: ClipboardCheck },
  { id: 'periods', label: 'Survey Periods', icon: Calendar },
  { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp },
];
