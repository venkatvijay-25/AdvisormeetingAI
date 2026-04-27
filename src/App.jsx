import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
  Layers3,
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
    client: "The Sterling Family",
    type: "Quarterly review",
    aum: "$28.4M",
    status: "AI Brief Ready",
    badge: "ready",
    prep: 100
  },
  {
    id: "chen",
    time: "1:00 PM",
    client: "Elaine Chen Trust",
    type: "Estate liquidity review",
    aum: "$14.8M",
    status: "Preparing Brief",
    badge: "preparing",
    prep: 68
  },
  {
    id: "morrison",
    time: "3:30 PM",
    client: "Morrison Holdings LLC",
    type: "Tax planning call",
    aum: "$41.2M",
    status: "Brief Pending",
    badge: "pending",
    prep: 24
  }
];

const activity = [
  "Prepared Sterling Family quarterly brief from 9 connected sources",
  "Flagged allocation drift in Chen Trust taxable account",
  "Created review queue entry for Morrison charitable trust memo",
  "Synced 4 approved updates to Salesforce Financial Services Cloud"
];

const alerts = [
  {
    title: "Tax-loss harvesting window",
    client: "The Sterling Family",
    severity: "opportunity",
    impact: "$42K estimated offset",
    detail: "Municipal bond sleeve shows harvestable losses without altering income target."
  },
  {
    title: "Allocation drift",
    client: "The Sterling Family",
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

const readinessData = meetings.map((meeting) => ({
  name: meeting.time,
  readiness: meeting.prep
}));

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

const initialActions = [
  {
    id: "crm",
    title: "CRM Update",
    icon: Database,
    tone: "blue",
    summary: "Update risk tolerance from Moderate to Conservative",
    confidence: 94,
    evidence: "Meeting note: “reduce overall portfolio risk”",
    status: "pending"
  },
  {
    id: "task",
    title: "Task Creation",
    icon: ListChecks,
    tone: "violet",
    summary: "Prepare transfer paperwork for Sterling family trust",
    confidence: 91,
    evidence: "Meeting note: “move roughly $250,000 ... by May 3”",
    status: "pending"
  },
  {
    id: "email",
    title: "Email Draft",
    icon: Mail,
    tone: "teal",
    summary: "Send follow-up summary with tax-loss harvesting next steps",
    confidence: 88,
    evidence: "Meeting note: “short written summary of the tax-loss harvesting opportunity”",
    status: "pending"
  }
];

const profileTabs = ["Overview", "Portfolio", "Documents", "Interactions", "AI Insights"];

function App() {
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [activeProfileTab, setActiveProfileTab] = useState("AI Insights");
  const [agenda, setAgenda] = useState([
    "Review liquidity needs tied to Stanford housing and renovation payments",
    "Discuss risk tolerance shift after dental practice sale",
    "Evaluate municipal bond tax-loss harvesting opportunity",
    "Confirm next steps for trust account transfer paperwork"
  ]);
  const [editingAgenda, setEditingAgenda] = useState(null);
  const [sections, setSections] = useState({
    snapshot: true,
    portfolio: true,
    agenda: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSelected, setAudioSelected] = useState(false);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [actions, setActions] = useState(initialActions);
  const [riskTolerance, setRiskTolerance] = useState("Conservative");
  const [taskDraft, setTaskDraft] = useState({
    assignee: "Daniel Reed, CSA",
    amount: "$250,000",
    dueDate: "May 3, 2026"
  });
  const [emailDraft, setEmailDraft] = useState(
    "Hi Robert and Anne,\n\nThank you for the productive quarterly review today. I will have Daniel prepare the trust transfer paperwork for the planned $250,000 movement by May 3. We will also send a concise analysis of the municipal bond tax-loss harvesting opportunity and how it preserves the income target.\n\nBest,\nSarah"
  );
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const completedCount = actions.filter((action) => action.status === "complete").length;
  const pendingCount = actions.length - completedCount;

  function navigate(nextView, options = {}) {
    if (nextView === "profile") {
      setActiveProfileTab(options.tab || "AI Insights");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView(nextView);
  }

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function generatePresentation() {
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      showToast("Presentation ready. Click to download.");
    }, 2000);
  }

  function processNotes() {
    setProcessing(true);
    setProgress(0);
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / 3000) * 100));
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        window.clearInterval(timer);
        setProcessing(false);
        navigate("actions");
      }
    }, 120);
  }

  function approveAction(id) {
    setActions((current) =>
      current.map((action) =>
        action.id === id ? { ...action, status: "approving" } : action
      )
    );
    window.setTimeout(() => {
      setActions((current) => {
        const nextActions = current.map((action) =>
          action.id === id ? { ...action, status: "complete" } : action
        );
        if (nextActions.every((action) => action.status === "complete")) {
          window.setTimeout(() => navigate("confirmation"), 450);
        }
        return nextActions;
      });
    }, 500);
  }

  function approveAll() {
    setActions((current) => current.map((action) => ({ ...action, status: "complete" })));
    window.setTimeout(() => navigate("confirmation"), 550);
  }

  function resetDemo() {
    setActions(initialActions);
    setNotes("");
    setAudioSelected(false);
    setProgress(0);
    setProcessing(false);
    setRiskTolerance("Conservative");
    navigate("dashboard");
    showToast("Prototype reset for the next validation session.");
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} navigate={navigate} resetDemo={resetDemo} pendingCount={pendingCount} />
      <main className="main-panel">
        <Topbar view={view} pendingCount={pendingCount} navigate={navigate} />
        {view === "dashboard" && <Dashboard navigate={navigate} />}
        {view === "meeting" && (
          <MeetingHub
            agenda={agenda}
            setAgenda={setAgenda}
            editingAgenda={editingAgenda}
            setEditingAgenda={setEditingAgenda}
            sections={sections}
            setSections={setSections}
            isGenerating={isGenerating}
            generatePresentation={generatePresentation}
            navigate={navigate}
          />
        )}
        {view === "notes" && (
          <NotesInput
            notes={notes}
            setNotes={setNotes}
            audioSelected={audioSelected}
            setAudioSelected={setAudioSelected}
            processing={processing}
            progress={progress}
            processNotes={processNotes}
          />
        )}
        {view === "actions" && (
          <ActionCenter
            actions={actions}
            approveAction={approveAction}
            approveAll={approveAll}
            riskTolerance={riskTolerance}
            setRiskTolerance={setRiskTolerance}
            taskDraft={taskDraft}
            setTaskDraft={setTaskDraft}
            emailDraft={emailDraft}
            setEmailDraft={setEmailDraft}
            emailModalOpen={emailModalOpen}
            setEmailModalOpen={setEmailModalOpen}
            completedCount={completedCount}
          />
        )}
        {view === "profile" && (
          <ClientProfile
            activeTab={activeProfileTab}
            setActiveTab={setActiveProfileTab}
            navigate={navigate}
            showToast={showToast}
          />
        )}
        {view === "confirmation" && <Confirmation resetDemo={resetDemo} navigate={navigate} />}
      </main>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function Sidebar({ view, navigate, resetDemo, pendingCount }) {
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
              {item.id === "actions" && pendingCount > 0 && (
                <span className="count-pill">{pendingCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <section className="sidebar-status" aria-label="Validation status">
        <div className="status-dot-row">
          <span className="pulse-dot" />
          <span>Validation build</span>
        </div>
        <p>Scripted Sterling Family data. No live integrations connected.</p>
      </section>

      <button className="ghost-button" type="button" onClick={resetDemo}>
        <RefreshCw size={16} />
        Reset session
      </button>
    </aside>
  );
}

function Topbar({ view, pendingCount, navigate }) {
  const title = {
    dashboard: "Advisor Command Center",
    meeting: "Meeting Intelligence Hub",
    notes: "Post-Meeting Notes",
    actions: "AI Action Center",
    profile: "Sterling Family Profile",
    confirmation: "Execution Complete"
  }[view];

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Sarah Mitchell · HNW Advisory</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button className="icon-button" type="button" title="Recent AI activity">
          <Bell size={18} />
        </button>
        <button className="secondary-button" type="button" onClick={() => navigate("actions")}>
          <ClipboardCheck size={16} />
          {pendingCount} approvals
        </button>
        <button className="primary-button compact" type="button" onClick={() => navigate("notes")}>
          <Mic2 size={16} />
          New notes
        </button>
      </div>
    </header>
  );
}

function Dashboard({ navigate }) {
  return (
    <div className="page-grid dashboard-grid">
      <section className="summary-band">
        <div>
          <p className="eyebrow">Today · April 27, 2026</p>
          <h2>AI-prepared work queue for HNW client coverage</h2>
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
              Open Notes Workspace
            </button>
            <button className="primary-button" type="button" onClick={() => navigate("meeting")}>
              <FileText size={16} />
              Open Full Brief
            </button>
          </div>
        </div>
      </section>

      <section className="surface large">
        <SectionHeader
          icon={CalendarDays}
          title="Today's Meetings"
          action={
            <button className="text-button" type="button" onClick={() => navigate("meeting")}>
              Open ready brief <ArrowRight size={15} />
            </button>
          }
        />
        <div className="meeting-list">
          {meetings.map((meeting) => (
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
                <span className="mini-progress" aria-label={`${meeting.prep}% brief readiness`}>
                  <i style={{ width: `${meeting.prep}%` }} />
                </span>
              </span>
              <button className="secondary-button compact-row" type="button" onClick={() => navigate("meeting")}>
                Full Brief <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="surface large">
        <SectionHeader
          icon={FileText}
          title="Sterling Brief Preview"
          action={
            <button className="text-button" type="button" onClick={() => navigate("meeting")}>
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
            label="Decision point"
            title="Risk profile may shift conservative"
            text="Meeting notes and recent life events suggest the household wants less volatility after the practice sale."
          />
        </div>
        <EvidenceStrip sources={["Salesforce FSC", "Orion", "Task history", "Tax lot report"]} />
      </section>

      <section className="surface">
        <SectionHeader icon={BarChart3} title="Brief Readiness" />
        <div className="chart-medium">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={readinessData} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="readiness" radius={[6, 6, 0, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
            <button className="text-button" type="button" onClick={() => navigate("meeting")}>
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
            Process Meeting Notes
          </button>
        </div>
      </section>

      <section className="surface large">
        <SectionHeader icon={AlertTriangle} title="Portfolio Alerts" />
        <div className="alert-list">
          {alerts.map((alert) => (
            <button
              className={`alert-row ${alert.severity}`}
              key={alert.title}
              type="button"
              onClick={() => navigate("profile", { tab: "AI Insights" })}
            >
              <span>
                <strong>{alert.title}</strong>
                <small>{alert.client} · {alert.detail}</small>
              </span>
              <span className="impact-pill">{alert.impact}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="surface">
        <SectionHeader icon={TrendingUp} title="Advisor Time Saved" />
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
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="saved"
                stroke="#0f766e"
                strokeWidth={3}
                fill="url(#savedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="surface">
        <SectionHeader icon={History} title="Recent Activity" />
        <div className="activity-feed">
          {activity.map((item, index) => (
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
      </section>
    </div>
  );
}

function MeetingHub({
  agenda,
  setAgenda,
  editingAgenda,
  setEditingAgenda,
  sections,
  setSections,
  isGenerating,
  generatePresentation,
  navigate
}) {
  return (
    <div className="page-grid meeting-grid">
      <section className="summary-band meeting-summary">
        <div>
          <p className="eyebrow">10:00 AM · Quarterly review</p>
          <h2>The Sterling Family</h2>
          <p>
            AI brief assembled from CRM, portfolio accounting, calendar, task history, and document
            vault sources.
          </p>
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
            <InsightFact label="AUM" value="$28.4M" />
            <InsightFact label="Relationship since" value="2018" />
            <InsightFact label="Risk profile" value="Moderate" />
            <InsightFact label="Last contact" value="Apr 18, 2026" />
          </div>
          <div className="callout-list">
            <TrustCallout
              tone="blue"
              title="Recent life event"
              text="Maya Sterling accepted to Stanford and starts in September."
            />
            <TrustCallout
              tone="amber"
              title="Outstanding task"
              text="Confirm renovation payment schedule before trust transfer paperwork is opened."
            />
            <TrustCallout
              tone="green"
              title="Client preference"
              text="Prefers concise email summaries with tax and liquidity impacts separated."
            />
          </div>
          <EvidenceStrip sources={["Salesforce FSC", "Calendar", "Task history", "Document vault"]} />
        </BriefSection>

        <BriefSection
          id="portfolio"
          icon={BarChart3}
          title="Portfolio Analysis"
          open={sections.portfolio}
          setSections={setSections}
        >
          <div className="split-content">
            <div className="allocation-detail">
              <div className="chart-large">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allocationData} margin={{ top: 12, right: 20, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="current" fill="#2563eb" radius={[5, 5, 0, 0]} name="Current" />
                    <Bar dataKey="target" fill="#94a3b8" radius={[5, 5, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <AllocationComparison />
            </div>
            <div className="callout-list">
              <TrustCallout
                tone="green"
                title="Tax-loss opportunity"
                text="$42K estimated offset in municipal bond sleeve with no material income target change."
              />
              <TrustCallout
                tone="amber"
                title="Allocation drift"
                text="Public equity is 6.8 points above policy target after recent market movement."
              />
            </div>
          </div>
          <EvidenceStrip sources={["Orion", "Black Diamond", "IPS", "YTD tax lot report"]} />
        </BriefSection>

        <BriefSection
          id="agenda"
          icon={ListChecks}
          title="Suggested Agenda"
          open={sections.agenda}
          setSections={setSections}
        >
          <div className="agenda-list">
            {agenda.map((item, index) => (
              <div className="agenda-item" key={`${item}-${index}`}>
                <span className="agenda-number">{index + 1}</span>
                {editingAgenda === index ? (
                  <input
                    value={item}
                    onChange={(event) => {
                      const nextAgenda = [...agenda];
                      nextAgenda[index] = event.target.value;
                      setAgenda(nextAgenda);
                    }}
                    onBlur={() => setEditingAgenda(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") setEditingAgenda(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <p>{item}</p>
                )}
                <button
                  className="secondary-button compact-row"
                  type="button"
                  title="Edit agenda item"
                  onClick={() => setEditingAgenda(index)}
                >
                  <Edit3 size={15} />
                  Edit
                </button>
              </div>
            ))}
          </div>
          <EvidenceStrip sources={["CRM notes", "Portfolio alerts", "Open tasks"]} />
        </BriefSection>
      </section>

      <aside className="side-column">
        <section className="surface profile-snapshot">
          <SectionHeader icon={BadgeCheck} title="Client Snapshot" />
          <div className="profile-stat">
            <span>AUM</span>
            <strong>$28.4M</strong>
          </div>
          <div className="profile-stat">
            <span>Household</span>
            <strong>Robert & Anne Sterling</strong>
          </div>
          <div className="profile-stat">
            <span>Risk profile</span>
            <strong>Moderate</strong>
          </div>
          <div className="profile-stat">
            <span>Relationship</span>
            <strong>8 years</strong>
          </div>
          <button className="secondary-button full" type="button" onClick={() => navigate("profile")}>
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
          <TrustLine icon={ShieldCheck} label="Review status" value="Advisor generated" />
          <button className="primary-button full" type="button" onClick={generatePresentation}>
            {isGenerating ? <RefreshCw className="spin" size={16} /> : <Download size={16} />}
            {isGenerating ? "Generating..." : "Generate Client Presentation"}
          </button>
        </section>
      </aside>
    </div>
  );
}

function BriefSection({ id, icon: Icon, title, open, setSections, children }) {
  return (
    <section className="brief-section">
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
  audioSelected,
  setAudioSelected,
  processing,
  progress,
  processNotes
}) {
  return (
    <div className="page-grid notes-grid">
      <section className="summary-band">
        <div>
          <p className="eyebrow">Scenario B · Sterling Family</p>
          <h2>Convert meeting outcomes into advisor-approved actions</h2>
          <p>No external communication, CRM update, or task creation occurs without approval.</p>
        </div>
        <Metric label="Expected review time" value="90s" icon={Clock3} />
      </section>

      <section className="surface notes-surface">
        <SectionHeader icon={FileAudio} title="Upload Audio Recording" />
        <button
          className={`upload-zone ${audioSelected ? "selected" : ""}`}
          type="button"
          onClick={() => setAudioSelected(true)}
        >
          <UploadCloud size={28} />
          <span>{audioSelected ? "sterling-review-audio.m4a selected" : "MP3, M4A, or WAV"}</span>
          <small>{audioSelected ? "Ready for simulated analysis" : "Drag-and-drop zone"}</small>
        </button>
      </section>

      <section className="surface notes-editor">
        <SectionHeader
          icon={PenLine}
          title="Paste Meeting Notes"
          action={<span className="counter">{notes.length.toLocaleString()} characters</span>}
        />
        <textarea
          value={notes}
          onFocus={() => {
            if (!notes) setNotes(sampleNotes);
          }}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Paste or dictate advisor notes from the meeting."
        />
        <div className="process-footer">
          {processing ? (
            <div className="progress-wrap" aria-label="Analyzing meeting notes">
              <div className="progress-label">
                <span>Analyzing meeting notes...</span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-track">
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
            disabled={processing}
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
  approveAll,
  riskTolerance,
  setRiskTolerance,
  taskDraft,
  setTaskDraft,
  emailDraft,
  setEmailDraft,
  emailModalOpen,
  setEmailModalOpen,
  completedCount
}) {
  return (
    <div className="page-grid actions-grid">
      <section className="summary-band">
        <div>
          <p className="eyebrow">Post-meeting execution · Sterling Family</p>
          <h2>AI extracted 3 actions from your meeting notes</h2>
          <p>Review source evidence, make edits, and approve each proposed action.</p>
        </div>
        <div className="button-row">
          <span className="completion-pill">{completedCount} / 3 complete</span>
          <button className="primary-button" type="button" onClick={approveAll}>
            <Check size={16} />
            Approve All
          </button>
        </div>
      </section>

      <section className="surface action-stack">
        {actions.map((action) => {
          if (action.id === "crm") {
            return (
              <ActionCard key={action.id} action={action} approveAction={approveAction}>
                <div className="field-row">
                  <span>Risk Tolerance</span>
                  <select
                    value={riskTolerance}
                    onChange={(event) => setRiskTolerance(event.target.value)}
                  >
                    <option>Conservative</option>
                    <option>Moderate</option>
                    <option>Growth</option>
                  </select>
                </div>
                <DiffLine before="Moderate" after={riskTolerance} />
              </ActionCard>
            );
          }

          if (action.id === "task") {
            return (
              <ActionCard key={action.id} action={action} approveAction={approveAction}>
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
            <ActionCard key={action.id} action={action} approveAction={approveAction}>
              <div className="email-preview">
                <p>{emailDraft.split("\n").filter(Boolean).slice(0, 2).join(" ")}</p>
                <button className="text-button" type="button" onClick={() => setEmailModalOpen(true)}>
                  View Full Draft <ArrowRight size={15} />
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
          <TrustLine icon={ListChecks} label="Task creation" value="Routes to CSA queue" />
        </section>
        <section className="surface">
          <SectionHeader icon={Info} title="Evidence Quality" />
          <div className="quality-score">
            <Gauge size={32} />
            <strong>High</strong>
            <span>Clear notes, named owner, amount, and date were detected.</span>
          </div>
        </section>
      </aside>

      {emailModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Email draft">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Sterling Family</p>
                <h3>Follow-up Email Draft</h3>
              </div>
              <button className="icon-button" type="button" onClick={() => setEmailModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <textarea
              className="modal-textarea"
              value={emailDraft}
              onChange={(event) => setEmailDraft(event.target.value)}
            />
            <div className="modal-footer">
              <button className="secondary-button" type="button" onClick={() => setEmailModalOpen(false)}>
                Keep Draft
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  setEmailModalOpen(false);
                  approveAction("email");
                }}
              >
                <Send size={16} />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionCard({ action, children, approveAction }) {
  const Icon = action.icon;
  const complete = action.status === "complete";
  const approving = action.status === "approving";

  return (
    <article className={`action-card ${action.tone} ${complete ? "complete" : ""} ${approving ? "approving" : ""}`}>
      <div className="action-header">
        <span className="action-icon">
          <Icon size={18} />
        </span>
        <div>
          <h3>{action.title}</h3>
          <p>{action.summary}</p>
        </div>
        <span className="confidence" title="Certainty based on note clarity and matching client records">
          <Info size={13} />
          AI Confidence: {action.confidence}%
        </span>
      </div>
      <div className="action-body">{children}</div>
      <div className="action-footer">
        <EvidenceStrip sources={[action.evidence, "Advisor approval required"]} />
        <button
          className={complete ? "complete-button" : "secondary-button"}
          type="button"
          disabled={complete || approving}
          onClick={() => approveAction(action.id)}
        >
          {complete ? <CheckCircle2 size={16} /> : <Check size={16} />}
          {complete ? "Approved" : approving ? "Approving..." : "Approve"}
        </button>
      </div>
    </article>
  );
}

function ClientProfile({ activeTab, setActiveTab, navigate, showToast }) {
  return (
    <div className="page-grid profile-grid">
      <section className="summary-band profile-hero">
        <div>
          <p className="eyebrow">Client since 2018 · $28.4M AUM</p>
          <h2>The Sterling Family</h2>
          <p>
            Multi-generational household with liquidity planning, concentrated tax events, trust
            administration, and education funding milestones.
          </p>
        </div>
        <div className="chart-small">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} hide />
              <Tooltip />
              <Line type="monotone" dataKey="portfolio" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="surface profile-main">
        <div className="tabs" role="tablist">
          {profileTabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "AI Insights" ? (
          <div className="insights-layout">
            <section className="insight-summary">
              <div className="badge-row">
                <StatusBadge tone="ready">AI Generated</StatusBadge>
                <StatusBadge tone="neutral">Updated 8:44 AM</StatusBadge>
              </div>
              <p>
                The Sterling household is entering a more conservative planning phase after Anne's
                dental practice sale and Maya's Stanford acceptance. Liquidity needs are near-term,
                while portfolio drift and tax-loss harvesting create an opportunity to rebalance
                without disrupting the family's income target.
              </p>
            </section>

            <section className="timeline">
              <h3>Key Life Events</h3>
              <TimelineItem date="Apr 2026" title="Maya accepted to Stanford" />
              <TimelineItem date="Mar 2026" title="Dental practice sale completed" />
              <TimelineItem date="Nov 2025" title="Trust distribution policy updated" />
            </section>

            <section className="profile-alerts">
              <h3>Proactive AI Alerts</h3>
              <div className="callout-list">
                <TrustCallout
                  tone="green"
                  title="Tax-loss harvesting opportunity"
                  text="$42K estimated offset available in municipal bond sleeve."
                  action={
                    <button className="secondary-button" type="button" onClick={() => navigate("actions")}>
                      <Check size={16} />
                      Take Action
                    </button>
                  }
                />
                <TrustCallout
                  tone="amber"
                  title="Allocation drift risk"
                  text="Public equity has moved outside the IPS tolerance band."
                  action={
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => showToast("Detailed analysis marked for future integration.")}
                    >
                      <BarChart3 size={16} />
                      View Analysis
                    </button>
                  }
                />
              </div>
            </section>

            <section className="upcoming">
              <h3>Upcoming Milestones</h3>
              <Milestone date="May 3" title="Trust transfer target date" />
              <Milestone date="Sep 14" title="Stanford tuition funding review" />
            </section>
          </div>
        ) : (
          <div className="coming-soon">
            <Layers3 size={34} />
            <h3>{activeTab} workspace</h3>
            <p>Reserved for the production workflow after validation.</p>
          </div>
        )}
      </section>
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

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="metric">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
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

function PreviewBlock({ tone, label, title, text }) {
  return (
    <article className={`preview-block ${tone}`}>
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function AllocationComparison({ compact = false }) {
  return (
    <div className={`allocation-bars ${compact ? "compact" : ""}`}>
      {allocationData.map((item) => (
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

function EvidenceStrip({ sources }) {
  return (
    <div className="evidence-strip">
      {sources.map((source) => (
        <span key={source}>{source}</span>
      ))}
    </div>
  );
}

function TrustLine({ icon: Icon, label, value }) {
  return (
    <div className="trust-line">
      <Icon size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
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
