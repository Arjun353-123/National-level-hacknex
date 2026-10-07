"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "pill" | "dark";
  size?: "sm" | "md" | "lg";
}

export function GlowButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: GlowButtonProps) {
  const baseClasses =
    "glow-button relative font-semibold transition-all duration-300 inline-flex items-center justify-center cursor-pointer select-none";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-900 to-violet-900 hover:from-purple-800 hover:to-violet-800 text-violet-200 shadow-lg shadow-violet-900/50 rounded-full border border-violet-500/40",
    dark:
      "bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-slate-300 shadow-lg shadow-black/30 rounded-full border border-violet-500/20",
    secondary:
      "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 border border-violet-500/30 rounded-full shadow-md shadow-violet-900/30",
    outline:
      "border-2 border-violet-700 bg-slate-900/50 text-violet-300 hover:bg-violet-900/30 rounded-full shadow-md shadow-violet-900/20",
    pill:
      "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 border border-slate-600/40 shadow-sm rounded-full",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
