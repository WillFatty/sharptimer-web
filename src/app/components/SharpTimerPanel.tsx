'use client';

import React, { useState } from 'react';
import TabSelector from './TabSelector';
import PlayerTable from './PlayerTable';
import SearchBar from './SearchBar';
import Image from 'next/image';
import logo from '../assets/logo.png';

const SharpTimerPanel: React.FC = () => {
  const [showFooter, setShowFooter] = useState(true);

  return (
    <div className="min-h-screen bg-darker text-white pb-10">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <Image src={logo} alt="Logo" width={32} height={32} className="mr-2" />
            SharpTimer
          </h1>
          <SearchBar initialQuery={''} />
        </div>

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