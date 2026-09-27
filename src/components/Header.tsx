import React from 'react';
import { SfuLogo } from './SfuLogo';
import { NotificationBell } from './NotificationBell';
import { UserProfile } from '../types';
import { LogIn, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onOpenLogin: () => void;
  onNavigateTab?: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenLogin,
  onNavigateTab,
  isDark,
  onToggleTheme,
}) => {
  // Гарантируем, что группа всегда КИ, а не КИИ
  const safeGroup = (currentUser.group || 'КИ26-02/3Б').replace(/КИИ/g, 'КИ');

  return (
    /* Официальная оранжевая верхушка СФУ (#F15A24) со строгим прямоугольным дизайном */
    <header className="bg-[#F15A24] text-white border-b border-[#d84a18] shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Официальный новый логотип СФУ (белый на оранжевом фоне) */}
          <div 
            className="flex items-center gap-4 cursor-pointer hover:opacity-95 transition-opacity" 
            onClick={() => onNavigateTab && onNavigateTab('schedule')}
          >
            <SfuLogo className="h-9" variant="horizontal" color="white" />
          </div>

          {/* Правая часть: колокольчик, переключатель темы, профиль и кнопка входа */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Колокольчик уведомлений */}
            <NotificationBell currentUser={currentUser} onNavigateTab={onNavigateTab} isDark={isDark} />

            {/* Переключатель темы (Светлая / Черная) с квадратными углами */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-none bg-black/15 hover:bg-black/25 text-white transition-colors flex items-center justify-center border border-white/20"
              title={isDark ? 'Включить светлую тему' : 'Включить черную тему'}
              aria-label="Смена темы"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-white hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Разделитель */}
            <div className="w-[1px] h-6 bg-white/25 hidden sm:block" />

            {/* Данные текущего пользователя */}
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold leading-tight text-white">
                {currentUser.fullName}
              </div>
              <div className="text-[11px] text-white/90 font-medium">
                {currentUser.role === 'student' && `Студент (гр. ${safeGroup})`}
                {currentUser.role === 'headman' && `Староста (гр. ${safeGroup})`}
                {currentUser.role === 'teacher' && 'Преподаватель ИКИТ'}
                {' • '}
                <span className="font-mono text-white font-semibold">№ {currentUser.studentCardNumber}</span>
              </div>
            </div>

            {/* Кнопка смены учетной записи (строгие квадратные углы) */}
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 text-xs font-bold text-white bg-black/20 hover:bg-black/30 border border-white/30 rounded-none flex items-center gap-1.5 transition-colors"
              title="Сменить аккаунт"
            >
              <LogIn className="w-3.5 h-3.5 text-white" />
              <span className="hidden xs:inline">Войти / Сменить</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
