"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, BarChart3, PieChart } from "lucide-react";

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* Chart Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <BarChart3 className="w-6 h-6 text-purple-400" />
        <h3 className="text-2xl font-bold text-slate-200">Health Analytics & Trends</h3>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scan History Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="medical-card p-6 rounded-2xl border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-violet-200">Scan History Timeline</h4>
            <Activity className="w-5 h-5 text-purple-400" />
          </div>

          {/* Bar Chart Visualization */}
          <div className="relative h-48 w-full flex flex-col justify-end pt-4 pb-1">
            {/* Horizontal Grid Guidelines */}
            <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-20 z-0">
              <div className="border-b border-purple-400 border-dashed w-full" />
              <div className="border-b border-purple-400 border-dashed w-full" />
              <div className="border-b border-purple-400 border-dashed w-full" />
            </div>

            {/* Bars Flex Container */}
            <div className="relative z-10 flex items-end justify-between gap-3 h-36 w-full">
              {[
                { month: "Jun", value: 65, count: 3, label: "3 scans" },
                { month: "Jul", value: 45, count: 2, label: "2 scans" },
                { month: "Aug", value: 80, count: 4, label: "4 scans" },
                { month: "Sep", value: 55, count: 2, label: "2 scans" },
                { month: "Oct", value: 90, count: 5, label: "5 scans" },
              ].map((bar, i) => (
                <div key={i} className="flex-1 h-full flex flex-col items-center justify-end group">
                  {/* Outer Bar Track */}
                  <div className="w-full h-full relative flex items-end justify-center rounded-t-lg bg-purple-950/30 border border-purple-500/20 p-1 overflow-visible hover:border-purple-400/50 transition-colors">
                    {/* Animated Bar Fill */}
                    <motion.div
                      initial={{ height: "0%" }}
                      animate={{ height: `${bar.value}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="w-full rounded-t-md bg-gradient-to-t from-purple-900 via-purple-600 to-violet-400 relative cursor-pointer hover:from-purple-800 hover:via-purple-500 hover:to-violet-300 transition-all shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                      style={{ minHeight: "12px" }}
                    >
                      {/* Top glowing cap accent */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-violet-200 rounded-t-md shadow-[0_0_8px_#c084fc]" />

                      {/* Tooltip badge */}
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-slate-900/95 border border-purple-500/50 px-2.5 py-1 rounded text-xs font-semibold text-violet-200 whitespace-nowrap shadow-xl z-30">
                        {bar.label} ({bar.value}%)
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            {/* Month Labels */}
            <div className="flex justify-between gap-3 mt-2 px-1 relative z-10">
              {["Jun", "Jul", "Aug", "Sep", "Oct"].map((month, i) => (
                <span key={i} className="flex-1 text-center text-xs text-slate-400 font-medium group-hover:text-violet-300">
                  {month}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Scans (6 months)</span>
            <span className="font-bold text-violet-300">16 scans</span>
          </div>
        </motion.div>

        {/* Health Metrics Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="medical-card p-6 rounded-2xl border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-violet-200">Scan Type Distribution</h4>
            <PieChart className="w-5 h-5 text-purple-400" />
          </div>

          {/* Donut Chart Visualization */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              {/* Outer Ring */}
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="20"
                />
                {/* X-Ray - 40% (176 / 440) */}
                <motion.circle
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: "176 440" }}
                  transition={{ delay: 0.3, duration: 1 }}
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="20"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* CT Scan - 35% (154 / 440) */}
                <motion.circle
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: "154 440" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient2)"
                  strokeWidth="20"
                  strokeDashoffset="-176"
                  strokeLinecap="round"
                />
                {/* MRI - 25% (110 / 440) */}
                <motion.circle
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: "110 440" }}
                  transition={{ delay: 0.7, duration: 1 }}
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient3)"
                  strokeWidth="20"
                  strokeDashoffset="-330"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6d28d9" />
                    <stop offset="100%" stopColor="#7e22ce" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-violet-200">16</span>
                <span className="text-xs text-slate-400">Total</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {[
              { label: "X-Ray", count: 6, percent: "40%", color: "bg-purple-500" },
              { label: "CT Scan", count: 6, percent: "35%", color: "bg-violet-600" },
              { label: "MRI", count: 4, percent: "25%", color: "bg-purple-700" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-slate-300 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{item.count} scans</span>
                  <span className="text-sm font-bold text-violet-300">{item.percent}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Confidence Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="medical-card p-6 rounded-2xl border border-purple-500/30 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-violet-200">AI Diagnostic Confidence Trend</h4>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>

          {/* Line Chart Visualization */}
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={120 - y * 1.2}
                  x2="800"
                  y2={120 - y * 1.2}
                  stroke="rgba(139, 92, 246, 0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* Area Fill */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 1.5 }}
                d="M0,120 L0,40 L160,30 L320,25 L480,20 L640,15 L800,10 L800,120 Z"
                fill="url(#areaGradient)"
                opacity="0.3"
              />

              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 1.5 }}
                d="M0,40 L160,30 L320,25 L480,20 L640,15 L800,10"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data Points */}
              {[
                { x: 0, y: 40 },
                { x: 160, y: 30 },
                { x: 320, y: 25 },
                { x: 480, y: 20 },
                { x: 640, y: 15 },
                { x: 800, y: 10 },
              ].map((point, i) => (
                <motion.circle
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#a855f7"
                  className="cursor-pointer hover:fill-violet-400 transition-all"
                />
              ))}

              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-3 text-xs text-slate-400">
            {["Jan", "Mar", "May", "Jul", "Sep", "Oct"].map((month, i) => (
              <span key={i}>{month}</span>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-400">Average Confidence</span>
            </div>
            <span className="text-lg font-bold text-emerald-400">96.8%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
