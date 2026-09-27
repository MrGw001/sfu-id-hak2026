import React, { useState } from 'react';
import { Lesson, UserProfile } from '../../types';
import { apiGateway } from '../../services/apiGateway';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';

interface ScheduleViewProps {
  currentUser: UserProfile;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ currentUser }) => {
  const isTeacher = currentUser.role === 'teacher';
  const currentGroup = currentUser.group || 'КИИ26-02/3Б';
  const [selectedDay, setSelectedDay] = useState('Понедельник');
  const [weekType, setWeekType] = useState<'all' | 'even' | 'odd'>('even'); // В СФУ сейчас идет четная неделя (как на скриншоте)

  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  // Получаем ленты из точной базы расписания СФУ для КИИ26-02/3Б
  const allDayLessons = apiGateway.getScheduleForGroup(currentGroup, currentUser.instituteShort, selectedDay);

  // Фильтруем по четности
  const filteredLessons = allDayLessons.filter(l => {
    if (weekType === 'all') return true;
    return l.weekType === 'all' || l.weekType === weekType;
  });

  // Уважительное обращение для преподавателя
  const greetingText = isTeacher 
    ? 'Здравствуйте, Кирилл Анатолевич 👋' 
    : `Привет, ${currentUser.firstName} 👋!`;

  return (
    <div className="space-y-4">
      
      {/* Главный блок приветствия */}
      <div className="bg-white border border-gray-200 p-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          {greetingText}
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          {isTeacher ? (
            <>
              {currentUser.institute} • {currentUser.specialty} • Табельный номер: <strong className="font-mono text-gray-900">№ {currentUser.studentCardNumber}</strong>
            </>
          ) : (
            <>
              {currentUser.institute} • Учебная группа: <strong className="text-gray-900">{currentGroup}</strong> • Студенческий билет: <strong className="font-mono text-gray-900">№ {currentUser.studentCardNumber}</strong>
            </>
          )}
        </p>
      </div>

      {/* Если преподаватель — выводим специальную плашку пустого расписания (В разработке) */}
      {isTeacher ? (
        <div className="bg-white border border-gray-200 p-8 text-center space-y-4">
          <div className="inline-flex p-3.5 bg-orange-50 border border-orange-200 text-[#EB4F26]">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                Расписание преподавателя
              </h2>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                В разработке
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
              Индивидуальное электронное расписание для преподавателя ({currentUser.fullName}) в настоящее время формируется учебно-методическим отделом ИКИТ СФУ.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-4 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="font-semibold text-gray-800 border-b border-gray-200 pb-1 flex items-center justify-between">
              <span>Сведения о педагогической нагрузке:</span>
              <span className="text-[10px] text-gray-500 font-normal">Осенний семестр 2026/2027</span>
            </div>
            <div className="space-y-1 text-gray-700 text-[11px]">
              <div>
                <span className="text-gray-500">Кафедра:</span>{' '}
                <strong>Прикладной математики и компьютерной безопасности</strong>
              </div>
              <div>
                <span className="text-gray-500">Дисциплина:</span>{' '}
                <strong>Аналитическая геометрия (лекции, практики)</strong>
              </div>
              <div>
                <span className="text-gray-500">Закрепленный поток:</span>{' '}
                <strong>Группа КИИ26-02/3Б (1 курс)</strong>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400">
            Для выставления текущих баллов и работы со студентами группы перейдите во вкладку «Ведомость оценивания».
          </p>
        </div>
      ) : (
        <>
          {/* Информационная плашка группы в точности как на timetable.sfu-kras.ru */}
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                  {currentUser.institute}
                </div>
                <div className="text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-2">
                  <span>{currentGroup}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-orange-50 text-[#EB4F26] border border-orange-200">
                    1 курс
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Идет четная неделя</span>
                </div>
              </div>

              {/* Фильтр недели: Четная / Нечетная */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-medium text-gray-500 mr-1.5 hidden sm:inline">Неделя:</span>
                <div className="flex border border-gray-300 text-xs">
                  <button
                    type="button"
                    onClick={() => setWeekType('even')}
                    className={`px-3 py-1.5 font-medium transition-colors ${
                      weekType === 'even'
                        ? 'bg-[#EB4F26] text-white font-bold'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Четная неделя
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekType('odd')}
                    className={`px-3 py-1.5 font-medium transition-colors border-l border-r border-gray-300 ${
                      weekType === 'odd'
                        ? 'bg-[#EB4F26] text-white font-bold'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Нечетная неделя
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekType('all')}
                    className={`px-3 py-1.5 font-medium transition-colors ${
                      weekType === 'all'
                        ? 'bg-[#EB4F26] text-white font-bold'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Все
                  </button>
                </div>
              </div>
            </div>

            {/* Переключатель дней недели: Понедельник — Суббота */}
            <div className="pt-3 flex items-center gap-1.5 overflow-x-auto text-xs">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-1.5 font-medium whitespace-nowrap transition-colors border ${
                    selectedDay === day
                      ? 'border-[#EB4F26] bg-[#EB4F26] text-white font-bold'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Список академических лент дня */}
          <div className="bg-white border border-gray-200">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 text-xs font-bold text-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>{selectedDay} • Группа {currentGroup}</span>
              </div>
              <span className="text-gray-500 font-normal text-[11px]">
                {filteredLessons.length} {filteredLessons.length === 1 ? 'лента' : 'ленты'} в расписании ({weekType === 'even' ? 'четная неделя' : weekType === 'odd' ? 'нечетная неделя' : 'все недели'})
              </span>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredLessons.map((lesson) => (
                <div key={lesson.id} className="p-4 hover:bg-gray-50/70 flex flex-col sm:flex-row sm:items-start gap-4 text-xs transition-colors">
                  
                  {/* Время и номер ленты СФУ */}
                  <div className="sm:w-36 shrink-0">
                    <span className="font-bold text-gray-900 block font-mono text-sm">
                      {lesson.timeSlot}
                    </span>
                    <span className="text-[11px] font-semibold text-[#EB4F26] mt-0.5 block">
                      {lesson.lessonNumber}-я лента
                    </span>
                  </div>

                  {/* Содержимое занятия */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {/* Тип занятия */}
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                        lesson.type === 'Лекция'
                          ? 'border-blue-300 bg-blue-50 text-blue-800'
                          : lesson.type === 'Практика'
                          ? 'border-amber-400 bg-amber-50 text-amber-900'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      }`}>
                        {lesson.type}
                      </span>

                      {/* Четность недели */}
                      <span className="text-[11px] text-gray-500 font-medium">
                        {lesson.weekType === 'even' && 'четная неделя'}
                        {lesson.weekType === 'odd' && 'нечетная неделя'}
                        {lesson.weekType === 'all' && 'каждая неделя'}
                      </span>

                      {/* Синхронно / Асинхронно */}
                      <span className="text-[10px] text-gray-400">
                        {lesson.subject.includes('асинхронно') ? 'асинхронно' : 'синхронно'}
                      </span>
                    </div>

                    <div className="font-bold text-gray-900 text-sm leading-snug">
                      {lesson.subject}
                    </div>

                    <div className="text-gray-600 mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span>{lesson.teacher}</span>
                      </span>
                      
                      <span className="text-gray-300">•</span>
                      
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>
                          {lesson.auditorium === 'ЭИОС' ? (
                            <span className="text-indigo-600 font-semibold">ЭИОС СФУ (e.sfu-kras.ru)</span>
                          ) : (
                            <>
                              Аудитория: <strong className="text-gray-900 font-mono">{lesson.auditorium}</strong>
                              {' • '}
                              <span className="text-gray-700">Корпус №{lesson.buildingNumber}</span>
                            </>
                          )}
                        </span>
                      </span>
                    </div>
                  </div>

                </div>
              ))}

              {filteredLessons.length === 0 && (
                <div className="p-10 text-center text-xs text-gray-500 space-y-1">
                  <div className="font-semibold text-gray-700 text-sm">Сегодня занятий нет, отдыхайте!</div>
                  <div>В расписании для группы {currentGroup} на {selectedDay} ({weekType === 'even' ? 'четная' : 'нечетная'} неделя) лент не запланировано.</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
