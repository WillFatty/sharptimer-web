'use client';

import React, { useState, useEffect } from 'react';

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

const RankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
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
                  className={`bg-dark px-3 py-2 rounded-lg text-sm cursor-pointer ${
                    selectedMap === map ? 'bg-blue-600' : ''
                  } hover:bg-blue-700 transition duration-300 ease-in-out`}
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