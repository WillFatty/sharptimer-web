'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchResults from '../components/SearchResults';
import SearchBar, { SearchBarProps } from '../components/SearchBar';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const handleSearch = (searchQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          ← Back to Home
        </Link>
        <SearchBar initialQuery={query} onSearch={handleSearch} />
      </div>
      <h1 className="text-2xl font-bold my-4">Search Results for "{query}"</h1>
      <SearchResults query={query} />
    </div>
  );
};

export default SearchPage;