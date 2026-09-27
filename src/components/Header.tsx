import React from 'react';
import { SfuLogo } from './SfuLogo';
import { UserProfile } from '../types';
import { LogIn } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenLogin,
}) => {
  return (
    /* Верхняя плашка белая с серой разделительной линией по запросу пользователя */
    <header className="bg-white text-gray-900 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Официальный логотип СФУ */}
          <div className="flex items-center gap-4">
            <SfuLogo className="h-9" theme="dark" />
          </div>

          {/* Правая часть: роль, профиль и кнопка смены учетной записи */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold leading-tight text-gray-900">
                {currentUser.fullName}
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                {currentUser.role === 'student' && `Студент (гр. ${currentUser.group})`}
                {currentUser.role === 'headman' && `Староста (гр. ${currentUser.group})`}
                {currentUser.role === 'teacher' && 'Преподаватель ИКИТ'}
                {' • '}
                <span className="font-mono text-gray-700">№ {currentUser.studentCardNumber}</span>
              </div>
            </div>

            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 flex items-center gap-1.5 transition-colors"
              title="Сменить аккаунт"
            >
              <LogIn className="w-3.5 h-3.5 text-gray-600" />
              <span>Войти / Сменить</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
