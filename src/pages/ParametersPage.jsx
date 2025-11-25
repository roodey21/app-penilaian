import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Settings, Save } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/common/StatCard';
import Modal from '../components/common/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';

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
          <Button onClick={handleAddPillar} variant="primary">
            <Plus className="w-4 h-4" />
            <span>Add Pillar</span>
          </Button>
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
          <Card key={pillar.id} className="mb-4">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 space-x-4">
                  <GripVertical className="w-5 h-5 text-base-content/40 cursor-move" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-bold">{pillar.name}</h3>
                      <Badge variant={pillar.isActive ? 'primary' : 'default'}>{pillar.isActive ? 'Active' : 'Inactive'}</Badge>
                      <span className="text-sm text-base-content/60">{pillar.questions.length} pertanyaan</span>
                    </div>
                    <p className="mt-1 text-sm text-base-content/60">{pillar.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditPillar(pillar)}>
                    <Edit2 className="w-5 h-5" />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeletePillar(pillar.id)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand(pillar.id)}>
                    {expanded.includes(pillar.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
            {expanded.includes(pillar.id) && (
              <div className="p-4 bg-gray-50">
                <div className="space-y-3 w-full">
                  {pillar.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white border border-gray-200 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 space-x-3">
                          <GripVertical className="w-4 h-4 text-base-content/40 cursor-move" />
                          <div className="flex-1">
                            <div className="flex items-center mb-2 space-x-2">
                              <span className="text-xs font-semibold text-base-content/60">Q{idx + 1}</span>
                              <Badge variant="primary">Active</Badge>
                            </div>
                            <p className="text-sm">{q.text}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => alert('Customize per department')}>
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(pillar, q)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteQuestion(pillar.id, q.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => handleAddQuestion(pillar.id)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Question to this Pillar
                </Button>
              </div>
            )}
          </Card>
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
          <label className="block mb-2 text-sm">Pillar Name</label>
          <input
            type="text"
            value={pillarFormData.name}
            onChange={(e) => setPillarFormData({ ...pillarFormData, name: e.target.value })}
            className="input input-bordered w-full"
            placeholder="e.g. Leadership & Initiative"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm">Description</label>
          <textarea
            value={pillarFormData.description}
            onChange={(e) => setPillarFormData({ ...pillarFormData, description: e.target.value })}
            className="textarea textarea-bordered w-full h-24"
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
          <label className="block mb-2 text-sm">Question Text</label>
          <textarea
            value={questionFormData.text}
            onChange={(e) => setQuestionFormData({ ...questionFormData, text: e.target.value })}
            className="textarea textarea-bordered w-full h-24"
            placeholder="e.g. Mampu mengambil inisiatif tanpa diminta"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ParametersPage;
