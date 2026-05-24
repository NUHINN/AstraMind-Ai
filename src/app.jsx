import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./styles.css";
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
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock3,
  Flame,
  Gauge,
  GraduationCap,
  Home,
  Layers3,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Maximize2,
  Medal,
  Menu,
  MessageSquare,
  Music2,
  Pause,
  Pencil,
  Play,
  Plus,
  Rocket,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Timer,
  Trash2,
  TrendingUp,
  Trophy,
  User,
  Volume2,
  Wand2,
  X,
  Zap
} from "lucide-react";

const APP_NAME = "AstraMind AI";
const accentColors = ["#9B5CFF", "#2F80FF", "#5EE7F5", "#36E1A1", "#FFD166", "#FF5F7E"];
const DataContext = createContext(null);
const ToastContext = createContext(null);

const defaultUsers = [
  {
    id: "demo-user",
    name: "Demo Student",
    email: "student@astramind.ai",
    password: "demo123",
    school: "Astra Academy",
    major: "Computer Science",
    target: "AI Internship",
    bio: "Building steady study momentum with AI-assisted planning.",
    avatar: "DS"
  }
];

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
const today = () => new Date();
const toISO = (date) => new Date(date).toISOString().slice(0, 10);
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const formatDate = (date, opts = { month: "short", day: "numeric" }) =>
  new Intl.DateTimeFormat("en", opts).format(new Date(date));
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const defaultTasks = [
  { id: "task-1", title: "Revise electromagnetism derivations", subject: "Physics", priority: "High", due: toISO(addDays(today(), 1)), minutes: 70, completed: false },
  { id: "task-2", title: "Write database indexing notes", subject: "CS", priority: "Medium", due: toISO(addDays(today(), 2)), minutes: 45, completed: true },
  { id: "task-3", title: "Solve calculus integration set", subject: "Math", priority: "High", due: toISO(addDays(today(), 3)), minutes: 80, completed: false },
  { id: "task-4", title: "Summarize organic chemistry mechanisms", subject: "Chemistry", priority: "Low", due: toISO(addDays(today(), 5)), minutes: 35, completed: false }
];

const defaultGoals = [
  { id: "goal-1", title: "Maintain 7-day study streak", target: 7, progress: 4, xp: 240, badge: "Streak Core" },
  { id: "goal-2", title: "Complete 20 Pomodoro sessions", target: 20, progress: 11, xp: 420, badge: "Deep Work" },
  { id: "goal-3", title: "Reach 85% Physics readiness", target: 85, progress: 63, xp: 380, badge: "Exam Shield" }
];

const defaultSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
  notifications: true,
  ambientAudio: true,
  ambientTrack: "cyan-rain",
  ambientVolume: 35,
  focusPreset: "pomodoro",
  compactSidebar: false,
  dailyTarget: 180,
  aiTone: "coach"
};

const exams = [
  { subject: "Physics", date: toISO(addDays(today(), 9)), readiness: 68, urgency: "High" },
  { subject: "Algorithms", date: toISO(addDays(today(), 17)), readiness: 74, urgency: "Medium" },
  { subject: "Statistics", date: toISO(addDays(today(), 25)), readiness: 58, urgency: "Medium" }
];

const weeklyStudyData = [
  { day: "Mon", focus: 132, tasks: 5, efficiency: 72 },
  { day: "Tue", focus: 158, tasks: 6, efficiency: 78 },
  { day: "Wed", focus: 96, tasks: 3, efficiency: 61 },
  { day: "Thu", focus: 184, tasks: 7, efficiency: 84 },
  { day: "Fri", focus: 146, tasks: 5, efficiency: 76 },
  { day: "Sat", focus: 212, tasks: 8, efficiency: 90 },
  { day: "Sun", focus: 118, tasks: 4, efficiency: 69 }
];

const subjectProgress = [
  { subject: "Physics", progress: 68, hours: 8.5 },
  { subject: "CS", progress: 82, hours: 6.4 },
  { subject: "Math", progress: 74, hours: 7.8 },
  { subject: "Chem", progress: 57, hours: 4.9 },
  { subject: "English", progress: 88, hours: 3.2 }
];

const radarData = [
  { metric: "Focus", value: 86 },
  { metric: "Recall", value: 72 },
  { metric: "Pace", value: 79 },
  { metric: "Balance", value: 68 },
  { metric: "Consistency", value: 91 },
  { metric: "Energy", value: 75 }
];

const moodProfiles = {
  Focused: {
    className: "mood-focused",
    intensity: "Deep work",
    suggestion: "Use 50-minute focus blocks and batch your hardest subject first.",
    modifier: 1.15
  },
  Tired: {
    className: "mood-tired",
    intensity: "Light review",
    suggestion: "Switch to shorter sessions, active recall, and low-friction revision.",
    modifier: 0.72
  },
  Stressed: {
    className: "mood-stressed",
    intensity: "Stabilize",
    suggestion: "Pick only the next high-leverage task and add a reset break after it.",
    modifier: 0.85
  },
  Motivated: {
    className: "mood-motivated",
    intensity: "Momentum",
    suggestion: "Ride the energy with progressive sessions and one stretch goal.",
    modifier: 1.05
  }
};

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/focus", label: "Focus Room", icon: Timer },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/settings", label: "Settings", icon: Settings }
];

const focusPresets = [
  { id: "pomodoro", label: "Pomodoro", focus: 25, break: 5, subject: "Deep Focus", description: "Classic sprint for daily study rhythm." },
  { id: "deep", label: "Deep Work", focus: 50, break: 10, subject: "Deep Focus", description: "Longer protected block for hard topics." },
  { id: "quick", label: "Quick Sprint", focus: 15, break: 3, subject: "Rapid Review", description: "Short push for low-energy momentum." },
  { id: "revision", label: "Revision Loop", focus: 35, break: 7, subject: "Active Recall", description: "Balanced block for recall and summary." },
  { id: "exam", label: "Exam Drill", focus: 60, break: 12, subject: "Exam Practice", description: "Timed simulation with a longer reset." },
  { id: "custom", label: "Custom", focus: null, break: null, subject: "Custom Study", description: "Uses your settings page focus and break minutes." }
];

const ambientTracks = [
  { id: "cyan-rain", label: "Cyan rain", type: "noise", frequency: 900, description: "Soft filtered rain texture." },
  { id: "library-hum", label: "Library hum", type: "hum", frequency: 118, description: "Low room tone for quiet concentration." },
  { id: "deep-space", label: "Deep space", type: "space", frequency: 64, description: "Slow drifting sci-fi pad." },
  { id: "soft-piano", label: "Soft piano", type: "piano", frequency: 261.63, description: "Gentle generated note pattern." }
];

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.warn(`Unable to read ${key} from localStorage`, error);
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Unable to save ${key} to localStorage`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

function generateHeatmap() {
  return Array.from({ length: 91 }, (_, index) => {
    const date = addDays(today(), index - 90);
    const signal = (index * 17 + 11) % 9;
    const level = signal > 6 ? 4 : signal > 4 ? 3 : signal > 2 ? 2 : signal > 0 ? 1 : 0;
    return { date: toISO(date), level, minutes: level * 35 + ((index * 13) % 28) };
  });
}

function useAppData() {
  const value = useContext(DataContext);
  if (!value) throw new Error("useAppData must be used inside DataContext");
  return value;
}

function useToasts() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToasts must be used inside ToastContext");
  return value;
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, tone = "info") => {
    const id = uid();
    setToasts((current) => [...current, { id, title, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4200);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              className="glass rounded-lg border border-white/10 p-4 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-cyan-300/15 p-2 text-cyan-200">
                  <Bell size={16} />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">{toast.title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-300">{toast.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function App() {
  const [users, setUsers] = useLocalStorage("astramind.users", defaultUsers);
  const [session, setSession] = useLocalStorage("astramind.session", null);
  const [tasks, setTasks] = useLocalStorage("astramind.tasks", defaultTasks);
  const [schedules, setSchedules] = useLocalStorage("astramind.schedules", []);
  const [focusSessions, setFocusSessions] = useLocalStorage("astramind.focusSessions", []);
  const [goals, setGoals] = useLocalStorage("astramind.goals", defaultGoals);
  const [mood, setMood] = useLocalStorage("astramind.mood", "Focused");
  const [settings, setSettings] = useLocalStorage("astramind.settings", defaultSettings);
  const [chatMessages, setChatMessages] = useLocalStorage("astramind.chatMessages", [
    { id: "welcome", role: "ai", text: "I mapped your recent rhythm. Your strongest focus window is trending between 7PM and 10PM.", time: "Now" },
    { id: "tip", role: "ai", text: "Physics has the nearest urgency. I recommend one active-recall block before any passive reading.", time: "Now" }
  ]);
  const currentUser = users.find((user) => user.id === session?.userId) || null;

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
    if (!user) return { ok: false, message: "Credentials did not match any local AstraMind profile." };
    setSession({ userId: user.id, loggedAt: new Date().toISOString() });
    return { ok: true, user };
  };

  const register = ({ name, email, password, school = "", major = "", target = "" }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: "That email already has a local profile." };
    }
    const cleanName = name.trim() || "AstraMind Student";
    const newUser = {
      id: uid(),
      name: cleanName,
      email: normalizedEmail,
      password,
      school: school.trim() || "Student Workspace",
      major: major.trim() || "General Studies",
      target: target.trim() || "Consistent study rhythm",
      bio: "New AstraMind profile ready for personalized planning.",
      avatar: initialsFromName(cleanName)
    };
    setUsers((current) => [newUser, ...current]);
    setSession({ userId: newUser.id, loggedAt: new Date().toISOString() });
    return { ok: true, user: newUser };
  };

  const updateProfile = (patch) => {
    if (!currentUser) return;
    setUsers((current) =>
      current.map((user) =>
        user.id === currentUser.id
          ? { ...user, ...patch, avatar: patch.name ? initialsFromName(patch.name) : user.avatar }
          : user
      )
    );
  };

  const logout = () => setSession(null);

  const data = {
    users,
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    tasks,
    setTasks,
    schedules,
    setSchedules,
    focusSessions,
    setFocusSessions,
    goals,
    setGoals,
    mood,
    setMood,
    settings,
    setSettings,
    chatMessages,
    setChatMessages
  };
  const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

  return (
    <DataContext.Provider value={data}>
      <ToastProvider>
        <Router>
          <AppBackground />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<RequireAuth><AppFrame><DashboardPage /></AppFrame></RequireAuth>} />
            <Route path="/planner" element={<RequireAuth><AppFrame><PlannerPage /></AppFrame></RequireAuth>} />
            <Route path="/focus" element={<RequireAuth><AppFrame immersive><FocusRoomPage /></AppFrame></RequireAuth>} />
            <Route path="/analytics" element={<RequireAuth><AppFrame><AnalyticsPage /></AppFrame></RequireAuth>} />
            <Route path="/assistant" element={<RequireAuth><AppFrame><AssistantPage /></AppFrame></RequireAuth>} />
            <Route path="/goals" element={<RequireAuth><AppFrame><GoalsPage /></AppFrame></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><AppFrame><SettingsPage /></AppFrame></RequireAuth>} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </DataContext.Provider>
  );
}

function AppBackground() {
  return (
    <div className="noise-layer">
      <div className="aurora" />
    </div>
  );
}

function RequireAuth({ children }) {
  const { currentUser } = useAppData();
  if (!currentUser) return <LoginPage />;
  return children;
}

function initialsFromName(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "AI";
}

function PageTransition({ children, className = "" }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
        transition={{ duration: 0.34, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

function AppFrame({ children, immersive = false }) {
  const { settings, setSettings, tasks, focusSessions, currentUser, logout } = useAppData();
  const { addToast } = useToasts();
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = settings.compactSidebar;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const notifications = useMemo(() => buildNotifications(tasks, focusSessions), [tasks, focusSessions]);

  return (
    <div className={immersive ? "min-h-screen focus-bg" : "min-h-screen"}>
      <aside
        className={`fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] rounded-lg glass-strong p-3 transition-all duration-300 lg:block ${
          collapsed ? "w-[5.4rem]" : "w-72"
        }`}
      >
        <SidebarContent collapsed={collapsed} onCollapse={() => setSettings((s) => ({ ...s, compactSidebar: !s.compactSidebar }))} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="h-full w-80 max-w-[86vw] glass-strong p-3"
              onClick={(event) => event.stopPropagation()}
            >
              <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} onCollapse={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-[7.4rem]" : "lg:pl-[19rem]"}`}>
        <header className="sticky top-0 z-30 mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-lg glass text-slate-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="hidden items-center gap-3 rounded-lg glass px-3 py-2 text-sm text-slate-300 transition hover:text-white sm:flex">
              <Home size={16} />
              Landing
            </Link>
          </div>

          <GlobalSearch />

          <div className="flex items-center gap-2">
            <Link to="/settings" className="hidden items-center gap-2 rounded-lg glass px-3 py-2 text-sm text-slate-300 transition hover:text-white md:flex">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-cyan-300/15 text-xs font-bold text-cyan-100">{currentUser?.avatar || "AI"}</span>
              <span className="max-w-32 truncate">{currentUser?.name || "Student"}</span>
            </Link>
            <div className="hidden rounded-lg glass px-3 py-2 text-sm text-slate-300 sm:block">
              <span className="text-cyan-200">{completedTasks}</span> completed today
            </div>
            <NotificationMenu notifications={notifications} />
            <button
              onClick={() => {
                logout();
                addToast("Logged out", "Your local session ended.");
              }}
              className="grid h-10 w-10 place-items-center rounded-lg glass text-slate-300 transition hover:text-white"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <PageTransition className="mx-auto max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8">{children}</PageTransition>
      </div>
    </div>
  );
}

function SidebarContent({ collapsed, onCollapse, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-1 py-2">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-3" onClick={onNavigate}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-300 shadow-[0_0_36px_rgba(94,231,245,0.28)]">
            <Sparkles size={22} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-lg font-bold tracking-wide text-white">{APP_NAME}</p>
              <p className="truncate text-xs text-slate-400">Student productivity OS</p>
            </div>
          )}
        </Link>
        <button
          className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:text-white lg:grid"
          onClick={onCollapse}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      <nav className="mt-7 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "sidebar-active"
                    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                } ${collapsed ? "justify-center" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className={`mt-6 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4 ${collapsed ? "hidden" : ""}`}>
        <div className="mb-3 flex items-center gap-2 text-cyan-100">
          <Wand2 size={17} />
          <span className="text-sm font-semibold">AI Status</span>
        </div>
        <p className="text-sm leading-5 text-slate-300">Adaptive planning engine is synced with tasks, focus sessions, and goals.</p>
      </div>
    </div>
  );
}

function NotificationMenu({ notifications }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-lg glass text-slate-200 transition hover:text-white"
        aria-label="Open notifications"
      >
        <Bell size={18} />
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(94,231,245,0.9)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-lg glass-strong p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-white">Smart notifications</p>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-cyan-100">{notifications.length}</span>
            </div>
            <div className="space-y-2">
              {notifications.map((item) => (
                <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GlobalSearch() {
  const { tasks, schedules, goals, focusSessions, mood, setChatMessages } = useAppData();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || event.target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (!isTyping && event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(
    () => buildSearchResults({ query, tasks, schedules, goals, focusSessions, mood }),
    [query, tasks, schedules, goals, focusSessions, mood]
  );

  const runResult = (result) => {
    if (!result) return;
    if (result.kind === "ask") {
      const prompt = result.query;
      const response = generateAssistantReply(prompt, tasks, mood);
      setChatMessages((current) => [
        ...current,
        { id: uid(), role: "user", text: prompt, time: "Now" },
        { id: uid(), role: "ai", text: response, time: "Now" }
      ]);
      addToast("AstraMind answered", "Your search was sent to the assistant.");
    }
    navigate(result.to);
    setQuery("");
    setOpen(false);
  };

  return (
    <div
      className="relative hidden min-w-0 flex-1 max-w-xl md:block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <div className="flex items-center gap-3 rounded-lg glass px-4 py-2 text-sm text-slate-400 transition focus-within:border-cyan-300/40 focus-within:text-white">
        <Search size={17} className="shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter") runResult(results[0]);
            if (event.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search plans, subjects, sessions, or ask AstraMind"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        ) : (
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-500">/</span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg glass-strong p-2 shadow-2xl"
          >
            <div className="max-h-[25rem] overflow-y-auto">
              {results.length ? (
                results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => runResult(result)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-white/[0.07]"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">{result.title}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-400">{result.description}</span>
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-500">{result.type}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="font-display text-sm font-semibold text-white">No matches found</p>
                  <p className="mt-1 text-xs text-slate-400">Try a subject, task name, page, or question.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function buildSearchResults({ query, tasks, schedules, goals, focusSessions, mood }) {
  const normalized = query.trim().toLowerCase();
  const baseResults = [
    ...navItems.map((item) => ({
      id: `page-${item.to}`,
      title: item.label,
      description: `Open the ${item.label.toLowerCase()} workspace`,
      type: "Page",
      to: item.to,
      icon: item.icon,
      haystack: `${item.label} ${item.to}`
    })),
    ...tasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      description: `${task.subject} · ${task.priority} priority · ${task.completed ? "completed" : "open"}`,
      type: "Task",
      to: "/dashboard",
      icon: ClipboardList,
      haystack: `${task.title} ${task.subject} ${task.priority} task`
    })),
    ...schedules.flatMap((schedule) => [
      {
        id: `schedule-${schedule.id}`,
        title: `${schedule.subject} plan`,
        description: `${schedule.intensity} · priority ${schedule.priorityScore}/100`,
        type: "Plan",
        to: "/planner",
        icon: CalendarCheck,
        haystack: `${schedule.subject} ${schedule.intensity} ${schedule.mood} plan schedule`
      },
      ...schedule.sessions.slice(0, 3).map((session) => ({
        id: `session-${schedule.id}-${session.id}`,
        title: session.focus,
        description: `${schedule.subject} · ${formatDate(session.date)} · ${session.minutes} min`,
        type: "Session",
        to: "/planner",
        icon: Timer,
        haystack: `${schedule.subject} ${session.focus} ${session.minutes} session`
      }))
    ]),
    ...exams.map((exam) => ({
      id: `exam-${exam.subject}`,
      title: `${exam.subject} exam`,
      description: `${daysUntil(exam.date)} days left · ${exam.readiness}% ready`,
      type: "Exam",
      to: "/dashboard",
      icon: GraduationCap,
      haystack: `${exam.subject} exam readiness ${exam.urgency}`
    })),
    ...goals.map((goal) => ({
      id: `goal-${goal.id}`,
      title: goal.title,
      description: `${goal.progress}/${goal.target} · ${goal.badge}`,
      type: "Goal",
      to: "/goals",
      icon: Trophy,
      haystack: `${goal.title} ${goal.badge} goal xp`
    })),
    {
      id: "analytics-weekly",
      title: "Weekly study analytics",
      description: "Open charts, trends, subject progress, and heatmap",
      type: "Insight",
      to: "/analytics",
      icon: BarChart3,
      haystack: "analytics weekly chart heatmap productivity subject progress trend"
    },
    {
      id: "focus-sessions",
      title: `${focusSessions.length} logged focus sessions`,
      description: "Open the Focus Room session tracker",
      type: "Focus",
      to: "/focus",
      icon: Flame,
      haystack: "focus room pomodoro timer sessions music breathing"
    },
    {
      id: "mood-planner",
      title: `${mood} mood planning`,
      description: moodProfiles[mood].suggestion,
      type: "Mood",
      to: "/planner",
      icon: Activity,
      haystack: `${mood} mood planning tired stressed motivated focused`
    }
  ];

  if (!normalized) return baseResults.slice(0, 7);

  const filtered = baseResults
    .map((result) => ({
      ...result,
      score: scoreSearchResult(result, normalized)
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return [
    ...filtered,
    {
      id: `ask-${normalized}`,
      title: `Ask AstraMind: "${query.trim()}"`,
      description: "Send this search as a simulated AI assistant prompt",
      type: "Ask",
      to: "/assistant",
      icon: MessageSquare,
      kind: "ask",
      query: query.trim(),
      haystack: query
    }
  ];
}

function scoreSearchResult(result, query) {
  const haystack = result.haystack.toLowerCase();
  const title = result.title.toLowerCase();
  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (title.includes(query)) return 60;
  return query.split(/\s+/).reduce((score, word) => score + (haystack.includes(word) ? 12 : 0), 0);
}

function buildNotifications(tasks, focusSessions) {
  const dueSoon = tasks.find((task) => !task.completed);
  const minutesToday = focusSessions
    .filter((session) => session.date === toISO(today()))
    .reduce((sum, session) => sum + session.minutes, 0);
  return [
    {
      title: "Exam radar",
      body: `${exams[0].subject} is in ${daysUntil(exams[0].date)} days. Add one active recall sprint today.`
    },
    {
      title: dueSoon ? "Task recovery" : "Queue clear",
      body: dueSoon ? `${dueSoon.subject} has an open ${dueSoon.priority.toLowerCase()} priority task waiting.` : "No missed tasks detected. Keep the streak warm."
    },
    {
      title: minutesToday > 90 ? "Break suggestion" : "Focus reminder",
      body: minutesToday > 90 ? "You have crossed 90 focused minutes today. A short reset will protect recall." : "Your daily focus target has room for one clean Pomodoro."
    }
  ];
}

function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <LandingNav />
      <HeroSection />
      <FeatureSection />
      <InteractiveDemo />
      <Testimonials />
      <FinalCta />
    </div>
  );
}

function LoginPage() {
  const { login, register } = useAppData();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "student@astramind.ai",
    password: "demo123",
    school: "",
    major: "",
    target: ""
  });

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }
    if (mode === "register" && !form.name.trim()) {
      setError("Add your name so AstraMind can personalize the dashboard.");
      return;
    }
    if (mode === "register" && form.password.length < 5) {
      setError("Use at least 5 characters for this local demo password.");
      return;
    }
    const result = mode === "login" ? login(form) : register(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    addToast(mode === "login" ? "Logged in" : "Profile created", `Welcome, ${result.user.name}.`);
    navigate("/dashboard");
  };

  const useDemo = () => {
    setMode("login");
    setForm((current) => ({ ...current, email: "student@astramind.ai", password: "demo123" }));
    setError("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <ParticleField count={26} />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <Link to="/" className="mb-8 inline-flex items-center gap-3 rounded-lg glass px-3 py-2 text-sm text-slate-300 transition hover:text-white">
            <Sparkles size={18} className="text-cyan-200" />
            {APP_NAME}
          </Link>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Private student portal</p>
          <h1 className="font-display mt-3 text-5xl font-black leading-tight text-white sm:text-6xl">
            Login to your AI study command center.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Your name, profile, focus preferences, tasks, goals, and study sessions are stored locally in this browser for a personal dashboard experience.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["Local", "auth"],
              ["Custom", "profile"],
              ["Synced", "dashboard"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg glass p-4 text-center">
                <p className="font-display text-xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.08 }} className="relative z-10 rounded-lg glass-strong p-5 sm:p-7">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1">
            {["login", "register"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setMode(item);
                  setError("");
                }}
                className={`rounded-md px-4 py-3 text-sm font-semibold capitalize transition ${
                  mode === item ? "bg-cyan-300/15 text-white shadow-[0_0_24px_rgba(94,231,245,0.12)]" : "text-slate-400 hover:text-white"
                }`}
              >
                {item === "login" ? "Login" : "Create profile"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <IconField icon={User} label="Your name">
                  <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" className="field" />
                </IconField>
                <IconField icon={GraduationCap} label="School">
                  <input value={form.school} onChange={(event) => update("school", event.target.value)} placeholder="University or school" className="field" />
                </IconField>
              </div>
            )}
            <IconField icon={Mail} label="Email">
              <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" className="field" />
            </IconField>
            <IconField icon={Lock} label="Password">
              <input type="password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="Your password" className="field" />
            </IconField>
            {mode === "register" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <IconField icon={BookOpen} label="Major">
                  <input value={form.major} onChange={(event) => update("major", event.target.value)} placeholder="Computer Science" className="field" />
                </IconField>
                <IconField icon={Target} label="Goal">
                  <input value={form.target} onChange={(event) => update("target", event.target.value)} placeholder="AI internship" className="field" />
                </IconField>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">{error}</div>
            )}

            <button type="submit" className="neon-button flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white">
              <ShieldCheck size={18} />
              {mode === "login" ? "Enter dashboard" : "Create and enter dashboard"}
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-white">Demo credentials</p>
                <p className="mt-1 text-xs text-slate-400">student@astramind.ai · demo123</p>
              </div>
              <button onClick={useDemo} className="ghost-button rounded-lg px-4 py-2 text-sm font-semibold text-white">
                Fill demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function IconField({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
        <Icon size={16} className="text-cyan-200" />
        {label}
      </span>
      {children}
    </label>
  );
}

function LandingNav() {
  const { currentUser } = useAppData();
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-lg glass px-3 py-2">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-300 shadow-[0_0_30px_rgba(94,231,245,0.28)]">
            <Sparkles size={20} />
          </div>
          <span className="font-display text-lg font-bold text-white">{APP_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#demo" className="transition hover:text-white">Demo</a>
          <a href="#stories" className="transition hover:text-white">Students</a>
        </nav>
        <Link to={currentUser ? "/dashboard" : "/login"} className="neon-button rounded-lg px-4 py-2 text-sm font-semibold text-white">
          {currentUser ? "Dashboard" : "Login"}
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  const { currentUser } = useAppData();
  return (
    <section className="relative min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <ParticleField count={32} />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-sm text-cyan-100">
            <Sparkles size={16} />
            AI planning, focus, analytics, and goals in one student OS
          </div>
          <h1 className="font-display text-5xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Your <span className="gradient-text">AI-Powered</span> Study Companion
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            AstraMind turns assignments, exams, energy, and focus sessions into a living study plan that feels personal, intelligent, and beautifully calm.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={currentUser ? "/dashboard" : "/login"} className="neon-button inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white">
              <Rocket size={18} />
              {currentUser ? "Open dashboard" : "Login to plan"}
            </Link>
            <a href="#demo" className="ghost-button inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white">
              <Play size={18} />
              View demo
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["92%", "focus score"],
              ["14h", "saved weekly"],
              ["3.7x", "review lift"]
            ].map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="rounded-lg glass p-4 text-center"
              >
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <HeroDashboardPreview />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070B14] to-transparent" />
    </section>
  );
}

function ParticleField({ count = 20 }) {
  return (
    <div className="particle-field">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="particle"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${18 + ((index * 29) % 78)}%`,
            "--duration": `${9 + (index % 7)}s`,
            "--x": `${index % 2 ? "-" : ""}${32 + (index % 5) * 16}px`,
            animationDelay: `${index * 0.28}s`
          }}
        />
      ))}
    </div>
  );
}

function HeroDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.14 }}
      className="relative min-h-[35rem]"
    >
      <div className="absolute -left-6 top-14 z-20 hidden rounded-lg glass px-4 py-3 shadow-2xl md:block floating">
        <p className="text-xs text-slate-400">AI Insight</p>
        <p className="mt-1 text-sm font-semibold text-white">Evening focus is up 18%</p>
      </div>
      <div className="absolute -right-4 bottom-14 z-20 hidden rounded-lg glass px-4 py-3 shadow-2xl md:block floating-slow">
        <p className="text-xs text-slate-400">Next best action</p>
        <p className="mt-1 text-sm font-semibold text-white">Physics sprint at 8:00 PM</p>
      </div>
      <div className="hero-preview-grid glow-border scanline relative rounded-lg glass-strong p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Live command center</p>
            <h2 className="font-display text-2xl font-bold text-white">Study Orbit</h2>
          </div>
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">AI synced</div>
        </div>
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Productivity score</p>
                <Gauge size={18} className="text-cyan-200" />
              </div>
              <div className="mt-5 flex items-center justify-center">
                <CircularScore score={92} size={156} />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="mb-3 text-sm font-semibold text-white">AI task queue</p>
              {["Physics recall sprint", "Algorithms dry run", "Calculus problem set"].map((item, index) => (
                <div key={item} className="mb-2 flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-cyan-300/10 text-xs text-cyan-100">{index + 1}</span>
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-56 rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyStudyData}>
                  <defs>
                    <linearGradient id="heroFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5EE7F5" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#5EE7F5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#7f8bb3" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ display: "none" }} />
                  <Area type="monotone" dataKey="focus" stroke="#5EE7F5" strokeWidth={3} fill="url(#heroFocus)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Streak 12d", "XP 4,820", "Readiness 76%", "Tasks 18"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="font-display text-xl font-bold text-white">{item.split(" ")[1]}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{item.split(" ")[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureSection() {
  const features = [
    { icon: CalendarCheck, title: "AI Schedule Generator", text: "Creates time-blocked study plans based on deadlines, difficulty, energy, and available hours." },
    { icon: BarChart3, title: "Productivity Analytics", text: "Turns focus sessions and task completion into trends, efficiency signals, and readiness scores." },
    { icon: Timer, title: "Smart Focus Timer", text: "A calming Pomodoro room with breathing cues, session tracking, and ambient study controls." },
    { icon: Wand2, title: "AI Recommendations", text: "Simulated assistant logic nudges the next best action without overwhelming the student." },
    { icon: Activity, title: "Mood-Based Planning", text: "Adapts intensity, color, and guidance when you feel focused, tired, stressed, or motivated." },
    { icon: ShieldCheck, title: "Performance Insights", text: "Exam countdowns, readiness indicators, and subject gaps stay visible without clutter." }
  ];

  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Feature Matrix" title="Everything feels intelligent, fast, and deliberate." text="AstraMind is designed like a real AI SaaS command center, but every interaction is powered by frontend logic and local persistence." />
      <div className="mx-auto mt-12 grid max-w-7xl mobile-safe-grid gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -7, rotateX: 3, rotateY: -3 }}
              className="glow-border rounded-lg glass p-6 transition"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-300/20 text-cyan-100">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function InteractiveDemo() {
  return (
    <section id="demo" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="rounded-lg glass-strong p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">AI Demo</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-white">Generated study plan</h2>
            </div>
            <Sparkles className="text-cyan-200" />
          </div>
          <div className="space-y-3">
            {[
              ["7:00 PM", "Physics recall", "High leverage"],
              ["8:05 PM", "Break and breathing", "Energy reset"],
              ["8:20 PM", "Algorithms drills", "Timed practice"],
              ["9:25 PM", "Summary review", "Memory lock"]
            ].map(([time, title, tag], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.05] p-4"
              >
                <div className="rounded-lg bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">{time}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm text-slate-400">{tag}</p>
                </div>
                <Check size={18} className="text-emerald-300" />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg glass p-5">
            <p className="mb-4 font-display text-lg font-bold text-white">Task completion</p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStudyData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="day" stroke="#7f8bb3" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ display: "none" }} />
                  <Bar dataKey="tasks" radius={[8, 8, 2, 2]} fill="#9B5CFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-lg glass p-5">
            <p className="mb-4 font-display text-lg font-bold text-white">Study heatmap</p>
            <Heatmap compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const stories = [
    { name: "Maya R.", role: "Pre-med student", text: "AstraMind made my revision feel less chaotic. The planner kept reshuffling around my energy instead of just dumping tasks at me." },
    { name: "Ibrahim K.", role: "CS sophomore", text: "The dashboard looks like a startup product, but the useful part is the AI queue. I always know what to do next." },
    { name: "Sofia L.", role: "Design major", text: "The focus room is beautiful. I stopped bouncing between apps and started finishing sessions in one place." }
  ];

  return (
    <section id="stories" className="px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Student Signals" title="Built for calm momentum." text="Modern testimonials, clean proof points, and premium product storytelling for a portfolio-grade presentation." />
      <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
        {stories.map((story, index) => (
          <motion.div
            key={story.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-lg glass p-6"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-purple-500/50 to-cyan-300/30 font-display font-bold text-white">
                {story.name.split(" ").map((part) => part[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-white">{story.name}</p>
                <p className="text-sm text-slate-400">{story.role}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{story.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  const { currentUser } = useAppData();
  return (
    <section className="px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg glass-strong p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100 shadow-[0_0_42px_rgba(94,231,245,0.25)]">
          <Rocket size={30} />
        </div>
        <h2 className="font-display text-4xl font-black text-white sm:text-5xl">Your semester does not need to feel scattered.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-slate-300">Launch the dashboard, generate a plan, start a focus session, and let the simulated AI layer turn productivity into a polished experience.</p>
        <Link to={currentUser ? "/dashboard" : "/login"} className="neon-button mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 font-semibold text-white">
          {currentUser ? "Open AstraMind" : "Login to AstraMind"}
          <ChevronRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">{eyebrow}</p>
      <h2 className="font-display mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-400">{text}</p>
    </div>
  );
}

function DashboardPage() {
  const { tasks, focusSessions, mood, currentUser } = useAppData();
  const score = calculateProductivityScore(tasks, focusSessions);
  const greeting = getGreeting();
  const firstName = currentUser?.name?.split(" ")[0] || "Student";
  const minutesToday = focusSessions
    .filter((session) => session.date === toISO(today()))
    .reduce((sum, session) => sum + session.minutes, 0);

  return (
    <div className={`space-y-5 ${moodProfiles[mood].className}`}>
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-lg glass-strong p-6 mood-aura">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Command center</p>
              <h1 className="font-display mt-3 text-4xl font-black text-white sm:text-5xl">
                {greeting}, {firstName}
                <span className="ml-2 inline-block align-middle text-3xl sm:text-4xl">👋</span>
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">AstraMind recommends a controlled sprint: finish one high-priority task, then review your weakest exam topic.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <MetricTile label="Productivity" value={`${score}%`} icon={Gauge} />
              <MetricTile label="Focused today" value={`${minutesToday}m`} icon={Clock3} />
            </div>
          </div>
        </div>
        <AIInsightsWidget />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
        <ProductivityScoreCard score={score} />
        <DailyTasksWidget />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <UpcomingExamsCard />
        <MomentumPanel />
      </section>
    </div>
  );
}

function MetricTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
      <div className="mb-3 flex items-center justify-between text-slate-400">
        <span className="text-xs uppercase tracking-[0.16em]">{label}</span>
        <Icon size={17} className="text-cyan-200" />
      </div>
      <p className="font-display text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ProductivityScoreCard({ score }) {
  return (
    <div className="rounded-lg glass p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.20em] text-cyan-200">Focus engine</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-white">Productivity Score</h2>
        </div>
        <Zap className="text-cyan-200" />
      </div>
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <CircularScore score={score} size={210} />
        <div className="w-full space-y-4">
          <ProgressRow label="Daily efficiency" value={score - 4} />
          <ProgressRow label="Task momentum" value={84} />
          <ProgressRow label="Revision balance" value={72} />
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4 text-sm leading-6 text-slate-300">
            Your focus improves during evening sessions. Keep the next difficult block before passive reading.
          </div>
        </div>
      </div>
    </div>
  );
}

function CircularScore({ score, size = 180 }) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (score / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B5CFF" />
            <stop offset="55%" stopColor="#2F80FF" />
            <stop offset="100%" stopColor="#5EE7F5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-5xl font-black text-white">{score}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">AI score</p>
      </div>
    </div>
  );
}

function ProgressRow({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function DailyTasksWidget() {
  const { tasks, setTasks } = useAppData();
  const { addToast } = useToasts();
  const [draft, setDraft] = useState({ title: "", subject: "Physics", priority: "Medium", minutes: 45 });
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const dragIndex = useRef(null);

  const addTask = () => {
    if (!draft.title.trim()) return;
    const task = {
      id: uid(),
      title: draft.title.trim(),
      subject: draft.subject,
      priority: draft.priority,
      due: toISO(addDays(today(), draft.priority === "High" ? 1 : 3)),
      minutes: Number(draft.minutes) || 45,
      completed: false
    };
    setTasks((current) => [task, ...current]);
    setDraft((current) => ({ ...current, title: "" }));
    addToast("Task added", `${task.subject} was added to your AI queue.`);
  };

  const updateTask = (id, patch) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  };

  const removeTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    addToast("Task removed", "The queue has been recalibrated.");
  };

  const onDrop = (index) => {
    const from = dragIndex.current;
    if (from === null || from === index) return;
    setTasks((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndex.current = null;
  };

  return (
    <div className="rounded-lg glass p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.20em] text-cyan-200">Today</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-white">Daily Tasks</h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">{tasks.filter((task) => task.completed).length}/{tasks.length} complete</span>
      </div>

      <div className="mb-5 grid gap-2 md:grid-cols-[1fr_8rem_8rem_6rem_auto]">
        <input
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          onKeyDown={(event) => event.key === "Enter" && addTask()}
          placeholder="Add a study task..."
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
        />
        <select
          value={draft.subject}
          onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
        >
          {["Physics", "CS", "Math", "Chemistry", "English"].map((subject) => <option key={subject}>{subject}</option>)}
        </select>
        <select
          value={draft.priority}
          onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
        >
          {["High", "Medium", "Low"].map((priority) => <option key={priority}>{priority}</option>)}
        </select>
        <input
          type="number"
          min="10"
          max="240"
          value={draft.minutes}
          onChange={(event) => setDraft((current) => ({ ...current, minutes: event.target.value }))}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
        />
        <button onClick={addTask} className="neon-button inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white">
          <Plus size={17} />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            layout
            draggable
            onDragStart={() => { dragIndex.current = index; }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(index)}
            className={`rounded-lg border p-3 transition ${
              task.completed ? "border-emerald-300/20 bg-emerald-300/[0.05]" : "border-white/10 bg-white/[0.045] hover:border-cyan-300/30"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => updateTask(task.id, { completed: !task.completed })}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition ${
                  task.completed ? "border-emerald-300/40 bg-emerald-300/20 text-emerald-100" : "border-white/10 bg-white/[0.05] text-slate-400 hover:text-white"
                }`}
                aria-label="Toggle task completion"
              >
                {task.completed ? <Check size={17} /> : <Circle size={16} />}
              </button>
              <div className="min-w-0 flex-1">
                {editingId === task.id ? (
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        updateTask(task.id, { title: editTitle });
                        setEditingId(null);
                      }
                    }}
                    className="w-full rounded-lg border border-cyan-300/40 bg-black/20 px-3 py-2 text-sm text-white outline-none"
                  />
                ) : (
                  <p className={`font-medium ${task.completed ? "text-slate-400 line-through" : "text-white"}`}>{task.title}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">{task.subject} · {task.minutes} min · due {formatDate(task.due)}</p>
              </div>
              <PriorityBadge priority={task.priority} />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setEditTitle(task.title);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:text-white"
                  aria-label="Edit task"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => removeTask(task.id)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-300/30 hover:text-red-200"
                  aria-label="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "border-red-300/30 bg-red-300/10 text-red-100",
    Medium: "border-yellow-300/30 bg-yellow-300/10 text-yellow-100",
    Low: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
  };
  return <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${styles[priority]}`}>{priority}</span>;
}

function UpcomingExamsCard() {
  return (
    <div className="rounded-lg glass p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.20em] text-cyan-200">Exam Radar</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-white">Upcoming Exams</h2>
        </div>
        <GraduationCap className="text-cyan-200" />
      </div>
      <div className="space-y-3">
        {exams.map((exam) => (
          <div key={exam.subject} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{exam.subject}</p>
                <p className="text-sm text-slate-400">{formatDate(exam.date, { weekday: "short", month: "short", day: "numeric" })} · {daysUntil(exam.date)} days left</p>
              </div>
              <PriorityBadge priority={exam.urgency === "High" ? "High" : "Medium"} />
            </div>
            <ProgressRow label="Preparation" value={exam.readiness} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AIInsightsWidget() {
  const { tasks, mood } = useAppData();
  const openHigh = tasks.filter((task) => !task.completed && task.priority === "High").length;
  const insights = [
    "Your focus improves during evening sessions.",
    openHigh > 0 ? `${openHigh} high-priority item${openHigh > 1 ? "s need" : " needs"} protection today.` : "High-priority queue is currently stable.",
    mood === "Tired" ? "Use lighter recall blocks until energy recovers." : "Physics needs more revision time before the next exam."
  ];

  return (
    <div className="rounded-lg glass p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.20em] text-cyan-200">Neural Signals</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-white">AI Insights</h2>
        </div>
        <Bot className="text-cyan-200" />
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4"
          >
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(94,231,245,0.9)]" />
            <p className="text-sm leading-6 text-slate-300">{insight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MomentumPanel() {
  return (
    <div className="rounded-lg glass p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.20em] text-cyan-200">Weekly Trend</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-white">Momentum Graph</h2>
        </div>
        <TrendingUp className="text-cyan-200" />
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyStudyData}>
            <defs>
              <linearGradient id="dashboardFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9B5CFF" stopOpacity={0.65} />
                <stop offset="95%" stopColor="#9B5CFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dashboardEfficiency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5EE7F5" stopOpacity={0.48} />
                <stop offset="95%" stopColor="#5EE7F5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis dataKey="day" stroke="#7f8bb3" tickLine={false} axisLine={false} />
            <YAxis stroke="#7f8bb3" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "rgba(8,13,27,0.92)", border: "1px solid rgba(143,160,214,0.24)", borderRadius: 8, color: "#fff" }} />
            <Area type="monotone" dataKey="focus" stroke="#9B5CFF" strokeWidth={3} fill="url(#dashboardFocus)" />
            <Area type="monotone" dataKey="efficiency" stroke="#5EE7F5" strokeWidth={3} fill="url(#dashboardEfficiency)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PlannerPage() {
  const { schedules, setSchedules, mood, setMood } = useAppData();
  const { addToast } = useToasts();
  const [form, setForm] = useState({
    subject: "Physics",
    hours: 6,
    deadline: toISO(addDays(today(), 7)),
    examDate: toISO(addDays(today(), 12)),
    difficulty: 4
  });
  const profile = moodProfiles[mood];

  const generatePlan = () => {
    const plan = createStudyPlan(form, mood);
    setSchedules((current) => [plan, ...current].slice(0, 7));
    addToast("AI plan generated", `${form.subject} plan was tuned for ${mood.toLowerCase()} energy.`);
  };

  return (
    <div className={`space-y-5 ${profile.className}`}>
      <div className="rounded-lg glass-strong p-6 mood-aura">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">AI Planner</p>
            <h1 className="font-display mt-3 text-4xl font-black text-white">Adaptive study scheduling</h1>
            <p className="mt-4 max-w-3xl text-slate-300">{profile.suggestion}</p>
          </div>
          <MoodSelector mood={mood} setMood={setMood} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg glass p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Plan inputs</h2>
            <SlidersHorizontal className="text-cyan-200" />
          </div>
          <div className="grid gap-4">
            <FormField label="Subject">
              <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="field">
                {["Physics", "Algorithms", "Calculus", "Chemistry", "Statistics", "English"].map((subject) => <option key={subject}>{subject}</option>)}
              </select>
            </FormField>
            <FormField label="Study hours needed">
              <input type="number" min="1" max="40" value={form.hours} onChange={(event) => setForm({ ...form, hours: Number(event.target.value) })} className="field" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Deadline">
                <input type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} className="field" />
              </FormField>
              <FormField label="Exam date">
                <input type="date" value={form.examDate} onChange={(event) => setForm({ ...form, examDate: event.target.value })} className="field" />
              </FormField>
            </div>
            <FormField label={`Difficulty level: ${form.difficulty}/5`}>
              <input type="range" min="1" max="5" value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: Number(event.target.value) })} className="range-neon w-full" />
            </FormField>
            <button onClick={generatePlan} className="neon-button mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white">
              <Wand2 size={18} />
              Generate AI schedule
            </button>
          </div>
        </div>

        <div className="rounded-lg glass p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.20em] text-cyan-200">Generated Output</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-white">Revision timeline</h2>
            </div>
            <CalendarDays className="text-cyan-200" />
          </div>
          {schedules.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No generated plans yet" text="Enter a subject profile and let AstraMind simulate an optimized schedule." />
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <PlanCard key={schedule.id} schedule={schedule} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function MoodSelector({ mood, setMood }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Object.keys(moodProfiles).map((item) => (
        <button
          key={item}
          onClick={() => setMood(item)}
          className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
            mood === item ? "border-cyan-300/50 bg-cyan-300/15 text-white" : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function PlanCard({ schedule }) {
  return (
    <motion.div layout className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-xl font-bold text-white">{schedule.subject}</p>
          <p className="text-sm text-slate-400">{schedule.intensity} · Priority {schedule.priorityScore}/100 · {schedule.totalHours} planned hours</p>
        </div>
        <span className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">{schedule.mood} mode</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {schedule.sessions.map((session) => (
          <div key={session.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{formatDate(session.date)}</p>
              <span className="text-xs text-slate-400">{session.minutes} min</span>
            </div>
            <p className="text-sm text-slate-300">{session.focus}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-purple-300/20 bg-purple-300/[0.07] p-3 text-sm leading-6 text-slate-300">
        {schedule.recommendation}
      </div>
    </motion.div>
  );
}

function createStudyPlan(form, mood) {
  const daysToDeadline = Math.max(1, daysUntil(form.deadline));
  const profile = moodProfiles[mood];
  const blockLength = mood === "Tired" ? 35 : mood === "Focused" ? 55 : 45;
  const totalMinutes = Number(form.hours) * 60;
  const sessionsNeeded = clamp(Math.ceil(totalMinutes / blockLength), 3, 10);
  const urgency = clamp(100 - daysToDeadline * 5, 20, 95);
  const difficultySignal = Number(form.difficulty) * 16;
  const priorityScore = clamp(Math.round((urgency + difficultySignal) * profile.modifier), 32, 99);
  const focusModes = [
    "Concept map and weak-point scan",
    "Active recall sprint",
    "Timed problem set",
    "Mistake journal refinement",
    "Formula and definition lock",
    "Exam-style simulation",
    "Rapid summary review",
    "Spaced repetition pass"
  ];

  const sessions = Array.from({ length: sessionsNeeded }, (_, index) => ({
    id: uid(),
    date: toISO(addDays(today(), Math.min(index + 1, daysToDeadline))),
    minutes: index === sessionsNeeded - 1 ? totalMinutes - blockLength * (sessionsNeeded - 1) || blockLength : blockLength,
    focus: focusModes[index % focusModes.length]
  }));

  return {
    id: uid(),
    subject: form.subject,
    mood,
    intensity: profile.intensity,
    totalHours: Number(form.hours),
    priorityScore,
    sessions,
    createdAt: toISO(today()),
    recommendation: priorityScore > 80
      ? "AstraMind marked this as high urgency. Protect the first two sessions from multitasking and use recall before notes."
      : "The workload is manageable. Keep sessions consistent and finish each block with a one-minute summary."
  };
}

function stopAmbientAudio(audioRef) {
  const audio = audioRef.current;
  if (!audio) return;
  audio.nodes?.forEach((node) => {
    try {
      if (typeof node.stop === "function") node.stop();
    } catch (error) {
      // Already stopped.
    }
    try {
      node.disconnect?.();
    } catch (error) {
      // Already disconnected.
    }
  });
  if (audio.intervalId) window.clearInterval(audio.intervalId);
  audio.ctx?.close?.();
  audioRef.current = null;
}

function createNoiseSource(ctx) {
  const seconds = 2;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

function startAmbientAudio(track, volume, audioRef) {
  stopAmbientAudio(audioRef);
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;

  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = clamp(volume, 0, 100) / 100 * 0.16;
  master.connect(ctx.destination);
  const nodes = [master];
  let intervalId = null;

  if (track.type === "noise") {
    const source = createNoiseSource(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = track.frequency;
    filter.Q.value = 0.9;
    source.connect(filter);
    filter.connect(master);
    source.start();
    nodes.push(source, filter);
  }

  if (track.type === "hum" || track.type === "space") {
    [track.frequency, track.frequency * 1.5, track.frequency * 2].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = track.type === "space" ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.value = track.type === "space" ? 0.22 / (index + 1) : 0.16 / (index + 1);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      nodes.push(oscillator, gain);
    });
  }

  if (track.type === "piano") {
    const notes = [261.63, 329.63, 392, 523.25, 440, 349.23];
    let step = 0;
    const playNote = () => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = notes[step % notes.length];
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.9);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 2);
      step += 1;
    };
    playNote();
    intervalId = window.setInterval(playNote, 2200);
  }

  audioRef.current = { ctx, master, nodes, intervalId };
  return true;
}

function FocusRoomPage() {
  const { settings, setSettings, focusSessions, setFocusSessions } = useAppData();
  const { addToast } = useToasts();
  const [selectedPresetId, setSelectedPresetId] = useState(settings.focusPreset || "pomodoro");
  const selectedPreset = focusPresets.find((preset) => preset.id === selectedPresetId) || focusPresets[0];
  const [selectedSubject, setSelectedSubject] = useState(selectedPreset.subject);
  const focusMinutesForPreset = selectedPreset.focus ?? settings.focusMinutes;
  const breakMinutesForPreset = selectedPreset.break ?? settings.breakMinutes;
  const focusSeconds = focusMinutesForPreset * 60;
  const breakSeconds = breakMinutesForPreset * 60;
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(focusSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState(settings.ambientTrack || "cyan-rain");
  const [volume, setVolume] = useState(settings.ambientVolume ?? 35);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef(null);
  const totalSeconds = mode === "focus" ? focusSeconds : breakSeconds;
  const progress = 1 - secondsLeft / totalSeconds;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const sessionsToday = focusSessions.filter((session) => session.date === toISO(today()));

  useEffect(() => {
    setSecondsLeft(mode === "focus" ? focusSeconds : breakSeconds);
  }, [focusSeconds, breakSeconds, mode]);

  useEffect(() => () => stopAmbientAudio(audioRef), []);

  useEffect(() => {
    if (!settings.ambientAudio && audioOn) {
      stopAmbientAudio(audioRef);
      setAudioOn(false);
    }
  }, [settings.ambientAudio, audioOn]);

  useEffect(() => {
    if (audioRef.current?.master) {
      audioRef.current.master.gain.setTargetAtTime(clamp(volume, 0, 100) / 100 * 0.16, audioRef.current.ctx.currentTime, 0.04);
    }
  }, [volume]);

  useEffect(() => {
    if (!isRunning) return undefined;
    if (secondsLeft <= 0) {
      if (mode === "focus") {
        const session = {
          id: uid(),
          date: toISO(today()),
          minutes: focusMinutesForPreset,
          subject: selectedSubject,
          preset: selectedPreset.label
        };
        setFocusSessions((current) => [session, ...current]);
        addToast("Focus session logged", `${focusMinutesForPreset} minutes added to your streak.`);
        setMode("break");
      } else {
        addToast("Break complete", "A clean focus block is ready.");
        setMode("focus");
      }
      return undefined;
    }
    const timerId = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timerId);
  }, [secondsLeft, isRunning, mode, focusMinutesForPreset, selectedSubject, selectedPreset.label, setFocusSessions, addToast]);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === "focus" ? focusSeconds : breakSeconds);
  };

  const choosePreset = (preset) => {
    setSelectedPresetId(preset.id);
    setSelectedSubject(preset.subject);
    setMode("focus");
    setIsRunning(false);
    setSettings((current) => ({ ...current, focusPreset: preset.id }));
  };

  const toggleTrack = (track) => {
    if (!settings.ambientAudio) {
      addToast("Ambient audio is disabled", "Turn it on in Settings to use focus sounds.");
      return;
    }
    if (audioOn && activeTrackId === track.id) {
      stopAmbientAudio(audioRef);
      setAudioOn(false);
      return;
    }
    const started = startAmbientAudio(track, volume, audioRef);
    if (!started) {
      addToast("Audio unavailable", "This browser does not support the Web Audio API.");
      return;
    }
    setActiveTrackId(track.id);
    setAudioOn(true);
    setSettings((current) => ({ ...current, ambientTrack: track.id, ambientVolume: volume }));
    addToast("Ambient sound started", `${track.label} is now playing.`);
  };

  const stopTrack = () => {
    stopAmbientAudio(audioRef);
    setAudioOn(false);
  };

  const changeVolume = (value) => {
    const next = Number(value);
    setVolume(next);
    setSettings((current) => ({ ...current, ambientVolume: next }));
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden rounded-lg glass-strong p-5 sm:p-8">
      <ParticleField count={24} />
      <div className="relative z-10 grid min-h-[calc(100vh-10rem)] gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-sm text-cyan-100">
            <Timer size={16} />
            {mode === "focus" ? `${selectedPreset.label} mode` : "Recovery break"}
          </div>
          <div className="mb-7 grid w-full max-w-4xl gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {focusPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => choosePreset(preset)}
                className={`rounded-lg border p-4 text-left transition ${
                  selectedPresetId === preset.id
                    ? "border-cyan-300/45 bg-cyan-300/[0.10] shadow-[0_0_30px_rgba(94,231,245,0.12)]"
                    : "border-white/10 bg-white/[0.04] hover:border-cyan-300/25 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-base font-bold text-white">{preset.label}</p>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-cyan-100">
                    {preset.focus ?? settings.focusMinutes}/{preset.break ?? settings.breakMinutes}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{preset.description}</p>
              </button>
            ))}
          </div>
          <div className="pulse-ring relative grid h-[min(72vw,28rem)] w-[min(72vw,28rem)] place-items-center rounded-full border border-cyan-300/20 bg-white/[0.035]">
            <svg className="absolute inset-0 h-full w-full progress-ring" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.07)" strokeWidth="3" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#timerGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={(1 - progress) * 2 * Math.PI * 45}
              />
              <defs>
                <linearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#9B5CFF" />
                  <stop offset="1" stopColor="#5EE7F5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="breath-orb absolute h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />
            <div className="relative">
              <p className="font-display text-7xl font-black text-white sm:text-8xl">{minutes}:{seconds}</p>
              <p className="mt-4 text-sm uppercase tracking-[0.26em] text-slate-400">{mode === "focus" ? "inhale momentum" : "reset gently"}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => setIsRunning((value) => !value)} className="neon-button inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white">
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={reset} className="ghost-button inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-white">
              <RotateCcw size={18} />
              Reset
            </button>
            <button onClick={toggleFullscreen} className="ghost-button inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-white">
              <Maximize2 size={18} />
              Fullscreen
            </button>
          </div>
          <div className="mt-6 grid w-full max-w-3xl gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left sm:grid-cols-[1fr_auto]">
            <IconField icon={BookOpen} label="Focus subject">
              <input value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)} className="field" />
            </IconField>
            <div className="flex items-end">
              <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current block</p>
                <p className="mt-1 font-display text-lg font-bold text-white">{focusMinutesForPreset}m focus / {breakMinutesForPreset}m break</p>
              </div>
            </div>
          </div>
        </div>
        <aside className="space-y-5">
          <div className="rounded-lg glass p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">Ambient controls</h2>
              <Music2 className="text-cyan-200" />
            </div>
            <div className="space-y-3">
              {ambientTracks.map((track) => {
                const isActive = audioOn && activeTrackId === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => toggleTrack(track)}
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                      isActive ? "border-cyan-300/35 bg-cyan-300/[0.10]" : "border-white/10 bg-white/[0.04] hover:border-cyan-300/25"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Volume2 size={17} className={isActive ? "text-cyan-200" : "text-slate-400"} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">{track.label}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-400">{track.description}</span>
                      </span>
                    </div>
                    <span className={`grid h-8 w-8 place-items-center rounded-lg ${isActive ? "bg-cyan-300/20 text-cyan-100" : "bg-white/10 text-slate-300"}`}>
                      {isActive ? <Pause size={15} /> : <Play size={15} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Volume</span>
                <span className="font-semibold text-cyan-100">{volume}%</span>
              </div>
              <input type="range" min="0" max="100" value={volume} onChange={(event) => changeVolume(event.target.value)} className="range-neon w-full" />
              <button onClick={stopTrack} className="ghost-button mt-3 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white">
                Stop audio
              </button>
            </div>
          </div>
          <div className="rounded-lg glass p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">Session tracker</h2>
              <Flame className="text-cyan-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricTile label="Today" value={String(sessionsToday.length)} icon={Timer} />
              <MetricTile label="Minutes" value={String(sessionsToday.reduce((sum, session) => sum + session.minutes, 0))} icon={Clock3} />
            </div>
            <div className="mt-4 space-y-2">
              {focusSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
                  <span className="text-slate-300">{session.subject}</span>
                  <span className="text-cyan-100">{session.minutes}m</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const { tasks, focusSessions } = useAppData();
  const completed = tasks.filter((task) => task.completed).length;
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const totalFocus = focusSessions.reduce((sum, session) => sum + session.minutes, 0) + weeklyStudyData.reduce((sum, day) => sum + day.focus, 0);

  return (
    <div className="space-y-5">
      <div className="rounded-lg glass-strong p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Analytics Core</p>
        <h1 className="font-display mt-3 text-4xl font-black text-white">Study intelligence dashboard</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Track consistency, subject balance, completion, streaks, and simulated learning signals with animated Recharts views.</p>
      </div>

      <div className="grid gap-4 mobile-safe-grid">
        <MetricTile label="Task completion" value={`${completion}%`} icon={Check} />
        <MetricTile label="Total focus" value={`${Math.round(totalFocus / 60)}h`} icon={Clock3} />
        <MetricTile label="Study streak" value="12d" icon={Flame} />
        <MetricTile label="Readiness avg" value="73%" icon={ShieldCheck} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartPanel title="Weekly study minutes" icon={BarChart3}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStudyData}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="day" stroke="#7f8bb3" tickLine={false} axisLine={false} />
              <YAxis stroke="#7f8bb3" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "rgba(8,13,27,0.92)", border: "1px solid rgba(143,160,214,0.24)", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="focus" radius={[8, 8, 2, 2]} fill="#5EE7F5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Subject progress" icon={BookOpen}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={subjectProgress} dataKey="progress" nameKey="subject" innerRadius={62} outerRadius={96} paddingAngle={4}>
                {subjectProgress.map((entry, index) => <Cell key={entry.subject} fill={accentColors[index % accentColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(8,13,27,0.92)", border: "1px solid rgba(143,160,214,0.24)", borderRadius: 8, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartPanel title="Productivity trend" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyStudyData}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="day" stroke="#7f8bb3" tickLine={false} axisLine={false} />
              <YAxis stroke="#7f8bb3" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "rgba(8,13,27,0.92)", border: "1px solid rgba(143,160,214,0.24)", borderRadius: 8, color: "#fff" }} />
              <Line type="monotone" dataKey="efficiency" stroke="#9B5CFF" strokeWidth={3} dot={{ r: 4, fill: "#9B5CFF" }} />
              <Line type="monotone" dataKey="tasks" stroke="#5EE7F5" strokeWidth={3} dot={{ r: 4, fill: "#5EE7F5" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Learning balance radar" icon={Activity}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#9FAAD1", fontSize: 12 }} />
              <Radar dataKey="value" stroke="#5EE7F5" fill="#5EE7F5" fillOpacity={0.24} strokeWidth={3} />
              <Tooltip contentStyle={{ background: "rgba(8,13,27,0.92)", border: "1px solid rgba(143,160,214,0.24)", borderRadius: 8, color: "#fff" }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="rounded-lg glass p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.20em] text-cyan-200">Consistency</p>
            <h2 className="font-display mt-2 text-2xl font-bold text-white">Study heatmap</h2>
          </div>
          <CalendarCheck className="text-cyan-200" />
        </div>
        <Heatmap />
      </div>
    </div>
  );
}

function ChartPanel({ title, icon: Icon, children }) {
  return (
    <div className="rounded-lg glass p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">{title}</h2>
        <Icon className="text-cyan-200" />
      </div>
      <div className="h-80">{children}</div>
    </div>
  );
}

function Heatmap({ compact = false }) {
  const data = useMemo(() => generateHeatmap(), []);
  const colors = ["rgba(255,255,255,0.055)", "rgba(47,128,255,0.22)", "rgba(94,231,245,0.34)", "rgba(155,92,255,0.50)", "rgba(54,225,161,0.58)"];
  return (
    <div className={`grid ${compact ? "grid-cols-7 gap-1" : "grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5"}`}>
      {data.slice(compact ? -42 : 0).map((cell) => (
        <div
          key={cell.date}
          title={`${formatDate(cell.date)} · ${cell.minutes} minutes`}
          className="heatmap-cell border border-white/5"
          style={{ background: colors[cell.level] }}
        />
      ))}
    </div>
  );
}

function AssistantPage() {
  const { chatMessages, setChatMessages, tasks, mood } = useAppData();
  const { addToast } = useToasts();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, typing]);

  const send = () => {
    if (!input.trim() || typing) return;
    const userMessage = { id: uid(), role: "user", text: input.trim(), time: "Now" };
    setChatMessages((current) => [...current, userMessage]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const response = { id: uid(), role: "ai", text: generateAssistantReply(userMessage.text, tasks, mood), time: "Now" };
      setChatMessages((current) => [...current, response]);
      setTyping(false);
      addToast("AstraMind replied", "The assistant generated a new study recommendation.");
    }, 950);
  };

  const prompts = [
    "What should I study next?",
    "Analyze my productivity.",
    "Motivate me for a focus block."
  ];

  return (
    <div className="grid min-h-[calc(100vh-7rem)] gap-5 xl:grid-cols-[1fr_22rem]">
      <div className="flex min-h-[38rem] flex-col rounded-lg glass-strong">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-purple-500/50 to-cyan-300/25 text-cyan-100">
              <Bot size={23} />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white">AstraMind Assistant</p>
              <p className="text-sm text-slate-400">Simulated AI coach for planning, motivation, and productivity analysis.</p>
            </div>
          </div>
        </div>
        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[82%] rounded-lg border px-4 py-3 text-sm leading-6 ${
                message.role === "user"
                  ? "border-cyan-300/30 bg-cyan-300/12 text-white"
                  : "border-white/10 bg-white/[0.055] text-slate-300"
              }`}>
                {message.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button key={prompt} onClick={() => setInput(prompt)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:text-white">
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-2 shadow-[0_0_32px_rgba(94,231,245,0.08)]">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="Ask for a plan, tip, or progress analysis..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button onClick={send} className="neon-button grid h-11 w-11 place-items-center rounded-lg text-white" aria-label="Send message">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      <aside className="space-y-5">
        <div className="rounded-lg glass p-5">
          <h2 className="font-display mb-4 text-xl font-bold text-white">Assistant signals</h2>
          <ProgressRow label="Context confidence" value={89} />
          <div className="mt-4">
            <ProgressRow label="Schedule clarity" value={76} />
          </div>
          <div className="mt-4">
            <ProgressRow label="Energy balance" value={68} />
          </div>
        </div>
        <div className="rounded-lg glass p-5">
          <h2 className="font-display mb-4 text-xl font-bold text-white">Recommended actions</h2>
          {["Take a short break now to maintain focus.", "Move Physics before lighter reading.", "End with one recall question per subject."].map((item) => (
            <div key={item} className="mb-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300">{item}</div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-2 w-2 rounded-full bg-cyan-200"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.12 }}
        />
      ))}
    </div>
  );
}

function generateAssistantReply(message, tasks, mood) {
  const lower = message.toLowerCase();
  const open = tasks.filter((task) => !task.completed);
  const high = open.find((task) => task.priority === "High");
  if (lower.includes("next") || lower.includes("study")) {
    return high
      ? `Start with ${high.subject}: ${high.title}. It is high priority, and a ${Math.min(high.minutes, 50)} minute active-recall block will give you the biggest return.`
      : "Your high-priority queue is clear. Use a 25-minute review sprint on the subject that feels least fluent.";
  }
  if (lower.includes("productivity") || lower.includes("analyze")) {
    return `Your current pattern suggests stronger focus later in the day. In ${mood.toLowerCase()} mode, I would protect one deep block and keep the rest lighter.`;
  }
  if (lower.includes("motivate")) {
    return "You do not need to win the whole semester tonight. Win the next clean block, write down what changed, then let momentum compound.";
  }
  return "I would convert that into one measurable action, one focus block, and one reflection note. The fastest path is clarity plus a small finish line.";
}

function GoalsPage() {
  const { goals, setGoals, tasks, focusSessions } = useAppData();
  const { addToast } = useToasts();
  const completedTasks = tasks.filter((task) => task.completed).length;
  const xp = goals.reduce((sum, goal) => sum + Math.round((goal.progress / goal.target) * goal.xp), 0) + completedTasks * 45 + focusSessions.length * 80;
  const level = Math.floor(xp / 600) + 1;
  const levelProgress = Math.round(((xp % 600) / 600) * 100);

  const boostGoal = (id) => {
    setGoals((current) => current.map((goal) => goal.id === id ? { ...goal, progress: Math.min(goal.target, goal.progress + 1) } : goal));
    addToast("Progress updated", "XP and badges recalculated.");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg glass-strong p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Goals and Gamification</p>
            <h1 className="font-display mt-3 text-4xl font-black text-white">Progress that feels rewarding</h1>
            <p className="mt-4 max-w-3xl text-slate-300">Track XP, streaks, badges, achievements, and progress levels with persistent local storage.</p>
          </div>
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] p-5 text-center">
            <p className="text-sm text-slate-400">Current level</p>
            <p className="font-display text-5xl font-black text-white">{level}</p>
            <p className="mt-1 text-sm text-cyan-100">{xp.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="mt-6">
          <ProgressRow label="Next level" value={levelProgress} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg glass p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Active goals</h2>
            <Target className="text-cyan-200" />
          </div>
          <div className="space-y-4">
            {goals.map((goal) => {
              const percent = Math.round((goal.progress / goal.target) * 100);
              return (
                <motion.div key={goal.id} layout className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-semibold text-white">{goal.title}</p>
                      <p className="text-sm text-slate-400">{goal.progress}/{goal.target} · {goal.xp} XP available</p>
                    </div>
                    <button onClick={() => boostGoal(goal.id)} className="ghost-button rounded-lg px-4 py-2 text-sm font-semibold text-white">
                      Log progress
                    </button>
                  </div>
                  <ProgressRow label={goal.badge} value={percent} />
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg glass p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Achievement vault</h2>
            <Trophy className="text-cyan-200" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Flame, title: "Streak Core", text: "4-day streak active", active: true },
              { icon: Medal, title: "Deep Work", text: "11 focus sessions", active: true },
              { icon: Star, title: "Exam Shield", text: "63% readiness", active: true },
              { icon: Layers3, title: "Flow Architect", text: "Generate 3 plans", active: false }
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.title}
                  whileHover={{ y: -5 }}
                  className={`rounded-lg border p-4 ${badge.active ? "border-cyan-300/25 bg-cyan-300/[0.07] shadow-[0_0_32px_rgba(94,231,245,0.10)]" : "border-white/10 bg-white/[0.035] opacity-70"}`}
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-cyan-100">
                    <Icon size={20} />
                  </div>
                  <p className="font-semibold text-white">{badge.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{badge.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { settings, setSettings, mood, setMood, currentUser, updateProfile } = useAppData();
  const { addToast } = useToasts();
  const [profileDraft, setProfileDraft] = useState(() => ({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: currentUser?.password || "",
    school: currentUser?.school || "",
    major: currentUser?.major || "",
    target: currentUser?.target || "",
    bio: currentUser?.bio || ""
  }));

  const update = (patch) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  useEffect(() => {
    setProfileDraft({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      password: currentUser?.password || "",
      school: currentUser?.school || "",
      major: currentUser?.major || "",
      target: currentUser?.target || "",
      bio: currentUser?.bio || ""
    });
  }, [currentUser?.id]);

  const updateProfileDraft = (field, value) => {
    setProfileDraft((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = () => {
    if (!profileDraft.name.trim() || !profileDraft.email.trim() || !profileDraft.password) {
      addToast("Profile needs details", "Name, email, and password cannot be empty.");
      return;
    }
    updateProfile({
      ...profileDraft,
      name: profileDraft.name.trim(),
      email: profileDraft.email.trim().toLowerCase(),
      school: profileDraft.school.trim(),
      major: profileDraft.major.trim(),
      target: profileDraft.target.trim(),
      bio: profileDraft.bio.trim()
    });
    addToast("Profile saved", "Your dashboard identity has been updated.");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg glass-strong p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Settings</p>
        <h1 className="font-display mt-3 text-4xl font-black text-white">Personalize AstraMind</h1>
        <p className="mt-4 max-w-3xl text-slate-300">Tune your profile, login credentials, focus intervals, mood behavior, notification preferences, and dashboard density. Everything stays in LocalStorage.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg glass p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Profile</h2>
            <GraduationCap className="text-cyan-200" />
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <p className="text-sm text-slate-400">Student</p>
            <p className="font-display mt-1 text-2xl font-bold text-white">{profileDraft.name || "AstraMind Student"}</p>
            <p className="mt-2 text-sm text-slate-400">Portfolio demo profile · frontend-only data simulation</p>
          </div>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <IconField icon={User} label="Display name">
                <input value={profileDraft.name} onChange={(event) => updateProfileDraft("name", event.target.value)} className="field" />
              </IconField>
              <IconField icon={Mail} label="Login email">
                <input type="email" value={profileDraft.email} onChange={(event) => updateProfileDraft("email", event.target.value)} className="field" />
              </IconField>
            </div>
            <IconField icon={Lock} label="Password">
              <input type="password" value={profileDraft.password} onChange={(event) => updateProfileDraft("password", event.target.value)} className="field" />
            </IconField>
            <div className="grid gap-4 sm:grid-cols-2">
              <IconField icon={GraduationCap} label="School">
                <input value={profileDraft.school} onChange={(event) => updateProfileDraft("school", event.target.value)} className="field" />
              </IconField>
              <IconField icon={BookOpen} label="Major">
                <input value={profileDraft.major} onChange={(event) => updateProfileDraft("major", event.target.value)} className="field" />
              </IconField>
            </div>
            <IconField icon={Target} label="Primary goal">
              <input value={profileDraft.target} onChange={(event) => updateProfileDraft("target", event.target.value)} className="field" />
            </IconField>
            <IconField icon={MessageSquare} label="Bio">
              <textarea value={profileDraft.bio} onChange={(event) => updateProfileDraft("bio", event.target.value)} rows="3" className="field resize-none" />
            </IconField>
            <button onClick={saveProfile} className="neon-button rounded-lg px-5 py-3 font-semibold text-white">
              Save profile
            </button>
          </div>
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-slate-300">Mood calibration</p>
            <MoodSelector mood={mood} setMood={setMood} />
          </div>
        </div>

        <div className="rounded-lg glass p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Focus preferences</h2>
            <SlidersHorizontal className="text-cyan-200" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label={`Focus minutes: ${settings.focusMinutes}`}>
              <input type="range" min="15" max="60" value={settings.focusMinutes} onChange={(event) => update({ focusMinutes: Number(event.target.value) })} className="range-neon w-full" />
            </FormField>
            <FormField label={`Break minutes: ${settings.breakMinutes}`}>
              <input type="range" min="3" max="20" value={settings.breakMinutes} onChange={(event) => update({ breakMinutes: Number(event.target.value) })} className="range-neon w-full" />
            </FormField>
            <FormField label={`Daily target: ${settings.dailyTarget} minutes`}>
              <input type="range" min="60" max="360" step="15" value={settings.dailyTarget} onChange={(event) => update({ dailyTarget: Number(event.target.value) })} className="range-neon w-full" />
            </FormField>
            <FormField label="AI tone">
              <select value={settings.aiTone} onChange={(event) => update({ aiTone: event.target.value })} className="field">
                <option value="coach">Coach</option>
                <option value="calm">Calm</option>
                <option value="direct">Direct</option>
              </select>
            </FormField>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ToggleCard label="Smart notifications" checked={settings.notifications} onChange={() => update({ notifications: !settings.notifications })} icon={Bell} />
            <ToggleCard label="Ambient audio engine" checked={settings.ambientAudio} onChange={() => update({ ambientAudio: !settings.ambientAudio })} icon={Music2} />
            <ToggleCard label="Compact sidebar" checked={settings.compactSidebar} onChange={() => update({ compactSidebar: !settings.compactSidebar })} icon={Menu} />
          </div>
          <button onClick={() => addToast("Settings saved", "Your local preferences are active.")} className="neon-button mt-6 rounded-lg px-5 py-3 font-semibold text-white">
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleCard({ label, checked, onChange, icon: Icon }) {
  return (
    <button onClick={onChange} className={`rounded-lg border p-4 text-left transition ${checked ? "border-cyan-300/30 bg-cyan-300/[0.08]" : "border-white/10 bg-white/[0.04]"}`}>
      <div className="mb-4 flex items-center justify-between">
        <Icon size={18} className="text-cyan-200" />
        <span className={`h-6 w-11 rounded-full p-1 transition ${checked ? "bg-cyan-300/70" : "bg-white/10"}`}>
          <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
        </span>
      </div>
      <p className="text-sm font-semibold text-white">{label}</p>
    </button>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-8 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100">
          <Icon size={24} />
        </div>
        <p className="font-display text-xl font-bold text-white">{title}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">{text}</p>
      </div>
    </div>
  );
}

function calculateProductivityScore(tasks, sessions) {
  const completion = tasks.length ? tasks.filter((task) => task.completed).length / tasks.length : 0.5;
  const minutesToday = sessions.filter((session) => session.date === toISO(today())).reduce((sum, session) => sum + session.minutes, 0);
  return clamp(Math.round(58 + completion * 24 + Math.min(minutesToday, 180) / 180 * 18), 52, 98);
}

function daysUntil(date) {
  const start = new Date(toISO(today()));
  const end = new Date(date);
  return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const style = document.createElement("style");
style.textContent = `
  .field {
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.05);
    padding: 0.8rem 0.9rem;
    color: white;
    outline: none;
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }
  .field:focus {
    border-color: rgba(94,231,245,0.52);
    box-shadow: 0 0 0 3px rgba(94,231,245,0.08);
  }
  .bg-white\\/8 {
    background-color: rgba(255,255,255,0.08);
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")).render(<App />);
