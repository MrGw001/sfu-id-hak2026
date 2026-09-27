import React, { useState } from 'react';
import { SfuLogo } from './SfuLogo';
import { UserProfile } from '../types';
import { apiGateway } from '../services/apiGateway';
import { Lock, User, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loginInput, setLoginInput] = useState('ezhakov');
  const [passwordInput, setPasswordInput] = useState('123');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = apiGateway.login(loginInput, passwordInput);
    if (res.success && res.user) {
      onSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Ошибка входа');
    }
  };

  const handleQuickFill = (login: string, pass: string) => {
    setLoginInput(login);
    setPasswordInput(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 w-full max-w-sm rounded-none p-6 text-xs">
        
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <SfuLogo className="h-8 mb-3" theme="dark" />
          <h2 className="text-base font-bold text-gray-900">Вход в Мой СФУ</h2>
          <p className="text-xs text-gray-500 mt-0.5">Единая корпоративная учетная запись</p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Логин
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="ezhakov"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 focus:border-[#F15A24] focus:outline-none"
              />
              <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 focus:border-[#F15A24] focus:outline-none"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Тестовые учетные записи */}
          <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500">
            <div className="font-semibold text-gray-700 mb-1">Аккаунты для входа (пароль 123):</div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleQuickFill('ezhakov', '123')}
                className="w-full text-left p-1.5 hover:bg-gray-50 border border-gray-200 flex items-center justify-between"
              >
                <span><strong>Студент:</strong> ezhakov (Жаков Егор Андреевич, КИ26-02/3Б)</span>
                <span className="text-[10px] text-[#F15A24]">Выбрать</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('egolovkov', '123')}
                className="w-full text-left p-1.5 hover:bg-gray-50 border border-gray-200 flex items-center justify-between"
              >
                <span><strong>Староста:</strong> egolovkov (Головков Егор Романович, КИ26-02/3Б)</span>
                <span className="text-[10px] text-[#F15A24]">Выбрать</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('kkirillov', '123')}
                className="w-full text-left p-1.5 hover:bg-gray-50 border border-gray-200 flex items-center justify-between"
              >
                <span><strong>Преподаватель:</strong> kkirillov (Кириллов К. А., Аналитическая геометрия)</span>
                <span className="text-[10px] text-[#F15A24]">Выбрать</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 border border-gray-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-[#F15A24] hover:bg-[#d63f17] text-white transition-colors"
            >
              Войти
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
