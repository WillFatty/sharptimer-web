'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface SearchBarProps {
  initialQuery: string;
  onSearch?: (searchQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch?.(searchTerm);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search by Nickname or SteamID64"
        className="bg-gray-800 px-4 py-2 rounded-full w-64 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;