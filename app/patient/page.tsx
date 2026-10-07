"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PredictiveArcCanvas } from "@/components/three-ui/PredictiveArcCanvas";
import { GlowButton } from "@/components/GlowButton";
import {
  Upload, FileImage, MessageSquare, Activity, User, LogOut, Home,
  Brain, AlertTriangle, CheckCircle, Pill, Heart, TrendingUp, Cpu, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";
import { AIChatbot } from "@/components/AIChatbot";
import { AIVoiceAssistant } from "@/components/AIVoiceAssistant";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";

interface MLResult {
  imageType: string;
  quality: string;
  confidence: number;
  status: string;
  recommendation: string;
  timestamp: string;
  processingTime: string;
  ml: {
    modelId: string;
    trainedAt: string;
    trainingStats: {
      totalSamples: number;
      anomalousCount: number;
      normalCount: number;
      meanAnomalyScore: number;
      contaminationRate: number;
    };
    prediction: {
      anomalyScore: number;
      isAnomaly: boolean;
      severityLevel: string;
      percentileRisk: number;
      averagePathLength: number;
      expectedNormalPathLength: number;
      featureContributions: {
        feature: string;
        value: number;
        deviationScore: number;
        clinicalSignificance: string;
      }[];
    };
    featureVector: number[];
    detectedCondition: string;
  };
  medicineSuggestion: {
    condition: string;
    medicines: { name: string; dosage: string; class: string }[];
    lifestyle: string[];
    followUp: string;
  };
}

function SeverityBadge({ level }: { level: string }) {
  const cfg = level.includes("Severe")
    ? { bg: "bg-red-900/50", text: "text-red-300", border: "border-red-500/40", icon: <AlertTriangle className="w-3 h-3" /> }
    : level.includes("Moderate")
    ? { bg: "bg-amber-900/50", text: "text-amber-300", border: "border-amber-500/40", icon: <AlertTriangle className="w-3 h-3" /> }
    : level.includes("Mild")
    ? { bg: "bg-yellow-900/50", text: "text-yellow-300", border: "border-yellow-500/40", icon: <AlertTriangle className="w-3 h-3" /> }
    : { bg: "bg-emerald-900/50", text: "text-emerald-300", border: "border-emerald-500/40", icon: <CheckCircle className="w-3 h-3" /> };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.icon}{level}
    </span>
  );
}

function AnomalyGauge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 72 ? "#f87171" : pct >= 55 ? "#fbbf24" : pct >= 45 ? "#a78bfa" : "#34d399";
  const r = 52; const circ = 2 * Math.PI * r;
  const dash = circ * score;
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="12" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{pct}%</span>
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Risk</span>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mlResult, setMlResult] = useState<MLResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMlResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      // Send to the ML-powered /api/analyze endpoint
      const body = JSON.stringify({
        modality: "Chest X-Ray PA",
        patientAge: 45,
        scanFrequency: 4,
        // Features will be randomly sampled inside the API for demo purposes
      });
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const json = await res.json();
      if (json.success) {
        setMlResult(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="shader-frame">
        <PredictiveArcCanvas mode="dark" speed={1.00} hue={-113} saturation={1.44} brightness={1.37} />
      </div>



      <div className="relative z-10">
        {/* Navigation */}
        <nav className="glass-effect border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-violet-200">Patient Dashboard</span>
              <span className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded bg-purple-900/50 text-violet-300 border border-purple-500/40">
                AI + ML Engine
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/"><motion.button whileHover={{ scale: 1.05 }} className="p-2 rounded-lg hover:bg-purple-900/30 border border-purple-500/20"><Home className="w-5 h-5 text-purple-300" /></motion.button></Link>
              <Link href="/login"><motion.button whileHover={{ scale: 1.05 }} className="p-2 rounded-lg hover:bg-purple-900/30 border border-purple-500/20"><LogOut className="w-5 h-5 text-purple-300" /></motion.button></Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Main Column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Upload Section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="medical-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-violet-200">
                  <Upload className="w-6 h-6 text-purple-400" />
                  Upload Medical Image
                  <span className="ml-auto text-xs font-mono text-purple-400 bg-purple-900/30 px-2 py-1 rounded border border-purple-500/30">
                    Isolation Forest ML
                  </span>
                </h2>

                <div className="border-2 border-dashed border-purple-500/40 rounded-xl p-12 text-center hover:border-purple-500/70 hover:bg-purple-900/10 transition-all cursor-pointer">
                  <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileImage className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                    <p className="text-lg font-semibold mb-2 text-violet-200">
                      {selectedFile ? selectedFile.name : "Drop your medical image here"}
                    </p>
                    <p className="text-slate-400 text-sm">Supports X-Ray, CT, MRI, Ultrasound</p>
                  </label>
                </div>

                {selectedFile && (
                  <div className="mt-6">
                    <GlowButton variant="primary" size="lg" className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 animate-spin" />
                          Running Isolation Forest Analysis…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Analyze with ML Engine
                        </span>
                      )}
                    </GlowButton>
                  </div>
                )}
              </motion.div>

              {/* ── ML Results ──────────────────────────────────────────────── */}
              <AnimatePresence>
                {mlResult && (
                  <>
                    {/* ① Anomaly Gauge Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="medical-card p-8 rounded-2xl border border-purple-500/30"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Brain className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-violet-200">Isolation Forest — ML Prediction</h2>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-6 items-center">
                        {/* Gauge */}
                        <div className="text-center">
                          <AnomalyGauge score={mlResult.ml.prediction.anomalyScore} />
                          <p className="text-xs text-slate-400 mt-2">Anomaly Risk Score</p>
                        </div>

                        {/* Stats */}
                        <div className="sm:col-span-2 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Severity Level</p>
                              <SeverityBadge level={mlResult.ml.prediction.severityLevel} />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Detected Condition</p>
                              <p className="text-sm font-bold text-violet-200">{mlResult.ml.detectedCondition}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mt-4">
                            {[
                              { label: "Anomaly Score", value: mlResult.ml.prediction.anomalyScore.toFixed(3), unit: "" },
                              { label: "Percentile Risk", value: mlResult.ml.prediction.percentileRisk.toFixed(1), unit: "%" },
                              { label: "AI Confidence", value: mlResult.confidence.toFixed(1), unit: "%" },
                            ].map((s, i) => (
                              <div key={i} className="p-3 rounded-xl bg-purple-900/30 border border-purple-500/20 text-center">
                                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                                <p className="text-xl font-black text-violet-200">{s.value}<span className="text-xs">{s.unit}</span></p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-2 p-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-xs text-slate-400">
                            <span className="font-mono font-bold text-violet-300">[ML-IF] </span>
                            Trained on {mlResult.ml.trainingStats.totalSamples} clinical samples
                            ({mlResult.ml.trainingStats.normalCount} normal / {mlResult.ml.trainingStats.anomalousCount} anomalous) ·
                            mean score: {mlResult.ml.trainingStats.meanAnomalyScore}
                          </div>
                        </div>
                      </div>

                      {/* Feature Contributions */}
                      <div className="mt-6">
                        <button
                          onClick={() => setShowFeatures(!showFeatures)}
                          className="flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-100 transition-colors"
                        >
                          {showFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          Feature Contribution Analysis ({mlResult.ml.prediction.featureContributions.length} features)
                        </button>
                        <AnimatePresence>
                          {showFeatures && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-4 space-y-2"
                            >
                              {mlResult.ml.prediction.featureContributions.map((fc, i) => (
                                <div key={i} className="p-3 rounded-xl bg-slate-800/50 border border-purple-500/20">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold text-violet-200">{fc.feature}</span>
                                    <div className="flex gap-2">
                                      <span className="text-xs font-mono text-slate-300">val: {fc.value}</span>
                                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${fc.deviationScore > 2 ? "bg-red-900/50 text-red-300" : fc.deviationScore > 1.2 ? "bg-amber-900/50 text-amber-300" : "bg-emerald-900/50 text-emerald-300"}`}>
                                        Δ{fc.deviationScore.toFixed(2)}σ
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-purple-950 rounded-full h-1.5 mt-1">
                                    <motion.div
                                      className={`h-1.5 rounded-full ${fc.deviationScore > 2 ? "bg-red-400" : fc.deviationScore > 1.2 ? "bg-amber-400" : "bg-emerald-400"}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(100, fc.deviationScore * 30)}%` }}
                                      transition={{ delay: i * 0.05, duration: 0.6 }}
                                    />
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-1">{fc.clinicalSignificance}</p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* ② Medicine Suggestions Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="medical-card p-8 rounded-2xl border border-purple-500/30"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Pill className="w-6 h-6 text-violet-400" />
                        <h2 className="text-2xl font-bold text-violet-200">AI Medicine Suggestions</h2>
                        <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-violet-900/50 border border-violet-500/40 text-violet-300">
                          {mlResult.medicineSuggestion.condition}
                        </span>
                      </div>

                      {/* Medicine Table */}
                      <div className="overflow-x-auto rounded-xl border border-purple-500/20 mb-6">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-purple-500/20 bg-slate-800/50 text-xs font-mono uppercase text-slate-400">
                              <th className="py-3 px-4">Medication</th>
                              <th className="py-3 px-4">Dosage & Duration</th>
                              <th className="py-3 px-4">Class</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-purple-500/10">
                            {mlResult.medicineSuggestion.medicines.map((med, i) => (
                              <motion.tr
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="hover:bg-purple-900/20 transition-colors"
                              >
                                <td className="py-3 px-4 font-bold text-violet-200">{med.name}</td>
                                <td className="py-3 px-4 text-slate-300 text-xs font-mono">{med.dosage}</td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-1 rounded text-xs bg-purple-900/40 text-purple-300 border border-purple-500/30">{med.class}</span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Lifestyle */}
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-violet-200 flex items-center gap-2 mb-3">
                          <Heart className="w-4 h-4 text-pink-400" />
                          Lifestyle Recommendations
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {mlResult.medicineSuggestion.lifestyle.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-800/40 border border-purple-500/15 text-xs text-slate-300">
                              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Follow-up */}
                      <div className="p-4 rounded-xl bg-violet-900/20 border border-violet-500/30">
                        <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Clinical Follow-Up Protocol
                        </h4>
                        <p className="text-sm text-slate-300">{mlResult.medicineSuggestion.followUp}</p>
                      </div>
                    </motion.div>

                    {/* ③ Health Analytics */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="medical-card p-8 rounded-2xl border border-purple-500/30"
                    >
                      <AnalyticsCharts />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <div className="space-y-6">
              {/* Profile */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="medical-card p-6 rounded-2xl border border-purple-500/30">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-violet-200">John Doe</h3>
                    <p className="text-slate-400 text-sm">Patient ID: P-2024-001</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Total Scans", value: "12" },
                    { label: "Last Visit", value: "Oct 1, 2026" },
                    { label: "Blood Group", value: "O+" },
                    { label: "Age", value: "45 yrs" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-2 px-3 rounded-lg bg-purple-900/20 border border-purple-500/20">
                      <span className="text-slate-400">{item.label}:</span>
                      <span className="font-semibold text-violet-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ML Status Card */}
              {mlResult && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="medical-card p-6 rounded-2xl border border-purple-500/30"
                >
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-violet-200">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    ML Model Status
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Model</span>
                      <span className="font-mono text-violet-300">Isolation Forest</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trees</span>
                      <span className="font-mono text-violet-300">120</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Training samples</span>
                      <span className="font-mono text-violet-300">{mlResult.ml.trainingStats.totalSamples}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contamination</span>
                      <span className="font-mono text-violet-300">{(mlResult.ml.trainingStats.contaminationRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="font-mono text-emerald-400">Unsupervised</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Voice Assistant */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="medical-card p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-violet-200">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  AI Voice Assistant
                </h3>
                <p className="text-slate-400 text-sm mb-4">Talk to me about your medical reports in English or Tamil</p>
                <GlowButton variant="primary" size="sm" className="w-full" onClick={() => setIsVoiceAssistantOpen(true)}>
                  🎤 Start Voice Chat
                </GlowButton>
              </motion.div>

              {/* AI Text Chat */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="medical-card p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-violet-200">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  AI Text Chat
                </h3>
                <p className="text-slate-400 text-sm mb-4">Ask me anything about your medical images or health concerns</p>
                <GlowButton variant="secondary" size="sm" className="w-full" onClick={() => setIsChatOpen(true)}>
                  💬 Open Chat
                </GlowButton>
              </motion.div>

              {/* Recent Activity */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="medical-card p-6 rounded-2xl border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 text-violet-200">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { type: "X-Ray", date: "Oct 1, 2026", status: "Normal" },
                    { type: "CT Scan", date: "Sep 15, 2026", status: "Review" },
                    { type: "MRI", date: "Aug 28, 2026", status: "Normal" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-3 px-3 rounded-lg bg-purple-900/20 border border-purple-500/20 hover:bg-purple-900/30 transition-all">
                      <div>
                        <p className="font-semibold text-violet-200">{item.type}</p>
                        <p className="text-slate-400 text-xs">{item.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${item.status === "Normal" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-amber-500/20 text-amber-400 border border-amber-500/40"}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <AIVoiceAssistant isOpen={isVoiceAssistantOpen} onClose={() => setIsVoiceAssistantOpen(false)} patientName="John Doe" />
    </div>
  );
}
