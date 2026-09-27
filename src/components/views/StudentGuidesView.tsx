import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Users
} from 'lucide-react';

interface StudentGuidesViewProps {
  currentUser: UserProfile;
  isDark?: boolean;
}

export const StudentGuidesView: React.FC<StudentGuidesViewProps> = ({ currentUser, isDark = true }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'links' | 'office' | 'stipend' | 'military'>('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const isHeadman = currentUser.role === 'headman';

  const links = [
    {
      title: 'users.sfu-kras.ru',
      url: 'https://users.sfu-kras.ru',
      desc: 'Регистрация и актуализация единой учетной записи СФУ (СФУ.ID).',
      tag: 'Аккаунт СФУ'
    },
    {
      title: 'e.sfu-kras.ru',
      url: 'https://e.sfu-kras.ru',
      desc: 'Образовательная платформа «Е-курсы»: учебные материалы, тесты, сдача практических и лабораторных работ.',
      tag: 'Обучение'
    },
    {
      title: 'dec.sfu-kras.ru/cabinet',
      url: 'https://dec.sfu-kras.ru/cabinet',
      desc: 'Личный кабинет студента: электронная зачетка, заказ справок об обучении, бланки заявлений на мат. помощь и соц. стипендию, уведомления и приказы.',
      tag: 'Документы'
    },
    {
      title: 'ikit.sfu-kras.ru',
      url: 'https://ikit.sfu-kras.ru',
      desc: 'Официальный портал Института космических и информационных технологий СФУ: новости, кафедры, расписание сессии.',
      tag: 'Институт'
    },
    {
      title: 'vk.com/ikitinfo',
      url: 'https://vk.com/ikitinfo',
      desc: 'Официальный новостной информер ИКИТ ВКонтакте — анонсы, мероприятия, конкурсы и хакатоны.',
      tag: 'Соцсети'
    },
    {
      title: 'vk.com/yoo_ikit',
      url: 'https://vk.com/yoo_ikit',
      desc: 'Группа учебно-организационного отдела (УОО ИКИТ): важные объявления по учебе, долгам и приказам.',
      tag: 'УОО'
    },
    {
      title: 'edu.sfu-kras.ru/timetable',
      url: 'https://edu.sfu-kras.ru/timetable',
      desc: 'Официальное расписание учебных занятий студентов и преподавателей СФУ.',
      tag: 'Расписание'
    }
  ];

  return (
    <div className={`space-y-4 ${isDark ? 'text-[#f4f4f6]' : 'text-gray-900'}`}>
      
      {/* Заголовок страницы и бэдж роли (строгие квадратные углы) */}
      <div className={`p-5 rounded-none border ${
        isDark 
          ? 'bg-[#141620] border-[#252839]' 
          : 'bg-white border-gray-300 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-[#F15A24]/15 border border-[#F15A24]/30 flex items-center justify-center text-[#F15A24]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Памятка первокурсника и старосты ИКИТ СФУ
                </h1>
                <span className="px-2 py-0.5 rounded-none text-[10px] font-bold uppercase bg-[#F15A24]/15 text-[#F15A24] border border-[#F15A24]/30">
                  {isHeadman ? 'Для старосты' : 'Для студентов'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                Официальный справочник контактов, режимов работы отделов, оформления соц. стипендии и воинского учета
              </p>
            </div>
          </div>

          {copiedText && (
            <div className="px-3 py-1.5 rounded-none bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Скопировано: {copiedText}</span>
            </div>
          )}
        </div>

        {/* Быстрые фильтры по разделам (квадратные вкладки) */}
        <div className={`flex flex-wrap gap-1 mt-4 pt-4 border-t ${isDark ? 'border-[#252839]' : 'border-gray-200'}`}>
          {[
            { id: 'all', label: 'Все разделы' },
            { id: 'links', label: 'Полезные ссылки' },
            { id: 'office', label: 'Режим работы УОО и контакты' },
            { id: 'stipend', label: 'Социальная стипендия (ГСС)' },
            { id: 'military', label: 'Воинский учет (2 отдел)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-none border transition-all ${
                activeTab === tab.id
                  ? 'bg-[#F15A24] text-white border-[#F15A24] font-bold'
                  : isDark
                    ? 'bg-[#191c28] border-[#2f3347] text-zinc-300 hover:text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* РАЗДЕЛ 1: ПОЛЕЗНЫЕ ССЫЛКИ (Квадратные карточки) */}
      {(activeTab === 'all' || activeTab === 'links') && (
        <section className={`p-5 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none bg-[#F15A24]" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#F15A24]">
                Полезные ссылки и сервисы СФУ
              </h2>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Стр. 1 официальной памятки</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {links.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3.5 rounded-none border transition-all flex flex-col justify-between group ${
                  isDark 
                    ? 'bg-[#191c28] border-[#252839] hover:border-[#F15A24]/70 hover:bg-[#202334]' 
                    : 'bg-gray-50 border-gray-300 hover:border-[#F15A24] hover:bg-orange-50/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#F15A24] group-hover:underline flex items-center gap-1.5">
                      {item.title}
                      <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-none border ${
                      isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-400' : 'bg-white border-gray-200 text-gray-700'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                    {item.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* РАЗДЕЛ 2: РЕЖИМ РАБОТЫ УОО ИКИТ И КОНТАКТЫ */}
      {(activeTab === 'all' || activeTab === 'office') && (
        <section className={`p-5 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none bg-[#F15A24]" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#F15A24]">
                Режим работы УОО ИКИТ и контакты сотрудников
              </h2>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Стр. 2 официальной памятки</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className={`p-3.5 rounded-none border ${isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'}`}>
              <div className={`flex items-center gap-2 text-xs font-semibold mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                <Clock className="w-4 h-4 text-[#F15A24]" />
                <span>Общий график УОО</span>
              </div>
              <div className={`text-xs font-bold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>Понедельник – Пятница</div>
              <div className="text-xs text-[#F15A24] font-mono font-semibold mt-0.5">08:30 – 17:00</div>
              <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Обед: 12:00 – 13:00</div>
            </div>

            <div className={`p-3.5 rounded-none border ${isDark ? 'bg-[#F15A24]/10 border-[#F15A24]/30' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex items-center gap-2 text-[#F15A24] text-xs font-bold mb-1">
                <Users className="w-4 h-4 text-[#F15A24]" />
                <span>Прием студентов:</span>
              </div>
              <div className="text-base font-extrabold text-[#F15A24] font-mono">13:00 – 15:00</div>
              <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Ежедневно в указанный интервал</div>
            </div>

            <div className={`p-3.5 rounded-none border ${isDark ? 'bg-red-950/20 border-red-800/40' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Внимание! Среда</span>
              </div>
              <div className="text-xs font-bold text-red-500">НЕПРИЕМНЫЙ ДЕНЬ</div>
              <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Внутренняя работа отдела с приказами</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Учебно-организационный отдел */}
            <div className={`p-4 rounded-none border ${isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'}`}>
              <div className={`text-xs font-bold flex items-center justify-between ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                <span>Учебно-организационный отдел (УОО ИКИТ)</span>
                <span className="text-[11px] text-[#F15A24] font-mono font-semibold">каб. УЛК-207, УЛК-208</span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                Вопросы по учебному плану, долгам, сессии, выдаче справок и ведомостей.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard('2912-237', 'Телефон УЛК207')}
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-3 h-3 text-[#F15A24]" />
                  <span>ауд. УЛК207: 2912-237</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </button>
                <button
                  onClick={() => copyToClipboard('243-07-24', 'Телефон УЛК208')}
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-3 h-3 text-[#F15A24]" />
                  <span>ауд. УЛК208: 243-07-24</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </button>
              </div>
            </div>

            {/* Заселение в общежитие */}
            <div className={`p-4 rounded-none border ${isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'}`}>
              <div className={`text-xs font-bold flex items-center justify-between ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                <span>По вопросам заселения в общежитие</span>
                <span className="text-[11px] text-[#F15A24] font-mono font-semibold">каб. УЛК-424</span>
              </div>
              <div className="text-xs font-medium text-[#F15A24] mt-0.5">
                Гончарик Галина Владимировна
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard('249-75-09', 'Телефон общежитий')}
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-3 h-3 text-[#F15A24]" />
                  <span>249-75-09</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </button>
                <a
                  href="mailto:ggoncharik@sfu-kras.ru"
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Mail className="w-3 h-3 text-[#F15A24]" />
                  <span>ggoncharik@sfu-kras.ru</span>
                </a>
              </div>
            </div>

            {/* Отдел договоров */}
            <div className={`p-4 rounded-none border ${isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'}`}>
              <div className={`text-xs font-bold flex items-center justify-between ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                <span>Отдел договоров и платного обучения</span>
                <span className="text-[11px] text-[#F15A24] font-mono font-semibold">каб. УЛК-209</span>
              </div>
              <div className="text-xs font-medium text-[#F15A24] mt-0.5">
                Казанцева Лидия Сергеевна
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard('2912-294', 'Телефон отдела договоров')}
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-3 h-3 text-[#F15A24]" />
                  <span>2912-294</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </button>
                <a
                  href="mailto:lkazantceva@sfu-kras.ru"
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Mail className="w-3 h-3 text-[#F15A24]" />
                  <span>lkazantceva@sfu-kras.ru</span>
                </a>
              </div>
            </div>

            {/* Воспитательная работа */}
            <div className={`p-4 rounded-none border ${isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'}`}>
              <div className={`text-xs font-bold flex items-center justify-between ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                <span>Зам. директора по воспитательной работе</span>
                <span className="text-[11px] text-[#F15A24] font-mono font-semibold">каб. УЛК-323</span>
              </div>
              <div className="text-xs font-medium text-[#F15A24] mt-0.5">
                Русак Илья Андреевич
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard('291-25-22', 'Телефон зам. директора')}
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-3 h-3 text-[#F15A24]" />
                  <span>291-25-22</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </button>
                <a
                  href="mailto:irusak@sfu-kras.ru"
                  className={`px-2.5 py-1 rounded-none border text-xs font-mono flex items-center gap-1.5 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Mail className="w-3 h-3 text-[#F15A24]" />
                  <span>irusak@sfu-kras.ru</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* РАЗДЕЛ 3: ГОСУДАРСТВЕННАЯ СОЦИАЛЬНАЯ СТИПЕНДИЯ */}
      {(activeTab === 'all' || activeTab === 'stipend') && (
        <section className={`p-5 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none bg-[#F15A24]" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#F15A24]">
                Назначение государственной социальной стипендии
              </h2>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Стр. 3 официальной памятки</span>
          </div>

          <div className={`p-4 rounded-none border mb-4 ${isDark ? 'bg-[#F15A24]/10 border-[#F15A24]/30 text-zinc-200' : 'bg-orange-50 border-orange-200 text-gray-800'}`}>
            <p className="text-xs leading-relaxed font-medium">
              Социальная стипендия назначается на основании <strong>оригинала уведомления из Управления социальной защиты населения (УСЗН)</strong> и личного заявления студента.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: 1,
                title: 'Сбор пакета документов в УСЗН по месту прописки',
                content: (
                  <ul className={`list-disc list-inside space-y-1 text-xs mt-1 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                    <li>Справка о составе семьи (выписка из домовой книги);</li>
                    <li>Справки о доходах всех членов семьи (за предыдущие 3–4 месяца);</li>
                    <li>Справка о том, что вы являетесь студентом ИКИТ СФУ;</li>
                    <li>Справка о размере получаемой стипендии.</li>
                  </ul>
                )
              },
              {
                step: 2,
                title: 'Заказ справки об обучении (студента ИКИТ СФУ)',
                content: (
                  <div className={`text-xs mt-1 space-y-1 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                    <p>Заказывается в личном кабинете студента: <a href="https://dec.sfu-kras.ru/cabinet/" target="_blank" rel="noreferrer" className="text-[#F15A24] underline font-mono">dec.sfu-kras.ru/cabinet</a> (для УСЗН по месту требования, без гербовой печати).</p>
                    <p className={isDark ? 'text-zinc-400' : 'text-gray-500'}><strong>Где забрать:</strong> возле учебного отдела ИКИТ (ул. Киренского, 26 к.1, каб. УЛК-207).</p>
                  </div>
                )
              },
              {
                step: 3,
                title: 'Заказ справки о размере получаемой стипендии',
                content: (
                  <div className={`text-xs mt-1 space-y-1 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                    <p>Заказывается на сайте СФУ: <a href="http://www.sfu-kras.ru/students/spravka" target="_blank" rel="noreferrer" className="text-[#F15A24] underline font-mono">sfu-kras.ru/students/spravka</a> (за предыдущие 3–4 месяца).</p>
                    <p className={isDark ? 'text-zinc-400' : 'text-gray-500'}><strong>Где забрать:</strong> в бухгалтерии СФУ (пр. Свободный, 79, каб. 12-13, тел. 206-203-8).</p>
                    <p className="text-[#F15A24] text-[11px] font-semibold">⚠️ 1 курс может заказывать данный вид справок не ранее 01.12.2026. До этого момента справка заказывается по предыдущему месту обучения!</p>
                  </div>
                )
              },
              {
                step: 4,
                title: 'Получение справки в Управлении соц. защиты',
                content: (
                  <p className={`text-xs mt-1 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                    На основании предоставленных документов УСЗН выдает справку установленного образца о назначении «Государственной социальной помощи».
                  </p>
                )
              },
              {
                step: 5,
                title: 'Личная подача заявления в учебный отдел ИКИТ',
                content: (
                  <div className={`text-xs mt-1 space-y-1 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                    <p>Уведомление из УСЗН необходимо <strong>лично предоставить в учебный отдел ИКИТ (ауд. УЛК207)</strong> и написать заявление на получение государственной социальной стипендии (строго в часы приема: ежедневно с 13:00 до 15:00, кроме среды).</p>
                    <p className="text-[#F15A24] font-medium"><strong>При себе необходимо иметь:</strong> паспорт, временную прописку (если есть), знать свои ИНН и СНИЛС!</p>
                  </div>
                )
              }
            ].map((s) => (
              <div key={s.step} className={`p-4 rounded-none border flex items-start gap-3.5 ${
                isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="w-7 h-7 rounded-none bg-[#F15A24] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>{s.title}</div>
                  {s.content}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-4 p-3 rounded-none border text-xs flex items-center gap-2 ${
            isDark ? 'bg-red-950/20 border-red-800/40 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span><strong>ВНИМАНИЕ!</strong> УСЗН выдает справку на один календарный год. Затем выплаты соц. стипендии прекращаются до момента предоставления новой справки!</span>
          </div>
        </section>
      )}

      {/* РАЗДЕЛ 4: ПОСТАНОВКА НА ВОИНСКИЙ УЧЕТ */}
      {(activeTab === 'all' || activeTab === 'military') && (
        <section className={`p-5 rounded-none border ${isDark ? 'bg-[#141620] border-[#252839]' : 'bg-white border-gray-300 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none bg-[#F15A24]" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-[#F15A24]">
                Постановка на воинский учет (Второй отдел СФУ)
              </h2>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Стр. 4 официальной памятки</span>
          </div>

          <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
            Все студенты-юноши, зачисленные в СФУ на первый курс очной формы обучения и имеющие гражданство РФ, <strong>обязаны явиться во Второй отдел</strong> для постановки на воинский учет.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Необходимые документы */}
            <div className={`p-4 rounded-none border ${isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'}`}>
              <div className="text-xs font-bold text-[#F15A24] mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>При себе необходимо иметь:</span>
              </div>
              <ul className={`space-y-1.5 text-xs ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                  <span>Паспорт РФ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                  <span>Военный билет или приписное свидетельство</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                  <span>Фото 3 × 4 см (1 шт)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                  <span>ИНН и СНИЛС</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                  <span>Водительские права (если есть)</span>
                </li>
              </ul>
            </div>

            {/* Местонахождение и часы работы */}
            <div className={`p-4 rounded-none border ${isDark ? 'bg-[#191c28] border-[#252839]' : 'bg-gray-50 border-gray-300'}`}>
              <div className="text-xs font-bold text-[#F15A24] mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Куда обращаться:</span>
              </div>
              <div className={`text-xs font-bold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                Второй отдел СФУ (ул. Киренского, 26А, корпус «Д», ауд. Д511)
              </div>

              <div className={`mt-2 text-xs space-y-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                <div>Режим работы: <strong>ежедневно с 8:30 до 17:00</strong></div>
                <div>Обед: <strong>с 12:00 до 13:00</strong></div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  onClick={() => copyToClipboard('2912-185', 'Телефон 2-го отдела')}
                  className={`px-2 py-1 rounded-none border text-[11px] font-mono flex items-center gap-1 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-2.5 h-2.5 text-[#F15A24]" />
                  <span>2912-185</span>
                </button>
                <button
                  onClick={() => copyToClipboard('249-71-17', 'Телефон 2-го отдела')}
                  className={`px-2 py-1 rounded-none border text-[11px] font-mono flex items-center gap-1 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-2.5 h-2.5 text-[#F15A24]" />
                  <span>249-71-17</span>
                </button>
                <button
                  onClick={() => copyToClipboard('249-72-60', 'Телефон 2-го отдела')}
                  className={`px-2 py-1 rounded-none border text-[11px] font-mono flex items-center gap-1 ${
                    isDark ? 'bg-[#141620] border-[#2f3347] text-zinc-200 hover:bg-[#202334]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Phone className="w-2.5 h-2.5 text-[#F15A24]" />
                  <span>249-72-60</span>
                </button>
              </div>
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-none border text-xs flex items-center gap-2 ${
            isDark ? 'bg-[#F15A24]/10 border-[#F15A24]/30 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-900'
          }`}>
            <ShieldAlert className="w-4 h-4 text-[#F15A24] shrink-0" />
            <span><strong>ВНИМАНИЕ!</strong> Студенческий билет студентам-юношам будет выдаваться только при наличии справки из Второго отдела о постановке на воинский учет!</span>
          </div>
        </section>
      )}

    </div>
  );
};
