import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system/legacy';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY!; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const scanImageWithGemini = async (uri: string) => {
  try {
    const base64Photo = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

   
   const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
    });

    const prompt = "Act as a fridge inventory assistant, List all food items or groceries visible in this image. For each item, provide: 1. name, 2. qty (estimate if needed), 3. days (estimated shelf life left). Return ONLY a JSON array. If nothing found, return an empty array []. Format: [{\"name\": \"Apple\", \"qty\": \"2 pieces\", \"expiry\": \"5 days\"}]";
    const image = {
      inlineData: {
        data: base64Photo,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const text = result.response.text();
    
    console.log("Success! AI Response:", text);

    const jsonMatch = text.match(/\[.*\]/s); 
if (jsonMatch) {
  const cleanJson = JSON.parse(jsonMatch[0]);
  return cleanJson;
}

  } catch (error: any) {
    console.error("Gemini Error Details:", error.message);
    if (error.message.includes("404")) {
      console.log("Tip: Your API Key might not have access to this specific model yet.");
    }
    return null;
  }
};