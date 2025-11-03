import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, CheckCircle2, Clock } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';

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
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Period</span>
          </button>
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
                    <h3 className="text-xl font-bold text-gray-900">{period.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${statusBadge.bg}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusBadge.label}</span>
                    </span>
                    {period.isActive && (
                      <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
                        Currently Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{period.completed}/{period.total} completed</p>
                </div>
                <div className="flex items-center space-x-2">
                  {period.status === 'active' && (
                    <button 
                      onClick={() => alert('Send reminder')} 
                      className="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Reminder</span>
                    </button>
                  )}
                  <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600" 
                    disabled={period.isActive}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {period.status === 'active' && (
                <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" 
                    style={{ width: `${completionPercentage}%` }} 
                  />
                </div>
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
            <button 
              onClick={() => setShowModal(false)} 
              className="flex-1 px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate} 
              className="flex-1 px-6 py-3 text-white rounded-lg bg-emerald-600"
            >
              Create
            </button>
          </>
        }
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Period Name</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
            placeholder="e.g. Semester 1 - 2025" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
            <input 
              type="date" 
              value={formData.startDate} 
              onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
            <input 
              type="date" 
              value={formData.endDate} 
              onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PeriodsPage;
