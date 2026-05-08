import { type SavedIdea } from "@/contexts/AppStateContext";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const FREE_MODELS = [
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3n-e2b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "meta-llama/llama-3-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "openrouter/auto", 
];

async function callAI(
  systemPrompt: string, 
  userPrompt: string, 
  onStatus?: (status: string) => void,
  lang: string = "en"
): Promise<string> {
  let lastError = "";
  const isRu = lang === "ru";

  onStatus?.(isRu ? "Инициализация AI..." : "Initializing AI...");

  for (const model of FREE_MODELS) {
    try {
      const modelName = model.split("/").pop()?.split(":")[0] || model;
      onStatus?.(isRu ? "Подключение к ИИ-сервису..." : "Connecting to AI service...");
      
      console.log(`Trying model: ${model}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // Slightly shorter timeout for faster cycling

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Ethereal Think",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { 
              role: "user", 
              content: `Instruction: ${systemPrompt}\n\nInput: ${userPrompt}` 
            },
          ],
          temperature: 0.8,
          max_tokens: 2048,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 429) {
        onStatus?.(isRu ? "Переключение на резервный канал..." : "Switching to backup channel...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (res.status === 404 || res.status >= 500) {
        lastError = `Status ${res.status}`;
        continue; 
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`AI API error: ${res.status} — ${err}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        onStatus?.(isRu ? "Финальная обработка..." : "Finalizing response...");
        return content;
      }
      
    } catch (e: any) {
      console.error(`Error with model ${model}:`, e);
      lastError = e.name === 'AbortError' ? (isRu ? 'Тайм-аут' : 'Timeout') : e.message;
    }
  }

  throw new Error(isRu 
    ? `Все ИИ-сервисы сейчас перегружены. Пожалуйста, попробуйте через минуту.`
    : `All AI services are currently under heavy load. Please try again in a minute.`);
}

export async function generateIdeas(
  topic: string, 
  lang: string, 
  onStatus?: (msg: string) => void
): Promise<SavedIdea[]> {
  const systemPrompt = `You are a creative startup idea generator. Generate exactly 5 unique, innovative project ideas based on the user's topic. 
  Respond ONLY with a JSON array of objects. Each object MUST have:
  - "title": A catchy name for the project.
  - "description": A detailed one-line description (about 20-30 words).
  - "category": A broad industry (e.g., "Технологии", "Экология", "Образование").
  - "tag": A specific niche (e.g., "AI & Art", "Green Tech", "VR Learning").
  - "icon": A Lucide icon name that fits the project (e.g., "Lightbulb", "Leaf", "Cpu", "GraduationCap", "Globe", "Music", "Camera", "Zap").
  
  Respond in the language with code "${lang}". 
  The response must be valid JSON and nothing else.`;

  const result = await callAI(systemPrompt, topic, onStatus, lang);
  try {
    const cleanResult = result.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanResult);
    return parsed.map((idea: any) => ({
      ...idea,
      id: crypto.randomUUID(),
      topic,
      savedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.error("Failed to parse AI response:", result);
    throw new Error(lang === "ru" ? "ИИ вернул неверный формат. Попробуйте еще раз." : "AI returned invalid format. Please try again.");
  }
}

export async function generatePlan(
  idea: string, 
  lang: string,
  onStatus?: (msg: string) => void
): Promise<StructuredPlan> {
  const isRu = lang === "ru";
  const systemPrompt = `You are a startup strategy consultant. Create a detailed step-by-step implementation plan for the user's project idea.
  Respond ONLY with a JSON object. The object MUST have:
  - "projectTitle": A clear, professional title for the project based on the idea.
  - "steps": An array of exactly 5-6 steps (phases). Each step MUST have:
    - "number": The step number (integer).
    - "title": A short, impactful title for the phase.
    - "status": One of: "active" (use for the first step), "upcoming" (for others).
    - "description": A concise description of the objective for this phase (about 20-30 words).
    - "tags": An array of 2-3 relevant industry tags for this specific phase (e.g. "Software", "Hardware", "Marketing").
    - "substeps": An array of 3-4 specific actionable sub-steps. Each sub-step has:
      - "id": The hierarchical id (e.g., "1.1", "1.2").
      - "text": The task description.
  
  Respond in the language with code "${lang}". 
  The response must be valid JSON and nothing else.`;

  const result = await callAI(systemPrompt, idea, onStatus, lang);
  try {
    const cleanResult = result.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanResult);
  } catch (e) {
    console.error("Failed to parse AI response:", result);
    throw new Error(isRu ? "ИИ вернул неверный формат плана. Попробуйте еще раз." : "AI returned invalid plan format. Please try again.");
  }
}

// Random muse topics for "Muse of the Week"
const museTopics = [
  "Биофильный урбанизм в нео-минималистичных пространствах",
  "AI-driven sustainable architecture",
  "Gamification of daily productivity",
  "Decentralized social media platforms",
  "Neural interfaces for creative expression",
  "Zero-waste supply chain innovation",
  "Immersive education through VR/AR",
  "Community-driven urban farming",
  "Blockchain for transparent governance",
  "Adaptive wellness technology",
];

export function getMuseOfWeek(): string {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return museTopics[weekNumber % museTopics.length];
}
