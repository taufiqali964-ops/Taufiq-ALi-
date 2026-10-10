/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  JobCriteria,
  CandidateResume,
  ScreeningResult,
  ScreeningProgressState,
  Language,
  NavigationPage,
  AuthUser,
} from './types';
import { sampleJobTemplates, sampleResumes } from './utils/sampleData';
import { screenCandidatesInBatches } from './utils/screeningEngine';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { JobCriteriaForm } from './components/JobCriteriaForm';
import { ResumeUploader } from './components/ResumeUploader';
import { ScreeningProgress } from './components/ScreeningProgress';
import { ResultsTable } from './components/ResultsTable';
import { CandidateModal } from './components/CandidateModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { ApplicationFormView } from './components/ApplicationFormView';
import { KPIMatrixView } from './components/KPIMatrixView';
import { ExcelHubView } from './components/ExcelHubView';

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('taufiq_hrms_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentPage, setCurrentPage] = useState<NavigationPage>('recruitment');
  const [language, setLanguage] = useState<Language>('ur');
  const [jobCriteria, setJobCriteria] = useState<JobCriteria>(sampleJobTemplates.softwareEngineer);
  const [resumes, setResumes] = useState<CandidateResume[]>(sampleResumes);
  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [progress, setProgress] = useState<ScreeningProgressState>({
    isScreening: false,
    currentStep: 0,
    totalResumes: 0,
    statusMessage: '',
    percentage: 0,
  });
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningResult | null>(null);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState<boolean>(false);

  // Start Screening
  const handleStartScreening = async () => {
    if (resumes.length === 0 || isScreening) return;
    setIsScreening(true);

    try {
      const evaluated = await screenCandidatesInBatches(resumes, jobCriteria, (pState) => {
        setProgress(pState);
      });
      setResults(evaluated);
    } catch (err) {
      console.error('Screening process error:', err);
    } finally {
      setIsScreening(false);
    }
  };

  // Toggle Shortlist status manually
  const handleToggleShortlist = (id: string) => {
    setResults((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isShortlisted: !c.isShortlisted } : c))
    );
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate((prev) => (prev ? { ...prev, isShortlisted: !prev.isShortlisted } : null));
    }
  };

  // Add Candidate from Application Form directly to screened pool
  const handleAddCandidateToScreening = (newCandidate: ScreeningResult) => {
    setResults((prev) => {
      const updated = [newCandidate, ...prev];
      updated.sort((a, b) => b.overallScore - a.overallScore);
      return updated.map((c, idx) => ({ ...c, rank: idx + 1 }));
    });
  };

  // Load Demo Data
  const handleLoadDemo = () => {
    setJobCriteria({ ...sampleJobTemplates.softwareEngineer });
    setResumes([...sampleResumes]);
    setResults([]);
  };

  // Clear all data
  const handleClearAll = () => {
    setJobCriteria({
      jobTitle: 'Senior Full Stack Developer (React & Node.js)',
      educationRequirements: 'Bachelors in Computer Science (BSCS)',
      experienceMin: 0,
      experienceMax: 5,
      keyRequirements: [],
      keyResponsibilities: '',
      requiredSkills: [],
      jobDescription: '',
      shortlistLimit: 10,
      kpis: [],
    });
    setResumes([]);
    setResults([]);
    setProgress({
      isScreening: false,
      currentStep: 0,
      totalResumes: 0,
      statusMessage: '',
      percentage: 0,
    });
  };

  // Import from Excel
  const handleImportSuccess = (imported: ScreeningResult[]) => {
    setResults(imported);
    const shortlistedCount = imported.filter((c) => c.isShortlisted).length;
    if (shortlistedCount > 0) {
      setJobCriteria((prev) => ({
        ...prev,
        shortlistLimit: shortlistedCount <= 10 ? 10 : shortlistedCount <= 15 ? 15 : 20,
      }));
    }
    setCurrentPage('recruitment');
  };

  const shortlistCount = results.filter((c) => c.isShortlisted).length;

  // Protect app with Login Gateway
  if (!authUser) {
    return (
      <LoginPage
        onLoginSuccess={setAuthUser}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans flex flex-col">
      {/* Top Main Navigation Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onLoadDemo={handleLoadDemo}
        onClearAll={handleClearAll}
        onOpenExcelImport={() => setIsExcelImportOpen(true)}
        currentUser={authUser}
        onLogout={() => {
          try {
            localStorage.removeItem('taufiq_hrms_auth');
          } catch (err) {
            console.warn(err);
          }
          setAuthUser(null);
        }}
      />

      {/* Main Layout Container with Sidebar Button Bar on the side */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation with "Recruitment" Button Bar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          candidateCount={results.length > 0 ? results.length : resumes.length}
          shortlistCount={shortlistCount}
        />

        {/* Dynamic Page Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 min-w-0">
          {currentPage === 'recruitment' && (
            <div className="space-y-6">
              {/* Step 1: Job Description & Position Criteria (Title preserved) */}
              <JobCriteriaForm
                criteria={jobCriteria}
                onChange={setJobCriteria}
                language={language}
                onNavigateToUploadResumes={() => {
                  document.getElementById('step-2-upload-resumes')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Step 2: Upload Resumes / CVs (100, 150, 200+ CVs support) */}
              <ResumeUploader
                resumes={resumes}
                onResumesChange={setResumes}
                onStartScreening={handleStartScreening}
                isScreening={isScreening}
                language={language}
                jobCriteria={jobCriteria}
              />

              {/* Screening Progress Bar */}
              <ScreeningProgress progress={progress} language={language} />

              {/* Step 3: Candidate Screening Results & Shortlisting */}
              <ResultsTable
                results={results}
                jobCriteria={jobCriteria}
                onToggleShortlist={handleToggleShortlist}
                onViewCandidate={setSelectedCandidate}
                language={language}
              />
            </div>
          )}

          {currentPage === 'application-form' && (
            <ApplicationFormView
              jobCriteria={jobCriteria}
              onUpdateCriteria={setJobCriteria}
              onAddCandidateToScreening={handleAddCandidateToScreening}
              onNavigateToRecruitment={() => setCurrentPage('recruitment')}
            />
          )}

          {currentPage === 'kpis' && (
            <KPIMatrixView
              jobCriteria={jobCriteria}
              results={results}
              onNavigateToRecruitment={() => setCurrentPage('recruitment')}
            />
          )}

          {currentPage === 'excel-hub' && (
            <ExcelHubView
              jobCriteria={jobCriteria}
              results={results}
              onOpenImportModal={() => setIsExcelImportOpen(true)}
              onNavigateToRecruitment={() => setCurrentPage('recruitment')}
            />
          )}
        </main>
      </div>

      {/* Candidate Scorecard Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onToggleShortlist={handleToggleShortlist}
        language={language}
      />

      {/* Excel Upload Modal */}
      <ExcelImportModal
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
        onImportSuccess={handleImportSuccess}
        language={language}
      />
    </div>
  );
}
