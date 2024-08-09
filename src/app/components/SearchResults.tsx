'use client';

import React, { useState, useEffect } from 'react';

interface SearchResult {
  SteamID: string;
  PlayerName: string;
  FormattedTime: string;
  MapName: string;
  Rank: number;
}

interface SearchResultsProps {
  query: string | null;
}

const RankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const PlayerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

const TimeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
  </svg>
);

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'surf' | 'bhop'>('surf');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${selectedType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResults(data.filter((result: SearchResult) => result.MapName.startsWith(selectedType)));
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedType]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2 mb-4">
        <button
          className={`${
            selectedType === 'surf' ? 'bg-blue-600' : 'bg-dark'
          } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
          onClick={() => setSelectedType('surf')}
        >
          SURF
        </button>
        <button
          className={`${
            selectedType === 'bhop' ? 'bg-blue-600' : 'bg-dark'
          } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
          onClick={() => setSelectedType('bhop')}
        >
          BHOP
        </button>
      </div>
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-sm text-left text-gray-300 border-separate border-spacing-y-2">
          <thead className="text-xs uppercase text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 bg-[#101219] rounded-l-lg w-1/6">
                <div className="flex items-center justify-center ml-4 text-blue-500">
                  <RankIcon />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 bg-[#101219] w-1/3">
                <div className="flex items-center justify-center text-blue-500">
                  <PlayerIcon />
                  <span className="ml-2">Player</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 bg-[#101219] w-1/4">
                <div className="flex items-center justify-center text-blue-500">
                  <TimeIcon />
                  <span className="ml-2">Time</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 bg-[#101219] rounded-r-lg w-1/4">
                <div className="flex items-center justify-center text-blue-500">
                  <MapIcon />
                  <span className="ml-2">Map</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white text-center bg-[#101219] rounded-l-lg w-1/6">
                  <span className="ml-4">#{result.Rank}</span>
                </th>
                <td className="px-6 py-4 text-center bg-[#101219] w-1/3">{result.PlayerName}</td>
                <td className="px-6 py-4 text-center bg-[#101219] w-1/4">{result.FormattedTime}</td>
                <td className="px-6 py-4 text-center bg-[#101219] rounded-r-lg w-1/4">{result.MapName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchResults;