import React, { useState } from 'react';
import {
  Coins,
  Gem,
  Crown,
  Volume2,
  VolumeX,
  Globe,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  UserCheck,
  Sun,
  Moon,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../types';

interface HeaderProps {
  onOpenWallet: () => void;
  onOpenVipStore: () => void;
  onOpenAdminPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWallet,
  onOpenVipStore,
  onOpenAdminPanel,
}) => {
  const {
    currentUser,
    switchAccount,
    currentAccountKey,
    soundEnabled,
    toggleSound,
    language,
    setLanguage,
    theme,
    toggleTheme,
    navigateTo,
    t,
  } = useApp();

  const isDark = theme === 'dark';

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  ];

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-3 py-2.5 sm:px-6 transition-colors duration-200 ${
      isDark ? 'bg-[#0c0f1a]/90 border-purple-900/30 text-white' : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigateTo('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-[1.5px] shadow-lg shadow-purple-900/40">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isDark ? 'bg-[#0d101c]' : 'bg-white'}`}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-black text-sm tracking-tighter">
                  EI
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold text-lg tracking-wider flex items-center gap-1 font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                EITA
                <span className="text-[10px] font-semibold text-purple-500 uppercase tracking-widest hidden sm:inline">
                  Party
                </span>
              </span>
            </div>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs font-medium hover:bg-purple-900/50 transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xs:inline capitalize font-semibold">
                {currentAccountKey.replace('_', ' ')}
              </span>
              <span className="xs:hidden uppercase text-[10px] font-bold">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3 h-3 text-purple-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#141828] border border-purple-500/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold tracking-wider text-purple-300 uppercase px-2 py-1">
                  Switch Active Role
                </div>
                <button
                  onClick={() => {
                    switchAccount('alex');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    currentAccountKey === 'alex'
                      ? 'bg-purple-600/30 text-purple-200 font-semibold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="font-bold">Alex Rivers (VIP 6)</div>
                    <div className="text-[10px] text-slate-400">High Roller User (48k Coins)</div>
                  </div>
                  <Crown className="w-4 h-4 text-purple-400" />
                </button>

                <button
                  onClick={() => {
                    switchAccount('layla');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    currentAccountKey === 'layla'
                      ? 'bg-purple-600/30 text-purple-200 font-semibold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="font-bold">Layla Melody 🎤</div>
                    <div className="text-[10px] text-slate-400">Verified Host (382k Beans)</div>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={() => {
                    switchAccount('golden_agency');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    currentAccountKey === 'golden_agency'
                      ? 'bg-purple-600/30 text-purple-200 font-semibold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="font-bold">Golden Star Agency 🏢</div>
                    <div className="text-[10px] text-slate-400">Agency Owner (1.4M Beans)</div>
                  </div>
                  <span className="text-xs">🏢</span>
                </button>

                <button
                  onClick={() => {
                    switchAccount('admin');
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    currentAccountKey === 'admin'
                      ? 'bg-purple-600/30 text-purple-200 font-semibold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="font-bold">EITA Admin 🛡️</div>
                    <div className="text-[10px] text-slate-400">Full Platform Control</div>
                  </div>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Coins, Beans, VIP, Sound, Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coins Wallet pill */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold hover:border-amber-400 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums font-semibold">
              {currentUser.coins.toLocaleString()}
            </span>
          </button>

          {/* Beans Balance (Host / Agency earnings) */}
          {(currentUser.role === 'host' || currentUser.role === 'agency' || currentUser.beans > 0) && (
            <button
              onClick={onOpenWallet}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:border-emerald-400 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Gem className="w-3.5 h-3.5 text-emerald-400" />
              <span className="tabular-nums font-semibold">
                {currentUser.beans.toLocaleString()}
              </span>
            </button>
          )}

          {/* VIP Badge */}
          <button
            onClick={onOpenVipStore}
            className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              currentUser.vipLevel > 0
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/30'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>VIP {currentUser.vipLevel}</span>
          </button>

          {/* Light / Dark Mode Toggle button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                : 'bg-slate-100 border-slate-200 text-purple-700 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* DashFlat Dashboard Shortcut Button */}
          <button
            onClick={() => navigateTo(currentUser.role === 'admin' ? '/admin_dashboard' : '/dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              currentUser.role === 'admin'
                ? 'bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30'
                : isDark
                ? 'bg-purple-950/60 border-purple-500/30 text-purple-200 hover:bg-purple-900/50'
                : 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200'
            }`}
            title="Open DashFlat Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline">
              {currentUser.role === 'admin' ? 'Admin Dash' : 'Dashboard'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle sound effects"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowRoleMenu(false);
              }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-purple-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-[#141828] border border-purple-500/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold tracking-wider text-purple-300 uppercase px-2 py-1">
                  Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                      language === lang.code
                        ? 'bg-purple-600/30 text-purple-200 font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin shortcut if admin role */}
          {currentUser.role === 'admin' && onOpenAdminPanel && (
            <button
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-bold hover:bg-red-600/50 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
