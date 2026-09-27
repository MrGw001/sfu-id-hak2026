import React from 'react';

interface SfuLogoProps {
  className?: string;
  theme?: 'dark' | 'white';
}

export const SfuLogo: React.FC<SfuLogoProps> = ({ className = 'h-8', theme = 'white' }) => {
  const isWhite = theme === 'white';
  const textColor = isWhite ? '#FFFFFF' : '#111827';
  const dividerColor = isWhite ? 'rgba(255,255,255,0.7)' : '#111827';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Точный оранжевый химический полигональный знак СФУ из 7 узлов */}
      <svg
        width="40"
        height="36"
        viewBox="0 0 110 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Соединительные линии полигонального знака */}
        <line x1="20" y1="46" x2="20" y2="70" stroke="#EB4F26" strokeWidth="8" strokeLinecap="round" />
        <line x1="20" y1="70" x2="52" y2="88" stroke="#EB4F26" strokeWidth="8" strokeLinecap="round" />
        <line x1="52" y1="20" x2="84" y2="38" stroke="#EB4F26" strokeWidth="8" strokeLinecap="round" />
        <line x1="84" y1="38" x2="84" y2="62" stroke="#EB4F26" strokeWidth="8" strokeLinecap="round" />
        <line x1="52" y1="52" x2="52" y2="70" stroke="#EB4F26" strokeWidth="8" strokeLinecap="round" />

        {/* 7 круглых узлов-атомов */}
        <circle cx="20" cy="42" r="13" fill="#EB4F26" />
        <circle cx="20" cy="72" r="13" fill="#EB4F26" />
        <circle cx="52" cy="20" r="13" fill="#EB4F26" />
        <circle cx="52" cy="52" r="13" fill="#EB4F26" />
        <circle cx="52" cy="88" r="13" fill="#EB4F26" />
        <circle cx="84" cy="38" r="13" fill="#EB4F26" />
        <circle cx="84" cy="68" r="13" fill="#EB4F26" />
      </svg>

      {/* Официальное текстовое начертание СИБИРСКИЙ ФЕДЕРАЛЬНЫЙ УНИВЕРСИТЕТ | SIBERIAN FEDERAL UNIVERSITY */}
      <div className="flex items-center gap-3 tracking-widest text-[9px] uppercase font-bold leading-tight">
        <div style={{ color: textColor }} className="flex flex-col">
          <span>С И Б И Р С К И Й</span>
          <span>Ф Е Д Е Р А Л Ь Н Ы Й</span>
          <span>У Н И В Е Р С И Т Е Т</span>
        </div>
        <div style={{ backgroundColor: dividerColor }} className="w-[1.5px] h-7 self-center" />
        <div style={{ color: textColor }} className="flex flex-col tracking-wider font-semibold opacity-95">
          <span>SIBERIAN</span>
          <span>FEDERAL</span>
          <span>UNIVERSITY</span>
        </div>
      </div>
    </div>
  );
};
