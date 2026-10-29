import { AgentInfo, AcademicSubject, ExamItem, PlacementCompany, CampusEvent, DocumentItem, WorkflowStep, NotificationItem, AuditLog } from '../types';

export const agentsData: AgentInfo[] = [
  {
    id: 'academic-agent',
    name: 'Academic Agent',
    type: 'Core Intelligence',
    status: 'active',
    accuracy: 99.4,
    tasksCompleted: 1420,
    currentActivity: 'Predicting End-Sem Attendance Thresholds',
    responseTimeMs: 140,
    progress: 94,
    icon: 'GraduationCap',
    metricsLabel: 'GPA Boost Suggestion',
    metricsValue: '+0.35 CGPA',
    details: ['Timetable Optimization', 'Syllabus Coverage Tracking', 'GPA Prediction Engine', 'Faculty Feedback Sentiment']
  },
  {
    id: 'placement-agent',
    name: 'Placement Agent',
    type: 'Career Development',
    status: 'active',
    accuracy: 98.2,
    tasksCompleted: 890,
    currentActivity: 'Parsing 140 Resumes for Microsoft Drive',
    responseTimeMs: 210,
    progress: 88,
    icon: 'Briefcase',
    metricsLabel: 'Internships Matched',
    metricsValue: '24 Drives Live',
    details: ['ATS Score Optimization', 'Coding Assessment Matcher', 'Interview Q&A Generator', 'Company Salary Benchmarks']
  },
  {
    id: 'events-agent',
    name: 'Events Agent',
    type: 'Engagement & Activities',
    status: 'active',
    accuracy: 97.8,
    tasksCompleted: 650,
    currentActivity: 'Issuing QR Passes for Hackathon 2026',
    responseTimeMs: 95,
    progress: 92,
    icon: 'PartyPopper',
    metricsLabel: 'Registrations Handled',
    metricsValue: '1,280 Seats',
    details: ['QR Ticket Dispatch', 'Speaker Scheduling', 'Certificate Auto-Generation', 'Budget Allocation']
  },
  {
    id: 'services-agent',
    name: 'Student Service Agent',
    type: 'Campus Logistics',
    status: 'active',
    accuracy: 96.9,
    tasksCompleted: 2100,
    currentActivity: 'Resolving Hostel Gate-Pass Request #8492',
    responseTimeMs: 180,
    progress: 85,
    icon: 'Building2',
    metricsLabel: 'Grievances Solved',
    metricsValue: '99.1% SLA',
    details: ['Library Auto-Renewal', 'Hostel Leave Approvals', 'Shuttle Bus GPS Tracking', 'Medical Bay Scheduling']
  },
  {
    id: 'rag-agent',
    name: 'Knowledge (RAG) Agent',
    type: 'Vector Search Engine',
    status: 'processing',
    accuracy: 99.8,
    tasksCompleted: 4320,
    currentActivity: 'Indexing 2026 Academic Ordinance PDF',
    responseTimeMs: 82,
    progress: 97,
    icon: 'BookOpen',
    metricsLabel: 'Documents Indexed',
    metricsValue: '15,400 Embeddings',
    details: ['Semantic Citation Search', 'PDF Parsing & Chunking', 'Regulation QA', 'Hybrid Sparse-Dense Retrieval']
  },
  {
    id: 'communication-agent',
    name: 'Communication Agent',
    type: 'Omnichannel Dispatch',
    status: 'active',
    accuracy: 98.7,
    tasksCompleted: 3110,
    currentActivity: 'Sending End-Sem Exam Hall Ticket Emails',
    responseTimeMs: 110,
    progress: 90,
    icon: 'Mail',
    metricsLabel: 'Emails Generated',
    metricsValue: '8,420 Sent',
    details: ['Leave Email Generation', 'WhatsApp Announcement Engine', 'SMS Alert Broadcast', 'Faculty Calendar Sync']
  },
  {
    id: 'notification-agent',
    name: 'Notification Agent',
    type: 'Real-time Alerts',
    status: 'active',
    accuracy: 99.9,
    tasksCompleted: 5800,
    currentActivity: 'Pushing Low-Attendance Alert (<75%)',
    responseTimeMs: 45,
    progress: 99,
    icon: 'Bell',
    metricsLabel: 'Reminders Sent',
    metricsValue: '12.4K Today',
    details: ['Push Notification Dispatcher', 'Low Attendance Reminders', 'Exam Timetable Alerts', 'Library Overdue Warning']
  },
  {
    id: 'orchestrator-agent',
    name: 'Orchestrator Agent',
    type: 'Master Planner',
    status: 'active',
    accuracy: 99.6,
    tasksCompleted: 9840,
    currentActivity: 'Synthesizing Multi-Agent Context Matrix',
    responseTimeMs: 60,
    progress: 98,
    icon: 'Settings2',
    metricsLabel: 'Routing Confidence',
    metricsValue: '99.6%',
    details: ['Intent Routing', 'Multi-Agent Consensus', 'Task Parallelization', 'Safety & Compliance Guardrails']
  }
];

export const academicSubjects: AcademicSubject[] = [
  { code: 'CS401', name: 'Deep Learning & Neural Networks', credits: 4, faculty: 'Dr. Alan Turing', attendance: 88, grade: 'A+', targetAttendance: 75, color: '#00E5FF' },
  { code: 'CS402', name: 'Distributed Systems & Cloud', credits: 4, faculty: 'Prof. Werner Vogels', attendance: 92, grade: 'A', targetAttendance: 75, color: '#7C3AED' },
  { code: 'CS403', name: 'Natural Language Processing', credits: 3, faculty: 'Dr. Yann LeCun', attendance: 78, grade: 'A', targetAttendance: 75, color: '#10B981' },
  { code: 'CS404', name: 'Quantum Information Science', credits: 3, faculty: 'Dr. David Deutsch', attendance: 72, grade: 'B+', targetAttendance: 75, color: '#F59E0B' },
  { code: 'CS405', name: 'Autonomous Robotics', credits: 3, faculty: 'Prof. Sebastian Thrun', attendance: 95, grade: 'O', targetAttendance: 75, color: '#6366F1' }
];

export const upcomingExams: ExamItem[] = [
  { id: 'ex-1', subject: 'Deep Learning (CS401)', date: 'Aug 18, 2026', time: '10:00 AM - 01:00 PM', venue: 'Hall A1 (Main Block)', syllabus: 'Units 1-4: Transformers, Diffusion Models & Reinforcement Learning' },
  { id: 'ex-2', subject: 'Distributed Systems (CS402)', date: 'Aug 21, 2026', time: '02:00 PM - 05:00 PM', venue: 'Lab 3 (CS Wing)', syllabus: 'Consensus (Raft/Paxos), Vector Clocks, MapReduce & Microservices' },
  { id: 'ex-3', subject: 'Natural Language Processing (CS403)', date: 'Aug 24, 2026', time: '10:00 AM - 01:00 PM', venue: 'Hall B2', syllabus: 'RAG Architectures, Subword Tokenization, Fine-Tuning LoRA' }
];

export const placementCompanies: PlacementCompany[] = [
  { id: 'pc-1', name: 'OpenAI', role: 'AI Systems Engineer', package: '$180,000 / yr', location: 'San Francisco (Hybrid)', eligibilityCgpa: 8.5, deadline: 'Aug 25, 2026', applied: true, type: 'Full-Time', tags: ['Python', 'CUDA', 'PyTorch', 'Distributed Training'] },
  { id: 'pc-2', name: 'NVIDIA', role: 'GenAI Performance Engineer', package: '$165,000 / yr', location: 'Santa Clara / Remote', eligibilityCgpa: 8.0, deadline: 'Aug 28, 2026', applied: false, type: 'Full-Time', tags: ['C++', 'TensorRT', 'GPU Acceleration'] },
  { id: 'pc-3', name: 'Google DeepMind', role: 'Research Intern - Robotics', package: '$12,000 / mo', location: 'London / Hybrid', eligibilityCgpa: 9.0, deadline: 'Sep 02, 2026', applied: true, type: 'Internship', tags: ['Reinforcement Learning', 'JAX', 'Sim2Real'] },
  { id: 'pc-4', name: 'Microsoft Azure', role: 'Cloud Infrastructure Developer', package: '$150,000 / yr', location: 'Redmond / Bengaluru', eligibilityCgpa: 7.5, deadline: 'Sep 10, 2026', applied: false, type: 'Full-Time', tags: ['Go', 'Kubernetes', 'Distributed Systems'] },
  { id: 'pc-5', name: 'Palantir Technologies', role: 'Forward Deployed Engineer', package: '$170,000 / yr', location: 'New York, NY', eligibilityCgpa: 8.2, deadline: 'Sep 15, 2026', applied: false, type: 'Full-Time', tags: ['TypeScript', 'Graph Data', 'Security'] }
];

export const campusEvents: CampusEvent[] = [
  {
    id: 'ev-1',
    title: 'Agentic AI Hackathon 2026',
    type: 'Hackathon',
    date: 'Aug 20-22, 2026',
    time: '48 Hours Continuous',
    venue: 'Innovation Hub Auditorium',
    speaker: 'Sam Altman (Keynote Virtual)',
    organizer: 'AI Club & Computer Society',
    registered: true,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    spotsLeft: 18,
    qrCodeId: 'AGX-HACK-849201'
  },
  {
    id: 'ev-2',
    title: 'Quantum Machine Learning Masterclass',
    type: 'Workshop',
    date: 'Aug 26, 2026',
    time: '02:00 PM - 06:00 PM',
    venue: 'Seminar Hall 3',
    speaker: 'Dr. Michio Kaku (Guest Speaker)',
    organizer: 'Physics & CS Dept',
    registered: false,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    spotsLeft: 42,
    qrCodeId: 'AGX-QML-103942'
  },
  {
    id: 'ev-3',
    title: 'Campus Leadership & Tech Placement Summit',
    type: 'Seminar',
    date: 'Sep 01, 2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Main Campus Convention Center',
    speaker: 'Industry VPs & Tech Leads',
    organizer: 'Training & Placement Cell',
    registered: true,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    spotsLeft: 80,
    qrCodeId: 'AGX-SUMMIT-994821'
  }
];

export const ragDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    title: '2026 Academic Ordinance & Grading Policy.pdf',
    category: 'Regulations',
    date: 'Aug 01, 2026',
    size: '4.2 MB',
    indexed: true,
    citations: 340,
    summary: 'Defines relative grading curves, minimum 75% attendance threshold, grade replacement rules, and honors degree criteria.',
    author: 'Dean of Academic Affairs'
  },
  {
    id: 'doc-2',
    title: 'Hostel Curfew & Smart Access Pass Rules.pdf',
    category: 'Circulars',
    date: 'Jul 28, 2026',
    size: '1.8 MB',
    indexed: true,
    citations: 185,
    summary: 'Specifies biometrics gate pass deadlines (10:30 PM), night leave request workflow via AgentX app, and emergency contact procedures.',
    author: 'Chief Hostel Warden'
  },
  {
    id: 'doc-3',
    title: 'Placement Drive Eligibility & Code of Conduct 2026.pdf',
    category: 'Policies',
    date: 'Jul 15, 2026',
    size: '3.1 MB',
    indexed: true,
    citations: 412,
    summary: 'Guidelines on one-student-one-job policy, dream company upgrade rules, interview dress code, and penalty clauses for no-shows.',
    author: 'Placement Cell Directorate'
  },
  {
    id: 'doc-4',
    title: 'Central Library E-Resource & Springer Access Guide.pdf',
    category: 'FAQs',
    date: 'Jun 10, 2026',
    size: '2.4 MB',
    indexed: true,
    citations: 94,
    summary: 'Instructions for VPN setup, remote IEEE/ACM digital library login, and automated book reservation through the AgentX bot.',
    author: 'University Librarian'
  }
];

export const sampleWorkflowSteps: WorkflowStep[] = [
  { id: 1, label: 'User Query Received', agent: 'User Interface', status: 'completed', timestamp: '09:20:01 AM', durationMs: 12, details: '"Can I get leave for the OpenAI hackathon next weekend without losing my attendance eligibility?"' },
  { id: 2, label: 'Intent Detection & Disambiguation', agent: 'Orchestrator Agent', status: 'completed', timestamp: '09:20:02 AM', durationMs: 45, details: 'Intent classified: [Academic Leave Request] + [Attendance Policy Check] + [Hackathon Validation]' },
  { id: 3, label: 'Fetch Academic Attendance', agent: 'Academic Agent', status: 'completed', timestamp: '09:20:02 AM', durationMs: 110, details: 'Current CS401 attendance: 88%. Missing 2 lectures leaves attendance at 82.5% (Safe > 75%).' },
  { id: 4, label: 'Knowledge Base Search (RAG)', agent: 'Knowledge (RAG) Agent', status: 'completed', timestamp: '09:20:03 AM', durationMs: 95, details: 'Queried "Academic Ordinance 2026 - Duty Leave for Hackathons". Exemption clause 4.2 grants duty leave for approved events.' },
  { id: 5, label: 'Verify Event Ticket Status', agent: 'Events Agent', status: 'completed', timestamp: '09:20:03 AM', durationMs: 60, details: 'Confirmed registration for Agentic AI Hackathon 2026 (Ticket #AGX-HACK-849201).' },
  { id: 6, label: 'Draft Leave Approval Request', agent: 'Communication Agent', status: 'completed', timestamp: '09:20:04 AM', durationMs: 130, details: 'Generated official Duty Leave application letter addressed to Dr. Alan Turing.' },
  { id: 7, label: 'Send Alert & Dispatch', agent: 'Notification Agent', status: 'completed', timestamp: '09:20:04 AM', durationMs: 30, details: 'Sent push alert to student phone and queued approval email to HOD portal.' }
];

export const notificationsList: NotificationItem[] = [
  { id: 'n-1', title: 'Exam Hall Ticket Released', message: 'Your hall ticket for Deep Learning (CS401) is ready for download.', category: 'Exams', timestamp: '10 mins ago', read: false, priority: 'high' },
  { id: 'n-2', title: 'OpenAI Campus Placement Drive', message: 'Application deadline extended to Aug 25. Upload your updated ATS resume now.', category: 'Placements', timestamp: '45 mins ago', read: false, priority: 'high' },
  { id: 'n-3', title: 'Attendance Alert: CS404 Quantum Info', message: 'Your attendance in CS404 is at 72%. Attend next 2 lectures to cross 75%.', category: 'Attendance', timestamp: '2 hours ago', read: true, priority: 'medium' },
  { id: 'n-4', title: 'Hostel Gate Pass Approved', message: 'Weekend Outing pass #8492 approved by Warden. Valid till Aug 10, 10:00 PM.', category: 'Hostel', timestamp: '5 hours ago', read: true, priority: 'low' },
  { id: 'n-5', title: 'Library Book Overdue Warning', message: '"Quantum Computation and Quantum Information" is due tomorrow.', category: 'Library', timestamp: '1 day ago', read: true, priority: 'medium' }
];

export const auditLogs: AuditLog[] = [
  { id: 'aud-1', user: 'alex.student@campus.edu', action: 'RAG Search: "Duty leave policy"', agent: 'Knowledge Agent', timestamp: '2026-08-07 13:10:22', status: 'SUCCESS', ip: '192.168.1.104' },
  { id: 'aud-2', user: 'system.orchestrator', action: 'Vector Index Re-embedding', agent: 'RAG Agent', timestamp: '2026-08-07 12:45:00', status: 'SUCCESS', ip: '10.0.4.12' },
  { id: 'aud-3', user: 'alex.student@campus.edu', action: 'Resume ATS Analysis Upload', agent: 'Placement Agent', timestamp: '2026-08-07 11:30:15', status: 'SUCCESS', ip: '192.168.1.104' },
  { id: 'aud-4', user: 'warden.hostel@campus.edu', action: 'Gate Pass #8492 Status Update', agent: 'Services Agent', timestamp: '2026-08-07 09:15:40', status: 'SUCCESS', ip: '192.168.2.14' }
];

// Recharts dummy data
export const attendanceTrendData = [
  { month: 'Jan', attendance: 82, target: 75 },
  { month: 'Feb', attendance: 85, target: 75 },
  { month: 'Mar', attendance: 79, target: 75 },
  { month: 'Apr', attendance: 88, target: 75 },
  { month: 'May', attendance: 91, target: 75 },
  { month: 'Jun', attendance: 86, target: 75 },
  { month: 'Jul', attendance: 89, target: 75 }
];

export const placementStatsData = [
  { branch: 'CS / AI', placed: 96, avgPackage: 28 },
  { branch: 'ECE', placed: 88, avgPackage: 21 },
  { branch: 'EEE', placed: 82, avgPackage: 18 },
  { branch: 'Mech', placed: 75, avgPackage: 14 },
  { branch: 'Civil', placed: 70, avgPackage: 12 }
];

export const agentActivityData = [
  { name: 'Mon', academic: 320, placement: 240, RAG: 510, services: 180 },
  { name: 'Tue', academic: 450, placement: 310, RAG: 620, services: 230 },
  { name: 'Wed', academic: 510, placement: 420, RAG: 750, services: 310 },
  { name: 'Thu', academic: 480, placement: 380, RAG: 690, services: 290 },
  { name: 'Fri', academic: 600, placement: 490, RAG: 890, services: 410 },
  { name: 'Sat', academic: 210, placement: 150, RAG: 340, services: 120 },
  { name: 'Sun', academic: 180, placement: 110, RAG: 280, services: 90 }
];

export const weeklyRequestsData = [
  { day: 'Mon', requests: 4200, responseMs: 95 },
  { day: 'Tue', requests: 5800, responseMs: 88 },
  { day: 'Wed', requests: 7100, responseMs: 74 },
  { day: 'Thu', requests: 6400, responseMs: 81 },
  { day: 'Fri', requests: 8900, responseMs: 68 },
  { day: 'Sat', requests: 3100, responseMs: 110 },
  { day: 'Sun', requests: 2400, responseMs: 105 }
];
