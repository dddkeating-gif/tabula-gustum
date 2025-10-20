import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div
      className="bg-surface rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 group"
      onClick={onClick}
    >
      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        <p className="text-sm text-text-secondary truncate mt-1">{recipe.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
