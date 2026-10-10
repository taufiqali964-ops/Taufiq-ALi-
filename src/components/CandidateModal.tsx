import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Clock,
  Award,
  FileText,
  Mail,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { ScreeningResult, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface CandidateModalProps {
  candidate: ScreeningResult | null;
  onClose: () => void;
  onToggleShortlist: (id: string) => void;
  language: Language;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  onClose,
  onToggleShortlist,
  language,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'cvText'>('scorecard');

  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-md shadow-indigo-600/20">
              #{candidate.rank || 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{candidate.candidateName}</h3>
                <button
                  type="button"
                  onClick={() => onToggleShortlist(candidate.id)}
                  className={`p-1 rounded-lg transition-colors ${
                    candidate.isShortlisted ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                  }`}
                  title={t.toggleShortlist}
                >
                  <Star className={`w-5 h-5 ${candidate.isShortlisted ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.email}
                </span>
                {candidate.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.phone}
                  </span>
                )}
                {candidate.city && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    📍 {candidate.city}
                  </span>
                )}
                {candidate.age && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    🎂 {candidate.age}
                  </span>
                )}
                {candidate.lastOrganization && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    🏢 {candidate.lastOrganization}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                candidate.overallScore >= 75
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : candidate.overallScore >= 55
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {candidate.overallScore}% Match
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'scorecard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.modalTitle}
          </button>
          <button
            onClick={() => setActiveTab('cvText')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'cvText'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.modalOriginalCV}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {activeTab === 'scorecard' ? (
            <>
              {/* Interview Stage Recommendation Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  candidate.interviewStage?.includes('CEO')
                    ? 'bg-purple-50 border-purple-200 text-purple-900'
                    : candidate.interviewStage?.includes('GM HR')
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                    Interview Next Stage Recommendation
                  </span>
                  <h4 className="text-sm font-black mt-0.5">
                    {candidate.interviewStage || 'Recommended for GM HR Interview'}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white shadow-2xs border border-current">
                  Priority Shortlist
                </span>
              </div>

              {/* Detailed HR Remarks */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Detailed HR Remarks & Experience Justification:
                </span>
                <p className="text-slate-800 text-xs leading-relaxed font-medium">
                  {candidate.detailedRemarks || candidate.oneLineVerdict}
                </p>
              </div>

              {/* Education & Experience Verifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    {t.modalEducationVerdict}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{candidate.educationStatus}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    {t.modalExpVerdict}
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Estimated {candidate.experienceYears} Years ({candidate.experienceVerdict} Criteria)
                  </p>
                </div>
              </div>

              {/* KPI Performance Section */}
              {candidate.kpis && candidate.kpis.length > 0 && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <Award className="w-4 h-4 text-indigo-600" />
                      Key Performance Indicators (KPIs) Evaluation
                    </span>
                    <span className="font-black text-indigo-700 text-xs">
                      Overall KPI: {candidate.overallKpiScore || candidate.overallScore}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    {candidate.kpis.map((k, idx) => (
                      <div
                        key={k.kpiId || idx}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800">{k.kpiTitle}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                k.score >= 80
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : k.score >= 60
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {k.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{k.evidence}</p>
                        </div>
                        <div className="font-black text-xs text-indigo-600 sm:text-right shrink-0">
                          {k.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills breakdown */}
              <div className="space-y-3">
                <div>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    {t.modalMatchedSkills} ({candidate.matchedSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {candidate.matchedSkills.length === 0 && (
                      <span className="text-slate-400 italic">None matched</span>
                    )}
                  </div>
                </div>

                {candidate.missingSkills.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      {t.modalMissingSkills} ({candidate.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-medium"
                        >
                          ✗ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Construction Background & Organization Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                    🏢 Last Organization & City
                  </span>
                  <p className="text-slate-800 leading-relaxed font-bold">
                    {candidate.lastOrganization || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>📍 City: <strong className="text-slate-800">{candidate.city || 'N/A'}</strong></span>
                    <span>•</span>
                    <span>🎂 Age: <strong className="text-slate-800">{candidate.age || 'N/A'}</strong></span>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                    🏗️ Construction Background Experience
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        candidate.constructionExperience === 'Yes' || String(candidate.constructionExperience).toLowerCase().includes('yes')
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {candidate.constructionExperience === 'Yes' || String(candidate.constructionExperience).toLowerCase().includes('yes')
                        ? 'Yes (Construction Background)'
                        : 'No'}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Civil/Contractor/Site Experience
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-slate-800 max-h-96 overflow-y-auto">
              {candidate.rawResumeText || 'No raw resume text available.'}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={() => onToggleShortlist(candidate.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              candidate.isShortlisted
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${candidate.isShortlisted ? 'fill-amber-400' : ''}`} />
            <span>{candidate.isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            {t.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
};
