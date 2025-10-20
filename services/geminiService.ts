import { GoogleGenAI, Type } from "@google/genai";
import { ParsedRecipeData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The title of the recipe." },
    description: { type: Type.STRING, description: "A brief, one or two-sentence summary of the dish." },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of all ingredients with quantities. Each ingredient should be a separate string in the array."
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The step-by-step instructions for preparing the dish. Each step should be a separate string in the array."
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 relevant tags, such as 'vegan', 'gluten-free', 'dinner', 'quick', 'dessert', 'keto'. Use lowercase."
    },
    image_prompt: {
        type: Type.STRING,
        description: "A short, visually descriptive phrase for a placeholder image of the final dish, e.g., 'a steaming bowl of homemade chicken noodle soup'."
    }
  },
  required: ['title', 'description', 'ingredients', 'instructions', 'tags', 'image_prompt']
};

const basePrompt = `You are an expert recipe parsing AI. Your task is to extract recipe information from the provided content and format it as a JSON object that adheres to the provided schema. Do not include any markdown formatting in your JSON output.`;

export const extractRecipeFromText = async (text: string): Promise<ParsedRecipeData> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${basePrompt}\n\nHere is the recipe content:\n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
    },
  });

  try {
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ParsedRecipeData;
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};

const fileToGenerativePart = (file: File) => {
  return new Promise<{inlineData: {data: string, mimeType: string}}>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

export const extractRecipeFromImage = async (imageFile: File): Promise<ParsedRecipeData> => {
  const imagePart = await fileToGenerativePart(imageFile);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [
      { text: `${basePrompt}\n\nTranscribe the text from this image and extract the recipe information.` },
      imagePart
    ]},
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
    },
  });

  try {
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as ParsedRecipeData;
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};
