import React from 'react';

const StatsCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl shadow-md ${bgColor}`}>
      <div className="text-gray-700 p-3 rounded-full bg-white/10">{icon}</div>
      <div>
        <p className="text-gray-700 font-medium text-sm">{title}</p>
        <h3 className="text-gray-700 font-bold text-xl">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
