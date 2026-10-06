export type UserRole = 'admin' | 'faculty';

export type AccentColor = 'blue' | 'teal' | 'purple' | 'green' | 'amber' | 'rose';

export interface ThemeConfig {
  id: string;
  name: string;
  accent: AccentColor;
  primaryHex: string;
  deepHex: string;
  lightHex: string;
  borderHex: string;
  glowHex: string;
  description: string;
}

export interface ClassPeriod {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number;
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "10:40"
  subject: string;
  subjectCode: string;
  semester: number;
  section: string;
  room: string;
}

export interface SyllabusModule {
  id: string;
  name: string;
  completed: boolean;
}

export interface FacultySubject {
  id: string;
  name: string;
  code: string;
  semester: number;
  section: string;
  modules: SyllabusModule[];
}

export interface FacultyMember {
  id: string;
  name: string;
  role: 'faculty';
  position: string;
  department: 'Computer Science' | 'Electrical Engineering' | 'Mechanical Engineering';
  deptShort: 'CS' | 'EE' | 'ME';
  email: string;
  avatarInitials: string;
  currentSection: string; // e.g. "A Sec", "B Sec"
  timetable: ClassPeriod[];
  subjects: FacultySubject[];
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'admin';
  position: string;
  email: string;
  avatarInitials: string;
}

export type CurrentUser = AdminUser | FacultyMember;

export interface SubstitutionSlot {
  date: string;       // YYYY-MM-DD
  day: string;        // Monday, Tuesday, etc.
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  section: string;
  semester: number;
  substituteFacultyId: string;
  substituteFacultyName: string;
}

export interface LeaveRequest {
  id: string;
  facultyId: string;
  facultyName: string;
  department: string;
  deptShort: string;
  fromDate: string;   // YYYY-MM-DD
  toDate: string;     // YYYY-MM-DD
  daysCount: number;
  reason: string;
  substitutions: SubstitutionSlot[];
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export type HolidayType = 'festival' | 'restricted' | 'observance' | 'saturday';

export interface AcademicHoliday {
  id: string;
  date: string;       // YYYY-MM-DD
  title: string;
  type: HolidayType;
  description: string;
}

export type FacultyLiveStatus = 'In Class' | 'Free' | 'On Leave';

export interface FacultyStatusDetail {
  status: FacultyLiveStatus;
  currentClass?: ClassPeriod;
  activeLeave?: LeaveRequest;
}
