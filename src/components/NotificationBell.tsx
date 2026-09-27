import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Filter, Users, GraduationCap, ShieldAlert, Award } from 'lucide-react';
import { UserProfile } from '../types';

export type UserTargetGroup = 'all' | 'students' | 'headman' | 'teachers';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'info' | 'headman' | 'success' | 'warning';
  targetGroup: UserTargetGroup; // Распределение по группам пользователей
  groupLabel: string;
  read: boolean;
  linkTab?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // СТУДЕНТАМ (ГРУППА КИ26-02/3Б)
  {
    id: 'n1',
    title: 'Срочный перенос пары!',
    message: 'Пара «Архитектура распределенных и облачных систем» перенесена в ауд. Б-205 (Корпус Пирамида).',
    time: '10 мин назад',
    type: 'urgent',
    targetGroup: 'students',
    groupLabel: 'Группа КИ',
    read: false,
    linkTab: 'schedule'
  },
  {
    id: 'n4',
    title: 'Справка об обучении готова',
    message: 'Ваша справка подписана и ожидает выдачи возле кабинета УЛК-207 (ул. Киренского, 26).',
    time: 'Вчера',
    type: 'success',
    targetGroup: 'students',
    groupLabel: 'Группа КИ',
    read: true,
    linkTab: 'certificates'
  },
  {
    id: 'n6',
    title: 'Сдача лабораторной на Е-курсах',
    message: 'Открыта загрузка отчетов по практической работе №2 на образовательном портале e.sfu-kras.ru.',
    time: '2 часа назад',
    type: 'info',
    targetGroup: 'students',
    groupLabel: 'Группа КИ',
    read: false,
    linkTab: 'courses'
  },

  // СТАРОСТЕ ГРУППЫ
  {
    id: 'n3',
    title: 'Журнал посещаемости старосты',
    message: 'Напоминание: отметьте посещаемость студентов группы КИ26-02/3Б на текущие пары.',
    time: 'Сегодня, 08:30',
    type: 'headman',
    targetGroup: 'headman',
    groupLabel: 'Старосте',
    read: false,
    linkTab: 'headman_journal'
  },
  {
    id: 'n7',
    title: 'Сверка контактных данных группы',
    message: 'УОО ИКИТ (каб. УЛК-207) просит старосту передать актуальные номера телефонов студентов до среды.',
    time: '3 часа назад',
    type: 'warning',
    targetGroup: 'headman',
    groupLabel: 'Старосте',
    read: false,
    linkTab: 'headman_journal'
  },

  // ПРЕПОДАВАТЕЛЯМ
  {
    id: 'n8',
    title: 'Ведомость оценивания коллоквиума',
    message: 'Необходимо зафиксировать баллы по коллоквиуму №1 по геометрии группы КИ26-02/3Б.',
    time: 'Сегодня, 09:15',
    type: 'info',
    targetGroup: 'teachers',
    groupLabel: 'Преподавателям',
    read: false,
    linkTab: 'teacher_grades'
  },
  {
    id: 'n9',
    title: 'Кадровые справки 2-НДФЛ',
    message: 'Прием заявлений преподавателей на оформление справок о доходах осуществляется в Управлении персонала.',
    time: '2 дня назад',
    type: 'success',
    targetGroup: 'teachers',
    groupLabel: 'Преподавателям',
    read: true,
    linkTab: 'certificates'
  },

  // ОБЩИЕ / СФУ
  {
    id: 'n2',
    title: 'Назначение соц. стипендии (ГСС)',
    message: 'Прием документов в УОО ИКИТ (каб. УЛК-207) строго с 13:00 до 15:00. Внимание: среда — неприемный день!',
    time: '1 час назад',
    type: 'info',
    targetGroup: 'all',
    groupLabel: 'Общее СФУ',
    read: false,
    linkTab: 'student_guides'
  },
  {
    id: 'n5',
    title: 'Второй отдел СФУ (Воинский учет)',
    message: 'Студентам-юношам 1 курса очной формы необходимо явиться в ауд. Д-511 с паспортом и приписным.',
    time: '2 дня назад',
    type: 'warning',
    targetGroup: 'all',
    groupLabel: 'Общее СФУ',
    read: true,
    linkTab: 'student_guides'
  }
];

interface NotificationBellProps {
  currentUser?: UserProfile;
  onNavigateTab?: (tab: string) => void;
  isDark?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ 
  currentUser,
  onNavigateTab, 
  isDark = true 
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sfu_notifications_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          message: (item.message || '').replace(/КИИ/g, 'КИ'),
          title: (item.title || '').replace(/КИИ/g, 'КИ'),
          groupLabel: (item.groupLabel || '').replace(/КИИ/g, 'КИ')
        }));
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeGroupFilter, setActiveGroupFilter] = useState<'all' | 'students' | 'headman' | 'teachers'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('sfu_notifications_v3', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    if (item.linkTab && onNavigateTab) {
      onNavigateTab(item.linkTab);
      setIsOpen(false);
    }
  };

  // Фильтрация по группе пользователей
  const filteredNotifications = notifications.filter(n => {
    if (activeGroupFilter === 'all') return true;
    if (activeGroupFilter === 'students') return n.targetGroup === 'students' || n.targetGroup === 'all';
    if (activeGroupFilter === 'headman') return n.targetGroup === 'headman' || n.targetGroup === 'students' || n.targetGroup === 'all';
    if (activeGroupFilter === 'teachers') return n.targetGroup === 'teachers' || n.targetGroup === 'all';
    return true;
  });

  return (
    <div className="relative" ref={panelRef}>
      {/* Кнопка с колокольчиком */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-none bg-black/15 hover:bg-black/25 text-white transition-colors focus:outline-none flex items-center justify-center border border-white/20"
        title="Уведомления СФУ"
        aria-label="Уведомления"
      >
        <Bell className="w-4 h-4 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-none flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Выпадающая панель уведомлений */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-none shadow-2xl z-50 overflow-hidden border ${
          isDark 
            ? 'bg-[#141620] border-[#252839] text-[#f4f4f6]' 
            : 'bg-white border-gray-300 text-gray-900 shadow-lg'
        }`}>
          {/* Шапка списка уведомлений */}
          <div className={`p-3 border-b flex items-center justify-between ${
            isDark ? 'border-[#252839] bg-[#101118]' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#F15A24]" />
              <span className="text-xs font-bold uppercase tracking-wider">Уведомления</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-none bg-[#F15A24]/20 text-[#F15A24] border border-[#F15A24]/30">
                  {unreadCount} новых
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-[11px] font-medium transition-colors flex items-center gap-1 ${
                    isDark ? 'text-zinc-400 hover:text-[#F15A24]' : 'text-gray-600 hover:text-[#F15A24]'
                  }`}
                  title="Отметить все прочитанными"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Прочитано</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className={`text-[11px] transition-colors p-1 rounded-none ${
                    isDark ? 'text-zinc-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                  }`}
                  title="Очистить все уведомления"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* РАСПРЕДЕЛЕНИЕ ПО ГРУППАМ ПОЛЬЗОВАТЕЛЕЙ (ФИЛЬТРЫ) */}
          <div className={`px-2.5 py-2 border-b flex items-center gap-1 overflow-x-auto text-[11px] font-semibold ${
            isDark ? 'border-[#252839] bg-[#161824]' : 'border-gray-200 bg-gray-100/70'
          }`}>
            <span className={`text-[10px] uppercase font-bold mr-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
              Кому:
            </span>

            {[
              { id: 'all', label: 'Все' },
              { id: 'students', label: 'Студентам (КИ)' },
              { id: 'headman', label: 'Старосте' },
              { id: 'teachers', label: 'Преподавателям' },
            ].map(tab => {
              const count = notifications.filter(n => {
                if (tab.id === 'all') return true;
                if (tab.id === 'students') return n.targetGroup === 'students' || n.targetGroup === 'all';
                if (tab.id === 'headman') return n.targetGroup === 'headman' || n.targetGroup === 'students' || n.targetGroup === 'all';
                if (tab.id === 'teachers') return n.targetGroup === 'teachers' || n.targetGroup === 'all';
                return true;
              }).length;

              const isSelected = activeGroupFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveGroupFilter(tab.id as any)}
                  className={`px-2 py-1 rounded-none border whitespace-nowrap transition-colors flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#F15A24] text-white border-[#F15A24] font-bold'
                      : isDark
                        ? 'bg-[#191c28] border-[#2f3347] text-zinc-300 hover:text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[9px] opacity-80 ${isSelected ? 'text-white' : ''}`}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Список уведомлений */}
          <div className={`max-h-80 overflow-y-auto divide-y ${isDark ? 'divide-[#252839]' : 'divide-gray-100'}`}>
            {filteredNotifications.length === 0 ? (
              <div className={`py-8 text-center text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Нет уведомлений для выбранной категории
              </div>
            ) : (
              filteredNotifications.map((n) => {
                // Бэдж группы пользователей
                const getGroupBadge = () => {
                  switch (n.targetGroup) {
                    case 'students':
                      return (
                        <span className="px-1.5 py-0.2 rounded-none text-[9px] font-bold uppercase bg-blue-500/15 text-blue-500 border border-blue-500/30">
                          {n.groupLabel}
                        </span>
                      );
                    case 'headman':
                      return (
                        <span className="px-1.5 py-0.2 rounded-none text-[9px] font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          {n.groupLabel}
                        </span>
                      );
                    case 'teachers':
                      return (
                        <span className="px-1.5 py-0.2 rounded-none text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                          {n.groupLabel}
                        </span>
                      );
                    default:
                      return (
                        <span className="px-1.5 py-0.2 rounded-none text-[9px] font-bold uppercase bg-[#F15A24]/15 text-[#F15A24] border border-[#F15A24]/30">
                          {n.groupLabel}
                        </span>
                      );
                  }
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3 text-xs transition-colors cursor-pointer relative ${
                      !n.read 
                        ? (isDark ? 'bg-[#181a26] hover:bg-[#1f2233]' : 'bg-orange-50/60 hover:bg-orange-100/60') 
                        : (isDark ? 'hover:bg-zinc-800/20 opacity-75' : 'hover:bg-gray-50 opacity-80')
                    }`}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F15A24]" />
                    )}
                    <div className="flex items-start justify-between gap-2 ml-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getGroupBadge()}
                        {n.type === 'urgent' && (
                          <span className="px-1 py-0.2 rounded-none text-[9px] font-bold uppercase bg-red-500/20 text-red-500 border border-red-500/30">
                            Срочно
                          </span>
                        )}
                        <span className={`font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                          {n.title}
                        </span>
                      </div>
                      <span className={`text-[10px] shrink-0 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                        {n.time}
                      </span>
                    </div>

                    <p className={`mt-1.5 ml-1 text-[11px] leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                      {n.message}
                    </p>

                    {n.linkTab && (
                      <div className="mt-1.5 ml-1 flex items-center gap-1 text-[10px] text-[#F15A24] font-semibold">
                        <span>Перейти в раздел</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
