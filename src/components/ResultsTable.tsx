import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Star,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Copy,
  Check,
  Award,
  Users,
  Percent,
  Sparkles,
} from 'lucide-react';
import { ScreeningResult, JobCriteria, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { exportScreeningToExcel } from '../utils/excelHelper';

interface ResultsTableProps {
  results: ScreeningResult[];
  jobCriteria: JobCriteria;
  onToggleShortlist: (id: string) => void;
  onViewCandidate: (candidate: ScreeningResult) => void;
  language: Language;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  jobCriteria,
  onToggleShortlist,
  onViewCandidate,
  language,
}) => {
  const t = getTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'shortlisted' | 'strong'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (results.length === 0) return null;

  // Filter & Search
  const filtered = results.filter((candidate) => {
    // Mode filter
    if (filterMode === 'shortlisted' && !candidate.isShortlisted) return false;
    if (filterMode === 'strong' && candidate.recommendation !== 'Strong Match') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = candidate.candidateName.toLowerCase().includes(q);
      const emailMatch = candidate.email.toLowerCase().includes(q);
      const cityMatch = candidate.city?.toLowerCase().includes(q);
      const orgMatch = candidate.lastOrganization?.toLowerCase().includes(q);
      const skillMatch = candidate.matchedSkills.some((s) => s.toLowerCase().includes(q));
      const eduMatch = candidate.educationStatus.toLowerCase().includes(q);
      return nameMatch || emailMatch || cityMatch || orgMatch || skillMatch || eduMatch;
    }

    return true;
  });

  // Calculate Metrics
  const totalCount = results.length;
  const shortlistedCount = results.filter((c) => c.isShortlisted).length;
  const strongMatchesCount = results.filter((c) => c.recommendation === 'Strong Match').length;
  const avgScore = Math.round(results.reduce((acc, c) => acc + c.overallScore, 0) / totalCount);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getStatusBadge = (rec: string) => {
    if (rec === 'Strong Match') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Strong Match
        </span>
      );
    }
    if (rec === 'Potential Match') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Potential
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
        <XCircle className="w-3 h-3 text-rose-600" />
        Low Match
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">
              3
            </span>
            {t.step3Title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.step3Subtitle}</p>
        </div>

        {/* Excel Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => exportScreeningToExcel(results, jobCriteria, jobCriteria.shortlistLimit, true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shadow-2xs"
            title="Download Excel file of shortlisted candidates"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadExcelShortlistOnly}</span>
          </button>

          <button
            type="button"
            onClick={() => exportScreeningToExcel(results, jobCriteria, jobCriteria.shortlistLimit, false)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            title="Download full multi-sheet Excel file"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t.downloadExcel}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">{t.totalScreened}</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-xs font-semibold">{t.shortlistedCount} (Top {jobCriteria.shortlistLimit})</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-900">{shortlistedCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-semibold">{t.strongMatches}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900">{strongMatchesCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-semibold">{t.avgScore}</span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900">{avgScore}%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg flex-1 sm:flex-none transition-all ${
              filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t.filterAll} ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('shortlisted')}
            className={`px-3 py-1.5 rounded-lg flex-1 sm:flex-none transition-all ${
              filterMode === 'shortlisted' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            ⭐ {t.filterShortlistedOnly} ({shortlistedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('strong')}
            className={`px-3 py-1.5 rounded-lg flex-1 sm:flex-none transition-all ${
              filterMode === 'strong' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            {t.filterStrongOnly} ({strongMatchesCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Candidates Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/90 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-3 w-16 text-center">{t.tableRank}</th>
              <th className="py-3 px-3">{t.tableCandidate}</th>
              <th className="py-3 px-3">Last Organization</th>
              <th className="py-3 px-3 text-center">{language === 'ur' ? 'کنسٹرکشن تجربہ' : 'Construction Exp'}</th>
              <th className="py-3 px-3 w-24 text-center">{t.tableScore}</th>
              <th className="py-3 px-3 text-center">Interview Recommendation</th>
              <th className="py-3 px-3">{t.tableExperience}</th>
              <th className="py-3 px-3">{t.tableEducation}</th>
              <th className="py-3 px-3">{t.tableSkills}</th>
              <th className="py-3 px-3 w-20 text-center">{t.tableAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((candidate, idx) => {
              const isCopied = copiedId === candidate.id;
              const isCeoInterview = candidate.interviewStage?.includes('CEO');
              const isGmHrInterview = candidate.interviewStage?.includes('GM HR');

              return (
                <tr
                  key={candidate.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    candidate.isShortlisted ? 'bg-indigo-50/20' : ''
                  }`}
                >
                  {/* Rank & Shortlist Toggle */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleShortlist(candidate.id)}
                        className={`p-1 rounded-md transition-colors ${
                          candidate.isShortlisted
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-slate-300 hover:text-slate-400'
                        }`}
                        title={t.toggleShortlist}
                      >
                        <Star className={`w-4 h-4 ${candidate.isShortlisted ? 'fill-amber-400' : ''}`} />
                      </button>
                      <span className="font-bold text-slate-700">#{candidate.rank || idx + 1}</span>
                    </div>
                  </td>

                  {/* Candidate Name, Contact, City, Age */}
                  <td className="py-3 px-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">
                            {candidate.candidateName}
                          </span>
                          {candidate.isShortlisted && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                              Top Shortlist
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {candidate.city && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              📍 {candidate.city}
                            </span>
                          )}
                          {candidate.age && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              🎂 {candidate.age}
                            </span>
                          )}
                        </div>

                        <div className="text-slate-500 text-[11px] mt-1 flex items-center gap-2">
                          <span>{candidate.email}</span>
                          {candidate.phone && <span>• {candidate.phone}</span>}
                        </div>

                        {candidate.detailedRemarks && (
                          <div className="mt-1.5 bg-slate-50 border border-slate-200/70 rounded-md px-2 py-1 max-w-xs text-[10px] text-slate-600 line-clamp-2 leading-tight" title={candidate.detailedRemarks}>
                            <span className="font-bold text-slate-800">HR Assessment: </span>
                            {candidate.detailedRemarks}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `${candidate.candidateName} <${candidate.email}> Phone: ${candidate.phone} City: ${candidate.city} Org: ${candidate.lastOrganization}`,
                            candidate.id
                          )
                        }
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                        title="Copy contact info"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Last Organization */}
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800 block text-xs">
                      {candidate.lastOrganization || 'N/A'}
                    </span>
                  </td>

                  {/* Construction Background Experience */}
                  <td className="py-3 px-3 text-center">
                    {candidate.constructionExperience === 'Yes' || String(candidate.constructionExperience).toLowerCase().includes('yes') ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
                        🏗️ {language === 'ur' ? 'ہاں' : 'Yes'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500">
                        {language === 'ur' ? 'نہیں' : 'No'}
                      </span>
                    )}
                  </td>

                  {/* Match Score */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-full text-xs border ${getScoreColor(
                        candidate.overallScore
                      )}`}
                    >
                      {candidate.overallScore}%
                    </span>
                  </td>

                  {/* Interview Stage Recommendation */}
                  <td className="py-3 px-3 text-center">
                    {isCeoInterview ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
                        👑 CEO Final Interview
                      </span>
                    ) : isGmHrInterview ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-2xs">
                        👔 GM HR Interview
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {candidate.interviewStage || 'Technical Review'}
                      </span>
                    )}
                  </td>

                  {/* Experience */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">
                      {candidate.experienceYears} Years
                    </div>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                        candidate.experienceVerdict === 'Meets' || candidate.experienceVerdict === 'Exceeds'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {candidate.experienceVerdict} Criteria
                    </span>
                  </td>

                  {/* Education */}
                  <td className="py-3 px-3">
                    <p className="text-slate-700 line-clamp-2 max-w-[160px]" title={candidate.educationStatus}>
                      {candidate.educationStatus}
                    </p>
                  </td>

                  {/* Skills */}
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {candidate.matchedSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.matchedSkills.length > 3 && (
                        <span className="text-[10px] text-slate-400">
                          +{candidate.matchedSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onViewCandidate(candidate)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      title={t.viewDetails}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.tableAction}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
