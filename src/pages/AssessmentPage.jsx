import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Users, CheckCircle, AlertCircle, Eye, TrendingUp, Calendar } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
// Progress removed per new API design
import { derivePeriodId } from '../utils/assessmentAdapter';
import { useRouter } from 'next/navigation';
import { assessmentCategories } from '../constants/organizationStructure';
import Modal from '../components/common/Modal';
import { getActivePeriod, getAssessmentGroupMapping } from '../services/assessmentService';

const AssessmentPage = () => {
  // Sample data - should come from API/state management
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [activePeriod, setActivePeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const allTargets = useMemo(() => {
    // Flatten groups to targets for list rendering compatibility
    return groups.flatMap(g => (g.users || []).map(u => ({
      ...u,
      category: (g.group_name || '').toLowerCase(),
      group_id: g.group_id,
      group_name: g.group_name
    })));
  }, [groups]);

  const currentUser = null; // User rules section kept but data deferred; can wire later

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [periodRes, groupsRes] = await Promise.all([
        getActivePeriod(),
        getAssessmentGroupMapping(),
      ]);
      setActivePeriod(periodRes?.data || periodRes || null);
      setGroups(groupsRes?.data || []);
    } catch (e) {
      setError(e?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleStartAssessment = (employee) => {
    const periodId = derivePeriodId(activePeriod);
    const raw = employee?.group_name || employee?.category || '';
    const type = String(raw).toLowerCase();
    // Route uses query params in current implementation
    router.push(`/assessment/${periodId}?type=${type}&targetId=${employee.id}`);
  };

  const getCategoryInfo = (categoryId) => {
    return assessmentCategories.find(cat => cat.id === categoryId) || assessmentCategories[1];
  };

  const getCategoryCount = (categoryId) => {
    return allTargets.filter(t => t.category === categoryId).length;
  };

  return (
    <div>
      <PageHeader
        title="My Assessment"
        subtitle={`Hai ${currentUser?.name || 'User'}, berikut adalah daftar penilaian yang harus Anda selesaikan`}
      />

      <div className="p-8 space-y-8">
        {loading && (
          <div className="p-4 mb-4 text-sm bg-gray-100 rounded animate-pulse">Memuat data penilaian...</div>
        )}
        {error && !loading && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded">
            Gagal memuat data: {error}
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={fetchData}>Coba Lagi</Button>
            </div>
          </div>
        )}
        {/* Period Info */}
        <Card className="shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold">Informasi Periode</h3>
                <p className="text-sm text-base-content/60">Periode: {activePeriod?.name || 'Aktif'}</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-sm">{activePeriod?.status || 'Berjalan'}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard 
            title="Total Group" 
            value={groups.length} 
            icon={ClipboardList}
          />
          <StatCard 
            title="Total Target" 
            value={allTargets.length} 
            icon={Users}
            valueColor="text-sky-600"
          />
          <StatCard 
            title="Periode" 
            value={activePeriod?.name || '-'} 
            icon={Calendar}
            valueColor="text-emerald-600"
          />
          <StatCard 
            title="Status" 
            value={activePeriod?.status || 'Berjalan'} 
            icon={TrendingUp}
            valueColor="text-amber-600"
          />
        </div>

        {/* Assessment Categories Summary */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Group Penilaian</h3>
          <div className="grid grid-cols-3 gap-4">
            {groups.map((group, idx) => {
              const name = group.group_name || '-';
              const typeKey = String(name).toLowerCase();
              const catInfo = assessmentCategories.find(cat => cat.id === typeKey);
              const colorClass = catInfo?.color || '';
              const count = (group.users || []).length;
              return (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                      {name}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{count}</span>
                  </div>
                  <p className="text-xs text-gray-500">target</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment List */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Daftar yang Harus Dinilai</h3>
            <p className="mt-1 text-sm text-gray-500">
              Klik "Mulai Penilaian" untuk mengisi form penilaian
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {allTargets.map((target, index) => {
              const categoryInfo = getCategoryInfo(target.category);
              const isCompleted = false; // progress removed per request

              return (
                <div key={index} className="p-4 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 space-x-4">
                      {/* Status Icon */}
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-base-content/60" />
                        )}
                      </div>

                      {/* Employee Info */}
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-3">
                          <h4 className="text-lg font-bold">{target.name}</h4>
                          <Badge className={categoryInfo.color ? categoryInfo.color : ''}>{categoryInfo.name}</Badge>
                          {isCompleted && (
                            <Badge variant="success">Selesai</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-base-content/60">
                          <span>{target.role || '-'}</span>
                          <span>•</span>
                          <span>{target.department || '-'}</span>
                          <span>•</span>
                          <span>{target.property || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(target)} className="hidden">
                        <Eye className="w-4 h-4 mr-2" /> Detail
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleStartAssessment(target)}>
                        <ClipboardList className="w-4 h-4 mr-2" /> Mulai Penilaian
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment Rules Info */}
        <div className="p-6 border-l-4 border-emerald-500 bg-emerald-50 rounded-xl">
          <h4 className="mb-2 font-bold text-gray-900">Aturan Penilaian</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
              <span>Isi penilaian untuk setiap target pada group terkait</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
              <span>Data pertanyaan akan ditambahkan kemudian</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal && !!selectedEmployee}
        onClose={() => setShowDetailModal(false)}
        title={selectedEmployee ? 'Detail Karyawan' : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDetailModal(false)}>Tutup</Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowDetailModal(false);
                handleStartAssessment(selectedEmployee);
              }}
            >
              Mulai Penilaian
            </Button>
          </>
        }
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/60">Nama</p>
                <p className="mt-1 font-semibold">{selectedEmployee.name}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Posisi</p>
                <p className="mt-1 font-semibold">{selectedEmployee.position}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Department</p>
                <p className="mt-1">{selectedEmployee.department}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Property</p>
                <p className="mt-1">{selectedEmployee.property}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Level</p>
                <p className="mt-1">{selectedEmployee.level}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Email</p>
                <p className="mt-1">{selectedEmployee.email}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm">
                Kategori Penilaian: <strong>{getCategoryInfo(selectedEmployee.category).name}</strong>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssessmentPage;
