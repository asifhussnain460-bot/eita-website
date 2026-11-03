import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Video,
  Wallet,
  ArrowDownLeft,
  Radio,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ShieldAlert,
  Crown,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type DashboardSidebarTab =
  | 'dashboard'
  | 'users'
  | 'videos'
  | 'wallet'
  | 'withdrawals'
  | 'rooms'
  | 'settings';

interface DashFlatLayoutProps {
  isAdmin?: boolean;
  activeSidebarTab: DashboardSidebarTab;
  onSelectSidebarTab: (tab: DashboardSidebarTab) => void;
  children: React.ReactNode;
}

export const DashFlatLayout: React.FC<DashFlatLayoutProps> = ({
  isAdmin = false,
  activeSidebarTab,
  onSelectSidebarTab,
  children,
}) => {
  const {
    currentUser,
    switchAccount,
    currentAccountKey,
    theme,
    toggleTheme,
    navigateTo,
    currentRoute,
    toasts,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const navItems: { id: DashboardSidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'users',
      label: isAdmin ? 'Customers (Users)' : 'Followers & Friends',
      icon: <Users className="w-4 h-4" />,
      badge: isAdmin ? '43.9k' : '12.4k',
    },
    {
      id: 'videos',
      label: 'Videos & Performance',
      icon: <Video className="w-4 h-4" />,
    },
    {
      id: 'wallet',
      label: 'Wallet & Recharges',
      icon: <Wallet className="w-4 h-4" />,
      badge: 'Rs 157',
    },
    {
      id: 'withdrawals',
      label: 'Withdrawals & Cashout',
      icon: <ArrowDownLeft className="w-4 h-4" />,
    },
    {
      id: 'rooms',
      label: 'Live Voice Rooms',
      icon: <Radio className="w-4 h-4" />,
      badge: 'Live',
    },
    {
      id: 'settings',
      label: 'Settings & Security',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-[#080a10] text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200`}>
      {/* TOP NAVBAR (DashFlat Style) */}
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center justify-between px-3 sm:px-6 backdrop-blur-md ${
        isDark ? 'bg-[#0d101c]/90 border-purple-900/30' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl transition-colors md:hidden ${
              isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Toggle Navigation Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => navigateTo(isAdmin ? '/admin_dashboard' : '/dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-[1.5px] shadow-md shadow-purple-900/30">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isDark ? 'bg-[#0d101c]' : 'bg-white'}`}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-black text-sm tracking-tighter">
                  EI
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-lg tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                EITA
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-xs">
                DashFlat
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search metrics, users, videos, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs rounded-xl pl-10 pr-4 py-2 border transition-all focus:outline-none ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-purple-500'
                  : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:bg-white'
              }`}
            />
          </div>
        </div>

        {/* Right Action Icons & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switcher between User Dashboard and Super Admin Dashboard */}
          <div className={`flex items-center p-0.5 rounded-xl border text-xs font-bold ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => {
                switchAccount('alex');
                navigateTo('/dashboard');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                !isAdmin
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              User Dash
            </button>
            <button
              onClick={() => {
                switchAccount('admin');
                navigateTo('/admin_dashboard');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                isAdmin
                  ? 'bg-red-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-red-300" />
              <span>Admin Dash</span>
            </button>
          </div>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              isDark
                ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            <span className="hidden sm:inline text-xs font-semibold">
              {isDark ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Return to Live Voice Party Button */}
          <button
            onClick={() => navigateTo('/')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? 'bg-purple-950/60 border-purple-500/30 text-purple-200 hover:bg-purple-900/50'
                : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
            }`}
            title="Open EITA Live Voice Party App"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Voice Party</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border transition-colors cursor-pointer ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-purple-500/40">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight truncate max-w-[110px]">
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] text-purple-400 font-semibold capitalize">
                  {isAdmin ? 'Super Admin' : `VIP ${currentUser.vipLevel}`}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-[#141828] border-purple-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="p-2 border-b border-white/5">
                  <div className="text-xs font-bold text-white">{currentUser.displayName}</div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">
                    {currentUser.email || 'user@eita.app'}
                  </div>
                  <div className="mt-1 text-[10px] text-amber-300 font-bold">
                    Coins: {currentUser.coins.toLocaleString()}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectSidebarTab('dashboard');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Dashboard Overview
                  </button>
                  <button
                    onClick={() => {
                      onSelectSidebarTab('wallet');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Wallet (Rs 157 Pack)
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('/');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 cursor-pointer flex items-center justify-between ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span>Live Voice Party</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="pt-1 border-t border-white/5">
                  <button
                    onClick={() => {
                      switchAccount(isAdmin ? 'alex' : 'admin');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      isDark ? 'text-purple-300 hover:bg-white/5' : 'text-purple-700 hover:bg-slate-100'
                    }`}
                  >
                    Switch to {isAdmin ? 'User Role' : 'Super Admin Role'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* DASHFLAT BODY: SIDEBAR + MAIN VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION (DashFlat Style) */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 md:static md:block border-r transition-transform duration-200 shrink-0 ${
            isDark ? 'bg-[#0c0f1a] border-purple-900/30' : 'bg-white border-slate-200'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Profile Card in Sidebar */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isDark ? 'bg-gradient-to-r from-purple-950/40 to-slate-900 border-purple-500/20' : 'bg-purple-50/50 border-purple-100'
              }`}>
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.displayName}
                    className="w-10 h-10 rounded-xl object-cover border border-purple-500/40"
                  />
                  {currentUser.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate text-white dark:text-white">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[10px] text-purple-400 font-mono truncate">
                    {currentUser.email || (isAdmin ? 'syedsherazisyedsherazi02@gmail.com' : 'alex.rivers@eita.app')}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-600 text-white font-black uppercase">
                      {isAdmin ? 'Admin' : `VIP ${currentUser.vipLevel}`}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">● Active</span>
                  </div>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  Navigation
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = activeSidebarTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectSidebarTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                            : isDark
                            ? 'text-slate-400 hover:text-white hover:bg-white/5'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-white' : 'text-purple-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                              isActive
                                ? 'bg-white text-purple-700'
                                : isDark
                                ? 'bg-white/10 text-purple-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Bottom Sidebar Action: Jump to App */}
            <div className={`pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'} space-y-2`}>
              <button
                onClick={() => navigateTo('/')}
                className="w-full h-10 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer hover:opacity-95"
              >
                <Radio className="w-4 h-4" />
                <span>Go to Live Voice Party</span>
              </button>

              <div className="text-[10px] text-slate-400 text-center font-mono pt-1">
                EITA DashFlat Engine v2.4 · {isDark ? 'Dark Theme' : 'Light Theme'}
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
          />
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
