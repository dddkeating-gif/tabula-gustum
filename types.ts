export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  imageUrl: string;
  createdAt: string;
}

// Data structure returned from Gemini
export interface ParsedRecipeData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  image_prompt: string;
}
