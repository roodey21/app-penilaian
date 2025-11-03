import React, { useState } from 'react';
import { FileText, Download, Users, Award, Eye } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import { calculateNPS, getRankBadge } from '../utils/helpers';

const ReportsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState('Staff');

  const staffRankings = [
    { id: 1, rank: 1, name: 'Budi Santoso', property: 'LPP Garden Hotel', department: 'Front Office', promoters: 12, passives: 2, detractors: 1, total: 15 },
    { id: 2, rank: 2, name: 'Siti Aminah', property: 'LPP Garden Hotel', department: 'Front Office', promoters: 11, passives: 3, detractors: 1, total: 15 },
    { id: 3, rank: 3, name: 'Ahmad Rizki', property: 'LPP Garden Hotel', department: 'Housekeeping', promoters: 10, passives: 3, detractors: 1, total: 14 }
  ];

  const leaderRankings = [
    { id: 4, rank: 1, name: 'Ratna Sari', property: 'LPP Garden Hotel', department: 'Front Office', promoters: 17, passives: 2, detractors: 1, total: 20 },
    { id: 5, rank: 2, name: 'Agus Setiawan', property: 'LPP Convention Hotel', department: 'Front Office', promoters: 15, passives: 2, detractors: 1, total: 18 }
  ];

  const rankings = selectedLevel === 'Staff' ? staffRankings : leaderRankings;

  return (
    <div>
      <PageHeader
        title="Reports & NPS Rankings"
        subtitle="Hasil survey periode Semester 2 2024"
        actions={
          <>
            <button 
              onClick={() => alert('Export PDF')} 
              className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button 
              onClick={() => alert('Export Excel')} 
              className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </>
        }
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <StatCard 
            title="Average NPS Score" 
            value="52%" 
            valueColor="text-emerald-600"
          />
          <StatCard 
            title="Total Promoters" 
            value="156" 
            valueColor="text-emerald-600"
          />
          <StatCard 
            title="Total Passives" 
            value="68" 
            valueColor="text-amber-600"
          />
          <StatCard 
            title="Total Detractors" 
            value="23" 
            valueColor="text-sky-600"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSelectedLevel('Staff')} 
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  selectedLevel === 'Staff' 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Staff Ranking</span>
                </div>
              </button>
              <button 
                onClick={() => setSelectedLevel('Leader')} 
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  selectedLevel === 'Leader' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Leader Ranking</span>
                </div>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {rankings.map((employee) => {
              const rankBadge = getRankBadge(employee.rank);
              const nps = calculateNPS(employee.promoters, employee.detractors, employee.total);
              
              return (
                <div key={employee.id} className="p-6 transition-colors hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 space-x-4">
                      <div className={`w-12 h-12 rounded-xl ${rankBadge.bg} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {typeof rankBadge.icon === 'string' && rankBadge.icon.includes('🥇') ? (
                          <span className="text-2xl">{rankBadge.icon}</span>
                        ) : (
                          <span className="text-lg">{rankBadge.icon}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-3">
                          <h3 className="text-lg font-bold text-gray-900">{employee.name}</h3>
                          <span className="px-3 py-1 text-xs font-semibold border rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">
                            Excellent
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{employee.property}</span>
                          <span>•</span>
                          <span>{employee.department}</span>
                          <span>•</span>
                          <span>{employee.total} responses</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-emerald-600">{nps}%</p>
                        <p className="mt-1 text-xs text-gray-500">NPS Score</p>
                      </div>

                      <div className="w-px h-12 bg-gray-200"></div>

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 mb-1 rounded-lg bg-emerald-100">
                            <span className="text-lg font-bold text-emerald-600">{employee.promoters}</span>
                          </div>
                          <p className="text-xs text-gray-500">Promoters</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 mb-1 rounded-lg bg-amber-100">
                            <span className="text-lg font-bold text-amber-600">{employee.passives}</span>
                          </div>
                          <p className="text-xs text-gray-500">Passives</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 mb-1 rounded-lg bg-sky-100">
                            <span className="text-lg font-bold text-sky-600">{employee.detractors}</span>
                          </div>
                          <p className="text-xs text-gray-500">Detractors</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert('View detail')} 
                        className="flex items-center px-4 py-2 space-x-2 font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
