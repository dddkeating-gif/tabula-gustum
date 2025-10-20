import { Recipe } from '../types';

// Firebase imports. We rely on the modular v9+ SDK so that tree shaking can
// eliminate unused code. The app is initialised once per module.
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

/*
 * Initialise Firebase using environment variables. When building with Vite
 * these variables should be defined in an `.env` file with the `VITE_`
 * prefix (e.g. VITE_FIREBASE_API_KEY). This keeps secrets out of the
 * repository and allows the front‑end to be configured without hard coding
 * keys. See the project README for details on creating this file.
 */
const firebaseConfig = {
  aapiKey: import.meta.env.VITE_FIREBASE_API_KEY,piKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Lazily initialise the Firebase app and Firestore instance. This avoids
// re‑initialising the app during hot module replacement in development.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to the top level recipes collection. All recipe documents live
// under this collection keyed by their `id` property.
const recipesCollection = collection(db, 'recipes');
/**
 * Fetch all recipes from Firestore. Documents are returned as an array of
 * Recipe objects sorted by their `createdAt` timestamp (newest first).
 */
export const getRecipes = async (): Promise<Recipe[]> => {
  const snapshot = await getDocs(recipesCollection);
  const items = snapshot.docs.map((d) => d.data() as Recipe);
  // Sort descending by createdAt to align with previous localStorage order
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Persist a single recipe to Firestore. If a document with the same id
 * already exists it will be replaced. The `id` field on the recipe is
 * used as the document key to enable deterministic identifiers across
 * devices.
 */
export const saveRecipe = async (recipe: Recipe): Promise<void> => {
  await setDoc(doc(recipesCollection, recipe.id), recipe);
};

/**
 * Remove a recipe by its id. If the document does not exist the operation
 * silently succeeds.
 */
export const deleteRecipeById = async (recipeId: string): Promise<void> => {
  await deleteDoc(doc(recipesCollection, recipeId));
};

/**
 * Export all recipes as a JSON file. This function fetches the latest
 * documents from Firestore and triggers a download in the browser. It
 * mirrors the previous behaviour when recipes were stored in localStorage.
 */
export const exportRecipes = async (): Promise<void> => {
  const recipes = await getRecipes();
  const dataStr = JSON.stringify(recipes, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'recipes.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
