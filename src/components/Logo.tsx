import React from 'react';

export const LogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="100" height="100" fill="#2563EB" />
    <rect x="25" y="25" width="50" height="50" fill="#07090F" />
    <rect x="65" y="65" width="20" height="20" fill="#06B6D4" />
  </svg>
);

export const Logo = () => (
  <div className="flex items-center gap-3 select-none">
    <LogoIcon />
    <span className="text-xl font-bold tracking-widest uppercase text-white font-display">Quorik</span>
  </div>
);
