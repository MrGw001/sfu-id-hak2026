import React, { useState } from 'react';
import { CertificateRequest, UserProfile } from '../../types';
import { apiGateway } from '../../services/apiGateway';
import { Plus, Check, Clock, Stamp, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface CertificatesViewProps {
  currentUser: UserProfile;
  isDark?: boolean;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ currentUser, isDark = true }) => {
  const isTeacher = currentUser.role === 'teacher';
  const [certs, setCerts] = useState<CertificateRequest[]>(apiGateway.getCertificates(isTeacher));
  const [title, setTitle] = useState(
    isTeacher 
      ? 'Справка с места работы (подтверждение должности преподавателя)'
      : 'Справка об обучении в СФУ'
  );
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
      isTeacher,
    });

    setCerts(apiGateway.getCertificates(isTeacher));
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
    <div className={`space-y-4 ${isDark ? 'text-[#f4f4f6]' : 'text-gray-900'}`}>
      
      {/* Шапка ДЕКАНАТА / ОТДЕЛА КАДРОВ */}
      <div className={`border p-4 rounded-none ${
        isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'
      }`}>
        <div className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isTeacher ? 'Заказ справок и кадровых документов — Управление персонала СФУ' : 'Заказ справок — Деканат ИКИТ'}
        </div>
        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
          {isTeacher
            ? 'Оформлением кадровых и финансовых документов для профессорско-преподавательского состава занимается Отдел кадров ППС (каб. УЛК-104, ул. Академика Киренского, 26).'
            : 'Выдачей и заверением справок занимается деканат института (каб. УЛК-218, ул. Академика Киренского, 26).'}
        </p>

        {/* Уведомление для 1 курса по дате 01.12.2026 */}
        {!isTeacher && (
          <div className={`mt-3 p-2.5 rounded-none border text-xs flex items-center gap-2 ${
            isDark 
              ? 'bg-[#1e1c18] border-amber-600/40 text-amber-300' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <AlertCircle className="w-4 h-4 text-[#F15A24] shrink-0" />
            <span>
              <strong>Внимание 1 курс:</strong> Справка о размере стипендии заказывается не ранее <strong>01.12.2026</strong>. До этого момента справка заказывается по предыдущему месту обучения!
            </span>
          </div>
        )}

        {isOrdered && (
          <div className="mt-3 p-2.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2 rounded-none">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {isTeacher
                ? 'Заявление успешно зарегистрировано в управлении персонала СФУ с указанным временем готовности!'
                : 'Заявление успешно зарегистрировано в деканате института с указанным временем готовности!'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Форма заказа с выбором гербовой печати и срока готовности */}
        <div className={`lg:col-span-5 border p-4 rounded-none ${
          isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'
        }`}>
          <div className={`text-xs font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
            {isTeacher ? 'Заявление в отдел кадров ППС' : 'Заявление в деканат'}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                Вид справки / документа
              </label>
              {isTeacher ? (
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-none focus:outline-none ${
                    isDark 
                      ? 'bg-[#191c28] border-[#2f3347] text-white focus:border-[#F15A24]' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#F15A24]'
                  }`}
                >
                  <option value="Справка с места работы (подтверждение должности преподавателя)">
                    Справка с места работы (подтверждение должности преподавателя)
                  </option>
                  <option value="Справка о доходах и суммах налога физического лица (2-НДФЛ)">
                    Справка о доходах физического лица (форма 2-НДФЛ)
                  </option>
                  <option value="Копия трудовой книжки (заверенная отделом кадров СФУ)">
                    Копия трудовой книжки (заверенная отделом кадров)
                  </option>
                  <option value="Справка о научно-педагогическом стаже работы">
                    Справка о научно-педагогическом стаже работы
                  </option>
                  <option value="Служебная записка на командировку / повышение квалификации">
                    Служебная записка на командировку / повышение квалификации
                  </option>
                </select>
              ) : (
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-none focus:outline-none ${
                    isDark 
                      ? 'bg-[#191c28] border-[#2f3347] text-white focus:border-[#F15A24]' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#F15A24]'
                  }`}
                >
                  <option value="Справка об обучении в СФУ">Справка об обучении в СФУ</option>
                  <option value="Справка в военный комиссариат (Приложение №4)">Справка в военкомат (Приложение №4)</option>
                  <option value="Справка об оплате обучения для налогового вычета">Справка для налогового вычета (ФНС)</option>
                  <option value="Справка о размере стипендии (с 01.12.2026)">Справка о размере стипендии (доступно с 01.12.2026)</option>
                  <option value="Академическая выписка оценок">Академическая выписка оценок за все семестры</option>
                </select>
              )}
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                Место требования (куда предоставляется)
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={isTeacher ? "Например: В банк для оформления ипотеки" : "Например: Военкомат Октябрьского района"}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-none focus:outline-none ${
                  isDark 
                    ? 'bg-[#191c28] border-[#2f3347] text-white placeholder-zinc-500 focus:border-[#F15A24]' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#F15A24]'
                }`}
              />
            </div>

            {/* ВЫБОР ГЕРБОВОЙ ПЕЧАТИ СФУ: ИДЕАЛЬНАЯ КОНТРАСТНОСТЬ В ОБЕИХ ТЕМАХ */}
            <div className={`p-3 border rounded-none transition-colors ${
              withOfficialSeal 
                ? (isDark 
                    ? 'bg-[#131d33] border-blue-500/60 shadow-inner' 
                    : 'bg-blue-50/90 border-blue-300')
                : (isDark 
                    ? 'bg-[#191c28] border-[#252839]' 
                    : 'bg-gray-50 border-gray-200')
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={withOfficialSeal}
                  onChange={(e) => setWithOfficialSeal(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-[#F15A24] focus:ring-[#F15A24] rounded-none shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Stamp className={`w-3.5 h-3.5 ${
                      withOfficialSeal 
                        ? (isDark ? 'text-blue-400' : 'text-blue-700') 
                        : (isDark ? 'text-zinc-500' : 'text-gray-500')
                    }`} />
                    <span className={`text-xs font-bold ${
                      withOfficialSeal
                        ? (isDark ? 'text-blue-200' : 'text-blue-950')
                        : (isDark ? 'text-zinc-300' : 'text-gray-800')
                    }`}>
                      Синяя гербовая печать СФУ
                    </span>
                  </div>
                  <p className={`text-[11px] mt-1 leading-snug ${
                    withOfficialSeal
                      ? (isDark ? 'text-blue-300/80' : 'text-blue-900/80')
                      : (isDark ? 'text-zinc-400' : 'text-gray-600')
                  }`}>
                    Официальный круглый гербовый оттиск СФУ с регистрационным номером. Требуется для военкоматов, Соцзащиты, ПФР и посольств.
                  </p>
                </div>
              </label>
            </div>

            {/* Выбор нужного времени готовности справки */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                Нужное время готовности справки:
              </label>
              
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTimingMode('regular')}
                  className={`p-2 border rounded-none text-left transition-colors ${
                    timingMode === 'regular'
                      ? (isDark 
                          ? 'border-[#F15A24] bg-[#F15A24]/15 text-white font-bold ring-1 ring-[#F15A24]' 
                          : 'border-[#F15A24] bg-orange-50 font-bold text-gray-900')
                      : (isDark 
                          ? 'border-[#252839] bg-[#191c28] text-zinc-300 hover:border-[#F15A24]/40' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }`}
                >
                  <div className="font-semibold text-xs leading-tight">Обычный</div>
                  <div className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>3 раб. дня</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimingMode('urgent')}
                  className={`p-2 border rounded-none text-left transition-colors ${
                    timingMode === 'urgent'
                      ? (isDark 
                          ? 'border-[#F15A24] bg-[#F15A24]/15 text-white font-bold ring-1 ring-[#F15A24]' 
                          : 'border-[#F15A24] bg-orange-50 font-bold text-gray-900')
                      : (isDark 
                          ? 'border-[#252839] bg-[#191c28] text-zinc-300 hover:border-[#F15A24]/40' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }`}
                >
                  <div className="font-semibold text-xs text-[#F15A24] leading-tight">Срочно</div>
                  <div className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>1 раб. день</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimingMode('custom')}
                  className={`p-2 border rounded-none text-left transition-colors ${
                    timingMode === 'custom'
                      ? (isDark 
                          ? 'border-[#F15A24] bg-[#F15A24]/15 text-white font-bold ring-1 ring-[#F15A24]' 
                          : 'border-[#F15A24] bg-orange-50 font-bold text-gray-900')
                      : (isDark 
                          ? 'border-[#252839] bg-[#191c28] text-zinc-300 hover:border-[#F15A24]/40' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }`}
                >
                  <div className="font-semibold text-xs leading-tight">К дате/времени</div>
                  <div className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Указать время</div>
                </button>
              </div>

              {/* Поле выбора конкретной даты и времени */}
              {timingMode === 'custom' && (
                <div className={`mt-2.5 p-2.5 border rounded-none space-y-1 ${
                  isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className={`block text-[11px] font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                    Укажите нужную дату и время:
                  </label>
                  <input
                    type="datetime-local"
                    value={customDateTime}
                    onChange={(e) => setCustomDateTime(e.target.value)}
                    className={`w-full px-2.5 py-1.5 text-xs border rounded-none font-mono focus:outline-none ${
                      isDark 
                        ? 'bg-[#141620] border-[#2f3347] text-white focus:border-[#F15A24]' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-[#F15A24]'
                    }`}
                  />
                  <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                    {isTeacher 
                      ? 'Отдел кадров подготовит документ строго к указанному сроку.'
                      : 'Деканат подготовит и подпишет справку строго к указанному сроку.'}
                  </div>
                </div>
              )}
            </div>

            {/* Индикатор срока */}
            <div className={`p-2.5 border rounded-none text-[11px] flex items-center gap-2 ${
              isDark ? 'bg-[#131d33] border-blue-600/40 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#F15A24]" />
              <span>{getEstimatedDurationText()}</span>
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold bg-[#F15A24] hover:bg-[#d84a18] text-white flex items-center justify-center gap-1.5 transition-colors rounded-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isTeacher ? 'Подать заявку в отдел кадров' : 'Подать заявку в деканат'}</span>
            </button>
          </form>
        </div>

        {/* Список текущих справок */}
        <div className={`lg:col-span-7 border p-4 rounded-none ${
          isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'
        }`}>
          <div className={`text-xs font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
            {isTeacher ? 'Журнал кадровых документов' : 'Журнал заявлений в деканат'} ({certs.length})
          </div>

          <div className={`divide-y ${isDark ? 'divide-[#252839]' : 'divide-gray-100'}`}>
            {certs.map((c) => (
              <div key={c.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className={`text-xs font-bold leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {c.title}
                    </div>
                    <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                      Куда: <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>{c.destination}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
                      {/* Метка гербовой печати с четким контрастом */}
                      {c.withOfficialSeal ? (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 font-medium border rounded-none ${
                          isDark 
                            ? 'bg-[#131d33] border-blue-500/50 text-blue-300' 
                            : 'bg-blue-50 border-blue-200 text-blue-800'
                        }`}>
                          <Stamp className="w-3 h-3 text-[#F15A24]" />
                          <span>Гербовая печать</span>
                        </span>
                      ) : (
                        <span className={`px-1.5 py-0.5 border rounded-none ${
                          isDark ? 'bg-[#191c28] border-[#2f3347] text-zinc-400' : 'bg-gray-50 border-gray-200 text-gray-500'
                        }`}>
                          Без печати (выписка)
                        </span>
                      )}

                      {/* Нужное время / срок */}
                      <span className={`px-1.5 py-0.5 flex items-center gap-1 border rounded-none ${
                        isDark ? 'bg-[#191c28] border-[#2f3347] text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}>
                        <Clock className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`} />
                        <span>{c.readyTimeEst}</span>
                      </span>
                    </div>

                    <div className={`text-[11px] pt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                      Место выдачи: <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>{c.pickupOffice}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold border rounded-none ${
                      c.status.includes('Готова')
                        ? (isDark ? 'bg-emerald-950/40 text-emerald-400 border-emerald-700/50' : 'bg-emerald-50 text-emerald-800 border-emerald-300')
                        : c.status.includes('Подписана')
                        ? (isDark ? 'bg-blue-950/40 text-blue-300 border-blue-700/50' : 'bg-blue-50 text-blue-800 border-blue-300')
                        : (isDark ? 'bg-amber-950/40 text-amber-300 border-amber-700/50' : 'bg-amber-50 text-amber-800 border-amber-300')
                    }`}>
                      {c.status}
                    </span>
                    <div className={`text-[10px] mt-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                      Заказ от {c.requestedAt}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-4 pt-3 border-t text-[11px] flex items-center justify-between ${
            isDark ? 'border-[#252839] text-zinc-400' : 'border-gray-200 text-gray-600'
          }`}>
            <span>График работы деканата ИКИТ: Пн–Пт с 08:30 до 17:00</span>
            <span>Телефон: +7 (391) 291-22-11</span>
          </div>
        </div>

      </div>
    </div>
  );
};
