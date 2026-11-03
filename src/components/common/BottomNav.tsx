import React from 'react';
import {
  Radio,
  Trophy,
  MessageSquare,
  Sparkles,
  User,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTab = 'party' | 'leaderboard' | 'messages' | 'studio' | 'profile' | 'admin';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { t, dms, friendRequests, currentUser, activeRoom } = useApp();

  const unreadDmsCount = dms.reduce((acc, d) => acc + d.unreadCount, 0);
  const pendingRequestsCount = friendRequests.filter((f) => f.status === 'pending').length;
  const totalSocialBadge = unreadDmsCount + pendingRequestsCount;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0f1a]/95 backdrop-blur-xl border-t border-slate-200 dark:border-purple-900/30 px-2 py-1.5 max-w-lg md:max-w-xl mx-auto md:rounded-t-2xl shadow-2xl transition-colors duration-200">
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Party / Live Rooms */}
        <button
          onClick={() => onSelectTab('party')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer relative ${
            currentTab === 'party' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Radio className="w-5 h-5" />
            {activeRoom && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">{t('party')}</span>
        </button>

        {/* Competitions & Leaderboards */}
        <button
          onClick={() => onSelectTab('leaderboard')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer ${
            currentTab === 'leaderboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[11px] mt-1 tracking-tight">{t('explore')}</span>
        </button>

        {/* Social Messages & Audio DMs */}
        <button
          onClick={() => onSelectTab('messages')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer relative ${
            currentTab === 'messages' ? 'text-pink-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {totalSocialBadge > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black rounded-full shadow-sm">
                {totalSocialBadge}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">{t('messages')}</span>
        </button>

        {/* Agency & Host Studio */}
        <button
          onClick={() => onSelectTab('studio')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer ${
            currentTab === 'studio' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px] mt-1 tracking-tight">
            {currentUser.role === 'agency' ? 'Agency' : 'Studio'}
          </span>
        </button>

        {/* Profile & Wallet (or Admin if Admin role) */}
        {currentUser.role === 'admin' ? (
          <button
            onClick={() => onSelectTab('admin')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer ${
              currentTab === 'admin' ? 'text-red-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="text-[11px] mt-1 tracking-tight text-red-300">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => onSelectTab('profile')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all cursor-pointer ${
              currentTab === 'profile' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] mt-1 tracking-tight">{t('profile')}</span>
          </button>
        )}
      </div>
    </nav>
  );
};
