import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini client utility on the server with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Resume screening API endpoint
app.post('/api/screen-resumes', async (req, res) => {
  try {
    const { jobCriteria, resumes } = req.body;

    if (!jobCriteria || !resumes || !Array.isArray(resumes) || resumes.length === 0) {
      return res.status(400).json({ error: 'jobCriteria and a non-empty resumes array are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    // Process resumes in batch
    // Include KPI evaluations in prompt
    const kpiDescriptions = Array.isArray(jobCriteria.kpis) && jobCriteria.kpis.length > 0
      ? jobCriteria.kpis.map((k: any) => `- [${k.id}] ${k.title} (${k.category}): Target: "${k.targetMetric}". Weight: ${k.weightPercent}%. Description: ${k.description}`).join('\n')
      : '- [kpi-default] Delivery & Technical Execution: Target: High on-time delivery with solid code quality';

    // Effective requirements & responsibilities
    const effectiveRequirements = Array.isArray(jobCriteria.keyRequirements) && jobCriteria.keyRequirements.length > 0
      ? jobCriteria.keyRequirements
      : (Array.isArray(jobCriteria.requiredSkills) && jobCriteria.requiredSkills.length > 0 ? jobCriteria.requiredSkills : []);
    
    const effectiveResponsibilities = jobCriteria.keyResponsibilities || jobCriteria.jobDescription || 'Standard role responsibilities';

    const prompt = `You are an expert HR Talent Acquisition Specialist and Senior Technical Recruiter.
Evaluate the following candidate resume(s) against the specified Job Requirements, Key Responsibilities, and Position KPIs.

### JOB CRITERIA:
- Position Title: ${jobCriteria.jobTitle || 'Not specified'}
- Required Education: ${jobCriteria.educationRequirements || 'Not specified'}
- Experience Required: Min ${jobCriteria.experienceMin ?? 0} years to Max ${jobCriteria.experienceMax ?? 'Open'} years
- Key Requirements: ${effectiveRequirements.length > 0 ? effectiveRequirements.join(', ') : 'Standard competencies'}
- Key Responsibilities:
${effectiveResponsibilities}

### POSITION KEY PERFORMANCE INDICATORS (KPIs):
${kpiDescriptions}

### RESUMES TO SCREEN (${resumes.length} candidates):
${resumes
  .map(
    (r: { id: string; name: string; content: string }, index: number) => `
--- Candidate #${index + 1} [ID: ${r.id}] ---
Name from file: ${r.name}
Resume Text:
${r.content.slice(0, 4000)}
`
  )
  .join('\n')}

For each candidate:
1. Score candidate from 0 to 100 on overall match.
2. Extract candidate's City (or primary location) from resume.
3. Calculate/estimate candidate Total Age in years (based on graduation date ~22yo + experience years, or birth date, or state an estimate like "28 Years").
4. Extract candidate's Last Organization (most recent or current company/organization worked at).
5. Check Construction Background Experience: Does the candidate have experience in civil engineering, construction projects, real estate development, MEP, site engineering, contracting firms, or building infrastructure? Assign 'Yes' or 'No'.
6. Extract specific KPI performance: For each KPI listed above, evaluate the evidence in candidate's history, assign a score (0 to 100), status ('Exceeds Target', 'Meets Target', or 'Needs Improvement'), and cite specific evidence.
7. Compute overallKpiScore (weighted average of KPI scores).
8. Assign interviewStage recommendation:
   - 'Recommended for CEO Final Interview' (For high scorers >= 80%, top shortlisted leaders)
   - 'Recommended for GM HR Interview' (For strong candidates 70-79%)
   - 'Recommended for Technical Interview' (For potential matches 55-69%)
   - 'Not Recommended' (For low matches < 55%)
9. Provide detailedRemarks: A thorough HR assessment detailing candidate background, tenure, match strengths, and explicit reason why recommended for GM HR or CEO interview.

Assign recommendation:
- 'Strong Match' (Score 75-100, suitable for Top Shortlist)
- 'Potential Match' (Score 55-74, review if needed)
- 'Low Match' (Score < 55, rejected / not suitable)

Return a JSON array of evaluated candidates.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite AI Recruiter and HRMS specialist. You extract candidate information accurately including last organization, city, age, construction background experience, interview stages, and KPIs.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'The candidate ID passed in' },
              candidateName: { type: Type.STRING, description: 'Candidate full name extracted from resume' },
              email: { type: Type.STRING, description: 'Extracted email or N/A' },
              phone: { type: Type.STRING, description: 'Extracted phone or N/A' },
              city: { type: Type.STRING, description: 'Candidate city or location e.g. Lahore, Karachi, Islamabad' },
              age: { type: Type.STRING, description: 'Estimated age in years e.g. 29 Years' },
              lastOrganization: { type: Type.STRING, description: 'Most recent or current employer/organization' },
              constructionExperience: { type: Type.STRING, description: "Whether candidate has construction background: 'Yes' or 'No'" },
              overallScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
              overallKpiScore: { type: Type.INTEGER, description: 'Average KPI readiness score 0-100' },
              recommendation: {
                type: Type.STRING,
                description: "'Strong Match', 'Potential Match', or 'Low Match'",
              },
              interviewStage: {
                type: Type.STRING,
                description: "'Recommended for CEO Final Interview', 'Recommended for GM HR Interview', 'Recommended for Technical Interview', or 'Not Recommended'",
              },
              experienceYears: { type: Type.NUMBER, description: 'Estimated total years of relevant experience' },
              experienceVerdict: {
                type: Type.STRING,
                description: "'Meets', 'Exceeds', or 'Lacks'",
              },
              educationStatus: { type: Type.STRING, description: 'Highest degree detected and relevance' },
              matchedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Skills the candidate has that match job requirements',
              },
              missingSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Required skills missing from candidate resume',
              },
              strengthsSummary: {
                type: Type.STRING,
                description: 'Key positive highlights and why they qualify',
              },
              concernsOrRedFlags: {
                type: Type.STRING,
                description: 'Gaps, lack of credentials, or weaknesses',
              },
              oneLineVerdict: {
                type: Type.STRING,
                description: 'One concise summary sentence of candidate fit',
              },
              detailedRemarks: {
                type: Type.STRING,
                description: 'Detailed HR remarks specifying experience evaluation and explicit recommendation for GM HR or CEO interview',
              },
              kpis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    kpiId: { type: Type.STRING },
                    kpiTitle: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    evidence: { type: Type.STRING },
                    status: { type: Type.STRING },
                  },
                  required: ['kpiId', 'kpiTitle', 'score', 'evidence', 'status'],
                },
              },
            },
            required: [
              'id',
              'candidateName',
              'overallScore',
              'recommendation',
              'experienceYears',
              'educationStatus',
              'matchedSkills',
              'missingSkills',
              'strengthsSummary',
              'oneLineVerdict',
              'lastOrganization',
              'city',
              'age',
              'interviewStage',
              'detailedRemarks',
            ],
          },
        },
      },
    });

    const responseText = response.text || '[]';
    const parsedResults = JSON.parse(responseText);

    return res.json({ results: parsedResults });
  } catch (error: any) {
    console.error('Screening error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to screen resumes using Gemini AI.',
    });
  }
});

// Dedicated KPI and Application Form Extractor
app.post('/api/extract-kpis', async (req, res) => {
  try {
    const { text, jobCriteria } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Resume text is required for extraction.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const kpiList = jobCriteria?.kpis || [];
    const kpiDescriptions = kpiList
      .map((k: any) => `- [${k.id}] ${k.title}: Target: ${k.targetMetric}. Desc: ${k.description}`)
      .join('\n');

    const prompt = `You are an HRMS candidate intake and KPI extraction specialist.
Extract candidate application form fields and evaluate their KPI metrics from the following resume / text.

Position: ${jobCriteria?.jobTitle || 'General Position'}
Target KPIs to extract evidence for:
${kpiDescriptions || 'General delivery, technical expertise, leadership, code quality'}

Resume Text:
${text.slice(0, 5000)}

Extract the candidate's profile, contact info, experience, and for each KPI write a factual summary of what the candidate has achieved according to their resume.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Extract candidate details and evaluate KPI metrics. Return strict JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            currentCompany: { type: Type.STRING },
            currentTitle: { type: Type.STRING },
            experienceYears: { type: Type.NUMBER },
            educationDegree: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            portfolioUrl: { type: Type.STRING },
            kpiAssessments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kpiId: { type: Type.STRING },
                  kpiTitle: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  evidence: { type: Type.STRING },
                  status: { type: Type.STRING },
                },
                required: ['kpiTitle', 'score', 'evidence', 'status'],
              },
            },
            overallKpiScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
          },
          required: ['fullName', 'experienceYears', 'educationDegree', 'skills'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ data: parsed });
  } catch (error: any) {
    console.error('KPI Extraction error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to extract KPIs.' });
  }
});

// Intelligent Job Ad Extraction Endpoint (supports JPG/PNG images, PDF, and text)
app.post('/api/extract-job-ad', async (req, res) => {
  try {
    const { fileData, mimeType, text, fileName } = req.body;

    if (!fileData && !text) {
      return res.status(400).json({ error: 'Either fileData (base64) or text is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not configured, using heuristic Job Ad parser');
      const fallbackData = generateFallbackJobCriteria(text || '', fileName);
      return res.json({ data: fallbackData, source: 'heuristic' });
    }

    const contents: any[] = [];

    // Add inline image or document part if available
    if (fileData) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: fileData,
        },
      });
    }

    const systemPrompt = `You are a Senior Talent Acquisition Executive & HR ATS Architect.
Analyze this uploaded Job Advertisement flyer / image / document / text.
Accurately extract all recruitment requirements and structure them for our ATS screening engine:
1. "jobTitle": Exact or standard job position title (e.g. "Senior React & Node.js Engineer", "Sales & Marketing Manager", "Chief Financial Officer", etc.)
2. "educationRequirements": Minimum required degree or academic qualification (e.g. "Bachelors in Computer Science (BSCS)", "MBA or Masters in Marketing", etc.)
3. "experienceMin": Minimum years of required experience as integer (e.g. 3, 5).
4. "experienceMax": Maximum years or expected upper range as integer (e.g. 7, 10). If only "5+ years", set experienceMin: 5 and experienceMax: 8.
5. "keyRequirements": Array of mandatory skills, tools, technologies, and certifications (e.g. ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"]).
6. "keyResponsibilities": Clear, high-impact description of the core duties, project deliverables, and team responsibilities.
7. "shortlistLimit": Recommended number of candidates to shortlist (usually 10, 15, or 20).
8. "kpis": 3 to 4 actionable KPIs tailored to this specific role, with category, title, description, targetMetric, and weightPercent summing to 100%.

${text ? `Additional Job Ad text:\n${text}` : ''}
Return strict JSON.`;

    contents.push({ text: systemPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents.length === 1 ? contents[0] : { parts: contents },
      config: {
        systemInstruction: 'You are an expert HR ATS Architect. Parse job advertisement images and documents to extract precise job specifications, requirements, responsibilities, and KPIs. Return strict JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobTitle: { type: Type.STRING },
            educationRequirements: { type: Type.STRING },
            experienceMin: { type: Type.INTEGER },
            experienceMax: { type: Type.INTEGER },
            keyRequirements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyResponsibilities: { type: Type.STRING },
            shortlistLimit: { type: Type.INTEGER },
            kpis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  targetMetric: { type: Type.STRING },
                  weightPercent: { type: Type.INTEGER },
                },
                required: ['title', 'category', 'targetMetric', 'weightPercent'],
              },
            },
          },
          required: [
            'jobTitle',
            'educationRequirements',
            'experienceMin',
            'experienceMax',
            'keyRequirements',
            'keyResponsibilities',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ data: parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Job Ad Extraction error:', error);
    const fallback = generateFallbackJobCriteria(req.body?.text || '', req.body?.fileName);
    return res.json({ data: fallback, source: 'fallback', warning: error?.message });
  }
});

// Heuristic fallback Job Ad parser when API key is unavailable or upon error
function generateFallbackJobCriteria(rawText: string, fileName?: string) {
  const textLower = (rawText + ' ' + (fileName || '')).toLowerCase();

  let jobTitle = 'Senior Full Stack Developer (React & Node.js)';
  let education = 'Bachelors in Computer Science (BSCS) / Software Engineering';
  let expMin = 3;
  let expMax = 7;
  let requirements = ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Git', 'Tailwind CSS'];
  let responsibilities = 'Architect and develop responsive frontends and resilient Node.js backends. Design database schemas, optimize queries, conduct code reviews, and lead sprint deliverables.';

  if (textLower.includes('sales') || textLower.includes('marketing') || textLower.includes('business dev')) {
    jobTitle = 'Sales & Business Development Manager';
    education = 'BBA / MBA in Marketing or Business Administration';
    expMin = 4;
    expMax = 8;
    requirements = ['B2B Sales', 'Lead Generation', 'CRM (HubSpot/Salesforce)', 'Negotiation', 'Revenue Growth', 'Team Leadership'];
    responsibilities = 'Drive regional revenue targets, conduct enterprise client presentations, negotiate commercial contracts, and mentor high-performing sales executives.';
  } else if (textLower.includes('account') || textLower.includes('finance') || textLower.includes('audit')) {
    jobTitle = 'Senior Accounts & Financial Analyst';
    education = 'ACCA / CA / Masters in Commerce / Finance';
    expMin = 3;
    expMax = 6;
    requirements = ['Financial Reporting', 'GAAP / IFRS', 'ERP / SAP', 'Taxation & Audit', 'Budget Forecasting', 'Cash Flow Analysis'];
    responsibilities = 'Prepare monthly financial statements, ensure compliance with statutory tax filings, coordinate internal audits, and optimize cash management.';
  } else if (textLower.includes('hr') || textLower.includes('human resource') || textLower.includes('talent') || textLower.includes('recruiter')) {
    jobTitle = 'HR Talent Acquisition & People Operations Lead';
    education = 'Bachelors or Masters in Human Resource Management (BBA/MBA HR)';
    expMin = 3;
    expMax = 7;
    requirements = ['End-to-End Recruitment', 'ATS Management', 'Candidate Sourcing', 'Interviewing & Evaluation', 'HR Policies', 'Labor Laws'];
    responsibilities = 'Lead bulk candidate sourcing, conduct behavioral screening interviews, manage ATS pipeline, and streamline organizational onboarding.';
  }

  // Parse experience if mentioned in text
  const expMatch = rawText.match(/(\d+)\s*(?:-|to|\+)?\s*(\d+)?\s*(?:years?|yrs?)/i);
  if (expMatch) {
    expMin = parseInt(expMatch[1], 10) || expMin;
    expMax = expMatch[2] ? parseInt(expMatch[2], 10) : expMin + 3;
  }

  return {
    jobTitle,
    educationRequirements: education,
    experienceMin: expMin,
    experienceMax: expMax,
    keyRequirements: requirements,
    keyResponsibilities: responsibilities,
    shortlistLimit: 10,
    kpis: [
      {
        id: 'kpi-ad-1',
        title: 'Core Milestone & Roadmap Delivery',
        category: 'Delivery',
        targetMetric: '>85% on-time milestone completion',
        weightPercent: 35,
        description: `Delivering primary business objectives for the ${jobTitle} role.`,
      },
      {
        id: 'kpi-ad-2',
        title: 'Execution Quality & Compliance',
        category: 'Quality',
        targetMetric: 'Zero critical defect or compliance misses',
        weightPercent: 35,
        description: 'Adhering to high standards of professional rigor, accuracy, and best practices.',
      },
      {
        id: 'kpi-ad-3',
        title: 'Team Collaboration & Stakeholder Trust',
        category: 'Leadership',
        targetMetric: 'Positive quarterly feedback from peers & department heads',
        weightPercent: 30,
        description: 'Proactive communication, cross-functional collaboration, and ownership.',
      },
    ],
  };
}

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
