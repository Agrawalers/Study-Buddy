import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid topic" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `Generate comprehensive study materials for: "${topic}"

Return ONLY valid JSON with NO markdown:
{
  "explanation": "Detailed explanation with 5-7 paragraphs separated by double newlines",
  "flashcards": [
    {"front": "Question 1", "back": "Answer 1"},
    {"front": "Question 2", "back": "Answer 2"},
    {"front": "Question 3", "back": "Answer 3"},
    {"front": "Question 4", "back": "Answer 4"},
    {"front": "Question 5", "back": "Answer 5"}
  ],
  "quiz": [
    {"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": 0},
    {"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": 1},
    {"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": 2},
    {"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": 3},
    {"question": "Question text", "options": ["A", "B", "C", "D"], "correctAnswer": 0}
  ],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error("Failed to generate study materials");
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("No content received from AI");
    }

    const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const studyMaterials = JSON.parse(cleanContent);

    return new Response(JSON.stringify(studyMaterials), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Study generation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
