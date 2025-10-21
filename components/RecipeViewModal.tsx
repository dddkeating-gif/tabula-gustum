import React from 'react';
import { Recipe } from '../types';
impport { XIcon } from './icons/XIcon';
  recipe: Recipe | null;
  onClose: () => void;
  onDelete: (recipeId: string) => void;
}

export const RecipeViewModal: React.FC<RecipeViewModalProps> = ({ recipe, onClose, onDelete }) => {
  if (!recipe) return null;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      onDelete(recipe.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-surface px-6 pt-6 pb-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-text-primary">{recipe.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6">
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-6"/>
          
          <div className="mb-4">
              {recipe.tags.map(tag => (
                  <span key={tag} className="inline-block bg-secondary bg-opacity-20 text-secondary-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                      {tag}
                  </span>
              ))}
          </div>

          <p className="text-text-secondary mb-6">{recipe.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold text-text-primary mb-3 border-b-2 border-primary pb-2">Ingredients</h3>
              <ul className="list-disc list-inside space-y-2 text-text-secondary">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-text-primary mb-3 border-b-2 border-primary pb-2">Instructions</h3>
              <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-surface px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Delete Recipe
            </button>
        </div>
      </div>
    </div>
  );
};
