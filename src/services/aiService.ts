import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * @param base64Data 
 */
export const scanImageWithGemini = async (base64Data: string) => {
  try {
   
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    const prompt = `Act as a fridge inventory assistant. List all food items visible in this image. 
    Return ONLY a JSON array with this exact structure: [{"name": "item", "qty": "amount", "expiry": "days left"}].
    If no food items are found, return []. 
    Do not include any text or markdown formatting before or after the JSON.`;

    const image = {
      inlineData: {
        data: base64Data, 
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const text = await result.response.text();

    console.log("AI Response Raw:", text);

 
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const cleanJson = JSON.parse(jsonMatch[0]);
      return cleanJson;
    }

    return [];

  } catch (error: any) {
    console.error("Gemini Error Details:", error.message);
    return null;
  }
};

export const generateRecipesWithAI = async (inventoryItems: string[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `I have the following ingredients in my fridge: ${inventoryItems.join(", ")}. 
    Suggest 3 delicious recipes I can make with these. 
    Return ONLY a JSON array. Structure:
    [{
      "title": "Recipe Name",
      "ingredients": [{"name": "Item1", "qty": "1 cup"}, {"name": "Item2", "qty": "200g"}],
      "instructions": "Step by step...",
      "time": "20 min",
      "match": "90%",
      "color": "#FF5733"
    }]`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    const jsonMatch = text.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error("Recipe AI Error:", error);
    return [];
  }
};