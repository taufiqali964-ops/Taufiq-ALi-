import { JobCriteria, CandidateResume } from '../types';

export const sampleJobTemplates: Record<string, JobCriteria> = {
  softwareEngineer: {
    jobTitle: 'Senior Full Stack Developer (React & Node.js)',
    educationRequirements: 'Bachelors in Computer Science (BSCS) / Software Engineering or equivalent degree',
    experienceMin: 3,
    experienceMax: 7,
    keyRequirements: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Git', 'Tailwind CSS'],
    keyResponsibilities: 'Architect and develop high-performance React frontends and scalable Node.js/Express backends. Design and optimize PostgreSQL schemas and queries. Lead code reviews and mentor junior engineers.',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Git', 'Tailwind CSS'],
    jobDescription: 'Architect and develop high-performance React frontends and scalable Node.js/Express backends. Design and optimize PostgreSQL schemas and queries.',
    shortlistLimit: 10,
    kpis: [
      {
        id: 'kpi-1',
        title: 'Feature & Sprint Delivery Velocity',
        category: 'Delivery',
        targetMetric: '>85% sprint completion with on-time feature deployment',
        weightPercent: 30,
        description: 'Consistent delivery of planned engineering milestones and roadmap features.',
      },
      {
        id: 'kpi-2',
        title: 'Code Quality & Defect Prevention',
        category: 'Quality',
        targetMetric: '>90% unit test coverage and low production bug rate',
        weightPercent: 25,
        description: 'Writing maintainable TypeScript code, robust error handling, and clean code reviews.',
      },
      {
        id: 'kpi-3',
        title: 'System Scalability & Performance',
        category: 'Technical',
        targetMetric: 'Experience scaling services to 50k+ active users or optimizing query latency',
        weightPercent: 25,
        description: 'PostgreSQL query optimization, Redis caching, and responsive React bundle sizes.',
      },
      {
        id: 'kpi-4',
        title: 'Mentorship & Engineering Collaboration',
        category: 'Leadership',
        targetMetric: 'Mentoring 2-5 junior developers and contributing to architectural standards',
        weightPercent: 20,
        description: 'Conducting thorough code reviews, technical documentation, and cross-team communication.',
      },
    ],
  },
  salesMarketing: {
    jobTitle: 'Sales & Business Development Manager',
    educationRequirements: 'Bachelors or Masters in Business Administration (BBA/MBA) or Marketing',
    experienceMin: 4,
    experienceMax: 8,
    keyRequirements: ['B2B Sales', 'Lead Generation', 'CRM (HubSpot/Salesforce)', 'Negotiation', 'Revenue Growth', 'Team Leadership'],
    keyResponsibilities: 'Drive regional market strategy and meet quarterly revenue quotas. Lead B2B enterprise sales prospecting, client presentations, contract negotiations, and pipeline maintenance.',
    requiredSkills: ['B2B Sales', 'Lead Generation', 'CRM (HubSpot/Salesforce)', 'Negotiation', 'Revenue Growth', 'Team Leadership'],
    jobDescription: 'Drive regional market strategy and meet quarterly revenue quotas. Lead B2B enterprise sales prospecting and contract negotiations.',
    shortlistLimit: 10,
    kpis: [
      {
        id: 'kpi-sm-1',
        title: 'Quarterly Revenue Quota Attainment',
        category: 'Commercial',
        targetMetric: 'Achieving 100%+ of quarterly assigned sales revenue target',
        weightPercent: 40,
        description: 'Closing qualified opportunities and managing enterprise contracts.',
      },
      {
        id: 'kpi-sm-2',
        title: 'New Enterprise Client Acquisition',
        category: 'Commercial',
        targetMetric: 'Closing at least 6-10 new B2B accounts per quarter',
        weightPercent: 35,
        description: 'Pipeline generation and deal closing.',
      },
      {
        id: 'kpi-sm-3',
        title: 'Sales Pipeline Velocity & CRM Hygiene',
        category: 'Delivery',
        targetMetric: 'Reducing sales cycle length by 15-20% with accurate CRM stage updates',
        weightPercent: 25,
        description: 'Timely CRM pipeline maintenance in Salesforce/HubSpot.',
      },
    ],
  },
  accountant: {
    jobTitle: 'Senior Accountant & Financial Analyst',
    educationRequirements: 'B.Com / M.Com / BS Accounting & Finance / ACCA / CA Inter',
    experienceMin: 3,
    experienceMax: 6,
    keyRequirements: ['QuickBooks', 'Financial Reporting', 'Tax Compliance', 'Advanced Excel', 'Budgeting', 'Auditing'],
    keyResponsibilities: 'Manage general ledger reconciliations, monthly P&L and balance sheet closing, corporate tax compliance filings, and annual audit coordination.',
    requiredSkills: ['QuickBooks', 'Financial Reporting', 'Tax Compliance', 'Advanced Excel', 'Budgeting', 'Auditing'],
    jobDescription: 'Manage general ledger reconciliations, monthly P&L and balance sheet closing, and corporate tax compliance filings.',
    shortlistLimit: 10,
    kpis: [
      {
        id: 'kpi-acc-1',
        title: 'Monthly Financial Books Closure Timeliness',
        category: 'Quality',
        targetMetric: 'Completing books close by day 5 of following month',
        weightPercent: 50,
        description: 'Accurate reconciliation of ledgers, receivables, and balance sheet accounts.',
      },
      {
        id: 'kpi-acc-2',
        title: 'Statutory Tax Compliance & Reporting Accuracy',
        category: 'Quality',
        targetMetric: '100% on-time tax filings with zero penalty or non-compliance notice',
        weightPercent: 50,
        description: 'Corporate tax, withholding tax, and financial audit coordination.',
      },
    ],
  },
  hrOfficer: {
    jobTitle: 'Human Resources (HR) & Talent Acquisition Specialist',
    educationRequirements: 'Bachelors in Human Resource Management (BBA HR) or MBA HR',
    experienceMin: 2,
    experienceMax: 5,
    keyRequirements: ['Talent Sourcing', 'Resume Screening', 'Interviewing', 'Onboarding', 'HR Policies', 'Labor Laws'],
    keyResponsibilities: 'Manage end-to-end recruitment lifecycle from sourcing to candidate onboarding. Conduct preliminary screening calls, coordinate interview panels, and maintain HR documentation.',
    requiredSkills: ['Talent Sourcing', 'Resume Screening', 'Interviewing', 'Onboarding', 'HR Policies', 'Labor Laws'],
    jobDescription: 'Manage end-to-end recruitment lifecycle from sourcing to candidate onboarding. Conduct screening and coordinate interview panels.',
    shortlistLimit: 10,
    kpis: [
      {
        id: 'kpi-hr-1',
        title: 'Time-to-Hire Speed',
        category: 'Delivery',
        targetMetric: 'Maintaining average hiring cycle under 25 calendar days',
        weightPercent: 50,
        description: 'Sourcing, screening, scheduling, and closing candidate offers.',
      },
      {
        id: 'kpi-hr-2',
        title: 'New Hire 90-Day Retention Rate',
        category: 'Quality',
        targetMetric: '>92% retention of newly placed hires past 90-day probationary period',
        weightPercent: 50,
        description: 'Ensuring cultural fit, candidate readiness, and smooth onboarding.',
      },
    ],
  },
};

export const sampleResumes: CandidateResume[] = [
  {
    id: 'cand-1',
    fileName: 'Muhammad_Hamza_FullStack.pdf',
    fileSize: 48200,
    uploadedAt: new Date().toISOString(),
    rawText: `MUHAMMAD HAMZA
Email: hamza.dev@gmail.com | Phone: +92 300 1234567 | City: Lahore, Pakistan
DOB: 14/08/1995 (Date of Birth)
SUMMARY:
Dedicated Full Stack Software Engineer with 5 years of professional experience building web apps with React, TypeScript, Node.js, and PostgreSQL. Experienced in ERP and construction management modules for Descon Engineering.
EDUCATION:
- BS Computer Science (BSCS) - FAST-NUCES Lahore (2015 - 2019) | CGPA: 3.52/4.0
EXPERIENCE:
1. Senior Software Engineer - Descon Engineering & Tech (2021 - Present, 3.5 years)
   - Built React frontend using Tailwind CSS and Next.js for construction project tracking.
   - Developed scalable REST APIs using Node.js, Express, and PostgreSQL with Prisma ORM.
   - Integrated construction site daily reports and inventory systems.
2. Full Stack Developer - CodeAxis Solutions (2019 - 2021, 2 years)
   - Developed responsive UI dashboards using React, Redux Toolkit, and TypeScript.
   - Created PostgreSQL database schemas and complex stored procedures.
TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript, SQL, Python
- Frontend: React, Next.js, Redux, Tailwind CSS, HTML5, CSS3
- Backend: Node.js, Express.js, REST APIs, GraphQL
- Construction Background Experience: Yes (Descon Engineering civil & site management platform)
- Databases: PostgreSQL, MongoDB, Redis
- Tools: Git, GitHub, Docker, Postman, Jest`,
  },
  {
    id: 'cand-2',
    fileName: 'Zainab_Fatima_SeniorEngineer.docx',
    fileSize: 52100,
    uploadedAt: new Date().toISOString(),
    rawText: `ZAINAB FATIMA
Email: zainab.fatima@techpulse.io | Phone: +92 321 9876543 | City: Islamabad
DOB: 22/11/1994 (Date of Birth: 22 November 1994)
PROFESSIONAL SUMMARY:
Senior Software Engineer with 6.5 years of expertise in full stack JavaScript/TypeScript systems. Strong architectural skills in React, Node.js, microservices, and PostgreSQL optimization.
EDUCATION:
- MS Computer Science - NUST Islamabad (2018 - 2020)
- BS in Software Engineering - NUST Islamabad (2014 - 2018) | First Class Distinction
EXPERIENCE:
- Lead Developer @ Habib Construction & Tech (2021 - Present, 3+ years)
  * Architected transactional portal handling $2M daily volume using Node.js & PostgreSQL.
  * Spearheaded migration from legacy codebase to modern React 18 and TypeScript with strict typing.
  * Managed building materials supply-chain modules for Habib Construction infrastructure.
- Software Engineer @ CloudSpark Inc (2018 - 2021, 3 years)
  * Implemented REST APIs and WebSockets for real-time collaboration tools.
SKILLS:
React, TypeScript, Node.js, PostgreSQL, RESTful APIs, Git, Docker, System Design, Construction Background Experience: Yes.`,
  },
  {
    id: 'cand-3',
    fileName: 'Bilal_Ahmed_FullStackDev.pdf',
    fileSize: 39500,
    uploadedAt: new Date().toISOString(),
    rawText: `BILAL AHMED
Email: bilal.ahmed.eng@outlook.com | Phone: +92 333 4567890 | City: Karachi
DOB: 10/03/1997 (Date of Birth: 10 March 1997)
CAREER OBJECTIVE:
Full Stack Developer with 4 years of experience specializing in React frontends and Node.js microservices.
EDUCATION:
- BS Computer Science - NED University of Engineering & Technology, Karachi (2016 - 2020)
WORK EXPERIENCE:
- Full Stack Engineer @ InnoApps FinTech (2020 - Present, 4 years)
  * Developed customer-facing web applications using React, TypeScript, and Node.js.
  * Managed PostgreSQL and MongoDB databases, optimizing query execution plans.
  * Integrated payment gateways (Stripe, JazzCash) via secure REST endpoints.
CORE COMPETENCIES:
React.js, Node.js, TypeScript, PostgreSQL, REST APIs, Git, Tailwind CSS. Construction Experience: No.`,
  },
  {
    id: 'cand-4',
    fileName: 'Ayesha_Tariq_SoftwareDeveloper.pdf',
    fileSize: 44000,
    uploadedAt: new Date().toISOString(),
    rawText: `AYESHA TARIQ
Email: ayesha.tariq@gmail.com | Phone: +92 345 5678901 | Rawalpindi
SUMMARY:
Full-stack web engineer with 3.5 years of industry experience. Passionate about clean code, component-driven design, and robust API development.
EDUCATION:
- BS Software Engineering - COMSATS University Islamabad (2017 - 2021)
EXPERIENCE:
- Software Engineer @ DevStudio (2021 - Present, 3.5 years)
  * Built dynamic single-page applications using React, Tailwind CSS, and state management.
  * Designed and consumed RESTful APIs with Node.js and Express.
  * Utilized PostgreSQL for data storage, wrote migrations, and ensured high security.
  * Active contributor in Git workflows and sprint planning.
SKILLS:
React, TypeScript, Node.js, Express, PostgreSQL, Git, HTML, CSS, Tailwind CSS, Postman.`,
  },
  {
    id: 'cand-5',
    fileName: 'Usman_Ali_Backend_Node.pdf',
    fileSize: 41200,
    uploadedAt: new Date().toISOString(),
    rawText: `USMAN ALI
Email: usman.ali.backend@yahoo.com | Phone: +92 312 3456789 | Lahore
PROFESSIONAL SUMMARY:
Backend-heavy Full Stack Developer with 5 years experience focusing on Node.js, Express, PostgreSQL, and basic React integration.
EDUCATION:
- BS Computer Science - Punjab University (PUCIT) (2015 - 2019)
EXPERIENCE:
- Backend Engineer @ CloudBase (2020 - Present, 4 years)
  * Built high-throughput backend services in Node.js and TypeScript.
  * Optimized PostgreSQL databases, indexing strategies, and connection pooling.
  * Created admin dashboards in React with basic Tailwind CSS styling.
- Junior Developer @ WebCraft (2019 - 2020, 1 year)
  * Built REST APIs and wrote automated unit tests.
SKILLS:
Node.js, TypeScript, PostgreSQL, REST APIs, React (Intermediate), Git, Docker.`,
  },
  {
    id: 'cand-6',
    fileName: 'Sara_Khan_Frontend_React.pdf',
    fileSize: 45000,
    uploadedAt: new Date().toISOString(),
    rawText: `SARA KHAN
Email: sara.khan.ui@gmail.com | Phone: +92 301 2345678 | Islamabad
SUMMARY:
Senior Frontend Developer with 5 years experience specializing in React, TypeScript, and UI/UX engineering, with auxiliary Node.js knowledge.
EDUCATION:
- BS Computer Science - NUST (2015 - 2019)
EXPERIENCE:
- Lead Frontend Engineer @ PixelCraft (2021 - Present, 3 years)
  * Built enterprise design systems with React, TypeScript, and Tailwind CSS.
  * Consumed complex backend REST APIs, handled caching and offline sync.
- Web Developer @ CreativeTech (2019 - 2021, 2 years)
  * Created interactive web portals and responsive dashboards.
SKILLS:
React, TypeScript, Tailwind CSS, HTML/CSS, Git, REST APIs, Node.js (Basic).`,
  },
  {
    id: 'cand-7',
    fileName: 'Omer_Farooq_Fullstack_Lead.pdf',
    fileSize: 58000,
    uploadedAt: new Date().toISOString(),
    rawText: `OMER FAROOQ
Email: omer.farooq@enterprise.org | Phone: +92 300 8765432 | Karachi
SUMMARY:
Principal Software Engineer with 8.5 years of extensive experience leading full-stack web and cloud systems.
EDUCATION:
- MS Computer Science - LUMS (2016 - 2018)
- BS Computer Science - FAST Karachi (2012 - 2016)
EXPERIENCE:
- Technical Lead @ Global Systems Ltd (2020 - Present, 4.5 years)
  * Led a squad of 10 developers building distributed web apps with React, Node.js, and PostgreSQL.
  * Architected microservices and secure auth systems.
- Senior Engineer @ Systems Inc (2018 - 2020, 2 years)
- Software Engineer @ NetSol (2016 - 2018, 2 years)
SKILLS:
React, TypeScript, Node.js, PostgreSQL, Cloud Architecture, Git, REST APIs, Mentorship. Note: Experience (8.5 years) slightly exceeds standard mid-senior bracket.`,
  },
  {
    id: 'cand-8',
    fileName: 'Hassan_Raza_MidDev.pdf',
    fileSize: 37000,
    uploadedAt: new Date().toISOString(),
    rawText: `HASSAN RAZA
Email: hassan.raza.dev@gmail.com | Phone: +92 313 1122334 | Faisalabad
SUMMARY:
Full Stack Developer with 3 years of hands-on experience in modern JavaScript ecosystems.
EDUCATION:
- BS Computer Science - University of Agriculture Faisalabad (2017 - 2021)
EXPERIENCE:
- Full Stack Engineer @ SoftSolutions (2021 - Present, 3 years)
  * Developed web apps with React, Node.js, Express, and PostgreSQL.
  * Built REST APIs and connected third-party SaaS integrations.
  * Proficient with Git and Git flow.
SKILLS:
React, Node.js, TypeScript, PostgreSQL, REST APIs, Git, Tailwind CSS.`,
  },
  {
    id: 'cand-9',
    fileName: 'Fatima_Noor_JuniorReact.docx',
    fileSize: 32000,
    uploadedAt: new Date().toISOString(),
    rawText: `FATIMA NOOR
Email: fatima.noor.code@gmail.com | Phone: +92 322 4455667 | Lahore
OBJECTIVE:
Enthusiastic Junior Developer with 1.5 years experience seeking to contribute to high-impact web development.
EDUCATION:
- BS Computer Science - Virtual University (2019 - 2023)
EXPERIENCE:
- Junior Frontend Developer @ Appify Studio (2023 - Present, 1.5 years)
  * Built reusable components in React and plain CSS.
  * Explored Node.js and Express for personal projects.
SKILLS:
React, JavaScript, HTML, CSS, Git, basic Node.js. Lacks 3+ years experience and PostgreSQL expertise.`,
  },
  {
    id: 'cand-10',
    fileName: 'Danish_Iqbal_PHP_Developer.pdf',
    fileSize: 36000,
    uploadedAt: new Date().toISOString(),
    rawText: `DANISH IQBAL
Email: danish.iqbal.php@yahoo.com | Phone: +92 334 9988776 | Multan
SUMMARY:
Web Developer with 4 years experience primarily working in PHP, Laravel, and MySQL with basic React knowledge.
EDUCATION:
- BS Information Technology - Bahauddin Zakariya University (2016 - 2020)
EXPERIENCE:
- PHP / Laravel Developer @ MultanTech (2020 - Present, 4 years)
  * Created backend portals using Laravel and MySQL.
  * Used Blade templates and basic React components.
SKILLS:
PHP, Laravel, MySQL, JavaScript, HTML, CSS, basic React. Missing Node.js, TypeScript, and PostgreSQL experience.`,
  },
  {
    id: 'cand-11',
    fileName: 'Mariam_Siddiqui_Fullstack.pdf',
    fileSize: 49000,
    uploadedAt: new Date().toISOString(),
    rawText: `MARIAM SIDDIQUI
Email: mariam.siddiqui@techhive.pk | Phone: +92 315 7766554 | Karachi
SUMMARY:
Full Stack Software Engineer with 4.5 years experience delivering production web applications in React, Node.js, and PostgreSQL.
EDUCATION:
- BS Computer Science - IBA Karachi (2015 - 2019)
EXPERIENCE:
- Full Stack Engineer @ Finverse (2021 - Present, 3 years)
  * Developed banking dashboard using React 18, TypeScript, and Tailwind CSS.
  * Engineered secure Node.js REST services and managed PostgreSQL relational database.
- Software Engineer @ CreativeDot (2019 - 2021, 1.5 years)
  * Maintained frontend features and automated deployment pipelines.
SKILLS:
React, Node.js, TypeScript, PostgreSQL, REST APIs, Git, Tailwind CSS, Jest.`,
  },
  {
    id: 'cand-12',
    fileName: 'Kamran_Shahid_Python_Dev.pdf',
    fileSize: 38000,
    uploadedAt: new Date().toISOString(),
    rawText: `KAMRAN SHAHID
Email: kamran.shahid.py@gmail.com | Phone: +92 346 3322110 | Peshawar
SUMMARY:
Python & Django Developer with 4 years experience in data engineering and backend services.
EDUCATION:
- BS Computer Software Engineering - UET Peshawar (2016 - 2020)
EXPERIENCE:
- Backend Engineer @ DataForge (2020 - Present, 4 years)
  * Built APIs using Python, Django, and PostgreSQL.
  * Basic familiarity with frontend frameworks.
SKILLS:
Python, Django, PostgreSQL, Docker, Git. Lacks React, Node.js, and TypeScript frontend background.`,
  },
  {
    id: 'cand-13',
    fileName: 'Nadia_Jamil_FullStack_ReactNode.pdf',
    fileSize: 46000,
    uploadedAt: new Date().toISOString(),
    rawText: `NADIA JAMIL
Email: nadia.jamil@devcorp.com | Phone: +92 305 6677889 | Islamabad
SUMMARY:
Experienced Full Stack Developer with 4 years of solid background in building scalable web apps with React, TypeScript, and Node.js.
EDUCATION:
- BS Computer Science - FAST Islamabad (2016 - 2020)
EXPERIENCE:
- Full Stack Engineer @ AlphaTech (2020 - Present, 4 years)
  * Designed modular React interfaces with TypeScript and Tailwind CSS.
  * Built REST APIs and relational schema migrations in PostgreSQL using Node.js.
  * Conducted unit and integration testing.
SKILLS:
React, TypeScript, Node.js, PostgreSQL, REST APIs, Git, Tailwind CSS.`,
  },
  {
    id: 'cand-14',
    fileName: 'Waqas_Mehmood_Accountant_Mismatch.pdf',
    fileSize: 31000,
    uploadedAt: new Date().toISOString(),
    rawText: `WAQAS MEHMOOD
Email: waqas.m.finance@gmail.com | Phone: +92 331 5544332 | Lahore
SUMMARY:
Senior Accountant and Finance Specialist with 6 years experience in QuickBooks, payroll, and auditing.
EDUCATION:
- B.Com - Hailey College of Commerce (2014 - 2018)
EXPERIENCE:
- Senior Accountant @ Textile Mills (2018 - Present, 6 years)
SKILLS:
QuickBooks, Microsoft Excel, Tax Filing, Financial Audit. (Irrelevant candidate applied by mistake).`,
  },
  {
    id: 'cand-15',
    fileName: 'Asad_Rehman_FullStack_Engineer.docx',
    fileSize: 47500,
    uploadedAt: new Date().toISOString(),
    rawText: `ASAD REHMAN
Email: asad.rehman.tech@gmail.com | Phone: +92 302 9988112 | Lahore
SUMMARY:
Full Stack Developer with 5 years of rich experience designing cloud-ready applications with React, Node.js, PostgreSQL, and TypeScript.
EDUCATION:
- BS Computer Science - FAST NUCES (2015 - 2019)
EXPERIENCE:
- Full Stack Engineer @ VentureCloud (2021 - Present, 3 years)
  * Led development of customer portal in React and TypeScript.
  * Engineered Node.js REST APIs with robust error handling and PostgreSQL db.
- Software Developer @ TechPioneers (2019 - 2021, 2 years)
  * Built UI features using React and Tailwind CSS.
SKILLS:
React, TypeScript, Node.js, PostgreSQL, REST APIs, Git, Tailwind CSS, Docker.`,
  },
];
