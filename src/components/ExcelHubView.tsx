import React from 'react';
import { FileSpreadsheet, Download, Upload, CheckCircle2, Award, Users } from 'lucide-react';
import { JobCriteria, ScreeningResult } from '../types';
import { exportScreeningToExcel } from '../utils/excelHelper';

interface ExcelHubViewProps {
  jobCriteria: JobCriteria;
  results: ScreeningResult[];
  onOpenImportModal: () => void;
  onNavigateToRecruitment: () => void;
}

export const ExcelHubView: React.FC<ExcelHubViewProps> = ({
  jobCriteria,
  results,
  onOpenImportModal,
  onNavigateToRecruitment,
}) => {
  const shortlisted = results.filter((c) => c.isShortlisted);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Excel Export & Data Hub
            </h2>
            <p className="text-xs text-slate-500">
              Download comprehensive .xlsx candidate evaluation spreadsheets or re-import existing records.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToRecruitment}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          Back to Recruitment
        </button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Top Shortlist Download */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 inline-block mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Top Shortlist Excel (.xlsx)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Export only the Top {jobCriteria.shortlistLimit} shortlisted candidates with contact details, match scores, and KPI ratings.
            </p>
            <div className="text-xs font-semibold text-indigo-600 mb-4">
              {shortlisted.length} Candidates Qualified
            </div>
          </div>

          <button
            type="button"
            onClick={() => exportScreeningToExcel(results, jobCriteria, jobCriteria.shortlistLimit, true)}
            disabled={results.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs disabled:opacity-40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Top Shortlist</span>
          </button>
        </div>

        {/* Card 2: Full Multi-Sheet Database */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 inline-block mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Complete Multi-Sheet Workbook (.xlsx)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Full workbook containing: Top Shortlist, All Candidates Pool, and Position Criteria & KPI Definitions.
            </p>
            <div className="text-xs font-semibold text-emerald-700 mb-4">
              {results.length} Total Screened Candidates
            </div>
          </div>

          <button
            type="button"
            onClick={() => exportScreeningToExcel(results, jobCriteria, jobCriteria.shortlistLimit, false)}
            disabled={results.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete Workbook</span>
          </button>
        </div>

        {/* Card 3: Upload Excel Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 inline-block mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Upload Excel Summary File
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Upload an existing .xlsx or .csv summary spreadsheet to restore previously screened candidates and review rankings.
            </p>
            <div className="text-xs font-semibold text-amber-700 mb-4">
              Supports .xlsx and .csv files
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenImportModal}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Spreadsheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
