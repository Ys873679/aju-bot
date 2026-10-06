import React from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_PALETTES } from '../../data/mockData';
import { Palette, Check, Sparkles, Shield, User } from 'lucide-react';

export const SettingsTheme: React.FC = () => {
  const { currentTheme, setTheme, currentUser } = useApp();

  const accentSwatches = [
    { id: 'royal-blue', name: 'Royal Blue', color: '#2563eb' },
    { id: 'ocean-teal', name: 'Ocean Teal', color: '#0d9488' },
    { id: 'imperial-violet', name: 'Imperial Violet', color: '#7c3aed' },
    { id: 'forest-emerald', name: 'Forest Emerald', color: '#059669' },
    { id: 'autumn-amber', name: 'Autumn Amber', color: '#d97706' },
    { id: 'crimson-rose', name: 'Crimson Rose', color: '#e11d48' },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl animate-in fade-in duration-200">
      {/* Settings Header */}
      <div className="bg-white rounded-2xl border border-[#dce8f7] p-3.5 sm:p-4 shadow-[0_6px_20px_rgba(31,76,126,0.05)]">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.deepHex})`,
            }}
          >
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#10233f]">
              Appearance & Theme Configuration
            </h2>
            <p className="text-[11px] text-[#657894]">
              Personalized workspace style saved for{' '}
              <strong className="text-[#10233f]">{currentUser?.name}</strong> (
              {currentUser?.role === 'admin' ? 'Administrator' : 'Faculty Member'})
            </p>
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-xl bg-[#f0f6ff] border border-[#dce8f7] text-[11px] text-[#657894] leading-relaxed">
          <strong>Design System Rule:</strong> Sidebar background maintains a clean, crisp white surface across all views. Changing themes dynamically updates accent borders, active states, buttons, progress indicators, chips, and glows.
        </div>
      </div>

      {/* 1. Complete Themes Grid */}
      <div className="bg-white rounded-2xl border border-[#dce8f7] p-4.5 sm:p-5 shadow-[0_8px_24px_rgba(31,76,126,0.06)]">
        <h3 className="text-[13px] font-bold text-[#10233f] mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Complete Institutional Themes</span>
        </h3>
        <p className="text-[11px] text-[#657894] mb-3.5">
          Select a full aesthetic preset to propagate styling across buttons, nav pills, and status rings:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEME_PALETTES.map((theme) => {
            const isSelected = currentTheme.id === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all card-lift relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 shadow-md bg-[#fafcff]'
                    : 'border-[#dce8f7] hover:border-blue-300 bg-white'
                }`}
                style={{
                  borderColor: isSelected ? theme.primaryHex : undefined,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full shadow-xs"
                        style={{ backgroundColor: theme.primaryHex }}
                      />
                      <h4 className="font-bold text-xs text-[#10233f]">
                        {theme.name}
                      </h4>
                    </div>

                    {isSelected && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: theme.primaryHex }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#657894] leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                {/* Color swatch previews */}
                <div className="mt-4 pt-3 border-t border-[#f0f6ff] flex items-center gap-2">
                  <div
                    className="h-4 flex-1 rounded"
                    style={{ backgroundColor: theme.primaryHex }}
                    title="Primary"
                  />
                  <div
                    className="h-4 flex-1 rounded"
                    style={{ backgroundColor: theme.deepHex }}
                    title="Deep"
                  />
                  <div
                    className="h-4 flex-1 rounded border border-[#dce8f7]"
                    style={{ backgroundColor: theme.lightHex }}
                    title="Light"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Accent Colour Swatch Row */}
      <div className="bg-white rounded-2xl border border-[#dce8f7] p-5 sm:p-6 shadow-[0_8px_24px_rgba(31,76,126,0.06)]">
        <h3 className="text-sm font-bold text-[#10233f] mb-1">
          Accent Colour Swatches
        </h3>
        <p className="text-xs text-[#657894] mb-4">
          Quick-switch the operational highlight accent:
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {accentSwatches.map((swatch) => {
            const isSelected = currentTheme.id === swatch.id;

            return (
              <button
                key={swatch.id}
                onClick={() => setTheme(swatch.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 shadow-xs bg-[#f8fbff] text-[#10233f]'
                    : 'border-[#dce8f7] hover:border-slate-400 bg-white text-[#657894]'
                }`}
                style={{
                  borderColor: isSelected ? swatch.color : undefined,
                }}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs"
                  style={{ backgroundColor: swatch.color }}
                />
                <span>{swatch.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-1 text-slate-800" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Account Information */}
      <div className="bg-white rounded-2xl border border-[#dce8f7] p-5 sm:p-6 shadow-[0_8px_24px_rgba(31,76,126,0.06)]">
        <h3 className="text-sm font-bold text-[#10233f] mb-3">
          Session & Account Profile
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-[#f0f6ff]">
            <span className="text-[#657894]">Logged In User</span>
            <span className="font-bold text-[#10233f]">{currentUser?.name}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#f0f6ff]">
            <span className="text-[#657894]">Institutional Role</span>
            <span className="font-bold text-[#10233f]">
              {currentUser?.role === 'admin' ? 'University Administration' : 'Academic Faculty'}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#f0f6ff]">
            <span className="text-[#657894]">Institutional Gate Access</span>
            <span className="font-mono text-emerald-700 font-bold">Verified (aju-IT123)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[#657894]">Local Persistence</span>
            <span className="text-[#10233f] font-semibold">Active (Saved in browser localStorage)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
