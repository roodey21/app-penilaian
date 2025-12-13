import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { scoreScale } from '../../utils/dummyAssessmentData';

export default function QuestionSection({ category, questions, answers, onAnswer, onPrev, onNext }) {
  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-3">
        <Button variant={category === 'leadership' ? 'primary' : 'outline'} onClick={() => onPrev('leadership')}>Leadership & Initiative</Button>
        <Button variant={category === 'teamwork' ? 'primary' : 'outline'} onClick={() => onPrev('teamwork')}>Teamwork & Collaboration</Button>
        <Button variant={category === 'service' ? 'primary' : 'outline'} onClick={() => onPrev('service')}>Service Excellence</Button>
        <Button variant={category === 'professional' ? 'primary' : 'outline'} onClick={() => onPrev('professional')}>Professional Development</Button>
      </div>
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Leadership & Initiative</h2>
        <p className="text-sm text-gray-500 mb-4">Berikan penilaian dengan skala 1-10 untuk setiap aspek</p>
        <div className="space-y-5">
          {questions.map(q => (
            <div key={q.id}>
              <p className="mb-2">{q.text}</p>
              <div className="flex flex-wrap gap-2">
                {scoreScale.map(score => (
                  <Button
                    key={score}
                    variant={(answers[q.id] || 0) === score ? 'primary' : 'outline'}
                    onClick={() => onAnswer(q.id, score)}
                  >
                    {score}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrev}>Sebelumnya</Button>
          <Button variant="primary" onClick={onNext}>Selanjutnya</Button>
        </div>
        <div className="mt-4 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
          Tips: Berikan penilaian yang objektif dan jujur. Skor 1-6 = Detractor. 7-8 = Passive. 9-10 = Promoter.
        </div>
      </Card>
    </div>
  );
}
