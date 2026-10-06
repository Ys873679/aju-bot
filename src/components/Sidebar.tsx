import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Settings,
  Clock,
  LogOut,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export type AdminViewTab = 'dashboard' | 'faculty' | 'leave' | 'calendar' | 'settings';
export type FacultyViewTab = 'my-day' | 'dashboard' | 'timetable' | 'faculty' | 'leave' | 'calendar' | 'settings';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, logout, currentTheme } = useApp();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Navigation items based on role
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
    { id: 'leave', label: 'Leave & Substitution', icon: CalendarCheck },
    { id: 'calendar', label: 'Academic Calendar', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const facultyNavItems = [
    { id: 'my-day', label: 'My Day', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'faculty', label: 'Teams', icon: Users },
    { id: 'leave', label: 'Leave & Substitution', icon: CalendarCheck },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNavItems : facultyNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container: Fixed width 245px, pure WHITE background always */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[245px] bg-white border-r border-[#dce8f7] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundColor: '#ffffff', // Explicitly stays white in both Admin and Faculty views always
        }}
      >
        {/* Top Header Section */}
        <div className="flex flex-col">
          <div className="h-18 px-5 border-b border-[#eaf2fc] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs font-black text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
                  }}
                >
                  A
                </div>
                <span
                  className="text-lg font-black tracking-wider"
                  style={{ color: currentTheme.deepHex }}
                >
                  AJU BOT
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#657894] mt-0.5 ml-9">
                {isAdmin ? 'Admin workspace' : 'Faculty workspace'}
              </p>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
                    isActive
                      ? 'text-[#10233f] font-bold shadow-xs'
                      : 'text-[#657894] hover:text-[#10233f] hover:bg-[#f6faff]'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.lightHex : undefined,
                  }}
                >
                  {/* Left accent-colored active bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full"
                      style={{ backgroundColor: currentTheme.primaryHex }}
                    />
                  )}

                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? '' : 'text-[#8494aa] group-hover:text-[#10233f]'
                    }`}
                    style={{
                      color: isActive ? currentTheme.primaryHex : undefined,
                    }}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom-Fixed Identity Block (Always visible, outside scroll) */}
        <div className="p-4 border-t border-[#eaf2fc] bg-white">
          <div className="flex items-center gap-3 mb-3">
            {/* Circular avatar with user's initials */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs text-white"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
              }}
            >
              {currentUser.avatarInitials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#10233f] truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[11px] font-medium text-[#657894] truncate mt-0.5">
                {isAdmin
                  ? 'Admin'
                  : `Faculty — ${(currentUser as any).deptShort || 'Academic'}`}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#dce8f7] bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[#657894] text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
