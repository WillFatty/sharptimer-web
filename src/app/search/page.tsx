'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchResults from '../components/SearchResults';
import SearchBar, { SearchBarProps } from '../components/SearchBar';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          ← Back to Home
        </Link>
        <SearchBar initialQuery={query} />
      </div>
      {query ? (
        <p>Search for &quot;{query}&quot;</p>
      ) : (
        <p>No search query provided</p>
      )}
      <SearchResults query={query} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}