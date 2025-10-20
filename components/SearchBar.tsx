import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search recipes by name, tag, or ingredient..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-primary focus:border-primary transition"
      />
    </div>
  );
};
