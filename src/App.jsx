import React, { useState } from 'react';
import { BarChart3, Users, ClipboardCheck, TrendingUp, Calendar, LogOut, Download, Plus, Search, Edit2, Trash2, X, Save, Eye, Mail, CheckCircle2, Award, FileText, ChevronDown, ChevronUp, GripVertical, Settings, Clock } from 'lucide-react';

const LPPIntegratedDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'parameters', label: 'Parameters', icon: ClipboardCheck },
    { id: 'periods', label: 'Survey Periods', icon: Calendar },
    { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp },
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'employees': return <EmployeesPage />;
      case 'parameters': return <ParametersPage />;
      case 'periods': return <PeriodsPage />;
      case 'reports': return <ReportsPage />;
      default: return <DashboardHome setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img src="https://lpphotel.com/wp-content/uploads/2023/03/logo-lpp.png" alt="LPP" className="object-contain w-10 h-10" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">360° Best Employee Survey</h1>
              <p className="text-xs text-gray-500">LPP Hotel & MICE Group</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center px-4 py-3 space-x-3 rounded-lg bg-gray-50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500">
              <span className="text-sm font-semibold text-white">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Super Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@lpphotel.com</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">{renderPage()}</div>
    </div>
  );
};

const DashboardHome = ({ setCurrentPage }) => {
  const stats = [
    { title: 'Total Karyawan', value: '247', icon: Users, page: 'employees' },
    { title: 'Survey Aktif', value: 'Semester 2 2024', icon: Calendar, page: 'periods' },
    { title: 'Completion Rate', value: '73%', icon: ClipboardCheck, page: 'periods' },
    { title: 'Avg NPS Score', value: '52%', icon: TrendingUp, page: 'reports' }
  ];

  return (
    <div>
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">Monitoring survei 360° seluruh property</p>
      </div>
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} onClick={() => setCurrentPage(stat.page)} className="p-6 transition-shadow bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Add Employee', icon: Users, page: 'employees' },
              { label: 'Manage Parameters', icon: ClipboardCheck, page: 'parameters' },
              { label: 'View Reports', icon: TrendingUp, page: 'reports' },
              { label: 'Survey Periods', icon: Calendar, page: 'periods' }
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <button key={i} onClick={() => setCurrentPage(action.page)} className="p-4 transition-all border-2 border-gray-200 border-dashed rounded-lg hover:border-emerald-400 hover:bg-emerald-50 group">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-emerald-600" />
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Budi Santoso', email: 'budi@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office', level: 'Staff', supervisor: 'Ratna Sari' },
    { id: 2, name: 'Siti Aminah', email: 'siti@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office', level: 'Staff', supervisor: 'Ratna Sari' },
    { id: 3, name: 'Ratna Sari', email: 'ratna@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office', level: 'Leader', supervisor: 'Eko Prasetyo' },
    { id: 4, name: 'Eko Prasetyo', email: 'eko@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office', level: 'GM', supervisor: null }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', property: '', department: '', level: 'Staff', supervisor: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', property: '', department: '', level: 'Staff', supervisor: '' });
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setModalMode('edit');
    setSelectedEmployee(emp);
    setFormData({ name: emp.name, email: emp.email, property: emp.property, department: emp.department, level: emp.level, supervisor: emp.supervisor || '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      setEmployees([...employees, { id: employees.length + 1, ...formData }]);
    } else {
      setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...formData } : emp));
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus karyawan?')) setEmployees(employees.filter(e => e.id !== id));
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'GM': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Leader': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-sky-100 text-sky-700 border-sky-200';
    }
  };

  return (
    <div>
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employees Management</h2>
            <p className="mt-1 text-sm text-gray-500">Kelola data karyawan seluruh property</p>
          </div>
          <button onClick={handleAdd} className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg">
            <Plus className="w-4 h-4" /><span>Add Employee</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{employees.length}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Staff</p>
            <p className="mt-2 text-3xl font-bold text-sky-600">{employees.filter(e => e.level === 'Staff').length}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Leader</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{employees.filter(e => e.level === 'Leader').length}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">GM</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">{employees.filter(e => e.level === 'GM').length}</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari nama atau email..." className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-left text-gray-600 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-left text-gray-600 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-left text-gray-600 uppercase">Property</th>
                <th className="px-6 py-4 text-xs font-semibold text-left text-gray-600 uppercase">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-left text-gray-600 uppercase">Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-left text-gray-600 uppercase">Atasan</th>
                <th className="px-6 py-4 text-xs font-semibold text-right text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500">
                        <span className="text-sm font-semibold text-white">{emp.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.property}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(emp.level)}`}>{emp.level}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.supervisor || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleEdit(emp)} className="p-2 text-gray-600 transition-colors rounded-lg hover:text-emerald-600 hover:bg-emerald-50">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="p-2 text-gray-600 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-screen p-8 overflow-y-auto bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{modalMode === 'add' ? 'Add New Employee' : 'Edit Employee'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Budi Santoso" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. budi@lpphotel.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Property</label>
                  <input type="text" value={formData.property} onChange={(e) => setFormData({...formData, property: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Select Property" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Department</label>
                  <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Select Department" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Position Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Staff">Staff</option>
                    <option value="Leader">Leader</option>
                    <option value="GM">General Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Atasan</label>
                  <input type="text" value={formData.supervisor} onChange={(e) => setFormData({...formData, supervisor: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Ratna Sari" disabled={formData.level === 'GM'} />
                  {formData.level === 'GM' && <p className="mt-1 text-xs text-gray-500">GM tidak memiliki atasan</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center mt-8 space-x-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg">
                <Save className="w-5 h-5" /><span>{modalMode === 'add' ? 'Add Employee' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ParametersPage = () => {
  const [pillars, setPillars] = useState([
    { id: 1, name: 'Leadership & Initiative', description: 'Kemampuan memimpin dan mengambil inisiatif', isActive: true, questions: [
      { id: 1, text: 'Mampu mengambil inisiatif tanpa diminta', isActive: true },
      { id: 2, text: 'Mampu memberi arahan yang jelas', isActive: true }
    ]},
    { id: 2, name: 'Teamwork & Collaboration', description: 'Kemampuan bekerja sama dalam tim', isActive: true, questions: [
      { id: 3, text: 'Kooperatif dengan rekan kerja', isActive: true },
      { id: 4, text: 'Responsif terhadap permintaan bantuan', isActive: true }
    ]}
  ]);
  const [expanded, setExpanded] = useState([1, 2]);
  const [showPillarModal, setShowPillarModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [pillarFormData, setPillarFormData] = useState({ name: '', description: '' });
  const [questionFormData, setQuestionFormData] = useState({ text: '', pillarId: null });

  const toggleExpand = (id) => {
    setExpanded(expanded.includes(id) ? expanded.filter(i => i !== id) : [...expanded, id]);
  };

  const handleAddPillar = () => {
    setModalMode('add');
    setPillarFormData({ name: '', description: '' });
    setShowPillarModal(true);
  };

  const handleEditPillar = (pillar) => {
    setModalMode('edit');
    setSelectedPillar(pillar);
    setPillarFormData({ name: pillar.name, description: pillar.description });
    setShowPillarModal(true);
  };

  const handleDeletePillar = (pillarId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pillar ini beserta semua pertanyaannya?')) {
      setPillars(pillars.filter(p => p.id !== pillarId));
    }
  };

  const handleSavePillar = () => {
    if (modalMode === 'add') {
      setPillars([...pillars, { id: pillars.length + 1, ...pillarFormData, isActive: true, questions: [] }]);
    } else {
      setPillars(pillars.map(p => p.id === selectedPillar.id ? { ...p, ...pillarFormData } : p));
    }
    setShowPillarModal(false);
  };

  const handleAddQuestion = (pillarId) => {
    setModalMode('add');
    setQuestionFormData({ text: '', pillarId });
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (pillar, question) => {
    setModalMode('edit');
    setSelectedPillar(pillar);
    setSelectedQuestion(question);
    setQuestionFormData({ text: question.text, pillarId: pillar.id });
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (pillarId, questionId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
      setPillars(pillars.map(p => p.id === pillarId ? { ...p, questions: p.questions.filter(q => q.id !== questionId) } : p));
    }
  };

  const handleSaveQuestion = () => {
    if (modalMode === 'add') {
      setPillars(pillars.map(p => {
        if (p.id === questionFormData.pillarId) {
          const newQuestion = {
            id: Math.max(...pillars.flatMap(p => p.questions.map(q => q.id)), 0) + 1,
            text: questionFormData.text,
            isActive: true
          };
          return { ...p, questions: [...p.questions, newQuestion] };
        }
        return p;
      }));
    } else {
      setPillars(pillars.map(p => {
        if (p.id === selectedPillar.id) {
          return { ...p, questions: p.questions.map(q => q.id === selectedQuestion.id ? { ...q, text: questionFormData.text } : q) };
        }
        return p;
      }));
    }
    setShowQuestionModal(false);
  };

  return (
    <div>
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Parameters Management</h2>
            <p className="mt-1 text-sm text-gray-500">Kelola pilar dan pertanyaan survey</p>
          </div>
          <button onClick={handleAddPillar} className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg">
            <Plus className="w-4 h-4" /><span>Add Pillar</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-4">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Total Pillars</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{pillars.length}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Total Questions</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{pillars.reduce((sum, p) => sum + p.questions.length, 0)}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Active Pillars</p>
            <p className="mt-2 text-3xl font-bold text-sky-600">{pillars.filter(p => p.isActive).length}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Customizations</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">0</p>
          </div>
        </div>

        {pillars.map((pillar) => (
          <div key={pillar.id} className="overflow-hidden bg-white border border-gray-200 rounded-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 space-x-4">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold text-gray-900">{pillar.name}</h3>
                      <span className="px-3 py-1 text-xs font-semibold border rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">Active</span>
                      <span className="text-sm text-gray-500">{pillar.questions.length} pertanyaan</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{pillar.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleEditPillar(pillar)} className="p-2 text-gray-600 transition-colors rounded-lg hover:text-emerald-600 hover:bg-emerald-50">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeletePillar(pillar.id)} className="p-2 text-gray-600 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => toggleExpand(pillar.id)} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                    {expanded.includes(pillar.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            {expanded.includes(pillar.id) && (
              <div className="p-6 bg-gray-50">
                <div className="space-y-3">
                  {pillar.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 space-x-3">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          <div className="flex-1">
                            <div className="flex items-center mb-2 space-x-2">
                              <span className="text-xs font-semibold text-gray-400">Q{idx + 1}</span>
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">Active</span>
                            </div>
                            <p className="text-sm text-gray-900">{q.text}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => alert('Customize per department')} className="p-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Settings className="w-4 h-4" /></button>
                          <button onClick={() => handleEditQuestion(pillar, q)} className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteQuestion(pillar.id, q.id)} className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleAddQuestion(pillar.id)} className="flex items-center justify-center w-full px-4 py-3 mt-4 space-x-2 text-sm font-medium text-gray-600 transition-all border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50">
                  <Plus className="w-4 h-4" /><span>Add Question to this Pillar</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showPillarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-8 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{modalMode === 'add' ? 'Add New Pillar' : 'Edit Pillar'}</h2>
              <button onClick={() => setShowPillarModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Pillar Name</label>
                <input type="text" value={pillarFormData.name} onChange={(e) => setPillarFormData({...pillarFormData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Leadership & Initiative" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea value={pillarFormData.description} onChange={(e) => setPillarFormData({...pillarFormData, description: e.target.value})} className="w-full h-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Describe this pillar..." />
              </div>
            </div>
            <div className="flex mt-6 space-x-3">
              <button onClick={() => setShowPillarModal(false)} className="flex-1 px-6 py-3 border rounded-lg">Cancel</button>
              <button onClick={handleSavePillar} className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 text-white rounded-lg bg-emerald-600">
                <Save className="w-5 h-5" /><span>{modalMode === 'add' ? 'Add Pillar' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-8 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{modalMode === 'add' ? 'Add New Question' : 'Edit Question'}</h2>
              <button onClick={() => setShowQuestionModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Question Text</label>
              <textarea value={questionFormData.text} onChange={(e) => setQuestionFormData({...questionFormData, text: e.target.value})} className="w-full h-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Mampu mengambil inisiatif tanpa diminta" />
            </div>
            <div className="flex mt-6 space-x-3">
              <button onClick={() => setShowQuestionModal(false)} className="flex-1 px-6 py-3 border rounded-lg">Cancel</button>
              <button onClick={handleSaveQuestion} className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 text-white rounded-lg bg-emerald-600">
                <Save className="w-5 h-5" /><span>{modalMode === 'add' ? 'Add Question' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PeriodsPage = () => {
  const [periods, setPeriods] = useState([
    { id: 1, name: 'Semester 1 - 2024', status: 'completed', isActive: false, completed: 247, total: 247, startDate: '2024-01-01', endDate: '2024-01-31' },
    { id: 2, name: 'Semester 2 - 2024', status: 'active', isActive: true, completed: 181, total: 247, startDate: '2024-07-01', endDate: '2024-12-31' },
    { id: 3, name: 'Semester 1 - 2025', status: 'upcoming', isActive: false, completed: 0, total: 247, startDate: '2025-01-01', endDate: '2025-01-31' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '' });

  const handleCreate = () => {
    setPeriods([...periods, { id: periods.length + 1, ...formData, status: 'upcoming', isActive: false, completed: 0, total: 247 }]);
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return { bg: 'bg-emerald-100 text-emerald-700', label: 'Active', icon: CheckCircle2 };
      case 'completed': return { bg: 'bg-gray-100 text-gray-700', label: 'Completed', icon: CheckCircle2 };
      default: return { bg: 'bg-sky-100 text-sky-700', label: 'Upcoming', icon: Clock };
    }
  };

  return (
    <div>
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Survey Period Management</h2>
            <p className="mt-1 text-sm text-gray-500">Kelola periode survey dan monitor progress</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg">
            <Plus className="w-4 h-4" /><span>Create Period</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Total Periods</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{periods.length}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Active Period</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{periods.filter(p => p.isActive).length}</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Completion Rate</p>
            <p className="mt-2 text-3xl font-bold text-sky-600">{periods.find(p => p.isActive) ? Math.round((periods.find(p => p.isActive).completed / periods.find(p => p.isActive).total) * 100) : 0}%</p>
          </div>
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
                      <StatusIcon className="w-3 h-3" /><span>{statusBadge.label}</span>
                    </span>
                    {period.isActive && <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600">Currently Active</span>}
                  </div>
                  <p className="text-sm text-gray-500">{period.completed}/{period.total} completed</p>
                </div>
                <div className="flex items-center space-x-2">
                  {period.status === 'active' && (
                    <button onClick={() => alert('Send reminder')} className="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100">
                      <Mail className="w-4 h-4" /><span>Send Reminder</span>
                    </button>
                  )}
                  <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"><Edit2 className="w-5 h-5" /></button>
                  <button className="p-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600" disabled={period.isActive}><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
              {period.status === 'active' && (
                <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: `${completionPercentage}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-8 bg-white rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold">Create New Period</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Period Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Semester 1 - 2025" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
            <div className="flex mt-6 space-x-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border rounded-lg">Cancel</button>
              <button onClick={handleCreate} className="flex-1 px-6 py-3 text-white rounded-lg bg-emerald-600">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportsPage = () => {
  const [selectedLevel, setSelectedLevel] = useState('Staff');
  const calculateNPS = (promoters, detractors, total) => Math.round(((promoters / total) * 100) - ((detractors / total) * 100));

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

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500', icon: '🥇' };
    if (rank === 2) return { bg: 'bg-gradient-to-br from-gray-300 to-gray-400', icon: '🥈' };
    if (rank === 3) return { bg: 'bg-gradient-to-br from-amber-600 to-amber-700', icon: '🥉' };
    return { bg: 'bg-gray-100', icon: rank };
  };

  return (
    <div>
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reports & NPS Rankings</h2>
            <p className="mt-1 text-sm text-gray-500">Hasil survey periode Semester 2 2024</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => alert('Export PDF')} className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <FileText className="w-4 h-4" /><span>Export PDF</span>
            </button>
            <button onClick={() => alert('Export Excel')} className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" /><span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Average NPS Score</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">52%</p>
            <p className="mt-1 text-xs text-gray-400">Across all employees</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Total Promoters</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">156</p>
            <p className="mt-1 text-xs text-gray-400">Score 9-10</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Total Passives</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">68</p>
            <p className="mt-1 text-xs text-gray-400">Score 7-8</p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="text-sm font-medium text-gray-500">Total Detractors</p>
            <p className="mt-2 text-3xl font-bold text-sky-600">23</p>
            <p className="mt-1 text-xs text-gray-400">Score 1-6</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <button onClick={() => setSelectedLevel('Staff')} className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedLevel === 'Staff' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <div className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>Staff Ranking</span></div>
              </button>
              <button onClick={() => setSelectedLevel('Leader')} className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedLevel === 'Leader' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <div className="flex items-center space-x-2"><Award className="w-4 h-4" /><span>Leader Ranking</span></div>
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
                          <span className="px-3 py-1 text-xs font-semibold border rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">Excellent</span>
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

                      <button onClick={() => alert('View detail')} className="flex items-center px-4 py-2 space-x-2 font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg">
                        <Eye className="w-4 h-4" /><span>Detail</span>
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

export default LPPIntegratedDashboard