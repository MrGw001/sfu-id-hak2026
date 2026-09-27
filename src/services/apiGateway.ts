import { 
  UserProfile, 
  Lesson, 
  AttendanceRecord, 
  AbsenceReason,
  MoodleCourse,
  TeacherGradeEntry, 
  SportSection, 
  CertificateRequest, 
  AcademicPlanItem 
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_LESSONS, 
  MOCK_KI26_LESSONS,
  MOCK_MOODLE_COURSES,
  MOCK_ATTENDANCE, 
  MOCK_TEACHER_GRADES, 
  ALL_USPORT_SPECIALIZATIONS, 
  MOCK_CERTIFICATES, 
  MOCK_TEACHER_CERTIFICATES,
  MOCK_ACADEMIC_PLAN 
} from '../data/mockData';

class SfuApiGatewayService {
  private currentUser: UserProfile = MOCK_USERS[0];
  private attendance: AttendanceRecord[] = [...MOCK_ATTENDANCE];
  private teacherGrades: TeacherGradeEntry[] = [...MOCK_TEACHER_GRADES];
  private certificates: CertificateRequest[] = [...MOCK_CERTIFICATES];
  private teacherCertificates: CertificateRequest[] = [...MOCK_TEACHER_CERTIFICATES];
  private moodleCourses: MoodleCourse[] = [...MOCK_MOODLE_COURSES];
  private sportSections: SportSection[] = [...ALL_USPORT_SPECIALIZATIONS];

  constructor() {
    try {
      const savedUser = localStorage.getItem('sfu_user_session_v4');
      if (savedUser) {
        // Защита от старых кэшированных записей КИИ
        const cleanedStr = savedUser.replace(/КИИ/g, 'КИ');
        const parsed = JSON.parse(cleanedStr);
        if (parsed.group) parsed.group = parsed.group.replace(/КИИ/g, 'КИ');
        this.currentUser = parsed;
      }
    } catch {
      // storage ignored
    }
  }

  login(login: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanLogin = login.trim().toLowerCase();
    const user = MOCK_USERS.find(
      u => u.login.toLowerCase() === cleanLogin || u.email.toLowerCase() === cleanLogin
    );

    if (!user) {
      return { success: false, error: 'Пользователь не найден в системе СФУ' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Неверный пароль' };
    }

    this.currentUser = user;
    try {
      localStorage.setItem('sfu_user_session_v4', JSON.stringify(user));
    } catch {
      // storage ignored
    }
    return { success: true, user };
  }

  logout(): void {
    this.currentUser = MOCK_USERS[0];
    try {
      localStorage.removeItem('sfu_user_session_v4');
    } catch {
      // storage ignored
    }
  }

  getCurrentUser(): UserProfile {
    if (this.currentUser?.group) {
      this.currentUser.group = this.currentUser.group.replace(/КИИ/g, 'КИ');
    }
    return this.currentUser;
  }

  // --- Расписание по выбранной группе (заглушка с точными данными группы КИ26-02/3Б) ---
  getScheduleForGroup(groupName: string, instituteShort: string, dayName: string = 'Понедельник'): Lesson[] {
    const cleanGroup = groupName.trim().toUpperCase() || 'КИ26-02/3Б';

    // Для группы КИ26-02/3Б (КИ26-02/3Б) отдаем точные ленты со скриншота расписания СФУ
    if (cleanGroup.includes('КИ') || cleanGroup.includes('26') || cleanGroup.includes('КИ')) {
      const dayLessons = MOCK_KI26_LESSONS.filter(l => l.dayName === dayName);
      return dayLessons;
    }

    // Для других групп отдаем ленты по умолчанию
    const slots = [
      { num: 1, time: '08:30–10:05', sub: 'Аналитическая геометрия', type: 'Лекция' as const, aud: '1-15' },
      { num: 2, time: '10:15–11:50', sub: 'Информатика', type: 'Лекция' as const, aud: '5-13' },
      { num: 3, time: '12:00–13:35', sub: 'Математический анализ', type: 'Практика' as const, aud: '5-12' },
      { num: 4, time: '14:10–15:45', sub: 'Языки программирования', type: 'Практика' as const, aud: '4-10' },
    ];

    return slots.map(slot => ({
      id: `l-${cleanGroup}-${dayName}-${slot.num}`,
      lessonNumber: slot.num,
      timeSlot: slot.time,
      subject: slot.sub,
      type: slot.type,
      teacher: slot.num === 1 ? 'Кириллов К. А.' : 'Преподаватель кафедры',
      auditorium: slot.aud,
      buildingNumber: 17,
      buildingName: 'Корпус №17 ИКИТ',
      buildingAddress: 'ул. Академика Киренского, 26',
      group: cleanGroup,
      weekType: slot.num % 2 === 0 ? 'even' : 'odd',
      dayName: dayName,
    }));
  }

  // --- Электронные курсы e.sfu-kras.ru ---
  getMoodleCourses(): MoodleCourse[] {
    return this.moodleCourses;
  }

  // --- Журнал старосты ---
  getAttendance(): AttendanceRecord[] {
    return this.attendance;
  }

  updateAttendanceReason(id: string, reason: AbsenceReason): void {
    const isPresent = reason === 'Присутствует';
    this.attendance = this.attendance.map(a => 
      a.id === id ? { ...a, reason, present: isPresent } : a
    );
  }

  // --- Преподаватель (оценки) ---
  getTeacherGrades(): TeacherGradeEntry[] {
    return this.teacherGrades;
  }

  updateGrade(id: string, score: number): void {
    this.teacherGrades = this.teacherGrades.map(g => 
      g.id === id ? { ...g, score, status: score > 0 ? 'Оценено' : 'Не сдано' } : g
    );
  }

  // --- Юспорт СФУ: все специализации ---
  getSportSections(): SportSection[] {
    return this.sportSections;
  }

  // --- Заказ справок (Деканат для студентов / Отдел кадров для преподавателей) ---
  getCertificates(isTeacher: boolean = false): CertificateRequest[] {
    return isTeacher ? this.teacherCertificates : this.certificates;
  }

  orderCertificate(params: {
    title: string;
    destination: string;
    withOfficialSeal: boolean;
    urgency: 'regular' | 'urgent';
    targetPickupTime?: string;
    isTeacher?: boolean;
  }): CertificateRequest {
    const now = new Date();
    // Расчет точного срока готовности
    let readyDate = new Date();
    let readyDesc = '';

    if (params.targetPickupTime) {
      readyDesc = `К указанному времени: ${params.targetPickupTime}`;
    } else if (params.urgency === 'urgent') {
      readyDate.setDate(now.getDate() + 1);
      readyDesc = `${readyDate.toLocaleDateString('ru-RU')} к 16:00 (срочно, 1 рабочий день)`;
    } else {
      readyDate.setDate(now.getDate() + 3);
      readyDesc = `${readyDate.toLocaleDateString('ru-RU')} к 14:00 (стандартный срок, 3 рабочих дня)`;
    }

    const isTeacher = Boolean(params.isTeacher);

    const newCert: CertificateRequest = {
      id: String(Date.now()).slice(-4),
      title: params.title,
      destination: params.destination,
      requestedAt: `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`,
      withOfficialSeal: params.withOfficialSeal,
      urgency: params.urgency,
      readyTimeEst: readyDesc,
      targetPickupTime: params.targetPickupTime,
      status: isTeacher ? 'В обработке (Отдел кадров)' : 'На рассмотрении в деканате',
      pickupOffice: isTeacher 
        ? 'Отдел кадров ППС (каб. УЛК-104, ул. Киренского, 26)'
        : 'Деканат ИКИТ (каб. УЛК-218, ул. Киренского, 26)',
    };

    if (isTeacher) {
      this.teacherCertificates = [newCert, ...this.teacherCertificates];
    } else {
      this.certificates = [newCert, ...this.certificates];
    }
    return newCert;
  }

  getAcademicPlan(): AcademicPlanItem[] {
    return MOCK_ACADEMIC_PLAN;
  }
}

export const apiGateway = new SfuApiGatewayService();
