import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScheduleView } from './components/views/ScheduleView';
import { CoursesView } from './components/views/CoursesView';
import { SportView } from './components/views/SportView';
import { CertificatesView } from './components/views/CertificatesView';
import { AcademicPlanView } from './components/views/AcademicPlanView';
import { HeadmanJournalView } from './components/views/HeadmanJournalView';
import { TeacherGradingView } from './components/views/TeacherGradingView';
import { AuthModal } from './components/AuthModal';
import { apiGateway } from './services/apiGateway';
import { UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(apiGateway.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>('schedule');
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      
      {/* Оранжевая верхняя плашка СФУ */}
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setAuthModalOpen(true)}
      />

      {/* Основной контейнер портала */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row gap-5">
          
          {/* Навигационная панель */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            currentUser={currentUser}
          />

          {/* Рабочая область выбранного раздела */}
          <main className="flex-1 min-w-0">
            {currentTab === 'schedule' && (
              <ScheduleView currentUser={currentUser} />
            )}

            {currentTab === 'headman_journal' && (
              <HeadmanJournalView currentUser={currentUser} />
            )}

            {currentTab === 'teacher_grades' && (
              <TeacherGradingView currentUser={currentUser} />
            )}

            {currentTab === 'courses' && (
              <CoursesView />
            )}

            {currentTab === 'sport' && (
              <SportView currentUser={currentUser} />
            )}

            {currentTab === 'certificates' && (
              <CertificatesView currentUser={currentUser} />
            )}

            {currentTab === 'academic_plan' && (
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

      {/* Подвал */}
      <footer className="border-t border-gray-200 bg-white py-4 mt-auto text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ФГАОУ ВО «Сибирский федеральный университет», {new Date().getFullYear()}
          </div>
          <div className="text-[11px] text-gray-400">
            Деканат ИКИТ • timetable.sfu-kras.ru • e.sfu-kras.ru
          </div>
        </div>
      </footer>

    </div>
  );
}
