import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Volume2, Globe, ArrowLeft, Sparkles, Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface VoiceMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const EchoAI = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en-US");
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { listening, transcript, start: startListening, stop: stopListening } = useSpeechRecognition({
    lang: language,
    interimResults: true,
  });

  const { speaking: isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis({
    lang: language,
    rate: 1.2,
    pitch: 1.0,
  });

  // Auto-restart listening after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && !listening && messages.length > 0 && !isProcessing) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  // Stop processing when speaking ends
  useEffect(() => {
    if (!isSpeaking && isProcessing) {
      setIsProcessing(false);
    }
  }, [isSpeaking]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const loadHistory = async () => {
    // Try to load from Supabase first
    if (user) {
      try {
        const { data } = await supabase
          .from("voice_chat_history")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);
        if (data) {
          setConversationHistory(data);
          return;
        }
      } catch (error) {
        console.log('Using local storage for history');
      }
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('echo-ai-history');
    if (saved) {
      setConversationHistory(JSON.parse(saved));
    }
  };

  const saveToHistory = async (userMsg: string, aiMsg: string) => {
    const newEntry = {
      id: Date.now().toString(),
      user_id: user?.id || 'guest',
      user_message: userMsg,
      ai_response: aiMsg,
      language: language,
      created_at: new Date().toISOString(),
    };

    // Try to save to Supabase
    if (user) {
      try {
        await supabase.from("voice_chat_history").insert({
          user_id: user.id,
          user_message: userMsg,
          ai_response: aiMsg,
          language: language,
        });
      } catch (error) {
        console.log('Saving to local storage instead');
      }
    }
    
    // Always save to localStorage as backup
    const updated = [newEntry, ...conversationHistory].slice(0, 50);
    setConversationHistory(updated);
    localStorage.setItem('echo-ai-history', JSON.stringify(updated));
  };

  const processVoiceInput = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: VoiceMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key not found');
      }

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{
              role: "user",
              content: text
            }],
            temperature: 0.7,
            max_tokens: 150
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API Error:', errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      const aiMsg: VoiceMessage = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Save to history and reload
      await saveToHistory(text, aiResponse);

      // Then speak the response
      speak(aiResponse);
    } catch (error: any) {
      console.error('Echo AI Error:', error);
      toast.error(error.message || "Failed to process your message");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!listening && transcript && transcript.trim()) {
      processVoiceInput(transcript);
    }
  }, [listening]);

  const handleMicClick = () => {
    if (listening) {
      stopListening();
    } else {
      if (isSpeaking) stopSpeaking();
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-background to-purple-50/50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md p-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Echo AI
              </h1>
              <p className="text-xs text-muted-foreground">Voice-to-Voice Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-3 py-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 border-0 bg-transparent text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">🇬🇧 English</SelectItem>
                  <SelectItem value="hi-IN">🇮🇳 हिंदी</SelectItem>
                  <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                  <SelectItem value="fr-FR">🇫🇷 Français</SelectItem>
                  <SelectItem value="de-DE">🇩🇪 Deutsch</SelectItem>
                  <SelectItem value="pt-PT">🇵🇹 Português</SelectItem>
                  <SelectItem value="ja-JP">🇯🇵 日本語</SelectItem>
                  <SelectItem value="zh-CN">🇨🇳 中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <History className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Conversation History</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
                  {conversationHistory.map((conv) => (
                    <Card key={conv.id} className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(conv.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm font-medium text-foreground mb-1">
                        You: {conv.user_message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        AI: {conv.ai_response}
                      </p>
                    </Card>
                  ))}
                  {conversationHistory.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No conversation history yet
                    </p>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white mx-auto shadow-2xl">
                <span className="text-5xl">🎤</span>
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Talk to Echo AI
            </h2>
            <p className="text-muted-foreground mb-2">
              {listening
                ? "🎙️ Listening... Speak now"
                : isProcessing
                ? "⏳ Processing your request..."
                : isSpeaking
                ? "🔊 AI is speaking..."
                : "Press the microphone to start"}
            </p>
            {isSpeaking && (
              <motion.div
                className="flex justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                    animate={{
                      height: [20, 60, 20],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            )}
            {messages.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                💬 {messages.length} messages exchanged
              </p>
            )}
          </motion.div>
        </div>

        {/* Voice Control */}
        <div className="flex justify-center gap-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleMicClick}
            disabled={isProcessing || isSpeaking}
            className={`relative h-20 w-20 rounded-full shadow-2xl transition-all ${
              listening
                ? "bg-red-500 animate-pulse"
                : isProcessing || isSpeaking
                ? "bg-blue-500"
                : "bg-gradient-to-br from-blue-500 to-purple-500 hover:shadow-3xl"
            }`}
          >
            {isProcessing || isSpeaking ? (
              <Loader2 className="h-8 w-8 text-white animate-spin mx-auto" />
            ) : listening ? (
              <Mic className="h-8 w-8 text-white mx-auto" />
            ) : (
              <Mic className="h-8 w-8 text-white mx-auto" />
            )}
            {listening && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-4 border-red-300"
              />
            )}
          </motion.button>
          {isSpeaking && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopSpeaking}
              className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl transition-all flex items-center justify-center"
            >
              <Volume2 className="h-8 w-8 text-white" />
              <span className="absolute text-3xl">✕</span>
            </motion.button>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {listening
            ? "Listening... Speak now"
            : isProcessing
            ? "Processing..."
            : isSpeaking
            ? "Speaking..."
            : "Tap to speak"}
        </p>
      </div>
    </div>
  );
};

export default EchoAI;
