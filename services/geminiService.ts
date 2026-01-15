
import { GoogleGenAI } from "@google/genai";

/**
 * Service to handle image editing using Gemini 2.5 Flash Image
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1], // Strip the data:image/png;base64, prefix
            mimeType: mimeType,
          },
        },
        {
          text: prompt
        },
      ],
    },
  });

  // Iterate through parts to find the generated image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image was returned from the model. Try a different prompt.");
};
