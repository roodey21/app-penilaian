import React from 'react';
import { Search } from 'lucide-react';
import Input from '../ui/Input';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default SearchBar;
