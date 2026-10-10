import React from 'react';
import {
  Users,
  FileCheck2,
  Award,
  FileSpreadsheet,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { NavigationPage } from '../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  candidateCount: number;
  shortlistCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  candidateCount,
  shortlistCount,
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/90 shrink-0 flex flex-col justify-between py-5 px-4 shadow-2xs">
      <div>
        {/* System Branding Badge */}
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                Taufiq Ali
              </h2>
              <p className="text-[11px] font-semibold text-indigo-600">
                HRMS ATS Screening
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Button Bar */}
        <div className="space-y-1.5">
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          {/* Primary "Recruitment" Button */}
          <button
            type="button"
            onClick={() => onNavigate('recruitment')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentPage === 'recruitment'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Recruitment</span>
            </div>
            {candidateCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  currentPage === 'recruitment'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                {candidateCount}
              </span>
            )}
          </button>

          {/* "Application Form & KPIs" Button */}
          <button
            type="button"
            onClick={() => onNavigate('application-form')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentPage === 'application-form'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4" />
              <span>Application Form & KPIs</span>
            </div>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>

          {/* "KPI Performance Matrix" Button */}
          <button
            type="button"
            onClick={() => onNavigate('kpis')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentPage === 'kpis'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4" />
              <span>KPI Matrix</span>
            </div>
          </button>

          {/* "Excel Summary Hub" Button */}
          <button
            type="button"
            onClick={() => onNavigate('excel-hub')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentPage === 'excel-hub'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel Export & Hub</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="mt-6 pt-4 border-t border-slate-100 px-2">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>ATS Screening Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-500">
            {shortlistCount} Shortlisted candidates ready for export.
          </p>
        </div>
      </div>
    </aside>
  );
};
