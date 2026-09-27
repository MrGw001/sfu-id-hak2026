import React from 'react';
import { UserProfile } from '../types';
import { 
  Calendar, 
  BookOpen, 
  Dumbbell, 
  FileText, 
  Award, 
  Users, 
  GraduationCap,
  HelpCircle,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  currentUser: UserProfile;
  isDark?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  isDark = true,
}) => {
  const isTeacher = currentUser.role === 'teacher';
  const isHeadman = currentUser.role === 'headman';
  const isStudent = currentUser.role === 'student' || isHeadman;

  const safeGroup = (currentUser.group || 'КИ26-02/3Б').replace(/КИИ/g, 'КИ');

  const navItems: { id: string; name: string; icon: any; badge?: string }[] = [];

  // Расписание
  navItems.push({
    id: 'schedule',
    name: isTeacher ? 'Расписание преподавателя' : 'Расписание занятий',
    icon: Calendar
  });

  // Журнал посещаемости старосты
  if (isHeadman) {
    navItems.push({
      id: 'headman_journal',
      name: 'Журнал старосты',
      icon: Users,
      badge: 'Новое'
    });
  }

  // Ведомость преподавателя
  if (isTeacher) {
    navItems.push({
      id: 'teacher_grades',
      name: 'Ведомость оценивания',
      icon: GraduationCap
    });
  }

  // Гайды студента (памятка ИКИТ) — только для студентов и старосты
  if (isStudent) {
    navItems.push({
      id: 'student_guides',
      name: 'Гайды студента (Памятка)',
      icon: HelpCircle,
      badge: 'PDF'
    });
  }

  // Поиск аудитории (ГИС СФУ) — для всех пользователей
  navItems.push({
    id: 'auditorium_search',
    name: 'Поиск аудитории (ГИС СФУ)',
    icon: Compass,
    badge: '3D карта'
  });

  // Электронные курсы
  navItems.push({
    id: 'courses',
    name: 'Электронные курсы (e.sfu)',
    icon: BookOpen
  });

  // Запись на спорт (для студентов)
  if (isStudent) {
    navItems.push({
      id: 'sport',
      name: 'Запись на спорт',
      icon: Dumbbell
    });
  }

  // Заказ справок
  navItems.push({
    id: 'certificates',
    name: isTeacher ? 'Заказ справок (Кадры)' : 'Заказ справок',
    icon: FileText
  });

  // Зачетная книжка (для студентов)
  if (isStudent) {
    navItems.push({
      id: 'academic_plan',
      name: 'Зачетная книжка',
      icon: Award
    });
  }

  return (
    <aside className="w-full md:w-60 shrink-0 space-y-3">
      
      {/* Профиль студента / старосты / преподавателя (строго квадратные углы) */}
      <div className={`p-3.5 rounded-none border text-xs ${
        isDark 
          ? 'bg-[#141620] border-[#252839] text-[#f4f4f6]' 
          : 'bg-white border-gray-300 text-gray-900 shadow-xs'
      }`}>
        <div className={`font-extrabold leading-tight ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
          {currentUser.fullName}
        </div>
        <div className="text-[11px] mt-1.5 flex items-center gap-1.5">
          {currentUser.role === 'student' && (
            <span className="px-1.5 py-0.5 rounded-none bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold">
              Студент гр. {safeGroup}
            </span>
          )}
          {currentUser.role === 'headman' && (
            <span className="px-1.5 py-0.5 rounded-none bg-[#F15A24]/15 text-[#F15A24] font-bold border border-[#F15A24]/30">
              Староста гр. {safeGroup}
            </span>
          )}
          {currentUser.role === 'teacher' && (
            <span className="px-1.5 py-0.5 rounded-none bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
              Преподаватель ИКИТ
            </span>
          )}
        </div>
        <div className={`text-[11px] mt-2 font-mono ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
          {isTeacher ? (
            <>Табельный №: <strong className={isDark ? 'text-zinc-200' : 'text-gray-900'}>{currentUser.studentCardNumber}</strong></>
          ) : (
            <>Билет: <strong className={isDark ? 'text-zinc-200' : 'text-gray-900'}>{currentUser.studentCardNumber}</strong></>
          )}
        </div>
      </div>

      {/* Меню навигации (прямоугольные списки) */}
      <nav className={`rounded-none border divide-y text-xs overflow-hidden ${
        isDark 
          ? 'bg-[#141620] border-[#252839] divide-[#252839] text-zinc-300' 
          : 'bg-white border-gray-300 divide-gray-200 text-gray-700 shadow-xs'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors font-medium rounded-none ${
                isActive
                  ? 'bg-[#F15A24] text-white font-bold'
                  : isDark 
                    ? 'hover:bg-[#1c1f2d] hover:text-white' 
                    : 'hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#F15A24]'}`} />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && !isActive && (
                <span className="px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase bg-[#F15A24]/15 text-[#F15A24] border border-[#F15A24]/30 shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

    </aside>
  );
};
