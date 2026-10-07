"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, X, Send, Languages } from "lucide-react";

interface AIVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

export function AIVoiceAssistant({ isOpen, onClose, patientName = "John Doe" }: AIVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<"English" | "தமிழ்">("English");
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "Hello! I am your AI Medical Voice Assistant. I can explain your diagnostic scan, answer questions, or read your report in English or Tamil.",
    },
  ]);

  const suggestedQuestions = [
    "Explain my scan results",
    "Which area is affected?",
    "What are the precautions?",
    "Next doctor appointment?",
  ];

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setTranscript("What does my chest X-ray show?");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setTranscript("");

    // Simulate AI response
    setTimeout(() => {
      const response =
        language === "English"
          ? "Your chest X-ray shows clear lung fields bilaterally with no acute infiltrates. The cardiac silhouette is within normal limits. No pleural effusion detected. This is a positive result indicating healthy lungs."
          : "உங்கள் மார்பு எக்ஸ்-ரே இரு பக்கமும் தெளிவான நுரையீரல் புலங்களைக் காட்டுகிறது. இதய அமைப்பு இயல்பான வரம்புகளுக்குள் உள்ளது. நல்ல முடிவு.";
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    }, 1500);
  };

  const handleReadAloud = () => {
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl h-[85vh] rounded-3xl overflow-hidden border border-purple-500/40 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(30, 20, 60, 0.98) 0%, rgba(20, 15, 40, 0.98) 100%)",
          }}
        >
          {/* Purple Wave Background Effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-violet-900/50">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg"
              >
                <Volume2 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-violet-200">AI Voice Assistant</h3>
                <p className="text-xs text-slate-400">
                  Speech Assistant for {patientName} • English & தமிழ்
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <div className="flex items-center gap-1 bg-slate-800/50 rounded-full p-1 border border-purple-500/30">
                <button
                  onClick={() => setLanguage("English")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    language === "English"
                      ? "bg-purple-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("தமிழ்")}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    language === "தமிழ்"
                      ? "bg-purple-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  தமிழ்
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="relative z-10 h-[calc(85vh-280px)] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                      : "bg-slate-800/80 text-slate-200 border border-purple-500/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Suggested Questions */}
          <div className="relative z-10 px-6 py-3 border-t border-purple-500/30 bg-slate-900/50">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(question)}
                  className="px-3 py-1.5 text-xs font-medium bg-purple-900/40 hover:bg-purple-800/60 text-violet-200 rounded-full border border-purple-500/40 transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="relative z-10 p-6 border-t border-purple-500/30 bg-gradient-to-r from-slate-900/80 to-purple-900/30">
            <div className="flex items-center gap-3">
              {/* Voice Input Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceInput}
                className={`p-4 rounded-full transition-all shadow-lg ${
                  isListening
                    ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
                    : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500"
                }`}
              >
                <Mic className="w-6 h-6 text-white" />
              </motion.button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(transcript)}
                  placeholder={
                    isListening
                      ? "Listening..."
                      : language === "English"
                      ? "Ask in English or Tamil..."
                      : "ஆங்கிலம் அல்லது தமிழில் கேளுங்கள்..."
                  }
                  className="w-full bg-slate-800 border border-purple-500/30 rounded-2xl px-5 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  onClick={() => handleSendMessage(transcript)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Read Aloud Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReadAloud}
                className={`p-4 rounded-full transition-all shadow-lg ${
                  isSpeaking
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"
                    : "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500"
                }`}
              >
                <Volume2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span>
                {isListening
                  ? "Listening to your voice..."
                  : isSpeaking
                  ? "Reading report aloud..."
                  : "Ready • Standby"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
