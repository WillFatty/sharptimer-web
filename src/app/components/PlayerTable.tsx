'use client';

import React, { useState, useEffect } from 'react';
import { RankIcon, PlayerIcon, TimeIcon, MapIcon } from '../assets/icons';

interface PlayerRecord {
  MapName: string;
  SteamID: string;
  PlayerName: string;
  TimerTicks: number;
  FormattedTime: string;
  UnixStamp: number;
  TimesFinished: number;
  LastFinished: number;
  Style: number;
  SteamAvatar: string;
}

const PlayerTable: React.FC = () => {
  const [maps, setMaps] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'surf' | 'bhop'>('surf');
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaps(selectedType);
  }, [selectedType]);

  useEffect(() => {
    if (selectedMap) {
      fetchTopPlayers(selectedMap);
    } else if (maps.length > 0) {
      const defaultMap = selectedType === 'surf' ? process.env.DEFAULT_SURF_MAP : process.env.DEFAULT_BHOP_MAP;
      const mapToSelect = maps.includes(defaultMap || '') ? defaultMap : maps[0];
      setSelectedMap(mapToSelect || '');
    }
  }, [selectedMap, maps, selectedType]);

  const fetchMaps = async (type: 'surf' | 'bhop') => {
    try {
      const response = await fetch(`/api/maps?type=${type}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mapNames = data.map((row: { MapName: string }) => row.MapName.replace(`${type}_`, ''));
      setMaps(mapNames);
      
      // Reset selected map when changing type
      setSelectedMap('');
    } catch (error) {
      console.error('Error fetching maps:', error);
      setError('Failed to fetch maps. Please try again later.');
    }
  };

  const fetchTopPlayers = async (map: string) => {
    try {
      setError(null);
      const fullMapName = `${selectedType}_${map}`;
      const response = await fetch(`/api/top-players?map=${fullMapName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching top players:', error);
      setError('Failed to fetch top players. Please try again later.');
    }
  };

  const steamProfileUrl = (steamId: string) => `https://steamcommunity.com/profiles/${steamId}`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-2 mb-4">
        <button
          className={`${selectedType === 'surf' ? 'bg-blue-600' : 'bg-dark'
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
          onClick={() => setSelectedType('surf')}
        >
          SURF
        </button>
        <button
          className={`${selectedType === 'bhop' ? 'bg-blue-600' : 'bg-dark'
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
          onClick={() => setSelectedType('bhop')}
        >
          BH
        </button>
      </div>
      <div className="flex flex-grow">
        <div className="mr-4 w-48 flex flex-col">
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-2">
              {maps.map((map, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition duration-300 ease-in-out ${
                    selectedMap === map
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark hover:bg-blue-700'
                  }`}
                  onClick={() => setSelectedMap(map)}
                >
                  {map}
                </div>
              ))}
            </div>
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {!error && (
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
                {players.map((player, index) => (
                  <tr key={index}>
                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white text-center bg-[#101219] rounded-l-lg w-1/6">
                      <span className="ml-4">{index + 1}</span>
                    </th>
                    <td className="px-6 py-4 text-center bg-[#101219] w-1/3">
                      <div className="flex items-center justify-center">
                        {player.SteamAvatar ? (
                          <img src={player.SteamAvatar} alt={`${player.PlayerName}'s avatar`} className="w-8 h-8 rounded-full mr-2" />
                        ) : (
                          <div className="w-8 h-8 rounded-full mr-2 bg-gray-600 flex items-center justify-center">
                            <span className="text-xs">{player.PlayerName.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <a
                          href={steamProfileUrl(player.SteamID)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-500 transition duration-300"
                        >
                          {player.PlayerName}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-[#101219] w-1/4">{player.FormattedTime}</td>
                    <td className="px-6 py-4 text-center bg-[#101219] rounded-r-lg w-1/4">{player.MapName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerTable;