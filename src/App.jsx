import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardHome from './pages/DashboardHome';
import AssessmentPage from './pages/AssessmentPage';
import EmployeesPage from './pages/EmployeesPage';
import ParametersPage from './pages/ParametersPage';
import PeriodsPage from './pages/PeriodsPage';
import ReportsPage from './pages/ReportsPage';

const LPPIntegratedDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'assessment': return <AssessmentPage />;
      case 'employees': return <EmployeesPage />;
      case 'parameters': return <ParametersPage />;
      case 'periods': return <PeriodsPage />;
      case 'reports': return <ReportsPage />;
      default: return <DashboardHome setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 overflow-auto">{renderPage()}</div>
    </div>
  );
};

export default LPPIntegratedDashboard;
