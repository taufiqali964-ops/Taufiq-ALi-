import React, { useState, useRef } from 'react';
import {
  FileImage,
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  Eye,
  Loader2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { JobCriteria, Language, UploadedJobAd } from '../types';
import { getTranslation } from '../utils/translations';

interface JobAdUploaderProps {
  currentCriteria: JobCriteria;
  onApplyCriteria: (updatedCriteria: JobCriteria) => void;
  language: Language;
  onNavigateToUploadResumes?: () => void;
}

// Sample Job Ad flyers generated as SVG data URLs for instant 1-click preview & testing
const SAMPLE_DEV_JOB_AD_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="#0f172a">
  <rect width="600" height="800" fill="#0f172a"/>
  <rect x="20" y="20" width="560" height="760" rx="16" fill="#1e293b" stroke="#334155" stroke-width="2"/>
  <rect x="20" y="20" width="560" height="120" rx="16" fill="#4338ca"/>
  <text x="300" y="70" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="bold">WE ARE HIRING!</text>
  <text x="300" y="105" text-anchor="middle" fill="#c7d2fe" font-family="system-ui, sans-serif" font-size="16">SENIOR FULL STACK DEVELOPER (REACT &amp; NODE.JS)</text>
  
  <text x="50" y="180" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">JOB OVERVIEW:</text>
  <text x="50" y="210" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="14">Looking for an experienced Senior Full Stack Engineer to lead</text>
  <text x="50" y="235" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="14">architecture, development, and scaling of mission-critical web applications.</text>
  
  <text x="50" y="285" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">ELIGIBILITY &amp; CRITERIA:</text>
  <text x="50" y="315" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="14">• Education: BSCS / Software Engineering (4-year Degree)</text>
  <text x="50" y="340" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="14">• Experience: 3 to 7 Years in Web &amp; Backend Engineering</text>
  <text x="50" y="365" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="14">• Location: Lahore / Islamabad (Hybrid)</text>

  <text x="50" y="415" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">KEY REQUIREMENTS:</text>
  <text x="50" y="445" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13">• React.js, TypeScript, Next.js, Tailwind CSS</text>
  <text x="50" y="470" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13">• Node.js, Express, REST APIs &amp; Microservices</text>
  <text x="50" y="495" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13">• PostgreSQL / MySQL Database Architecture &amp; Indexing</text>
  <text x="50" y="520" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13">• Git version control, CI/CD pipeline deployment</text>

  <text x="50" y="570" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">KEY RESPONSIBILITIES:</text>
  <text x="50" y="600" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13">• Architect scalable frontend &amp; backend systems with high throughput.</text>
  <text x="50" y="625" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13">• Conduct regular peer code reviews and enforce best engineering practices.</text>
  <text x="50" y="650" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="13">• Collaborate with product managers &amp; UI designers to hit sprint goals.</text>

  <rect x="50" y="695" width="500" height="55" rx="10" fill="#4f46e5"/>
  <text x="300" y="730" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">APPLY NOW: careers@company.com | Shortlist Target: Top 10</text>
</svg>
`)}`;

const SAMPLE_FINANCE_JOB_AD_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="#064e3b">
  <rect width="600" height="800" fill="#022c22"/>
  <rect x="20" y="20" width="560" height="760" rx="16" fill="#064e3b" stroke="#047857" stroke-width="2"/>
  <rect x="20" y="20" width="560" height="120" rx="16" fill="#047857"/>
  <text x="300" y="70" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="bold">JOB OPPORTUNITY</text>
  <text x="300" y="105" text-anchor="middle" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="16">SENIOR ACCOUNTS &amp; FINANCIAL ANALYST</text>
  
  <text x="50" y="180" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">JOB SUMMARY:</text>
  <text x="50" y="210" fill="#ecfdf5" font-family="system-ui, sans-serif" font-size="14">Seeking a seasoned Financial Analyst to manage statutory accounting,</text>
  <text x="50" y="235" fill="#ecfdf5" font-family="system-ui, sans-serif" font-size="14">financial statements, cash flow forecasting, and taxation filings.</text>
  
  <text x="50" y="285" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">MINIMUM QUALIFICATIONS:</text>
  <text x="50" y="315" fill="#f0fdf4" font-family="system-ui, sans-serif" font-size="14">• Education: ACCA / CA Inter / Masters in Commerce (M.Com/MBA Finance)</text>
  <text x="50" y="340" fill="#f0fdf4" font-family="system-ui, sans-serif" font-size="14">• Experience: 3 to 6 Years in Corporate Accounting &amp; Financial Audit</text>

  <text x="50" y="390" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">KEY REQUIREMENTS:</text>
  <text x="50" y="420" fill="#f0fdf4" font-family="system-ui, sans-serif" font-size="13">• Financial Reporting, Balance Sheet &amp; P&amp;L Statements (GAAP/IFRS)</text>
  <text x="50" y="445" fill="#f0fdf4" font-family="system-ui, sans-serif" font-size="13">• Hands-on experience with ERP systems (SAP, Oracle, or QuickBooks)</text>
  <text x="50" y="470" fill="#f0fdf4" font-family="system-ui, sans-serif" font-size="13">• Taxation, Withholding Tax, Sales Tax &amp; Corporate Annual Filing</text>
  <text x="50" y="495" fill="#f0fdf4" font-family="system-ui, sans-serif" font-size="13">• Advanced Microsoft Excel (Financial Modeling, VLOOKUP, Pivots)</text>

  <text x="50" y="545" fill="#6ee7b7" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">CORE RESPONSIBILITIES:</text>
  <text x="50" y="575" fill="#d1fae5" font-family="system-ui, sans-serif" font-size="13">• Prepare and present monthly management accounts and P&amp;L reports.</text>
  <text x="50" y="600" fill="#d1fae5" font-family="system-ui, sans-serif" font-size="13">• Manage internal &amp; external financial audits with zero non-compliances.</text>
  <text x="50" y="625" fill="#d1fae5" font-family="system-ui, sans-serif" font-size="13">• Monitor cash flow liquidity, budgeting, and overhead variance analysis.</text>

  <rect x="50" y="680" width="500" height="55" rx="10" fill="#059669"/>
  <text x="300" y="715" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">SEND RESUME: hr@financecorp.com | Target: Top 10 Shortlist</text>
</svg>
`)}`;

export const JobAdUploader: React.FC<JobAdUploaderProps> = ({
  currentCriteria,
  onApplyCriteria,
  language,
  onNavigateToUploadResumes,
}) => {
  const t = getTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [uploadedAd, setUploadedAd] = useState<UploadedJobAd | null>(
    currentCriteria.sourceJobAd || null
  );
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process a selected or dropped file
  const processJobAdFile = async (file: File) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const fileName = file.name;
      const fileSize = file.size;
      const fileType = file.type || 'application/octet-stream';
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(fileName);
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(fileName);

      let fileData: string | undefined = undefined;
      let previewUrl: string | undefined = undefined;
      let textContent: string = '';

      if (isImage) {
        // Read image as base64 data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        previewUrl = dataUrl;
        fileData = dataUrl.split(',')[1];
      } else if (isPdf) {
        // Read PDF as base64 for Gemini multimodal document parsing
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileData = dataUrl.split(',')[1];
        textContent = `Job Advertisement PDF: ${fileName} (${Math.round(fileSize / 1024)} KB)`;
      } else {
        // Read text / docx as text
        textContent = await file.text();
      }

      // Call server extraction API
      const response = await fetch('/api/extract-job-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData,
          mimeType: isImage ? (file.type || 'image/jpeg') : isPdf ? 'application/pdf' : 'text/plain',
          text: textContent,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const json = await response.json();
      const extracted = json.data;

      if (!extracted || !extracted.jobTitle) {
        throw new Error('Failed to extract structured job criteria from the advertisement.');
      }

      const adInfo: UploadedJobAd = {
        fileName,
        fileSize,
        fileType,
        previewUrl,
        rawText: textContent || `Job Ad image: ${fileName}`,
        uploadedAt: new Date().toISOString(),
        extractedTitle: extracted.jobTitle,
      };

      setUploadedAd(adInfo);

      // Construct updated JobCriteria object
      const updated: JobCriteria = {
        ...currentCriteria,
        jobTitle: extracted.jobTitle,
        educationRequirements: extracted.educationRequirements || currentCriteria.educationRequirements,
        experienceMin: typeof extracted.experienceMin === 'number' ? extracted.experienceMin : currentCriteria.experienceMin,
        experienceMax: typeof extracted.experienceMax === 'number' ? extracted.experienceMax : currentCriteria.experienceMax,
        keyRequirements: extracted.keyRequirements || currentCriteria.keyRequirements,
        keyResponsibilities: extracted.keyResponsibilities || currentCriteria.keyResponsibilities,
        requiredSkills: extracted.keyRequirements || currentCriteria.requiredSkills,
        jobDescription: extracted.keyResponsibilities || currentCriteria.jobDescription,
        shortlistLimit: extracted.shortlistLimit || currentCriteria.shortlistLimit || 10,
        kpis: Array.isArray(extracted.kpis) && extracted.kpis.length > 0 ? extracted.kpis : currentCriteria.kpis,
        sourceJobAd: adInfo,
      };

      onApplyCriteria(updated);
      setSuccessInfo(
        language === 'ur'
          ? `اشتہار "${extracted.jobTitle}" کامیابی سے اخذ کر لیا گیا! اب سی ویز اس اشتہار کے مطابق شارٹ لسٹ ہوں گی۔`
          : `Job Ad "${extracted.jobTitle}" parsed successfully! Resumes will be shortlisted against this Ad.`
      );
    } catch (err: any) {
      console.error('Job Ad Extraction failed:', err);
      setErrorMessage(
        err?.message || (language === 'ur' ? 'اشتہار کے تجزیے میں خرابی پیش آگئی' : 'Failed to analyze Job Ad.')
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load preset sample job advertisement (Developer or Finance)
  const handleLoadSampleAd = async (sampleType: 'dev' | 'finance') => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const isDev = sampleType === 'dev';
      const sampleSvg = isDev ? SAMPLE_DEV_JOB_AD_SVG : SAMPLE_FINANCE_JOB_AD_SVG;
      const fileName = isDev ? 'Software_Engineer_Job_Ad.jpg' : 'Accounts_Financial_Analyst_Ad.jpg';

      // Sample data simulation
      const base64Data = sampleSvg.split(',')[1];

      const response = await fetch('/api/extract-job-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          mimeType: 'image/svg+xml',
          text: isDev
            ? 'Senior Full Stack Developer (React & Node.js). 3 to 7 years experience. BSCS degree. Key requirements: React, Node.js, TypeScript, PostgreSQL, REST APIs. Key responsibilities: Lead frontend and backend architecture.'
            : 'Senior Accounts & Financial Analyst. 3 to 6 years experience. ACCA / CA / MBA Finance. Key requirements: Financial Reporting, GAAP/IFRS, ERP SAP, Taxation & Audit. Key responsibilities: Monthly P&L and financial auditing.',
          fileName,
        }),
      });

      const json = await response.json();
      const extracted = json.data;

      const adInfo: UploadedJobAd = {
        fileName,
        fileSize: 48200,
        fileType: 'image/jpeg',
        previewUrl: sampleSvg,
        rawText: `Sample Job Ad flyer: ${fileName}`,
        uploadedAt: new Date().toISOString(),
        extractedTitle: extracted.jobTitle,
      };

      setUploadedAd(adInfo);

      const updated: JobCriteria = {
        ...currentCriteria,
        jobTitle: extracted.jobTitle,
        educationRequirements: extracted.educationRequirements,
        experienceMin: extracted.experienceMin,
        experienceMax: extracted.experienceMax,
        keyRequirements: extracted.keyRequirements,
        keyResponsibilities: extracted.keyResponsibilities,
        requiredSkills: extracted.keyRequirements,
        jobDescription: extracted.keyResponsibilities,
        shortlistLimit: extracted.shortlistLimit || 10,
        kpis: extracted.kpis,
        sourceJobAd: adInfo,
      };

      onApplyCriteria(updated);
      setSuccessInfo(
        language === 'ur'
          ? `نمونہ اشتہار "${extracted.jobTitle}" فعال ہو گیا! تمام تقاضے اخذ کر لیے گئے۔`
          : `Sample Job Ad "${extracted.jobTitle}" loaded! All criteria and KPIs extracted.`
      );
    } catch (err: any) {
      console.error('Sample Ad error:', err);
      setErrorMessage(err?.message || 'Failed to load sample ad.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveAd = () => {
    setUploadedAd(null);
    setSuccessInfo(null);
    setErrorMessage(null);
    const updated = { ...currentCriteria };
    delete updated.sourceJobAd;
    onApplyCriteria(updated);
  };

  return (
    <div className="mb-5">
      {/* Top Banner Button Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 p-3.5 bg-gradient-to-r from-indigo-50/90 via-sky-50/60 to-emerald-50/80 rounded-xl border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <FileImage className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {t.uploadJobAdTitle}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-indigo-100 text-indigo-700">
                AI Auto-Extract
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {t.uploadJobAdSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {uploadedAd ? (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-800 truncate max-w-[150px]">
                {uploadedAd.fileName}
              </span>
              {uploadedAd.previewUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 p-1 flex items-center"
                  title="View Job Ad flyer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleRemoveAd}
                className="text-xs text-rose-500 hover:text-rose-700 p-1"
                title={t.removeJobAd}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs ${
              isOpen
                ? 'bg-slate-800 text-white hover:bg-slate-900'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-500/20'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            {isOpen
              ? language === 'ur'
                ? 'اپلوڈر بند کریں'
                : 'Close Uploader'
              : t.uploadJobAdBtn}
          </button>
        </div>
      </div>

      {/* Expandable Dropzone & Quick Samples Section */}
      {isOpen && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-indigo-200 shadow-sm animate-in fade-in duration-200 space-y-4">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processJobAdFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf,.docx,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processJobAdFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {isAnalyzing ? (
              <div className="py-4 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-sm font-bold text-slate-800">{t.extractingJobAd}</span>
                <p className="text-xs text-slate-500">
                  {language === 'ur'
                    ? 'پوزیشن، ایجوکیشن، مطلوبہ تجربہ، اہم تقاضے اور KPIs حاصل کیے جا رہے ہیں...'
                    : 'Parsing Title, Education, Experience Range, Key Requirements, Responsibilities & KPIs...'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {t.dropJobAdText}
                </p>
                <p className="text-xs text-slate-500 max-w-md">
                  {language === 'ur'
                    ? 'تصویر (JPG, PNG)، پی ڈی ایف (PDF)، یا ورڈ فائل اپلوڈ کریں۔ AI خود بخود تمام تفصیلات پڑھ کر فارم اور اسکریننگ انجن میں سیٹ کر دے گا۔'
                    : 'Upload image (JPG, PNG), PDF flyer, or document. Gemini AI automatically extracts full criteria to screen resumes against it.'}
                </p>
              </div>
            )}
          </div>

          {/* Quick 1-Click Sample Ads for immediate testing */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t.trySampleJobAd}:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => handleLoadSampleAd('dev')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <FileImage className="w-3.5 h-3.5" />
                {language === 'ur' ? 'سافٹ ویئر انجینئر جاب اشتہار (JPG)' : 'Software Engineer Job Ad (JPG)'}
              </button>
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => handleLoadSampleAd('finance')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <FileImage className="w-3.5 h-3.5" />
                {language === 'ur' ? 'اکاؤنٹس / فنانس ایڈ (JPG)' : 'Accounts & Finance Ad (JPG)'}
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successInfo && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successInfo}</span>
              </div>
              {onNavigateToUploadResumes && (
                <button
                  type="button"
                  onClick={onNavigateToUploadResumes}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0"
                >
                  {t.screenAgainstAdBtn}
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Modal to view full flyer preview if image was uploaded */}
      {previewModalOpen && uploadedAd && uploadedAd.previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {uploadedAd.fileName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-2 border border-slate-200">
              <img
                src={uploadedAd.previewUrl}
                alt={uploadedAd.fileName}
                className="max-h-[60vh] max-w-full rounded object-contain shadow-xs"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span>Position: </span>
                <span className="font-bold text-slate-800">{uploadedAd.extractedTitle || currentCriteria.jobTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
