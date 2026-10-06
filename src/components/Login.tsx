import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ADMIN_USER } from '../data/mockData';
import { KeyRound, User, ShieldCheck, ArrowRight, Sparkles, Building2, AlertCircle } from 'lucide-react';
import heroCampusImg from '../assets/images/campus_hero_bg_1791294918467.jpg';

interface LoginProps {
  onReplaySplash?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onReplaySplash }) => {
  const { facultyList, loginUser, currentTheme } = useApp();

  const [roleFilter, setRoleFilter] = useState<'admin' | 'faculty'>('admin');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedQuickFill, setSelectedQuickFill] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const INSTITUTION_GATE_PASSWORD = 'aju-IT123';

  // Handle switching role tabs: fully resets form, credentials, and quick fill selection
  const handleRoleTabChange = (newRole: 'admin' | 'faculty') => {
    if (newRole === roleFilter) return;
    setRoleFilter(newRole);
    setFullName('');
    setPassword('');
    setSelectedQuickFill(null);
    setErrorMsg(null);
  };

  // Handle Login validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const trimmedPassword = password.trim();
    const trimmedName = fullName.trim().toLowerCase();

    // 1. Password check
    if (trimmedPassword !== INSTITUTION_GATE_PASSWORD) {
      setTimeout(() => {
        setErrorMsg('Incorrect access password. Contact the Dean of IT for credentials.');
        setIsSubmitting(false);
      }, 250);
      return;
    }

    // 2. Directory match
    const adminName = ADMIN_USER.name.toLowerCase();
    const isMatchedAdmin =
      trimmedName === adminName ||
      trimmedName === 'admin' ||
      trimmedName === 'shivani' ||
      trimmedName === 'shivani singh';

    if (isMatchedAdmin) {
      setTimeout(() => {
        loginUser(ADMIN_USER);
        setIsSubmitting(false);
      }, 300);
      return;
    }

    // Check faculty
    const matchedFaculty = facultyList.find((f) => {
      const fName = f.name.toLowerCase();
      return (
        fName === trimmedName ||
        fName.includes(trimmedName) ||
        trimmedName.includes(f.name.toLowerCase().replace('dr. ', '').replace('prof. ', ''))
      );
    });

    if (matchedFaculty) {
      setTimeout(() => {
        loginUser(matchedFaculty);
        setIsSubmitting(false);
      }, 300);
      return;
    }

    // Name not found
    setTimeout(() => {
      setErrorMsg('Name not recognized in faculty or administration directory.');
      setIsSubmitting(false);
    }, 250);
  };

  const handleQuickFill = (name: string) => {
    setFullName(name);
    setPassword(INSTITUTION_GATE_PASSWORD);
    setSelectedQuickFill(name);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* College Campus View with Blur — identical to the starting animation */}
      <img
        src={heroCampusImg}
        alt="AJU Campus Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center filter blur-[8px] scale-105 pointer-events-none"
      />
      {/* Soft natural scrim overlay for card contrast and crisp readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Main Login Card with Frosted White Glass Surface */}
      <div className="w-full max-w-[430px] bg-white/95 backdrop-blur-md rounded-[20px] border border-white/60 p-6 sm:p-7 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        {/* Top Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center gap-2 mb-1.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
              }}
            >
              <Building2 className="w-4 h-4" />
            </div>
            <span
              className="text-2xl font-black tracking-wider"
              style={{ color: currentTheme.deepHex }}
            >
              AJU BOT
            </span>
          </div>
          <p className="text-[11px] font-semibold tracking-wide uppercase text-[#657894]">
            Faculty & Academic Operations
          </p>
        </div>

        {/* Directory filter toggle: Admin and Faculty only — switches role and resets form */}
        <div className="flex p-1 bg-[#f0f5fc] rounded-xl mb-4.5 border border-[#e2ecf9]">
          <button
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              roleFilter === 'admin'
                ? 'bg-white text-[#10233f] shadow-xs'
                : 'text-[#657894] hover:text-[#10233f]'
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleTabChange('faculty')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              roleFilter === 'faculty'
                ? 'bg-white text-[#10233f] shadow-xs'
                : 'text-[#657894] hover:text-[#10233f]'
            }`}
          >
            Faculty
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <div className="font-medium leading-relaxed text-[11px]">{errorMsg}</div>
          </div>
        )}

        {/* Two-Factor Authenticated Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Field 1: Full Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#657894] mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#657894]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setSelectedQuickFill(null);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder={roleFilter === 'admin' ? 'e.g. Shivani Singh' : 'e.g. Dr. Rajesh Sharma'}
                className="w-full pl-9 pr-3 py-2 bg-[#f8fbff] text-xs sm:text-[13px] text-[#10233f] font-medium border border-[#dce8f7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          {/* Field 2: Institutional Access Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#657894]">
                Access Password
              </label>
              <span className="text-[10px] font-mono font-medium text-[#657894]">
                Gate: <code className="bg-[#f0f5fc] px-1 py-0.5 rounded text-[#10233f]">aju-IT123</code>
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#657894]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Enter institution password"
                className="w-full pl-9 pr-3 py-2 bg-[#f8fbff] text-xs sm:text-[13px] text-[#10233f] font-medium border border-[#dce8f7] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-1.5 py-2.5 px-4 rounded-xl text-xs sm:text-[13px] font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-75"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
            }}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying Credentials…
              </span>
            ) : (
              <>
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <p className="text-center text-[10px] font-medium text-[#657894] pt-0.5">
            Access restricted to authorised faculty & admin.
          </p>
        </form>

        {/* Quick Directory Selector for 1-click testing */}
        <div className="mt-5 pt-4 border-t border-[#eaf2fc]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#657894] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Quick Fill Directory
            </span>
            <span className="text-[10px] text-[#94a3b8]">Click name to populate</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {roleFilter === 'admin' && (
              <button
                type="button"
                onClick={() => handleQuickFill(ADMIN_USER.name)}
                className={`w-full text-left p-2 rounded-lg border flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  selectedQuickFill === ADMIN_USER.name
                    ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-300'
                    : 'bg-[#f6faff] hover:bg-[#eaf3fe] border-[#e2ecf9]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center">
                    {ADMIN_USER.avatarInitials}
                  </span>
                  <span className="font-semibold text-[#10233f] text-xs">{ADMIN_USER.name}</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                  Admin (Dean)
                </span>
              </button>
            )}

            {roleFilter === 'faculty' &&
              facultyList.map((f) => {
                const isSelected = selectedQuickFill === f.name;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleQuickFill(f.name)}
                    className={`w-full text-left p-2 rounded-lg border flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-400 ring-1 ring-blue-300'
                        : 'bg-[#f8fbff] hover:bg-[#eaf3fe] border-[#e2ecf9]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                        {f.avatarInitials}
                      </span>
                      <span className="font-semibold text-[#10233f] truncate max-w-[170px] text-xs">
                        {f.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-[#657894]">
                      {f.deptShort} · {f.currentSection}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Replay splash button if requested */}
        {onReplaySplash && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={onReplaySplash}
              className="text-[10px] text-[#657894] hover:text-[#10233f] transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Replay Intro Splash
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
