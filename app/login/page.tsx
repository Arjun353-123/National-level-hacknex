"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PredictiveArcCanvas } from "@/components/three-ui/PredictiveArcCanvas";
import { GlowButton } from "@/components/GlowButton";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple role-based routing
    if (email.includes("admin")) {
      router.push("/admin");
    } else {
      router.push("/patient");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="shader-frame">
        <PredictiveArcCanvas
          mode="dark"
          speed={1.00}
          hue={-113}
          saturation={1.44}
          brightness={1.37}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-violet-400 mb-8 hover:text-violet-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect p-8 rounded-3xl"
        >
          <h1 className="text-4xl font-bold mb-2 text-white text-center">Welcome Back</h1>
          <p className="text-white text-center mb-8">Sign in to access your dashboard</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <p className="text-xs text-white mt-1">Try: admin@hospital.com or patient@email.com</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <GlowButton type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </GlowButton>
          </form>

          <div className="mt-6 text-center text-sm text-white">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
