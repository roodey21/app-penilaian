"use client";
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SurveyApi from '../services/surveyApi';

export default function useAssessmentForm({ periodId, type, targetId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(null);
  const [target, setTarget] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // key: questionId -> score
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const p = periodId ? null : await SurveyApi.getActivePeriod();
        const pid = periodId || p?.id || p?.period_id || null;
        // Backend provides questions grouped by pillars
        const [targets, pillars] = await Promise.all([
          SurveyApi.getAssessmentTargets(p?.month, p?.year),
          SurveyApi.getQuestions(),
        ]);
        const t = Array.isArray(targets)
          ? targets.find((x) => (x.target_employee?.id === Number(targetId))) || null
          : null;
        // Flatten questions from pillars
        const q = Array.isArray(pillars)
          ? pillars.flatMap((pl) => (Array.isArray(pl.questions) ? pl.questions.map((qq) => ({
              ...qq,
              section: pl.title || pl.key || 'General',
            })) : []))
          : [];
        if (!mounted) return;
        setPeriod(p || { id: pid });
        setTarget(t);
        setQuestions(q);
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        setError(e);
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [periodId, type, targetId]);

  const sections = useMemo(() => {
    // group questions by section/category label
    const groups = {};
    for (const q of questions) {
      const key = q.section || q.category || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    }
    return Object.keys(groups).map((label) => ({ label, items: groups[label] }));
  }, [questions]);

  const progressPercent = useMemo(() => {
    const total = questions.length || 0;
    if (!total) return 0;
    const answered = Object.keys(answers).length;
    return Math.round((answered / total) * 100);
  }, [questions, answers]);

  const setAnswer = useCallback((questionId, score) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  }, []);

  const nextSection = useCallback(() => {
    setActiveSectionIdx((idx) => Math.min(idx + 1, Math.max(sections.length - 1, 0)));
  }, [sections.length]);
  const prevSection = useCallback(() => {
    setActiveSectionIdx((idx) => Math.max(idx - 1, 0));
  }, []);

  const submit = useCallback(async () => {
    const payload = {
      target_user_id: target?.target_employee?.id || target?.id || Number(targetId),
      period_month: period?.month,
      period_year: period?.year,
      role: target?.role || type,
      answers: Object.entries(answers).map(([question_id, score]) => ({ question_id: Number(question_id), score })),
    };
    await SurveyApi.submitAnswers(payload);
    router.back();
  }, [period, type, target, targetId, answers, router]);

  return {
    loading,
    error,
    period,
    target,
    sections,
    activeSectionIdx,
    setActiveSectionIdx,
    answers,
    setAnswer,
    nextSection,
    prevSection,
    progressPercent,
    submit,
  };
}