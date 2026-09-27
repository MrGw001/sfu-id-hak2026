import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, Navigation, Compass } from 'lucide-react';

interface AuditoriumSearchViewProps {
  isDark?: boolean;
}

interface RoomInfo {
  code: string;
  title: string;
  building: string;
  address: string;
  floor: number;
  type: string;
  description: string;
  gisUrl: string;
}

const GIS_SFU_BASE = 'https://gis.sfu-kras.ru/';

const ROOMS_DB: RoomInfo[] = [
  {
    code: 'УЛК-412',
    title: 'Компьютерная лаборатория программной инженерии',
    building: 'УЛК ИКИТ (Учебно-лабораторный корпус)',
    address: 'ул. Академика Киренского, 26 к.1',
    floor: 4,
    type: 'Компьютерный класс',
    description: 'Аудитория для проведения лабораторных работ по программированию, базам данных и архитектуре облачных систем.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'УЛК-207',
    title: 'Учебно-организационный отдел ИКИТ (УОО)',
    building: 'УЛК ИКИТ (Учебно-лабораторный корпус)',
    address: 'ул. Академика Киренского, 26 к.1',
    floor: 2,
    type: 'Администрация / Деканат',
    description: 'Выдача справок об обучении, прием заявлений на соц. стипендию (ГСС), работа с учебными планами.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'УЛК-208',
    title: 'Учебный отдел (дополнительные вопросы)',
    building: 'УЛК ИКИТ (Учебно-лабораторный корпус)',
    address: 'ул. Академика Киренского, 26 к.1',
    floor: 2,
    type: 'Администрация',
    description: 'Консультации студентов очной и заочной формы обучения ИКИТ СФУ.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'УЛК-209',
    title: 'Отдел договоров и платного обучения',
    building: 'УЛК ИКИТ (Учебно-лабораторный корпус)',
    address: 'ул. Академика Киренского, 26 к.1',
    floor: 2,
    type: 'Договорной отдел',
    description: 'Казанцева Лидия Сергеевна. Оформление и сопровождение договоров на коммерческое обучение.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'УЛК-323',
    title: 'Кабинет зам. директора по воспитательной работе',
    building: 'УЛК ИКИТ (Учебно-лабораторный корпус)',
    address: 'ул. Академика Киренского, 26 к.1',
    floor: 3,
    type: 'Руководство института',
    description: 'Русак Илья Андреевич. Вопросы внеучебной деятельности, стипендий, волонтерства и мероприятий.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'УЛК-424',
    title: 'Отдел по заселению в общежития ИКИТ',
    building: 'УЛК ИКИТ (Учебно-лабораторный корпус)',
    address: 'ул. Академика Киренского, 26 к.1',
    floor: 4,
    type: 'Общежития',
    description: 'Гончарик Галина Владимировна. Выдача ордеров на заселение, распределение комнат в кампусе.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'Д-511',
    title: 'Второй отдел СФУ (Воинский учет)',
    building: 'Корпус «Д» (Политехнический институт)',
    address: 'ул. Академика Киренского, 26А',
    floor: 5,
    type: 'Воинский учет',
    description: 'Постановка первокурсников-юношей на воинский учет. Обязательно для получения студенческого билета.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'Б-205',
    title: 'Большая лекционная поточная аудитория',
    building: 'Корпус «Пирамида» (Главный корпус СФУ)',
    address: 'пр. Свободный, 79/10',
    floor: 2,
    type: 'Лекционная аудитория',
    description: 'Поточная аудитория со стульями-амфитеатром и мультимедийным оборудованием для лекций нескольких групп.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'УЛК-302',
    title: 'Семинарская аудитория кафедры высшей математики',
    building: 'УЛК ИКИТ (Учебно-лабораторный корпус)',
    address: 'ул. Академика Киренского, 26 к.1',
    floor: 3,
    type: 'Семинарская',
    description: 'Практические занятия по математическому анализу, линейной алгебре и дискретной математике.',
    gisUrl: GIS_SFU_BASE
  },
  {
    code: 'Спорткомплекс',
    title: 'Спорткомплекс «Политехник» СФУ',
    building: 'СК «Политехник»',
    address: 'ул. Академика Киренского, 26Б',
    floor: 1,
    type: 'Спорт',
    description: 'Игровые залы (баскетбол, волейбол), тренажерный зал, легкоатлетический манеж и лыжная база.',
    gisUrl: GIS_SFU_BASE
  }
];

export const AuditoriumSearchView: React.FC<AuditoriumSearchViewProps> = ({ isDark = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<'all' | 'kirenskogo' | 'svobodny'>('all');

  const filteredRooms = ROOMS_DB.filter(room => {
    const matchesSearch = 
      room.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCampus === 'kirenskogo') {
      return room.address.includes('Киренского');
    }
    if (selectedCampus === 'svobodny') {
      return room.address.includes('Свободный');
    }
    return true;
  });

  return (
    <div className={`space-y-4 ${isDark ? 'text-[#f4f4f6]' : 'text-gray-900'}`}>
      
      {/* Главный промо-баннер перевода на ГИС СФУ (прямоугольный) */}
      <div className={`p-5 rounded-none border relative overflow-hidden ${
        isDark 
          ? 'bg-[#141620] border-[#252839]' 
          : 'bg-white border-gray-300 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-none text-[10px] font-extrabold uppercase bg-[#F15A24] text-white">
                ГИС СФУ
              </span>
              <span className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                Геоинформационная система навигации по кампусам СФУ
              </span>
            </div>
            <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Интерактивная карта и поиск аудиторий СФУ
            </h1>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
              Официальная 3D-карта кампусов Сибирского федерального университета: детальные поэтажные планы корпусов, аудиторий, столовых, переходов и спортивных комплексов.
            </p>
          </div>

          <a
            href={GIS_SFU_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-none bg-[#F15A24] hover:bg-[#d84a18] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Перейти на ГИС СФУ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Панель поиска и фильтров (строгие квадратные углы) */}
      <div className={`p-4 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите номер аудитории (например, УЛК-412, Б-205, Д-511)..."
              className={`w-full pl-10 pr-4 py-2 text-xs rounded-none border outline-none transition-colors ${
                isDark 
                  ? 'bg-[#191c28] border-[#2f3347] text-white placeholder-zinc-500 focus:border-[#F15A24]' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#F15A24]'
              }`}
            />
          </div>

          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedCampus('all')}
              className={`px-3 py-2 text-xs font-semibold rounded-none border transition-colors ${
                selectedCampus === 'all'
                  ? 'bg-[#F15A24] text-white border-[#F15A24] font-bold'
                  : isDark ? 'bg-[#191c28] text-zinc-300 border-[#2f3347] hover:text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Все корпуса
            </button>
            <button
              onClick={() => setSelectedCampus('kirenskogo')}
              className={`px-3 py-2 text-xs font-semibold rounded-none border transition-colors ${
                selectedCampus === 'kirenskogo'
                  ? 'bg-[#F15A24] text-white border-[#F15A24] font-bold'
                  : isDark ? 'bg-[#191c28] text-zinc-300 border-[#2f3347] hover:text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              ул. Киренского (ИКИТ)
            </button>
            <button
              onClick={() => setSelectedCampus('svobodny')}
              className={`px-3 py-2 text-xs font-semibold rounded-none border transition-colors ${
                selectedCampus === 'svobodny'
                  ? 'bg-[#F15A24] text-white border-[#F15A24] font-bold'
                  : isDark ? 'bg-[#191c28] text-zinc-300 border-[#2f3347] hover:text-white' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              пр. Свободный
            </button>
          </div>
        </div>
      </div>

      {/* Быстрые подсказки корпусов (квадратные списки) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <a
          href={GIS_SFU_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3.5 rounded-none border transition-all group ${
            isDark 
              ? 'bg-[#141620] border-[#252839] hover:border-[#F15A24]/70 hover:bg-[#191c28]' 
              : 'bg-white border-gray-300 hover:border-[#F15A24] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F15A24]">Корпус «Пирамида» СФУ</span>
            <ExternalLink className={`w-3 h-3 group-hover:text-[#F15A24] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>пр. Свободный, 79/10</div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Ректорат, Библиотека, аудитории Б-205, Б-101</div>
        </a>

        <a
          href={GIS_SFU_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3.5 rounded-none border transition-all group ${
            isDark 
              ? 'bg-[#141620] border-[#252839] hover:border-[#F15A24]/70 hover:bg-[#191c28]' 
              : 'bg-white border-gray-300 hover:border-[#F15A24] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F15A24]">УЛК ИКИТ (Корпус 1)</span>
            <ExternalLink className={`w-3 h-3 group-hover:text-[#F15A24] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>ул. Академика Киренского, 26 к.1</div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>УОО ИКИТ, кафедры, комп. классы УЛК-412, УЛК-302</div>
        </a>

        <a
          href={GIS_SFU_BASE}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3.5 rounded-none border transition-all group ${
            isDark 
              ? 'bg-[#141620] border-[#252839] hover:border-[#F15A24]/70 hover:bg-[#191c28]' 
              : 'bg-white border-gray-300 hover:border-[#F15A24] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F15A24]">Корпус «Д» и Воинский учет</span>
            <ExternalLink className={`w-3 h-3 group-hover:text-[#F15A24] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>ул. Академика Киренского, 26А</div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Второй отдел СФУ (ауд. Д-511, 5 этаж)</div>
        </a>
      </div>

      {/* Список найденных аудиторий (квадратные карточки со строгими списками) */}
      <div className="space-y-3">
        <div className={`text-xs font-bold tracking-wider uppercase flex items-center justify-between ${
          isDark ? 'text-zinc-400' : 'text-gray-600'
        }`}>
          <span>Найдено аудиторий: {filteredRooms.length}</span>
          <span className="text-[11px] font-normal normal-case">
            Переход по ссылке: <strong className="text-[#F15A24]">gis.sfu-kras.ru</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredRooms.map((room) => (
            <div
              key={room.code}
              className={`p-4 rounded-none border transition-all flex flex-col justify-between ${
                isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-none text-xs font-extrabold font-mono bg-[#F15A24]/15 text-[#F15A24] border border-[#F15A24]/30">
                      {room.code}
                    </span>
                    <h3 className={`text-xs font-bold mt-2 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                      {room.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-none border shrink-0 ${
                    isDark ? 'bg-[#191c28] border-[#2f3347] text-zinc-400' : 'bg-gray-100 border-gray-200 text-gray-700'
                  }`}>
                    {room.floor} этаж
                  </span>
                </div>

                <div className={`mt-2 text-xs flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                  <MapPin className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                  <span>{room.building} ({room.address})</span>
                </div>

                <p className={`mt-2 text-[11px] leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                  {room.description}
                </p>
              </div>

              <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
                isDark ? 'border-[#252839]' : 'border-gray-200'
              }`}>
                <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{room.type}</span>
                <a
                  href={room.gisUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-none bg-[#F15A24] hover:bg-[#d84a18] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Открыть в ГИС СФУ</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
