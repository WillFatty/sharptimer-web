'use client';

import React, { useState } from 'react';
import TabSelector from './TabSelector';
import PlayerTable from './PlayerTable';
import SearchBar from './SearchBar';
import Image from 'next/image';
import logo from '../assets/logo.png';
import ServerInfoDisplay from '../components/ServerInfo';

const SharpTimerPanel: React.FC = () => {
  const [showServerInfo, setShowServerInfo] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const isServerInfoEnabled = process.env.NEXT_PUBLIC_ENABLE_SERVER_INFO === 'true';

  return (
    <div className="min-h-screen bg-darker text-white pb-10">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <Image src={logo} alt="Logo" width={32} height={32} />
            SharpTimer
          </h1>
          {isServerInfoEnabled ? (
            <button
              onClick={() => setShowServerInfo(!showServerInfo)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              {showServerInfo ? 'Servers' : 'Servers'}
            </button>
          ) : (
            <div className="flex-grow"></div>
          )}
          <SearchBar initialQuery={''} />
        </div>
        {showServerInfo && isServerInfoEnabled && (
          <div className="mb-8">
            <ServerInfoDisplay onJoinServer={() => {}} />
          </div>
        )}

        <TabSelector />

        <PlayerTable />

        {showFooter && (
          <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-gray-500 text-xs p-2">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <span>SharpTimer: deafps</span>
                <span className="mx-2">|</span>
                <span>Web panel: Letaryat & 𝒲𝒾𝓁𝓁𝒾𝒶𝓂 </span>
              </div>
              <div className="truncate max-w-md">
                  A web panel to display all records and stats
              </div>
            </div>
            <button
              className="absolute top-1 right-1 text-gray-400 hover:text-white"
              onClick={() => setShowFooter(false)}
            >
              ✕
            </button>
          </footer>
        )}

        {!showFooter && (
          <button
            className="fixed bottom-4 right-4 bg-gray-800 text-gray-400 hover:text-white p-2 rounded-full"
            onClick={() => setShowFooter(true)}
          >
            ℹ️
          </button>
        )}
      </div>
    </div>
  );
};

export default SharpTimerPanel;