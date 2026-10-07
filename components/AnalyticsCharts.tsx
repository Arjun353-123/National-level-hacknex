"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, BarChart3, PieChart } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
export interface ScanRecord {
  month: string;
  xray: number;
  ct: number;
  mri: number;
  ultrasound: number;
}

export interface AnalyticsChartsProps {
  /** The latest scan type detected by ML e.g. "X-Ray", "CT Scan", "MRI", "Ultrasound" */
  latestScanType?: string;
  /** ML AI confidence 0-100 */
  latestConfidence?: number;
}

// ── Color config per scan type ────────────────────────────────────────────────
const SCAN_COLORS: Record<string, { bar: string; glow: string; cap: string }> = {
  "X-Ray":      { bar: "from-cyan-900 via-cyan-500 to-cyan-300",      glow: "rgba(6,182,212,0.4)",   cap: "#a5f3fc" },
  "CT Scan":    { bar: "from-emerald-900 via-emerald-500 to-emerald-300", glow: "rgba(16,185,129,0.4)", cap: "#6ee7b7" },
  "MRI":        { bar: "from-rose-900 via-rose-500 to-rose-300",        glow: "rgba(244,63,94,0.4)",   cap: "#fda4af" },
  "Ultrasound": { bar: "from-amber-900 via-amber-500 to-amber-300",     glow: "rgba(245,158,11,0.4)",  cap: "#fde68a" },
};
const DEFAULT_COLORS = { bar: "from-purple-900 via-purple-600 to-violet-400", glow: "rgba(168,85,247,0.35)", cap: "#c084fc" };

// ── Static baseline history (6 months, last entry updated dynamically) ───────
const BASE_HISTORY = [
  { month: "Jun", value: 65, counts: { "X-Ray": 2, "CT Scan": 1, "MRI": 0, "Ultrasound": 0 } },
  { month: "Jul", value: 45, counts: { "X-Ray": 1, "CT Scan": 1, "MRI": 0, "Ultrasound": 0 } },
  { month: "Aug", value: 80, counts: { "X-Ray": 2, "CT Scan": 1, "MRI": 1, "Ultrasound": 0 } },
  { month: "Sep", value: 55, counts: { "X-Ray": 1, "CT Scan": 1, "MRI": 0, "Ultrasound": 0 } },
  { month: "Oct", value: 90, counts: { "X-Ray": 0, "CT Scan": 0, "MRI": 0, "Ultrasound": 0 } },
];

// ── Donut segment config ──────────────────────────────────────────────────────
const CIRC = 2 * Math.PI * 70; // r=70

export function AnalyticsCharts({ latestScanType, latestConfidence }: AnalyticsChartsProps) {
  // Build bar chart data — inject the latest scan into Oct
  const bars = BASE_HISTORY.map((b) => {
    if (b.month === "Oct" && latestScanType) {
      const updatedCounts = { ...b.counts, [latestScanType]: (b.counts[latestScanType as keyof typeof b.counts] ?? 0) + 1 };
      const total = Object.values(updatedCounts).reduce((s, v) => s + v, 0);
      return { ...b, counts: updatedCounts, value: Math.min(99, 70 + total * 5) };
    }
    return b;
  });

  // Build scan type totals
  const totals: Record<string, number> = { "X-Ray": 6, "CT Scan": 6, "MRI": 4, "Ultrasound": 0 };
  if (latestScanType) totals[latestScanType] = (totals[latestScanType] ?? 0) + 1;
  const grand = Object.values(totals).reduce((s, v) => s + v, 0);

  const scanTypes = [
    { label: "X-Ray",      color: "bg-cyan-400",    hex: "#22d3ee", gradId: "g1" },
    { label: "CT Scan",    color: "bg-emerald-400",  hex: "#34d399", gradId: "g2" },
    { label: "MRI",        color: "bg-rose-400",     hex: "#fb7185", gradId: "g3" },
    { label: "Ultrasound", color: "bg-amber-400",    hex: "#fbbf24", gradId: "g4" },
  ].map((t) => ({
    ...t,
    count: totals[t.label] ?? 0,
    pct: grand > 0 ? Math.round(((totals[t.label] ?? 0) / grand) * 100) : 0,
    arc: grand > 0 ? CIRC * ((totals[t.label] ?? 0) / grand) : 0,
  }));

  // Build offsets for each segment
  let offset = 0;
  const segments = scanTypes.map((t) => {
    const seg = { ...t, offset };
    offset += t.arc;
    return seg;
  });

  // Confidence line chart — add a new point if latestConfidence present
  const confPoints = [72, 78, 83, 87, 91, latestConfidence ?? 96.8];
  const avgConf = (confPoints.reduce((s, v) => s + v, 0) / confPoints.length).toFixed(1);
  const months = ["Jan", "Mar", "May", "Jul", "Sep", "Oct"];

  // SVG path for confidence line (800 wide, 120 tall, y=120 is bottom/0%)
  const linePoints = confPoints.map((v, i) => ({
    x: (i / (confPoints.length - 1)) * 800,
    y: 120 - (v / 100) * 110,
  }));
  const linePath = linePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `M0,120 ${linePoints.map((p) => `L${p.x},${p.y}`).join(" ")} L800,120 Z`;

  return (
    <div className="space-y-6">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        <h3 className="text-2xl font-bold text-slate-200">Health Analytics &amp; Trends</h3>
        {latestScanType && (
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-violet-900/50 border border-violet-500/40 text-violet-300 animate-pulse">
            Updated · {latestScanType}
          </span>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ── Scan History Timeline ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="medical-card p-6 rounded-2xl border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-violet-200">Scan History Timeline</h4>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>

          {/* Bar Chart */}
          <div className="relative h-48 w-full flex flex-col justify-end pt-4 pb-1">
            {/* Grid lines */}
            <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-20 z-0">
              {[0, 1, 2].map((i) => <div key={i} className="border-b border-purple-400 border-dashed w-full" />)}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex items-end justify-between gap-3 h-36 w-full">
              {bars.map((bar, i) => {
                const isLatest = bar.month === "Oct" && latestScanType;
                const sc = isLatest ? (SCAN_COLORS[latestScanType!] ?? DEFAULT_COLORS) : DEFAULT_COLORS;
                const totalCount = Object.values(bar.counts).reduce((s, v) => s + v, 0);
                return (
                  <div key={i} className="flex-1 h-full flex flex-col items-center justify-end group">
                    <div className="w-full h-full relative flex items-end justify-center rounded-t-lg bg-purple-950/30 border border-purple-500/20 p-1 overflow-visible hover:border-purple-400/50 transition-colors">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${bar.month}-${bar.value}`}
                          initial={{ height: "0%" }}
                          animate={{ height: `${bar.value}%` }}
                          exit={{ height: "0%" }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                          className={`w-full rounded-t-md bg-gradient-to-t ${sc.bar} relative cursor-pointer transition-all`}
                          style={{ minHeight: "12px", boxShadow: `0 0 15px ${sc.glow}` }}
                        >
                          <div className="absolute top-0 inset-x-0 h-1 rounded-t-md" style={{ background: sc.cap, boxShadow: `0 0 8px ${sc.cap}` }} />
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-slate-900/95 border border-purple-500/50 px-2.5 py-1.5 rounded text-xs font-semibold text-violet-200 whitespace-nowrap shadow-xl z-30 text-center">
                            {totalCount} scan{totalCount !== 1 ? "s" : ""}
                            {isLatest && <div className="text-cyan-300 font-bold">{latestScanType} ✓</div>}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Month labels */}
            <div className="flex justify-between gap-3 mt-2 px-1 relative z-10">
              {bars.map((bar, i) => (
                <span key={i} className={`flex-1 text-center text-xs font-medium ${bar.month === "Oct" && latestScanType ? "text-violet-300 font-bold" : "text-slate-400"}`}>
                  {bar.month}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Scans (6 months)</span>
            <span className="font-bold text-violet-300">{grand} scans</span>
          </div>
        </motion.div>

        {/* ── Scan Type Distribution ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="medical-card p-6 rounded-2xl border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-violet-200">Scan Type Distribution</h4>
            <PieChart className="w-5 h-5 text-purple-400" />
          </div>

          {/* Donut */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                {/* Track */}
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="20" />

                {/* Dynamic segments */}
                {segments.map((seg, i) => (
                  <motion.circle
                    key={seg.label}
                    cx="80" cy="80" r="70"
                    fill="none"
                    stroke={`url(#${seg.gradId})`}
                    strokeWidth="20"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 440" }}
                    animate={{ strokeDasharray: `${seg.arc} ${CIRC}` }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 1 }}
                    strokeDashoffset={-seg.offset}
                  />
                ))}

                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#fb7185" />
                  </linearGradient>
                  <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span key={grand} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl font-bold text-violet-200">
                    {grand}
                  </motion.span>
                </AnimatePresence>
                <span className="text-xs text-slate-400">Total</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {scanTypes.filter((t) => t.count > 0).map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all cursor-pointer ${latestScanType === item.label ? "bg-violet-900/40 border border-violet-500/40" : "bg-slate-800/50 hover:bg-slate-800/70"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color} ${latestScanType === item.label ? "ring-2 ring-white/30 ring-offset-1 ring-offset-transparent" : ""}`} />
                  <span className="text-sm text-slate-300 font-medium">{item.label}</span>
                  {latestScanType === item.label && <span className="text-[9px] font-bold text-violet-300 bg-violet-900/60 px-1.5 py-0.5 rounded-full border border-violet-500/40">Latest</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{item.count} scan{item.count !== 1 ? "s" : ""}</span>
                  <span className="text-sm font-bold text-violet-300">{item.pct}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── AI Diagnostic Confidence Trend ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="medical-card p-6 rounded-2xl border border-purple-500/30 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-violet-200">AI Diagnostic Confidence Trend</h4>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="relative h-36">
            <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
              {/* Grid */}
              {[25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={120 - (y / 100) * 110} x2="800" y2={120 - (y / 100) * 110}
                  stroke="rgba(139,92,246,0.12)" strokeWidth="1" strokeDasharray="4 4" />
              ))}
              {/* Area */}
              <motion.path key={areaPath} initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ duration: 1 }}
                d={areaPath} fill="url(#areaG)" />
              {/* Line */}
              <motion.path key={linePath} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 1.5 }}
                d={linePath} fill="none" stroke="url(#lineG)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Points */}
              {linePoints.map((p, i) => {
                const isNew = i === linePoints.length - 1 && latestConfidence;
                return (
                  <motion.circle key={i} cx={p.x} cy={p.y} r={isNew ? 7 : 5}
                    fill={isNew ? "#34d399" : "#a855f7"}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.12 }}
                    style={isNew ? { filter: "drop-shadow(0 0 6px #34d399)" } : {}}
                  />
                );
              })}
              <defs>
                <linearGradient id="areaG" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineG" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor={latestConfidence ? "#34d399" : "#a855f7"} />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between mt-2 text-xs text-slate-400 px-1">
            {months.map((m, i) => <span key={i}>{m}</span>)}
          </div>

          <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400">Average Confidence</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.span key={avgConf} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-lg font-bold text-emerald-400">
                {avgConf}%
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
