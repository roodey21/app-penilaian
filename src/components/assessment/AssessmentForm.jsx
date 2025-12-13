import React from 'react';
import useAssessmentForm from '../../hooks/useAssessmentForm';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Progress from '../ui/Progress';

export default function AssessmentForm({ periodId, type, targetId, onBack }) {
  const form = useAssessmentForm({ periodId, type, targetId });

  if (form.loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-500">Memuat form penilaian…</div>
      </div>
    );
  }
  if (form.error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-red-600">Gagal memuat: {form.error.message || 'Kesalahan tidak diketahui'}</div>
      </div>
    );
  }

  const sections = form.sections;
  const active = sections[form.activeSectionIdx] || { label: 'General', items: [] };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-600">360° Best Employee Survey</div>
            <div className="text-neutral-400 text-xs">LPP Hotel & MICE Group</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-700">Progress Survey</div>
            <div className="w-40"><Progress value={form.progressPercent} /></div>
            <Button variant="secondary" onClick={onBack}>Kembali</Button>
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Target Info */}
        <div className="mb-4">
          <div className="text-lg font-medium text-neutral-800">{form.target?.name || 'Target'}</div>
          <div className="text-sm text-neutral-500">{form.target?.position?.name || ''}</div>
        </div>

        {/* Type Pills */}
        <div className="flex gap-3 mb-6">
          <Badge>{type === 'self' ? 'Penilaian Diri Sendiri' : type === 'peer' ? 'Penilaian Rekan Kerja' : 'Penilaian Atasan'}</Badge>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sections.map((s, idx) => (
            <button
              key={s.label}
              onClick={() => form.setActiveSectionIdx(idx)}
              className={`px-3 py-2 rounded-md text-sm border ${idx === form.activeSectionIdx ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-neutral-200 text-neutral-700'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Questions Card */}
        <Card>
          <div className="px-4 py-4">
            <div className="text-neutral-800 font-semibold mb-2">{active.label}</div>
            <div className="text-sm text-neutral-500 mb-4">Berikan penilaian dengan skala 1–10 untuk setiap aspek</div>

            <div className="space-y-6">
              {active.items.map((q) => (
                <div key={q.id} className="">
                  <div className="text-neutral-800 mb-2">{q.text || q.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const score = i + 1;
                      const selected = form.answers[q.id] === score;
                      return (
                        <button
                          key={score}
                          onClick={() => form.setAnswer(q.id, score)}
                          className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm ${selected ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-700'}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs text-neutral-400 mt-2">{form.answers[q.id] ? 'Terpilih' : 'Sangat Kurang'}</div>
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="secondary" onClick={form.prevSection}>Sebelumnya</Button>
              <div className="flex items-center gap-4">
                <div className="w-40"><Progress value={form.progressPercent} /></div>
                <Button onClick={form.nextSection}>Selanjutnya →</Button>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-3 rounded-md bg-amber-50 text-amber-800 text-sm">
              Tips: Berikan penilaian yang objektif dan jujur. Skor 1–6 = Detractor, 7–8 = Passive, 9–10 = Promoter.
            </div>
          </div>
        </Card>

        {/* Submit CTA */}
        <div className="flex justify-end mt-6">
          <Button onClick={form.submit}>Selesaikan</Button>
        </div>
      </main>
    </div>
  );
}
