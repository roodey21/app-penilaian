'use client';

import React, { useState, useEffect } from 'react';
import { Users, Calendar, ClipboardCheck, TrendingUp, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatCard from '../components/common/StatCard';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getActivePeriod } from '../services/assessmentService';

const DashboardHome = ({ setCurrentPage }) => {
  const router = useRouter();
  const [activePeriod, setActivePeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stats = [
    { title: 'Total Karyawan', value: '247', icon: Users, page: 'employees' },
    { title: 'Survey Aktif', value: activePeriod?.name || 'Semester 2 2024', icon: Calendar, page: 'periods' },
    { title: 'Completion Rate', value: '73%', icon: ClipboardCheck, page: 'periods' },
    { title: 'Avg NPS Score', value: '52%', icon: TrendingUp, page: 'reports' }
  ];

  useEffect(() => {
    const fetchActivePeriod = async () => {
      try {
        setLoading(true);
        const response = await getActivePeriod();
        setActivePeriod(response?.data || response);
        setError(null);
      } catch (err) {
        console.error('Error fetching active period:', err);
        setError('Gagal memuat periode aktif');
      } finally {
        setLoading(false);
      }
    };

    fetchActivePeriod();
  }, []);

  const handleMulaiPenilaian = () => {
    if (activePeriod?.id) {
      router.push(`/assessment/${activePeriod.id}`);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Dashboard Overview"
        subtitle="Monitoring survei 360° seluruh property"
      />
      
      <div className="p-8 space-y-8">
        {/* Active Period Card */}
        {activePeriod && !error && (
          <Card className="border-l-4 border-emerald-600 bg-gradient-to-r from-emerald-50 to-transparent">
            <div className="flex items-start justify-between p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-emerald-900">Periode Penilaian Aktif</h3>
                </div>
                <p className="text-emerald-800 font-semibold mb-1">{activePeriod.name}</p>
                <p className="text-sm text-emerald-700 mb-3">
                  {activePeriod.start_date && activePeriod.end_date 
                    ? `${new Date(activePeriod.start_date).toLocaleDateString('id-ID')} - ${new Date(activePeriod.end_date).toLocaleDateString('id-ID')}`
                    : activePeriod.description || 'Periode penilaian sedang berlangsung'}
                </p>
                {activePeriod.description && (
                  <p className="text-xs text-emerald-600">{activePeriod.description}</p>
                )}
              </div>
              <Badge variant="success" className="mb-auto">Aktif</Badge>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <Button 
                variant="primary"
                onClick={handleMulaiPenilaian}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Mulai Penilaian
              </Button>
            </div>
          </Card>
        )}

        {error && (
          <div className="alert alert-warning">
            <span>{error}</span>
          </div>
        )}

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
