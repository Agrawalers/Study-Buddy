import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Layers, HelpCircle, Target, StickyNote, Check, Loader2, MessageCircle, FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import EnhancedExplanation from "@/components/EnhancedExplanation";
import FlashcardsView from "@/components/FlashcardsView";
import QuizView from "@/components/QuizView";
import StudyTipsView from "@/components/StudyTipsView";
import AIChatTutor from "@/components/AIChatTutor";
import PDFExportButton from "@/components/PDFExportButton";

export interface StudyMaterials {
  explanation: string;
  flashcards: { front: string; back: string }[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  studyTips: string[];
}

interface StudyResultsProps {
  data: StudyMaterials;
  topic: string;
}

function buildAutoNotes(data: StudyMaterials, topic: string) {
  const notes: { topic: string; title: string; content: string }[] = [];

  notes.push({
    topic,
    title: "Key Concepts",
    content: data.explanation
      .split(/\n\n+/)
      .map((p) => `• ${p.trim()}`)
      .join("\n\n"),
  });

  const definitions = data.flashcards
    .map((fc) => `Q: ${fc.front}\nA: ${fc.back}`)
    .join("\n\n");
  notes.push({
    topic,
    title: "Quick Definitions & Answers",
    content: definitions,
  });

  const tipsContent = data.studyTips
    .map((tip, i) => `${i + 1}. ${tip}`)
    .join("\n");
  notes.push({
    topic,
    title: "Study Tips",
    content: tipsContent,
  });

  return notes;
}

const StudyResults = ({ data, topic }: StudyResultsProps) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(data.quiz);
  const [loadingNewQuiz, setLoadingNewQuiz] = useState(false);

  const handleAutoSaveNotes = async () => {
    if (!user) {
      toast.error("Please sign in to save notes");
      return;
    }

    setSaving(true);
    try {
      const notes = buildAutoNotes(data, topic);
      const payload = notes.map((n) => ({
        user_id: user.id,
        ...n,
      }));

      const { error } = await supabase.from("topic_notes").insert(payload);
      if (error) throw error;

      setSaved(true);
      toast.success(`${notes.length} notes saved for "${topic}"!`);
    } catch (err) {
      console.error("Failed to save notes:", err);
      toast.error("Failed to save notes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestNewQuiz = async () => {
    setLoadingNewQuiz(true);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        toast.error('API key not configured');
        return;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are a quiz generator. Always respond with valid JSON only.' },
            { role: 'user', content: `Generate 5 new multiple-choice quiz questions about "${topic}". Return ONLY JSON: {"quiz": [{"question": "text", "options": ["A", "B", "C", "D"], "correctAnswer": 0}]}` }
          ],
          temperature: 0.8,
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) throw new Error('Failed to generate quiz');

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      if (!content) throw new Error('No response');

      const parsed = JSON.parse(content);
      if (parsed?.quiz) {
        setQuizQuestions(parsed.quiz);
        toast.success("New quiz questions generated!");
      } else {
        toast.error("Invalid quiz format");
      }
    } catch (err) {
      console.error("Error generating new quiz:", err);
      toast.error("Failed to generate new quiz. Please try again.");
    } finally {
      setLoadingNewQuiz(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-3xl mx-auto px-4 pb-16"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">
          Study Materials
        </h2>
        <p className="text-muted-foreground mb-4">
          for <span className="font-semibold text-primary">{topic}</span>
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button
            onClick={handleAutoSaveNotes}
            disabled={saving || saved}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Notes...
              </>
            ) : saved ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" /> Notes Saved
              </>
            ) : (
              <>
                <StickyNote className="h-3.5 w-3.5" /> Auto-Save as Notes
              </>
            )}
          </Button>
          <PDFExportButton data={data} topic={topic} />
        </div>
      </div>

      <Tabs defaultValue="explanation" className="w-full">
        <TabsList className="w-full grid grid-cols-5 bg-muted/60 rounded-xl p-1 h-auto">
          <TabsTrigger
            value="explanation"
            className="flex items-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary"
          >
            <BookOpen className="h-3.5 w-3.5 hidden sm:block" />
            Explain
          </TabsTrigger>
          <TabsTrigger
            value="flashcards"
            className="flex items-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary"
          >
            <Layers className="h-3.5 w-3.5 hidden sm:block" />
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="flex items-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary"
          >
            <HelpCircle className="h-3.5 w-3.5 hidden sm:block" />
            Quiz
          </TabsTrigger>
          <TabsTrigger
            value="tutor"
            className="flex items-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary"
          >
            <MessageCircle className="h-3.5 w-3.5 hidden sm:block" />
            Tutor
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="flex items-center gap-1.5 rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-card data-[state=active]:text-primary"
          >
            <Target className="h-3.5 w-3.5 hidden sm:block" />
            Tips
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="explanation">
            <EnhancedExplanation explanation={data.explanation} topic={topic} />
          </TabsContent>
          <TabsContent value="flashcards">
            <FlashcardsView flashcards={data.flashcards} />
          </TabsContent>
          <TabsContent value="quiz">
            {loadingNewQuiz ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <QuizView questions={quizQuestions} topic={topic} onRequestNewQuestions={handleRequestNewQuiz} />
            )}
          </TabsContent>
          <TabsContent value="tutor">
            <AIChatTutor topic={topic} explanation={data.explanation} />
          </TabsContent>
          <TabsContent value="tips">
            <StudyTipsView tips={data.studyTips} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default StudyResults;
