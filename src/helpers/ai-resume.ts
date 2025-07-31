import { GoogleGenAI } from "@google/genai";
import { getSecret } from "../clients/secret-manager.js";
import config from "../config/environment.js"

async function initGoogleGenAIClient() {
  const geminiApikey = await getSecret(config.googleProjectNumber, config.geminiApiKey);
  const ai = new GoogleGenAI({ apiKey: geminiApikey });
  if (!ai) {
    throw new Error("Failed to initialize GoogleGenAI client");
  }

  return ai;
}

export async function aiResume(transcription: string) {
  const ai = await initGoogleGenAIClient();

  const prompt = `Quiero que resumas la siguiente transcripción de voz en una
    lista de los puntos abordados mas importantes y separarlo en secciones si
    se toca mas de un tema, aquí está la transcripción: "${transcription}".`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}
