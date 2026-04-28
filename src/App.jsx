import React, { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Database,
  Download,
  Edit3,
  Eye,
  FileAudio,
  FileText,
  Gauge,
  History,
  Info,
  ListChecks,
  LockKeyhole,
  Mail,
  Mic2,
  PanelRightOpen,
  PenLine,
  PieChart as PieChartIcon,
  RefreshCw,
  SearchCheck,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Users,
  X
} from "lucide-react";

const meetings = [
  {
    id: "sterling",
    time: "10:00 AM",
    client: "Sterling Family",
    type: "Quarterly review",
    aum: "$28.4M",
    status: "Brief Prepared",
    badge: "ready",
    prep: 100,
    prepNote: "9 sources synced"
  },
  {
    id: "chen",
    time: "1:00 PM",
    client: "Elaine Chen Trust",
    type: "Estate liquidity review",
    aum: "$14.8M",
    status: "Preparing Brief",
    badge: "preparing",
    prep: 68,
    prepNote: "68% synced · ETA 12 min"
  },
  {
    id: "morrison",
    time: "3:30 PM",
    client: "Morrison Holdings LLC",
    type: "Tax planning call",
    aum: "$41.2M",
    status: "Brief Pending",
    badge: "pending",
    prep: 24,
    prepNote: "24% synced · retry available"
  }
];

const activity = [
  "AI has prepared Sterling Family quarterly brief from 9 connected sources",
  "Flagged allocation drift in Chen Trust taxable account",
  "Created review queue entry for Morrison charitable trust memo",
  "Synced 4 approved updates to Salesforce Financial Services Cloud"
];

const alerts = [
  {
    title: "Tax-loss harvesting window",
    client: "Sterling Family",
    severity: "opportunity",
    impact: "$42K estimated offset",
    detail: "Municipal bond sleeve shows harvestable losses without altering income target."
  },
  {
    title: "Allocation drift",
    client: "Sterling Family",
    severity: "risk",
    impact: "+6.8% public equity",
    detail: "Portfolio now exceeds model tolerance after recent market movement."
  }
];

const allocationData = [
  { name: "Public Equity", current: 44, target: 38 },
  { name: "Fixed Income", current: 27, target: 31 },
  { name: "Alternatives", current: 18, target: 20 },
  { name: "Cash", current: 6, target: 6 },
  { name: "Private Credit", current: 5, target: 5 }
];

const exposureData = [
  { name: "Equity", value: 44, color: "#2563eb" },
  { name: "Income", value: 27, color: "#0f766e" },
  { name: "Alts", value: 18, color: "#a16207" },
  { name: "Cash", value: 6, color: "#64748b" },
  { name: "Credit", value: 5, color: "#7c3aed" }
];

const productivityData = [
  { week: "W1", saved: 6.5 },
  { week: "W2", saved: 8.2 },
  { week: "W3", saved: 9.1 },
  { week: "W4", saved: 10.4 }
];

const cashFlowData = [
  { month: "Jan", portfolio: 27.6 },
  { month: "Feb", portfolio: 27.9 },
  { month: "Mar", portfolio: 28.1 },
  { month: "Apr", portfolio: 28.4 }
];

const sampleNotes =
  "Sterling quarterly review finished at 10:52 AM. Robert and Anne want to reduce overall portfolio risk after the sale of Anne's dental practice. Robert asked whether we can move roughly $250,000 from the family trust to their operating account by May 3 for the Stanford housing deposit and planned renovation invoice. They also want a short written summary of the tax-loss harvesting opportunity in the municipal bond sleeve. Confirmed that their daughter Maya accepted Stanford and starts in September. Update CRM risk tolerance from Moderate to Conservative and ask Daniel to prepare transfer paperwork.";

const defaultAgenda = [
  "Review liquidity needs tied to Stanford housing and renovation payments",
  "Discuss risk tolerance shift after dental practice sale",
  "Evaluate municipal bond tax-loss harvesting opportunity",
  "Confirm next steps for trust account transfer paperwork"
];

const defaultTaskDraft = {
  assignee: "Daniel Reed, CSA",
  amount: "$250,000",
  dueDate: "May 3, 2026"
};

const defaultEmailDraft =
  "Hi Robert and Anne,\n\nThank you for the productive quarterly review today. I will have Daniel prepare the trust transfer paperwork for the planned $250,000 movement by May 3. We will also send a concise analysis of the municipal bond tax-loss harvesting opportunity and how it preserves the income target.\n\nBest,\nSarah";

const defaultEmailEnvelope = {
  from: "Sarah Mitchell <sarah.mitchell@aequitas.demo>",
  to: ["Robert Sterling <robert.sterling@example.com>", "Anne Sterling <anne.sterling@example.com>"],
  cc: ["Daniel Reed, CSA <daniel.reed@aequitas.demo>"],
  bcc: [],
  subject: "Sterling quarterly review follow-up",
  signature: "Sarah Mitchell\nSenior Wealth Advisor\nAequitas Private Wealth"
};

const initialActions = [
  {
    id: "crm",
    title: "CRM Update",
    icon: Database,
    tone: "blue",
    summary: "Update risk tolerance from Moderate to Conservative",
    confidence: 94,
    confidenceRationale:
      "Strong source match between meeting note and CRM field; explicit client language; no contradicting signal.",
    evidence: "Meeting note: reduce overall portfolio risk",
    status: "pending"
  },
  {
    id: "task",
    title: "Task Creation",
    icon: ListChecks,
    tone: "violet",
    summary: "Prepare transfer paperwork for Sterling Family trust",
    confidence: 91,
    confidenceRationale:
      "Named owner, amount, account source, and due date were detected in a single note segment.",
    evidence: "Meeting note: move roughly $250,000 by May 3",
    status: "pending"
  },
  {
    id: "email",
    title: "Email Draft",
    icon: Mail,
    tone: "teal",
    summary: "Send follow-up summary with tax-loss harvesting next steps",
    confidence: 88,
    confidenceRationale:
      "Clear follow-up request matched to portfolio alert; lower score because final recipient list still needs advisor review.",
    evidence: "Meeting note: short written summary of the tax-loss harvesting opportunity",
    status: "pending"
  }
];

const scenarioConfigs = {
  sterling: {
    id: "sterling",
    label: "Sterling Family",
    notesLabel: "Scenario B",
    audioFile: "sterling-review-audio.m4a",
    meetingTime: "10:00 AM",
    crmFieldLabel: "Risk Tolerance",
    crmBefore: "Moderate",
    crmAfter: "Conservative",
    crmOptions: ["Conservative", "Moderate", "Growth"],
    sampleNotes,
    noteKeywords: ["sterling", "250,000", "stanford", "risk tolerance"],
    taskDraft: defaultTaskDraft,
    emailDraft: defaultEmailDraft,
    emailEnvelope: defaultEmailEnvelope,
    actions: initialActions
  },
  chen: {
    id: "chen",
    label: "Elaine Chen Trust",
    notesLabel: "Scenario C",
    audioFile: "chen-estate-liquidity.m4a",
    meetingTime: "1:00 PM",
    crmFieldLabel: "Planning Status",
    crmBefore: "Standard Review",
    crmAfter: "Estate Escalation",
    crmOptions: ["Estate Escalation", "Liquidity Watch", "Standard Review"],
    sampleNotes:
      "Elaine Chen estate liquidity review completed at 1:42 PM. Elaine wants to model estate-tax liquidity under a compressed timeline because the trust owns several illiquid real estate partnerships. She asked the team to prepare a $1.2M liquidity ladder by May 10 and compare borrowing against the credit line versus staged partnership distributions. Update the planning status to Estate Escalation and send Elaine a concise summary of the liquidity options with next steps for her CPA.",
    noteKeywords: ["chen", "estate", "1.2m", "liquidity ladder"],
    taskDraft: {
      assignee: "Priya Shah, CSA",
      amount: "$1,200,000",
      dueDate: "May 10, 2026"
    },
    emailDraft:
      "Hi Elaine,\n\nThank you for reviewing the trust liquidity plan today. We will prepare the $1.2M liquidity ladder by May 10 and compare the credit-line option against staged partnership distributions. I will also coordinate the summary with your CPA so the estate-tax timing assumptions are clear.\n\nBest,\nSarah",
    emailEnvelope: {
      from: "Sarah Mitchell <sarah.mitchell@aequitas.demo>",
      to: ["Elaine Chen <elaine.chen@example.com>"],
      cc: ["Priya Shah, CSA <priya.shah@aequitas.demo>"],
      bcc: [],
      subject: "Chen trust liquidity review next steps",
      signature: "Sarah Mitchell\nSenior Wealth Advisor\nAequitas Private Wealth"
    },
    actions: [
      {
        ...initialActions[0],
        summary: "Update planning status to Estate Escalation",
        confidence: 92,
        confidenceRationale:
          "Clear client request, named trust context, and estate-liquidity timing matched CRM planning status.",
        evidence: "Meeting note: update Chen planning status to Estate Escalation",
        status: "pending"
      },
      {
        ...initialActions[1],
        summary: "Prepare $1.2M liquidity ladder by May 10",
        confidence: 90,
        confidenceRationale:
          "Amount, owner queue, due date, and analysis type were all detected in the note.",
        evidence: "Meeting note: prepare a $1.2M liquidity ladder by May 10",
        status: "pending"
      },
      {
        ...initialActions[2],
        summary: "Send trust liquidity options summary to Elaine",
        confidence: 86,
        confidenceRationale:
          "Communication request is explicit, but CPA coordination remains advisor-confirmed.",
        evidence: "Meeting note: send Elaine a concise summary of the liquidity options",
        status: "pending"
      }
    ]
  },
  morrison: {
    id: "morrison",
    label: "Morrison Holdings LLC",
    notesLabel: "Scenario D",
    audioFile: "morrison-tax-planning.m4a",
    meetingTime: "3:30 PM",
    crmFieldLabel: "Review Theme",
    crmBefore: "Standard Review",
    crmAfter: "Tax Planning",
    crmOptions: ["Tax Planning", "Charitable Review", "Standard Review"],
    sampleNotes:
      "Morrison Holdings tax planning call finished at 4:08 PM. The family office wants a charitable trust memo before the next CPA meeting and asked whether the appreciated private credit position can fund the strategy without disrupting cash reserves. Prepare a charitable trust memo by May 17, update the review theme to Tax Planning, and draft a short note summarizing the private credit funding trade-offs.",
    noteKeywords: ["morrison", "charitable trust", "private credit", "tax planning"],
    taskDraft: {
      assignee: "Daniel Reed, CSA",
      amount: "Charitable trust memo",
      dueDate: "May 17, 2026"
    },
    emailDraft:
      "Hi Morrison family office team,\n\nThank you for the tax planning discussion today. We will prepare the charitable trust memo by May 17 and include the private credit funding trade-offs, including the impact on cash reserves and implementation timing.\n\nBest,\nSarah",
    emailEnvelope: {
      from: "Sarah Mitchell <sarah.mitchell@aequitas.demo>",
      to: ["Morrison Family Office <familyoffice@morrison.example.com>"],
      cc: ["Daniel Reed, CSA <daniel.reed@aequitas.demo>"],
      bcc: [],
      subject: "Morrison tax planning follow-up",
      signature: "Sarah Mitchell\nSenior Wealth Advisor\nAequitas Private Wealth"
    },
    actions: [
      {
        ...initialActions[0],
        summary: "Update review theme to Tax Planning",
        confidence: 91,
        confidenceRationale:
          "Review theme and tax planning context are both explicitly present in the meeting note.",
        evidence: "Meeting note: update Morrison review theme to Tax Planning",
        status: "pending"
      },
      {
        ...initialActions[1],
        summary: "Prepare charitable trust memo by May 17",
        confidence: 89,
        confidenceRationale:
          "Deliverable, due date, and family office audience were detected in the same note segment.",
        evidence: "Meeting note: prepare a charitable trust memo by May 17",
        status: "pending"
      },
      {
        ...initialActions[2],
        summary: "Draft private credit funding trade-off note",
        confidence: 84,
        confidenceRationale:
          "Follow-up request is clear, but funding recommendations still require advisor review.",
        evidence: "Meeting note: summarize private credit funding trade-offs",
        status: "pending"
      }
    ]
  }
};

const meetingBriefs = {
  sterling: {
    headline: "Sterling Family",
    eyebrow: "10:00 AM - Quarterly review",
    description:
      "AI brief assembled from CRM, portfolio accounting, calendar, task history, and document vault sources.",
    facts: [
      ["AUM", "$28.4M"],
      ["Relationship since", "2018"],
      ["Risk profile", "Moderate"],
      ["Last contact", "Apr 18, 2026"]
    ],
    callouts: [
      ["blue", "Recent life event", "Maya Sterling accepted to Stanford and starts in September."],
      ["amber", "Outstanding task", "Confirm renovation payment schedule before trust transfer paperwork is opened."],
      ["green", "Client preference", "Prefers concise email summaries with tax and liquidity impacts separated."]
    ],
    allocation: allocationData,
    portfolioInsights: [
      ["green", "Tax-loss opportunity", "$42K estimated offset in municipal bond sleeve with no material income target change."],
      ["amber", "Allocation drift", "Public equity is 6.8 points above policy target after recent market movement."]
    ],
    relationship: [
      { icon: Users, label: "Household", value: "Robert & Anne Sterling" },
      { icon: BriefcaseBusiness, label: "CSA", value: "Daniel Reed" },
      { icon: FileText, label: "CPA", value: "Coordinated by advisor" }
    ],
    documents: [
      { title: "Sterling Family Trust Agreement", type: "Trust", date: "Apr 20, 2026" },
      { title: "Investment Policy Statement", type: "IPS", date: "Nov 14, 2025" },
      { title: "Stanford Housing Estimate", type: "Education", date: "Apr 24, 2026" }
    ],
    interactions: [
      { date: "Apr 27", title: "Quarterly review completed" },
      { date: "Apr 18", title: "Prior call flagged lower-volatility discussion" },
      { date: "Mar 12", title: "Trust distribution task completed" }
    ],
    lifeEvents: [
      { date: "Apr 2026", title: "Maya accepted to Stanford" },
      { date: "Mar 2026", title: "Dental practice sale completed" },
      { date: "Nov 2025", title: "Trust distribution policy updated" }
    ],
    milestones: [
      { date: "May 3", title: "Trust transfer target date" },
      { date: "Sep 14", title: "Stanford tuition funding review" }
    ],
    agenda: defaultAgenda,
    sources: ["Salesforce FSC", "Calendar", "Task history", "Document vault"]
  },
  chen: {
    headline: "Elaine Chen Trust",
    eyebrow: "1:00 PM - Estate liquidity review",
    description:
      "AI brief prepared around estate-tax liquidity, illiquid partnership exposure, credit-line options, and CPA coordination.",
    facts: [
      ["AUM", "$14.8M"],
      ["Relationship since", "2021"],
      ["Planning status", "Estate review"],
      ["Last contact", "Apr 22, 2026"]
    ],
    callouts: [
      ["blue", "Planning pressure", "Estate-tax liquidity timing may compress after the partnership valuation update."],
      ["amber", "Illiquid exposure", "Real estate partnership distributions may not match the payment timeline."],
      ["green", "Client preference", "Prefers scenario tables before making credit-line decisions."]
    ],
    allocation: [
      { name: "Public Equity", current: 31, target: 34 },
      { name: "Fixed Income", current: 24, target: 28 },
      { name: "Alternatives", current: 33, target: 26 },
      { name: "Cash", current: 9, target: 8 },
      { name: "Private Credit", current: 3, target: 4 }
    ],
    portfolioInsights: [
      ["amber", "Illiquidity concentration", "Alternatives are 7 points above target while estate-liquidity needs are time-sensitive."],
      ["blue", "Liquidity ladder needed", "$1.2M near-term estate reserve should be modeled against credit-line draw options."]
    ],
    relationship: [
      { icon: Users, label: "Trust grantor", value: "Elaine Chen" },
      { icon: BriefcaseBusiness, label: "CSA", value: "Priya Shah" },
      { icon: FileText, label: "CPA", value: "Marta Alvarez, CPA" }
    ],
    documents: [
      { title: "Chen Trust Liquidity Plan", type: "Planning", date: "Apr 23, 2026" },
      { title: "Estate Tax Estimate", type: "Tax", date: "Apr 19, 2026" },
      { title: "Partnership Valuation Update", type: "Valuation", date: "Apr 12, 2026" }
    ],
    interactions: [
      { date: "Apr 22", title: "Liquidity planning call completed" },
      { date: "Apr 10", title: "CPA requested estate payment scenario" },
      { date: "Mar 29", title: "Partnership valuation update received" }
    ],
    lifeEvents: [
      { date: "Apr 2026", title: "Partnership valuation updated" },
      { date: "Apr 2026", title: "Estate liquidity review opened" },
      { date: "Mar 2026", title: "Credit-line options refreshed" }
    ],
    milestones: [
      { date: "Jun 15", title: "Estate reserve model due" },
      { date: "Jul 1", title: "CPA decision window" }
    ],
    agenda: [
      "Review estate-tax liquidity timeline and payment assumptions",
      "Compare credit line draw versus staged partnership distributions",
      "Confirm CPA coordination steps and decision owners",
      "Assign liquidity ladder and follow-up summary"
    ],
    sources: ["Salesforce FSC", "Document vault", "Open tasks", "Portfolio alerts"]
  },
  morrison: {
    headline: "Morrison Holdings LLC",
    eyebrow: "3:30 PM - Tax planning call",
    description:
      "AI brief prepared around charitable trust strategy, appreciated private credit exposure, cash reserve tolerance, and CPA follow-up.",
    facts: [
      ["AUM", "$41.2M"],
      ["Entity", "Family LLC"],
      ["Review theme", "Tax planning"],
      ["Last contact", "Apr 19, 2026"]
    ],
    callouts: [
      ["blue", "Planning topic", "Charitable trust memo requested ahead of the next CPA meeting."],
      ["amber", "Funding trade-off", "Appreciated private credit could fund the strategy but may reduce reserve flexibility."],
      ["green", "Client preference", "Family office wants concise memo format with implementation timing."]
    ],
    allocation: [
      { name: "Public Equity", current: 36, target: 35 },
      { name: "Fixed Income", current: 18, target: 22 },
      { name: "Alternatives", current: 22, target: 18 },
      { name: "Cash", current: 7, target: 10 },
      { name: "Private Credit", current: 17, target: 15 }
    ],
    portfolioInsights: [
      ["amber", "Private credit funding trade-off", "Private credit is 2 points above target and may fund the charitable strategy with liquidity caveats."],
      ["blue", "Cash reserve pressure", "Cash is 3 points below target, so funding decisions should preserve the family office reserve floor."]
    ],
    relationship: [
      { icon: Users, label: "Entity", value: "Morrison Family Office" },
      { icon: BriefcaseBusiness, label: "CSA", value: "Daniel Reed" },
      { icon: FileText, label: "Tax counsel", value: "Northstar Tax Counsel" }
    ],
    documents: [
      { title: "Morrison Holdings Operating Agreement", type: "Entity", date: "Apr 16, 2026" },
      { title: "Charitable Trust Memo Draft", type: "Planning", date: "Apr 24, 2026" },
      { title: "YTD Tax Lot Report", type: "Tax", date: "Apr 21, 2026" }
    ],
    interactions: [
      { date: "Apr 19", title: "Family office prep call completed" },
      { date: "Apr 12", title: "CPA timing request logged" },
      { date: "Mar 30", title: "Cash reserve floor reviewed" }
    ],
    lifeEvents: [
      { date: "Apr 2026", title: "Charitable trust strategy requested" },
      { date: "Apr 2026", title: "Private credit funding review opened" },
      { date: "Mar 2026", title: "Reserve floor reconfirmed with family office" }
    ],
    milestones: [
      { date: "May 17", title: "Charitable trust memo due" },
      { date: "Jun 3", title: "CPA implementation review" }
    ],
    agenda: [
      "Review charitable trust memo scope and CPA timing",
      "Discuss private credit funding trade-offs",
      "Confirm cash reserve floor before implementation",
      "Assign memo draft and family office follow-up"
    ],
    sources: ["Salesforce FSC", "IPS", "YTD tax lot report", "Document vault"]
  }
};

const profileTabs = [
  { label: "Overview", enabled: true },
  { label: "Portfolio", enabled: true },
  { label: "Documents", enabled: true },
  { label: "Interactions", enabled: true },
  { label: "AI Insights", enabled: true }
];
const sessionStorageKey = "aequitas-ai-demo-session-v2";
const minimumNoteCharacters = 80;
const sourceRecords = {
  "Salesforce FSC": {
    system: "Salesforce Financial Services Cloud",
    record: "Household profile · Sterling Family",
    updated: "Apr 18, 2026",
    details: ["Risk profile: Moderate", "Relationship since: 2018", "Last advisor call logged by Sarah Mitchell"]
  },
  Calendar: {
    system: "Advisor calendar",
    record: "Quarterly review · 10:00 AM",
    updated: "Apr 27, 2026",
    details: ["Attendees: Robert Sterling, Anne Sterling, Sarah Mitchell", "Location: Office conference room"]
  },
  "Task history": {
    system: "Service task queue",
    record: "Open and completed Sterling service tasks",
    updated: "Apr 26, 2026",
    details: ["Renovation invoice schedule pending", "Prior trust distribution task completed Mar 12"]
  },
  "Tax lot report": {
    system: "Tax lot report",
    record: "Municipal bond sleeve unrealized loss review",
    updated: "Apr 25, 2026",
    details: ["Estimated harvestable loss: $42K", "Income target preserved after proposed swap"]
  },
  Orion: {
    system: "Orion portfolio accounting",
    record: "Sterling consolidated allocation",
    updated: "Apr 26, 2026",
    details: ["Public equity: 44%", "Target public equity: 38%", "Allocation drift: +6.8%"]
  },
  "Black Diamond": {
    system: "Black Diamond performance",
    record: "Sterling household performance dashboard",
    updated: "Apr 26, 2026",
    details: ["Quarter-to-date portfolio value: $28.4M", "Month-over-month value change: +$300K"]
  },
  IPS: {
    system: "Investment Policy Statement",
    record: "Sterling IPS · 2025 revision",
    updated: "Nov 14, 2025",
    details: ["Equity target: 38%", "Rebalance tolerance: ±5%", "Liquidity reserve: 6%"]
  },
  "YTD tax lot report": {
    system: "Tax lot report",
    record: "YTD gains/losses by sleeve",
    updated: "Apr 25, 2026",
    details: ["Realized gains YTD: $118K", "Offset opportunity identified in municipal bond sleeve"]
  },
  "Document vault": {
    system: "Document vault",
    record: "Sterling trust and education planning documents",
    updated: "Apr 20, 2026",
    details: ["Family trust agreement on file", "Stanford housing estimate uploaded"]
  },
  "CRM notes": {
    system: "CRM interaction notes",
    record: "Advisor call notes",
    updated: "Apr 18, 2026",
    details: ["Discussed lower volatility after practice sale", "Flagged Stanford planning milestone"]
  },
  "Portfolio alerts": {
    system: "Aequitas AI alert engine",
    record: "Tax-loss and allocation drift alerts",
    updated: "Apr 27, 2026",
    details: ["Tax-loss alert: Opportunity", "Allocation drift alert: Risk"]
  },
  "Open tasks": {
    system: "CSA task queue",
    record: "Sterling open service tasks",
    updated: "Apr 27, 2026",
    details: ["Daniel Reed assigned to transfer paperwork", "Due date: May 3, 2026"]
  },
  "Advisor approval required": {
    system: "Approval policy",
    record: "Human-in-the-loop guardrail",
    updated: "Always on",
    details: ["No email, CRM write-back, or task creation occurs without advisor decision"]
  },
  "Audit record AEQ-0427-1000": {
    system: "Immutable audit ledger",
    record: "AEQ-0427-1000",
    updated: "Apr 27, 2026",
    details: [
      "Brief generated from 9 connected sources",
      "Advisor approval required for downstream actions",
      "Source access and approval decisions are retained in the session log"
    ]
  }
};

const sourceRecordDetails = {
  "Salesforce FSC": {
    owner: "Sarah Mitchell",
    timestamp: "Apr 18, 2026, 2:14 PM",
    excerpt: "Prior call note: Robert and Anne asked to revisit volatility after the practice sale.",
    highlight: "revisit volatility",
    link: "salesforce://households/sterling-family",
    schema: ["householdId", "crmField", "previousValue", "sourceNoteId", "lastUpdatedBy"]
  },
  Orion: {
    owner: "Orion nightly sync",
    timestamp: "Apr 26, 2026, 9:03 PM",
    excerpt: "Sterling consolidated allocation: public equity 44.8% versus policy target 38.0%.",
    highlight: "public equity 44.8%",
    link: "orion://accounts/sterling/allocation",
    schema: ["householdId", "assetClass", "currentWeight", "targetWeight", "driftBand"]
  },
  "Task history": {
    owner: "Daniel Reed, CSA",
    timestamp: "Apr 26, 2026, 4:32 PM",
    excerpt: "Open service history shows prior trust distribution completed and renovation invoice timing pending.",
    highlight: "renovation invoice timing pending",
    link: "tasks://sterling-family/history",
    schema: ["taskId", "assignee", "status", "dueDate", "auditEvents"]
  },
  "Tax lot report": {
    owner: "Portfolio operations",
    timestamp: "Apr 25, 2026, 6:10 PM",
    excerpt: "Municipal bond sleeve includes harvestable losses while preserving income target through swap candidates.",
    highlight: "harvestable losses",
    link: "taxlots://sterling/muni-sleeve",
    schema: ["lotId", "unrealizedGainLoss", "washSaleFlag", "replacementCusip", "taxYear"]
  },
  "Document vault": {
    owner: "Document vault sync",
    timestamp: "Apr 20, 2026, 11:25 AM",
    excerpt: "Sterling family trust agreement and Stanford housing estimate are both available for briefing evidence.",
    highlight: "Stanford housing estimate",
    link: "vault://sterling-family/documents",
    schema: ["documentId", "documentType", "effectiveDate", "accessPolicy", "sourceHash"]
  },
  "CRM notes": {
    owner: "Sarah Mitchell",
    timestamp: "Apr 18, 2026, 2:14 PM",
    excerpt: "Advisor note records lower-volatility discussion and the upcoming Stanford planning milestone.",
    highlight: "lower-volatility discussion",
    link: "salesforce://interactions/sterling-apr-18",
    schema: ["interactionId", "noteAuthor", "noteTimestamp", "excerpt", "linkedHousehold"]
  },
  "Portfolio alerts": {
    owner: "Aequitas AI alert engine",
    timestamp: "Apr 27, 2026, 7:05 AM",
    excerpt: "Two alerts promoted for advisor review: tax-loss opportunity and allocation drift.",
    highlight: "allocation drift",
    link: "aequitas://alerts/sterling-family",
    schema: ["alertId", "severity", "sourceSystem", "detectedAt", "advisorDisposition"]
  },
  "Open tasks": {
    owner: "Daniel Reed, CSA",
    timestamp: "Apr 27, 2026, 8:40 AM",
    excerpt: "Client Service Associate intake queue for operational execution and audit follow-up.",
    highlight: "Client Service Associate intake queue",
    link: "tasks://csa-queue/sterling-family",
    schema: ["queueId", "assignee", "client", "taskType", "approvalRecordId"]
  },
  "Advisor approval required": {
    owner: "Compliance policy",
    timestamp: "Always on",
    excerpt: "Human approval is required before email send, CRM write-back, or task creation.",
    highlight: "Human approval is required",
    link: "policy://approval-controls/hitl",
    schema: ["policyId", "actionType", "requiredRole", "decisionReason", "auditRecordId"]
  },
  "Audit record AEQ-0427-1000": {
    owner: "Aequitas audit ledger",
    timestamp: "Apr 27, 2026, 10:00 AM",
    excerpt: "Brief generation, source reads, advisor edits, and approval decisions are retained in an immutable event log.",
    highlight: "immutable event log",
    link: "audit://records/AEQ-0427-1000",
    schema: ["auditRecordId", "eventType", "actorId", "sourceHash", "decisionPayload"]
  },
  "Meeting note: reduce overall portfolio risk": {
    owner: "Sarah Mitchell",
    timestamp: "Apr 27, 2026, 10:52 AM",
    excerpt: "Robert and Anne want to reduce overall portfolio risk after the sale of Anne's dental practice.",
    highlight: "reduce overall portfolio risk",
    link: "notes://meeting/AEQ-0427-1000#risk",
    schema: ["noteId", "speaker", "sentenceOffset", "extractedField", "confidenceInputs"]
  },
  "Meeting note: move roughly $250,000 by May 3": {
    owner: "Sarah Mitchell",
    timestamp: "Apr 27, 2026, 10:52 AM",
    excerpt: "Robert asked whether we can move roughly $250,000 from the family trust by May 3.",
    highlight: "$250,000",
    link: "notes://meeting/AEQ-0427-1000#transfer",
    schema: ["noteId", "amount", "dueDate", "sourceAccount", "requestedOwner"]
  },
  "Meeting note: short written summary of the tax-loss harvesting opportunity": {
    owner: "Sarah Mitchell",
    timestamp: "Apr 27, 2026, 10:52 AM",
    excerpt: "They want a short written summary of the tax-loss harvesting opportunity in the municipal bond sleeve.",
    highlight: "short written summary",
    link: "notes://meeting/AEQ-0427-1000#email",
    schema: ["noteId", "requestedCommunication", "topic", "recipientSet", "sendApprovalId"]
  }
};

function buildSourceRecord(source) {
  const base = sourceRecords[source] || {
    system: source.startsWith("Meeting note") ? "Meeting notes" : "Evidence source",
    record: source,
    updated: "Current validation session",
    details: ["This evidence item is tied to the current scripted validation scenario."]
  };
  const detail = sourceRecordDetails[source] || {};

  return {
    owner: detail.owner || "Aequitas validation data",
    timestamp: detail.timestamp || base.updated,
    excerpt:
      detail.excerpt ||
      base.details?.[0] ||
      "Structured source data will be mapped during production integration.",
    highlight: detail.highlight || "",
    link: detail.link || "mock://source-record",
    schema:
      detail.schema || ["sourceSystem", "recordId", "timestamp", "owner", "evidenceExcerpt"],
    ...base
  };
}

function renderHighlightedExcerpt(excerpt, highlight) {
  if (!highlight) return excerpt;
  const index = excerpt.indexOf(highlight);
  if (index === -1) return excerpt;
  const before = excerpt.slice(0, index);
  const after = excerpt.slice(index + highlight.length);
  return (
    <>
      {before}
      <mark>{highlight}</mark>
      {after}
    </>
  );
}
const focusableModalSelector =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapModalFocus(event) {
  if (event.key !== "Tab") return;
  const focusable = Array.from(event.currentTarget.querySelectorAll(focusableModalSelector));
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function isScenarioInput(notes, audioSelected, scenario) {
  const normalized = notes.toLowerCase();
  return audioSelected || scenario.noteKeywords.some((keyword) => normalized.includes(keyword));
}

function readStoredSession() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(sessionStorageKey) || "{}");
  } catch {
    return {};
  }
}

function hydrateActions(storedActions) {
  if (!Array.isArray(storedActions)) return initialActions;
  const initialActionById = Object.fromEntries(initialActions.map((action) => [action.id, action]));
  return storedActions
    .filter((action) => initialActionById[action.id])
    .map((action) => ({
      ...initialActionById[action.id],
      ...action,
      icon: initialActionById[action.id].icon
    }));
}

function serializeActions(actions) {
  return actions.map(({ icon, ...action }) => action);
}

function App() {
  const [initialSession] = useState(readStoredSession);
  const toastTimerRef = useRef(null);
  const [view, setView] = useState(initialSession.view || "dashboard");
  const [toast, setToast] = useState("");
  const [liveMessage, setLiveMessage] = useState("");
  const [debugMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("debug") === "1";
  });
  const [activeProfileTab, setActiveProfileTab] = useState(
    initialSession.activeProfileTab || "AI Insights"
  );
  const [meetingFocusSection, setMeetingFocusSection] = useState(null);
  const [activeMeetingId, setActiveMeetingId] = useState(initialSession.activeMeetingId || "sterling");
  const [activeNotesMeetingId, setActiveNotesMeetingId] = useState(
    initialSession.activeNotesMeetingId || "sterling"
  );
  const [executionMeetingId, setExecutionMeetingId] = useState(
    initialSession.executionMeetingId || "sterling"
  );
  const [agenda, setAgenda] = useState(initialSession.agenda || defaultAgenda);
  const [agendaAudit, setAgendaAudit] = useState(initialSession.agendaAudit || {});
  const [editingAgenda, setEditingAgenda] = useState(null);
  const [editingAgendaDraft, setEditingAgendaDraft] = useState("");
  const [sections, setSections] = useState(initialSession.sections || {
    snapshot: true,
    portfolio: true,
    agenda: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSelected, setAudioSelected] = useState(initialSession.audioSelected || false);
  const [notes, setNotes] = useState(initialSession.notes || "");
  const [notesError, setNotesError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [actions, setActions] = useState(hydrateActions(initialSession.actions));
  const [extractionMode, setExtractionMode] = useState(initialSession.extractionMode || "scripted");
  const [riskTolerance, setRiskTolerance] = useState(initialSession.riskTolerance || "Conservative");
  const [taskDraft, setTaskDraft] = useState(initialSession.taskDraft || defaultTaskDraft);
  const [emailDraft, setEmailDraft] = useState(initialSession.emailDraft || defaultEmailDraft);
  const [emailEnvelope, setEmailEnvelope] = useState(
    initialSession.emailEnvelope || defaultEmailEnvelope
  );
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSendConfirmOpen, setEmailSendConfirmOpen] = useState(false);
  const [approveAllConfirmOpen, setApproveAllConfirmOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [sourcePanel, setSourcePanel] = useState(null);
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [presentationReadyByMeeting, setPresentationReadyByMeeting] = useState(() => {
    if (initialSession.presentationReadyByMeeting) return initialSession.presentationReadyByMeeting;
    return initialSession.presentationReady ? { sterling: true } : {};
  });
  const [activeDeckMeetingId, setActiveDeckMeetingId] = useState(
    initialSession.activeDeckMeetingId || "sterling"
  );
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [csaQueueOpen, setCsaQueueOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState(initialSession.recentActivity || activity);
  const [syncRetries, setSyncRetries] = useState(initialSession.syncRetries || {});

  const completedCount = actions.filter((action) => action.status === "complete").length;
  const rejectedCount = actions.filter((action) => action.status === "rejected").length;
  const changesCount = actions.filter((action) => action.status === "changes").length;
  const draftCount = actions.filter((action) => action.status === "draft").length;
  const pendingCount = actions.filter((action) =>
    ["pending", "draft", "approving"].includes(action.status)
  ).length;
  const batchApprovableActions = actions.filter(
    (action) => action.id !== "email" && ["pending", "draft"].includes(action.status)
  );
  const activePresentationReady = Boolean(presentationReadyByMeeting[activeMeetingId]);

  useEffect(() => {
    const nextSession = {
      view,
      activeProfileTab,
      activeMeetingId,
      activeNotesMeetingId,
      executionMeetingId,
      agenda,
      agendaAudit,
      sections,
      audioSelected,
      notes,
      actions: serializeActions(actions),
      extractionMode,
      riskTolerance,
      taskDraft,
      emailDraft,
      emailEnvelope,
      presentationReadyByMeeting,
      activeDeckMeetingId,
      recentActivity,
      syncRetries
    };
    window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(nextSession));
  }, [
    view,
    activeProfileTab,
    activeMeetingId,
    activeNotesMeetingId,
    executionMeetingId,
    agenda,
    agendaAudit,
    sections,
    audioSelected,
    notes,
    actions,
    extractionMode,
    riskTolerance,
    taskDraft,
    emailDraft,
    emailEnvelope,
    presentationReadyByMeeting,
    activeDeckMeetingId,
    recentActivity,
    syncRetries
  ]);

  useEffect(() => {
    if (!notificationsOpen) return undefined;

    function closeOnOutsideClick(event) {
      if (!(event.target instanceof Element)) return;
      const insidePanel = event.target.closest(".notifications-panel");
      const trigger = event.target.closest(".notification-trigger");
      if (!insidePanel && !trigger) {
        setNotificationsOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function navigate(nextView, options = {}) {
    if (nextView === "profile") {
      setActiveProfileTab(options.tab || "AI Insights");
      if (options.meetingId) {
        setActiveMeetingId(options.meetingId);
      }
    }
    if (nextView === "meeting") {
      if (options.meetingId) {
        setActiveMeetingId(options.meetingId);
      }
      if (options.focusSection) {
        setMeetingFocusSection(options.focusSection);
        setSections((current) => ({ ...current, [options.focusSection]: true }));
      } else {
        setMeetingFocusSection(null);
      }
    } else {
      setMeetingFocusSection(null);
    }
    if (nextView === "notes" && options.meetingId) {
      setActiveNotesMeetingId(options.meetingId);
    }
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView(nextView);
  }

  function showToast(message) {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(message);
    setLiveMessage(message);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 4200);
  }

  function generatePresentation() {
    const brief = meetingBriefs[activeMeetingId] || meetingBriefs.sterling;
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      setPresentationReadyByMeeting((current) => ({ ...current, [activeMeetingId]: true }));
      setActiveDeckMeetingId(activeMeetingId);
      setDeckModalOpen(true);
      const activityItem = `Generated ${brief.headline} client presentation package`;
      setRecentActivity((current) => [
        activityItem,
        ...current.filter((item) => item !== activityItem)
      ]);
      showToast(`${brief.headline} presentation ready. Review or download from the preview.`);
    }, 2000);
  }

  function handleRetrySync(meetingId) {
    const startingProgress = meetings.find((meeting) => meeting.id === meetingId)?.prep || 0;
    const nextProgress = Math.min(100, startingProgress + 7);
    setSyncRetries((current) => ({
      ...current,
      [meetingId]: { status: "syncing", progress: nextProgress }
    }));
    setLiveMessage(`${meetingBriefs[meetingId]?.headline || "Brief"} source sync retry started.`);
    window.setTimeout(() => {
      setSyncRetries((current) => ({
        ...current,
        [meetingId]: { status: "queued", progress: Math.min(100, nextProgress + 3) }
      }));
      showToast(`${meetingBriefs[meetingId]?.headline || "Brief"} sync retried. Progress moved to ${Math.min(100, nextProgress + 3)}%.`);
    }, 900);
  }

  function processNotes() {
    const trimmedNotes = notes.trim();
    const hasEnoughInput = trimmedNotes.length >= minimumNoteCharacters || audioSelected;
    const selectedScenario = scenarioConfigs[activeNotesMeetingId] || scenarioConfigs.sterling;
    if (!hasEnoughInput) {
      setNotesError(
        `Add at least ${minimumNoteCharacters} characters of notes or select an audio file before processing.`
      );
      return;
    }

    setNotesError("");
    setProcessing(true);
    setProgress(0);
    setLiveMessage("Analyzing meeting notes, 0 percent complete.");
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / 3000) * 100));
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        window.clearInterval(timer);
        setProcessing(false);
        if (isScenarioInput(trimmedNotes, audioSelected, selectedScenario)) {
          setActions(selectedScenario.actions);
          setExtractionMode("scripted");
          setExecutionMeetingId(selectedScenario.id);
          setRiskTolerance(selectedScenario.crmAfter);
          setTaskDraft(selectedScenario.taskDraft);
          setEmailDraft(selectedScenario.emailDraft);
          setEmailEnvelope(selectedScenario.emailEnvelope);
          setLiveMessage(`AI extracted three ${selectedScenario.label} actions for advisor review.`);
        } else {
          setActions([]);
          setExtractionMode("needs_review");
          setLiveMessage("No confident actions were extracted. Human review is needed.");
        }
        navigate("actions");
      }
    }, 120);
  }

  function approveAction(id) {
    const targetAction = actions.find((action) => action.id === id);
    setLiveMessage(`Approving ${targetAction?.title || "action"}.`);
    setActions((current) =>
      current.map((action) =>
        action.id === id ? { ...action, status: "approving" } : action
      )
    );
    window.setTimeout(() => {
      setActions((current) => {
        const nextActions = current.map((action) =>
          action.id === id ? { ...action, status: "complete", reviewNote: "" } : action
        );
        setLiveMessage(`${targetAction?.title || "Action"} approved and logged.`);
        if (nextActions.every((action) => action.status === "complete")) {
          window.setTimeout(() => navigate("confirmation"), 450);
        }
        return nextActions;
      });
    }, 500);
  }

  function approveAll() {
    const count = batchApprovableActions.length;
    setLiveMessage(
      `Approving ${count} ${count === 1 ? "action" : "actions"}. Email Draft requires explicit send and will not be auto-sent.`
    );
    setActions((current) => {
      const nextActions = current.map((action) =>
        action.id !== "email" && ["pending", "draft"].includes(action.status)
          ? { ...action, status: "complete", reviewNote: "" }
          : action
      );
      if (nextActions.length > 0 && nextActions.every((action) => action.status === "complete")) {
        window.setTimeout(() => navigate("confirmation"), 550);
      }
      return nextActions;
    });
  }

  function saveDraftAction(id) {
    setActions((current) =>
      current.map((action) =>
        action.id === id
          ? { ...action, status: "draft", reviewNote: "Advisor edited and saved draft." }
          : action
      )
    );
    showToast("Draft saved to the audit trail.");
  }

  function completeReviewAction(id, status, reasonType, reviewNote) {
    setActions((current) =>
      current.map((action) =>
        action.id === id
          ? {
              ...action,
              status,
              reasonType,
              reviewNote
            }
          : action
      )
    );
    setReviewModal(null);
    setLiveMessage(
      status === "rejected"
        ? `Action rejected with reason: ${reasonType}.`
        : `Changes requested with reason: ${reasonType}.`
    );
    showToast(status === "rejected" ? "Action rejected and logged." : "Changes requested and logged.");
  }

  function requestReset() {
    setResetConfirmOpen(true);
  }

  function resetDemo() {
    window.sessionStorage.removeItem(sessionStorageKey);
    setView("dashboard");
    setActiveProfileTab("AI Insights");
    setActiveMeetingId("sterling");
    setActiveNotesMeetingId("sterling");
    setExecutionMeetingId("sterling");
    setAgenda(defaultAgenda);
    setAgendaAudit({});
    setEditingAgenda(null);
    setEditingAgendaDraft("");
    setSections({
      snapshot: true,
      portfolio: true,
      agenda: true
    });
    setActions(initialActions);
    setNotes("");
    setNotesError("");
    setAudioSelected(false);
    setProgress(0);
    setProcessing(false);
    setExtractionMode("scripted");
    setRiskTolerance("Conservative");
    setTaskDraft(defaultTaskDraft);
    setEmailDraft(defaultEmailDraft);
    setEmailEnvelope(defaultEmailEnvelope);
    setEmailModalOpen(false);
    setEmailSendConfirmOpen(false);
    setApproveAllConfirmOpen(false);
    setReviewModal(null);
    setSourcePanel(null);
    setDeckModalOpen(false);
    setPresentationReadyByMeeting({});
    setActiveDeckMeetingId("sterling");
    setAuditModalOpen(false);
    setCsaQueueOpen(false);
    setNotificationsOpen(false);
    setResetConfirmOpen(false);
    setRecentActivity(activity);
    setSyncRetries({});
    navigate("dashboard");
    showToast("Prototype reset for the next validation session.");
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} navigate={navigate} resetDemo={requestReset} />
      <main className="main-panel">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {processing ? `Analyzing meeting notes, ${progress} percent complete` : toast}
        </div>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </div>
        <Topbar
          view={view}
          pendingCount={pendingCount}
          navigate={navigate}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          recentActivity={recentActivity}
          activeMeetingId={activeMeetingId}
        />
        {view === "dashboard" && (
          <Dashboard
            navigate={navigate}
            onSourceOpen={setSourcePanel}
            recentActivity={recentActivity}
            showToast={showToast}
            debugMode={debugMode}
            syncRetries={syncRetries}
            handleRetrySync={handleRetrySync}
            setActiveMeetingId={setActiveMeetingId}
            openAuditModal={() => setAuditModalOpen(true)}
          />
        )}
        {view === "meeting" && (
          <MeetingHub
            activeMeetingId={activeMeetingId}
            agenda={agenda}
            setAgenda={setAgenda}
            agendaAudit={agendaAudit}
            setAgendaAudit={setAgendaAudit}
            editingAgenda={editingAgenda}
            setEditingAgenda={setEditingAgenda}
            editingAgendaDraft={editingAgendaDraft}
            setEditingAgendaDraft={setEditingAgendaDraft}
            sections={sections}
            setSections={setSections}
            isGenerating={isGenerating}
            generatePresentation={generatePresentation}
            presentationReady={activePresentationReady}
            navigate={navigate}
            onSourceOpen={setSourcePanel}
            focusSection={meetingFocusSection}
            onFocusHandled={() => setMeetingFocusSection(null)}
          />
        )}
        {view === "notes" && (
          <NotesInput
            notes={notes}
            setNotes={setNotes}
            activeNotesMeetingId={activeNotesMeetingId}
            setActiveNotesMeetingId={setActiveNotesMeetingId}
            audioSelected={audioSelected}
            setAudioSelected={setAudioSelected}
            processing={processing}
            progress={progress}
            processNotes={processNotes}
            notesError={notesError}
            setNotesError={setNotesError}
          />
        )}
        {view === "actions" && (
          <ActionCenter
            actions={actions}
            approveAction={approveAction}
            requestApproveAll={() => setApproveAllConfirmOpen(true)}
            saveDraftAction={saveDraftAction}
            openReviewModal={setReviewModal}
            riskTolerance={riskTolerance}
            setRiskTolerance={setRiskTolerance}
            taskDraft={taskDraft}
            setTaskDraft={setTaskDraft}
            emailDraft={emailDraft}
            setEmailDraft={setEmailDraft}
            emailEnvelope={emailEnvelope}
            setEmailEnvelope={setEmailEnvelope}
            emailModalOpen={emailModalOpen}
            setEmailModalOpen={setEmailModalOpen}
            emailSendConfirmOpen={emailSendConfirmOpen}
            setEmailSendConfirmOpen={setEmailSendConfirmOpen}
            completedCount={completedCount}
            rejectedCount={rejectedCount}
            changesCount={changesCount}
            pendingCount={pendingCount}
            batchApprovableActions={batchApprovableActions}
            extractionMode={extractionMode}
            executionScenario={scenarioConfigs[executionMeetingId] || scenarioConfigs.sterling}
            onSourceOpen={setSourcePanel}
            openCsaQueue={() => setCsaQueueOpen(true)}
            navigate={navigate}
          />
        )}
        {view === "profile" && (
          <ClientProfile
            activeMeetingId={activeMeetingId}
            activeTab={activeProfileTab}
            setActiveTab={setActiveProfileTab}
            navigate={navigate}
            showToast={showToast}
          />
        )}
        {view === "confirmation" && <Confirmation resetDemo={requestReset} navigate={navigate} />}
      </main>
      {deckModalOpen && (
        <DeckPreviewModal
          brief={meetingBriefs[activeDeckMeetingId] || meetingBriefs.sterling}
          onClose={() => setDeckModalOpen(false)}
          onToast={showToast}
        />
      )}
      {sourcePanel && (
        <SourceRecordPanel source={sourcePanel} onClose={() => setSourcePanel(null)} />
      )}
      {reviewModal && (
        <ReviewDecisionModal
          action={actions.find((action) => action.id === reviewModal.id)}
          mode={reviewModal.mode}
          onClose={() => setReviewModal(null)}
          onSubmit={(reasonType, reviewNote) =>
            completeReviewAction(
              reviewModal.id,
              reviewModal.mode === "reject" ? "rejected" : "changes",
              reasonType,
              reviewNote
            )
          }
        />
      )}
      {resetConfirmOpen && (
        <ResetConfirmModal
          approvedCount={completedCount}
          rejectedCount={rejectedCount}
          changesCount={changesCount}
          draftCount={draftCount}
          actionCount={actions.length}
          hasNotes={Boolean(notes.trim())}
          presentationReady={Object.values(presentationReadyByMeeting).some(Boolean)}
          onCancel={() => setResetConfirmOpen(false)}
          onConfirm={resetDemo}
        />
      )}
      {approveAllConfirmOpen && (
        <ApproveAllConfirmModal
          actions={batchApprovableActions}
          emailPending={actions.some(
            (action) => action.id === "email" && ["pending", "draft"].includes(action.status)
          )}
          onCancel={() => setApproveAllConfirmOpen(false)}
          onConfirm={() => {
            setApproveAllConfirmOpen(false);
            approveAll();
          }}
        />
      )}
      {auditModalOpen && (
        <AuditLogModal
          onClose={() => setAuditModalOpen(false)}
          onExport={() => showToast("Exporting AEQ-0427-1000_audit_log.csv for validation review.")}
        />
      )}
      {csaQueueOpen && (
        <CsaQueueModal onClose={() => setCsaQueueOpen(false)} taskDraft={taskDraft} />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
          <button className="toast-close" type="button" aria-label="Dismiss notification" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function Sidebar({ view, navigate, resetDemo }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: Gauge },
    { id: "meeting", label: "Meeting Hub", icon: BriefcaseBusiness },
    { id: "notes", label: "Notes", icon: Mic2 },
    { id: "actions", label: "Action Center", icon: ClipboardCheck },
    { id: "profile", label: "Client Profile", icon: Users }
  ];

  return (
    <aside className="sidebar">
      <button className="brand" type="button" onClick={() => navigate("dashboard")}>
        <span className="brand-mark">
          <Sparkles size={22} />
        </span>
        <span>
          <strong>Aequitas AI</strong>
          <small>Advisor prototype</small>
        </span>
      </button>

      <nav className="nav-list" aria-label="Primary navigation">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              className={`nav-item ${isActive ? "active" : ""}`}
              key={item.id}
              type="button"
              onClick={() => navigate(item.id, item.id === "profile" ? { tab: "AI Insights" } : {})}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <section className="sidebar-status" aria-label="Validation status">
        <div className="status-dot-row">
          <span className="pulse-dot" />
          <span>Validation build</span>
        </div>
        <p>Scripted multi-client validation data. No live integrations connected.</p>
        <p className="viewport-note">Optimized for desktop validation at 1280px or wider.</p>
      </section>

      <button className="ghost-button" type="button" onClick={resetDemo}>
        <RefreshCw size={16} />
        Reset session
      </button>
    </aside>
  );
}

function Topbar({
  view,
  pendingCount,
  navigate,
  notificationsOpen,
  setNotificationsOpen,
  recentActivity,
  activeMeetingId
}) {
  const activeProfileBrief = meetingBriefs[activeMeetingId] || meetingBriefs.sterling;
  const title = {
    dashboard: "Advisor Command Center",
    meeting: "Meeting Intelligence Hub",
    notes: "Notes Workspace",
    actions: "AI Action Center",
    profile: `${activeProfileBrief.headline} Profile`,
    confirmation: "Execution Complete"
  }[view];

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Sarah Mitchell · HNW Advisory</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button
          className="icon-button notification-trigger"
          type="button"
          title="Notifications"
          onClick={() => setNotificationsOpen((open) => !open)}
          aria-expanded={notificationsOpen}
          aria-label="Open notifications"
        >
          <Bell size={18} />
        </button>
        {notificationsOpen && (
          <div className="notifications-panel">
            <div className="notifications-header">
              <strong>Notifications</strong>
              <span>{pendingCount} pending</span>
            </div>
            <div className="notification-section">
              <span className="notification-section-title">Needs review</span>
              <button className="notification-item" type="button" onClick={() => navigate("actions")}>
                <ClipboardCheck size={16} />
                <span>Review AI action queue</span>
                <small>Action</small>
              </button>
              <button className="notification-item" type="button" onClick={() => navigate("profile", { meetingId: "sterling", tab: "Portfolio" })}>
                <AlertTriangle size={16} />
                <span>Sterling allocation drift needs review</span>
                <small>Alert</small>
              </button>
            </div>
            <div className="notification-section">
              <span className="notification-section-title">Activity</span>
            {recentActivity.slice(0, 3).map((item) => (
              <div className="notification-item passive" key={item}>
                <History size={16} />
                <span>{item}</span>
                <small>Logged</small>
              </div>
            ))}
            </div>
          </div>
        )}
        <button
          className="secondary-button approval-shortcut"
          type="button"
          title="Open Action Center"
          aria-label={`Open Action Center, ${pendingCount} pending approvals`}
          onClick={() => navigate("actions")}
        >
          <ClipboardCheck size={16} />
          {pendingCount} pending
        </button>
        <button className="primary-button compact" type="button" onClick={() => navigate("notes")}>
          <Mic2 size={16} />
          Notes Workspace
        </button>
      </div>
    </header>
  );
}

function TimeSavedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="chart-tooltip" role="status">
      <strong>{label}: {value} hours saved</strong>
      <span>Advisor preparation and follow-up time avoided during this validation week.</span>
    </div>
  );
}

function Dashboard({
  navigate,
  onSourceOpen,
  recentActivity,
  showToast,
  debugMode,
  syncRetries,
  handleRetrySync,
  setActiveMeetingId,
  openAuditModal
}) {
  const priorityMeeting = meetings.find((meeting) => meeting.badge === "ready") || meetings[0];
  const priorityBrief = meetingBriefs[priorityMeeting.id] || meetingBriefs.sterling;
  return (
    <div className="page-grid dashboard-grid">
      <section className="summary-band">
        <div>
          <p className="eyebrow">Today · April 27, 2026</p>
          <h2>AI has prepared today&apos;s work queue for HNW client coverage</h2>
          <p>
            Three meetings, three pending approval items, and two proactive portfolio alerts are
            ready for advisor review.
          </p>
        </div>
        <div className="summary-actions">
          <div className="metric-strip">
            <Metric label="AUM covered today" value="$84.4M" icon={CircleDollarSign} />
            <Metric label="Briefs ready" value="1 / 3" icon={FileText} />
            <Metric label="Est. time saved" value="10.4h" icon={Clock3} />
          </div>
          <div className="button-row right">
            <button className="secondary-button" type="button" onClick={() => navigate("notes")}>
              <Mic2 size={16} />
              Notes Workspace
            </button>
            <button className="primary-button" type="button" onClick={() => navigate("meeting", { meetingId: priorityMeeting.id })}>
              <FileText size={16} />
              Open {priorityBrief.headline} Brief
            </button>
          </div>
        </div>
      </section>

      <section className="surface large">
        <SectionHeader
          icon={CalendarDays}
          title="Today's Meetings"
          action={
            <button className="text-button" type="button" onClick={() => navigate("meeting", { meetingId: priorityMeeting.id })}>
              Open ready brief <ArrowRight size={15} />
            </button>
          }
        />
        <div className="meeting-list">
          {meetings.map((meeting) => {
            const retryState = syncRetries[meeting.id];
            const isRetrying = retryState?.status === "syncing";
            const retryProgress = retryState?.progress || meeting.prep;
            const prepNote =
              retryState?.status === "queued"
                ? `Retry queued - ${retryProgress}% synced`
                : isRetrying
                  ? `Retrying source sync - ${retryProgress}%`
                  : meeting.prepNote;
            return (
            <article
              className="meeting-row"
              key={meeting.id}
            >
              <span className="time-box">{meeting.time}</span>
              <span className="meeting-main">
                <strong>{meeting.client}</strong>
                <small>{meeting.type} · {meeting.aum}</small>
              </span>
              <span className="meeting-readiness">
                <StatusBadge tone={meeting.badge}>{meeting.status}</StatusBadge>
                <span className="mini-progress" aria-label={`${retryProgress}% brief readiness`}>
                  <i className={isRetrying ? "syncing" : ""} style={{ width: `${retryProgress}%` }} />
                </span>
                <small>{prepNote}</small>
                {meeting.badge === "pending" && (
                  <button
                    className="text-button tiny"
                    type="button"
                    disabled={isRetrying}
                    onClick={() => handleRetrySync(meeting.id)}
                  >
                    {isRetrying ? "Retrying..." : "Retry Sync"}
                  </button>
                )}
              </span>
              <button
                className="secondary-button compact-row"
                type="button"
                onClick={() => {
                  setActiveMeetingId(meeting.id);
                  navigate("meeting", { meetingId: meeting.id });
                }}
              >
                Full Brief <ArrowRight size={15} />
              </button>
            </article>
            );
          })}
        </div>
      </section>

      <section className="surface large">
        <SectionHeader
          icon={FileText}
          title="Sterling Brief Preview"
          action={
            <button className="text-button" type="button" onClick={() => navigate("meeting", { meetingId: "sterling" })}>
              Review brief <ArrowRight size={15} />
            </button>
          }
        />
        <div className="brief-preview-grid">
          <PreviewBlock
            tone="blue"
            label="Client context"
            title="Maya Sterling starts Stanford in September"
            text="Near-term liquidity planning should be handled alongside the family trust transfer request."
          />
          <PreviewBlock
            tone="green"
            label="Advisor talking point"
            title="$42K tax-loss harvesting opportunity"
            text="Municipal bond losses can offset realized gains while keeping the income target intact."
          />
          <PreviewBlock
            tone="amber"
            label="Hypothesis to validate"
            title="Risk profile may need to shift conservative"
            text="Prior call notes and a major liquidity event indicate a lower-volatility discussion may be appropriate."
            source="Source: prior call notes Apr 18 + life event"
          />
        </div>
        <EvidenceStrip
          sources={["Salesforce FSC", "Orion", "Task history", "Tax lot report"]}
          onSourceOpen={onSourceOpen}
        />
      </section>

      <section className="surface">
        <SectionHeader icon={BarChart3} title="Brief Readiness Timeline" />
        <ReadinessTimeline />
      </section>

      <section className="surface">
        <SectionHeader
          icon={ClipboardCheck}
          title="Pending AI Approvals"
          action={
            <button className="text-button" type="button" onClick={() => navigate("actions")}>
              View all <ArrowRight size={15} />
            </button>
          }
        />
        <ApprovalPreview title="CRM Update" detail="Risk tolerance: Moderate → Conservative" />
        <ApprovalPreview title="Task" detail="Trust transfer paperwork · $250,000 · May 3" />
        <ApprovalPreview title="Email" detail="Sterling tax-loss follow-up draft" />
      </section>

      <section className="surface">
        <SectionHeader
          icon={PieChartIcon}
          title="Sterling Allocation"
          action={
            <button className="text-button" type="button" onClick={() => navigate("meeting", { meetingId: "sterling", focusSection: "portfolio" })}>
              Current vs target <ArrowRight size={15} />
            </button>
          }
        />
        <div className="chart-medium allocation-chart with-bars">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={exposureData}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={76}
                paddingAngle={3}
              >
                {exposureData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-grid">
            {exposureData.map((entry) => (
              <span key={entry.name}>
                <i style={{ background: entry.color }} />
                {entry.name}
              </span>
            ))}
          </div>
        </div>
        <AllocationComparison compact />
      </section>

      <section className="surface">
        <SectionHeader
          icon={Mic2}
          title="Post-Meeting Notes"
          action={
            <button className="text-button" type="button" onClick={() => navigate("notes")}>
              Open notes <ArrowRight size={15} />
            </button>
          }
        />
        <div className="notes-preview">
          <p>
            Sterling quarterly review finished at 10:52 AM. Robert and Anne want to reduce
            overall portfolio risk...
          </p>
          <button className="primary-button full" type="button" onClick={() => navigate("notes")}>
            <Sparkles size={16} />
              Notes Workspace
            </button>
        </div>
      </section>

      <section className="surface large">
        <SectionHeader icon={AlertTriangle} title="Portfolio Alerts" />
        <div className="alert-list">
          {alerts.map((alert) => (
            <article
              className={`alert-row ${alert.severity}`}
              key={alert.title}
            >
              <span>
                <strong>{alert.title}</strong>
                <small>{alert.client} · {alert.detail}</small>
              </span>
              <span className="impact-pill">{alert.impact}</span>
              <div className="alert-actions">
                <button className="secondary-button compact-row" type="button" onClick={() => navigate("profile", { tab: "AI Insights", meetingId: "sterling" })}>
                  Review
                </button>
                <button className="text-button tiny" type="button" onClick={() => showToast(`${alert.title} added to the meeting agenda.`)}>
                  Add to agenda
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface">
          <SectionHeader
            icon={TrendingUp}
            title="Advisor Time Saved"
            action={<span className="counter">Unit: hours</span>}
          />
        <div className="chart-medium">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productivityData} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="savedGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
              <Tooltip content={<TimeSavedTooltip />} cursor={{ stroke: "#0f766e", strokeDasharray: "4 4" }} />
              <Area
                type="monotone"
                dataKey="saved"
                name="Advisor time saved"
                stroke="#0f766e"
                strokeWidth={3}
                fill="url(#savedGradient)"
                dot={{ r: 3, strokeWidth: 2, fill: "#ffffff", stroke: "#0f766e" }}
                activeDot={{ r: 6, strokeWidth: 2, fill: "#0f766e", stroke: "#ffffff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-note-row">
          <span><i /> Advisor hours saved per week</span>
        </div>
        <p className="methodology-note">
          Baseline: pre-Aequitas advisor self-reported average, March 2026 validation cohort
          (n=12). Time saved is directional for prototype testing.
        </p>
      </section>

      <section className="surface">
        <SectionHeader icon={History} title="Recent Activity" />
        <div className="activity-feed">
          {recentActivity.map((item, index) => (
            <div className="activity-item" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface">
        <SectionHeader icon={ShieldCheck} title="Trust & Audit" />
        <TrustLine icon={LockKeyhole} label="External comms" value="Approval required" />
        <TrustLine icon={Database} label="CRM write-back" value="Before/after logged" />
        <TrustLine icon={History} label="Audit record" value="AEQ-0427-1000" />
        <TrustLine icon={ShieldCheck} label="Data use" value="Firm data excluded" />
        <div className="audit-actions">
          <button
            className="secondary-button full"
            type="button"
            onClick={openAuditModal}
          >
            <Eye size={16} />
            View Immutable Record
          </button>
          <button
            className="secondary-button full"
            type="button"
            onClick={() => showToast("Exporting AEQ-0427-1000_audit_log.csv for validation review.")}
          >
            <Download size={16} />
            Export Audit Log
          </button>
        </div>
      </section>

      {debugMode && (
        <section className="surface">
          <SectionHeader icon={Info} title="Prototype State Specs" />
          <div className="state-spec-list">
            <StateSpec label="No meetings today" text="Dashboard shows an empty schedule with an add/import calendar prompt." />
            <StateSpec label="Brief still preparing" text="Meeting rows show percent synced, ETA, and a retry control if a source fails." />
            <StateSpec label="Source error" text="Evidence chips show the failed system and route to the source record panel." />
          </div>
        </section>
      )}
    </div>
  );
}

function MeetingHub({
  activeMeetingId,
  agenda,
  setAgenda,
  agendaAudit,
  setAgendaAudit,
  editingAgenda,
  setEditingAgenda,
  editingAgendaDraft,
  setEditingAgendaDraft,
  sections,
  setSections,
  isGenerating,
  generatePresentation,
  presentationReady,
  navigate,
  onSourceOpen,
  focusSection,
  onFocusHandled
}) {
  const brief = meetingBriefs[activeMeetingId] || meetingBriefs.sterling;
  const agendaItems = activeMeetingId === "sterling" ? agenda : brief.agenda;
  const portfolioSectionRef = useRef(null);

  useEffect(() => {
    if (focusSection !== "portfolio") return;
    const timer = window.setTimeout(() => {
      portfolioSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocusHandled?.();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [activeMeetingId, focusSection, onFocusHandled]);

  return (
    <div className="page-grid meeting-grid">
      <section className="summary-band meeting-summary">
        <div>
          <p className="eyebrow">{brief.eyebrow}</p>
          <h2>{brief.headline}</h2>
          <p>{brief.description}</p>
        </div>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={() => navigate("profile")}>
            <PanelRightOpen size={16} />
            Profile
          </button>
          <button className="primary-button" type="button" onClick={generatePresentation}>
            {isGenerating ? <RefreshCw className="spin" size={16} /> : <Download size={16} />}
            {isGenerating ? "Generating..." : "Generate Presentation"}
          </button>
        </div>
      </section>

      <section className="surface brief-stack">
        <BriefSection
          id="snapshot"
          icon={Users}
          title="Client Snapshot"
          open={sections.snapshot}
          setSections={setSections}
        >
          <div className="snapshot-grid">
            {brief.facts.map(([label, value]) => (
              <InsightFact key={label} label={label} value={value} />
            ))}
          </div>
          <div className="callout-list">
            {brief.callouts.map(([tone, title, text]) => (
              <TrustCallout key={title} tone={tone} title={title} text={text} />
            ))}
          </div>
          <EvidenceStrip
            sources={brief.sources}
            onSourceOpen={onSourceOpen}
          />
        </BriefSection>

        <BriefSection
          id="portfolio"
          icon={BarChart3}
          title="Portfolio Analysis"
          open={sections.portfolio}
          setSections={setSections}
          sectionRef={portfolioSectionRef}
          highlighted={focusSection === "portfolio"}
        >
          <div className="split-content">
            <div className="allocation-detail">
              <div className="chart-legend" aria-label="Portfolio allocation chart legend">
                <span><i className="current" /> Current allocation</span>
                <span><i className="target" /> Target allocation</span>
              </div>
              <div className="chart-large">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brief.allocation} margin={{ top: 12, right: 20, left: -16, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-18}
                      textAnchor="end"
                      height={58}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="current" fill="#2563eb" radius={[5, 5, 0, 0]} name="Current" />
                    <Bar dataKey="target" fill="#94a3b8" radius={[5, 5, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <AllocationComparison data={brief.allocation} />
            </div>
            <div className="callout-list">
              {brief.portfolioInsights.map(([tone, title, text]) => (
                <TrustCallout key={title} tone={tone} title={title} text={text} />
              ))}
            </div>
          </div>
          <EvidenceStrip
            sources={["Orion", "Black Diamond", "IPS", "YTD tax lot report"]}
            onSourceOpen={onSourceOpen}
          />
        </BriefSection>

        <BriefSection
          id="agenda"
          icon={ListChecks}
          title="Suggested Agenda"
          open={sections.agenda}
          setSections={setSections}
        >
          <div className="agenda-list">
            {agendaItems.map((item, index) => (
              <div className="agenda-item" key={`${item}-${index}`}>
                <span className="agenda-number">{index + 1}</span>
                {editingAgenda === index ? (
                  <div className="agenda-edit-wrap">
                    <input
                      value={editingAgendaDraft}
                      onChange={(event) => setEditingAgendaDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setEditingAgenda(null);
                          setEditingAgendaDraft("");
                        }
                      }}
                      autoFocus
                    />
                    <div className="agenda-edit-actions">
                      <button
                        className="secondary-button compact-row"
                        type="button"
                        onClick={() => {
                          setEditingAgenda(null);
                          setEditingAgendaDraft("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="primary-button compact-row"
                        type="button"
                        onClick={() => {
                          const nextAgenda = [...agendaItems];
                          nextAgenda[index] = editingAgendaDraft;
                          setAgenda(nextAgenda);
                          setAgendaAudit((current) => ({
                            ...current,
                            [index]: "Edited by advisor"
                          }));
                          setEditingAgenda(null);
                          setEditingAgendaDraft("");
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>
                    {item}
                    {agendaAudit[index] && <span className="edited-chip">{agendaAudit[index]}</span>}
                  </p>
                )}
              <button
                className="secondary-button compact-row"
                type="button"
                title="Edit agenda item"
                  onClick={() => {
                    setEditingAgenda(index);
                    setEditingAgendaDraft(item);
                  }}
                >
                  <Edit3 size={15} />
                  Edit
                </button>
              </div>
            ))}
          </div>
          <EvidenceStrip
            sources={["CRM notes", "Portfolio alerts", "Open tasks"]}
            onSourceOpen={onSourceOpen}
          />
        </BriefSection>
      </section>

      <aside className="side-column">
        <section className="surface profile-snapshot">
          <SectionHeader icon={BadgeCheck} title="Client Snapshot" />
          {brief.facts.slice(0, 4).map(([label, value]) => (
            <div className="profile-stat" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <button className="secondary-button full" type="button" onClick={() => navigate("profile", { meetingId: activeMeetingId })}>
            <Eye size={16} />
            View Full Profile
          </button>
        </section>

        <section className="surface trust-panel">
          <SectionHeader icon={ShieldCheck} title="Review Guardrails" />
          <TrustLine icon={LockKeyhole} label="External communication" value="Advisor approval" />
          <TrustLine icon={SearchCheck} label="Critical CRM fields" value="Reviewer required" />
          <TrustLine icon={History} label="Audit record" value="AEQ-0427-1000" />
          <TrustLine icon={Database} label="Training use" value="Firm data excluded" />
        </section>

        <section className="surface trust-panel">
          <SectionHeader icon={Download} title="Presentation Package" />
          <TrustLine icon={FileText} label="Included pages" value="Brief, agenda, portfolio" />
          <TrustLine icon={BarChart3} label="Charts" value="Allocation and drift" />
          <TrustLine
            icon={ShieldCheck}
            label="Review status"
            value={presentationReady ? "Presentation ready" : "Not generated"}
          />
          <button className="primary-button full" type="button" onClick={generatePresentation}>
            {isGenerating ? <RefreshCw className="spin" size={16} /> : <Download size={16} />}
            {isGenerating ? "Generating..." : "Generate Client Presentation"}
          </button>
        </section>
      </aside>
    </div>
  );
}

function BriefSection({ id, icon: Icon, title, open, setSections, sectionRef, highlighted = false, children }) {
  return (
    <section className={`brief-section ${highlighted ? "highlighted" : ""}`} ref={sectionRef}>
      <button
        className="brief-title"
        type="button"
        onClick={() => setSections((current) => ({ ...current, [id]: !current[id] }))}
      >
        <span>
          <Icon size={18} />
          {title}
        </span>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {open && <div className="brief-body">{children}</div>}
    </section>
  );
}

function NotesInput({
  notes,
  setNotes,
  activeNotesMeetingId,
  setActiveNotesMeetingId,
  audioSelected,
  setAudioSelected,
  processing,
  progress,
  processNotes,
  notesError,
  setNotesError
}) {
  const hasEnoughInput = notes.trim().length >= minimumNoteCharacters || audioSelected;
  const selectedScenario = scenarioConfigs[activeNotesMeetingId] || scenarioConfigs.sterling;

  return (
    <div className="page-grid notes-grid">
      <section className="summary-band">
        <div>
          <p className="eyebrow">{selectedScenario.notesLabel} - {selectedScenario.label}</p>
          <h2>Convert meeting outcomes into advisor-approved actions</h2>
          <p>No external communication, CRM update, or task creation occurs without approval.</p>
        </div>
        <Metric label="Expected review time" value="90s" icon={Clock3} />
      </section>

      <section className="surface notes-surface">
        <SectionHeader icon={Users} title="Meeting Scenario" />
        <div className="scenario-switcher" role="list">
          {Object.values(scenarioConfigs).map((scenario) => (
            <button
              key={scenario.id}
              className={activeNotesMeetingId === scenario.id ? "active" : ""}
              type="button"
              onClick={() => {
                setActiveNotesMeetingId(scenario.id);
                setAudioSelected(false);
                setNotes("");
                setNotesError("");
              }}
            >
              <strong>{scenario.label}</strong>
              <small>{scenario.meetingTime} - {scenario.notesLabel}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="surface notes-surface">
        <SectionHeader icon={FileAudio} title="Upload Audio Recording" />
        <button
          className={`upload-zone ${audioSelected ? "selected" : ""}`}
          type="button"
          onClick={() => {
            setAudioSelected(true);
            setNotesError("");
          }}
        >
          <UploadCloud size={28} />
          <span>{audioSelected ? `${selectedScenario.audioFile} selected` : "MP3, M4A, or WAV"}</span>
          <small>{audioSelected ? "Ready for simulated analysis" : "Drag-and-drop zone"}</small>
        </button>
      </section>

      <section className="surface notes-editor">
        <SectionHeader
          icon={PenLine}
          title="Paste Meeting Notes"
          action={
            <div className="button-row">
              <span className="counter">{notes.length.toLocaleString()} characters</span>
              <button
                className="text-button tiny"
                type="button"
                onClick={() => {
                  setNotes(selectedScenario.sampleNotes);
                  setNotesError("");
                }}
              >
                Load sample notes
              </button>
            </div>
          }
        />
        <textarea
          value={notes}
          onFocus={() => {
            if (!notes) {
              setNotes(selectedScenario.sampleNotes);
              setNotesError("");
            }
          }}
          onChange={(event) => {
            setNotes(event.target.value);
            if (event.target.value.trim().length >= minimumNoteCharacters) setNotesError("");
          }}
          placeholder="Paste or dictate advisor notes from the meeting."
        />
        {!hasEnoughInput && (
          <div className="inline-warning">
            <AlertTriangle size={16} />
            <span>
              Add at least {minimumNoteCharacters} characters of notes or select the demo audio
              file before processing.
            </span>
          </div>
        )}
        {notesError && (
          <div className="inline-error">
            <AlertTriangle size={16} />
            <span>{notesError}</span>
          </div>
        )}
        <div className="process-footer">
          {processing ? (
            <div className="progress-wrap" role="status" aria-live="polite" aria-label="Analyzing meeting notes">
              <div className="progress-label">
                <span>Analyzing meeting notes...</span>
                <strong>{progress}%</strong>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="security-note">
              <ShieldCheck size={18} />
              <span>No actions will be taken without your explicit approval.</span>
            </div>
          )}
          <button
            className="primary-button"
            type="button"
            disabled={processing || !hasEnoughInput}
            onClick={processNotes}
          >
            {processing ? <RefreshCw className="spin" size={16} /> : <Sparkles size={16} />}
            {processing ? "Processing..." : "Process with AI"}
          </button>
        </div>
      </section>

      <section className="surface trust-panel">
        <SectionHeader icon={ShieldCheck} title="Audit Trail" />
        <TrustLine icon={LockKeyhole} label="Session" value="AEQ-VAL-0427" />
        <TrustLine icon={Database} label="Data mode" value="Fictional demo data" />
        <TrustLine icon={History} label="Retention" value="Immutable review log" />
      </section>
    </div>
  );
}

function ActionCenter({
  actions,
  approveAction,
  requestApproveAll,
  saveDraftAction,
  openReviewModal,
  riskTolerance,
  setRiskTolerance,
  taskDraft,
  setTaskDraft,
  emailDraft,
  setEmailDraft,
  emailEnvelope,
  setEmailEnvelope,
  emailModalOpen,
  setEmailModalOpen,
  emailSendConfirmOpen,
  setEmailSendConfirmOpen,
  completedCount,
  rejectedCount,
  changesCount,
  pendingCount,
  batchApprovableActions,
  extractionMode,
  executionScenario,
  onSourceOpen,
  openCsaQueue,
  navigate
}) {
  const hasActions = actions.length > 0;
  const canApproveAll = batchApprovableActions.length > 0;
  const emailAction = actions.find((action) => action.id === "email");
  const emailSendAllowed = ["pending", "draft"].includes(emailAction?.status);
  const nonEmailActions = actions.filter((action) => action.id !== "email");
  const nonEmailActionsApproved =
    nonEmailActions.length > 0 && nonEmailActions.every((action) => action.status === "approved");
  const emailPendingAfterCoreApprovals =
    nonEmailActionsApproved && emailAction && ["pending", "draft"].includes(emailAction.status);
  const allDecided = hasActions && pendingCount === 0;
  const allApproved = hasActions && completedCount === actions.length;

  return (
    <div className="page-grid actions-grid">
      <section className="summary-band">
        <div>
          <p className="eyebrow">Post-meeting execution - {executionScenario.label}</p>
          <h2>
            {hasActions
              ? `AI has drafted ${actions.length} actions from your meeting notes`
              : "AI needs human review before actions can be proposed"}
          </h2>
          <p>
            {hasActions
              ? "Review source evidence, make edits, approve, reject, or request changes."
              : `The supplied notes did not match the scripted ${executionScenario.label} scenario strongly enough to create confident actions.`}
          </p>
        </div>
        <div className="button-row">
          <span className="completion-pill">
            {completedCount} / {actions.length || 3} approved · {rejectedCount} rejected ·{" "}
            {changesCount} changes
          </span>
          <button className="primary-button" type="button" onClick={requestApproveAll} disabled={!canApproveAll}>
            <Check size={16} />
            Approve All
          </button>
        </div>
      </section>

      <section className="surface action-stack">
        {extractionMode === "scripted" && hasActions && (
          <div className="demo-mode-banner">
            <Sparkles size={16} />
            <span>Demo mode: scripted output has been generated from the {executionScenario.label} sample notes.</span>
          </div>
        )}
        {allDecided && (
          <div className="all-clear-banner">
            <CheckCircle2 size={18} />
            <span>
              All clear: no pending AI actions remain. The audit summary stays visible for review.
            </span>
          </div>
        )}
        {allApproved && (
          <div className="completion-summary-card">
            <CheckCircle2 size={24} />
            <div>
              <strong>All {actions.length} actions approved</strong>
              <p>CRM, CSA task routing, email send decision, and audit evidence are ready for the post-meeting completion record.</p>
            </div>
            <button className="primary-button compact-row" type="button" onClick={() => navigate("confirmation")}>
              View Completion
            </button>
          </div>
        )}
        {emailPendingAfterCoreApprovals && !allApproved && (
          <div className="completion-summary-card pending-email">
            <Info size={24} />
            <div>
              <strong>{completedCount} of {actions.length} actions approved</strong>
              <p>Email remains gated by explicit advisor send. Review the envelope and send confirmation before closing the workflow.</p>
            </div>
            <div className="button-row">
              <button className="secondary-button compact-row" type="button" onClick={() => navigate("dashboard")}>
                Dashboard
              </button>
              <button className="primary-button compact-row" type="button" onClick={() => setEmailModalOpen(true)}>
                Review Email
              </button>
            </div>
          </div>
        )}
        {!hasActions && (
          <div className="empty-extraction">
            <SearchCheck size={34} />
            <h3>No confident actions extracted</h3>
            <p>
              Add the Sterling sample notes, select the demo audio file, or provide notes with
              client, amount, owner, date, and decision language to generate action cards.
            </p>
          </div>
        )}
        {actions.map((action) => {
          if (action.id === "crm") {
            return (
              <ActionCard
                key={action.id}
                action={action}
                approveAction={approveAction}
                saveDraftAction={saveDraftAction}
                openReviewModal={openReviewModal}
                onSourceOpen={onSourceOpen}
              >
                <div className="field-row">
                  <span>{executionScenario.crmFieldLabel}</span>
                  <select
                    value={riskTolerance}
                    onChange={(event) => setRiskTolerance(event.target.value)}
                  >
                    {executionScenario.crmOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <DiffLine before={executionScenario.crmBefore} after={riskTolerance} />
              </ActionCard>
            );
          }

          if (action.id === "task") {
            return (
              <ActionCard
                key={action.id}
                action={action}
                approveAction={approveAction}
                saveDraftAction={saveDraftAction}
                openReviewModal={openReviewModal}
                onSourceOpen={onSourceOpen}
              >
                <div className="task-fields">
                  <label>
                    Assignee
                    <input
                      value={taskDraft.assignee}
                      onChange={(event) =>
                        setTaskDraft((current) => ({ ...current, assignee: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Amount
                    <input
                      value={taskDraft.amount}
                      onChange={(event) =>
                        setTaskDraft((current) => ({ ...current, amount: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Due
                    <input
                      value={taskDraft.dueDate}
                      onChange={(event) =>
                        setTaskDraft((current) => ({ ...current, dueDate: event.target.value }))
                      }
                    />
                  </label>
                </div>
              </ActionCard>
            );
          }

          return (
            <ActionCard
              key={action.id}
              action={action}
              approveAction={approveAction}
              saveDraftAction={saveDraftAction}
              openReviewModal={openReviewModal}
              onSourceOpen={onSourceOpen}
            >
              <div className="email-preview">
                <EmailEnvelopePreview envelope={emailEnvelope} compact />
                <div className="email-inline-copy">
                  <StatusBadge tone="neutral">Editable draft</StatusBadge>
                  <strong>{emailEnvelope.subject}</strong>
                  <p>{emailDraft.split("\n").filter(Boolean)[0]}</p>
                  <small>Review the full body, envelope, signature, and send confirmation before execution.</small>
                </div>
                <button className="secondary-button compact-row" type="button" onClick={() => setEmailModalOpen(true)}>
                  <Eye size={15} />
                  Review Draft
                </button>
              </div>
            </ActionCard>
          );
        })}
      </section>

      <aside className="side-column">
        <section className="surface trust-panel">
          <SectionHeader icon={ShieldCheck} title="Approval Policy" />
          <TrustLine icon={Mail} label="Email sending" value="Explicit send required" />
          <TrustLine icon={Database} label="CRM write-back" value="Logged with before/after" />
          <TrustLine
            icon={ListChecks}
            label="Task creation"
            value="Routes to CSA queue"
            hint="CSA means Client Service Associate. This mock queue is where Daniel Reed receives operational tasks."
          />
          <button className="text-button policy-link" type="button" onClick={openCsaQueue}>
            Open mock CSA queue <ArrowRight size={15} />
          </button>
        </section>
        <section className="surface">
          <SectionHeader icon={Info} title="Evidence Quality" />
          <div className={`quality-score ${hasActions ? "high" : "low"}`}>
            <Gauge size={32} />
            <strong>{hasActions ? "High" : "Needs review"}</strong>
            <span>
              {hasActions
                ? "Clear notes, named owner, amount, and date were detected."
                : "The input was present, but it lacked enough Sterling scenario evidence for scripted actions."}
            </span>
          </div>
          {hasActions && (
            <div className="quality-meta">
              <TrustLine icon={ClipboardCheck} label="Pending review" value={`${pendingCount}`} />
              <TrustLine icon={History} label="Decision log" value="Session storage" />
            </div>
          )}
        </section>
      </aside>

      {emailModalOpen && (
        <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Email draft">
            <div className="modal-header">
              <div>
                <p className="eyebrow">{executionScenario.label}</p>
                <h3>Follow-up Email Draft</h3>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close email draft"
                onClick={() => {
                  setEmailSendConfirmOpen(false);
                  setEmailModalOpen(false);
                }}
                autoFocus
              >
                <X size={18} />
              </button>
            </div>
            <EmailEnvelopeEditor envelope={emailEnvelope} setEnvelope={setEmailEnvelope} />
            <textarea
              className="modal-textarea"
              value={emailDraft}
              onChange={(event) => setEmailDraft(event.target.value)}
            />
            <div className="signature-preview">
              <strong>Signature preview</strong>
              <pre>{emailEnvelope.signature}</pre>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setEmailSendConfirmOpen(false);
                  setEmailModalOpen(false);
                }}
              >
                Keep Draft
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={!emailSendAllowed}
                onClick={() => {
                  setEmailSendConfirmOpen(true);
                }}
              >
                <Send size={16} />
                {emailSendAllowed ? "Send Email" : "Send locked"}
              </button>
            </div>
          </div>
        </div>
      )}
      {emailSendConfirmOpen && (
        <EmailSendConfirmModal
          envelope={emailEnvelope}
          onCancel={() => setEmailSendConfirmOpen(false)}
          onConfirm={() => {
            setEmailSendConfirmOpen(false);
            setEmailModalOpen(false);
            approveAction("email");
          }}
        />
      )}
    </div>
  );
}

function ActionCard({
  action,
  children,
  approveAction,
  saveDraftAction,
  openReviewModal,
  onSourceOpen
}) {
  const Icon = action.icon;
  const complete = action.status === "complete";
  const approving = action.status === "approving";
  const rejected = action.status === "rejected";
  const changes = action.status === "changes";
  const draft = action.status === "draft";
  const locked = complete || approving || rejected || changes;
  const approveLabel = complete
    ? "Approved"
    : rejected
      ? "Rejected"
      : changes
        ? "Changes requested"
        : approving
          ? "Approving..."
          : "Approve";

  return (
    <article
      className={`action-card ${action.tone} ${complete ? "complete" : ""} ${
        approving ? "approving" : ""
      } ${rejected ? "rejected" : ""} ${changes ? "changes" : ""} ${draft ? "draft" : ""}`}
    >
      <div className="action-header">
        <span className="action-icon">
          <Icon size={18} />
        </span>
        <div>
          <h3>{action.title}</h3>
          <p>{action.summary}</p>
        </div>
        <span className="action-status-stack">
          <TooltipTrigger content={action.confidenceRationale}>
            <span className="confidence">
              <Info size={13} />
              AI Confidence: {action.confidence}%
            </span>
          </TooltipTrigger>
          {complete && <StatusBadge tone="ready">Approved</StatusBadge>}
          {draft && <StatusBadge tone="neutral">Draft saved</StatusBadge>}
          {rejected && <StatusBadge tone="rejected">Rejected</StatusBadge>}
          {changes && <StatusBadge tone="preparing">Changes requested</StatusBadge>}
        </span>
      </div>
      <div className="action-body">{children}</div>
      {action.reviewNote && (
        <div className="review-note">
          <strong>{action.reasonType || "Advisor note"}</strong>
          <p>{action.reviewNote}</p>
        </div>
      )}
      <div className="action-footer">
        <EvidenceStrip
          sources={[action.evidence, "Advisor approval required"]}
          onSourceOpen={onSourceOpen}
        />
        <div className="action-buttons">
          <button
            className="secondary-button"
            type="button"
            disabled={locked}
            onClick={() => saveDraftAction(action.id)}
          >
            <PenLine size={16} />
            Save Draft
          </button>
          <button
            className="secondary-button danger"
            type="button"
            disabled={locked}
            onClick={() => openReviewModal({ id: action.id, mode: "reject" })}
          >
            <X size={16} />
            Reject
          </button>
          <button
            className="secondary-button"
            type="button"
            disabled={locked}
            onClick={() => openReviewModal({ id: action.id, mode: "changes" })}
          >
            <PenLine size={16} />
            Request Changes
          </button>
          <button
            className={complete ? "complete-button" : "primary-button"}
            type="button"
            disabled={locked}
            onClick={() => approveAction(action.id)}
          >
            {complete ? <CheckCircle2 size={16} /> : <Check size={16} />}
            {approveLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

function EmailEnvelopePreview({ envelope, compact = false }) {
  return (
    <div className={`email-envelope-preview ${compact ? "compact" : ""}`}>
      <div>
        <span>To</span>
        <strong>{envelope.to.join(", ")}</strong>
      </div>
      <div>
        <span>Cc</span>
        <strong>{envelope.cc.join(", ") || "None"}</strong>
      </div>
      <div>
        <span>Subject</span>
        <strong>{envelope.subject}</strong>
      </div>
    </div>
  );
}

function EmailEnvelopeEditor({ envelope, setEnvelope }) {
  function updateList(field, value) {
    setEnvelope((current) => ({
      ...current,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }));
  }

  return (
    <div className="email-envelope-editor">
      <label>
        From
        <input value={envelope.from} readOnly />
      </label>
      <label>
        To
        <input value={envelope.to.join(", ")} onChange={(event) => updateList("to", event.target.value)} />
      </label>
      <label>
        Cc
        <input value={envelope.cc.join(", ")} onChange={(event) => updateList("cc", event.target.value)} />
      </label>
      <label>
        Bcc
        <input value={envelope.bcc.join(", ")} onChange={(event) => updateList("bcc", event.target.value)} />
      </label>
      <label className="wide">
        Subject
        <input
          value={envelope.subject}
          onChange={(event) =>
            setEnvelope((current) => ({ ...current, subject: event.target.value }))
          }
        />
      </label>
    </div>
  );
}

function ReviewDecisionModal({ action, mode, onClose, onSubmit }) {
  const [reasonType, setReasonType] = useState(
    mode === "reject" ? "Insufficient evidence" : "Needs advisor edits"
  );
  const [reviewNote, setReviewNote] = useState("");
  const [error, setError] = useState("");
  const title = mode === "reject" ? "Reject Proposed Action" : "Request Changes";
  const description =
    mode === "reject"
      ? "Record why this AI-proposed action should not be executed."
      : "Record what must change before this action can be approved.";
  const reasons =
    mode === "reject"
      ? ["Insufficient evidence", "Incorrect interpretation", "Wrong client record", "Compliance concern"]
      : ["Needs advisor edits", "Needs CSA follow-up", "Missing amount or date", "Needs supervisor review"];

  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal review-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{action?.title || "Action review"}</p>
            <h3>{title}</h3>
          </div>
          <button className="icon-button" type="button" aria-label="Close review modal" onClick={onClose} autoFocus>
            <X size={18} />
          </button>
        </div>
        <p className="modal-help">{description}</p>
        <label className="review-field">
          Reason
          <select value={reasonType} onChange={(event) => setReasonType(event.target.value)}>
            {reasons.map((reason) => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
        </label>
        <label className="review-field">
          Required audit note
          <textarea
            value={reviewNote}
            onChange={(event) => {
              setReviewNote(event.target.value);
              if (event.target.value.trim()) setError("");
            }}
            placeholder="Explain the decision for audit review."
          />
        </label>
        {error && (
          <div className="inline-error">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className={mode === "reject" ? "secondary-button danger solid" : "primary-button"}
            type="button"
            onClick={() => {
              if (!reviewNote.trim()) {
                setError("An audit note is required before saving this decision.");
                return;
              }
              onSubmit(reasonType, reviewNote.trim());
            }}
          >
            {mode === "reject" ? <X size={16} /> : <PenLine size={16} />}
            {mode === "reject" ? "Reject and Log" : "Request Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeckPreviewModal({ brief, onClose, onToast }) {
  const [deckActionMessage, setDeckActionMessage] = useState("");
  const safeFileName = brief.headline.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "");
  const handleDeckAction = (message) => {
    setDeckActionMessage(message);
    onToast(message);
  };
  const slides = [
    {
      title: `${brief.headline} Brief`,
      kicker: brief.eyebrow.split(" - ")[1] || "Client Review",
      body: "Client context, recent life events, outstanding tasks, and advisor-ready talking points.",
      type: "brief"
    },
    {
      title: "Suggested Agenda",
      kicker: "Advisor editable",
      body: brief.agenda.slice(0, 3).join("; "),
      type: "agenda"
    },
    {
      title: "Current vs Target Allocation",
      kicker: "Portfolio review",
      body: "Current and target allocation are shown with client-specific drift indicators.",
      type: "allocation"
    },
    {
      title: "Drift and Opportunity",
      kicker: "AI alerts",
      body: brief.portfolioInsights.map(([, title]) => title).join("; "),
      type: "alerts"
    }
  ];

  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal deck-modal" role="dialog" aria-modal="true" aria-label="Presentation preview">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Presentation ready</p>
            <h3>{brief.headline} Client Deck</h3>
          </div>
          <button className="icon-button" type="button" aria-label="Close deck preview" onClick={onClose} autoFocus>
            <X size={18} />
          </button>
        </div>
        <div className="deck-preview-grid">
          {slides.map((slide, index) => (
            <article className="deck-slide" key={slide.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{slide.kicker}</p>
              <h4>{slide.title}</h4>
              <DeckSlideMock type={slide.type} brief={brief} />
              <small>{slide.body}</small>
            </article>
          ))}
        </div>
        {deckActionMessage && (
          <div className="deck-action-banner" role="status">
            <CheckCircle2 size={18} />
            <span>{deckActionMessage}</span>
          </div>
        )}
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={() => handleDeckAction(`Opening ${safeFileName}_Brief.pptx in PowerPoint preview.`)}>
            <PanelRightOpen size={16} />
            Open in PowerPoint
          </button>
          <button className="primary-button" type="button" onClick={() => handleDeckAction(`Downloading ${safeFileName}_Brief.pptx...`)}>
            <Download size={16} />
            Download Deck
          </button>
        </div>
      </div>
    </div>
  );
}

function DeckSlideMock({ type, brief }) {
  if (type === "agenda") {
    return (
      <div className="deck-slide-mock agenda">
        {brief.agenda.slice(0, 3).map((item, index) => (
          <span key={item}>{String(index + 1).padStart(2, "0")} {item}</span>
        ))}
      </div>
    );
  }

  if (type === "allocation") {
    return (
      <div className="deck-slide-mock allocation">
        {brief.allocation.slice(0, 4).map((item) => (
          <i key={item.name} style={{ height: `${Math.max(item.current, 12)}%` }} />
        ))}
      </div>
    );
  }

  if (type === "alerts") {
    return (
      <div className="deck-slide-mock alerts">
        {brief.portfolioInsights.slice(0, 2).map(([, title, text]) => (
          <React.Fragment key={title}>
            <strong>{title.split(" ")[0]}</strong>
            <span>{text}</span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="deck-slide-mock brief">
      <strong>{brief.headline}</strong>
      <span>AUM {brief.facts.find(([label]) => label === "AUM")?.[1] || "On file"}</span>
      <span>{brief.callouts[0]?.[2]}</span>
    </div>
  );
}

function AuditLogModal({ onClose, onExport }) {
  const auditRows = [
    ["10:00 AM", "Brief generated", "9 source records read and summarized"],
    ["10:03 AM", "Evidence opened", "Salesforce FSC, Orion, Tax lot report"],
    ["10:52 AM", "Notes processed", "3 AI-proposed actions created"],
    ["10:55 AM", "Approval policy", "Email send, CRM write-back, and CSA task require advisor approval"]
  ];

  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal audit-modal" role="dialog" aria-modal="true" aria-label="Immutable audit record">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Immutable audit record</p>
            <h3>AEQ-0427-1000</h3>
          </div>
          <button className="icon-button" type="button" aria-label="Close audit record" onClick={onClose} autoFocus>
            <X size={18} />
          </button>
        </div>
        <div className="audit-record-table">
          {auditRows.map(([time, event, detail]) => (
            <div className="audit-record-row" key={`${time}-${event}`}>
              <span>{time}</span>
              <strong>{event}</strong>
              <p>{detail}</p>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onClose}>
            Close
          </button>
          <button className="primary-button" type="button" onClick={onExport}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function CsaQueueModal({ onClose, taskDraft }) {
  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal review-modal" role="dialog" aria-modal="true" aria-label="Mock CSA queue">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Client Service Associate queue</p>
            <h3>Operational Intake</h3>
          </div>
          <button className="icon-button" type="button" aria-label="Close CSA queue" onClick={onClose} autoFocus>
            <X size={18} />
          </button>
        </div>
        <div className="queue-list">
          <div className="queue-row active">
            <ListChecks size={18} />
            <span>
              <strong>{taskDraft.amount || "Client follow-up task"}</strong>
              <small>Assigned to {taskDraft.assignee} - Due {taskDraft.dueDate}</small>
            </span>
            <StatusBadge tone="preparing">Awaiting approval</StatusBadge>
          </div>
          <div className="queue-row">
            <ShieldCheck size={18} />
            <span>
              <strong>Audit handoff prepared</strong>
              <small>Task receives advisor decision ID before routing to execution.</small>
            </span>
            <StatusBadge tone="neutral">Policy gated</StatusBadge>
          </div>
        </div>
        <div className="modal-footer">
          <button className="primary-button" type="button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ApproveAllConfirmModal({ actions, emailPending, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal review-modal" role="dialog" aria-modal="true" aria-label="Confirm bulk approval">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Approval confirmation</p>
            <h3>Approve {actions.length} selected {actions.length === 1 ? "action" : "actions"}?</h3>
          </div>
          <button className="icon-button" type="button" aria-label="Close bulk approval confirmation" onClick={onCancel} autoFocus>
            <X size={18} />
          </button>
        </div>
        <p className="modal-help">
          This records approval for the non-email actions listed below. Email sending requires an
          explicit Send Email confirmation and will not be auto-sent.
        </p>
        <div className="confirm-list">
          {actions.map((action) => (
            <div className="confirm-row" key={action.id}>
              <CheckCircle2 size={16} />
              <span>{action.title}</span>
            </div>
          ))}
          {emailPending && (
            <div className="confirm-row muted">
              <Mail size={16} />
              <span>Email Draft requires explicit Send and stays pending.</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={onConfirm}>
            <Check size={16} />
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailSendConfirmModal({ envelope, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal review-modal" role="dialog" aria-modal="true" aria-label="Confirm email send">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Explicit send required</p>
            <h3>Send follow-up email?</h3>
          </div>
          <button className="icon-button" type="button" aria-label="Close email send confirmation" onClick={onCancel} autoFocus>
            <X size={18} />
          </button>
        </div>
        <p className="modal-help">
          Review the envelope one more time. This validation action logs the send decision to the
          audit trail.
        </p>
        <EmailEnvelopePreview envelope={envelope} />
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={onConfirm}>
            <Send size={16} />
            Confirm Send
          </button>
        </div>
      </div>
    </div>
  );
}

function SourceRecordPanel({ source, onClose }) {
  const record = buildSourceRecord(source);

  return (
    <aside className="source-panel" aria-label="Source record panel">
      <div className="source-panel-header">
        <div>
          <p className="eyebrow">Source record</p>
          <h3>{source}</h3>
        </div>
        <button className="icon-button" type="button" aria-label="Close source record" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="source-record-card">
        <span>System</span>
        <strong>{record.system}</strong>
      </div>
      <div className="source-record-card">
        <span>Record</span>
        <strong>{record.record}</strong>
      </div>
      <div className="source-record-card">
        <span>Last updated</span>
        <strong>{record.updated}</strong>
      </div>
      <div className="source-record-card">
        <span>Owner</span>
        <strong>{record.owner}</strong>
      </div>
      <div className="source-record-card">
        <span>Source timestamp</span>
        <strong>{record.timestamp}</strong>
      </div>
      <div className="source-record-card">
        <span>Original excerpt</span>
        <p>{renderHighlightedExcerpt(record.excerpt, record.highlight)}</p>
      </div>
      <div className="source-record-card">
        <span>System of record link</span>
        <code>{record.link}</code>
      </div>
      <div className="source-record-card">
        <span>Fields</span>
        <ul>
          {record.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
      <div className="source-record-card">
        <span>Production schema</span>
        <ul>
          {record.schema.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ResetConfirmModal({
  approvedCount,
  rejectedCount,
  changesCount,
  draftCount,
  actionCount,
  hasNotes,
  presentationReady,
  onCancel,
  onConfirm
}) {
  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal review-modal" role="dialog" aria-modal="true" aria-label="Confirm reset">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Reset session</p>
            <h3>Discard current demo state?</h3>
          </div>
          <button className="icon-button" type="button" aria-label="Close reset confirmation" onClick={onCancel} autoFocus>
            <X size={18} />
          </button>
        </div>
        <div className="reset-impact">
          <p>
            This will discard the current validation session, including:
          </p>
          <ul>
            <li><strong>{approvedCount}</strong> approved of <strong>{actionCount || 3}</strong> proposed actions</li>
            <li><strong>{rejectedCount}</strong> rejected actions and <strong>{changesCount}</strong> change requests</li>
            <li><strong>{draftCount}</strong> saved draft edits</li>
            <li><strong>{hasNotes ? "1" : "0"}</strong> notes workspace input and <strong>{presentationReady ? "1" : "0"}</strong> generated presentation package</li>
          </ul>
        </div>
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="secondary-button danger solid" type="button" onClick={onConfirm}>
            <RefreshCw size={16} />
            Reset Session
          </button>
        </div>
      </div>
    </div>
  );
}

function PortfolioSparkline() {
  const min = Math.min(...cashFlowData.map((item) => item.portfolio));
  const max = Math.max(...cashFlowData.map((item) => item.portfolio));
  const width = 220;
  const height = 72;
  const points = cashFlowData.map((item, index) => {
    const x = 12 + index * ((width - 24) / (cashFlowData.length - 1));
    const ratio = (item.portfolio - min) / (max - min || 1);
    const y = height - 14 - ratio * (height - 28);
    return { ...item, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="sparkline-wrap" aria-label="Portfolio value rose from 27.6M in January to 28.4M in April">
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <path className="sparkline-area" d={`${path} L ${width - 12} ${height - 10} L 12 ${height - 10} Z`} />
        <path className="sparkline-path" d={path} />
        {points.map((point) => (
          <circle className="sparkline-dot" key={point.month} cx={point.x} cy={point.y} r="3.5" />
        ))}
      </svg>
      <div className="sparkline-months">
        {cashFlowData.map((item) => (
          <span key={item.month}>{item.month}</span>
        ))}
      </div>
    </div>
  );
}

function ClientProfile({ activeMeetingId, activeTab, setActiveTab, navigate, showToast }) {
  const brief = meetingBriefs[activeMeetingId] || meetingBriefs.sterling;
  const aum = brief.facts.find(([label]) => label === "AUM")?.[1] || "$28.4M";

  return (
    <div className="page-grid profile-grid">
      <section className="summary-band profile-hero">
        <div>
          <p className="eyebrow">{brief.eyebrow} - {aum} AUM</p>
          <h2>{brief.headline}</h2>
          <p>{brief.description}</p>
        </div>
        <div className="chart-small">
          <PortfolioSparkline />
        </div>
      </section>

      <section className="surface profile-main">
        <div className="tabs" role="tablist">
          {profileTabs.map((tab) => (
            <button
              key={tab.label}
              className={`${activeTab === tab.label ? "active" : ""} ${!tab.enabled ? "disabled" : ""}`}
              type="button"
              onClick={() => {
                if (tab.enabled) setActiveTab(tab.label);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ProfileTabContent activeTab={activeTab} brief={brief} navigate={navigate} showToast={showToast} />
      </section>
    </div>
  );
}

function ProfileTabContent({ activeTab, brief, navigate, showToast }) {
  if (activeTab === "Overview") {
    return (
      <div className="profile-tab-panel">
        <section className="profile-summary-card">
          <h3>Household Overview</h3>
          <p>{brief.description}</p>
          <div className="snapshot-grid">
            {brief.facts.map(([label, value]) => (
              <InsightFact key={label} label={label} value={value} />
            ))}
          </div>
        </section>
        <section className="profile-summary-card">
          <h3>Relationship Map</h3>
          <div className="relationship-grid">
            {brief.relationship.map((line) => (
              <TrustLine key={line.label} icon={line.icon} label={line.label} value={line.value} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (activeTab === "Portfolio") {
    return (
      <div className="profile-tab-panel">
        <section className="profile-summary-card">
          <h3>Portfolio Snapshot</h3>
          <AllocationComparison data={brief.allocation} />
        </section>
        <section className="profile-summary-card">
          <h3>Allocation Notes</h3>
          <div className="callout-list">
            {brief.portfolioInsights.map(([tone, title, text]) => (
              <TrustCallout key={title} tone={tone} title={title} text={text} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (activeTab === "Documents") {
    return (
      <div className="profile-tab-panel">
        <section className="profile-summary-card">
          <h3>Document Vault</h3>
          <div className="document-list">
            {brief.documents.map((document) => (
              <DocumentRow
                key={document.title}
                title={document.title}
                type={document.type}
                date={document.date}
              />
            ))}
          </div>
        </section>
        <section className="profile-summary-card">
          <h3>Evidence Readiness</h3>
          <p>All documents shown here are fictional validation records tied to the evidence drawer.</p>
          <button className="secondary-button" type="button" onClick={() => showToast("Document export is mocked for the validation build.")}>
            <Download size={16} />
            Export document list
          </button>
        </section>
      </div>
    );
  }

  if (activeTab === "Interactions") {
    return (
      <div className="profile-tab-panel">
        <section className="profile-summary-card">
          <h3>Recent Interactions</h3>
          {brief.interactions.map((interaction) => (
            <TimelineItem key={interaction.title} date={interaction.date} title={interaction.title} />
          ))}
        </section>
        <section className="profile-summary-card">
          <h3>Next Best Actions</h3>
          <div className="button-row">
            <button className="primary-button" type="button" onClick={() => navigate("actions")}>
              <ClipboardCheck size={16} />
              Review actions
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate("notes")}>
              <Mic2 size={16} />
              Notes Workspace
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="insights-layout">
      <section className="insight-summary">
        <div className="badge-row">
          <StatusBadge tone="ready">AI Generated</StatusBadge>
          <StatusBadge tone="neutral">Updated 8:44 AM</StatusBadge>
        </div>
        <p>
          {brief.headline} has an AI-prepared briefing package that connects client context,
          portfolio evidence, source records, and advisor-approved follow-up actions. The
          recommended next steps remain gated behind explicit advisor review.
        </p>
      </section>

      <section className="timeline">
        <h3>Key Life Events</h3>
        {brief.lifeEvents.map((event) => (
          <TimelineItem key={event.title} date={event.date} title={event.title} />
        ))}
      </section>

      <section className="profile-alerts">
        <h3>Proactive AI Alerts</h3>
        <div className="callout-list">
          {brief.portfolioInsights.map(([tone, title, text], index) => (
            <TrustCallout
              key={title}
              tone={tone}
              title={title}
              text={text}
              action={
                index === 0 ? (
                  <button className="secondary-button" type="button" onClick={() => navigate("actions")}>
                    <Check size={16} />
                    Take Action
                  </button>
                ) : (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => showToast(`${brief.headline} analysis marked for advisor review.`)}
                  >
                    <BarChart3 size={16} />
                    View Analysis
                  </button>
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="upcoming">
        <h3>Upcoming Milestones</h3>
        {brief.milestones.map((milestone) => (
          <Milestone key={milestone.title} date={milestone.date} title={milestone.title} />
        ))}
      </section>
    </div>
  );
}

function DocumentRow({ title, type, date }) {
  return (
    <div className="document-row">
      <FileText size={16} />
      <span>
        <strong>{title}</strong>
        <small>{type} - Updated {date}</small>
      </span>
      <StatusBadge tone="ready">Synced</StatusBadge>
    </div>
  );
}

function Confirmation({ resetDemo, navigate }) {
  return (
    <div className="confirmation-wrap">
      <section className="confirmation">
        <span className="success-icon">
          <CheckCircle2 size={42} />
        </span>
        <p className="eyebrow">Post-meeting execution complete</p>
        <h2>All 3 actions executed</h2>
        <p>Your CRM, task list, and email have been updated in the validation workflow.</p>
        <div className="confirmation-grid">
          <TrustLine icon={Database} label="CRM update" value="Risk tolerance updated" />
          <TrustLine icon={ListChecks} label="Task" value="Transfer paperwork created" />
          <TrustLine icon={Mail} label="Email" value="Follow-up sent" />
          <TrustLine icon={History} label="Audit ID" value="AEQ-0427-POST-003" />
        </div>
        <div className="button-row center">
          <button className="secondary-button" type="button" onClick={() => navigate("dashboard")}>
            Return to Dashboard
          </button>
          <button className="primary-button" type="button" onClick={resetDemo}>
            <RefreshCw size={16} />
            Reset Prototype
          </button>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="section-header">
      <h2>
        <Icon size={18} />
        {title}
      </h2>
      {action}
    </div>
  );
}

function ReadinessTimeline() {
  return (
    <div className="readiness-timeline">
      <div className="readiness-axis">
        <span>Brief pending</span>
        <span>Sources synced</span>
        <span>Advisor-ready</span>
      </div>
      {meetings.map((meeting) => (
        <div className="readiness-row" key={meeting.id}>
          <div>
            <strong>{meeting.time}</strong>
            <span>{meeting.client}</span>
          </div>
          <div className="readiness-track">
            <i className={meeting.badge} style={{ width: `${meeting.prep}%` }} />
          </div>
          <StatusBadge tone={meeting.badge}>{meeting.status}</StatusBadge>
        </div>
      ))}
      <p className="metric-explainer">
        Progress shows percent of required briefing sources synced and summarized for advisor
        review.
      </p>
    </div>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="metric">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StateSpec({ label, text }) {
  return (
    <div className="state-spec">
      <strong>{label}</strong>
      <p>{text}</p>
    </div>
  );
}

function StatusBadge({ tone = "neutral", children }) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}

function ApprovalPreview({ title, detail }) {
  return (
    <div className="approval-preview">
      <CheckCircle2 size={17} />
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
    </div>
  );
}

function PreviewBlock({ tone, label, title, text, source }) {
  return (
    <article className={`preview-block ${tone}`}>
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
      {source && <small>{source}</small>}
    </article>
  );
}

function AllocationComparison({ compact = false, data = allocationData }) {
  return (
    <div className={`allocation-bars ${compact ? "compact" : ""}`}>
      <div className="bar-legend" aria-label="Current versus target allocation legend">
        <span><i className="current" /> Current allocation bar</span>
        <span><i className="target" /> Target marker</span>
      </div>
      {data.map((item) => (
        <div className="allocation-bar-row" key={item.name}>
          <div className="allocation-bar-label">
            <strong>{item.name}</strong>
            <span>{item.current}% current · {item.target}% target</span>
          </div>
          <div className="allocation-track" aria-label={`${item.name} current ${item.current}% target ${item.target}%`}>
            <span className="target-marker" style={{ left: `${item.target}%` }} />
            <i style={{ width: `${item.current}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function InsightFact({ label, value }) {
  return (
    <div className="insight-fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TrustCallout({ tone, title, text, action }) {
  return (
    <div className={`trust-callout ${tone}`}>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

function TooltipTrigger({ content, children, className = "", containsFocusable = false }) {
  if (!content) return children;

  return (
    <span
      className={`tooltip-trigger ${className}`}
      tabIndex={containsFocusable ? undefined : 0}
    >
      {children}
      <span className="tooltip-bubble" role="tooltip">
        {content}
      </span>
    </span>
  );
}

function EvidenceStrip({ sources, onSourceOpen }) {
  return (
    <div className="evidence-strip">
      {sources.map((source) => (
        <TooltipTrigger
          key={source}
          content={`Open source record: ${source}`}
          containsFocusable
        >
          <button
            type="button"
            aria-label={`Open source record: ${source}`}
            onClick={() => onSourceOpen?.(source)}
          >
            {source}
          </button>
        </TooltipTrigger>
      ))}
    </div>
  );
}

function TrustLine({ icon: Icon, label, value, hint }) {
  return (
    <div className="trust-line">
      <Icon size={17} />
      <span>{label}</span>
      {hint ? (
        <TooltipTrigger content={hint} className="trust-value-wrap">
          <strong className="has-hint">{value}</strong>
        </TooltipTrigger>
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}

function DiffLine({ before, after }) {
  return (
    <div className="diff-line">
      <span>{before}</span>
      <ArrowRight size={16} />
      <strong>{after}</strong>
    </div>
  );
}

function TimelineItem({ date, title }) {
  return (
    <div className="timeline-item">
      <span>{date}</span>
      <strong>{title}</strong>
    </div>
  );
}

function Milestone({ date, title }) {
  return (
    <div className="milestone">
      <span>{date}</span>
      <strong>{title}</strong>
    </div>
  );
}

export default App;
