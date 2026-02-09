import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AIScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleGenerated: () => void;
}

const AIScheduleDialog = ({ open, onOpenChange, onScheduleGenerated }: AIScheduleDialogProps) => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;

    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key not found');
      }

      const systemPrompt = `You are an AI study planner. Create a daily study schedule for ${scheduleDate}. Distribute tasks across 24 hours. Return ONLY valid JSON (no markdown):

{
  "schedule": [
    {"topic": "Sleep", "start_time": "23:00", "end_time": "07:00", "color": "#6366f1"},
    {"topic": "Breakfast", "start_time": "07:00", "end_time": "08:00", "color": "#10b981"},
    {"topic": "Study Session 1", "start_time": "08:00", "end_time": "10:00", "color": "#3b82f6"}
  ]
}

Include: sleep, meals, study/work sessions, breaks, exercise. No overlapping times.`;

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
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt.trim() }
            ],
            temperature: 0.7,
            max_tokens: 1000
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to generate schedule');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from AI');
      }

      console.log('AI Response:', content);
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const scheduleData = JSON.parse(cleanContent);

      if (!scheduleData?.schedule || !Array.isArray(scheduleData.schedule)) {
        throw new Error('Invalid schedule format');
      }

      const dayOfWeek = new Date(scheduleDate).getDay();
      const scheduleLabel = `AI-${scheduleDate}`;
      const plans = scheduleData.schedule.map((plan: any) => ({
        user_id: user.id,
        topic: `${scheduleLabel}|${plan.topic}`,
        day_of_week: dayOfWeek,
        start_time: plan.start_time,
        end_time: plan.end_time,
        color: plan.color || "#3b82f6",
      }));

      const { error: insertError } = await supabase.from("study_plans").insert(plans);

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw new Error(`Failed to save: ${insertError.message}`);
      }

      toast.success(`AI schedule created for ${scheduleDate}!`);
      setPrompt("");
      setScheduleDate(new Date().toISOString().split('T')[0]);
      onOpenChange(false);
      onScheduleGenerated();
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(err?.message || "Failed to generate schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Schedule Generator
          </DialogTitle>
          <DialogDescription>
            Describe your tasks and goals for the day, and AI will create a personalized 24-hour schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Schedule Date</Label>
            <Input
              id="date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Your Requirements</Label>
            <Textarea
              id="prompt"
              placeholder="Example: I need to study Data Structures for 3 hours, practice coding for 2 hours, attend gym in evening, and have meals at regular intervals."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Schedule...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Schedule
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIScheduleDialog;
