import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import heroCampusImg from '../assets/images/campus_hero_bg_1791294918467.jpg';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const { currentTheme } = useApp();
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Stagger letters for "AJU BOT"
  const letters = ['A', 'J', 'U', ' ', 'B', 'O', 'T'];

  useEffect(() => {
    // Reveal subtitle after letters animate
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 1000);

    // Auto transition after ~2.4s
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, 2500);

    return () => {
      clearTimeout(subtitleTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  const triggerExit = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      onClick={triggerExit}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      title="Click anywhere to continue"
    >
      {/* College Campus View with Blur — pure photographic view, no color tint overlay */}
      <img
        src={heroCampusImg}
        alt="AJU Campus View"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center filter blur-[8px] scale-105"
      />

      {/* Very light natural scrim for text legibility, without coloring */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Foreground Animated Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Animated Wordmark AJU BOT */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-3 tracking-[0.22em] text-5xl sm:text-7xl font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          {letters.map((char, index) => {
            if (char === ' ') {
              return <span key={index} className="w-4 sm:w-6" />;
            }
            return (
              <span
                key={index}
                className="inline-block transform transition-all duration-700 ease-out"
                style={{
                  color: currentTheme.primaryHex,
                  textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 0 40px rgba(255,255,255,0.4)',
                  animation: `fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  transform: 'translateY(24px)',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Thin Subtitle */}
        <div
          className={`mt-4 sm:mt-5 text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] transition-all duration-700 ease-out ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          Faculty & Academic Operations
        </div>

        {/* Subtle tap indicator */}
        <div
          className={`mt-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/30 bg-black/30 backdrop-blur-md text-[11px] font-medium tracking-wide text-white drop-shadow-md transition-opacity duration-700 ${
            showSubtitle ? 'opacity-90' : 'opacity-0'
          }`}
        >
          <span>Tap anywhere to launch workspace</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
