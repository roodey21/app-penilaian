"use client";
import React, { useMemo, useState } from "react";

const surveyMeta = {
  title: "360° Best Employee Survey",
  organization: "LPP Hotel & MICE Group",
  assessor: {
    name: "Budi Santoso",
    role: "Front Office Staff",
  },
};

const groups = [
  {
    id: "self",
    label: "Penilaian Diri Sendiri",
    description: "Evaluasi performa Anda sendiri",
    targets: [{ id: "self", name: "Budi Santoso", role: "Front Office Staff" }],
  },
  {
    id: "peer",
    label: "Penilaian Rekan Kerja",
    description: "Nilai rekan kerja dalam department Anda",
    targets: [
      { id: "peer-1", name: "Siti Aminah", role: "Front Office Staff" },
      { id: "peer-2", name: "Dewi Lestari", role: "Front Office Staff" },
      { id: "peer-3", name: "Rina Kartika", role: "Front Office Staff" },
    ],
  },
  {
    id: "supervisor",
    label: "Supervisor & Manajerial",
    description: "Nilai supervisor dan manajer langsung",
    targets: [
      { id: "sup-1", name: "Andi Prasetyo", role: "Front Office Supervisor" },
      { id: "sup-2", name: "Lukman Hakim", role: "Duty Manager" },
      { id: "sup-3", name: "Maya Sari", role: "Assistant Manager" },
    ],
  },
  {
    id: "atasan",
    label: "Penilaian Atasan",
    description: "Nilai atasan lebih tinggi",
    targets: [
      { id: "atas-1", name: "Rudi Hartono", role: "Front Office Manager" },
      { id: "atas-2", name: "Galuh Permata", role: "General Manager" },
      { id: "atas-3", name: "Imam Setiawan", role: "Cluster GM" },
    ],
  },
];

const sections = [
  {
    id: "leadership",
    title: "Leadership & Initiative",
    questions: [
      { id: "initiative", text: "Mengambil inisiatif tanpa diminta" },
      { id: "decision", text: "Mampu mengambil keputusan yang tepat" },
      { id: "ownership", text: "Menunjukkan rasa memiliki terhadap tugas" },
    ],
  },
  {
    id: "teamwork",
    title: "Teamwork & Collaboration",
    questions: [
      { id: "communication", text: "Berkomunikasi jelas dengan tim" },
      { id: "support", text: "Membantu rekan ketika dibutuhkan" },
      { id: "conflict", text: "Mengelola konflik secara konstruktif" },
    ],
  },
  {
    id: "service",
    title: "Service Excellence",
    questions: [
      { id: "empathy", text: "Menunjukkan empati kepada tamu" },
      { id: "speed", text: "Respon cepat terhadap permintaan" },
      { id: "quality", text: "Menjaga kualitas layanan konsisten" },
    ],
  },
  {
    id: "professional",
    title: "Professional Development",
    questions: [
      {
        id: "learn",
        text: "Menunjukkan keinginan untuk belajar hal baru",
        helper: "Berikan penilaian dengan skala 1-10 untuk setiap aspek",
      },
      { id: "feedback", text: "Mengaplikasikan feedback untuk perbaikan" },
      { id: "training", text: "Mengikuti training dan development program" },
    ],
  },
];

const scaleLabels = {
  left: "Sangat Kurang",
  right: "Sangat Baik",
};

function RatingScale({ value, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <span className="hidden w-20 text-xs text-left text-gray-500 sm:block">{scaleLabels.left}</span>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }).map((_, idx) => {
          const score = idx + 1;
          const active = value === score;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onSelect(score)}
              className={`w-10 h-10 rounded-md border text-sm font-semibold transition shadow-sm
                ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-200"}`}
            >
              {score}
            </button>
          );
        })}
      </div>
      <span className="hidden w-20 text-xs text-right text-gray-500 sm:block">{scaleLabels.right}</span>
      <div className="flex justify-between w-full mt-2 text-xs text-gray-500 sm:hidden">
        <span>{scaleLabels.left}</span>
        <span>{scaleLabels.right}</span>
      </div>
    </div>
  );
}

export default function AssessmentMenilaiPage() {
  const [activeCategory, setActiveCategory] = useState(groups[0].id);
  const [activeSection, setActiveSection] = useState("professional");
  const [answers, setAnswers] = useState({});

  const initialTargetState = useMemo(() => {
    const map = {};
    groups.forEach((g) => {
      map[g.id] = g.targets[0]?.id || null;
    });
    return map;
  }, []);

  const [activeTargetByCategory, setActiveTargetByCategory] = useState(initialTargetState);

  const activeGroup = useMemo(() => groups.find((g) => g.id === activeCategory) || groups[0], [activeCategory]);
  const activeTarget = useMemo(
    () => activeGroup.targets.find((t) => t.id === activeTargetByCategory[activeCategory]) || activeGroup.targets[0],
    [activeCategory, activeGroup, activeTargetByCategory]
  );

  const questions = useMemo(() => {
    const section = sections.find((s) => s.id === activeSection);
    return section?.questions || [];
  }, [activeSection]);

  const totalQuestions = useMemo(() => {
    const perTarget = sections.reduce((acc, section) => acc + (section.questions?.length || 0), 0);
    const totalTargets = groups.reduce((acc, g) => acc + g.targets.length, 0);
    return perTarget * totalTargets;
  }, []);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / Math.max(totalQuestions, 1)) * 100);

  const firstSectionId = sections[0].id;
  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const isLastSection = currentSectionIndex === sections.length - 1;

  const isSectionComplete = (sectionId) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return false;
    return (sec.questions || []).every((q) => {
      const key = `${activeCategory}:${activeTarget?.id}:${sectionId}:${q.id}`;
      return answers[key] != null;
    });
  };

  const isTargetComplete = () => {
    return sections.every((s) => isSectionComplete(s.id));
  };

  const handleSelectScore = (questionId, score) => {
    if (!activeTarget) return;
    const key = `${activeCategory}:${activeTarget.id}:${activeSection}:${questionId}`;
    setAnswers((prev) => ({ ...prev, [key]: score }));
  };

  const handlePrev = () => {
    const catIdx = groups.findIndex((g) => g.id === activeCategory);
    const targetIdx = activeGroup.targets.findIndex((t) => t.id === activeTarget?.id);

    if (currentSectionIndex > 0) {
      setActiveSection(sections[currentSectionIndex - 1].id);
      return;
    }

    if (targetIdx > 0) {
      setActiveTargetByCategory((prev) => ({ ...prev, [activeCategory]: activeGroup.targets[targetIdx - 1].id }));
      setActiveSection(sections[sections.length - 1].id);
      return;
    }

    if (catIdx > 0) {
      const prevGroup = groups[catIdx - 1];
      setActiveCategory(prevGroup.id);
      setActiveTargetByCategory((prev) => ({ ...prev, [prevGroup.id]: prevGroup.targets[prevGroup.targets.length - 1].id }));
      setActiveSection(sections[sections.length - 1].id);
      return;
    }
  };

  const handleNext = () => {
    const catIdx = groups.findIndex((g) => g.id === activeCategory);
    const targetIdx = activeGroup.targets.findIndex((t) => t.id === activeTarget?.id);
    const isLastTargetInGroup = targetIdx === activeGroup.targets.length - 1;
    const isLastGroup = catIdx === groups.length - 1;

    // Move within sections first, only if current section complete
    if (!isLastSection) {
      if (!isSectionComplete(activeSection)) return; // guard
      setActiveSection(sections[currentSectionIndex + 1].id);
      return;
    }

    // At last section: proceed to next target/group only if all sections complete
    if (!isTargetComplete()) return; // guard

    if (!isLastTargetInGroup) {
      setActiveTargetByCategory((prev) => ({ ...prev, [activeCategory]: activeGroup.targets[targetIdx + 1].id }));
      setActiveSection(firstSectionId);
      return;
    }

    if (!isLastGroup) {
      const nextGroup = groups[catIdx + 1];
      setActiveCategory(nextGroup.id);
      setActiveTargetByCategory((prev) => ({ ...prev, [nextGroup.id]: nextGroup.targets[0].id }));
      setActiveSection(firstSectionId);
      return;
    }

    alert("Penilaian berhasil disimpan (dummy).");
    console.log("Submitted answers", answers);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 font-semibold rounded-lg bg-emerald-50 text-emerald-700">LPP</div>
            <div>
              <p className="text-sm text-gray-500">Progress Survey</p>
              <h1 className="text-lg font-bold text-gray-900">{surveyMeta.title}</h1>
              <p className="text-xs text-gray-500">{surveyMeta.organization}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div className="text-sm font-semibold text-gray-900">{surveyMeta.assessor.name}</div>
            <div className="text-xs text-gray-500">{surveyMeta.assessor.role}</div>
            <div className="w-24 h-2 overflow-hidden bg-gray-100 rounded-full">
              <div className="h-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-gray-500">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {groups.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left border rounded-lg p-3 transition shadow-sm
                  ${isActive ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-100 hover:border-emerald-100"}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isActive ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}>
                    {category.label.charAt(0)}
                  </div>
                  {isActive && (
                    <span className="text-xs font-semibold text-emerald-600">Aktif</span>
                  )}
                </div>
                <div className="mt-2 text-sm font-semibold text-gray-900">{category.label}</div>
                <div className="text-xs text-gray-500">{category.description}</div>
              </button>
            );
          })}
        </div>

        {/* Target card list under group selection */}
        <div className="mt-6">
          <div className="mb-2 text-sm font-semibold text-gray-900">Pilih orang untuk dinilai di {activeGroup.label}</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {activeGroup.targets.map((t) => {
              const selected = t.id === activeTarget?.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTargetByCategory((prev) => ({ ...prev, [activeCategory]: t.id }))}
                  className={`text-left border rounded-xl p-4 transition shadow-sm flex items-center gap-3
                    ${selected ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-emerald-200"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    selected ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}>{t.name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                  {selected && <span className="text-xs font-semibold text-emerald-600">Dipilih</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-emerald-600">
            {activeTarget?.name?.charAt(0) || "-"}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{activeTarget?.name}</div>
            <div className="text-xs text-gray-500">{activeTarget?.role}</div>
          </div>
          <div className="ml-auto text-xs text-gray-500">{`${activeGroup.targets.findIndex((t) => t.id === activeTarget?.id) + 1} dari ${activeGroup.targets.length}`}</div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {sections.map((section) => {
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 rounded-md border text-xs font-semibold transition ${
                  active ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-200"
                }`}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {sections.find((s) => s.id === activeSection)?.title || "Pertanyaan"}
            </h2>
            <p className="mt-1 text-xs text-gray-500">Berikan penilaian dengan skala 1-10 untuk setiap aspek</p>
          </div>
          <div className="text-xs text-gray-500">{`${activeGroup.targets.findIndex((t) => t.id === activeTarget?.id) + 1} dari ${activeGroup.targets.length}`}</div>
        </div>

        <div className="mt-6 space-y-6">
          {questions.map((question) => {
            const currentValue = answers[`${activeCategory}:${activeTarget?.id}:${activeSection}:${question.id}`];
            return (
              <div key={question.id} className="pb-6 border-b last:border-b-0 last:pb-0">
                <div className="text-sm font-semibold text-gray-900">{question.text}</div>
                {question.helper && <div className="mt-1 text-xs text-gray-500">{question.helper}</div>}
                <RatingScale value={currentValue} onSelect={(score) => handleSelectScore(question.id, score)} />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-4 mt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 w-full sm:w-auto">
            <span className="font-semibold">Tips:</span>
            <span>Berikan penilaian yang objektif dan jujur. Skor 1-6 = Detractor, 7-8 = Passive, 9-10 = Promoter.</span>
          </div>
          <div className="flex items-center w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="w-1/2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
              disabled={
                groups.findIndex((g) => g.id === activeCategory) === 0 &&
                activeGroup.targets.findIndex((t) => t.id === activeTarget?.id) === 0
              }
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`px-5 py-3 text-sm font-semibold rounded-md shadow-sm w-1/2 sm:w-auto
                ${!isLastSection ? (isSectionComplete(activeSection) ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-300 text-white cursor-not-allowed")
                : (isTargetComplete() ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-300 text-white cursor-not-allowed")}`}
            >
              {(() => {
                const catIdx = groups.findIndex((g) => g.id === activeCategory);
                const targetIdx = activeGroup.targets.findIndex((t) => t.id === activeTarget?.id);
                const isLastTargetInGroup = targetIdx === activeGroup.targets.length - 1;
                const isLastGroup = catIdx === groups.length - 1;
                if (!isLastSection) return "Lanjut Kategori Berikutnya";
                if (isLastGroup && isLastTargetInGroup) return "Selesai";
                return "Lanjut Rekan Berikutnya";
              })()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
