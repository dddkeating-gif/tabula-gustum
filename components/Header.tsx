import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
  onAddRecipe: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddRecipe, onExport }) => {
  return (
    <header className="bg-surface shadow-md py-4 px-8 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Tabula Gustum
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-secondary bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Export All</span>
          </button>
          <button
            onClick={onAddRecipe}
            className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-orange-600 rounded-full shadow-sm transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Recipe</span>
          </button>
        </div>
      </div>
    </header>
  );
};
