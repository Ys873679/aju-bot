import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrentUser,
  FacultyMember,
  LeaveRequest,
  AcademicHoliday,
  ThemeConfig,
  FacultyStatusDetail,
  FacultyLiveStatus,
  ClassPeriod,
} from '../types';
import {
  ADMIN_USER,
  INITIAL_FACULTY,
  INITIAL_LEAVE_REQUESTS,
  ACADEMIC_HOLIDAYS,
  THEME_PALETTES,
} from '../data/mockData';

interface SimulatedClock {
  isSimulated: boolean;
  dateStr: string;   // YYYY-MM-DD
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  timeStr: string;   // HH:MM
}

interface AppContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  facultyList: FacultyMember[];
  leaveRequests: LeaveRequest[];
  holidays: AcademicHoliday[];
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  clock: SimulatedClock;
  setSimulatedClock: (clock: Partial<SimulatedClock>) => void;
  resetClockToRealtime: () => void;
  getFacultyLiveStatus: (facultyId: string) => FacultyStatusDetail;
  getFreeFacultyForSlot: (
    day: string,
    startTime: string,
    endTime: string,
    date: string,
    excludeFacultyId: string
  ) => FacultyMember[];
  toggleModuleCompletion: (
    facultyId: string,
    subjectId: string,
    moduleId: string
  ) => void;
  addSubjectModule: (
    facultyId: string,
    subjectId: string,
    moduleName: string
  ) => void;
  submitLeaveRequest: (
    req: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>
  ) => void;
  updateLeaveRequestStatus: (
    requestId: string,
    status: 'Approved' | 'Rejected'
  ) => void;
  logout: () => void;
  loginUser: (user: CurrentUser) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DAYS_OF_WEEK: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load faculty list from localStorage or fallback
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(() => {
    try {
      const saved = localStorage.getItem('aju_faculty_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FACULTY;
  });

  // Load leave requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem('aju_leave_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_LEAVE_REQUESTS;
  });

  const [holidays] = useState<AcademicHoliday[]>(ACADEMIC_HOLIDAYS);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try {
      const saved = localStorage.getItem('aju_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // User theme preference
  const [themeId, setThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('aju_theme_id');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'royal-blue';
  });

  const currentTheme = THEME_PALETTES.find((t) => t.id === themeId) || THEME_PALETTES[0];

  // Apply CSS variables on theme change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', currentTheme.primaryHex);
    root.style.setProperty('--accent-deep', currentTheme.deepHex);
    root.style.setProperty('--accent-light', currentTheme.lightHex);
    root.style.setProperty('--accent-border', currentTheme.borderHex);
    root.style.setProperty('--accent-glow', currentTheme.glowHex);

    try {
      localStorage.setItem('aju_theme_id', currentTheme.id);
      if (currentUser) {
        localStorage.setItem(`aju_theme_${currentUser.id}`, currentTheme.id);
      }
    } catch {
      // ignore
    }
  }, [currentTheme, currentUser]);

  // Save faculty list and keep currentUser updated if faculty
  useEffect(() => {
    try {
      localStorage.setItem('aju_faculty_list', JSON.stringify(facultyList));
    } catch {
      // ignore
    }
    if (currentUser && currentUser.role === 'faculty') {
      const live = facultyList.find((f) => f.id === currentUser.id);
      if (live && JSON.stringify(live.subjects) !== JSON.stringify(currentUser.subjects)) {
        setCurrentUser(live);
      }
    }
  }, [facultyList, currentUser]);

  // Save leave requests
  useEffect(() => {
    try {
      localStorage.setItem('aju_leave_requests', JSON.stringify(leaveRequests));
    } catch {
      // ignore
    }
  }, [leaveRequests]);

  // Save current user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('aju_current_user', JSON.stringify(currentUser));
        // Check if user has personal saved theme
        const userSavedTheme = localStorage.getItem(`aju_theme_${currentUser.id}`);
        if (userSavedTheme && userSavedTheme !== themeId) {
          setThemeId(userSavedTheme);
        }
      } else {
        localStorage.removeItem('aju_current_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Clock state (runs live with correct, recent real time and day)
  const getNowClock = (): SimulatedClock => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const dayName = DAYS_OF_WEEK[now.getDay()];
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return {
      isSimulated: false,
      dateStr,
      dayName,
      timeStr,
    };
  };

  const [clock, setClock] = useState<SimulatedClock>(getNowClock);

  // Interval for live realtime updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setClock(getNowClock());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const setSimulatedClock = (newPartial: Partial<SimulatedClock>) => {
    setClock((prev) => ({
      ...prev,
      ...newPartial,
      isSimulated: true,
    }));
  };

  const resetClockToRealtime = () => {
    setClock(getNowClock());
  };

  const setTheme = (id: string) => {
    setThemeId(id);
  };

  // Convert HH:MM to total minutes from midnight for interval math
  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  // Live status calculation for any faculty
  const getFacultyLiveStatus = (facultyId: string): FacultyStatusDetail => {
    const faculty = facultyList.find((f) => f.id === facultyId);
    if (!faculty) return { status: 'Free' };

    // 1. Check if faculty has an Approved Leave covering today's clock date
    const currentDate = clock.dateStr;
    const activeLeave = leaveRequests.find((l) => {
      if (l.facultyId !== facultyId || l.status !== 'Approved') return false;
      return currentDate >= l.fromDate && currentDate <= l.toDate;
    });

    if (activeLeave) {
      return { status: 'On Leave', activeLeave };
    }

    // 2. Check if day is Sunday (Institutional off)
    if (clock.dayName === 'Sunday') {
      return { status: 'Free' };
    }

    // 3. Check timetable for current day and time
    const currentMins = timeToMinutes(clock.timeStr);
    const dayClasses = faculty.timetable.filter((c) => c.day === clock.dayName);

    const activeClass = dayClasses.find((c) => {
      const startMins = timeToMinutes(c.startTime);
      const endMins = timeToMinutes(c.endTime);
      return currentMins >= startMins && currentMins <= endMins;
    });

    if (activeClass) {
      return { status: 'In Class', currentClass: activeClass };
    }

    return { status: 'Free' };
  };

  // Find other faculty who are free at a specific slot and date
  const getFreeFacultyForSlot = (
    day: string,
    startTime: string,
    endTime: string,
    date: string,
    excludeFacultyId: string
  ): FacultyMember[] => {
    const startMins = timeToMinutes(startTime);
    const endMins = timeToMinutes(endTime);

    return facultyList.filter((faculty) => {
      if (faculty.id === excludeFacultyId) return false;

      // Check if this faculty is on approved leave on that date
      const onLeave = leaveRequests.some((l) => {
        return (
          l.facultyId === faculty.id &&
          l.status === 'Approved' &&
          date >= l.fromDate &&
          date <= l.toDate
        );
      });
      if (onLeave) return false;

      // Check if teaching during that slot
      const hasConflict = faculty.timetable.some((c) => {
        if (c.day !== day) return false;
        const cStart = timeToMinutes(c.startTime);
        const cEnd = timeToMinutes(c.endTime);
        // Overlap condition: start < otherEnd and end > otherStart
        return startMins < cEnd && endMins > cStart;
      });

      return !hasConflict;
    });
  };

  // Toggle module completion (Faculty Dashboard only)
  const toggleModuleCompletion = (
    facultyId: string,
    subjectId: string,
    moduleId: string
  ) => {
    setFacultyList((prev) =>
      prev.map((faculty) => {
        if (faculty.id !== facultyId) return faculty;
        return {
          ...faculty,
          subjects: faculty.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            return {
              ...sub,
              modules: sub.modules.map((mod) => {
                if (mod.id !== moduleId) return mod;
                return { ...mod, completed: !mod.completed };
              }),
            };
          }),
        };
      })
    );
  };

  // Add module to a subject (Hard cap of 5 modules per subject)
  const addSubjectModule = (
    facultyId: string,
    subjectId: string,
    moduleName: string
  ) => {
    if (!moduleName.trim()) return;
    setFacultyList((prev) =>
      prev.map((faculty) => {
        if (faculty.id !== facultyId) return faculty;
        return {
          ...faculty,
          subjects: faculty.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            // HARD CAP OF 5: No more than 5 modules can ever be added
            if (sub.modules.length >= 5) return sub;
            const newMod = {
              id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: moduleName.trim(),
              completed: false,
            };
            return {
              ...sub,
              modules: [...sub.modules, newMod],
            };
          }),
        };
      })
    );
  };

  // Submit new leave request
  const submitLeaveRequest = (
    req: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newRequest: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setLeaveRequests((prev) => [newRequest, ...prev]);
  };

  // Approve / Reject leave
  const updateLeaveRequestStatus = (
    requestId: string,
    status: 'Approved' | 'Rejected'
  ) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  const loginUser = (user: CurrentUser) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        facultyList,
        leaveRequests,
        holidays,
        currentTheme,
        setTheme,
        clock,
        setSimulatedClock,
        resetClockToRealtime,
        getFacultyLiveStatus,
        getFreeFacultyForSlot,
        toggleModuleCompletion,
        addSubjectModule,
        submitLeaveRequest,
        updateLeaveRequestStatus,
        logout,
        loginUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
