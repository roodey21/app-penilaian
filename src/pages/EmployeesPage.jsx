import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import { getLevelColor } from '../utils/helpers';
import { properties, departments } from '../constants/organizationStructure';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Budi Santoso', email: 'budi@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office Department', level: 'Staff', position: 'FO Staff', supervisor: 'Ratna Sari' },
    { id: 2, name: 'Siti Aminah', email: 'siti@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office Department', level: 'Staff', position: 'FO Staff', supervisor: 'Ratna Sari' },
    { id: 3, name: 'Ratna Sari', email: 'ratna@lpphotel.com', property: 'LPP Garden Hotel', department: 'Front Office Department', level: 'Leader', position: 'FO Supervisor LGH', supervisor: 'Eko Prasetyo' },
    { id: 4, name: 'Ahmad Rifki', email: 'ahmad@lpphotel.com', property: 'LPP Garden Hotel', department: 'Housekeeping Department', level: 'Leader', position: 'HK Supervisor LGH', supervisor: 'Eko Prasetyo' },
    { id: 5, name: 'Dewi Lestari', email: 'dewi@lpphotel.com', property: 'LPP Hotel Group', department: 'HRD Department', level: 'Managerial', position: 'HR Coordinator', supervisor: 'Eko Prasetyo' },
    { id: 6, name: 'Agus Susanto', email: 'agus@lpphotel.com', property: 'LPP Hotel Group', department: 'Accounting Department', level: 'Managerial', position: 'Chief Accounting', supervisor: 'Eko Prasetyo' },
    { id: 7, name: 'Eko Prasetyo', email: 'eko@lpphotel.com', property: 'LPP Hotel Group', department: '-', level: 'GM', position: 'General Manager', supervisor: null }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    property: '', 
    department: '', 
    level: 'Staff', 
    position: '',
    supervisor: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Get available departments based on selected property
  const getAvailableDepartments = () => {
    if (!formData.property) return [];
    const selectedProperty = properties.find(p => p.name === formData.property);
    if (!selectedProperty) return [];
    return departments[selectedProperty.type] || [];
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setModalMode('add');
    setFormData({ 
      name: '', 
      email: '', 
      property: '', 
      department: '', 
      level: 'Staff', 
      position: '',
      supervisor: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setModalMode('edit');
    setSelectedEmployee(emp);
    setFormData({ 
      name: emp.name, 
      email: emp.email, 
      property: emp.property, 
      department: emp.department, 
      level: emp.level,
      position: emp.position || '',
      supervisor: emp.supervisor || '' 
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      setEmployees([...employees, { id: employees.length + 1, ...formData }]);
    } else {
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? { ...emp, ...formData } : emp
      ));
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus karyawan?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  return (
    <div>
      <PageHeader
        title="Employees Management"
        subtitle="Kelola data karyawan seluruh property"
        actions={
          <button 
            onClick={handleAdd} 
            className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        }
      />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Karyawan" value={employees.length} />
          <StatCard 
            title="Staff" 
            value={employees.filter(e => e.level === 'Staff').length}
            valueColor="text-sky-600"
          />
          <StatCard 
            title="Leader/Supervisor" 
            value={employees.filter(e => e.level === 'Leader' || e.level === 'Supervisor').length}
            valueColor="text-amber-600"
          />
          <StatCard 
            title="Managerial" 
            value={employees.filter(e => e.level === 'Managerial').length}
            valueColor="text-purple-600"
          />
        </div>

        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Cari nama atau email..."
        />

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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(emp.level)}`}>
                      {emp.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.supervisor || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(emp)} 
                        className="p-2 text-gray-600 transition-colors rounded-lg hover:text-emerald-600 hover:bg-emerald-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.id)} 
                        className="p-2 text-gray-600 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
                      >
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Add New Employee' : 'Edit Employee'}
        footer={
          <>
            <button 
              onClick={() => setShowModal(false)} 
              className="flex-1 px-6 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg"
            >
              <Save className="w-5 h-5" />
              <span>{modalMode === 'add' ? 'Add Employee' : 'Save Changes'}</span>
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="e.g. Budi Santoso" 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="e.g. budi@lpphotel.com" 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Property</label>
            <select 
              value={formData.property} 
              onChange={(e) => setFormData({...formData, property: e.target.value, department: ''})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Pilih Property</option>
              {properties.map(prop => (
                <option key={prop.id} value={prop.name}>{prop.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Department</label>
            <select 
              value={formData.department} 
              onChange={(e) => setFormData({...formData, department: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={!formData.property}
            >
              <option value="">Pilih Department</option>
              {getAvailableDepartments().map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Position Level</label>
            <select 
              value={formData.level} 
              onChange={(e) => setFormData({...formData, level: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Staff">Staff</option>
              <option value="Leader">Supervisor/Leader</option>
              <option value="Managerial">Managerial</option>
              <option value="GM">General Manager</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Position Title</label>
            <input 
              type="text" 
              value={formData.position} 
              onChange={(e) => setFormData({...formData, position: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="e.g. FO Staff, HK Supervisor" 
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Atasan</label>
          <input 
            type="text" 
            value={formData.supervisor} 
            onChange={(e) => setFormData({...formData, supervisor: e.target.value})} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            placeholder="e.g. Ratna Sari" 
            disabled={formData.level === 'GM'} 
          />
          {formData.level === 'GM' && (
            <p className="mt-1 text-xs text-gray-500">GM tidak memiliki atasan</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default EmployeesPage;
