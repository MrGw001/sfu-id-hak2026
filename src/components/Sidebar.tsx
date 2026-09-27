import React from 'react';
import { UserProfile } from '../types';
import { 
  Calendar, 
  BookOpen, 
  Dumbbell, 
  FileText, 
  Award, 
  Users, 
  GraduationCap 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  currentUser: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
}) => {
  const navItems = [
    { id: 'schedule', name: 'Расписание занятий', icon: Calendar },
    { id: 'courses', name: 'Электронные курсы (e.sfu)', icon: BookOpen },
    { id: 'sport', name: 'Запись на спорт', icon: Dumbbell },
    { id: 'certificates', name: 'Заказ справок (Деканат)', icon: FileText },
    { id: 'academic_plan', name: 'Зачетная книжка', icon: Award },
  ];

  if (currentUser.role === 'headman') {
    navItems.splice(1, 0, {
      id: 'headman_journal',
      name: 'Журнал посещаемости',
      icon: Users,
    });
  }

  if (currentUser.role === 'teacher') {
    navItems.splice(1, 0, {
      id: 'teacher_grades',
      name: 'Ведомость оценивания',
      icon: GraduationCap,
    });
  }

  return (
    <aside className="w-full md:w-56 shrink-0 space-y-3">
      
      {/* Профиль студента */}
      <div className="bg-white border border-gray-200 p-3 text-xs">
        <div className="font-bold text-gray-900 leading-tight">
          {currentUser.fullName}
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5">
          {currentUser.role === 'student' && `Студент гр. ${currentUser.group}`}
          {currentUser.role === 'headman' && `Староста гр. ${currentUser.group}`}
          {currentUser.role === 'teacher' && 'Преподаватель ИКИТ СФУ'}
        </div>
        <div className="text-[11px] text-gray-700 mt-1.5 font-mono">
          Билет: <strong>{currentUser.studentCardNumber}</strong>
        </div>
      </div>

      {/* Меню навигации */}
      <nav className="bg-white border border-gray-200 divide-y divide-gray-100 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                isActive
                  ? 'bg-gray-100 text-[#EB4F26] font-semibold border-l-3 border-[#EB4F26]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#EB4F26]' : 'text-gray-400'}`} />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Ресурсы СФУ */}
      <div className="bg-gray-50 border border-gray-200 p-3 text-[11px] text-gray-500 space-y-1">
        <div className="font-semibold text-gray-700">Ресурсы СФУ</div>
        <div>timetable.sfu-kras.ru</div>
        <div>e.sfu-kras.ru (eКурсы)</div>
        <div>usports.online (Юспорт)</div>
        <div>Деканат ИКИТ (каб. УЛК-218)</div>
      </div>

    </aside>
  );
};
