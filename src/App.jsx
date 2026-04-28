import React, { useEffect, useState } from "react";
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

const profileTabs = [
  { label: "Overview", enabled: false },
  { label: "Portfolio", enabled: false },
  { label: "Documents", enabled: false },
  { label: "Interactions", enabled: false },
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

function isSterlingScenarioInput(notes, audioSelected) {
  const normalized = notes.toLowerCase();
  return (
    audioSelected ||
    (normalized.includes("sterling") &&
      (normalized.includes("250,000") ||
        normalized.includes("risk tolerance") ||
        normalized.includes("stanford")))
  );
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
  const [view, setView] = useState(initialSession.view || "dashboard");
  const [toast, setToast] = useState("");
  const [activeProfileTab, setActiveProfileTab] = useState(
    initialSession.activeProfileTab || "AI Insights"
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
  const [reviewModal, setReviewModal] = useState(null);
  const [sourcePanel, setSourcePanel] = useState(null);
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [presentationReady, setPresentationReady] = useState(
    initialSession.presentationReady || false
  );
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState(initialSession.recentActivity || activity);

  const completedCount = actions.filter((action) => action.status === "complete").length;
  const rejectedCount = actions.filter((action) => action.status === "rejected").length;
  const changesCount = actions.filter((action) => action.status === "changes").length;
  const pendingCount = actions.filter((action) =>
    ["pending", "draft", "approving"].includes(action.status)
  ).length;

  useEffect(() => {
    const nextSession = {
      view,
      activeProfileTab,
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
      presentationReady,
      recentActivity
    };
    window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(nextSession));
  }, [
    view,
    activeProfileTab,
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
    presentationReady,
    recentActivity
  ]);

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
      setPresentationReady(true);
      setDeckModalOpen(true);
      setRecentActivity((current) => [
        "Generated Sterling Family client presentation package",
        ...current.filter((item) => item !== "Generated Sterling Family client presentation package")
      ]);
      showToast("Presentation ready. Click to download.");
    }, 2000);
  }

  function processNotes() {
    const trimmedNotes = notes.trim();
    const hasEnoughInput = trimmedNotes.length >= minimumNoteCharacters || audioSelected;
    if (!hasEnoughInput) {
      setNotesError(
        `Add at least ${minimumNoteCharacters} characters of notes or select an audio file before processing.`
      );
      return;
    }

    setNotesError("");
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
        if (isSterlingScenarioInput(trimmedNotes, audioSelected)) {
          setActions(initialActions);
          setExtractionMode("scripted");
        } else {
          setActions([]);
          setExtractionMode("needs_review");
        }
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
          action.id === id ? { ...action, status: "complete", reviewNote: "" } : action
        );
        if (nextActions.every((action) => action.status === "complete")) {
          window.setTimeout(() => navigate("confirmation"), 450);
        }
        return nextActions;
      });
    }, 500);
  }

  function approveAll() {
    setActions((current) => {
      const nextActions = current.map((action) =>
        ["pending", "draft"].includes(action.status)
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
    showToast(status === "rejected" ? "Action rejected and logged." : "Changes requested and logged.");
  }

  function requestReset() {
    setResetConfirmOpen(true);
  }

  function resetDemo() {
    window.sessionStorage.removeItem(sessionStorageKey);
    setView("dashboard");
    setActiveProfileTab("AI Insights");
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
    setReviewModal(null);
    setSourcePanel(null);
    setDeckModalOpen(false);
    setPresentationReady(false);
    setNotificationsOpen(false);
    setResetConfirmOpen(false);
    setRecentActivity(activity);
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
        <Topbar
          view={view}
          pendingCount={pendingCount}
          navigate={navigate}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          recentActivity={recentActivity}
        />
        {view === "dashboard" && (
          <Dashboard
            navigate={navigate}
            onSourceOpen={setSourcePanel}
            recentActivity={recentActivity}
            showToast={showToast}
          />
        )}
        {view === "meeting" && (
          <MeetingHub
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
            presentationReady={presentationReady}
            navigate={navigate}
            onSourceOpen={setSourcePanel}
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
            notesError={notesError}
            setNotesError={setNotesError}
          />
        )}
        {view === "actions" && (
          <ActionCenter
            actions={actions}
            approveAction={approveAction}
            approveAll={approveAll}
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
            completedCount={completedCount}
            rejectedCount={rejectedCount}
            changesCount={changesCount}
            pendingCount={pendingCount}
            extractionMode={extractionMode}
            onSourceOpen={setSourcePanel}
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
        {view === "confirmation" && <Confirmation resetDemo={requestReset} navigate={navigate} />}
      </main>
      {deckModalOpen && (
        <DeckPreviewModal
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
          actionCount={actions.length}
          onCancel={() => setResetConfirmOpen(false)}
          onConfirm={resetDemo}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
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
        <p>Scripted Sterling Family data. No live integrations connected.</p>
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
  recentActivity
}) {
  const title = {
    dashboard: "Advisor Command Center",
    meeting: "Meeting Intelligence Hub",
    notes: "Notes Workspace",
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
        <button
          className="icon-button"
          type="button"
          title="Notifications"
          onClick={() => setNotificationsOpen((open) => !open)}
        >
          <Bell size={18} />
        </button>
        {notificationsOpen && (
          <div className="notifications-panel">
            <div className="notifications-header">
              <strong>Notifications</strong>
              <span>{pendingCount} approvals pending</span>
            </div>
            <button className="notification-item" type="button" onClick={() => navigate("actions")}>
              <ClipboardCheck size={16} />
              <span>Review AI action queue</span>
            </button>
            <button className="notification-item" type="button" onClick={() => navigate("profile")}>
              <AlertTriangle size={16} />
              <span>Sterling allocation drift needs review</span>
            </button>
            {recentActivity.slice(0, 3).map((item) => (
              <div className="notification-item passive" key={item}>
                <History size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
        <button
          className="secondary-button approval-shortcut"
          type="button"
          title="Open Action Center"
          onClick={() => navigate("actions")}
        >
          <ClipboardCheck size={16} />
          {pendingCount} approvals
        </button>
        <button className="primary-button compact" type="button" onClick={() => navigate("notes")}>
          <Mic2 size={16} />
          Notes Workspace
        </button>
      </div>
    </header>
  );
}

function Dashboard({ navigate, onSourceOpen, recentActivity, showToast }) {
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
                <small>{meeting.prepNote}</small>
                {meeting.badge === "pending" && (
                  <button
                    className="text-button tiny"
                    type="button"
                    onClick={() => showToast("Source sync retry queued for the pending brief.")}
                  >
                    Retry Sync
                  </button>
                )}
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
              Notes Workspace
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
            onClick={() => onSourceOpen("Audit record AEQ-0427-1000")}
          >
            <Eye size={16} />
            View Immutable Record
          </button>
          <button
            className="secondary-button full"
            type="button"
            onClick={() => showToast("Audit log export is mocked for this prototype.")}
          >
            <Download size={16} />
            Export Audit Log
          </button>
        </div>
      </section>

      <section className="surface">
        <SectionHeader icon={Info} title="Prototype State Specs" />
        <div className="state-spec-list">
          <StateSpec label="No meetings today" text="Dashboard shows an empty schedule with an add/import calendar prompt." />
          <StateSpec label="Brief still preparing" text="Meeting rows show percent synced, ETA, and a retry control if a source fails." />
          <StateSpec label="Source error" text="Evidence chips show the failed system and route to the source record panel." />
        </div>
      </section>
    </div>
  );
}

function MeetingHub({
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
  onSourceOpen
}) {
  return (
    <div className="page-grid meeting-grid">
      <section className="summary-band meeting-summary">
        <div>
          <p className="eyebrow">10:00 AM · Quarterly review</p>
          <h2>Sterling Family</h2>
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
          <EvidenceStrip
            sources={["Salesforce FSC", "Calendar", "Task history", "Document vault"]}
            onSourceOpen={onSourceOpen}
          />
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
              <div className="chart-legend" aria-label="Portfolio allocation chart legend">
                <span><i className="current" /> Current allocation</span>
                <span><i className="target" /> Target allocation</span>
              </div>
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
            {agenda.map((item, index) => (
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
                          const nextAgenda = [...agenda];
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
  processNotes,
  notesError,
  setNotesError
}) {
  const hasEnoughInput = notes.trim().length >= minimumNoteCharacters || audioSelected;

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
          onClick={() => {
            setAudioSelected(true);
            setNotesError("");
          }}
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
            if (!notes) {
              setNotes(sampleNotes);
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
  approveAll,
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
  completedCount,
  rejectedCount,
  changesCount,
  pendingCount,
  extractionMode,
  onSourceOpen
}) {
  const hasActions = actions.length > 0;
  const canApproveAll = actions.some((action) => ["pending", "draft"].includes(action.status));

  return (
    <div className="page-grid actions-grid">
      <section className="summary-band">
        <div>
          <p className="eyebrow">Post-meeting execution · Sterling Family</p>
          <h2>
            {hasActions
              ? `AI has drafted ${actions.length} actions from your meeting notes`
              : "AI needs human review before actions can be proposed"}
          </h2>
          <p>
            {hasActions
              ? "Review source evidence, make edits, approve, reject, or request changes."
              : "The supplied notes did not match the scripted Sterling scenario strongly enough to create confident actions."}
          </p>
        </div>
        <div className="button-row">
          <span className="completion-pill">
            {completedCount} / {actions.length || 3} approved · {rejectedCount} rejected ·{" "}
            {changesCount} changes
          </span>
          <button className="primary-button" type="button" onClick={approveAll} disabled={!canApproveAll}>
            <Check size={16} />
            Approve All
          </button>
        </div>
      </section>

      <section className="surface action-stack">
        {extractionMode === "scripted" && hasActions && (
          <div className="demo-mode-banner">
            <Sparkles size={16} />
            <span>Demo mode: scripted output has been generated from the Sterling sample notes.</span>
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
          <TrustLine
            icon={ListChecks}
            label="Task creation"
            value="Routes to CSA queue"
            hint="CSA means Client Service Associate. This mock queue is where Daniel Reed receives operational tasks."
          />
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
                <p className="eyebrow">Sterling Family</p>
                <h3>Follow-up Email Draft</h3>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close email draft"
                onClick={() => setEmailModalOpen(false)}
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
          <span className="confidence" title={action.confidenceRationale}>
            <Info size={13} />
            AI Confidence: {action.confidence}%
          </span>
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
            {complete ? "Approved" : approving ? "Approving..." : "Approve"}
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

function DeckPreviewModal({ onClose, onToast }) {
  const slides = [
    {
      title: "Sterling Family Brief",
      kicker: "Quarterly Review",
      body: "Client context, recent life events, outstanding tasks, and advisor-ready talking points."
    },
    {
      title: "Suggested Agenda",
      kicker: "Advisor editable",
      body: "Liquidity needs, risk posture hypothesis, tax-loss harvesting, and trust transfer next steps."
    },
    {
      title: "Current vs Target Allocation",
      kicker: "Portfolio review",
      body: "Public equity is above target; fixed income is below target; rebalance discussion recommended."
    },
    {
      title: "Drift and Opportunity",
      kicker: "AI alerts",
      body: "$42K tax-loss harvesting opportunity and +6.8% equity drift flagged for review."
    }
  ];

  return (
    <div className="modal-backdrop" role="presentation" onKeyDown={trapModalFocus}>
      <div className="modal deck-modal" role="dialog" aria-modal="true" aria-label="Presentation preview">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Presentation ready</p>
            <h3>Sterling Family Client Deck</h3>
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
              <small>{slide.body}</small>
            </article>
          ))}
        </div>
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={() => onToast("PowerPoint export is mocked for this validation build.")}>
            <PanelRightOpen size={16} />
            Open in PowerPoint
          </button>
          <button className="primary-button" type="button" onClick={() => onToast("Deck download mocked for the prototype.")}>
            <Download size={16} />
            Download Deck
          </button>
        </div>
      </div>
    </div>
  );
}

function SourceRecordPanel({ source, onClose }) {
  const record = sourceRecords[source] || {
    system: "Meeting evidence",
    record: source,
    updated: "Extracted from meeting notes",
    details: ["This evidence line is tied to the advisor-provided notes in the current session."]
  };

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
        <span>Fields</span>
        <ul>
          {record.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ResetConfirmModal({ approvedCount, actionCount, onCancel, onConfirm }) {
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
        <p className="modal-help">
          This will discard {approvedCount} / {actionCount || 3} approvals, rejected actions, draft
          edits, presentation state, and meeting notes from this browser session.
        </p>
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

function ClientProfile({ activeTab, setActiveTab, navigate, showToast }) {
  return (
    <div className="page-grid profile-grid">
      <section className="summary-band profile-hero">
        <div>
          <p className="eyebrow">Client since 2018 · $28.4M AUM</p>
          <h2>Sterling Family</h2>
          <p>
            Multi-generational household with liquidity planning, concentrated tax events, trust
            administration, and education funding milestones.
          </p>
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
              disabled={!tab.enabled}
              title={tab.enabled ? "" : "Coming in production"}
              onClick={() => {
                if (tab.enabled) setActiveTab(tab.label);
              }}
            >
              {tab.label}
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
                Sterling Family is entering a more conservative planning phase after Anne's
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

function EvidenceStrip({ sources, onSourceOpen }) {
  return (
    <div className="evidence-strip">
      {sources.map((source) => (
        <button
          key={source}
          type="button"
          title={`Open source record: ${source}`}
          onClick={() => onSourceOpen?.(source)}
        >
          {source}
        </button>
      ))}
    </div>
  );
}

function TrustLine({ icon: Icon, label, value, hint }) {
  return (
    <div className="trust-line" title={hint || undefined}>
      <Icon size={17} />
      <span>{label}</span>
      <strong className={hint ? "has-hint" : ""}>{value}</strong>
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
