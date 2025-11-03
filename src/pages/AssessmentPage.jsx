import React, { useState } from 'react';
import { ClipboardList, Users, CheckCircle, AlertCircle, Eye, TrendingUp, Calendar } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import { getAssessmentTargets, getAssessmentCategory, calculateTotalAssessments, getAssessmentProgress } from '../utils/assessmentFlow';
import { assessmentCategories } from '../constants/organizationStructure';

const AssessmentPage = () => {
  // Sample data - should come from API/state management
  const [employees] = useState([
    { id: 1, name: 'Budi Santoso', email: 'budi@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office Department', level: 'Staff', position: 'FO Staff' },
    { id: 2, name: 'Siti Aminah', email: 'siti@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office Department', level: 'Staff', position: 'FO Staff' },
    { id: 3, name: 'Ratna Sari', email: 'ratna@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office Department', level: 'Leader', position: 'FO Supervisor' },
    { id: 4, name: 'Ahmad Rifki', email: 'ahmad@lpphotel.com', property: 'LPP Garden Hotel', department: 'Housekeeping Department', level: 'Leader', position: 'HK Supervisor' },
    { id: 5, name: 'Dewi Lestari', email: 'dewi@lpphotel.com', property: 'LPP Hotel Group', department: 'HRD Department', level: 'Managerial', position: 'HR Coordinator' },
    { id: 6, name: 'Agus Susanto', email: 'agus@lpphotel.com', property: 'LPP Hotel Group', department: 'Accounting Department', level: 'Managerial', position: 'Chief Accounting' },
    { id: 7, name: 'Eko Prasetyo', email: 'eko@lpphotel.com', property: 'LPP Hotel Group', department: '-', level: 'GM', position: 'General Manager' }
  ]);

  const [currentUser] = useState(employees[0]); // Budi Santoso - Staff
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Simulate completed assessments
  const [completedAssessments] = useState([1]); // Only self-assessment completed

  const assessmentTargets = getAssessmentTargets(currentUser, employees);
  const progress = getAssessmentProgress(currentUser, completedAssessments, employees);

  const allTargets = [
    ...assessmentTargets.self.map(emp => ({ ...emp, category: 'self' })),
    ...assessmentTargets.peer.map(emp => ({ ...emp, category: 'peer' })),
    ...assessmentTargets.subordinates.map(emp => ({ ...emp, category: 'subordinate' })),
    ...assessmentTargets.supervisor.map(emp => ({ ...emp, category: 'supervisor' })),
    ...assessmentTargets.managerial.map(emp => ({ ...emp, category: 'managerial' })),
    ...assessmentTargets.gm.map(emp => ({ ...emp, category: 'gm' }))
  ];

  const handleViewDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleStartAssessment = (employee) => {
    alert(`Mulai penilaian untuk: ${employee.name}`);
    // Navigate to assessment form
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
        subtitle={`Hai ${currentUser.name}, berikut adalah daftar penilaian yang harus Anda selesaikan`}
      />

      <div className="p-8 space-y-8">
        {/* Progress Overview */}
        <div className="p-6 border border-gray-200 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Assessment Progress</h3>
              <p className="text-sm text-gray-600">Periode: Semester 2 - 2024</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-emerald-600">{progress.percentage}%</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
          <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
            <div 
              className="h-full transition-all bg-gradient-to-r from-emerald-500 to-emerald-600" 
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-600">
              {progress.completed} dari {progress.total} penilaian selesai
            </p>
            {progress.isComplete ? (
              <span className="flex items-center px-3 py-1 space-x-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>Complete</span>
              </span>
            ) : (
              <span className="flex items-center px-3 py-1 space-x-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span>{progress.remaining} tersisa</span>
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard 
            title="Total Penilaian" 
            value={progress.total} 
            icon={ClipboardList}
          />
          <StatCard 
            title="Selesai" 
            value={progress.completed} 
            icon={CheckCircle}
            valueColor="text-emerald-600"
          />
          <StatCard 
            title="Tersisa" 
            value={progress.remaining} 
            icon={AlertCircle}
            valueColor="text-amber-600"
          />
          <StatCard 
            title="Target Deadline" 
            value="7 Hari" 
            icon={Calendar}
            valueColor="text-sky-600"
          />
        </div>

        {/* Assessment Categories Summary */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Kategori Penilaian</h3>
          <div className="grid grid-cols-3 gap-4">
            {assessmentCategories.map(category => {
              const count = getCategoryCount(category.id);
              if (count === 0) return null;
              
              return (
                <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.color}`}>
                      {category.name}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{count}</span>
                  </div>
                  <p className="text-xs text-gray-500">penilaian</p>
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
              const isCompleted = completedAssessments.includes(target.id);

              return (
                <div key={index} className="p-6 transition-colors hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 space-x-4">
                      {/* Status Icon */}
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        isCompleted ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      {/* Employee Info */}
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-3">
                          <h4 className="text-lg font-bold text-gray-900">{target.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </span>
                          {isCompleted && (
                            <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded">
                              Selesai
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{target.position}</span>
                          <span>•</span>
                          <span>{target.department}</span>
                          <span>•</span>
                          <span>{target.property}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(target)}
                        className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </button>
                      {!isCompleted && (
                        <button
                          onClick={() => handleStartAssessment(target)}
                          className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg"
                        >
                          <ClipboardList className="w-4 h-4" />
                          <span>Mulai Penilaian</span>
                        </button>
                      )}
                      {isCompleted && (
                        <button
                          onClick={() => handleStartAssessment(target)}
                          className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Lihat Hasil</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment Rules Info */}
        <div className="p-6 border-l-4 border-emerald-500 bg-emerald-50 rounded-xl">
          <h4 className="mb-2 font-bold text-gray-900">Aturan Penilaian untuk Level {currentUser.level}:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {currentUser.level === 'Staff' && (
              <>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai diri sendiri</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai rekan kerja dalam 1 department yang sama</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai atasan langsung (Supervisor department)</span>
                </li>
              </>
            )}
            {(currentUser.level === 'Leader' || currentUser.level === 'Supervisor') && (
              <>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai diri sendiri</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai supervisor lain di property yang sama</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai staff di bawahnya (dalam department yang sama)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai Managerial (HR Coordinator, Chief Accounting, Sales Marketing Manager)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-0.5 text-emerald-600" />
                  <span>Menilai General Manager</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-8 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detail Karyawan</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nama</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Posisi</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="mt-1 text-base text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Property</p>
                    <p className="mt-1 text-base text-gray-900">{selectedEmployee.property}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Level</p>
                    <p className="mt-1 text-base text-gray-900">{selectedEmployee.level}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-base text-gray-900">{selectedEmployee.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Kategori Penilaian: <span className="font-bold">{getCategoryInfo(selectedEmployee.category).name}</span>
                </p>
              </div>
            </div>

            <div className="flex mt-6 space-x-3">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-6 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Tutup
              </button>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  handleStartAssessment(selectedEmployee);
                }}
                className="flex-1 px-6 py-3 font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg"
              >
                Mulai Penilaian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentPage;
