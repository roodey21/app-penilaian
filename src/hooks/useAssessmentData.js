import { useState, useEffect, useCallback } from 'react';
import SurveyApi from '../services/surveyApi';
import session from '../utils/session';
import { normalizeTargets } from '../utils/assessmentAdapter';

export default function useAssessmentData() {
  const [currentUser, setCurrentUser] = useState(null);
  const [period, setPeriod] = useState(null);
  const [targets, setTargets] = useState([]);
  const [progress, setProgress] = useState({ percentage: 0, total: 0, completed: 0, remaining: 0, isComplete: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const s = session.getSession();
      if (s?.user) setCurrentUser(s.user);
      const p = await SurveyApi.getActivePeriod();
      setPeriod(p);
      const [rawTargets, pr] = await Promise.all([
        SurveyApi.getAssessmentTargets(p?.month, p?.year),
        SurveyApi.getAssessmentProgress(p?.month, p?.year),
      ]);
      const normalized = normalizeTargets(rawTargets || []);
      setTargets(normalized);
      const completionPerc = Math.round(pr?.completion_percentage || 0);
      const total = pr?.total_targets || normalized.length || 0;
      const completed = pr?.completed_targets || normalized.filter(t => t.is_completed).length || 0;
      setProgress({
        percentage: completionPerc,
        total,
        completed,
        remaining: Math.max(total - completed, 0),
        isComplete: completionPerc >= 100,
      });
    } catch (e) {
      setError(e?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { currentUser, period, targets, progress, loading, error, reload: fetchData };
}
