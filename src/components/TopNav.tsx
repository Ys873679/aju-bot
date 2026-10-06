import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Clock } from 'lucide-react';

interface TopNavProps {
  title: string;
  onOpenMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ title, onOpenMobileMenu }) => {
  const { currentUser, currentTheme, clock } = useApp();
  const [showProfilePopover, setShowProfilePopover] = useState(false);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Format 24hr time to a friendly 12hr display with AM/PM
  const formatTimeDisplay = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${displayH}:${pad(m)} ${period}`;
  };

  return (
    <header className="h-14 px-4 sm:px-6 bg-white border-b border-[#dce8f7] flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left zone: Mobile toggle + Breadcrumb Title */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-[#657894] hover:text-[#10233f] hover:bg-[#f0f5fc] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-xs sm:text-[13.5px] font-bold text-[#10233f] tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h1>
        </div>
      </div>

      {/* Right zone: Live Real-time Clock (Clean, No dropdown) + Hover Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Academic Clock Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#dce8f7] bg-[#f8fbff] text-[11px] font-semibold text-[#10233f] shadow-xs select-none">
          <Clock
            className="w-3 h-3 shrink-0"
            style={{ color: currentTheme.primaryHex }}
          />
          <span className="font-semibold text-[#10233f]">
            {clock.dayName}
          </span>
          <span className="text-[#cbd5e1] font-light">·</span>
          <span className="font-mono tabular-nums font-bold text-[#10233f]">
            {formatTimeDisplay(clock.timeStr)}
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"
            title="Live synchronized clock"
          />
        </div>

        {/* Top-Right Profile Avatar with Hover Popover */}
        <div
          className="relative"
          onMouseEnter={() => setShowProfilePopover(true)}
          onMouseLeave={() => setShowProfilePopover(false)}
          onFocus={() => setShowProfilePopover(true)}
          onBlur={() => setShowProfilePopover(false)}
          tabIndex={0}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white cursor-pointer shadow-xs transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
            }}
          >
            {currentUser.avatarInitials}
          </div>

          {/* Popover / Tooltip */}
          {showProfilePopover && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-[#dce8f7] shadow-xl p-3 z-50 pointer-events-none transition-all duration-150">
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
                  }}
                >
                  {currentUser.avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#10233f] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] font-medium text-[#657894] truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eaf2fc] text-[11px] text-[#657894] flex items-center justify-between">
                <span className="font-semibold text-[#10233f]">
                  {currentUser.position}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#eff6ff] text-blue-700">
                  {isAdmin ? 'Admin' : (currentUser as any).deptShort}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
