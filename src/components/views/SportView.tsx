import React, { useState } from 'react';
import { SportSection, UserProfile } from '../../types';
import { apiGateway } from '../../services/apiGateway';
import { MapPin, Check, Filter } from 'lucide-react';

interface SportViewProps {
  currentUser: UserProfile;
}

export const SportView: React.FC<SportViewProps> = ({ currentUser }) => {
  const [sections] = useState<SportSection[]>(apiGateway.getSportSections());
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [bookedToast, setBookedToast] = useState<string | null>(null);

  const categories = [
    'Все',
    'Водные виды спорта',
    'ОФП и фитнес',
    'Командные виды спорта',
    'Единоборства',
    'Зимние и циклические виды',
    'Другие виды спорта',
  ];

  const filteredSections = selectedCategory === 'Все'
    ? sections
    : sections.filter(s => s.category === selectedCategory);

  const handleBook = (sec: SportSection) => {
    setBookedToast(`Вы успешно записались на секцию «${sec.title}» в «${sec.complexName}»!`);
    setTimeout(() => setBookedToast(null), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Шапка спорта строго с 0 посещений и БЕЗ надписи (макс 27) */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-base font-bold text-gray-900">
              Запись на спорт — Юспорт СФУ (usports.online)
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Кафедра физической культуры ИФКСиТ • Запись на практические занятия и спортивные секции СФУ
            </p>
          </div>

          <div className="border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs text-gray-700">
            Посещений в семестре: <strong className="text-[#EB4F26] text-sm">0 посещений</strong>
          </div>
        </div>

        {bookedToast && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{bookedToast}</span>
          </div>
        )}
      </div>

      {/* Фильтр по категориям Юспорт */}
      <div className="bg-white border border-gray-200 p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#EB4F26]" />
          <span>Специализации платформы Юспорт СФУ ({sections.length} направлений):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 border text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'border-[#EB4F26] bg-[#EB4F26] text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Каталог всех специализаций Юспорт */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSections.map((sec) => (
          <div key={sec.id} className="bg-white border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-colors overflow-hidden">
            <div>
              {/* Фотография спортивной специализации Юспорт */}
              {sec.imageUrl && (
                <div className="w-full h-36 bg-gray-100 overflow-hidden relative border-b border-gray-200">
                  <img
                    src={sec.imageUrl}
                    alt={sec.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider uppercase backdrop-blur-xs">
                    {sec.category}
                  </div>
                </div>
              )}

              <div className="p-4">
                {!sec.imageUrl && (
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                    {sec.category}
                  </div>
                )}
                <div className="text-sm font-bold text-gray-900 leading-snug">
                  {sec.title}
                </div>
                <div className="text-xs text-gray-800 font-medium mt-1">
                  {sec.complexName}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                  <span>{sec.address}</span>
                </p>

                <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2.5 border border-gray-200 space-y-1">
                  <div>
                    <span className="text-gray-500">Преподаватель:</span>{' '}
                    <span className="font-medium text-gray-800">{sec.instructor}</span>
                  </div>
                  <div className="text-[11px] text-gray-600">
                    <span className="text-gray-500">Расписание:</span> {sec.scheduleDescription}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white">
              <span className="text-xs text-gray-500">
                Свободно: <strong className="text-gray-900">{sec.availableSlots} мест</strong>
              </span>

              <button
                onClick={() => handleBook(sec)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#EB4F26] hover:bg-[#d63f17] text-white transition-colors"
              >
                Записаться
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
