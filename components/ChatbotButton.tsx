"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { AIChatbot } from "./AIChatbot";

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-purple-900 to-violet-900 rounded-full shadow-lg shadow-violet-900/50 flex items-center justify-center glow-button border border-violet-500/40"
        >
          <MessageSquare className="w-7 h-7 text-violet-200" />
        </motion.button>
      )}
      
      <AIChatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
