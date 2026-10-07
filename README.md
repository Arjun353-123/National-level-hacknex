# 🏥 Multimodal Medical Image Intelligence Platform

> An AI-powered medical imaging analysis platform with **Isolation Forest unsupervised ML**, real-time diagnosis assistance, medicine suggestions, and a stunning 3D animated UI.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![ML: Isolation Forest](https://img.shields.io/badge/ML-Isolation%20Forest-9333ea)](https://en.wikipedia.org/wiki/Isolation_forest)

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🧠 **Isolation Forest ML** | Unsupervised anomaly detection trained on 180 synthetic clinical cases |
| 💊 **Medicine Suggestions** | Condition-specific drug protocols with dosage + drug class |
| 🖼️ **Medical Image Analysis** | Upload X-Ray, CT, MRI, Ultrasound — get instant AI results |
| 🎨 **PredictiveArcCanvas** | Violet animated 3D arc background (Canvas 2D + WebGL) |
| 📊 **Analytics Charts** | Real-time Charts.js powered health dashboards |
| 🤖 **AI Chatbot** | Medical query assistant |
| 🔐 **Role-based Auth** | Admin and Patient login flows |
| 🩺 **Admin Dashboard** | Patient management, anomaly monitoring, system health |
| 👤 **Patient Dashboard** | Image upload, ML scoring, feature deviations, recommendations |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# → http://localhost:3000
```

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@hospital.com` | any |
| Patient | `patient@email.com` | any |

---

## 🧠 AI/ML Engine

### Isolation Forest (Unsupervised Learning)

The ML engine is implemented **from scratch in TypeScript** — no Python, no external ML library.

**Architecture:**
- **Algorithm**: Isolation Forest (anomaly detection)
- **Trees**: 120 isolation trees
- **Features (8-dimensional)**:
  1. `densityInhomogeneity` — tissue density variance
  2. `edgeAsymmetry` — boundary irregularity
  3. `contrastRatio` — attenuation difference
  4. `cellularityScore` — cellular density estimate
  5. `volumeCm3` — lesion/region volume
  6. `opacityIndex` — opacity level (0–1)
  7. `patientAge` — normalized age factor
  8. `scanFrequency` — scan count per year

**Training**: 180 synthetic clinical cases (120 normal, 60 anomalous)  
**Output**: Anomaly score (0–1), risk level, per-feature σ deviation

### Medicine Suggestion Engine

Maps detected anomaly pattern + modality hint → clinical drug protocols:

| Condition | Example Medicines |
|-----------|------------------|
| Pneumonia Infiltrate | Amoxicillin-Clavulanate, Azithromycin, Oseltamivir |
| Pulmonary Mass | Carboplatin, Pemetrexed, Pembrolizumab |
| Brain Tumor | Temozolomide, Bevacizumab, Dexamethasone |
| Cardiac Anomaly | Lisinopril, Metoprolol, Furosemide |
| Kidney Pathology | Tacrolimus, Mycophenolate, Prednisone |
| General Anomaly | Methylprednisolone, Gabapentin, Pantoprazole |

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero + feature showcase |
| `/login` | Login | Role-based auth |
| `/patient` | Patient Dashboard | Image upload + ML analysis |
| `/admin` | Admin Dashboard | System monitoring + patient management |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticate user |
| `/api/analyze` | POST | Run Isolation Forest ML on patient data |
| `/api/patients` | GET/POST | Patient records CRUD |

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript / TSX
- **Styling**: Tailwind CSS + custom animations
- **Animations**: Framer Motion
- **Charts**: Chart.js
- **Icons**: Lucide React

### Backend
- **Runtime**: Next.js API Routes (Node.js serverless)
- **Language**: TypeScript

### AI/ML
- **Algorithm**: Isolation Forest (written from scratch in TypeScript)
- **Location**: [`lib/ml/isolationForest.ts`](./lib/ml/isolationForest.ts)
- **No external ML library required**

### Database
- **Type**: In-Memory store (JavaScript array)
- **Pre-seeded**: 5 clinical patient records

### 3D Background
- **Engine**: Canvas 2D + WebGL (Three.js r128)
- **Component**: `PredictiveArcCanvas` (violet animated arc)
- **Config**: `hue=-113, saturation=1.44, brightness=1.37`

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                    # Home page
│   ├── login/page.tsx              # Login page
│   ├── patient/page.tsx            # Patient dashboard (ML powered)
│   ├── admin/page.tsx              # Admin dashboard
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   └── api/
│       ├── auth/login/route.ts     # Auth endpoint
│       ├── analyze/route.ts        # ML Isolation Forest endpoint
│       └── patients/route.ts       # Patient data CRUD
├── components/
│   ├── three-ui/
│   │   ├── PredictiveArcCanvas.tsx # 3D background component
│   │   ├── predictiveArcRenderer.ts # WebGL renderer
│   │   └── threeui.css
│   ├── MedicalAnalysisStudio.tsx   # Image upload + analysis UI
│   ├── AnalyticsCharts.tsx         # Charts dashboard
│   ├── AIChatbot.tsx               # Chatbot interface
│   ├── AIVoiceAssistant.tsx        # Voice assistant UI
│   ├── GlowButton.tsx              # Animated button
│   └── CursorEffect.tsx            # 3D cursor
├── lib/
│   └── ml/
│       └── isolationForest.ts      # Isolation Forest from scratch
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Design System

- **Primary Color**: Violet/Purple `#a855f7 → #9333ea`
- **Background**: Dark gradient `rgb(10,10,30) → rgb(20,10,40)`
- **Typography**: Inter (Google Fonts)
- **Effects**: Glassmorphism, glow blur, shimmer

---

## 📝 License

Created for **National Level Hackathon** — HackNex.

---

Built with ❤️ using **Next.js · TypeScript · Isolation Forest · Three.js**
