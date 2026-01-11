import { GoogleGenAI } from "@google/genai";
import { BIRTHDAY_NAME } from "../constants";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const generateBirthdayQuote = async (): Promise<string> => {
  const ai = getClient();
  
  // Simulation/Fallback logic if API key is missing
  if (!ai) {
    console.warn("API Key missing, simulating API response time...");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay
    throw new Error("API_KEY_MISSING");
  }

  try {
    const modelId = 'gemini-3-flash-preview'; 
    const prompt = `Write a short, witty, and warm happy birthday quote for someone named ${BIRTHDAY_NAME}. 
    The style should be modern, tech-savvy, and celebratory. 
    Keep it under 30 words. Do not use hashtags.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text?.trim() || "Happy Birthday! Enjoy your day!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
