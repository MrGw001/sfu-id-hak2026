import React, { useState } from 'react';
import { apiGateway } from '../../services/apiGateway';
import { MoodleCourse, UserProfile } from '../../types';
import { Search, MoreVertical, ChevronDown, Clock, AlertTriangle } from 'lucide-react';

interface CoursesViewProps {
  currentUser?: UserProfile;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ currentUser }) => {
  const [courses] = useState<MoodleCourse[]>(apiGateway.getMoodleCourses());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const isTeacher = currentUser?.role === 'teacher';

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      
      {/* Плашка «В разработке» по запросу пользователя */}
      <div className="bg-white border-l-4 border-l-[#EB4F26] border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-50 text-[#EB4F26] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">
                Электронные курсы eКурсы СФУ (e.sfu-kras.ru)
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                В разработке
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {isTeacher ? (
                <>
                  Уважаемый преподаватель! Интерактивный модуль управления курсами, тестирования и выставления баллов через LMS Moodle 4.x находится в стадии разработки. Для занесения баллов БРС используйте вкладку <strong>«Ведомость оценивания»</strong>.
                </>
              ) : (
                <>
                  Интеграционный шлюз с порталом eКурсы СФУ (LMS Moodle 4.x) находится на стадии разработки и планового тестирования. Ниже доступен каталог закрепленных учебных дисциплин.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Шапка в стиле Moodle e.sfu-kras.ru (по скриншоту пользователя) */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="text-base font-bold text-gray-900 mb-3">
          Обзор курсов
        </div>

        {/* Панель фильтров: Все (кроме скрытых) | Найти | Упорядочить по названию курса */}
        <div className="flex flex-col sm:flex-row gap-2.5 text-xs">
          <div className="relative min-w-44">
            <select className="w-full appearance-none px-3 py-1.5 bg-white border border-gray-300 pr-8 focus:border-[#EB4F26] focus:outline-none">
              <option>Все (кроме скрытых)</option>
              <option>В процессе</option>
              <option>Будущие</option>
              <option>Прошедшие</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти"
              className="w-full px-3 py-1.5 bg-white border border-gray-300 focus:border-[#EB4F26] focus:outline-none"
            />
          </div>

          <div className="relative min-w-56">
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full appearance-none px-3 py-1.5 bg-white border border-gray-300 pr-8 focus:border-[#EB4F26] focus:outline-none"
            >
              <option value="name">Упорядочить по названию курса</option>
              <option value="last">Упорядочить по последнему входу</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Режим отображения: <strong>Карточка (без обложек)</strong></span>
          <span>Найдено курсов: {filtered.length}</span>
        </div>
      </div>

      {/* Сетка карточек-плашек курсов (без обложек, строго в стиле скриншота) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map((course) => (
          <div 
            key={course.id}
            className="bg-white border border-gray-200 p-4 flex flex-col justify-between hover:border-gray-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-xs text-gray-900 leading-snug line-clamp-2">
                  {course.title}
                </h3>
                <button className="text-gray-400 hover:text-gray-700 p-0.5 shrink-0" title="Опции курса">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                {course.department}
              </p>
            </div>

            {/* Полоса прогресса, если указана в e.sfu (например, 26% выполнено, 100% выполнено, 0% выполнено) */}
            <div className="mt-4 pt-2 border-t border-gray-100">
              {course.progressPercent !== undefined ? (
                <div>
                  <div className="w-full h-1.5 bg-gray-200 overflow-hidden mb-1">
                    <div 
                      className="h-full bg-[#1e40af]" 
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {course.progressPercent}% выполнено
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-gray-400">
                  Без шкалы прогресса
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
