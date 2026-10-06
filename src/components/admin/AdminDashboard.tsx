import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  Coffee,
  CalendarOff,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string, filter?: string) => void;
  onOpenFacultyDrawer: (facultyId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenFacultyDrawer,
}) => {
  const {
    currentUser,
    facultyList,
    leaveRequests,
    getFacultyLiveStatus,
    clock,
    currentTheme,
    updateLeaveRequestStatus,
  } = useApp();

  // Time of day greeting
  const getGreeting = () => {
    const hour = parseInt(clock.timeStr.split(':')[0], 10);
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute live stats across 5 faculty
  const facultyStatuses = facultyList.map((f) => ({
    faculty: f,
    statusDetail: getFacultyLiveStatus(f.id),
  }));

  const totalFacultyCount = facultyList.length;
  const currentlyTeachingCount = facultyStatuses.filter(
    (fs) => fs.statusDetail.status === 'In Class'
  ).length;
  const freeFacultyCount = facultyStatuses.filter(
    (fs) => fs.statusDetail.status === 'Free'
  ).length;
  const onLeaveCount = facultyStatuses.filter(
    (fs) => fs.statusDetail.status === 'On Leave'
  ).length;

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[#e2ecf9]">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#10233f] tracking-tight">
            {getGreeting()}, {currentUser?.name.split(' ')[0] || 'Admin'}
          </h2>
          <p className="text-[11px] font-medium text-[#657894] mt-0.5">
            Operations overview for <span className="font-semibold text-[#10233f]">{clock.dayName}</span>, Academic Session 2026–2027.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-2 py-0.5 rounded-full bg-white border border-[#dce8f7] text-[10px] font-semibold text-[#10233f] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Operations Engine</span>
        </div>
      </div>

      {/* 4 Clickable Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {/* Card 1: Total Faculty */}
        <div
          onClick={() => onNavigateTab('faculty', 'all')}
          className="bg-white rounded-2xl border border-[#dce8f7] p-3.5 sm:p-4 card-lift cursor-pointer relative overflow-hidden group shadow-[0_6px_20px_rgba(31,76,126,0.05)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#657894] uppercase tracking-wider">
              Total Faculty
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
              }}
            >
              <Users className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-[#10233f] font-mono tabular-nums">
              {totalFacultyCount}
            </span>
            <span className="text-[10px] font-medium text-[#657894]">Engineers & Leads</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-blue-600 group-hover:underline">
            <span>View team roster</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Currently Teaching (live) */}
        <div
          onClick={() => onNavigateTab('faculty', 'In Class')}
          className="bg-white rounded-2xl border border-[#dce8f7] p-3.5 sm:p-4 card-lift cursor-pointer relative overflow-hidden group shadow-[0_6px_20px_rgba(31,76,126,0.05)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#657894] uppercase tracking-wider">
              Currently Teaching
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono tabular-nums">
              {currentlyTeachingCount}
            </span>
            <span className="text-[10px] font-medium text-[#657894]">In active session</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-blue-600 group-hover:underline">
            <span>Filtered list ({currentlyTeachingCount} active)</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Free Faculty (live) */}
        <div
          onClick={() => onNavigateTab('faculty', 'Free')}
          className="bg-white rounded-2xl border border-[#dce8f7] p-3.5 sm:p-4 card-lift cursor-pointer relative overflow-hidden group shadow-[0_6px_20px_rgba(31,76,126,0.05)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#657894] uppercase tracking-wider">
              Free Faculty
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Coffee className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {freeFacultyCount}
            </span>
            <span className="text-[10px] font-medium text-[#657894]">Available for tasks</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 group-hover:underline">
            <span>Free slots list</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: On Leave (today) */}
        <div
          onClick={() => onNavigateTab('faculty', 'On Leave')}
          className="bg-white rounded-2xl border border-[#dce8f7] p-3.5 sm:p-4 card-lift cursor-pointer relative overflow-hidden group shadow-[0_6px_20px_rgba(31,76,126,0.05)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#657894] uppercase tracking-wider">
              On Leave
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <CalendarOff className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
              {onLeaveCount}
            </span>
            <span className="text-[10px] font-medium text-[#657894]">Approved leaves</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-amber-700 group-hover:underline">
            <span>Check substitution audit</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Pending Leave / Substitution preview card */}
      <div className="bg-white rounded-2xl border border-[#dce8f7] p-4.5 sm:p-5 shadow-[0_10px_30px_rgba(31,76,126,0.06)]">
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#eaf2fc]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-[13px] font-bold text-[#10233f]">
              Pending Leave / Substitution Approvals
            </h3>
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {pendingLeaves.length} Action Needed
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('leave')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View all requests</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="text-center py-5 text-[11px] text-[#657894]">
            No pending leave requests at this time. All schedules are up to date!
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingLeaves.slice(0, 3).map((leave) => (
              <div
                key={leave.id}
                className="p-3 rounded-xl border border-[#e2ecf9] bg-[#f9fcff] flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#10233f] text-xs">
                      {leave.facultyName}
                    </span>
                    <span className="text-[11px] text-[#657894]">· {leave.department}</span>
                    <span className="font-semibold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded text-[9px]">
                      {leave.daysCount} Day{leave.daysCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#657894] line-clamp-1 italic">
                    &ldquo;{leave.reason}&rdquo;
                  </p>
                  <div className="text-[10px] text-[#657894] font-mono">
                    Dates: <span className="text-[#10233f] font-semibold">{leave.fromDate}</span> to{' '}
                    <span className="text-[#10233f] font-semibold">{leave.toDate}</span>
                    {leave.substitutions.length > 0 && (
                      <span className="ml-2 text-emerald-700 font-semibold">
                        ({leave.substitutions.length} substitute periods mapped)
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Approve / Reject Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => updateLeaveRequestStatus(leave.id, 'Approved')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => updateLeaveRequestStatus(leave.id, 'Rejected')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3 h-3" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Faculty Overview Table */}
      <div className="bg-white rounded-2xl border border-[#dce8f7] p-4.5 sm:p-5 shadow-[0_10px_30px_rgba(31,76,126,0.06)]">
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#eaf2fc]">
          <div>
            <h3 className="text-[13px] font-bold text-[#10233f]">Faculty Operational Overview</h3>
            <p className="text-[11px] text-[#657894] mt-0.5">
              Live status based on weekly timetable schedule and calendar leaves
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('faculty')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Directory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left data-table border-collapse">
            <thead>
              <tr className="border-b border-[#eaf2fc] text-[#657894]">
                <th className="py-2.5 px-3">Faculty</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Semester</th>
                <th className="py-2.5 px-3">Section</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f6ff]">
              {facultyStatuses.map(({ faculty, statusDetail }) => {
                const isTeaching = statusDetail.status === 'In Class';
                const isOnLeave = statusDetail.status === 'On Leave';

                return (
                  <tr
                    key={faculty.id}
                    className="hover:bg-[#f8fbff] transition-colors group cursor-pointer"
                    onClick={() => onOpenFacultyDrawer(faculty.id)}
                  >
                    {/* Faculty */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-xs"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
                          }}
                        >
                          {faculty.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-[#10233f] text-xs leading-snug group-hover:text-blue-600 transition-colors">
                            {faculty.name}
                          </p>
                          <p className="text-[11px] text-[#657894]">{faculty.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3 font-medium text-[#10233f]">
                      {faculty.department}
                    </td>

                    {/* Semester */}
                    <td className="py-3 px-3 font-mono text-[#657894]">
                      {faculty.subjects.map((s) => `Sem ${s.semester}`).join(', ')}
                    </td>

                    {/* Section */}
                    <td className="py-3 px-3 font-semibold text-[#10233f]">
                      {faculty.currentSection}
                    </td>

                    {/* Status Chip */}
                    <td className="py-3 px-3">
                      {isTeaching ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                          <span>In Class ({statusDetail.currentClass?.subjectCode})</span>
                        </span>
                      ) : isOnLeave ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>On Leave</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Free</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <span className="text-xs font-bold text-blue-600 group-hover:underline inline-flex items-center gap-1">
                        View Syllabus
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
