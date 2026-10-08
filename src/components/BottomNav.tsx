import React from 'react';

interface BottomNavProps {
  activeTab: 'discover' | 'ceremony' | 'vows' | 'chats' | 'profile';
  setActiveTab: (tab: 'discover' | 'ceremony' | 'vows' | 'chats' | 'profile') => void;
  unreadCount?: number;
  activeVowCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadCount = 1,
  activeVowCount = 1
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#0a0a12]/90 backdrop-blur-xl border-t border-[#302840]/60 shadow-[0_-4px_25px_rgba(0,0,0,0.7)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {/* Discover */}
        <button
          type="button"
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 transition-all ${
            activeTab === 'discover'
              ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(255,45,120,0.6)]'
              : 'text-on-surface-variant hover:text-secondary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[23px]"
            style={{ fontVariationSettings: activeTab === 'discover' ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className="font-label text-[10px] tracking-wider uppercase mt-0.5">
            Discover
          </span>
        </button>

        {/* Vows / Commitments */}
        <button
          type="button"
          onClick={() => setActiveTab('vows')}
          className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 transition-all ${
            activeTab === 'vows'
              ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(255,45,120,0.6)]'
              : 'text-on-surface-variant hover:text-secondary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[23px]"
            style={{ fontVariationSettings: activeTab === 'vows' ? "'FILL' 1" : "'FILL' 0" }}
          >
            handshake
          </span>
          <span className="font-label text-[10px] tracking-wider uppercase mt-0.5">
            Vows
          </span>
          {activeVowCount > 0 && (
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#00ffcc]"></span>
          )}
        </button>

        {/* Chats */}
        <button
          type="button"
          onClick={() => setActiveTab('chats')}
          className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 transition-all ${
            activeTab === 'chats'
              ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(255,45,120,0.6)]'
              : 'text-on-surface-variant hover:text-secondary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[23px]"
            style={{ fontVariationSettings: activeTab === 'chats' ? "'FILL' 1" : "'FILL' 0" }}
          >
            forum
          </span>
          <span className="font-label text-[10px] tracking-wider uppercase mt-0.5">
            Chats
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 min-w-[14px] h-[14px] text-[9px] font-bold rounded-full bg-primary text-white flex items-center justify-center px-0.5">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 transition-all ${
            activeTab === 'profile'
              ? 'text-primary font-bold drop-shadow-[0_0_8px_rgba(255,45,120,0.6)]'
              : 'text-on-surface-variant hover:text-secondary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.6)]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[23px]"
            style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="font-label text-[10px] tracking-wider uppercase mt-0.5">
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
