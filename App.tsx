import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Recipe, ParsedRecipeData } from './types';
import { getRecipes, saveRecipe, deleteRecipeById, exportRecipes } from './services/recipeService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { RecipeList } from './components/RecipeList';
import { AddRecipeModal } from './components/AddRecipeModal';
import { RecipeViewModal } from './components/RecipeViewModal';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Load recipes from Firestore on mount. Because getRecipes is async
  // we define a nested function to await the promise.
  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  const addRecipe = useCallback(async (recipeData: ParsedRecipeData) => {
    // Construct a new recipe object. The id is based on the current ISO
    // timestamp to maintain the previous deterministic ordering.
    const newRecipe: Recipe = {
      id: new Date().toISOString(),
      ...recipeData,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(recipeData.image_prompt)}/600/400`,
      createdAt: new Date().toISOString(),
    };
    // Persist to Firestore first so that other clients can see it.
    await saveRecipe(newRecipe);
    // Optimistically update local state to include the new recipe at the top.
    setRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
  }, []);

  const deleteRecipe = useCallback(async (recipeId: string) => {
    // Remove from Firestore first. Errors bubble to the console.
    await deleteRecipeById(recipeId);
    // Update local state to remove the recipe from the list.
    setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== recipeId));
  }, []);

  const filteredRecipes = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!lowercasedTerm) return recipes;

    return recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(lowercasedTerm) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm)) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(lowercasedTerm))
    );
  }, [recipes, searchTerm]);
  
  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredRecipes]);

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <Header 
        onAddRecipe={() => setIsAddModalOpen(true)} 
        onExport={exportRecipes}
      />
      <main className="container mx-auto px-8 pb-8">
        <div className="mb-8 flex justify-center">
            <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        </div>
        
        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-text-primary">Welcome to your Recipe Keeper!</h2>
            <p className="text-text-secondary mt-2">You don't have any recipes yet.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 px-6 py-2 text-white bg-primary hover:bg-orange-600 rounded-full shadow-sm transition"
            >
              Add Your First Recipe
            </button>
          </div>
        ) : (
          <RecipeList recipes={sortedRecipes} onSelectRecipe={setSelectedRecipe} />
        )}

      </main>

      {isAddModalOpen && (
        <AddRecipeModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAddRecipe={addRecipe} 
        />
      )}

      {selectedRecipe && (
        <RecipeViewModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onDelete={deleteRecipe}
        />
      )}
    </div>
  );
};

export default App;
