"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PredictiveArcCanvas } from "@/components/three-ui/PredictiveArcCanvas";
import { GlowButton } from "@/components/GlowButton";

import { Brain, Activity, Upload, Shield, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="shader-frame">
        <PredictiveArcCanvas
          mode="dark"
          speed={1.00}
          hue={-113}
          saturation={1.44}
          brightness={1.37}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
                Medical Image Intelligence
              </h1>
              <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto">
                Advanced AI-powered multimodal medical imaging analysis platform with real-time diagnosis assistance
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/login">
                  <GlowButton variant="primary" size="lg">
                    Get Started
                  </GlowButton>
                </Link>
                <Link href="#features">
                  <GlowButton variant="outline" size="lg">
                    Learn More
                  </GlowButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
            >
              Powerful Features
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-12 h-12" />,
                  title: "AI-Powered Analysis",
                  description: "Advanced deep learning models analyze medical images with unprecedented accuracy"
                },
                {
                  icon: <Activity className="w-12 h-12" />,
                  title: "Real-Time Diagnosis",
                  description: "Instant analysis and diagnosis suggestions powered by cutting-edge AI technology"
                },
                {
                  icon: <Upload className="w-12 h-12" />,
                  title: "Multi-Modal Support",
                  description: "Support for X-Ray, CT, MRI, Ultrasound, and other medical imaging formats"
                },
                {
                  icon: <Shield className="w-12 h-12" />,
                  title: "HIPAA Compliant",
                  description: "Enterprise-grade security ensuring patient data privacy and compliance"
                },
                {
                  icon: <Zap className="w-12 h-12" />,
                  title: "Lightning Fast",
                  description: "Process and analyze medical images in seconds, not hours"
                },
                {
                  icon: <Users className="w-12 h-12" />,
                  title: "Collaborative Platform",
                  description: "Share insights and collaborate with healthcare professionals seamlessly"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="medical-card p-8 rounded-2xl"
                >
                  <div className="text-violet-400 mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-effect p-12 rounded-3xl"
            >
              <h2 className="text-4xl font-bold mb-6 text-white">Ready to Transform Healthcare?</h2>
              <p className="text-xl text-white mb-8">
                Join thousands of healthcare professionals using our platform
              </p>
              <Link href="/login">
                <GlowButton variant="primary" size="lg">
                  Start Free Trial
                </GlowButton>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Floating AI Chatbot */}

    </main>
  );
}
