import React, { useState } from 'react';
import { CertificateRequest, UserProfile } from '../../types';
import { apiGateway } from '../../services/apiGateway';
import { Plus, Check, Clock, Stamp, Calendar, CheckCircle2 } from 'lucide-react';

interface CertificatesViewProps {
  currentUser: UserProfile;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ currentUser }) => {
  const [certs, setCerts] = useState<CertificateRequest[]>(apiGateway.getCertificates());
  const [title, setTitle] = useState('Справка об обучении в СФУ');
  const [destination, setDestination] = useState('По месту требования');
  const [withOfficialSeal, setWithOfficialSeal] = useState(true); // Выбор синей гербовой печати
  const [timingMode, setTimingMode] = useState<'regular' | 'urgent' | 'custom'>('regular'); // Срок готовности
  const [customDateTime, setCustomDateTime] = useState('2026-09-29T14:00'); // Нужно время
  const [isOrdered, setIsOrdered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetTimeFormatted: string | undefined = undefined;
    if (timingMode === 'custom' && customDateTime) {
      const dt = new Date(customDateTime);
      targetTimeFormatted = `${dt.toLocaleDateString('ru-RU')} к ${dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }

    apiGateway.orderCertificate({
      title,
      destination,
      withOfficialSeal,
      urgency: timingMode === 'urgent' ? 'urgent' : 'regular',
      targetPickupTime: targetTimeFormatted,
    });

    setCerts(apiGateway.getCertificates());
    setIsOrdered(true);
    setTimeout(() => setIsOrdered(false), 3500);
  };

  const getEstimatedDurationText = () => {
    if (timingMode === 'custom') {
      const dt = new Date(customDateTime);
      return `К указанному времени: ${dt.toLocaleDateString('ru-RU')} к ${dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (timingMode === 'urgent') {
      return 'Срочное оформление: 1 рабочий день (готовность завтра к 16:00)';
    }
    return withOfficialSeal
      ? 'Стандартное оформление с синей гербовой печатью: 3 рабочих дня'
      : 'Без гербовой печати (текстовая выписка): 2 рабочих дня';
  };

  return (
    <div className="space-y-4">
      {/* Шапка ДЕКАНАТА */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="text-base font-bold text-gray-900 mb-1">
          Заказ справок — Деканат ИКИТ
        </div>
        <p className="text-xs text-gray-500">
          Выдачей и заверением справок занимается деканат института (каб. УЛК-218, ул. Академика Киренского, 26).
        </p>

        {isOrdered && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Заявление успешно зарегистрировано в деканате института с указанным временем готовности!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Форма заказа с выбором гербовой печати и срока готовности */}
        <div className="lg:col-span-5 bg-white border border-gray-200 p-4">
          <div className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">
            Заявление в деканат
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Вид справки
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:border-[#EB4F26] focus:outline-none"
              >
                <option value="Справка об обучении в СФУ">Справка об обучении в СФУ</option>
                <option value="Справка в военный комиссариат (Приложение №4)">Справка в военкомат (Приложение №4)</option>
                <option value="Справка об оплате обучения для налогового вычета">Справка для налогового вычета (ФНС)</option>
                <option value="Академическая выписка оценок">Академическая выписка оценок за все семестры</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Место требования (куда предоставляется)
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Например: Военкомат Октябрьского района"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:border-[#EB4F26] focus:outline-none"
              />
            </div>

            {/* Выбор гербовой печати СФУ */}
            <div className={`p-3 border transition-colors ${withOfficialSeal ? 'bg-blue-50/60 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-gray-900 select-none">
                <input
                  type="checkbox"
                  checked={withOfficialSeal}
                  onChange={(e) => setWithOfficialSeal(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#EB4F26] border-gray-300 focus:ring-[#EB4F26]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Stamp className="w-3.5 h-3.5 text-blue-700" />
                    <span>Синяя гербовая печать СФУ</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-normal mt-0.5 leading-tight">
                    Официальный круглый гербовый оттиск СФУ с регистрационным номером. Требуется для военкоматов, Соцзащиты, ПФР и посольств.
                  </p>
                </div>
              </label>
            </div>

            {/* Выбор нужного времени готовности справки */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Нужное время готовности справки:
              </label>
              
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTimingMode('regular')}
                  className={`p-2 border text-left transition-colors ${
                    timingMode === 'regular'
                      ? 'border-[#EB4F26] bg-orange-50/60 font-bold text-gray-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-xs leading-tight">Обычный</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">3 раб. дня</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimingMode('urgent')}
                  className={`p-2 border text-left transition-colors ${
                    timingMode === 'urgent'
                      ? 'border-[#EB4F26] bg-orange-50/60 font-bold text-gray-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#EB4F26] leading-tight">Срочно</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">1 раб. день</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimingMode('custom')}
                  className={`p-2 border text-left transition-colors ${
                    timingMode === 'custom'
                      ? 'border-[#EB4F26] bg-orange-50/60 font-bold text-gray-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-xs leading-tight">К дате/времени</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Указать время</div>
                </button>
              </div>

              {/* Поле выбора конкретной даты и времени */}
              {timingMode === 'custom' && (
                <div className="mt-2.5 p-2.5 bg-gray-50 border border-gray-200 space-y-1">
                  <label className="block text-[11px] font-medium text-gray-600">
                    Укажите нужную дату и время:
                  </label>
                  <input
                    type="datetime-local"
                    value={customDateTime}
                    onChange={(e) => setCustomDateTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 focus:border-[#EB4F26] focus:outline-none font-mono"
                  />
                  <div className="text-[10px] text-gray-500">
                    Деканат подготовит и подпишет справку строго к указанному сроку.
                  </div>
                </div>
              )}
            </div>

            {/* Индикатор срока */}
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>{getEstimatedDurationText()}</span>
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold bg-[#EB4F26] hover:bg-[#d63f17] text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Подать заявку в деканат</span>
            </button>
          </form>
        </div>

        {/* Список текущих справок */}
        <div className="lg:col-span-7 bg-white border border-gray-200 p-4">
          <div className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">
            Журнал заявлений в деканат ({certs.length})
          </div>

          <div className="divide-y divide-gray-100">
            {certs.map((c) => (
              <div key={c.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-900 leading-snug">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-gray-600">
                      Куда: <span className="font-medium text-gray-800">{c.destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                      {/* Метка гербовой печати */}
                      {c.withOfficialSeal ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 font-medium">
                          <Stamp className="w-3 h-3 text-blue-600" />
                          <span>Гербовая печать</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5">
                          Без печати (выписка)
                        </span>
                      )}

                      {/* Нужное время / срок */}
                      <span className="text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{c.readyTimeEst}</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 pt-0.5">
                      Место выдачи: <span className="text-gray-700 font-medium">{c.pickupOffice}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold border ${
                      c.status === 'Готова к выдаче в деканате'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : c.status === 'Подписана деканом'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {c.status}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1">
                      Заказ от {c.requestedAt}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>График работы деканата ИКИТ: Пн–Пт с 08:30 до 17:00</span>
            <span>Телефон: +7 (391) 291-22-11</span>
          </div>
        </div>

      </div>
    </div>
  );
};
