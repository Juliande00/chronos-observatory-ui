export const SYSTEM_STATUS = {
  appVersion: "v6.32.4",
  botStatus: "Online" as const,
  tradingMode: "Live" as const,
  governor: "propose_only" as const,
  autoApply: false,
  balanceIntegrity: "WARN" as const,
  lastScan: "vor 14 Sek.",
  lastNightlyReport: "heute, 04:12",
};

export const KPIS = {
  winrate: 56.4,
  profitFactor: 0.91,
  expectancy: -0.35,
  avgWin: 6.28,
  avgLoss: -14.31,
  mfe0LossRate: 39.2,
  openPositions: 3,
  dailyPnl: -42.18,
  dailyDrawdown: -1.8,
  openRisk: 1.2,
};

export const NARRATIVE = [
  "Bot läuft normal. AutoApply ist AUS.",
  "Nightly Governor erzeugt nur Vorschläge.",
  "CandleSight sammelt Shadow-Daten.",
  "Battle Arena bewertet Spezialisten-Bots.",
  "Balance Integrity WARN: Offset prüfen.",
];

export const WARNINGS = [
  { tone: "warning", text: "WR sieht gut aus, aber PF/Expectancy warnen." },
  { tone: "warning", text: "Balance WARN – AutoApply bleibt blockiert." },
  { tone: "danger", text: "MFE0-Losses sind weiterhin kritisch." },
  { tone: "info", text: "Shadow-Systeme erklären nur, sie greifen nicht live ein." },
];

export type PetStatus = "active" | "warning" | "critical" | "shadow" | "idle";

export const PETS = [
  {
    id: "corey", name: "Corey", module: "ClaudeTrader Core",
    role: "Hält das System aktiv und überwacht den Markt.",
    status: "active" as PetStatus, statusLabel: "scanning",
    metrics: [{ label: "Health", value: "98%" }, { label: "Last Scan", value: "14s" }],
    shadow: false,
  },
  {
    id: "shieldy", name: "Shieldy", module: "Risk Engine / Balance",
    role: "Schützt Balance, Drawdown und Risk-Limits.",
    status: "warning" as PetStatus, statusLabel: "warning",
    metrics: [{ label: "Balance", value: "WARN" }, { label: "DD", value: "-1.8%" }],
    shadow: false, alert: "Balance WARN – AutoApply blockiert.",
  },
  {
    id: "wick", name: "Wick", module: "CandleSight Shadow",
    role: "Beobachtet Kerzenstruktur. Shadow-only.",
    status: "shadow" as PetStatus, statusLabel: "watching",
    metrics: [{ label: "Samples", value: "412" }, { label: "Exit Pressure", value: "Mid" }],
    shadow: true,
  },
  {
    id: "sparky", name: "Sparky", module: "Battle Arena",
    role: "Lässt Spezialisten-Bots diskutieren. Shadow-only.",
    status: "shadow" as PetStatus, statusLabel: "debating",
    metrics: [{ label: "Votes", value: "1,284" }, { label: "Bots", value: "13" }],
    shadow: true,
  },
  {
    id: "luna", name: "Luna", module: "Nightly Governor",
    role: "Lernt nachts und erstellt Vorschläge. Keine AutoApply.",
    status: "shadow" as PetStatus, statusLabel: "propose_only",
    metrics: [{ label: "Last Report", value: "04:12" }, { label: "AutoApply", value: "OFF" }],
    shadow: true,
  },
  {
    id: "hermes", name: "Hermes", module: "Hermes Shadow / Learning",
    role: "Risk-Sensor, kein harter Entscheider.",
    status: "shadow" as PetStatus, statusLabel: "neutral",
    metrics: [{ label: "Risk", value: "Neutral" }, { label: "Missed Wins", value: "12" }],
    shadow: true,
  },
  {
    id: "rocket", name: "Rocket", module: "RunnerScout",
    role: "Sucht echte Runner, boostet aber nicht live.",
    status: "shadow" as PetStatus, statusLabel: "runner-watch",
    metrics: [{ label: "Candidates", value: "4" }, { label: "Wins", value: "9" }],
    shadow: true,
  },
  {
    id: "spike", name: "Spike", module: "MFE0GuardBot",
    role: "Warnt vor Sofortverlust-Trades.",
    status: "critical" as PetStatus, statusLabel: "mfe0-risk",
    metrics: [{ label: "MFE0 Rate", value: "39.2%" }, { label: "No-Boost", value: "12" }],
    shadow: true,
  },
];

export const OPEN_TRADES = [
  {
    id: "t1", symbol: "BTC/USDT", side: "LONG", strategy: "SMC_TJR",
    entry: 64320.5, current: 64580.1, pnl: 18.42, r: 0.6, maxR: 0.9, minR: -0.3,
    hold: "1h 24m", sl: 63800, tp: 65900, treatment: "Runner-Watch",
    candleSight: "watching", hermes: "neutral", xgb: 0.72,
    arena: "No-Boost empfohlen, Runner-Struktur sichtbar.",
    risk: ["MFE0 ok", "Balance WARN"],
  },
  {
    id: "t2", symbol: "ETH/USDT", side: "SHORT", strategy: "TREND_RSI",
    entry: 3120.8, current: 3134.5, pnl: -9.86, r: -0.4, maxR: 0.2, minR: -0.5,
    hold: "42m", sl: 3160, tp: 3050, treatment: "MFE0-Risk",
    candleSight: "fakeout-risk", hermes: "suspicious", xgb: 0.38,
    arena: "Reduce-Watch. MFE0GuardBot warnt.",
    risk: ["MFE0 risk", "Fakeout"],
  },
  {
    id: "t3", symbol: "SOL/USDT", side: "LONG", strategy: "SMC_TJR",
    entry: 142.3, current: 144.1, pnl: 6.20, r: 0.5, maxR: 0.7, minR: 0.0,
    hold: "2h 10m", sl: 139.8, tp: 149.5, treatment: "Micro-Win-Path",
    candleSight: "runner-structure", hermes: "risk_on", xgb: 0.66,
    arena: "Mixed. Bull-Case stärker als Bear-Case.",
    risk: ["Sample small"],
  },
];

export const TREATMENT_BUCKETS = [
  { name: "Micro-Wins", count: 64, pnl: 184.2, avg: 2.88, pf: 1.42, exp: 0.6, severity: "info" },
  { name: "Runner-Wins", count: 12, pnl: 412.8, avg: 34.4, pf: 4.21, exp: 12.4, severity: "success" },
  { name: "Protected-Wins", count: 21, pnl: 88.5, avg: 4.21, pf: 1.85, exp: 1.2, severity: "info" },
  { name: "MFE0-Losses", count: 38, pnl: -544.2, avg: -14.32, pf: 0, exp: -14.32, severity: "danger" },
  { name: "Plus-to-Minus", count: 19, pnl: -218.4, avg: -11.49, pf: 0.12, exp: -11.49, severity: "warning" },
  { name: "Time-Catastrophes", count: 7, pnl: -156.8, avg: -22.4, pf: 0, exp: -22.4, severity: "danger" },
];

export const NO_BOOST = [
  { key: "BTC/SMC_TJR/asia", pf: 0.72, exp: -1.8, mfe0: 0.46, n: 84, reason: "Hohe MFE0-Quote" },
  { key: "ETH/TREND_RSI/eu", pf: 0.65, exp: -2.4, mfe0: 0.51, n: 122, reason: "Plus-to-Minus dominant" },
  { key: "SOL/SMC_TJR/us", pf: 0.81, exp: -0.9, mfe0: 0.38, n: 56, reason: "Time-Exit Risiko" },
];

export const REDUCE = [
  { key: "ADA/TREND_RSI/eu", pf: 0.88, exp: -0.4, mfe0: 0.34, n: 45, reason: "Sample klein, MFE0 hoch" },
  { key: "AVAX/SMC_TJR/asia", pf: 0.91, exp: -0.2, mfe0: 0.29, n: 38, reason: "Borderline PF" },
];

export const FAIL_FAST = [
  { key: "DOGE/TREND_RSI/us", reason: "Time-Exit dominant", mfe0: 0.42, time: 0.61, n: 71 },
  { key: "MATIC/SMC_TJR/eu", reason: "Plus-to-Minus", mfe0: 0.40, time: 0.48, n: 64 },
];

export const SPECIALIST_BOTS = [
  { name: "MFE0GuardBot", role: "Warnt vor Sofortverlust", vote: "Risk-Off", n: 312, status: "helpful", acc: 0.71 },
  { name: "RunnerScoutBot", role: "Sucht Runner-Struktur", vote: "Runner-Watch", n: 184, status: "helpful", acc: 0.62 },
  { name: "MicroWinSkepticBot", role: "Skeptisch ggü. Micro-Wins", vote: "Reduce", n: 220, status: "helpful", acc: 0.58 },
  { name: "TimeExitGuardBot", role: "Beobachtet Zeit-Exits", vote: "Reduce", n: 142, status: "helpful", acc: 0.55 },
  { name: "CandleStructureBot", role: "Liest Kerzenstruktur", vote: "Mixed", n: 401, status: "helpful", acc: 0.61 },
  { name: "PayoffBot", role: "Bewertet Payoff-Asymmetrie", vote: "No-Boost", n: 268, status: "helpful", acc: 0.64 },
  { name: "BalanceRiskBot", role: "Balance & Drawdown", vote: "Risk-Off", n: 96, status: "helpful", acc: 0.69 },
  { name: "XGBoostRealityBot", role: "Reality-Check XGB", vote: "Mixed", n: 312, status: "suspicious", acc: 0.48 },
  { name: "HermesRiskBot", role: "Hermes-Signale", vote: "Neutral", n: 188, status: "suspicious", acc: 0.46 },
  { name: "BlockerQualityBot", role: "Bewertet Blocker", vote: "Reduce", n: 88, status: "sample", acc: null },
  { name: "SessionBot", role: "Session-Bias", vote: "Mixed", n: 64, status: "sample", acc: null },
  { name: "VolatilityBot", role: "Volatility Regime", vote: "Risk-Off", n: 142, status: "helpful", acc: 0.59 },
  { name: "CorrelationBot", role: "Cross-Asset Correlation", vote: "Neutral", n: 71, status: "sample", acc: null },
];

export const REPORTS = [
  { title: "Treatment Report", date: "Heute 04:12", status: "ok", summary: "MFE0-Losses dominieren weiterhin.", module: "treatment" },
  { title: "Nightly Learning Report", date: "Heute 04:12", status: "warning", summary: "12 No-Boost-Vorschläge generiert.", module: "governor" },
  { title: "CandleSight Audit", date: "Gestern 04:12", status: "ok", summary: "Shadow-only, Sample wächst.", module: "candlesight" },
  { title: "Battle Arena Audit", date: "Gestern 04:12", status: "ok", summary: "13 Bots aktiv, 3 mit kleinem Sample.", module: "arena" },
  { title: "Balance Check", date: "Heute 04:12", status: "warning", summary: "Stale offset erkannt.", module: "balance" },
  { title: "MFE0 Audit", date: "Heute 04:12", status: "danger", summary: "MFE0-Quote 39.2%.", module: "treatment" },
  { title: "Exit Quality Audit", date: "Gestern 04:12", status: "warning", summary: "Plus-to-Minus 19 Trades.", module: "exit" },
  { title: "Blocker Quality Audit", date: "Vor 2 Tagen", status: "ok", summary: "Blocker funktionieren.", module: "governor" },
];

export const SETTINGS_VIEW = [
  { label: "Governor mode", value: "propose_only" },
  { label: "AutoApply", value: "OFF" },
  { label: "Allow Size Increase", value: "false" },
  { label: "Opportunity Scout", value: "Shadow" },
  { label: "Hermes mode", value: "Shadow / Learning" },
  { label: "CandleSight mode", value: "Shadow-only" },
  { label: "Battle Arena mode", value: "Shadow-only" },
  { label: "Discord channels", value: "verbunden" },
  { label: "Ollama provider", value: "online" },
  { label: "API / auth", value: "ok" },
];
