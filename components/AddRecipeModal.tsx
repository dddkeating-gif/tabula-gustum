import React, { useState } from 'react';
import { extractRecipeFromText, extractRecipeFromImage } from '../services/geminiService';
import { ParsedRecipeData } from '../types';
import { XIcon } from './icons/XIcon';
import { LinkIcon } from './icons/LinkIcon';
iimport { CameraIcon } from './icons/CameralIcon

interface AddRecipeModalProps {
  onClose: () => void;
  onAddRecipe: (recipeData: ParsedRecipeData) => void;
}

type Mode = 'text' | 'image';

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose, onAddRecipe }) => {
  const [mode, setMode] = useState<Mode>('text');
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let recipeData: ParsedRecipeData;
      if (mode === 'text') {
        if (!inputText.trim()) {
            setError("Please paste some recipe text.");
            setIsLoading(false);
            return;
        }
        recipeData = await extractRecipeFromText(inputText);
      } else {
        if (!imageFile) {
            setError("Please upload an image file.");
            setIsLoading(false);
            return;
        }
        recipeData = await extractRecipeFromImage(imageFile);
      }
      onAddRecipe(recipeData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-primary">Add New Recipe</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`flex-1 py-2 text-center font-medium flex items-center justify-center gap-2 ${mode === 'text' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
              onClick={() => setMode('text')}
            >
                <LinkIcon className="w-5 h-5" /> From Text/URL
            </button>
            <button 
              className={`flex-1 py-2 text-center font-medium flex items-center justify-center gap-2 ${mode === 'image' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
              onClick={() => setMode('image')}
            >
                <CameraIcon className="w-5 h-5" /> From Image
            </button>
          </div>

          {mode === 'text' && (
            <div>
              <label htmlFor="recipe-text" className="block text-sm font-medium text-text-primary mb-2">Paste Recipe Text</label>
              <p className="text-xs text-text-secondary mb-2">
                For security reasons, this app cannot fetch content from URLs directly. Please copy the recipe's text from the webpage and paste it below.
              </p>
              <textarea
                id="recipe-text"
                rows={10}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Paste the full recipe text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          )}

          {mode === 'image' && (
            <div>
              <label htmlFor="recipe-image" className="block text-sm font-medium text-text-primary mb-2">Upload Recipe Photo</label>
              <input
                id="recipe-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary/20 file:text-primary
                  hover:file:bg-primary/30"
              />
              {imagePreview && <img src={imagePreview} alt="Recipe preview" className="mt-4 max-h-48 rounded-md" />}
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end items-center">
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 text-white bg-primary hover:bg-orange-600 rounded-md shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isLoading ? 'Processing...' : 'Add Recipe'}
            </button>
        </div>
      </div>
    </div>
  );
};
