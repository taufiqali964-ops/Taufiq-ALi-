import React, { useState } from 'react';
import { Briefcase, GraduationCap, Clock, Award, FileText, X, Plus, Sparkles } from 'lucide-react';
import { JobCriteria, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { sampleJobTemplates } from '../utils/sampleData';
import { JobAdUploader } from './JobAdUploader';

interface JobCriteriaFormProps {
  criteria: JobCriteria;
  onChange: (criteria: JobCriteria) => void;
  language: Language;
  onNavigateToUploadResumes?: () => void;
}

export const JobCriteriaForm: React.FC<JobCriteriaFormProps> = ({
  criteria,
  onChange,
  language,
  onNavigateToUploadResumes,
}) => {
  const t = getTranslation(language);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    const currentList = criteria.keyRequirements || criteria.requiredSkills || [];
    if (trimmed && !currentList.includes(trimmed)) {
      const updated = [...currentList, trimmed];
      onChange({
        ...criteria,
        keyRequirements: updated,
        requiredSkills: updated,
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentList = criteria.keyRequirements || criteria.requiredSkills || [];
    const updated = currentList.filter((s) => s !== skillToRemove);
    onChange({
      ...criteria,
      keyRequirements: updated,
      requiredSkills: updated,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const applyTemplate = (key: string) => {
    const tpl = sampleJobTemplates[key];
    if (tpl) {
      onChange({ ...tpl });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-6">
      {/* Header & Quick Templates */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">
              1
            </span>
            {t.step1Title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.step1Subtitle}</p>
        </div>

        {/* Quick Templates Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {t.templatesTitle}
          </span>
          <button
            type="button"
            onClick={() => applyTemplate('softwareEngineer')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors"
          >
            {t.templateDev}
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('salesMarketing')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors"
          >
            {t.templateSales}
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('accountant')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors"
          >
            {t.templateAccountant}
          </button>
        </div>
      </div>

      {/* Quick Upload Job Ad Flyer / Document Section */}
      <JobAdUploader
        currentCriteria={criteria}
        onApplyCriteria={onChange}
        language={language}
        onNavigateToUploadResumes={onNavigateToUploadResumes}
      />

      <div className="space-y-4">
        {/* Row 1: Job Title & Shortlist Target */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              {t.jobTitleLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={criteria.jobTitle}
              onChange={(e) => onChange({ ...criteria, jobTitle: e.target.value })}
              placeholder={t.jobTitlePlaceholder}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              {t.shortlistCountLabel}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[10, 15, 20].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onChange({ ...criteria, shortlistLimit: count })}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    criteria.shortlistLimit === count
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Top {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Education & Experience Min/Max */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              {t.educationLabel}
            </label>
            <input
              type="text"
              value={criteria.educationRequirements}
              onChange={(e) => onChange({ ...criteria, educationRequirements: e.target.value })}
              placeholder={t.educationPlaceholder}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {t.experienceMinLabel}
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={criteria.experienceMin}
                onChange={(e) => onChange({ ...criteria, experienceMin: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.experienceMaxLabel}
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={criteria.experienceMax}
                onChange={(e) => onChange({ ...criteria, experienceMax: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Key Requirements (replacing Key Required Skills) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              {t.skillsLabel}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              {(criteria.keyRequirements || criteria.requiredSkills || []).length} requirements added
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.skillsPlaceholder}
              className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.addSkillBtn}
            </button>
          </div>

          {/* Render Active Key Requirements Tags */}
          {(criteria.keyRequirements || criteria.requiredSkills || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {(criteria.keyRequirements || criteria.requiredSkills || []).map((req) => (
                <span
                  key={req}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(req)}
                    className="hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Row 4: Key Responsibilities (Replaces Full Job Description) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              {t.responsibilitiesLabel}
            </span>
            <span className="text-[11px] text-slate-400">Core duties & expectations</span>
          </label>
          <textarea
            rows={3}
            value={criteria.keyResponsibilities || criteria.jobDescription || ''}
            onChange={(e) =>
              onChange({
                ...criteria,
                keyResponsibilities: e.target.value,
                jobDescription: e.target.value,
              })
            }
            placeholder={t.responsibilitiesPlaceholder}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
