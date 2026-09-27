import React, { useState } from 'react';
import { TeacherGradeEntry, UserProfile } from '../../types';
import { apiGateway } from '../../services/apiGateway';
import { Save, Check, FileCheck, Users } from 'lucide-react';

interface TeacherGradingViewProps {
  currentUser: UserProfile;
}

export const TeacherGradingView: React.FC<TeacherGradingViewProps> = ({ currentUser }) => {
  const [grades, setGrades] = useState<TeacherGradeEntry[]>(apiGateway.getTeacherGrades());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleScoreChange = (id: string, score: number) => {
    apiGateway.updateGrade(id, score);
    setGrades(apiGateway.getTeacherGrades());
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-4">
      
      {/* Шапка преподавателя */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-gray-900">
              Кабинет преподавателя — Электронная ведомость БРС
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Дисциплина: «Аналитическая геометрия» • Группа {currentUser.group || 'КИ26-02/3Б'} • Преподаватель: {currentUser.fullName}
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 bg-[#F15A24] hover:bg-[#d63f17] text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Утвердить ведомость</span>
          </button>
        </div>

        {savedNotice && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Оценки зафиксированы в ведомости деканата СФУ!</span>
          </div>
        )}
      </div>

      {/* Ведомость выставления баллов */}
      <div className="bg-white border border-gray-200">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 flex items-center justify-between">
          <span>Студенты и результаты контрольных мероприятий</span>
          <span className="text-[11px] text-gray-500">Максимум: 20 баллов за лабораторную</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] text-gray-500">
              <th className="py-2 px-3 font-medium">Студент</th>
              <th className="py-2 px-3 font-medium">Группа</th>
              <th className="py-2 px-3 font-medium">Работа</th>
              <th className="py-2 px-3 font-medium">Статус</th>
              <th className="py-2 px-3 font-medium text-right">Балл (0–20)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {grades.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="py-2.5 px-3 font-medium text-gray-900">{g.studentName}</td>
                <td className="py-2.5 px-3 text-gray-500 font-mono">{g.group}</td>
                <td className="py-2.5 px-3 text-gray-700">{g.controlType}</td>
                <td className="py-2.5 px-3">
                  <span className={`text-[10px] px-1.5 py-0.5 border ${
                    g.status === 'Оценено'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : g.status === 'На проверке'
                      ? 'border-blue-300 bg-blue-50 text-blue-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}>
                    {g.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={g.score}
                    onChange={(e) => handleScoreChange(g.id, Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 text-right focus:border-[#F37021] focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
