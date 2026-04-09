import Groq from "groq-sdk";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type FlashcardItem = {
  front: string;
  back: string;
};

export type GenerateResult =
  | { mode: "quiz"; data: QuizQuestion[] }
  | { mode: "flashcard"; data: FlashcardItem[] };

export async function generateQuizOrFlashcard(
  notes: string,
  mode: "quiz" | "flashcard",
  count: number = 10
): Promise<GenerateResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    throw new Error(
      "GROQ_API_KEY is not set. Open QuizzyAI/.env.local and add: GROQ_API_KEY=gsk_..."
    );
  }

  const groq = new Groq({ apiKey });

  const quizSystemPrompt = `You are a strict JSON API. You ONLY return raw valid JSON. No markdown, no backticks, no explanations, no extra text — just the JSON array.

Generate exactly ${count} multiple-choice quiz questions based on the provided notes.

STRICT OUTPUT FORMAT — return ONLY this JSON structure, nothing else:
[
  {
    "question": "Clear, specific question text",
    "options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why the correct answer is right"
  }
]

Rules:
- Return EXACTLY ${count} items in the array
- correctIndex MUST be 0, 1, 2, or 3 (integer, not string)
- Each option MUST start with "A. ", "B. ", "C. ", or "D. " prefix
- Questions must be directly derived from the notes
- No duplicate questions
- Do NOT wrap output in any object, just the raw array`;

  const flashcardSystemPrompt = `You are a strict JSON API. You ONLY return raw valid JSON. No markdown, no backticks, no explanations, no extra text — just the JSON array.

Generate exactly ${count} high-quality flashcards based on the provided notes.

STRICT OUTPUT FORMAT — return ONLY this JSON structure, nothing else:
[
  {
    "front": "Concise question or term",
    "back": "Clear, complete answer or definition"
  }
]

Rules:
- Return EXACTLY ${count} items in the array
- front: short question or key term (max 15 words)
- back: clear, informative answer (1-3 sentences)
- Cards must be directly derived from the notes
- No duplicate cards
- Do NOT wrap output in any object, just the raw array`;

  const systemPrompt = mode === "quiz" ? quizSystemPrompt : flashcardSystemPrompt;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Here are the notes to generate ${mode === "quiz" ? "quiz questions" : "flashcards"} from:\n\n${notes}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 4096,
  });

  const rawContent = completion.choices[0]?.message?.content ?? "{}";

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  const items: unknown = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>).questions ??
      (parsed as Record<string, unknown>).flashcards ??
      (parsed as Record<string, unknown>).items ??
      (parsed as Record<string, unknown>).data ??
      Object.values(parsed as Record<string, unknown>)[0];

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("AI returned an unexpected response format. Please try again.");
  }

  if (mode === "quiz") {
    return { mode: "quiz", data: items as QuizQuestion[] };
  } else {
    return { mode: "flashcard", data: items as FlashcardItem[] };
  }
}
