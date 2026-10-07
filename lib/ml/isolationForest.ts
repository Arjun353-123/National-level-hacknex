/**
 * Unsupervised Machine Learning Engine: Isolation Forest (Liu, Ting, Zhou 2008)
 * Optimized for Multimodal Medical Image Features & Clinical Patient Records.
 */

export interface MedicalFeatureVector {
  id: string;
  patientId?: string;
  condition: string;
  features: number[]; // [densityInhomogeneity, edgeAsymmetry, contrastRatio, cellularityScore, volumeCm3, patientAge, scanFrequency, opacityIndex]
  metadata?: {
    patientName?: string;
    modality?: string;
    date?: string;
  };
}

export interface IsolationTreeNode {
  isLeaf: boolean;
  size: number;
  splitFeature?: number;
  splitValue?: number;
  left?: IsolationTreeNode;
  right?: IsolationTreeNode;
}

export interface IsolationForestModel {
  id: string;
  trainedAt: string;
  numTrees: number;
  subsampleSize: number;
  maxDepth: number;
  averagePathLengthFactor: number;
  featureNames: string[];
  trees: IsolationTreeNode[];
  trainingStats: {
    totalSamples: number;
    anomalousCount: number;
    normalCount: number;
    meanAnomalyScore: number;
    contaminationRate: number;
  };
}

export interface AnomalyPrediction {
  anomalyScore: number; // 0.0 to 1.0 (Higher = more anomalous/severe outlier)
  isAnomaly: boolean;
  severityLevel: "Normal Anatomical Baseline" | "Mild Anomaly" | "Moderate Pathological Outlier" | "Severe Critical Lesion";
  averagePathLength: number;
  expectedNormalPathLength: number;
  percentileRisk: number;
  featureContributions: {
    feature: string;
    value: number;
    deviationScore: number;
    clinicalSignificance: string;
  }[];
}

export const FEATURE_NAMES = [
  "Tissue Density Inhomogeneity (%)",
  "Edge Margin Asymmetry (%)",
  "Contrast Signal Ratio (%)",
  "Cellularity & Proliferation Index (%)",
  "3D Volumetric Extent (cm³)",
  "Patient Age Index (Years)",
  "Scan Velocity & Frequency",
  "Pathological Infiltrate Opacity (0-1)"
];

/**
 * Calculates average path length c(n) of unsuccessful searches in BST.
 * c(n) = 2 * (ln(n - 1) + Euler_Mascheroni) - (2 * (n - 1) / n)
 */
export function calculateAveragePathLength(n: number): number {
  if (n <= 1) return 0;
  if (n === 2) return 1;
  const eulerMascheroni = 0.5772156649;
  return 2 * (Math.log(n - 1) + eulerMascheroni) - (2 * (n - 1)) / n;
}

/**
 * Builds an Isolation Tree recursively by randomly partitioning feature dimensions.
 */
function buildIsolationTree(
  data: number[][],
  currentDepth: number,
  maxDepth: number
): IsolationTreeNode {
  const numInstances = data.length;

  if (currentDepth >= maxDepth || numInstances <= 1) {
    return {
      isLeaf: true,
      size: numInstances,
    };
  }

  const numFeatures = data[0].length;
  // Randomly pick a feature with non-identical values
  const availableFeatures = Array.from({ length: numFeatures }, (_, i) => i);
  let featureIdx = -1;
  let minVal = 0;
  let maxVal = 0;

  // Shuffle available features to find a valid split dimension
  for (let i = availableFeatures.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableFeatures[i], availableFeatures[j]] = [availableFeatures[j], availableFeatures[i]];
  }

  for (const f of availableFeatures) {
    let min = Infinity;
    let max = -Infinity;
    for (const row of data) {
      const val = row[f];
      if (val < min) min = val;
      if (val > max) max = val;
    }
    if (min < max) {
      featureIdx = f;
      minVal = min;
      maxVal = max;
      break;
    }
  }

  if (featureIdx === -1) {
    return { isLeaf: true, size: numInstances };
  }

  // Uniform random split between min and max
  const splitValue = minVal + Math.random() * (maxVal - minVal);
  const leftData = data.filter((row) => row[featureIdx] < splitValue);
  const rightData = data.filter((row) => row[featureIdx] >= splitValue);

  return {
    isLeaf: false,
    size: numInstances,
    splitFeature: featureIdx,
    splitValue,
    left: buildIsolationTree(leftData, currentDepth + 1, maxDepth),
    right: buildIsolationTree(rightData, currentDepth + 1, maxDepth),
  };
}

/**
 * Calculates path length of sample x in an Isolation Tree.
 */
function computePathLength(x: number[], node: IsolationTreeNode, currentDepth: number): number {
  if (node.isLeaf || node.splitFeature === undefined || node.splitValue === undefined) {
    return currentDepth + calculateAveragePathLength(node.size);
  }

  if (x[node.splitFeature] < node.splitValue) {
    return computePathLength(x, node.left || { isLeaf: true, size: 1 }, currentDepth + 1);
  } else {
    return computePathLength(x, node.right || { isLeaf: true, size: 1 }, currentDepth + 1);
  }
}

/**
 * Trains the Unsupervised Isolation Forest on multi-modal clinical vectors.
 */
export function trainIsolationForest(
  dataset: MedicalFeatureVector[],
  options: {
    numTrees?: number;
    subsampleSize?: number;
    contaminationRate?: number;
  } = {}
): IsolationForestModel {
  const numTrees = options.numTrees || 100;
  const n = dataset.length;
  const subsampleSize = Math.min(options.subsampleSize || 256, n);
  const maxDepth = Math.ceil(Math.log2(Math.max(subsampleSize, 2)));
  const matrix = dataset.map((d) => d.features);

  const trees: IsolationTreeNode[] = [];
  for (let t = 0; t < numTrees; t++) {
    // Sample without replacement
    const shuffled = [...matrix].sort(() => Math.random() - 0.5);
    const subSample = shuffled.slice(0, subsampleSize);
    trees.push(buildIsolationTree(subSample, 0, maxDepth));
  }

  const cN = calculateAveragePathLength(subsampleSize);
  const contaminationRate = options.contaminationRate || 0.15;

  // Compute training scores to establish distribution
  let totalScore = 0;
  let anomalousCount = 0;

  for (const item of matrix) {
    let totalPath = 0;
    for (const tree of trees) {
      totalPath += computePathLength(item, tree, 0);
    }
    const avgPath = totalPath / numTrees;
    const score = Math.pow(2, -avgPath / (cN || 1));
    totalScore += score;
    if (score >= 0.6) anomalousCount++;
  }

  return {
    id: `IF-MODEL-${Date.now()}`,
    trainedAt: new Date().toISOString(),
    numTrees,
    subsampleSize,
    maxDepth,
    averagePathLengthFactor: cN,
    featureNames: FEATURE_NAMES,
    trees,
    trainingStats: {
      totalSamples: n,
      anomalousCount,
      normalCount: n - anomalousCount,
      meanAnomalyScore: Number((totalScore / n).toFixed(3)),
      contaminationRate,
    },
  };
}

/**
 * Predicts whether a medical image + patient record represents an anomaly/pathology outlier.
 */
export function predictAnomaly(
  model: IsolationForestModel,
  featureVector: number[]
): AnomalyPrediction {
  let totalPath = 0;
  for (const tree of model.trees) {
    totalPath += computePathLength(featureVector, tree, 0);
  }
  const avgPath = totalPath / model.numTrees;
  const cN = model.averagePathLengthFactor || calculateAveragePathLength(model.subsampleSize);

  // s(x, n) = 2^(-E(h(x)) / c(n))
  const anomalyScore = Math.max(0.01, Math.min(0.99, Math.pow(2, -avgPath / (cN || 1))));

  let severityLevel: AnomalyPrediction["severityLevel"] = "Normal Anatomical Baseline";
  if (anomalyScore >= 0.72) {
    severityLevel = "Severe Critical Lesion";
  } else if (anomalyScore >= 0.58) {
    severityLevel = "Moderate Pathological Outlier";
  } else if (anomalyScore >= 0.45) {
    severityLevel = "Mild Anomaly";
  }

  // Feature contribution analysis (normalized z-deviation)
  const baselineAverages = [35, 30, 40, 25, 4.0, 45, 4, 0.15];
  const baselineStd = [15, 12, 18, 14, 3.5, 18, 3, 0.12];

  const featureContributions = featureVector.map((val, idx) => {
    const mean = baselineAverages[idx] || 30;
    const std = baselineStd[idx] || 15;
    const deviation = (val - mean) / std;
    const absDev = Math.max(0, Number(deviation.toFixed(2)));

    let clinicalSignificance = "Within normal anatomical threshold";
    if (absDev > 2.0) {
      clinicalSignificance = "High variance: Significant tissue irregularity or lesion density detected";
    } else if (absDev > 1.2) {
      clinicalSignificance = "Moderate elevation: Early localized pathological alteration";
    }

    return {
      feature: FEATURE_NAMES[idx] || `Feature ${idx + 1}`,
      value: Number(val.toFixed(2)),
      deviationScore: absDev,
      clinicalSignificance,
    };
  });

  featureContributions.sort((a, b) => b.deviationScore - a.deviationScore);

  return {
    anomalyScore: Number(anomalyScore.toFixed(3)),
    isAnomaly: anomalyScore >= 0.55,
    severityLevel,
    averagePathLength: Number(avgPath.toFixed(2)),
    expectedNormalPathLength: Number(cN.toFixed(2)),
    percentileRisk: Math.min(99.9, Number((anomalyScore * 100).toFixed(1))),
    featureContributions,
  };
}

/**
 * Synthetic Training Cohort generator for Unsupervised Clinical Training.
 * Combines normal scans and varied pathological cases (pneumonia, mass lesions, compression, effusions).
 */
export function generateMedicalTrainingCohort(count = 120): MedicalFeatureVector[] {
  const cohort: MedicalFeatureVector[] = [];

  const conditions = [
    { name: "Normal Healthy Baseline", weight: 0.55, isAnom: false },
    { name: "Pneumonia Infiltration", weight: 0.15, isAnom: true },
    { name: "Intracranial Mass / Edema", weight: 0.10, isAnom: true },
    { name: "Vertebral Compression", weight: 0.10, isAnom: true },
    { name: "Pleural Effusion & Cardiomegaly", weight: 0.10, isAnom: true },
  ];

  for (let i = 1; i <= count; i++) {
    const rand = Math.random();
    let selected = conditions[0];
    let accum = 0;
    for (const c of conditions) {
      accum += c.weight;
      if (rand <= accum) {
        selected = c;
        break;
      }
    }

    let density: number;
    let asymmetry: number;
    let contrast: number;
    let cellularity: number;
    let volume: number;
    let age = Math.floor(20 + Math.random() * 60);
    let scans = Math.floor(1 + Math.random() * 5);
    let opacity: number;

    if (!selected.isAnom) {
      // Normal healthy baseline (short deviations)
      density = 15 + Math.random() * 25;
      asymmetry = 10 + Math.random() * 20;
      contrast = 20 + Math.random() * 25;
      cellularity = 12 + Math.random() * 18;
      volume = 0.5 + Math.random() * 1.5;
      opacity = 0.02 + Math.random() * 0.08;
    } else {
      // Pathological outlier (high isolation, short path length)
      density = 65 + Math.random() * 32;
      asymmetry = 58 + Math.random() * 38;
      contrast = 70 + Math.random() * 28;
      cellularity = 62 + Math.random() * 35;
      volume = 12 + Math.random() * 45;
      scans = 6 + Math.floor(Math.random() * 14);
      opacity = 0.55 + Math.random() * 0.42;
    }

    cohort.push({
      id: `SCAN-TRAIN-${String(i).padStart(4, "0")}`,
      patientId: `PT-${1000 + i}`,
      condition: selected.name,
      features: [
        Number(density.toFixed(1)),
        Number(asymmetry.toFixed(1)),
        Number(contrast.toFixed(1)),
        Number(cellularity.toFixed(1)),
        Number(volume.toFixed(1)),
        age,
        scans,
        Number(opacity.toFixed(2)),
      ],
      metadata: {
        patientName: `Patient Cohort #${i}`,
        modality: i % 2 === 0 ? "Chest X-Ray" : "Brain MRI",
        date: "2026-10-01",
      },
    });
  }

  return cohort;
}
