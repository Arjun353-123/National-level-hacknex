"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Minimize2, Maximize2, Volume2, Mic, MicOff } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  lang?: "en" | "ta";
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatbot({ isOpen, onClose }: AIChatbotProps) {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I am your AI Clinical Assistant. You can speak or type in English or தமிழ். How can I help you with your medical images or health questions?",
      sender: "bot",
      timestamp: new Date(),
      lang: "en",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string, langToUse: "en" | "ta" = language) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langToUse === "ta" ? "ta-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recognition is supported in Chrome & Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "ta" ? "ta-IN" : "en-US";
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputValue(text);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (language === "ta") {
      if (lowerMessage.includes("scan") || lowerMessage.includes("ஸ்கேன்") || lowerMessage.includes("படம்")) {
        return "உங்கள் மருத்துவ ஸ்கேன் படங்களை AI மாதிரி பகுப்பாய்வு செய்துள்ளது. எக்ஸ்-ரே, எம்.ஆர்.ஐ மற்றும் சி.டி ஸ்கேன்களில் நோய் பாதிக்கப்பட்ட பகுதிகள் வட்டமிடப்பட்டு காட்டப்படுகின்றன.";
      }
      if (lowerMessage.includes("வலி") || lowerMessage.includes("pain")) {
        return "உங்களுக்கு வலி இருந்தால், உடனடியாக உங்கள் மருத்துவரிடம் ஆலோசனை பெறவும். அவசர உதவிக்கு அவசர எண்ணை அழைக்கவும்.";
      }
      return `உங்கள் கேள்விக்கு நன்றி. AI மருத்துவ மாதிரி உங்கள் மருத்துவ பதிவுகளை சரிபார்த்து துல்லியமான தகவல்களை வழங்குகிறது.`;
    }

    if (lowerMessage.includes("x-ray") || lowerMessage.includes("xray")) {
      return "X-rays utilize electromagnetic radiation to capture bones and lung tissue densities. Our AI model marks pneumonia infiltrates and fractures with precise bounding coordinates.";
    }
    if (lowerMessage.includes("mri") || lowerMessage.includes("magnetic")) {
      return "MRI provides ultra-high resolution soft tissue mapping. In our 3D viewer, brain tumors and meniscus tears are highlighted with thermal gradient heatmaps.";
    }
    if (lowerMessage.includes("ct") || lowerMessage.includes("scan")) {
      return "CT cross-sectional slices reveal 3D anatomical volume. The system automatically measures lesion diameter and volumetric severity.";
    }
    if (lowerMessage.includes("tamil") || lowerMessage.includes("தமிழ்")) {
      return "You can switch directly to தமிழ் mode by clicking the language button in the chat header!";
    }

    return "I can explain your diagnostic scans, disease pattern detection coordinates, and medical terminology in both English and Tamil. How can I assist further?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      lang: language,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botResponseText = generateBotResponse(userMessage.text);
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: "bot",
      timestamp: new Date(),
      lang: language,
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
    speakText(botResponseText, language);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      className={`fixed ${
        isMinimized ? "bottom-6 right-6 w-80" : "bottom-6 right-6 w-96 max-w-[92vw]"
      } z-50 transition-all duration-300 text-slate-100`}
    >
      <div className="medical-card rounded-3xl overflow-hidden shadow-2xl border border-violet-500/40 bg-slate-900/95 backdrop-blur-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-violet-900 to-purple-800 p-4 flex items-center justify-between text-violet-100 border-b border-violet-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-800/50 flex items-center justify-center border border-violet-500/40">
              <Bot className="w-5 h-5 text-violet-200" />
            </div>
            <div>
              <h3 className="font-bold text-violet-100 text-sm">Medical AI Assistant</h3>
              <p className="text-[11px] text-violet-300">English & தமிழ் Support</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bilingual Switcher */}
            <button
              onClick={() => {
                const next = language === "en" ? "ta" : "en";
                setLanguage(next);
              }}
              className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-violet-200 text-xs font-mono font-bold border border-violet-500/30 transition-all"
            >
              {language === "en" ? "EN 🇬🇧" : "தமிழ் 🇮🇳"}
            </button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-violet-800/30 rounded-lg text-violet-200"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-violet-800/30 rounded-lg text-violet-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3.5 bg-slate-950/90">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user" ? "bg-slate-800 text-violet-300 border border-violet-500/30" : "bg-violet-900 text-violet-200 border border-violet-500/40"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-3.5 h-3.5" />
                        ) : (
                          <Bot className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div
                        className={`rounded-2xl p-3 shadow-sm ${
                          message.sender === "user"
                            ? "bg-slate-800 text-violet-200 border border-violet-500/30"
                            : "bg-slate-900 text-slate-300 border border-violet-500/20"
                        }`}
                      >
                        <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                        <div className="flex items-center justify-between mt-1 text-[10px] opacity-70">
                          <span>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {message.sender === "bot" && (
                            <button
                              onClick={() => speakText(message.text, message.lang || language)}
                              className="ml-2 hover:text-violet-400"
                              title="Listen to response"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <div className="flex items-center gap-2 text-teal-800 text-xs font-mono font-bold">
                  <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                  <span>AI Doctor is formulating clinical response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950/95 border-t border-purple-500/30 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "ta"
                    ? "தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள்..."
                    : "Ask in English or Tamil..."
                }
                className="flex-1 bg-slate-900 border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:bg-slate-800"
              />

              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl border transition-all ${
                  isListening
                    ? "bg-red-900 text-red-200 border-red-700 animate-pulse"
                    : "bg-slate-900 text-purple-300 border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/30"
                }`}
                title="Voice input (Mic)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold disabled:opacity-40 transition-all shadow-lg shadow-purple-500/30 border border-purple-400/40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
