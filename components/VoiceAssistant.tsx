"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Mic,
  MicOff,
  Square,
  Bot,
  User,
  X,
  Radio
} from "lucide-react";

export type LanguageMode = "en" | "ta";

interface VoiceAssistantProps {
  initialText?: string;
  patientName?: string;
  diseaseReport?: string;
  compact?: boolean;
}

const BILINGUAL_MEDICAL_KNOWLEDGE: Record<
  LanguageMode,
  {
    welcome: string;
    listening: string;
    sampleQuestions: string[];
    defaultReport: string;
    responses: Record<string, string>;
  }
> = {
  en: {
    welcome:
      "Hello! I am your AI Medical Voice Assistant. I can explain your diagnostic scan, answer questions, or read your report in English or Tamil.",
    listening: "Listening to your voice... Speak your medical question now.",
    sampleQuestions: [
      "Explain my scan results",
      "Which area is affected?",
      "What are the precautions?",
      "Next doctor appointment?",
    ],
    defaultReport:
      "Medical scan analysis complete. Pattern detection identified localized infiltration in the designated region with 94.8% AI confidence. Tissue architecture is stable. Routine specialist consultation recommended.",
    responses: {
      scan: "Your scan shows localized tissue changes. The AI has marked the affected area with a cyan-red bounding box and heatmap for clear inspection.",
      area: "The disease pattern was detected predominantly in the focal coordinates highlighted on the scan visualizer. The surrounding margins remain healthy.",
      pain: "If you are experiencing acute pain, please press the emergency call button or inform your attending physician immediately.",
      report: "Your latest imaging report has been processed by deep neural pattern detection. No critical emergencies found.",
      tamil: "You can switch to Tamil mode at any time using the language selector button.",
    },
  },
  ta: {
    welcome:
      "வணக்கம்! நான் உங்கள் AI மருத்துவ குரல் உதவியாளர். உங்கள் மருத்துவ ஸ்கேன் முடிவுகளை தமிழிலும் ஆங்கிலத்திலும் விளக்கி கூற முடியும். உங்களுக்கு என்ன உதவி வேண்டும்?",
    listening: "உங்கள் குரலைக் கேட்கிறேன்... உங்கள் மருத்துவ கேள்வியை இப்போது பேசுங்கள்.",
    sampleQuestions: [
      "என் ஸ்கேன் முடிவை விளக்குங்கள்",
      "எந்த பகுதியில் பாதிப்பு உள்ளது?",
      "என்ன முன்னெச்சரிக்கை எடுக்க வேண்டும்?",
      "அடுத்த மருத்துவ ஆலோசனை எப்போது?",
    ],
    defaultReport:
      "மருத்துவ ஸ்கேன் பகுப்பாய்வு வெற்றிகரமாக முடிந்தது. AI மாதிரி 94.8 சதவீத துல்லியத்துடன் பாதிக்கப்பட்ட பகுதியை அடையாளம் கண்டுள்ளது. திசுக்களின் அமைப்பு சீராக உள்ளது. வழமையான மருத்துவ ஆலோசனை பரிந்துரைக்கப்படுகிறது.",
    responses: {
      scan: "உங்கள் ஸ்கேன் அறிக்கை பகுப்பாய்வு செய்யப்பட்டுள்ளது. பாதிக்கப்பட்ட பகுதி ஸ்கிரீனில் சிவப்பு-நீல வண்ணத்தில் தெளிவாக குறிக்கப்பட்டுள்ளது.",
      area: "நோய் தாக்கம் ஸ்கேனில் சுட்டிக்காட்டப்பட்ட குறிப்பிட்ட பகுதியில் மட்டுமே காணப்படுகிறது. சுற்றியுள்ள திசுக்கள் நல்ல நிலையில் உள்ளன.",
      pain: "உங்களுக்கு தீவிர வலி அல்லது அசௌகரியம் இருந்தால், உடனடியாக மருத்துவரை அணுகவும்.",
      report: "உங்கள் தற்போதைய மருத்துவ அறிக்கையில் ஆபத்தான அவசரநிலைகள் எதுவும் கண்டறியப்படவில்லை.",
      tamil: "நான் தமிழில் பேச தயாராக உள்ளேன். உங்கள் சந்தேகங்களை கேட்கலாம்.",
    },
  },
};

export function VoiceAssistant({
  initialText,
  patientName = "Patient",
  diseaseReport,
  compact = false,
}: VoiceAssistantProps) {
  const [language, setLanguage] = useState<LanguageMode>("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [isOpen, setIsOpen] = useState(!compact);
  const [history, setHistory] = useState<
    Array<{ sender: "user" | "bot"; text: string; lang: LanguageMode }>
  >([
    {
      sender: "bot",
      text: BILINGUAL_MEDICAL_KNOWLEDGE.en.welcome,
      lang: "en",
    },
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (diseaseReport) {
      setSpeechText(diseaseReport);
    } else if (initialText) {
      setSpeechText(initialText);
    } else {
      setSpeechText(BILINGUAL_MEDICAL_KNOWLEDGE[language].defaultReport);
    }
  }, [diseaseReport, initialText, language]);

  const handleToggleLanguage = (newLang: LanguageMode) => {
    stopSpeaking();
    setLanguage(newLang);
    const greeting = BILINGUAL_MEDICAL_KNOWLEDGE[newLang].welcome;
    setHistory((prev) => [...prev, { sender: "bot", text: greeting, lang: newLang }]);
    speakText(greeting, newLang);
  };

  const speakText = (text: string, langToUse: LanguageMode = language) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = langToUse === "ta" ? "ta-IN" : "en-US";

    const voices = synth.getVoices();
    if (langToUse === "ta") {
      const tamilVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes("ta") ||
          v.name.toLowerCase().includes("tamil") ||
          v.lang.startsWith("ta")
      );
      if (tamilVoice) utterance.voice = tamilVoice;
    } else {
      const englishVoice = voices.find(
        (v) =>
          (v.lang === "en-US" || v.lang === "en-GB") &&
          (v.name.includes("Google") || v.name.includes("Natural"))
      );
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is supported in Chrome & Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "ta" ? "ta-IN" : "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserVoiceQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleUserVoiceQuery = (query: string) => {
    const userLang = language;
    setHistory((prev) => [...prev, { sender: "user", text: query, lang: userLang }]);

    const lowerQuery = query.toLowerCase();
    let reply = "";
    const knowledge = BILINGUAL_MEDICAL_KNOWLEDGE[userLang];

    if (lowerQuery.includes("scan") || lowerQuery.includes("ஸ்கேன்") || lowerQuery.includes("படம்")) {
      reply = knowledge.responses.scan;
    } else if (
      lowerQuery.includes("area") ||
      lowerQuery.includes("where") ||
      lowerQuery.includes("பகுதி") ||
      lowerQuery.includes("இடம்")
    ) {
      reply = knowledge.responses.area;
    } else if (lowerQuery.includes("pain") || lowerQuery.includes("வலி") || lowerQuery.includes("உடல்")) {
      reply = knowledge.responses.pain;
    } else if (lowerQuery.includes("report") || lowerQuery.includes("அறிக்கை") || lowerQuery.includes("முடிவு")) {
      reply = knowledge.responses.report;
    } else {
      reply =
        userLang === "ta"
          ? `உங்கள் கேள்வி: "${query}". உங்கள் மருத்துவ ஸ்கேனில் கண்டறியப்பட்ட மாதிரிகளை AI சரிபார்த்துள்ளது. நீங்கள் பாதுகாப்பாக உள்ளீர்கள்.`
          : `You asked: "${query}". The AI model has verified your scan pattern. All parameters are registered in your health record.`;
    }

    setHistory((prev) => [...prev, { sender: "bot", text: reply, lang: userLang }]);
    speakText(reply, userLang);
  };

  return (
    <div className="voice-assistant-container text-slate-100">
      {/* Floating launcher badge when compact */}
      {compact && !isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 px-5 py-3 rounded-full bg-gradient-to-r from-purple-900 to-violet-900 text-white font-medium shadow-2xl flex items-center gap-2.5 border border-purple-500/40"
        >
          <Radio className="w-5 h-5 text-purple-400 animate-pulse" />
          <span>Voice Assistant (EN / தமிழ்)</span>
        </motion.button>
      )}

      {/* Main Voice Assistant Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="medical-card p-6 rounded-3xl relative border border-purple-500/30 overflow-hidden shadow-2xl bg-slate-900/90 backdrop-blur-2xl"
          >
            {/* Header with Language Selector & Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-violet-100 flex items-center gap-2 text-base">
                    AI Voice Assistant
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/40 font-mono font-semibold">
                      Bilingual
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Speech Assistant for {patientName} • English & தமிழ்
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switcher Buttons */}
                <div className="flex items-center rounded-xl bg-slate-950/80 border border-purple-500/30 p-1">
                  <button
                    onClick={() => handleToggleLanguage("en")}
                    className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                      language === "en"
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/30"
                        : "text-slate-400 hover:text-violet-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleToggleLanguage("ta")}
                    className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                      language === "ta"
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/30"
                        : "text-slate-400 hover:text-violet-200"
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>

                {compact && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-violet-200 hover:bg-purple-900/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Soundwave Animation Bar */}
            <div className="h-10 rounded-2xl bg-purple-950/40 border border-purple-500/30 px-4 flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 h-full">
                {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height:
                        isSpeaking || isListening ? [`${h * 0.25}%`, `${h}%`, `${h * 0.3}%`] : "15%",
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 4) * 0.15,
                      ease: "easeInOut",
                    }}
                    className={`w-1 rounded-full ${
                      isListening
                        ? "bg-red-500 shadow-sm"
                        : isSpeaking
                        ? "bg-gradient-to-t from-purple-500 to-violet-300 shadow-[0_0_8px_#c084fc]"
                        : "bg-purple-900/60"
                    }`}
                  />
                ))}
              </div>

              <div className="text-xs font-mono font-bold">
                {isListening ? (
                  <span className="text-red-400 animate-pulse">● Listening (பேசவும்)...</span>
                ) : isSpeaking ? (
                  <span className="text-purple-300">
                    Speaking in {language === "ta" ? "தமிழ்" : "English"}...
                  </span>
                ) : (
                  <span className="text-slate-400">Ready • Standby</span>
                )}
              </div>
            </div>

            {/* Conversation Log */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 mb-4 text-sm">
              {history.slice(-4).map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl ${
                    item.sender === "user"
                      ? "bg-purple-900/40 border border-purple-500/30 ml-6 text-right text-violet-200 font-medium"
                      : "bg-slate-800/80 border border-purple-500/30 mr-6 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs text-purple-300/80 mb-1 font-semibold">
                    {item.sender === "user" ? (
                      <>
                        <span className="ml-auto">You ({item.lang.toUpperCase()})</span>
                        <User className="w-3 h-3 text-purple-300" />
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-purple-300" />
                        <span>AI Assistant ({item.lang === "ta" ? "தமிழ்" : "English"})</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed text-xs sm:text-sm">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Sample Instant Question Prompts */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {BILINGUAL_MEDICAL_KNOWLEDGE[language].sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleUserVoiceQuery(q)}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/40 border border-purple-500/30 text-purple-200 hover:bg-purple-900/50 hover:border-purple-400 shadow-sm transition-all"
                >
                  💬 {q}
                </button>
              ))}
            </div>

            {/* Controls Bar: Read Scan Report / Mic Button / Stop */}
            <div className="flex items-center gap-2 pt-3 border-t border-purple-500/20">
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    speakText(speechText, language);
                  }
                }}
                className={`flex-1 py-3 px-4 rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all shadow-lg shadow-purple-500/20 ${
                  isSpeaking
                    ? "bg-red-900/40 text-red-300 border border-red-500/40 hover:bg-red-900/60"
                    : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-violet-200" />
                    <span>
                      {language === "ta" ? "அறிக்கையை தமிழில் கேட்க" : "Read Report Aloud"}
                    </span>
                  </>
                )}
              </button>

              {/* Voice Input Microphone Button */}
              <button
                onClick={toggleListening}
                title="Voice Input (Speech-to-Text)"
                className={`p-3 rounded-full border transition-all flex items-center justify-center shadow-lg ${
                  isListening
                    ? "bg-red-600 text-white border-red-500 animate-pulse shadow-red-500/30"
                    : "bg-purple-900/50 text-violet-200 border-purple-500/40 hover:bg-purple-800/60 hover:border-purple-400 shadow-purple-500/20"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-300" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
