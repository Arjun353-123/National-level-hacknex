# Multimodal Medical Image Intelligence Platform

An advanced AI-powered medical imaging analysis platform with real-time diagnosis assistance, featuring stunning 3D animations and an intuitive interface.

## 🌟 Features

- **PredictiveArcCanvas**: Beautiful violet predictive pixel arch with animated core from ThreeUI
- **3D Cursor Effects**: Interactive cursor with ring and dot animations
- **Glowing Button Animations**: Smooth hover effects with glow animations
- **AI-Powered Analysis**: Simulated medical image analysis with real-time feedback
- **Patient Dashboard**: Upload and analyze medical images (X-Ray, CT, MRI, Ultrasound)
- **Admin Dashboard**: Comprehensive patient management and system monitoring
- **Authentication System**: Role-based login (admin/patient)
- **Responsive Design**: Beautiful glassmorphism UI that works on all devices
- **Real-time Chatbot**: AI assistant for medical queries (placeholder)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to: **http://localhost:3000**

## 🎨 Pages & Features

### Home Page (`/`)
- Hero section with PredictiveArcCanvas background
- Feature showcase with animated cards
- Call-to-action sections

### Login Page (`/login`)
- Beautiful glassmorphism login form
- Role-based authentication
- Test credentials:
  - **Admin**: admin@hospital.com (any password)
  - **Patient**: patient@email.com (any password)

### Patient Dashboard (`/patient`)
- Upload medical images
- AI-powered analysis simulation
- Recent activity tracking
- AI chatbot assistant
- Profile overview

### Admin Dashboard (`/admin`)
- System statistics
- Patient management table
- System health monitoring
- Recent alerts
- Quick actions panel

## 🎭 Design Elements

### 3D Effects
- **Custom Cursor**: Animated dot and ring that follows mouse movement
- **Hover Animations**: Cards lift and glow on hover
- **Smooth Transitions**: Framer Motion animations throughout

### Color Scheme
- Primary: Violet/Purple gradient (#a855f7 to #9333ea)
- Secondary: Blue/Cyan gradient
- Background: Dark gradient (10, 10, 30) to (20, 10, 40)
- Accent: Glowing violet effects

### Animations
- `glow`: Pulsing glow effect for buttons
- `float`: Gentle floating animation
- `shimmer`: Moving shine effect
- `scan`: Medical scan line animation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Effects**: Custom Canvas 2D renderer (PredictiveArcCanvas)
- **Icons**: Lucide React

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Home page
│   ├── login/page.tsx        # Login page
│   ├── patient/page.tsx      # Patient dashboard
│   ├── admin/page.tsx        # Admin dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── three-ui/
│   │   ├── PredictiveArcCanvas.tsx  # ThreeUI component
│   │   └── threeui.css              # ThreeUI styles
│   ├── CursorEffect.tsx      # Custom cursor component
│   └── GlowButton.tsx        # Glowing button component
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Key Components

### PredictiveArcCanvas
The stunning violet animated background implemented from ThreeUI source code. Features:
- Canvas 2D rendering
- Wave-based animation system
- Configurable speed, hue, saturation
- Dark/light mode support
- Performance optimized with IntersectionObserver

### CursorEffect
Custom 3D cursor with:
- Animated dot (8px)
- Ring that follows cursor (40px)
- Scale animation on click
- Mix-blend-mode for visual interest

### GlowButton
Interactive button with:
- Multiple variants (primary, secondary, outline)
- Hover glow effects
- Smooth animations
- Size options (sm, md, lg)

## 🔧 Customization

### Modify Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: { ... },
  violet: { ... }
}
```

### Adjust Animations
Edit `app/globals.css` for animation tweaks:
```css
@keyframes glow { ... }
@keyframes float { ... }
```

### Configure PredictiveArc
Modify the component props:
```tsx
<PredictiveArcCanvas
  mode="dark"
  speed={1.0}
  hue={0}
  saturation={1.0}
  brightness={1.0}
/>
```

## 🚧 Future Enhancements

- [ ] Real AI model integration
- [ ] Backend API with database
- [ ] Real-time WebSocket chatbot
- [ ] DICOM image support
- [ ] Report generation
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Advanced analytics

## 📝 License

This project is created for demonstration purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Next.js, TypeScript, and ThreeUI

