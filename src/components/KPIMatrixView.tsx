import React from 'react';
import { Award, CheckCircle2, TrendingUp, AlertTriangle, Users, Download } from 'lucide-react';
import { JobCriteria, ScreeningResult } from '../types';
import { exportScreeningToExcel } from '../utils/excelHelper';

interface KPIMatrixViewProps {
  jobCriteria: JobCriteria;
  results: ScreeningResult[];
  onNavigateToRecruitment: () => void;
}

export const KPIMatrixView: React.FC<KPIMatrixViewProps> = ({
  jobCriteria,
  results,
  onNavigateToRecruitment,
}) => {
  const kpis = jobCriteria.kpis || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Candidate KPI Performance Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Comparative analysis of applicant KPI achievements for {jobCriteria.jobTitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportScreeningToExcel(results, jobCriteria, jobCriteria.shortlistLimit, false)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export KPI Data to Excel</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToRecruitment}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Back to Recruitment
          </button>
        </div>
      </div>

      {/* KPI Cards summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          // Calculate average score for this KPI across screened candidates
          const scores = results
            .map((c) => c.kpis?.find((k) => k.kpiId === kpi.id || k.kpiTitle === kpi.title)?.score)
            .filter((s): s is number => typeof s === 'number');

          const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

          return (
            <div
              key={kpi.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                  <span>{kpi.category}</span>
                  <span className="text-indigo-600">{kpi.weightPercent}% weight</span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs mb-1">{kpi.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{kpi.targetMetric}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Candidate Avg:</span>
                <span className="text-base font-black text-indigo-600">
                  {avgScore > 0 ? `${avgScore}%` : 'N/A'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          Individual Candidate KPI Scores
        </h3>

        {results.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No candidates screened yet. Go to Recruitment and screen resumes to generate KPI performance matrix.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-14 text-center">Rank</th>
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3 text-center">Match Score</th>
                  <th className="py-3 px-3 text-center">Overall KPI</th>
                  {kpis.map((kpi) => (
                    <th key={kpi.id} className="py-3 px-3 text-center">
                      <span className="block truncate max-w-[120px]" title={kpi.title}>
                        {kpi.title}
                      </span>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((candidate, idx) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      #{candidate.rank || idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{candidate.candidateName}</div>
                      <div className="text-[11px] text-slate-400">{candidate.email}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {candidate.overallScore}%
                    </td>
                    <td className="py-3 px-3 text-center font-black text-indigo-600">
                      {candidate.overallKpiScore || candidate.overallScore}%
                    </td>
                    {kpis.map((kpi) => {
                      const match = candidate.kpis?.find(
                        (k) => k.kpiId === kpi.id || k.kpiTitle === kpi.title
                      );
                      const score = match ? match.score : candidate.overallScore;
                      return (
                        <td key={kpi.id} className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              score >= 80
                                ? 'bg-emerald-50 text-emerald-700'
                                : score >= 60
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {score}%
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          candidate.isShortlisted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {candidate.isShortlisted ? 'Shortlisted' : 'Reviewed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
