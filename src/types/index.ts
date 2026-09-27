export type UserRole = 'student' | 'headman' | 'teacher';

export interface UserProfile {
  id: string;
  login: string;
  password?: string;
  fullName: string;
  firstName: string; // для "Привет, ИМЯ 👋!"
  role: UserRole;
  institute: string;
  instituteShort: string;
  specialty: string;
  group: string;
  studentCardNumber: string; // строго только цифры
  recordBookNumber: string;  // строго только цифры
  courseNumber: number;
  studyForm: 'Очная, бюджет' | 'Очная, договор' | 'Заочная';
  avatarUrl: string;
  email: string;
  phone: string;
  averageGrade: number;
  sportHoursDone: number; // 0 посещений
  sportHoursRequired: number;
  academicDebtsCount: number;
  hasScholarship: boolean;
  scholarshipAmount?: number;
}

export type LessonType = 'Лекция' | 'Практика' | 'Лабораторная';

export interface Lesson {
  id: string;
  subject: string;
  type: LessonType; // практика, лекция, лабораторная
  timeSlot: string; // "08:30–10:05"
  lessonNumber: number; // лента №1, лента №2...
  teacher: string;
  auditorium: string;
  buildingNumber: number;
  buildingAddress: string;
  buildingName: string;
  group: string;
  weekType: 'all' | 'even' | 'odd'; // четная / нечетная неделя
  dayName: string;
}

export type AbsenceReason = 
  | 'Присутствует' 
  | 'По болезни (справка)' 
  | 'Уважительная (заявление)' 
  | 'Олимпиада / Хакатон СФУ' 
  | 'Без уважительной причины';

export interface AttendanceRecord {
  id: string;
  studentName: string;
  studentCard: string;
  reason: AbsenceReason;
  present: boolean;
}

export interface MoodleCourse {
  id: string;
  code?: string;
  title: string;
  department: string;
  progressPercent?: number;
}

export interface TeacherGradeEntry {
  id: string;
  studentName: string;
  group: string;
  controlType: string;
  score: number;
  maxScore: number;
  status: 'Оценено' | 'На проверке' | 'Не сдано';
}

// Специализация с официального портала u-sport.sfu-kras.ru с картинками и бейджами
export interface SportSection {
  id: string;
  title: string;
  category: string;
  complexName: string;
  address: string;
  instructor: string;
  imageUrl: string;
  availableSlots: number;
  totalSlots: number;
  scheduleDescription: string;
}

export interface CertificateRequest {
  id: string;
  title: string;
  destination: string;
  requestedAt: string;
  withOfficialSeal: boolean; // выбор синей гербовой печати
  urgency: 'regular' | 'urgent'; // обычная (3 раб. дня) / срочная (1 раб. день)
  readyTimeEst: string; // точное расчетное время готовности
  targetPickupTime?: string; // нужное время для получения справки
  status: 'На рассмотрении в деканате' | 'Подписана деканом' | 'Готова к выдаче в деканате' | 'В обработке (Отдел кадров)' | 'Подписана начальником УП' | 'Готова к выдаче (каб. УЛК-104)' | string;
  pickupOffice: string; // Деканат ИКИТ или Отдел кадров
}

export interface AcademicPlanItem {
  id: string;
  semester: number;
  discipline: string;
  hoursTotal: number;
  credits: number;
  controlType: string;
  grade?: string;
  points?: number;
}
