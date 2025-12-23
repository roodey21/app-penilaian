"use client";
import React, { useMemo, useState, useEffect } from "react";
import SurveyApi from "../../../services/surveyApi";
import { mapGroupMappingToUI, mapQuestionsToSections } from "../../../utils/assessmentAdapter";
import session from "../../../utils/session";

const surveyMeta = {
  title: "360° Best Employee Survey",
  organization: "LPP Hotel & MICE Group",
};

const scaleLabels = {
  left: "Sangat Kurang",
  right: "Sangat Baik",
};

function RatingScale({ value, onSelect }) {
  const getScoreColor = (score) => {
    if (score >= 1 && score <= 6) return 'red';      // Detractor: merah
    if (score >= 7 && score <= 8) return 'yellow';   // Passive: kuning
    if (score >= 9 && score <= 10) return 'green';   // Promoter: ijo
    return 'gray';
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <span className="hidden w-20 text-xs text-left text-gray-500 sm:block">{scaleLabels.left}</span>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }).map((_, idx) => {
          const score = idx + 1;
          const active = value === score;
          const scoreColor = getScoreColor(score);
          const bgColorClass = scoreColor === 'red' ? 'bg-red-50' : scoreColor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50';
          const borderColorClass = scoreColor === 'red' ? 'border-red-200' : scoreColor === 'yellow' ? 'border-yellow-200' : 'border-green-200';
          const activeBgClass = scoreColor === 'red' ? 'bg-red-600' : scoreColor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600';
          const activeBorderClass = scoreColor === 'red' ? 'border-red-600' : scoreColor === 'yellow' ? 'border-yellow-600' : 'border-green-600';
          return (
            <button
              key={score}
              type="button"
              onClick={() => onSelect(score)}
              className={`w-10 h-10 rounded-md border text-sm font-semibold transition shadow-sm
                ${active ? `${activeBgClass} text-white ${activeBorderClass}` : `${bgColorClass} text-gray-700 ${borderColorClass} hover:border-opacity-80`}`}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [sections, setSections] = useState([]);
  const [assessor, setAssessor] = useState(null);
  const [period, setPeriod] = useState(null);
  const [saving, setSaving] = useState(false);

  const [activeCategory, setActiveCategory] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [answers, setAnswers] = useState({});

  // Fetch data on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [activePeriodRes, groupMappingRes, questionsRes] = await Promise.all([
          SurveyApi.getActivePeriod(),
          SurveyApi.getGroupMapping(),
          SurveyApi.getAssessmentQuestions(),
        ]);

        if (!mounted) return;

        console.log('Raw API responses:', { groupMappingRes, questionsRes });

        const mappedGroups = mapGroupMappingToUI(groupMappingRes);
        const mappedSections = mapQuestionsToSections(questionsRes);

        console.log('Mapped data:', { mappedGroups, mappedSections });

        setGroups(mappedGroups);
        setSections(mappedSections);

        // Set initial active states
        if (mappedGroups.length > 0) {
          setActiveCategory(mappedGroups[0].id);
        }
        if (mappedSections.length > 0) {
          setActiveSection(mappedSections[0].id);
        }

        // Get assessor info from session
        const sess = session.getSession();
        if (sess?.user) {
          const user = sess.user;
          const userName = user.name || user.email || "User";
          const userRole = typeof user.level === 'string' ? user.level : 
                          typeof user.position === 'string' ? user.position :
                          user.position?.name || user.position?.title ||
                          typeof user.role === 'string' ? user.role :
                          user.role?.name || "Staff";
          setAssessor({
            name: userName,
            role: userRole,
          });
        }

        // Period info
        if (activePeriodRes) {
          setPeriod({
            id: activePeriodRes.id || activePeriodRes.period_id || null,
          });
        }

        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const initialTargetState = useMemo(() => {
    const map = {};
    groups.forEach((g) => {
      map[g.id] = g.targets[0]?.id || null;
    });
    return map;
  }, [groups]);

  const [activeTargetByCategory, setActiveTargetByCategory] = useState(initialTargetState);

  // Update active target state when groups change
  useEffect(() => {
    if (groups.length > 0) {
      const newMap = {};
      groups.forEach((g) => {
        newMap[g.id] = g.targets[0]?.id || null;
      });
      setActiveTargetByCategory(newMap);
    }
  }, [groups]);

  const activeGroup = useMemo(() => {
    if (!groups || groups.length === 0) return null;
    return groups.find((g) => g.id === activeCategory) || groups[0];
  }, [activeCategory, groups]);
  
  const activeTarget = useMemo(() => {
    if (!activeGroup || !activeGroup.targets || activeGroup.targets.length === 0) return null;
    return activeGroup.targets.find((t) => t.id === activeTargetByCategory[activeCategory]) || activeGroup.targets[0];
  }, [activeCategory, activeGroup, activeTargetByCategory]);

  const questions = useMemo(() => {
    const section = sections.find((s) => s.id === activeSection);
    return section?.questions || [];
  }, [activeSection]);

  // Build quick lookup for question -> sectionId
  const questionToSectionMap = useMemo(() => {
    const map = {};
    sections.forEach((sec) => {
      (sec.questions || []).forEach((q) => {
        map[q.id] = sec.id;
      });
    });
    return map;
  }, [sections]);

  const totalQuestions = useMemo(() => {
    const perTarget = sections.reduce((acc, section) => acc + (section.questions?.length || 0), 0);
    const totalTargets = groups.reduce((acc, g) => acc + g.targets.length, 0);
    return perTarget * totalTargets;
  }, [groups, sections]);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / Math.max(totalQuestions, 1)) * 100);

  const firstSectionId = sections.length > 0 ? sections[0].id : "";
  const currentSectionIndex = sections.findIndex((s) => s.id === activeSection);
  const isLastSection = currentSectionIndex === sections.length - 1;

  const isSectionComplete = (sectionId) => {
    if (!activeTarget) return false;
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return false;
    return (sec.questions || []).every((q) => {
      const key = `${activeCategory}:${activeTarget?.id}:${sectionId}:${q.id}`;
      return answers[key] != null;
    });
  };

  const isTargetComplete = () => {
    if (!activeTarget) return false;
    return sections.every((s) => isSectionComplete(s.id));
  };

  const handleSelectScore = (questionId, score) => {
    if (!activeTarget || !activeGroup) return;
    const key = `${activeCategory}:${activeTarget.id}:${activeSection}:${questionId}`;
    setAnswers((prev) => ({ ...prev, [key]: score }));
  };

  // Prefill answers when switching target (fetch all answers for target+period)
  useEffect(() => {
    async function prefill() {
      try {
        if (!activeTarget || !period) return;
        const res = await SurveyApi.getAnswers({
          target_user_id: activeTarget.id,
          period_id: period.id,
        });
        const list = Array.isArray(res?.answers) ? res.answers : Array.isArray(res) ? res : [];
        if (!list.length) return;
        setAnswers((prev) => {
          const next = { ...prev };
          list.forEach((ans) => {
            const qid = ans.question_id || ans.id;
            const secId = questionToSectionMap[qid];
            if (!secId) return;
            const key = `${activeCategory}:${activeTarget.id}:${secId}:${qid}`;
            next[key] = ans.score;
          });
          return next;
        });
      } catch (e) {
        // ignore prefill errors to keep UX smooth
      }
    }
    prefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTarget?.id, period?.id]);

  // Save current section answers (Plan B minimal payload)
  async function saveCurrentSection() {
    if (!activeTarget || !period) return;
    const sec = sections.find((s) => s.id === activeSection);
    if (!sec) return;
    const sectionAnswers = (sec.questions || [])
      .map((q) => {
        const key = `${activeCategory}:${activeTarget.id}:${activeSection}:${q.id}`;
        const score = answers[key];
        if (score == null) return null;
        return { question_id: q.id, score };
      })
      .filter(Boolean);
    if (sectionAnswers.length === 0) return;
    setSaving(true);
    try {
      const payload = {
        target_user_id: activeTarget.id,
        period_id: period.id,
        answers: sectionAnswers,
      };
      await SurveyApi.submitAnswers(payload);
    } catch (e) {
      // optionally surface toast; keep navigation guarded by completion checks
      console.error('Failed saving section answers', e);
    } finally {
      setSaving(false);
    }
  }

  const handlePrev = () => {
    if (!activeGroup || !groups || groups.length === 0) return;
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

  const handleNext = async () => {
    if (!activeGroup || !groups || groups.length === 0) return;
    const catIdx = groups.findIndex((g) => g.id === activeCategory);
    const targetIdx = activeGroup.targets.findIndex((t) => t.id === activeTarget?.id);
    const isLastTargetInGroup = targetIdx === activeGroup.targets.length - 1;
    const isLastGroup = catIdx === groups.length - 1;

    // Move within sections first, only if current section complete
    if (!isLastSection) {
      if (!isSectionComplete(activeSection)) return; // guard
      await saveCurrentSection();
      setActiveSection(sections[currentSectionIndex + 1].id);
      return;
    }

    // At last section: proceed to next target/group only if all sections complete
    if (!isTargetComplete()) return; // guard
    await saveCurrentSection();

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

    alert("Penilaian berhasil disimpan.");
    // Refresh progress to update badges/completion
    try {
      const gm = await SurveyApi.getGroupMapping();
      const mapped = mapGroupMappingToUI(gm);
      if (Array.isArray(mapped) && mapped.length) {
        setGroups(mapped);
      }
    } catch {}
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-2 text-gray-500">Memuat data penilaian...</div>
          <div className="w-16 h-16 mx-auto border-4 rounded-full border-emerald-200 border-t-emerald-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white border border-red-100 shadow-sm rounded-xl">
          <div className="mb-2 font-semibold text-red-600">Gagal memuat data</div>
          <div className="mb-4 text-sm text-gray-600">{error?.message || "Terjadi kesalahan"}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!loading && !error && (groups.length === 0 || sections.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="mb-2 font-semibold text-gray-900">Tidak ada data penilaian</div>
          <div className="text-sm text-gray-600">Silakan hubungi administrator untuk informasi lebih lanjut.</div>
        </div>
      </div>
    );
  }

  // Don't render main content if still loading or has error or no data
  if (loading || error || !groups || !Array.isArray(groups) || groups.length === 0 || !sections || sections.length === 0) {
    return null;
  }

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
            <div className="text-sm font-semibold text-gray-900">{assessor?.name || "User"}</div>
            <div className="text-xs text-gray-500">{assessor?.role || "Staff"}</div>
            <div className="w-24 h-2 overflow-hidden bg-gray-100 rounded-full">
              <div className="h-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-gray-500">{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {Array.isArray(groups) && groups.map((category) => {
            const isActive = activeCategory === category.id;
            const categoryLabel = typeof category.label === 'string' ? category.label : String(category.label || 'Category');
            const categoryDesc = typeof category.description === 'string' ? category.description : String(category.description || '');
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
                    {categoryLabel.charAt(0)}
                  </div>
                  {isActive && (
                    <span className="text-xs font-semibold text-emerald-600">Aktif</span>
                  )}
                </div>
                <div className="mt-2 text-sm font-semibold text-gray-900">{categoryLabel}</div>
                <div className="text-xs text-gray-500">{categoryDesc}</div>
              </button>
            );
          })}
        </div>

        {/* Target card list under group selection */}
        {activeGroup && activeGroup.targets && activeGroup.targets.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 text-sm font-semibold text-gray-900">Pilih orang untuk dinilai di {activeGroup.label}</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {activeGroup.targets.map((t) => {
                const selected = t.id === activeTarget?.id;
                const targetName = typeof t.name === 'string' ? t.name : String(t.name || '-');
                const targetRole = typeof t.role === 'string' ? t.role : String(t.role || '-');
                const isCompleted = t.isCompleted || false;
                // Derive local answered count for this target (immediate UI feedback)
                const localAnswered = Object.keys(answers).filter((k) => {
                  const parts = k.split(':');
                  return parts[1] && String(parts[1]) === String(t.id);
                }).length;
                const answeredCount = Math.max(t.answeredQuestions || 0, localAnswered);
                const totalCount = t.totalQuestions || 0;
                const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
                
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTargetByCategory((prev) => ({ ...prev, [activeCategory]: t.id }))}
                    className={`text-left border rounded-xl p-4 transition shadow-sm flex flex-col gap-2
                      ${selected ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200 hover:border-emerald-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        selected ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"
                      }`}>{targetName.charAt(0)}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{targetName}</div>
                        <div className="text-xs text-gray-500">{targetRole}</div>
                      </div>
                      {selected && <span className="text-xs font-semibold text-emerald-600">Dipilih</span>}
                    </div>
                    
                    {/* Status & Progress */}
                    <div className="flex items-center justify-between">
                      {isCompleted ? (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Sudah Dinilai
                        </span>
                      ) : answeredCount > 0 ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-700">
                          Dalam Proses ({answeredCount}/{totalCount})
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-md">
                          Belum Dinilai
                        </span>
                      )}
                      
                      {!isCompleted && totalCount > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${progressPercent}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-500">{progressPercent}%</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        {activeTarget && activeGroup && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full bg-emerald-600">
                {activeTarget?.name?.charAt(0) || "-"}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{String(activeTarget?.name || '-')}</div>
                <div className="text-xs text-gray-500">{String(activeTarget?.role || '-')}</div>
              </div>
              <div className="ml-auto text-xs text-gray-500">{`${activeGroup.targets.findIndex((t) => t.id === activeTarget?.id) + 1} dari ${activeGroup.targets.length}`}</div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {sections.map((section) => {
                const active = activeSection === section.id;
                const sectionTitle = typeof section.title === 'string' ? section.title : String(section.title || 'Section');
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-2 rounded-md border text-xs font-semibold transition ${
                      active ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-200"
                    }`}
                  >
                    {sectionTitle}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        {activeTarget && activeGroup && (
          <>
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
                ${saving ? "bg-amber-300 text-white cursor-wait" : (!isLastSection ? (isSectionComplete(activeSection) ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-300 text-white cursor-not-allowed")
                : (isTargetComplete() ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-amber-300 text-white cursor-not-allowed"))}`}
              disabled={saving}
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
        </div>          </>
        )}      </div>
    </div>
  );
}
