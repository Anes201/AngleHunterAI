import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MARKETING_PROMPT } from "../constants";
import { MarketingAnalysis } from "../types";

const angleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The name of the marketing angle." },
    whyItWorks: { type: Type.STRING, description: "Explanation of why this angle is effective." },
    coreBenefits: { type: Type.STRING, description: "Core benefits and emotional triggers." },
    hooks: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of 3-7 high-converting ad hooks or headlines." 
    },
    tagline: { type: Type.STRING, description: "A punchy tagline for this angle." },
    targetAudience: { type: Type.STRING, description: "The ideal target audience for this angle." },
    visuals: { type: Type.STRING, description: "Suggested ad visuals or creative direction." },
    platforms: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Recommended platforms for this angle." 
    },
    shortVersion: { type: Type.STRING, description: "A condensed version of the angle." },
  },
  required: ["title", "whyItWorks", "coreBenefits", "hooks", "tagline", "targetAudience", "visuals", "platforms", "shortVersion"],
};

const categorySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    categoryName: { type: Type.STRING, description: "The name of the category (e.g., Problem/Solution)." },
    angles: { 
      type: Type.ARRAY, 
      items: angleSchema,
      description: "List of angles within this category."
    },
  },
  required: ["categoryName", "angles"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productSummary: { type: Type.STRING, description: "A brief professional summary of the analyzed product." },
    categories: { 
      type: Type.ARRAY, 
      items: categorySchema,
      description: "All the marketing categories and their respective angles."
    },
  },
  required: ["productSummary", "categories"],
};

export const analyzeImage = async (base64Image: string): Promise<MarketingAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract mime type if present, default to jpeg
  const mimeTypeMatch = base64Image.match(/^data:([^;]+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";

  // Clean base64 string by removing the data URL prefix
  const cleanBase64 = base64Image.replace(/^data:([^;]+);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64
              }
            },
            {
              text: MARKETING_PROMPT
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert Chief Marketing Officer and Creative Strategist for a top-tier DTC brand. Your output must be highly actionable, creative, and professional.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response received from Gemini.");
    
    return JSON.parse(text) as MarketingAnalysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};