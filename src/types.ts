export type Language = 'ur' | 'en';

export type NavigationPage = 'recruitment' | 'application-form' | 'kpis' | 'excel-hub';

export interface JobKPI {
  id: string;
  title: string;
  category: 'Technical' | 'Delivery' | 'Leadership' | 'Quality' | 'Commercial' | 'General';
  targetMetric: string;
  weightPercent: number;
  description: string;
}

export interface CandidateKPIResult {
  kpiId: string;
  kpiTitle: string;
  score: number; // 0 - 100
  evidence: string;
  status: 'Exceeds Target' | 'Meets Target' | 'Needs Improvement';
}

export interface UploadedJobAd {
  fileName: string;
  fileSize: number;
  fileType: string;
  previewUrl?: string; // base64 preview or image
  rawText?: string;
  uploadedAt: string;
  extractedTitle?: string;
}

export interface JobCriteria {
  jobTitle: string;
  educationRequirements: string;
  experienceMin: number;
  experienceMax: number;
  keyRequirements: string[];
  keyResponsibilities: string;
  shortlistLimit: number; // e.g. 10 or 15 or 20
  kpis: JobKPI[];
  sourceJobAd?: UploadedJobAd;
  // Backward compatibility aliases
  requiredSkills: string[];
  jobDescription: string;
}

export interface CandidateResume {
  id: string;
  fileName: string;
  fileSize: number;
  rawText: string;
  uploadedAt: string;
}

export interface CandidateApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentCompany?: string;
  currentTitle?: string;
  experienceYears: number;
  educationDegree: string;
  skills: string[];
  portfolioUrl?: string;
  kpiResponses: { [kpiId: string]: string };
  resumeText: string;
  appliedDate: string;
}

export interface ScreeningResult {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  city: string;
  age: string | number;
  lastOrganization: string;
  constructionExperience?: string; // 'Yes' or 'No' (or detail like 'Yes (Civil / Construction)')
  overallScore: number;
  rank?: number;
  recommendation: 'Strong Match' | 'Potential Match' | 'Low Match';
  interviewStage:
    | 'Recommended for CEO Final Interview'
    | 'Recommended for GM HR Interview'
    | 'Recommended for Technical Interview'
    | 'Not Recommended';
  isShortlisted: boolean;
  experienceYears: number;
  experienceVerdict: 'Meets' | 'Exceeds' | 'Lacks';
  educationStatus: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengthsSummary?: string;
  concernsOrRedFlags?: string;
  oneLineVerdict: string;
  detailedRemarks: string;
  screenedAt: string;
  customNotes?: string;
  rawResumeText?: string;
  kpis?: CandidateKPIResult[];
  overallKpiScore?: number;
}

export interface AuthUser {
  mobileNumber: string;
  name: string;
  loggedInAt: string;
}

export interface ScreeningProgressState {
  isScreening: boolean;
  currentStep: number;
  totalResumes: number;
  statusMessage: string;
  percentage: number;
}
