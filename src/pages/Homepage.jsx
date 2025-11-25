import React from 'react';
import { Users, Calendar, ClipboardCheck, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Stat = ({ title, value, icon: Icon }) => (
  <Card className="p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-emerald-500">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </Card>
);

export default function Homepage({ setCurrentPage }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Monitoring survei 360° seluruh property</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <Stat title="Total Karyawan" value="247" icon={Users} />
          <Stat title="Survey Aktif" value="Semester 2 2024" icon={Calendar} />
          <Stat title="Completion Rate" value="73%" icon={ClipboardCheck} />
          <Stat title="Avg NPS Score" value="52%" icon={TrendingUp} />
        </div>

        <Card className="shadow-sm">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('employees')}>Add Employee</Button>
              <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('parameters')}>Manage Parameters</Button>
              <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('reports')}>View Reports</Button>
              <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('periods')}>Survey Periods</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
