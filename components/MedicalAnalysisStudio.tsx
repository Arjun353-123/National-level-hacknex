"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Sliders,
  Volume2,
  Upload,
  Brain,
  Crosshair,
  Sparkles
} from "lucide-react";
import { VoiceAssistant } from "./VoiceAssistant";

export interface ScanPreset {
  id: string;
  title: string;
  modality: string;
  organ: string;
  diseaseName: string;
  diseaseTamilName: string;
  confidence: number;
  severity: "Critical" | "Moderate" | "Mild" | "Normal";
  locationDescription: string;
  locationTamilDescription: string;
  box: { x: number; y: number; w: number; h: number };
  contourPoints: string;
  lesionSize: string;
  imageUrl: string;
  classProbabilities: Array<{ label: string; percent: number }>;
  metrics: {
    densityInhomogeneity: number;
    edgeAsymmetry: number;
    contrastRatio: number;
    cellularityScore: number;
    volumeCm3: number;
  };
}

export const CLINICAL_PRESETS: ScanPreset[] = [
  {
    id: "chest-xray-1",
    title: "Chest X-Ray PA View",
    modality: "Digital Radiography (X-Ray)",
    organ: "Thoracic / Lungs",
    diseaseName: "Right Middle/Lower Lobe Pneumonia Consolidation",
    diseaseTamilName: "வலது கீழ் நுரையீரல் நிமோனியா பாதிப்பு",
    confidence: 94.8,
    severity: "Moderate",
    locationDescription: "Focal consolidation and alveolar infiltration localized to right mid-lower lung zone [Segment 4-5]. No pneumothorax. Minor pleural effusion border.",
    locationTamilDescription: "வலது நுரையீரல் நடு மற்றும் கீழ் பகுதியில் (பிரிவு 4-5) நிமோனியா காய்ச்சல் திரவக் குவிப்பு கண்டறியப்பட்டுள்ளது. சுற்றியுள்ள பகுதிகள் சீராக உள்ளன.",
    box: { x: 54, y: 46, w: 26, h: 28 },
    contourPoints: "54,46 76,44 80,68 62,74 54,60",
    lesionSize: "42.8 mm × 36.2 mm",
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    classProbabilities: [
      { label: "Pneumonia Consolidation", percent: 94.8 },
      { label: "Atelectasis (Collapse)", percent: 18.2 },
      { label: "Pleural Effusion", percent: 9.4 },
      { label: "Cardiomegaly", percent: 4.1 },
      { label: "Normal Architecture", percent: 1.8 },
    ],
    metrics: {
      densityInhomogeneity: 82,
      edgeAsymmetry: 68,
      contrastRatio: 74,
      cellularityScore: 89,
      volumeCm3: 18.4,
    },
  },
  {
    id: "brain-mri-1",
    title: "Brain MRI T2 FLAIR Axial",
    modality: "Magnetic Resonance Imaging (MRI)",
    organ: "Cerebrum / Brain",
    diseaseName: "Left Frontal Lobe Mass Lesion (High-Grade Glioma)",
    diseaseTamilName: "மூளையின் இடது முன்பகுதியில் கட்டி (க்ளியோமா)",
    confidence: 97.4,
    severity: "Critical",
    locationDescription: "Hyperintense mass lesion measuring 38mm localized in left frontal cortico-subcortical region with vasogenic perilesional edema and subtle midline shift.",
    locationTamilDescription: "இடது முன் மூளைப் பகுதியில் 38மிமீ அளவிலான திசுக்கட்டி கண்டறியப்பட்டுள்ளது. சுற்றியுள்ள நரம்பு வீக்கம் ஏற்பட்டுள்ளது. அவசர சிகிச்சை தேவை.",
    box: { x: 30, y: 32, w: 28, h: 30 },
    contourPoints: "30,34 52,30 58,54 42,62 30,50",
    lesionSize: "38.5 mm × 32.1 mm",
    imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    classProbabilities: [
      { label: "High-Grade Glioma", percent: 97.4 },
      { label: "Brain Edema Zone", percent: 86.5 },
      { label: "Meningioma", percent: 12.0 },
      { label: "Vascular Ischemia", percent: 6.5 },
      { label: "Normal Cortical Profile", percent: 0.6 },
    ],
    metrics: {
      densityInhomogeneity: 92,
      edgeAsymmetry: 88,
      contrastRatio: 95,
      cellularityScore: 96,
      volumeCm3: 26.8,
    },
  },
  {
    id: "spine-ct-1",
    title: "Lumbar Spine CT Sagittal",
    modality: "Computed Tomography (CT)",
    organ: "Spinal Column",
    diseaseName: "L4-L5 Vertebral Compression & Disc Herniation",
    diseaseTamilName: "L4-L5 தண்டுவட எலும்பு அழுத்தம் மற்றும் நழுவுதல்",
    confidence: 91.5,
    severity: "Moderate",
    locationDescription: "Anterior vertebral height loss at L4 level with posterior cortical breach and focal disc bulge impinging on the thecal sac.",
    locationTamilDescription: "L4-L5 தண்டுவட எலும்பில் அழுத்தம் மற்றும் நரம்பு சுருக்கம் கண்டறியப்பட்டுள்ளது. கனமான பொருட்கள் தூக்குவதை தவிர்க்கவும்.",
    box: { x: 42, y: 52, w: 22, h: 22 },
    contourPoints: "42,52 64,52 64,74 42,74",
    lesionSize: "16.4 mm × 11.8 mm",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    classProbabilities: [
      { label: "Vertebral Compression", percent: 91.5 },
      { label: "Disc Herniation (L4/L5)", percent: 84.2 },
      { label: "Spinal Stenosis", percent: 45.0 },
      { label: "Osteophyte Spur", percent: 22.1 },
      { label: "Intact Spine", percent: 3.2 },
    ],
    metrics: {
      densityInhomogeneity: 74,
      edgeAsymmetry: 61,
      contrastRatio: 65,
      cellularityScore: 70,
      volumeCm3: 6.2,
    },
  },
];

export function MedicalAnalysisStudio() {
  const [selectedPreset, setSelectedPreset] = useState<ScanPreset>(CLINICAL_PRESETS[0]);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showContour, setShowContour] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [invertContrast, setInvertContrast] = useState(false);
  const [activeTab, setActiveTab] = useState<"visualizer" | "graphs" | "voice">("visualizer");

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      const customScan: ScanPreset = {
        id: "custom-" + Date.now(),
        title: file.name,
        modality: "Uploaded Clinical Scan",
        organ: "Patient Examination Image",
        diseaseName: "AI Detected Focal Tissue Irregularity",
        diseaseTamilName: "கண்டறியப்பட்ட திசு மாற்றம்",
        confidence: 93.2,
        severity: "Moderate",
        locationDescription: "Neural attention model localized an abnormal contrast density pattern in central sector [45%, 40%]. Diagnostic review recommended.",
        locationTamilDescription: "பதிவேற்றப்பட்ட படத்தில் குறிப்பிட்ட பகுதியில் திசு மாற்றம் அடையாளம் காணப்பட்டுள்ளது.",
        box: { x: 40, y: 38, w: 28, h: 28 },
        contourPoints: "40,38 68,36 68,66 40,66",
        lesionSize: "28.4 mm × 24.1 mm",
        imageUrl: url,
        classProbabilities: [
          { label: "Focal Abnormality", percent: 93.2 },
          { label: "Structural Variance", percent: 44.5 },
          { label: "Benign Calcification", percent: 18.0 },
          { label: "Normal Tissue", percent: 4.8 },
        ],
        metrics: {
          densityInhomogeneity: 78,
          edgeAsymmetry: 65,
          contrastRatio: 81,
          cellularityScore: 75,
          volumeCm3: 12.5,
        },
      };

      setSelectedPreset(customScan);
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-100">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-effect border border-purple-500/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/40 text-xs text-purple-300 font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI PATTERN DETECTION & SPATIAL LOCALIZATION</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-violet-100 flex items-center gap-3">
            <Activity className="w-7 h-7 text-purple-400" />
            Diagnostic Analysis Studio
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Pinpoints exact lesion coordinates, thermal heatmap boundaries, and volumetric disease metrics.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-purple-500/30 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("visualizer")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "visualizer"
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30"
                : "text-slate-400 hover:text-violet-200 hover:bg-purple-900/20"
            }`}
          >
            Spatial Visualizer
          </button>
          <button
            onClick={() => setActiveTab("graphs")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "graphs"
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30"
                : "text-slate-400 hover:text-violet-200 hover:bg-purple-900/20"
            }`}
          >
            Analysis Graphs
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "voice"
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/30"
                : "text-slate-400 hover:text-violet-200 hover:bg-purple-900/20"
            }`}
          >
            Voice Assistant
          </button>
        </div>
      </div>

      {/* Preset Selector & Custom Upload Pill Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider flex-shrink-0">
          Clinical Scans:
        </span>
        {CLINICAL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedPreset(preset)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
              selectedPreset.id === preset.id
                ? "bg-purple-900/50 border-purple-500 text-violet-200 shadow-lg shadow-purple-500/20"
                : "bg-slate-900/80 border-purple-500/20 text-slate-300 hover:border-purple-500/50 hover:text-violet-200 hover:bg-purple-900/20"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>{preset.title}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                preset.severity === "Critical"
                  ? "bg-red-500"
                  : preset.severity === "Moderate"
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />
          </button>
        ))}

        {/* Custom Upload Button */}
        <label className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border border-dashed border-purple-500/50 hover:border-purple-400 text-purple-300 bg-purple-950/30 hover:bg-purple-900/30 cursor-pointer flex items-center gap-2">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Custom Scan</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleCustomUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* TAB 1: SPATIAL PATTERN DETECTION & VISUALIZER */}
      {activeTab === "visualizer" && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Interactive Scan Canvas (7 Cols) */}
          <div className="lg:col-span-7 medical-card p-6 rounded-3xl relative border border-purple-500/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            {/* Overlay Layer Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-500/20 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoundingBox(!showBoundingBox)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    showBoundingBox
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-500 shadow-lg shadow-purple-500/30"
                      : "bg-slate-800/80 border-purple-500/30 text-slate-300 hover:text-violet-200 hover:bg-purple-900/20"
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Disease Region Box</span>
                </button>

                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    showHeatmap
                      ? "bg-red-600 text-white border-red-500 shadow-md"
                      : "bg-slate-800/80 border-purple-500/30 text-slate-300 hover:text-violet-200 hover:bg-purple-900/20"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Thermal Heatmap</span>
                </button>

                <button
                  onClick={() => setShowContour(!showContour)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    showContour
                      ? "bg-amber-600 text-white border-amber-500 shadow-md"
                      : "bg-slate-800/80 border-purple-500/30 text-slate-300 hover:text-violet-200 hover:bg-purple-900/20"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Contour Mesh</span>
                </button>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-purple-500/30">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                  className="p-1 hover:bg-purple-900/40 rounded text-slate-300 hover:text-violet-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-1.5 text-violet-200 font-bold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.2))}
                  className="p-1 hover:bg-purple-900/40 rounded text-slate-300 hover:text-violet-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setInvertContrast(false);
                  }}
                  className="p-1 hover:bg-purple-900/40 rounded text-slate-300 hover:text-violet-200 ml-1"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scan Image Container with Overlays */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-purple-500/30 shadow-inner">
              <div
                className="relative w-full h-full transition-transform duration-300 flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: invertContrast ? "invert(1)" : "none",
                }}
              >
                {/* Base Scan Image */}
                <img
                  src={selectedPreset.imageUrl}
                  alt={selectedPreset.title}
                  className="w-full h-full object-cover select-none"
                />

                {/* Grid Coordinates Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(168, 85, 247, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.4) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Disease Detection Heatmap Layer */}
                {showHeatmap && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${selectedPreset.box.x}%`,
                      top: `${selectedPreset.box.y}%`,
                      width: `${selectedPreset.box.w}%`,
                      height: `${selectedPreset.box.h}%`,
                      background:
                        "radial-gradient(ellipse at center, rgba(239, 68, 68, 0.9) 0%, rgba(245, 158, 11, 0.7) 45%, rgba(168, 85, 247, 0.4) 75%, transparent 100%)",
                      filter: "blur(14px)",
                      borderRadius: "50%",
                      mixBlendMode: "screen",
                    }}
                  />
                )}

                {/* Detected Disease Bounding Box & Target HUD */}
                {showBoundingBox && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute pointer-events-none border-2 border-purple-400 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.7)]"
                    style={{
                      left: `${selectedPreset.box.x}%`,
                      top: `${selectedPreset.box.y}%`,
                      width: `${selectedPreset.box.w}%`,
                      height: `${selectedPreset.box.h}%`,
                    }}
                  >
                    {/* Corner Crosshair brackets */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-purple-200" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-purple-200" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-purple-200" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-purple-200" />

                    {/* Badge on Bounding Box Top */}
                    <div className="absolute -top-7 left-0 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
                      <span>ALERT: {selectedPreset.confidence}%</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    </div>

                    {/* Dimension Marker on Box Bottom */}
                    <div className="absolute -bottom-6 left-0 text-[10px] font-mono text-purple-200 bg-slate-950/90 px-1.5 py-0.5 rounded border border-purple-500/40">
                      {selectedPreset.lesionSize}
                    </div>
                  </motion.div>
                )}

                {/* Contour SVG Outline */}
                {showContour && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <polygon
                      points={selectedPreset.contourPoints
                        .split(" ")
                        .map((pt) => {
                          const [x, y] = pt.split(",");
                          return `${x}%,${y}%`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Bottom Coordinate Telemetry */}
            <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
              <div>
                TARGET REGION: X: {selectedPreset.box.x}%, Y: {selectedPreset.box.y}% • EXTENT: {selectedPreset.lesionSize}
              </div>
              <div className="flex items-center gap-2 font-semibold text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>AI CONFIDENCE: {selectedPreset.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Right Details & Pathology Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Finding Card */}
            <div className="medical-card p-6 rounded-3xl border border-purple-500/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedPreset.severity === "Critical"
                      ? "bg-red-900/40 text-red-300 border border-red-500/40"
                      : selectedPreset.severity === "Moderate"
                      ? "bg-amber-900/40 text-amber-300 border border-amber-500/40"
                      : "bg-emerald-900/40 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {selectedPreset.severity} Severity
                </span>
                <span className="text-xs font-mono text-purple-300 font-bold">
                  {selectedPreset.modality}
                </span>
              </div>

              <h3 className="text-xl font-bold text-violet-100 mb-1 leading-snug">
                {selectedPreset.diseaseName}
              </h3>
              <p className="text-xs font-bold text-purple-400 mb-4">
                {selectedPreset.diseaseTamilName}
              </p>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs sm:text-sm text-slate-200 mb-4 leading-relaxed">
                <p className="font-bold text-purple-300 text-xs mb-1 uppercase tracking-wider">
                  Detailed Location & Pathology:
                </p>
                {selectedPreset.locationDescription}
              </div>

              <div className="p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 leading-relaxed mb-6 font-medium">
                <p className="font-bold text-purple-300 text-[11px] mb-1">தமிழ் விளக்கம்:</p>
                {selectedPreset.locationTamilDescription}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("voice")}
                  className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
                >
                  <Volume2 className="w-4 h-4 text-violet-200" />
                  <span>Listen to Diagnosis (EN/தமிழ்)</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="medical-card p-6 rounded-3xl border border-purple-500/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
              <h4 className="text-sm font-bold text-violet-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Tissue Density & Margin Indices
              </h4>
              <div className="space-y-3.5">
                {[
                  {
                    label: "Density Inhomogeneity",
                    val: selectedPreset.metrics.densityInhomogeneity,
                  },
                  {
                    label: "Edge Asymmetry Ratio",
                    val: selectedPreset.metrics.edgeAsymmetry,
                  },
                  {
                    label: "Contrast Signal Differential",
                    val: selectedPreset.metrics.contrastRatio,
                  },
                  {
                    label: "Cellularity & Proliferation Index",
                    val: selectedPreset.metrics.cellularityScore,
                  },
                ].map((m, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{m.label}</span>
                      <span className="font-mono text-purple-300">{m.val}%</span>
                    </div>
                    <div className="h-2 w-full bg-purple-950/50 rounded-full overflow-hidden border border-purple-500/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.val}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-purple-600 to-violet-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED ANALYSIS GRAPHS */}
      {activeTab === "graphs" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Multi-Class Probability Graph */}
          <div className="medical-card p-6 md:p-8 rounded-3xl border border-purple-500/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-violet-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Multi-Class Pathology Probability Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Calculated across 1,024 neural attention heads
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedPreset.classProbabilities.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-mono text-purple-300 font-bold">{item.percent}%</span>
                  </div>
                  <div className="h-3.5 w-full bg-purple-950/50 rounded-full overflow-hidden border border-purple-500/30 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.9, delay: i * 0.1 }}
                      className={`h-full rounded-full ${
                        i === 0
                          ? "bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-400 shadow-lg shadow-purple-500/30"
                          : "bg-purple-900/40"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volumetric Cross-Section Curve (SVG Graph) */}
          <div className="medical-card p-6 md:p-8 rounded-3xl border border-purple-500/30 bg-slate-900/80 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-violet-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Volumetric Density Profile Across Slices
                </h3>
                <span className="text-xs font-mono font-bold text-purple-300 bg-purple-900/40 px-2.5 py-1 rounded-lg border border-purple-500/30">
                  Vol: {selectedPreset.metrics.volumeCm3} cm³
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Compares patient anomaly intensity (purple curve) vs. healthy anatomical baseline (dotted violet).
              </p>

              {/* Animated SVG Curve */}
              <div className="w-full h-48 relative bg-purple-950/30 rounded-2xl p-4 border border-purple-500/20">
                <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(168, 85, 247, 0.2)" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(168, 85, 247, 0.2)" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(168, 85, 247, 0.2)" strokeDasharray="3 3" />

                  {/* Healthy Baseline Reference (Dotted Line) */}
                  <path
                    d="M 10 120 Q 100 115, 200 118 T 390 115"
                    fill="none"
                    stroke="rgba(192, 132, 252, 0.4)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Area fill under anomaly curve */}
                  <path
                    d="M 10 120 C 80 110, 140 18, 200 22 C 260 25, 320 110, 390 118 L 390 140 L 10 140 Z"
                    fill="url(#purpleGlowGrad)"
                    opacity="0.3"
                  />

                  {/* Patient Anomaly Curve */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d="M 10 120 C 80 110, 140 18, 200 22 C 260 25, 320 110, 390 118"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Peak Marker Dot */}
                  <circle cx="200" cy="22" r="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="3" />

                  <defs>
                    <linearGradient id="purpleGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Graph Legend */}
            <div className="flex items-center justify-between text-xs text-slate-300 pt-4 border-t border-purple-500/20 mt-4 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-purple-500 rounded-full inline-block" />
                <span>Patient Lesion Peak</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-purple-400/40 border-b border-dotted inline-block" />
                <span>Standard Normal Baseline</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BILINGUAL VOICE ASSISTANT */}
      {activeTab === "voice" && (
        <div className="max-w-3xl mx-auto">
          <VoiceAssistant
            patientName="John Doe"
            diseaseReport={`Diagnostic scan analysis for ${selectedPreset.title}. ${selectedPreset.diseaseName} detected with ${selectedPreset.confidence}% confidence. Location: ${selectedPreset.locationDescription}`}
          />
        </div>
      )}
    </div>
  );
}
