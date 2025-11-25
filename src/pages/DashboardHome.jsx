import React from 'react';
import { Users, Calendar, ClipboardCheck, TrendingUp } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import PageHeader from '../components/layout/PageHeader';

const DashboardHome = ({ setCurrentPage }) => {
  const stats = [
    { title: 'Total Karyawan', value: '247', icon: Users, page: 'employees' },
    { title: 'Survey Aktif', value: 'Semester 2 2024', icon: Calendar, page: 'periods' },
    { title: 'Completion Rate', value: '73%', icon: ClipboardCheck, page: 'periods' },
    { title: 'Avg NPS Score', value: '52%', icon: TrendingUp, page: 'reports' }
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard Overview"
        subtitle="Monitoring survei 360° seluruh property"
      />
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => setCurrentPage(stat.page)}
            />
          ))}
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-4">
              {[{ label: 'Add Employee', icon: Users, page: 'employees' }, { label: 'Manage Parameters', icon: ClipboardCheck, page: 'parameters' }, { label: 'View Reports', icon: TrendingUp, page: 'reports' }, { label: 'Survey Periods', icon: Calendar, page: 'periods' }].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button key={i} onClick={() => setCurrentPage(action.page)} className="btn btn-outline btn-block">
                    <div className="flex flex-col items-center">
                      <Icon className="w-6 h-6 mb-2 text-base-content/60" />
                      <span className="text-sm">{action.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
