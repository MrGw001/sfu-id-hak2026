import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScheduleView } from './components/views/ScheduleView';
import { CoursesView } from './components/views/CoursesView';
import { SportView } from './components/views/SportView';
import { CertificatesView } from './components/views/CertificatesView';
import { AcademicPlanView } from './components/views/AcademicPlanView';
import { HeadmanJournalView } from './components/views/HeadmanJournalView';
import { TeacherGradingView } from './components/views/TeacherGradingView';
import { StudentGuidesView } from './components/views/StudentGuidesView';
import { AuditoriumSearchView } from './components/views/AuditoriumSearchView';
import { AuthModal } from './components/AuthModal';
import { apiGateway } from './services/apiGateway';
import { UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(apiGateway.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>('schedule');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Черная тема по умолчанию
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('sfu_theme_dark');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    // Гарантированная зачистка старых данных КИИ в localStorage браузера
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sfu_')) {
          const val = localStorage.getItem(key);
          if (val && val.includes('КИИ')) {
            localStorage.setItem(key, val.replace(/КИИ/g, 'КИ'));
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sfu_theme_dark', isDark ? 'true' : 'false');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'headman') {
      setCurrentTab('headman_journal');
    } else if (user.role === 'teacher') {
      setCurrentTab('teacher_grades');
    } else {
      setCurrentTab('schedule');
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d0e15] text-zinc-100' : 'bg-gray-50 text-gray-900'} font-sans flex flex-col transition-colors duration-200`}>
      
      {/* Фирменная желтая верхняя плашка СФУ с колокольчиком и логотипом */}
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setAuthModalOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Основной контейнер портала */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5">
          
          {/* Боковая навигационная панель */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            currentUser={currentUser}
            isDark={isDark}
          />

          {/* Рабочая область выбранного раздела */}
          <main className="flex-1 min-w-0">
            {currentTab === 'schedule' && (
              <ScheduleView currentUser={currentUser} />
            )}

            {currentTab === 'headman_journal' && (
              <HeadmanJournalView currentUser={currentUser} isDark={isDark} />
            )}

            {currentTab === 'student_guides' && (
              <StudentGuidesView currentUser={currentUser} isDark={isDark} />
            )}

            {currentTab === 'auditorium_search' && (
              <AuditoriumSearchView isDark={isDark} />
            )}

            {currentTab === 'teacher_grades' && (
              <TeacherGradingView currentUser={currentUser} />
            )}

            {currentTab === 'courses' && (
              <CoursesView currentUser={currentUser} />
            )}

            {currentTab === 'sport' && currentUser.role !== 'teacher' && (
              <SportView currentUser={currentUser} />
            )}

            {currentTab === 'certificates' && (
              <CertificatesView currentUser={currentUser} isDark={isDark} />
            )}

            {currentTab === 'academic_plan' && currentUser.role !== 'teacher' && (
              <AcademicPlanView currentUser={currentUser} />
            )}
          </main>

        </div>
      </div>

      {/* Окно авторизации по логину и паролю */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleUserChange}
      />

      {/* Аккуратный подвал без лишнего текста */}
      <footer className={`border-t py-4 mt-auto text-xs transition-colors ${
        isDark ? 'border-zinc-800/80 bg-[#0a0b10] text-zinc-500' : 'border-gray-200 bg-white text-gray-500'
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ФГАОУ ВО «Сибирский федеральный университет», {new Date().getFullYear()}
          </div>
          <div className="text-[11px] opacity-75">
            Единый портал цифровых сервисов СФУ (СФУ.ID)
          </div>
        </div>
      </footer>

    </div>
  );
}
