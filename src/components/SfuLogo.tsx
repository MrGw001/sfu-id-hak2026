import React from 'react';

interface SfuLogoProps {
  className?: string;
  variant?: 'horizontal' | 'stacked';
  color?: 'white' | 'black' | 'orange';
  theme?: 'dark' | 'white' | 'black';
}

export const SfuLogo: React.FC<SfuLogoProps> = ({
  className = 'h-9',
  variant = 'horizontal',
  color = 'white',
}) => {
  const iconColor = color === 'white' ? '#FFFFFF' : color === 'orange' ? '#F15A24' : '#111827';
  const textColor = color === 'white' ? '#FFFFFF' : color === 'orange' ? '#F15A24' : '#111827';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Точный векторный знак СФУ по официальному брендбуку (7 узлов кристаллической структуры) */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Соединительные линии полигонального графа */}
        {/* 1. Верхний узел к правому верхнему */}
        <line x1="50" y1="13" x2="70" y2="25" stroke={iconColor} strokeWidth="5.5" strokeLinecap="round" />
        {/* 2. Правый верхний к правому нижнему */}
        <line x1="70" y1="25" x2="70" y2="49" stroke={iconColor} strokeWidth="5.5" strokeLinecap="round" />
        {/* 3. Левый верхний к левому нижнему */}
        <line x1="30" y1="25" x2="30" y2="49" stroke={iconColor} strokeWidth="5.5" strokeLinecap="round" />
        {/* 4. Левый нижний к нижнему центральному */}
        <line x1="30" y1="49" x2="50" y2="61" stroke={iconColor} strokeWidth="5.5" strokeLinecap="round" />
        {/* 5. Центральный узел к нижнему центральному */}
        <line x1="50" y1="37" x2="50" y2="61" stroke={iconColor} strokeWidth="5.5" strokeLinecap="round" />

        {/* 7 круглых узлов СФУ */}
        <circle cx="50" cy="13" r="8" fill={iconColor} />
        <circle cx="30" cy="25" r="8" fill={iconColor} />
        <circle cx="70" cy="25" r="8" fill={iconColor} />
        <circle cx="50" cy="37" r="8" fill={iconColor} />
        <circle cx="30" cy="49" r="8" fill={iconColor} />
        <circle cx="70" cy="49" r="8" fill={iconColor} />
        <circle cx="50" cy="61" r="8" fill={iconColor} />
      </svg>

      {/* Фирменная надпись шрифтом с характерной разрядкой */}
      {variant === 'horizontal' ? (
        <div className="flex flex-col tracking-[0.18em] text-[9.5px] uppercase font-bold leading-tight" style={{ color: textColor }}>
          <span>С И Б И Р С К И Й</span>
          <span>Ф Е Д Е Р А Л Ь Н Ы Й</span>
          <span>У Н И В Е Р С И Т Е Т</span>
        </div>
      ) : (
        <div className="flex flex-col tracking-[0.2em] text-[8.5px] uppercase font-bold text-center leading-tight mt-1" style={{ color: textColor }}>
          <span>СИБИРСКИЙ</span>
          <span>ФЕДЕРАЛЬНЫЙ</span>
          <span>УНИВЕРСИТЕТ</span>
        </div>
      )}
    </div>
  );
};
