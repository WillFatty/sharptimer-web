'use client';

import React, { useState, useEffect } from 'react';
import { RankIcon, PlayerIcon, TimeIcon, MapIcon } from '../assets/icons';

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

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'surf' | 'bhop'>('surf');
  const [avatars, setAvatars] = useState<Record<string, string>>({});

  const fetchAvatars = async (steamIDs: string[]) => {
    try {
      const response = await fetch(`/api/steam-avatar?steamids=${steamIDs.join(',')}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAvatars(prevAvatars => ({ ...prevAvatars, ...data }));
    } catch (error) {
      console.error('Error fetching Steam avatars:', error);
    }
  };

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
        const filteredResults = data.filter((result: SearchResult) => result.MapName.startsWith(selectedType));
        setResults(filteredResults);

        // Fetch avatars for the results
        const steamIDs = filteredResults.map((result: SearchResult) => result.SteamID);
        fetchAvatars(steamIDs);
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
                <td className="px-6 py-4 text-center bg-[#101219] w-1/3">
                  <div className="flex items-center justify-center">
                    <img src={avatars[result.SteamID] || '/default-avatar.png'} alt={`${result.PlayerName}'s avatar`} className="w-8 h-8 rounded-full mr-2" />
                    <a
                      href={`https://steamcommunity.com/profiles/${result.SteamID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 transition-colors duration-200"
                    >
                      {result.PlayerName}
                    </a>
                  </div>
                </td>
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