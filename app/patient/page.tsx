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

              {/* ── Disease Medicine Reference Panel ──────────────────────── */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="medical-card p-8 rounded-2xl border border-purple-500/30">
                <div className="flex items-center gap-3 mb-6">
                  <Pill className="w-6 h-6 text-violet-400" />
                  <h2 className="text-2xl font-bold text-violet-200">Disease Medicine Reference</h2>
                  <span className="ml-auto text-xs font-mono text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/30">
                    Clinical Protocols
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      condition: "Pneumonia / Lung Infection",
                      icon: "🫁",
                      color: "from-cyan-900/40 to-blue-900/30",
                      border: "border-cyan-500/30",
                      badge: "bg-cyan-900/50 text-cyan-300 border-cyan-500/40",
                      symptoms: ["Persistent cough with phlegm", "High fever (38°C+)", "Shortness of breath", "Chest pain on breathing"],
                      medicines: [
                        { name: "Amoxicillin-Clavulanate", dosage: "875/125 mg twice daily × 7 days", class: "Antibiotic" },
                        { name: "Azithromycin", dosage: "500 mg once daily × 5 days", class: "Macrolide" },
                        { name: "Paracetamol", dosage: "650 mg every 6 hrs (max 4g/day)", class: "Antipyretic" },
                        { name: "Salbutamol Inhaler", dosage: "2 puffs every 4–6 hrs PRN", class: "Bronchodilator" },
                      ],
                      followUp: "Repeat chest X-Ray in 4–6 weeks. Escalate to IV antibiotics if no improvement in 48 hrs.",
                    },
                    {
                      condition: "Brain Tumor / Intracranial Mass",
                      icon: "🧠",
                      color: "from-purple-900/40 to-violet-900/30",
                      border: "border-purple-500/30",
                      badge: "bg-purple-900/50 text-purple-300 border-purple-500/40",
                      symptoms: ["Severe persistent headache", "Nausea & vomiting", "Vision or speech changes", "Seizures or confusion"],
                      medicines: [
                        { name: "Dexamethasone", dosage: "10 mg IV loading, then 4 mg every 6 hrs", class: "Corticosteroid" },
                        { name: "Mannitol 20%", dosage: "0.5–1 g/kg IV over 20–30 min (ICP control)", class: "Osmotic Diuretic" },
                        { name: "Levetiracetam (Keppra)", dosage: "500 mg orally/IV twice daily", class: "Antiepileptic" },
                        { name: "Omeprazole", dosage: "40 mg orally once daily (GI protection)", class: "PPI" },
                      ],
                      followUp: "Urgent neurosurgical consultation. Contrast-enhanced MRI in 48–72 hrs. Consider stereotactic biopsy.",
                    },
                    {
                      condition: "Cardiac Disease / Pleural Effusion",
                      icon: "❤️",
                      color: "from-rose-900/40 to-red-900/30",
                      border: "border-rose-500/30",
                      badge: "bg-rose-900/50 text-rose-300 border-rose-500/40",
                      symptoms: ["Shortness of breath lying flat", "Leg swelling (edema)", "Chest pressure or tightness", "Rapid / irregular heartbeat"],
                      medicines: [
                        { name: "Furosemide", dosage: "40 mg orally once daily (diuresis)", class: "Loop Diuretic" },
                        { name: "Spironolactone", dosage: "25 mg orally once daily", class: "K-sparing Diuretic" },
                        { name: "Lisinopril", dosage: "5 mg orally once daily (titrate up)", class: "ACE Inhibitor" },
                        { name: "Bisoprolol", dosage: "2.5 mg orally once daily (titrate)", class: "β-blocker" },
                      ],
                      followUp: "Cardiology referral urgently. Echocardiogram + BNP levels. Thoracentesis if effusion causes respiratory compromise.",
                    },
                    {
                      condition: "Vertebral / Spinal Compression",
                      icon: "🦴",
                      color: "from-amber-900/40 to-yellow-900/30",
                      border: "border-amber-500/30",
                      badge: "bg-amber-900/50 text-amber-300 border-amber-500/40",
                      symptoms: ["Lower back pain radiating to legs", "Numbness or tingling", "Reduced mobility", "Pain worse with movement"],
                      medicines: [
                        { name: "Ibuprofen", dosage: "600 mg three times daily with food", class: "NSAID" },
                        { name: "Tramadol", dosage: "50–100 mg every 4–6 hrs PRN", class: "Opioid Analgesic" },
                        { name: "Methocarbamol", dosage: "750 mg four times daily", class: "Muscle Relaxant" },
                        { name: "Calcium + Vitamin D3", dosage: "1000 mg Ca / 800 IU D3 daily", class: "Supplement" },
                      ],
                      followUp: "Orthopaedic review in 2 weeks. Consider kyphoplasty if pain persists > 6 weeks. Annual DEXA scan.",
                    },
                    {
                      condition: "Normal Baseline — Preventive Care",
                      icon: "✅",
                      color: "from-emerald-900/40 to-teal-900/30",
                      border: "border-emerald-500/30",
                      badge: "bg-emerald-900/50 text-emerald-300 border-emerald-500/40",
                      symptoms: ["No acute symptoms", "Routine screening recommended", "Preventive supplement support", "General wellness maintenance"],
                      medicines: [
                        { name: "Multivitamin + Minerals", dosage: "1 tablet once daily", class: "Preventive Supplement" },
                        { name: "Omega-3 Fatty Acids", dosage: "1000 mg twice daily", class: "Cardioprotective" },
                        { name: "Vitamin D3", dosage: "1000 IU daily", class: "Bone Health" },
                        { name: "Magnesium Glycinate", dosage: "400 mg at bedtime", class: "Mineral Supplement" },
                      ],
                      followUp: "Annual routine check-up with primary care physician. No immediate medical intervention required.",
                    },
                  ].map((disease, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`rounded-2xl border bg-gradient-to-br ${disease.color} ${disease.border} overflow-hidden`}
                    >
                      {/* Disease Header */}
                      <div className="p-4 pb-3 flex items-center gap-3">
                        <span className="text-2xl">{disease.icon}</span>
                        <h3 className="text-base font-bold text-slate-100">{disease.condition}</h3>
                      </div>

                      <div className="px-4 pb-4 grid sm:grid-cols-2 gap-4">
                        {/* Symptoms */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Symptoms</p>
                          <ul className="space-y-1">
                            {disease.symptoms.map((s, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                                <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Medicines */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Prescribed Medicines</p>
                          <div className="space-y-1.5">
                            {disease.medicines.map((med, i) => (
                              <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-900/50 border border-white/5">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-violet-200 truncate">{med.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono leading-tight">{med.dosage}</p>
                                </div>
                                <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border ${disease.badge}`}>
                                  {med.class}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Follow-up */}
                      <div className="mx-4 mb-4 p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Follow-Up: </span>
                        <span className="text-[10px] text-slate-300">{disease.followUp}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

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
                      <AnalyticsCharts
                        latestScanType={
                          mlResult.imageType.toLowerCase().includes("ct")
                            ? "CT Scan"
                            : mlResult.imageType.toLowerCase().includes("mri")
                            ? "MRI"
                            : mlResult.imageType.toLowerCase().includes("ultra")
                            ? "Ultrasound"
                            : "X-Ray"
                        }
                        latestConfidence={mlResult.confidence}
                      />
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
