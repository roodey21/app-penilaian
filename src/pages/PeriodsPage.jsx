import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, CheckCircle2, Clock } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Progress from '../components/ui/Progress';
import Input from '../components/ui/Input';

const PeriodsPage = () => {
  const [periods, setPeriods] = useState([
    { id: 1, name: 'Semester 1 - 2024', status: 'completed', isActive: false, completed: 247, total: 247, startDate: '2024-01-01', endDate: '2024-01-31' },
    { id: 2, name: 'Semester 2 - 2024', status: 'active', isActive: true, completed: 181, total: 247, startDate: '2024-07-01', endDate: '2024-12-31' },
    { id: 3, name: 'Semester 1 - 2025', status: 'upcoming', isActive: false, completed: 0, total: 247, startDate: '2025-01-01', endDate: '2025-01-31' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '' });

  const handleCreate = () => {
    setPeriods([...periods, { 
      id: periods.length + 1, 
      ...formData, 
      status: 'upcoming', 
      isActive: false, 
      completed: 0, 
      total: 247 
    }]);
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return { bg: 'bg-emerald-100 text-emerald-700', label: 'Active', icon: CheckCircle2 };
      case 'completed': return { bg: 'bg-gray-100 text-gray-700', label: 'Completed', icon: CheckCircle2 };
      default: return { bg: 'bg-sky-100 text-sky-700', label: 'Upcoming', icon: Clock };
    }
  };

  const activePeriod = periods.find(p => p.isActive);
  const completionRate = activePeriod 
    ? Math.round((activePeriod.completed / activePeriod.total) * 100) 
    : 0;

  return (
    <div>
      <PageHeader
        title="Survey Period Management"
        subtitle="Kelola periode survey dan monitor progress"
        actions={
          <Button onClick={() => setShowModal(true)} variant="primary">
            <Plus className="w-4 h-4" />
            <span>Create Period</span>
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <StatCard title="Total Periods" value={periods.length} />
          <StatCard 
            title="Active Period" 
            value={periods.filter(p => p.isActive).length}
            valueColor="text-emerald-600"
          />
          <StatCard 
            title="Completion Rate" 
            value={`${completionRate}%`}
            valueColor="text-sky-600"
          />
        </div>

          {periods.map((period) => {
          const statusBadge = getStatusBadge(period.status);
          const StatusIcon = statusBadge.icon;
          const completionPercentage = Math.round((period.completed / period.total) * 100);

          return (
            <div key={period.id} className="p-6 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2 space-x-3">
                    <h3 className="text-xl font-bold">{period.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="flex items-center gap-2">
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </Badge>
                      {period.isActive && (
                        <Badge variant="primary">Currently Active</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{period.completed}/{period.total} completed</p>
                </div>
                <div className="flex items-center space-x-2">
                  {period.status === 'active' && (
                    <Button variant="ghost" onClick={() => alert('Send reminder')}>
                      <Mail className="w-4 h-4 mr-2" /> Send Reminder
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              {period.status === 'active' && (
                <Progress value={completionPercentage} />
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Period"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <div>
          <label className="block mb-2 text-sm">Period Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Semester 1 - 2025"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm">Start Date</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">End Date</label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PeriodsPage;
