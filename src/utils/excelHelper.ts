import * as XLSX from 'xlsx';
import { JobCriteria, ScreeningResult } from '../types';

export function exportScreeningToExcel(
  results: ScreeningResult[],
  jobCriteria: JobCriteria,
  shortlistLimit: number,
  onlyShortlisted: boolean = false
) {
  const wb = XLSX.utils.book_new();

  // Sort candidates by score descending
  const sorted = [...results].sort((a, b) => b.overallScore - a.overallScore);
  const shortlisted = sorted.filter((c) => c.isShortlisted);

  // Format candidate data for Excel according to exact required specification
  const formatRows = (candidates: ScreeningResult[]) => {
    return candidates.map((c, index) => {
      return {
        'Serial Number': index + 1,
        'Candidate Name': c.candidateName,
        'Email Address': c.email || 'N/A',
        'Phone Number': c.phone || 'N/A',
        'City': c.city || 'N/A',
        'Total Age': c.age || 'N/A',
        'Last Organization': c.lastOrganization || 'N/A',
        'Construction Background Experience': c.constructionExperience || 'No',
        'Total Experience': `${c.experienceYears} Years`,
        'Education / Qualification': c.educationStatus,
        'Shortlisted': c.isShortlisted ? 'YES' : 'NO',
        'Interview Stage Recommendation': c.interviewStage || 'Recommended for GM HR Interview',
        'Detailed HR Remarks': c.detailedRemarks || 'Recommended based on experience and credentials.',
        'Match Score (%)': `${c.overallScore}%`,
        'Screened Date': c.screenedAt || new Date().toLocaleDateString(),
      };
    });
  };

  const shortlistSheetName = shortlisted.length > 0 ? `Top Shortlist (${shortlisted.length})` : 'Top Shortlist';

  if (!onlyShortlisted) {
    // 1. Top Shortlisted Sheet (whether 2, 3, 4, or 10 candidates)
    const shortlistData = formatRows(shortlisted);
    const wsShortlist = XLSX.utils.json_to_sheet(shortlistData);
    setColumnWidths(wsShortlist);
    XLSX.utils.book_append_sheet(wb, wsShortlist, shortlistSheetName);

    // 2. All Candidates Sheet
    const allData = formatRows(sorted);
    const wsAll = XLSX.utils.json_to_sheet(allData);
    setColumnWidths(wsAll);
    XLSX.utils.book_append_sheet(wb, wsAll, 'All Candidates');
  } else {
    // Only shortlisted sheet
    const shortlistData = formatRows(shortlisted);
    const wsShortlist = XLSX.utils.json_to_sheet(shortlistData);
    setColumnWidths(wsShortlist);
    XLSX.utils.book_append_sheet(wb, wsShortlist, shortlistSheetName);
  }

  // 3. Job Criteria Sheet
  const criteriaData = [
    { 'Parameter': 'Position Title', 'Value': jobCriteria.jobTitle },
    { 'Parameter': 'Education Required', 'Value': jobCriteria.educationRequirements },
    { 'Parameter': 'Min Experience', 'Value': `${jobCriteria.experienceMin} Years` },
    { 'Parameter': 'Max Experience', 'Value': `${jobCriteria.experienceMax} Years` },
    { 'Parameter': 'Key Requirements', 'Value': (jobCriteria.keyRequirements || jobCriteria.requiredSkills || []).join(', ') },
    { 'Parameter': 'Shortlist Target', 'Value': `Top ${jobCriteria.shortlistLimit} Candidates` },
    { 'Parameter': 'Key Responsibilities', 'Value': jobCriteria.keyResponsibilities || jobCriteria.jobDescription || '' },
    { 'Parameter': 'Export Date', 'Value': new Date().toLocaleString() },
  ];
  const wsCriteria = XLSX.utils.json_to_sheet(criteriaData);
  setCriteriaColumnWidths(wsCriteria);
  XLSX.utils.book_append_sheet(wb, wsCriteria, 'Job Requirements');

  // Trigger download
  const cleanTitle = (jobCriteria.jobTitle || 'Candidates').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanTitle}_Screening_Summary_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

function setColumnWidths(ws: XLSX.WorkSheet) {
  const colWidths = [
    { wch: 15 }, // Serial Number
    { wch: 25 }, // Candidate Name
    { wch: 28 }, // Email Address
    { wch: 18 }, // Phone Number
    { wch: 16 }, // City
    { wch: 14 }, // Total Age
    { wch: 28 }, // Last Organization
    { wch: 32 }, // Construction Background Experience
    { wch: 18 }, // Total Experience
    { wch: 30 }, // Education / Qualification
    { wch: 14 }, // Shortlisted
    { wch: 35 }, // Interview Stage Recommendation
    { wch: 45 }, // Detailed HR Remarks
    { wch: 16 }, // Match Score (%)
    { wch: 15 }, // Screened Date
  ];
  ws['!cols'] = colWidths;
}

function setCriteriaColumnWidths(ws: XLSX.WorkSheet) {
  ws['!cols'] = [{ wch: 24 }, { wch: 60 }];
}

export async function importScreeningFromExcel(file: File): Promise<ScreeningResult[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Prefer first sheet or a sheet named shortlist / all candidates
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson || rawJson.length === 0) {
          throw new Error('No data found in the uploaded Excel spreadsheet.');
        }

        const candidates: ScreeningResult[] = rawJson.map((row, index) => {
          // Normalize column headers with English prioritization
          const name = row['Candidate Name'] || row['Candidate Name (نام)'] || row['Name'] || row['نام'] || `Candidate #${index + 1}`;
          const email = row['Email Address'] || row['Email'] || row['Email (ای میل)'] || row['ای میل'] || 'N/A';
          const phone = row['Phone Number'] || row['Phone'] || row['Phone (فون)'] || row['فون'] || 'N/A';
          const constructionExp = row['Construction Background Experience'] || row['Construction Experience'] || row['Construction'] || 'No';
          
          let score = 50;
          const scoreRaw = row['Match Score (%)'] || row['Match Score (اسکور %)'] || row['Match Score'] || row['Score'];
          if (scoreRaw !== undefined) {
            score = parseInt(String(scoreRaw).replace('%', '').trim(), 10) || 50;
          }

          const status = row['Recommendation'] || row['Status'] || row['Status (حیثیت)'] || (score >= 75 ? 'Strong Match' : score >= 55 ? 'Potential Match' : 'Low Match');
          const isShortlisted = String(row['Shortlisted'] || row['Shortlisted (شارٹ لسٹ)'] || '').toLowerCase().includes('yes') || score >= 75;

          const expRaw = row['Total Experience'] || row['Experience (Years)'] || row['Experience (تجربہ - سال)'] || row['Experience'] || '3';
          const expYears = parseFloat(String(expRaw).replace(/[^0-9.]/g, '')) || 3;

          const matchedSkillsStr = row['Matched Skills'] || row['Matched Skills (موجود مہارتیں)'] || '';
          const missingSkillsStr = row['Missing Skills'] || row['Missing Skills (غیر موجود)'] || '';

          const city = row['City'] || row['سٹی'] || row['شہر'] || 'Lahore';
          const age = row['Total Age'] || row['Age'] || row['عمر'] || `${Math.round(23 + expYears)} Years`;
          const lastOrg = row['Last Organization'] || row['Organization'] || row['آخری ادارہ'] || 'Tech Enterprise Ltd';
          const interviewStage =
            row['Interview Stage Recommendation'] ||
            row['Interview Stage'] ||
            (score >= 80
              ? 'Recommended for CEO Final Interview'
              : score >= 70
              ? 'Recommended for GM HR Interview'
              : 'Recommended for Technical Interview');
          const detailedRemarks =
            row['Detailed HR Remarks'] ||
            row['Remarks'] ||
            row['Executive Summary'] ||
            `Candidate holds ${expYears} years experience at ${lastOrg}. Officially ${interviewStage}.`;

          return {
            id: `excel-${Date.now()}-${index}`,
            candidateName: name,
            email,
            phone,
            city,
            age,
            lastOrganization: lastOrg,
            constructionExperience: constructionExp,
            overallScore: score,
            overallKpiScore: score,
            rank: index + 1,
            recommendation: status as any,
            interviewStage: interviewStage as any,
            detailedRemarks,
            isShortlisted,
            experienceYears: expYears,
            experienceVerdict: (row['Experience Fit'] || (expYears >= 3 ? 'Meets' : 'Lacks')) as any,
            educationStatus: row['Education Qualification'] || row['Education Match (تعلیمی قابلیت)'] || row['Education'] || 'Verified Degree',
            matchedSkills: matchedSkillsStr ? String(matchedSkillsStr).split(',').map((s) => s.trim()).filter(Boolean) : [],
            missingSkills: missingSkillsStr && missingSkillsStr !== 'None' ? String(missingSkillsStr).split(',').map((s) => s.trim()).filter(Boolean) : [],
            strengthsSummary: row['Key Strengths'] || row['Key Strengths (اہم خوبیاں)'] || row['Strengths'] || 'Relevant background and technical experience.',
            concernsOrRedFlags: row['Concerns / Red Flags'] || row['Concerns / Flags (توجہ طلب نکات)'] || '',
            oneLineVerdict: row['Executive Summary'] || row['Executive Summary (خلاصہ)'] || 'Candidate evaluated from Excel summary.',
            screenedAt: row['Screened Date'] || new Date().toISOString(),
          };
        });

        resolve(candidates);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
