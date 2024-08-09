import React from 'react';

interface ServerInfoProps {
  name: string;
  ip: string;
  map: string;
  players: string;
  category: string;
}

const ServerInfo: React.FC<ServerInfoProps> = ({ name, ip, map, players, category }) => {
  return (
    <div className="bg-dark p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      <div className="text-sm text-gray-light">
        <p>{ip}</p>
        <p>Map: {map}</p>
        <p>Players: {players}</p>
        <p>Category: {category}</p>
      </div>
    </div>
  );
};

export default ServerInfo;