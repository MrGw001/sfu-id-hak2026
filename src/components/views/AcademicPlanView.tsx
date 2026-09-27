import React, { useState } from 'react';
import { AcademicPlanItem, UserProfile } from '../../types';
import { apiGateway } from '../../services/apiGateway';

interface AcademicPlanViewProps {
  currentUser: UserProfile;
}

export const AcademicPlanView: React.FC<AcademicPlanViewProps> = ({ currentUser }) => {
  const [items] = useState<AcademicPlanItem[]>(apiGateway.getAcademicPlan());
  const [semester, setSemester] = useState<number>(6);

  const filtered = items.filter(i => i.semester === semester);

  return (
    <div className="space-y-4">
      {/* Шапка зачетки */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-gray-900">
              Электронная зачетная книжка
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Номер зачетной книжки: <span className="font-mono text-gray-800">{currentUser.recordBookNumber}</span> • {currentUser.specialty}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
              Средний балл: <strong className="text-gray-900">{currentUser.averageGrade}</strong>
            </div>
            {currentUser.hasScholarship && (
              <div className="border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800 font-medium">
                Стипендия: {currentUser.scholarshipAmount} ₽
              </div>
            )}
          </div>
        </div>

        {/* Переключатель семестров */}
        <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3 text-xs">
          <span className="text-gray-500 mr-2">Семестр:</span>
          {[5, 6].map((s) => (
            <button
              key={s}
              onClick={() => setSemester(s)}
              className={`px-3 py-1 border ${
                semester === s
                  ? 'border-[#F37021] bg-[#F37021] text-white font-medium'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s} семестр {s === 6 ? '(текущий)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица ведомости в строгом академическом стиле */}
      <div className="bg-white border border-gray-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] text-gray-600">
              <th className="py-2 px-3 font-semibold">Дисциплина</th>
              <th className="py-2 px-3 font-semibold">Форма контроля</th>
              <th className="py-2 px-3 font-semibold">Часов</th>
              <th className="py-2 px-3 font-semibold">ЗЕТ</th>
              <th className="py-2 px-3 font-semibold text-right">Оценка / Баллы</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2.5 px-3 font-medium text-gray-900">{item.discipline}</td>
                <td className="py-2.5 px-3 text-gray-600">{item.controlType}</td>
                <td className="py-2.5 px-3 text-gray-500 font-mono">{item.hoursTotal}</td>
                <td className="py-2.5 px-3 text-gray-500 font-mono">{item.credits}</td>
                <td className="py-2.5 px-3 text-right font-medium">
                  {item.grade ? (
                    <span className="text-gray-900 font-bold">
                      {item.grade} ({item.points} б.)
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      {item.points || 0} / 100 б. (сессия в июне)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
