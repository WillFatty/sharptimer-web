'use client';

import React, { useState, useEffect } from 'react';
import { ServerConfig, servers } from '@/app/configs/servers';

interface ServerInfo {
  map: string;
  playerCount: number;
  botCount: number;
  players: string[];
}

interface ServerInfoMap {
  [serverName: string]: ServerInfo;
}

interface ServerInfoDisplayProps {
  onJoinServer: (server: ServerConfig) => void;
}

const ServerInfoDisplay: React.FC<ServerInfoDisplayProps> = ({ onJoinServer }) => {
  const [serverInfo, setServerInfo] = useState<ServerInfoMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const response = await fetch('/api/serverInfo');
        if (!response.ok) throw new Error('Failed to fetch server info');
        const data = await response.json();
        setServerInfo(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching server info. Please try again later.');
        setLoading(false);
      }
    };

    fetchServerInfo();
    const interval = setInterval(fetchServerInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinServer = (server: ServerConfig) => {
    const steamConnectUrl = `steam://connect/${server.host}:${server.port}`;
    window.location.href = steamConnectUrl;
    onJoinServer(server);
  };

  if (loading) return <div className="text-center text-sm">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-sm">{error}</div>;

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap justify-center gap-4 max-w-6xl">
        {servers.map((server: ServerConfig) => {
          const info = serverInfo[server.name] || {
            map: 'Unknown',
            playerCount: 0,
            botCount: 0,
            players: [],
          };

          const isOnline = info.map !== 'Error';

          return (
            <div key={server.name} className="bg-[#1E2028] p-3 rounded-md shadow-md text-xs w-64 relative">
              <div className="flex items-center mb-2">
                <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h2 className="text-sm font-bold truncate flex-grow">{server.name}</h2>
              </div>
              <p className="text-blue-400 text-xs mb-1">Type: {server.type}</p>
              <p className="truncate mb-1">Map: {info.map}</p>
              <p className="mb-1">Players: {info.playerCount} (Bots: {info.botCount})</p>
              {info.players.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs">Player List</summary>
                  <ul className="list-disc list-inside pl-2 mt-1">
                    {info.players.map((player, index) => (
                      <li key={index} className="truncate">{player}</li>
                    ))}
                  </ul>
                </details>
              )}
              <button
                onClick={() => handleJoinServer(server)}
                className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
              >
                Join
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServerInfoDisplay;