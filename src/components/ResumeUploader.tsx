import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, Sparkles, AlertCircle, Play, FileImage } from 'lucide-react';
import { CandidateResume, Language, JobCriteria } from '../types';
import { getTranslation } from '../utils/translations';
import { extractTextFromFile, parsePastedBatch } from '../utils/fileParser';
import { sampleResumes } from '../utils/sampleData';

interface ResumeUploaderProps {
  resumes: CandidateResume[];
  onResumesChange: (resumes: CandidateResume[]) => void;
  onStartScreening: () => void;
  isScreening: boolean;
  language: Language;
  jobCriteria?: JobCriteria;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  resumes,
  onResumesChange,
  onStartScreening,
  isScreening,
  language,
  jobCriteria,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessingFiles(true);

    try {
      const filesArray = Array.from(fileList);
      const parsedResumes: CandidateResume[] = [];

      for (const file of filesArray) {
        const parsed = await extractTextFromFile(file);
        parsedResumes.push(parsed);
      }

      // Append new resumes avoiding duplicate names
      const existingNames = new Set(resumes.map((r) => r.fileName));
      const filteredNew = parsedResumes.filter((r) => !existingNames.has(r.fileName));
      onResumesChange([...resumes, ...filteredNew]);
    } catch (err) {
      console.error('Error parsing files:', err);
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAddPasted = () => {
    if (!pastedText.trim()) return;
    const parsed = parsePastedBatch(pastedText);
    onResumesChange([...resumes, ...parsed]);
    setPastedText('');
  };

  const handleLoadSampleBatch = () => {
    onResumesChange([...sampleResumes]);
  };

  const handleRemoveResume = (id: string) => {
    onResumesChange(resumes.filter((r) => r.id !== id));
  };

  const handleClearAllResumes = () => {
    onResumesChange([]);
  };

  return (
    <div id="step-2-upload-resumes" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-6">
      {/* Active Job Ad context banner if available */}
      {jobCriteria?.sourceJobAd && (
        <div className="mb-4 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                {language === 'ur'
                  ? 'فعال جاب اشتہار کے مطابق اسکریننگ'
                  : 'Screening CVs Against Active Job Ad:'}
                <span className="text-emerald-700 font-normal">"{jobCriteria.jobTitle}"</span>
              </span>
              <span className="text-[11px] text-emerald-600">
                Source: {jobCriteria.sourceJobAd.fileName} • {jobCriteria.keyRequirements.length} Key Requirements • {jobCriteria.experienceMin}-{jobCriteria.experienceMax} Yrs Exp
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            {language === 'ur' ? 'اشتہار کے تقاضے فعال ہیں' : 'Job Ad Active'}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">
              2
            </span>
            {t.step2Title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.step2Subtitle}</p>
        </div>

        {/* Tab switch & Quick load button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.fileUploadTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.bulkPasteTab}
            </button>
          </div>

          <button
            type="button"
            onClick={handleLoadSampleBatch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            {t.loadDemo}
          </button>
        </div>
      </div>

      {/* Main Upload / Input Area */}
      {activeTab === 'upload' ? (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              multiple
              accept=".pdf,.docx,.doc,.txt,.json"
              className="hidden"
            />
            <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">{t.dropzoneText}</h4>
            <p className="text-xs text-slate-500 mt-1">{t.dropzoneSubtext}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200/70 text-slate-700">
                .PDF
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200/70 text-slate-700">
                .DOCX
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200/70 text-slate-700">
                .TXT
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            rows={5}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder={t.pastePlaceholder}
            className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddPasted}
              disabled={!pastedText.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-xs"
            >
              {t.addPastedBtn}
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Resumes Counter & List preview */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {resumes.length}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {resumes.length} {t.filesReady}
            </span>
          </div>

          {resumes.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllResumes}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearAll}</span>
            </button>
          )}
        </div>

        {/* Resumes Pill Chips */}
        {resumes.length > 0 && (
          <div className="max-h-36 overflow-y-auto p-2 bg-slate-50/70 rounded-xl border border-slate-200/70 flex flex-wrap gap-1.5">
            {resumes.map((resume, idx) => (
              <span
                key={resume.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-white text-slate-700 border border-slate-200 shadow-2xs group"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="max-w-[180px] truncate" title={resume.fileName}>
                  {idx + 1}. {resume.fileName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveResume(resume.id)}
                  className="text-slate-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Start Screening Launch Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>
            {resumes.length === 0
              ? 'Please upload or load resumes to begin AI evaluation'
              : `Ready to screen ${resumes.length} resumes against specified requirements`}
          </span>
        </div>

        <button
          type="button"
          onClick={onStartScreening}
          disabled={resumes.length === 0 || isScreening || isProcessingFiles}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isScreening ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.screeningInProgress}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{t.startScreeningBtn} ({resumes.length} CVs)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
