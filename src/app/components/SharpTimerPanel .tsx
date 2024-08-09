import React from 'react';
import ServerInfo from './ServerInfo';
import TabSelector from './TabSelector';
import PlayerTable from './PlayerTable';
import SearchBar from './SearchBar';
import { servers } from '@/config/servers';

const SharpTimerPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-darker text-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <img src="" alt="" className="h-8 mr-2" />
          </h1>
          <SearchBar initialQuery={''} />
        </div>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {servers.map((server) => (
            <ServerInfo
              key={`${server.host}:${server.port}`}
              name={server.name}
              ip={`${server.host}:${server.port}`}
              map="Unknown" // You might want to fetch this information dynamically
              players="0 / 0" // You might want to fetch this information dynamically
              category={server.category}
            />
          ))}
        </div> */}
    
        <TabSelector />
        <PlayerTable />
        
        {/* <footer className="mt-8 text-sm text-gray-500">
          <p>SharpTimer: deafps</p>
          <p>Web panel: Letaryat</p>
          <p>Litwo! Ojczyzno moja! ty jesteś jak zdrowie; Ile cię trzeba cenić, ten tylko się dowie, Kto cię stracił. Dziś piękność twą w całej ozdobie Widzę i opisuję, bo tęsknię po tobie.</p>
        </footer> */}
      </div>
    </div>
  );
};

export default SharpTimerPanel;