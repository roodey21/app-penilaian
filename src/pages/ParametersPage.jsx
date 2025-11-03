import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Settings, Save } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';

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
      setPillars(pillars.map(p => 
        p.id === pillarId ? { ...p, questions: p.questions.filter(q => q.id !== questionId) } : p
      ));
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
          return { 
            ...p, 
            questions: p.questions.map(q => 
              q.id === selectedQuestion.id ? { ...q, text: questionFormData.text } : q
            ) 
          };
        }
        return p;
      }));
    }
    setShowQuestionModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Parameters Management"
        subtitle="Kelola pilar dan pertanyaan survey"
        actions={
          <button 
            onClick={handleAddPillar} 
            className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pillar</span>
          </button>
        }
      />

      <div className="p-8 space-y-4">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Pillars" value={pillars.length} />
          <StatCard 
            title="Total Questions" 
            value={pillars.reduce((sum, p) => sum + p.questions.length, 0)}
            valueColor="text-emerald-600"
          />
          <StatCard 
            title="Active Pillars" 
            value={pillars.filter(p => p.isActive).length}
            valueColor="text-sky-600"
          />
          <StatCard 
            title="Customizations" 
            value={0}
            valueColor="text-amber-600"
          />
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
                      <span className="px-3 py-1 text-xs font-semibold border rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">
                        Active
                      </span>
                      <span className="text-sm text-gray-500">{pillar.questions.length} pertanyaan</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{pillar.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEditPillar(pillar)} 
                    className="p-2 text-gray-600 transition-colors rounded-lg hover:text-emerald-600 hover:bg-emerald-50"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeletePillar(pillar.id)} 
                    className="p-2 text-gray-600 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => toggleExpand(pillar.id)} 
                    className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                  >
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
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                                Active
                              </span>
                            </div>
                            <p className="text-sm text-gray-900">{q.text}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => alert('Customize per department')} 
                            className="p-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditQuestion(pillar, q)} 
                            className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(pillar.id, q.id)} 
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleAddQuestion(pillar.id)} 
                  className="flex items-center justify-center w-full px-4 py-3 mt-4 space-x-2 text-sm font-medium text-gray-600 transition-all border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question to this Pillar</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={showPillarModal}
        onClose={() => setShowPillarModal(false)}
        title={modalMode === 'add' ? 'Add New Pillar' : 'Edit Pillar'}
        footer={
          <>
            <button 
              onClick={() => setShowPillarModal(false)} 
              className="flex-1 px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleSavePillar} 
              className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 text-white rounded-lg bg-emerald-600"
            >
              <Save className="w-5 h-5" />
              <span>{modalMode === 'add' ? 'Add Pillar' : 'Save Changes'}</span>
            </button>
          </>
        }
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Pillar Name</label>
          <input 
            type="text" 
            value={pillarFormData.name} 
            onChange={(e) => setPillarFormData({...pillarFormData, name: e.target.value})} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
            placeholder="e.g. Leadership & Initiative" 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea 
            value={pillarFormData.description} 
            onChange={(e) => setPillarFormData({...pillarFormData, description: e.target.value})} 
            className="w-full h-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
            placeholder="Describe this pillar..." 
          />
        </div>
      </Modal>

      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title={modalMode === 'add' ? 'Add New Question' : 'Edit Question'}
        footer={
          <>
            <button 
              onClick={() => setShowQuestionModal(false)} 
              className="flex-1 px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveQuestion} 
              className="flex items-center justify-center flex-1 px-6 py-3 space-x-2 text-white rounded-lg bg-emerald-600"
            >
              <Save className="w-5 h-5" />
              <span>{modalMode === 'add' ? 'Add Question' : 'Save Changes'}</span>
            </button>
          </>
        }
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Question Text</label>
          <textarea 
            value={questionFormData.text} 
            onChange={(e) => setQuestionFormData({...questionFormData, text: e.target.value})} 
            className="w-full h-24 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
            placeholder="e.g. Mampu mengambil inisiatif tanpa diminta" 
          />
        </div>
      </Modal>
    </div>
  );
};

export default ParametersPage;
