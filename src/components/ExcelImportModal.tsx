import React, { useState, useRef } from 'react';
import { X, FileSpreadsheet, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScreeningResult, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { importScreeningFromExcel } from '../utils/excelHelper';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (candidates: ScreeningResult[]) => void;
  language: Language;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  language,
}) => {
  const t = getTranslation(language);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleProcessImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const candidates = await importScreeningFromExcel(file);
      onImportSuccess(candidates);
      onClose();
    } catch (err: any) {
      console.error('Failed to import Excel:', err);
      setError(err?.message || 'Could not parse candidates from this Excel file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.excelImportTitle}</h3>
              <p className="text-[11px] text-slate-500">{t.excelImportSub}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              {file ? file.name : t.excelImportButton}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Supports .xlsx and .csv files</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {t.closeModal}
          </button>
          <button
            type="button"
            onClick={handleProcessImport}
            disabled={!file || loading}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 shadow-xs"
          >
            {loading ? 'Processing...' : 'Upload & View Candidates'}
          </button>
        </div>
      </div>
    </div>
  );
};
