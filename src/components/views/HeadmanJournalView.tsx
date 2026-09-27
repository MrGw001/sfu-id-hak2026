import React, { useState } from 'react';
import { AttendanceRecord, AbsenceReason, UserProfile } from '../../types';
import { apiGateway } from '../../services/apiGateway';
import { Save, Check } from 'lucide-react';

interface HeadmanJournalViewProps {
  currentUser: UserProfile;
}

const REASONS: AbsenceReason[] = [
  'Присутствует',
  'По болезни (справка)',
  'Уважительная (заявление)',
  'Олимпиада / Хакатон СФУ',
  'Без уважительной причины'
];

export const HeadmanJournalView: React.FC<HeadmanJournalViewProps> = ({ currentUser }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>(apiGateway.getAttendance());
  const [savedToast, setSavedToast] = useState(false);

  const handleReasonChange = (id: string, reason: AbsenceReason) => {
    apiGateway.updateAttendanceReason(id, reason);
    setRecords(apiGateway.getAttendance());
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const presentCount = records.filter(r => r.reason === 'Присутствует').length;

  return (
    <div className="space-y-4">
      
      {/* Шапка журнала старосты */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-gray-900">
              Журнал посещаемости старосты — Группа {currentUser.group}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Учет посещаемости и причин отсутствия для деканата ИКИТ (каб. УЛК-218)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-700">
              Присутствуют: <strong className="text-gray-900">{presentCount} из {records.length}</strong>
            </span>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-[#EB4F26] hover:bg-[#d63f17] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Отправить в деканат</span>
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ведомость посещаемости успешно передана в деканат ИКИТ!</span>
          </div>
        )}
      </div>

      {/* Таблица студентов группы с селектором причины отсутствия */}
      <div className="bg-white border border-gray-200">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 flex items-center justify-between">
          <span>Студенты группы {currentUser.group}</span>
          <span>Дата: 27.09.2026</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] text-gray-500">
              <th className="py-2.5 px-3 font-medium">№</th>
              <th className="py-2.5 px-3 font-medium">ФИО студента</th>
              <th className="py-2.5 px-3 font-medium">Студ. билет</th>
              <th className="py-2.5 px-3 font-medium">Статус / Причина отсутствия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((student, idx) => {
              const isPresent = student.reason === 'Присутствует';

              return (
                <tr key={student.id} className="hover:bg-gray-50/70">
                  <td className="py-2.5 px-3 text-gray-400 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-900">
                    {student.studentName}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 font-mono">
                    {student.studentCard}
                  </td>
                  <td className="py-2.5 px-3">
                    {/* Выпадающий список выбора причины отсутствия для старосты */}
                    <select
                      value={student.reason}
                      onChange={(e) => handleReasonChange(student.id, e.target.value as AbsenceReason)}
                      className={`px-2 py-1 text-xs border focus:outline-none focus:border-[#EB4F26] font-medium ${
                        isPresent
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : student.reason === 'Без уважительной причины'
                          ? 'border-red-300 bg-red-50 text-red-800'
                          : 'border-amber-300 bg-amber-50 text-amber-900'
                      }`}
                    >
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
