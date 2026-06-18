import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const cleanJSON = (text: string) => {
  return text.replace(/```json\n?|```/g, "").trim();
};

export const geminiService = {
  async generateDebate(topic: string, personality1: string = "Arjun", personality2: string = "Ananya") {
    const prompt = `Debate Topic: "${topic}"
Personality 1 (${personality1}): Chaotic human from Mumbai.
Personality 2 (${personality2}): Savage human from Delhi.
Task: Generate a sharp, very short 3-round back-and-forth debate. 
CRITICAL: Keep responses punchy and brief (max 2 sentences each). No intros/outros.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              speaker: { type: Type.STRING },
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['argument', 'interruption'] }
            },
            required: ['speaker', 'text', 'type']
          }
        }
      }
    });

    try {
      return JSON.parse(cleanJSON(response.text || "[]"));
    } catch (e) {
      console.error("JSON Parse Error in Debate:", e);
      return [];
    }
  },

  async roastResume(resumeText: string, intensity: string, mode: string) {
    const prompt = `Resume Content: "${resumeText}"
Intensity: ${intensity} (Mild, Savage, Nuclear)
Mode: ${mode}
CRITICAL: Be extremely concise, brutal, and fast. NO long paragraphs. Punchy one-liners only. Brutally roast this resume. Include improvement tips.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: { type: Type.STRING },
            employabilityScore: { type: Type.NUMBER },
            linkedinCringeLevel: { type: Type.STRING },
            corporateSurvivalProbability: { type: Type.STRING },
            improvementTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['roast', 'employabilityScore', 'linkedinCringeLevel', 'improvementTips']
        }
      }
    });

    try {
      return JSON.parse(cleanJSON(response.text || "{}"));
    } catch (e) {
      console.error("JSON Parse Error in Roast:", e);
      return {};
    }
  },

  async analyzeChat(chatLogs: string, mode: string) {
    // Truncate logs for speed, but keep a decent window
    const truncatedLogs = chatLogs.slice(-4000);
    const prompt = `Logs: "${truncatedLogs}"
You are the world's most savage ${mode}. Analyze this chat and write an official "Drama Case Report".
CRITICAL INSTRUCTIONS:
1. Be HILARIOUSLY JUDGMENTAL and SAVAGE.
2. For each metric (Manipulation, Flirting, Delulu, Dryness), provide a percentage AND a substantial 3-4 sentence brutal roast "Commentary". Make these roasts creative and detailed.
3. You MUST provide at least 4 specific "Flags" for both Green and Red categories based on the text.
4. The verdict MUST be a punchy, one-sentence roast.

SCHEMA:
- manipulationLevel: Percentage string (e.g. "85%")
- manipulationComment: 3-4 sentences of brutal roasting
- flirtingProbability: Percentage string (e.g. "12%")
- flirtingComment: 3-4 sentences of brutal roasting
- deluluLevel: Percentage string (e.g. "100%")
- deluluComment: 3-4 sentences of brutal roasting
- dryTextingPercentage: Percentage string (e.g. "60%")
- dryComment: 3-4 sentences of brutal roasting
- greenFlags: Array of observations
- redFlags: Array of observations
- verdict: Final judgment roast string.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 1000,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              manipulationLevel: { type: Type.STRING },
              manipulationComment: { type: Type.STRING },
              flirtingProbability: { type: Type.STRING },
              flirtingComment: { type: Type.STRING },
              deluluLevel: { type: Type.STRING },
              deluluComment: { type: Type.STRING },
              dryTextingPercentage: { type: Type.STRING },
              dryComment: { type: Type.STRING },
              greenFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              verdict: { type: Type.STRING }
            },
            required: [
              'manipulationLevel', 'manipulationComment', 
              'flirtingProbability', 'flirtingComment', 
              'deluluLevel', 'deluluComment', 
              'dryTextingPercentage', 'dryComment', 
              'greenFlags', 'redFlags', 'verdict'
            ]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(cleanJSON(text));
    } catch (e) {
      console.error("AI Analysis Error:", e);
      // Fallback object so the UI never breaks completely
      return {
        manipulationLevel: "99%",
        manipulationComment: "Professional gaslighter detected.",
        flirtingProbability: "0%",
        flirtingComment: "Room temperature charisma.",
        deluluLevel: "MAX",
        deluluComment: "Main character syndrome in terminal stage.",
        dryTextingPercentage: "100%",
        dryComment: "Sahara desert vibes.",
        greenFlags: ["System survived the drama"],
        redFlags: ["The conversation was so toxic the AI fainted", "Data too radioactive to process"],
        verdict: "THE INVESTIGATOR HAS RECOVERED FROM A BLACKOUT. YOUR CHAT IS CLINICALLY INSANE."
      };
    }
  }
};
