
import React from 'react';
import { Team, TEAM_COLORS } from '../types';

export const PlayerCarSVG = () => (
  <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-lg transform transition-transform duration-100">
    <path d="M30,180 L30,160 L20,160 L20,130 L30,130 L35,60 L20,40 L80,40 L65,60 L70,130 L80,130 L80,160 L70,160 L70,180 Z" fill="#FF8000" />
    <rect x="42" y="80" width="16" height="20" fill="#111" rx="5" />
    <rect x="20" y="40" width="60" height="10" fill="#000" />
    <rect x="25" y="160" width="50" height="10" fill="#000" />
    <circle cx="20" cy="50" r="8" fill="#333" />
    <circle cx="80" cy="50" r="8" fill="#333" />
    <circle cx="20" cy="145" r="10" fill="#333" />
    <circle cx="80" cy="145" r="10" fill="#333" />
    <text x="50" y="110" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">81</text>
  </svg>
);

export const EnemyCarSVG: React.FC<{ team?: Team }> = ({ team = Team.FER }) => {
    const colors = TEAM_COLORS[team];
    return (
        <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-md">
            <path d="M30,180 L30,160 L20,160 L20,130 L30,130 L35,60 L20,40 L80,40 L65,60 L70,130 L80,130 L80,160 L70,160 L70,180 Z" fill={colors.body} />
            <path d="M45,40 L55,40 L55,180 L45,180 Z" fill={colors.accent} opacity="0.8" />
            <rect x="42" y="80" width="16" height="20" fill="#111" rx="5" />
            <rect x="20" y="40" width="60" height="10" fill="#000" />
            <rect x="25" y="160" width="50" height="10" fill="#000" />
            <circle cx="20" cy="50" r="8" fill="#333" />
            <circle cx="80" cy="50" r="8" fill="#333" />
            <circle cx="20" cy="145" r="10" fill="#333" />
            <circle cx="80" cy="145" r="10" fill="#333" />
        </svg>
    );
};

export const TrophySVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg animate-pulse">
    <path d="M20,30 Q20,10 50,10 Q80,10 80,30 L70,70 L50,90 L30,70 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
    <rect x="35" y="90" width="30" height="10" fill="#8B4513" />
    <path d="M20,30 L10,40 L20,50" fill="none" stroke="#FFD700" strokeWidth="3" />
    <path d="M80,30 L90,40 L80,50" fill="none" stroke="#FFD700" strokeWidth="3" />
  </svg>
);

export const PuddleSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
    <path d="M20,50 Q10,20 50,20 Q90,20 80,50 Q90,80 50,80 Q10,80 20,50 Z" fill="#4FC3F7" stroke="#0288D1" strokeWidth="2" />
    <circle cx="30" cy="40" r="5" fill="white" opacity="0.5" />
    <circle cx="60" cy="60" r="3" fill="white" opacity="0.5" />
  </svg>
);

export const WrenchSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg filter drop-shadow-lg">
    <path d="M30,10 L40,10 L40,60 L60,60 L60,10 L70,10 L70,30 L80,30 L80,50 L70,50 L70,90 L30,90 L30,50 L20,50 L20,30 L30,30 Z" fill="#E0E0E0" stroke="#757575" strokeWidth="2" transform="rotate(45, 50, 50)" />
    <rect x="40" y="30" width="20" height="40" fill="#EF5350" transform="rotate(45, 50, 50)"/>
  </svg>
);

export const HeartSVG: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 24 24" className={`w-8 h-8 ${filled ? 'text-red-600 filter drop-shadow-md' : 'text-gray-800 opacity-50'}`}>
    <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const HUDTrophySVG: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg viewBox="0 0 100 100" className={`w-6 h-6 md:w-8 md:h-8 transition-all ${filled ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]' : 'opacity-30 grayscale scale-90'}`}>
      <path d="M20,30 Q20,10 50,10 Q80,10 80,30 L70,70 L50,90 L30,70 Z" fill={filled ? "#FFD700" : "#555"} stroke={filled ? "#B8860B" : "#333"} strokeWidth="2" />
    </svg>
);
