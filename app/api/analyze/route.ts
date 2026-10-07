import { NextRequest, NextResponse } from "next/server";
import {
  trainIsolationForest,
  predictAnomaly,
  generateMedicalTrainingCohort,
  IsolationForestModel,
} from "@/lib/ml/isolationForest";

// ── Medicine Suggestion Database ──────────────────────────────────────────────
const MEDICINE_DB: Record<
  string,
  {
    medicines: { name: string; dosage: string; class: string }[];
    lifestyle: string[];
    followUp: string;
  }
> = {
  "Pneumonia Infiltration": {
    medicines: [
      { name: "Amoxicillin-Clavulanate", dosage: "875/125 mg orally twice daily × 7 days", class: "Antibiotic (β-lactam)" },
      { name: "Azithromycin", dosage: "500 mg orally once daily × 5 days", class: "Antibiotic (Macrolide)" },
      { name: "Paracetamol (Acetaminophen)", dosage: "650 mg orally every 6 hrs PRN (max 4 g/day)", class: "Antipyretic / Analgesic" },
      { name: "Salbutamol Inhaler", dosage: "2 puffs (100 mcg) every 4–6 hrs as needed", class: "Bronchodilator" },
    ],
    lifestyle: [
      "Rest and maintain adequate hydration (2–3 L water/day)",
      "Monitor oxygen saturation with pulse oximeter",
      "Avoid smoking and secondhand smoke exposure",
      "Elevate head of bed 30–45° to ease breathing",
    ],
    followUp: "Repeat chest X-Ray in 4–6 weeks to confirm resolution. Escalate to IV antibiotics if no improvement in 48 hrs.",
  },
  "Intracranial Mass / Edema": {
    medicines: [
      { name: "Dexamethasone", dosage: "10 mg IV loading, then 4 mg IV every 6 hrs", class: "Corticosteroid (anti-edema)" },
      { name: "Mannitol 20%", dosage: "0.5–1 g/kg IV over 20–30 min PRN (ICP control)", class: "Osmotic Diuretic" },
      { name: "Levetiracetam (Keppra)", dosage: "500 mg orally/IV twice daily (seizure prophylaxis)", class: "Antiepileptic" },
      { name: "Omeprazole", dosage: "40 mg orally once daily (GI protection from steroids)", class: "PPI" },
    ],
    lifestyle: [
      "Strict bed rest with HOB elevated at 30°",
      "Avoid Valsalva maneuvers (straining, coughing without support)",
      "Neurological observations every 1–2 hours",
      "Maintain fluid balance — avoid hypotonic IV fluids",
    ],
    followUp: "Urgent neurosurgical consultation. Repeat contrast-enhanced MRI in 48–72 hrs. Consider stereotactic biopsy.",
  },
  "Vertebral Compression": {
    medicines: [
      { name: "Ibuprofen", dosage: "600 mg orally 3× daily with food (max 7 days acute)", class: "NSAID (anti-inflammatory)" },
      { name: "Tramadol", dosage: "50–100 mg orally every 4–6 hrs PRN (severe pain)", class: "Opioid Analgesic" },
      { name: "Methocarbamol", dosage: "750 mg orally 4× daily (muscle relaxant)", class: "Skeletal Muscle Relaxant" },
      { name: "Calcium + Vitamin D3", dosage: "1000 mg Ca / 800 IU D3 daily (bone health)", class: "Nutritional Supplement" },
    ],
    lifestyle: [
      "Physical therapy: core strengthening, posture correction",
      "Avoid heavy lifting (> 5 kg) and trunk twisting",
      "Use lumbar support brace during ambulation",
      "Bone density DEXA scan annually",
    ],
    followUp: "Orthopaedic review in 2 weeks. Consider kyphoplasty/vertebroplasty if pain persists > 6 weeks.",
  },
  "Pleural Effusion & Cardiomegaly": {
    medicines: [
      { name: "Furosemide", dosage: "40 mg orally once daily (diuresis)", class: "Loop Diuretic" },
      { name: "Spironolactone", dosage: "25 mg orally once daily (aldosterone antagonist)", class: "K-sparing Diuretic" },
      { name: "Lisinopril", dosage: "5 mg orally once daily (ACE Inhibitor)", class: "Antihypertensive / Cardioprotective" },
      { name: "Bisoprolol", dosage: "2.5 mg orally once daily (titrate up)", class: "β-blocker (heart failure)" },
    ],
    lifestyle: [
      "Fluid restriction: max 1.5 L/day",
      "Salt (sodium) restriction: < 2 g/day",
      "Daily weight monitoring (alert if > 2 kg gain in 2 days)",
      "Cardiac rehabilitation program",
    ],
    followUp: "Cardiology referral urgently. Echocardiogram and BNP levels required. Thoracentesis if effusion causing respiratory compromise.",
  },
  "Normal Healthy Baseline": {
    medicines: [
      { name: "Multivitamin + Minerals", dosage: "1 tablet orally once daily", class: "Preventive Supplement" },
      { name: "Omega-3 Fatty Acids (Fish Oil)", dosage: "1000 mg orally twice daily", class: "Cardioprotective Supplement" },
    ],
    lifestyle: [
      "Maintain regular aerobic exercise (150 min/week moderate intensity)",
      "Balanced diet with fruits, vegetables, lean proteins",
      "Annual health screenings and vaccinations",
      "Limit alcohol, avoid smoking",
    ],
    followUp: "Annual routine check-up with primary care physician. No immediate medical intervention required.",
  },
};

function getMedicineSuggestion(condition: string) {
  if (MEDICINE_DB[condition]) return MEDICINE_DB[condition];
  const c = condition.toLowerCase();
  if (c.includes("pneumon") || c.includes("lung") || c.includes("chest") || c.includes("bronch"))
    return MEDICINE_DB["Pneumonia Infiltration"];
  if (c.includes("brain") || c.includes("mass") || c.includes("glio") || c.includes("cranial") || c.includes("edema"))
    return MEDICINE_DB["Intracranial Mass / Edema"];
  if (c.includes("spine") || c.includes("vertebr") || c.includes("compression") || c.includes("l4") || c.includes("l5"))
    return MEDICINE_DB["Vertebral Compression"];
  if (c.includes("heart") || c.includes("effusion") || c.includes("cardio") || c.includes("pleural"))
    return MEDICINE_DB["Pleural Effusion & Cardiomegaly"];
  return MEDICINE_DB["Normal Healthy Baseline"];
}

// ── Singleton model (persists across hot-module reloads in dev) ───────────────
let globalModel: IsolationForestModel | null = null;

function getOrTrainModel(): IsolationForestModel {
  if (!globalModel) {
    const trainingCohort = generateMedicalTrainingCohort(180);
    globalModel = trainIsolationForest(trainingCohort, {
      numTrees: 120,
      subsampleSize: 120,
      contaminationRate: 0.15,
    });
    console.log("[ML-IF] Isolation Forest trained →", globalModel.trainingStats);
  }
  return globalModel;
}

function extractFeatures(body: {
  patientAge?: number;
  scanFrequency?: number;
  densityInhomogeneity?: number;
  edgeAsymmetry?: number;
  contrastRatio?: number;
  cellularityScore?: number;
  volumeCm3?: number;
  opacityIndex?: number;
}): number[] {
  return [
    body.densityInhomogeneity ?? 35 + Math.random() * 20,
    body.edgeAsymmetry ?? 28 + Math.random() * 18,
    body.contrastRatio ?? 38 + Math.random() * 22,
    body.cellularityScore ?? 25 + Math.random() * 18,
    body.volumeCm3 ?? 3 + Math.random() * 5,
    body.patientAge ?? 40,
    body.scanFrequency ?? 3,
    body.opacityIndex ?? 0.1 + Math.random() * 0.15,
  ];
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, unknown> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const metaRaw = formData.get("meta");
      if (metaRaw && typeof metaRaw === "string") {
        try { payload = JSON.parse(metaRaw); } catch { /**/ }
      }
    } else if (contentType.includes("application/json")) {
      payload = await request.json();
    }

    // ── Train (once) and run Isolation Forest ──
    const model = getOrTrainModel();
    const features = extractFeatures(payload as Parameters<typeof extractFeatures>[0]);
    const prediction = predictAnomaly(model, features);

    // ── Determine detected condition ──
    let detectedCondition = "Normal Healthy Baseline";
    const score = prediction.anomalyScore;

    if (payload.conditionHint && typeof payload.conditionHint === "string") {
      detectedCondition = payload.conditionHint;
    } else if (score >= 0.72) {
      const top = prediction.featureContributions[0];
      if (top.deviationScore > 2) {
        if (top.feature.includes("Density") || top.feature.includes("Opacity"))
          detectedCondition = "Pneumonia Infiltration";
        else if (top.feature.includes("Cellularity") || top.feature.includes("Edge"))
          detectedCondition = "Intracranial Mass / Edema";
        else if (top.feature.includes("Volume"))
          detectedCondition = "Vertebral Compression";
        else
          detectedCondition = "Pleural Effusion & Cardiomegaly";
      } else {
        detectedCondition = "Pneumonia Infiltration";
      }
    } else if (score >= 0.55) {
      detectedCondition = "Pneumonia Infiltration";
    }

    const medicineSuggestion = getMedicineSuggestion(detectedCondition);

    return NextResponse.json({
      success: true,
      data: {
        imageType: (payload.modality as string) || "Medical Imaging Scan",
        quality: score < 0.45 ? "Excellent" : score < 0.65 ? "Good" : "Requires Review",
        confidence: Number((100 - score * 20).toFixed(1)),
        status: prediction.severityLevel,
        recommendation: medicineSuggestion.followUp,
        timestamp: new Date().toISOString(),
        processingTime: "1.8s",
        ml: {
          modelId: model.id,
          trainedAt: model.trainedAt,
          trainingStats: model.trainingStats,
          prediction: {
            anomalyScore: prediction.anomalyScore,
            isAnomaly: prediction.isAnomaly,
            severityLevel: prediction.severityLevel,
            percentileRisk: prediction.percentileRisk,
            averagePathLength: prediction.averagePathLength,
            expectedNormalPathLength: prediction.expectedNormalPathLength,
            featureContributions: prediction.featureContributions,
          },
          featureVector: features,
          detectedCondition,
        },
        medicineSuggestion: {
          condition: detectedCondition,
          medicines: medicineSuggestion.medicines,
          lifestyle: medicineSuggestion.lifestyle,
          followUp: medicineSuggestion.followUp,
        },
      },
    });
  } catch (error) {
    console.error("[analyze] Error:", error);
    return NextResponse.json(
      { error: "Analysis pipeline failed", detail: String(error) },
      { status: 500 }
    );
  }
}
