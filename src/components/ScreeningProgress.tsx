import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { ScreeningProgressState, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface ScreeningProgressProps {
  progress: ScreeningProgressState;
  language: Language;
}

export const ScreeningProgress: React.FC<ScreeningProgressProps> = ({ progress, language }) => {
  const t = getTranslation(language);

  if (!progress.isScreening && progress.percentage === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 mb-6 overflow-hidden relative">
      {/* Background gradient decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {progress.isScreening ? (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {progress.isScreening ? t.screeningInProgress : t.screeningFinished}
            </h4>
            <p className="text-xs text-slate-500">{progress.statusMessage}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-indigo-600">{progress.percentage}%</span>
          <p className="text-[11px] text-slate-400">
            {progress.currentStep} / {progress.totalResumes}
          </p>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(2, progress.percentage))}%` }}
        />
      </div>
    </div>
  );
};
