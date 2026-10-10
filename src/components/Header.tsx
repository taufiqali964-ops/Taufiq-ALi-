import React from 'react';
import { FileSpreadsheet, Sparkles, Languages, RotateCcw, FolderDown, LogOut, UserCheck } from 'lucide-react';
import { AuthUser, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadDemo: () => void;
  onClearAll: () => void;
  onOpenExcelImport: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onLoadDemo,
  onClearAll,
  onOpenExcelImport,
  currentUser,
  onLogout,
}) => {
  const t = getTranslation(language);
  const isUrdu = language === 'ur';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-sans">
                {isUrdu ? 'توفیق علی ایچ آر ایم ایس اے ٹی ایس سکریننگ' : 'Taufiq Ali HRMS ATS Screening'}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                {isUrdu ? 'توفیق علی ایچ آر ایم ایس' : 'Taufiq Ali HRMS'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block max-w-xl truncate">
              {isUrdu
                ? 'خودکار ریزیومے اسکریننگ، ایج و سٹی کیلکولیشن، شارٹ لسٹنگ اور ایکسل رپورٹ'
                : 'Automated Resume Screening, Age & City Extraction, Shortlisting & Excel Reports'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Load Sample Demo */}
          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors border border-indigo-200/60"
            title="Load 15 sample resumes with prefilled criteria"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.loadDemo}</span>
          </button>

          {/* Upload Excel Summary */}
          <button
            onClick={onOpenExcelImport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200/60"
            title="Import an existing Excel summary (.xlsx)"
          >
            <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.uploadExcel}</span>
          </button>

          {/* Clear All */}
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title={t.clearAll}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.clearAll}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => onLanguageChange('ur')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                isUrdu
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                !isUrdu
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              English
            </button>
          </div>

          {/* Logged in User & Logout */}
          {currentUser && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/70 text-indigo-800 text-xs font-semibold"
                title={`Logged in via mobile: ${currentUser.mobileNumber}`}
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-mono text-[11px]">{currentUser.mobileNumber}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-colors border border-rose-200/60"
                title={isUrdu ? 'لاگ آؤٹ کریں' : 'Logout from portal'}
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>{isUrdu ? 'لاگ آؤٹ' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
