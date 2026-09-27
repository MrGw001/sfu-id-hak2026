import React, { useState, useEffect } from 'react';
import { UserProfile, AbsenceReason } from '../../types';
import { MOCK_KI26_STUDENTS, MOCK_KI26_LESSONS } from '../../data/mockData';
import { 
  Check, 
  Save, 
  UserCheck, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen
} from 'lucide-react';

interface HeadmanJournalViewProps {
  currentUser: UserProfile;
  isDark?: boolean;
}

const REASONS: { label: AbsenceReason; short: string; color: string }[] = [
  { label: 'Присутствует', short: 'П', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  { label: 'По болезни (справка)', short: 'Б', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { label: 'Уважительная (заявление)', short: 'У', color: 'text-[#F15A24] bg-[#F15A24]/10 border-[#F15A24]/30' },
  { label: 'Олимпиада / Хакатон СФУ', short: 'ОЛ', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  { label: 'Без уважительной причины', short: 'Н', color: 'text-red-500 bg-red-500/10 border-red-500/30' }
];

export const HeadmanJournalView: React.FC<HeadmanJournalViewProps> = ({ currentUser, isDark = true }) => {
  const safeGroup = (currentUser.group || 'КИ26-02/3Б').replace(/КИИ/g, 'КИ');

  // Текущая выбранная дата в формате YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Определяем день недели по выбранной дате
  const dateObj = new Date(selectedDate);
  const dayIndex = dateObj.getDay();
  const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const dayName = dayNames[dayIndex] || 'Понедельник';

  // Получаем пары на этот день недели для группы КИ26-02/3Б
  const dayLessons = MOCK_KI26_LESSONS.filter(l => l.dayName === dayName);
  const availableLessons = dayLessons.length > 0 ? dayLessons : MOCK_KI26_LESSONS.filter(l => l.dayName === 'Понедельник');

  const [selectedLessonId, setSelectedLessonId] = useState<string>(availableLessons[0]?.id || 'ki26-mon-1');

  useEffect(() => {
    if (availableLessons.length > 0) {
      setSelectedLessonId(availableLessons[0].id);
    }
  }, [selectedDate]);

  const storageKey = `sfu_journal_${selectedDate}_${selectedLessonId}`;

  const [attendanceMap, setAttendanceMap] = useState<Record<string, AbsenceReason>>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const initial: Record<string, AbsenceReason> = {};
    MOCK_KI26_STUDENTS.forEach((st, idx) => {
      if (idx === 4) initial[st.id] = 'По болезни (справка)';
      else if (idx === 7) initial[st.id] = 'Уважительная (заявление)';
      else if (idx === 14) initial[st.id] = 'Без уважительной причины';
      else initial[st.id] = 'Присутствует';
    });
    return initial;
  });

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setAttendanceMap(JSON.parse(saved));
        return;
      } catch {
        // fallback
      }
    }
    const initial: Record<string, AbsenceReason> = {};
    MOCK_KI26_STUDENTS.forEach((st, idx) => {
      if (idx === 4) initial[st.id] = 'По болезни (справка)';
      else if (idx === 7) initial[st.id] = 'Уважительная (заявление)';
      else if (idx === 14) initial[st.id] = 'Без уважительной причины';
      else initial[st.id] = 'Присутствует';
    });
    setAttendanceMap(initial);
  }, [storageKey]);

  const [savedToast, setSavedToast] = useState(false);

  const handleStatusChange = (studentId: string, reason: AbsenceReason) => {
    const updated = { ...attendanceMap, [studentId]: reason };
    setAttendanceMap(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const markAllPresent = () => {
    const updated: Record<string, AbsenceReason> = {};
    MOCK_KI26_STUDENTS.forEach(st => {
      updated[st.id] = 'Присутствует';
    });
    setAttendanceMap(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(attendanceMap));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const currentLesson = availableLessons.find(l => l.id === selectedLessonId) || availableLessons[0];

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const totalStudents = MOCK_KI26_STUDENTS.length;
  const presentCount = Object.values(attendanceMap).filter(v => v === 'Присутствует').length;
  const illCount = Object.values(attendanceMap).filter(v => v === 'По болезни (справка)').length;
  const validCount = Object.values(attendanceMap).filter(v => v === 'Уважительная (заявление)' || v === 'Олимпиада / Хакатон СФУ').length;
  const absentCount = Object.values(attendanceMap).filter(v => v === 'Без уважительной причины').length;

  return (
    <div className={`space-y-4 ${isDark ? 'text-[#f4f4f6]' : 'text-gray-900'}`}>
      
      {/* Главный блок управления журналом со строгими квадратными краями */}
      <div className={`p-4 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Электронный журнал старосты — Группа {safeGroup}
              </span>
              <span className="px-2 py-0.5 rounded-none text-[10px] font-bold uppercase bg-[#F15A24]/15 text-[#F15A24] border border-[#F15A24]/30">
                1 курс
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Фиксация посещаемости студентов по конкретным датам и дисциплинам из расписания СФУ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllPresent}
              className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-colors flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-[#191c28] hover:bg-[#222636] text-zinc-200 border-[#2f3347]' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Все присутствуют</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#F15A24] hover:bg-[#d84a18] text-white text-xs font-bold rounded-none flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Сохранить ведомость</span>
            </button>
          </div>

        </div>

        {savedToast && (
          <div className="mt-3 p-2.5 rounded-none bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Ведомость посещаемости на <strong>{selectedDate}</strong> по предмету <strong>«{currentLesson?.subject}»</strong> успешно сохранена!</span>
          </div>
        )}

        {/* ПЕРЕКЛЮЧАТЕЛЬ ДАТЫ И КАЛЕНДАРЬ */}
        <div className={`mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-[#252839]' : 'border-gray-200'
        }`}>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => shiftDate(-1)}
                className={`p-1.5 rounded-none border transition-colors ${
                  isDark ? 'bg-[#191c28] border-[#2f3347] hover:bg-[#222636] text-zinc-200' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700'
                }`}
                title="Предыдущий день"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-none border outline-none ${
                    isDark ? 'bg-[#191c28] border-[#2f3347] text-white focus:border-[#F15A24]' : 'bg-white border-gray-300 text-gray-900 focus:border-[#F15A24]'
                  }`}
                />
              </div>

              <button
                onClick={() => shiftDate(1)}
                className={`p-1.5 rounded-none border transition-colors ${
                  isDark ? 'bg-[#191c28] border-[#2f3347] hover:bg-[#222636] text-zinc-200' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700'
                }`}
                title="Следующий день"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs font-bold text-[#F15A24] px-2 py-1 rounded-none bg-[#F15A24]/10 border border-[#F15A24]/20">
              {dayName}
            </span>
          </div>

          {/* Быстрые кнопки дней */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => {
                const today = new Date();
                setSelectedDate(today.toISOString().split('T')[0]);
              }}
              className={`px-3 py-1 rounded-none border text-xs font-semibold ${
                selectedDate === new Date().toISOString().split('T')[0]
                  ? 'bg-[#F15A24] text-white border-[#F15A24] font-bold'
                  : isDark ? 'bg-[#191c28] text-zinc-300 border-[#2f3347] hover:text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Сегодня
            </button>
            <button
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className={`px-3 py-1 rounded-none border text-xs font-semibold ${
                isDark ? 'bg-[#191c28] text-zinc-300 border-[#2f3347] hover:text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Вчера
            </button>
          </div>

        </div>

      </div>

      {/* ВЫБОР ПРЕДМЕТА ИЗ РАСПИСАНИЯ НА ВЫБРАННУЮ ДАТУ (Квадратные плитки) */}
      <div className={`p-4 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#F15A24]" />
            <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
              Пары по расписанию на {dayName} ({availableLessons.length}):
            </span>
          </div>
          <span className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
            Выберите пару для заполнения журнала
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {availableLessons.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`p-3 rounded-none border text-left transition-all ${
                  isSelected
                    ? 'border-[#F15A24] bg-[#F15A24]/10 shadow-xs ring-1 ring-[#F15A24]'
                    : isDark
                      ? 'border-[#252839] bg-[#191c28] hover:border-[#F15A24]/40 hover:bg-[#202334]'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#F15A24]/15 text-[#F15A24] border border-[#F15A24]/20">
                    {lesson.lessonNumber} пара • {lesson.timeSlot}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-none border ${
                    isDark ? 'bg-[#141620] border-[#252839] text-zinc-400' : 'bg-white border-gray-200 text-gray-600'
                  }`}>
                    {lesson.type}
                  </span>
                </div>

                <div className={`text-xs font-bold mt-2 line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {lesson.subject}
                </div>

                <div className={`text-[11px] mt-1 flex items-center justify-between ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                  <span>{lesson.teacher}</span>
                  <span className="font-mono text-[#F15A24] font-semibold">{lesson.auditorium}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* СТАТИСТИКА И СВОДКА ПО ТЕКУЩЕЙ ПАРЕ (Квадратные блоки) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className={`p-3 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Присутствуют</div>
          <div className="text-lg font-extrabold text-emerald-500 mt-0.5">
            {presentCount} <span className={`text-xs font-normal ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>/ {totalStudents}</span>
          </div>
          <div className="text-[10px] text-emerald-500 mt-0.5 font-medium">
            {Math.round((presentCount / totalStudents) * 100)}% группы
          </div>
        </div>

        <div className={`p-3 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>По болезни (справка)</div>
          <div className="text-lg font-extrabold text-blue-500 mt-0.5">
            {illCount}
          </div>
          <div className="text-[10px] text-blue-500 mt-0.5 font-medium">Уважительная</div>
        </div>

        <div className={`p-3 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Заявление / Хакатон</div>
          <div className="text-lg font-extrabold text-[#F15A24] mt-0.5">
            {validCount}
          </div>
          <div className="text-[10px] text-[#F15A24] mt-0.5 font-medium">Уважительная</div>
        </div>

        <div className={`p-3 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Неуважительная (Н)</div>
          <div className="text-lg font-extrabold text-red-500 mt-0.5">
            {absentCount}
          </div>
          <div className="text-[10px] text-red-500 mt-0.5 font-medium">Пропуск</div>
        </div>
      </div>

      {/* ТАБЛИЦА СПИСКА СТУДЕНТОВ (Квадратная таблица со строгими разделителями) */}
      <div className={`rounded-none border overflow-hidden ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
        <div className={`px-4 py-3 border-b flex items-center justify-between text-xs font-semibold ${
          isDark ? 'bg-[#101118] border-[#252839] text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#F15A24]" />
            <span>Ведомость посещаемости ({MOCK_KI26_STUDENTS.length} студентов)</span>
          </div>
          <span className="text-[11px] text-[#F15A24] font-mono font-semibold">
            {selectedDate} • {currentLesson?.subject}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[11px] ${
                isDark ? 'border-[#252839] bg-[#161824] text-zinc-400' : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}>
                <th className="py-2.5 px-3 w-10 text-center">№</th>
                <th className="py-2.5 px-3">ФИО студента</th>
                <th className="py-2.5 px-3 w-28 text-center">Номер билета</th>
                <th className="py-2.5 px-3 w-64 text-center">Статус посещаемости</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#252839]' : 'divide-gray-100'}`}>
              {MOCK_KI26_STUDENTS.map((st, idx) => {
                const currentStatus = attendanceMap[st.id] || 'Присутствует';
                return (
                  <tr
                    key={st.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-[#191c28]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className={`py-2.5 px-3 text-center font-mono text-[11px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                        <span>{st.fullName}</span>
                        {st.isHeadman && (
                          <span className="px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase bg-[#F15A24]/15 text-[#F15A24] border border-[#F15A24]/30">
                            Староста
                          </span>
                        )}
                      </div>
                    </td>

                    <td className={`py-2.5 px-3 text-center font-mono text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                      {st.studentCard}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {REASONS.map((r) => {
                          const isCurrent = currentStatus === r.label;
                          return (
                            <button
                              key={r.label}
                              onClick={() => handleStatusChange(st.id, r.label)}
                              title={r.label}
                              className={`w-7 h-7 rounded-none text-[11px] font-extrabold transition-all border ${
                                isCurrent
                                  ? `${r.color} ring-1 ring-[#F15A24]`
                                  : isDark
                                    ? 'bg-[#191c28] text-zinc-500 border-[#2f3347] hover:bg-[#252839] hover:text-zinc-200'
                                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-800'
                              }`}
                            >
                              {r.short}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
