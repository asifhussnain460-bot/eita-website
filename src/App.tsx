import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { UserProfileModal } from './components/common/UserProfileModal';
import { RoomsFeedView } from './components/room/RoomsFeedView';
import { VoiceRoomView } from './components/room/VoiceRoomView';
import { MiniRoomFloatingPlayer } from './components/room/MiniRoomFloatingPlayer';
import { GiftAnimationCanvas } from './components/room/GiftAnimationCanvas';
import { CreateRoomModal } from './components/room/CreateRoomModal';
import { WalletModal } from './components/wallet/WalletModal';
import { VipStoreModal } from './components/vip/VipStoreModal';
import { MessagesView } from './components/social/MessagesView';
import { CompetitionsView } from './components/leaderboard/CompetitionsView';
import { HostStudio } from './components/host/HostStudio';
import { AgencyDashboard } from './components/agency/AgencyDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { AdminPanel } from './components/admin/AdminPanel';
import { DashFlatLayout, DashboardSidebarTab } from './components/dashboard/DashFlatLayout';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';

function MainLayout() {
  const { activeRoom, isRoomMinimized, currentUser, currentRoute, navigateTo, theme } = useApp();

  const [currentTab, setCurrentTab] = useState<NavTab>('party');
  const [userDashTab, setUserDashTab] = useState<DashboardSidebarTab>('dashboard');
  const [adminDashTab, setAdminDashTab] = useState<DashboardSidebarTab>('dashboard');
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [showVipStore, setShowVipStore] = useState<boolean>(false);
  const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false);

  const isDark = theme === 'dark';

  // If in active room full-screen, render VoiceRoomView
  const isInFullScreenRoom = Boolean(activeRoom && !isRoomMinimized);

  // Handle sidebar navigation to rooms or wallet
  const handleUserSidebarSelect = (tab: DashboardSidebarTab) => {
    if (tab === 'rooms') {
      navigateTo('/');
      setCurrentTab('party');
    } else if (tab === 'wallet') {
      setShowWallet(true);
      setUserDashTab(tab);
    } else {
      setUserDashTab(tab);
    }
  };

  const handleAdminSidebarSelect = (tab: DashboardSidebarTab) => {
    if (tab === 'rooms') {
      navigateTo('/');
      setCurrentTab('party');
    } else {
      setAdminDashTab(tab);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-purple-600 selection:text-white ${
      isDark ? 'dark bg-[#080a10] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. If currently on /dashboard (User Dashboard DashFlat) */}
      {!isInFullScreenRoom && currentRoute === '/dashboard' && (
        <DashFlatLayout
          isAdmin={false}
          activeSidebarTab={userDashTab}
          onSelectSidebarTab={handleUserSidebarSelect}
        >
          <UserDashboard
            activeTab={userDashTab}
            onOpenWallet={() => setShowWallet(true)}
          />
        </DashFlatLayout>
      )}

      {/* 2. If currently on /admin_dashboard (Super Admin Dashboard DashFlat) */}
      {!isInFullScreenRoom && currentRoute === '/admin_dashboard' && (
        <DashFlatLayout
          isAdmin={true}
          activeSidebarTab={adminDashTab}
          onSelectSidebarTab={handleAdminSidebarSelect}
        >
          <AdminDashboard activeTab={adminDashTab} />
        </DashFlatLayout>
      )}

      {/* 3. If currently in Full-Screen Voice Room */}
      {isInFullScreenRoom && <VoiceRoomView />}

      {/* 4. If currently on Voice Party App (Route === '/') */}
      {!isInFullScreenRoom && currentRoute === '/' && (
        <>
          {/* Top Header */}
          <Header
            onOpenWallet={() => setShowWallet(true)}
            onOpenVipStore={() => setShowVipStore(true)}
            onOpenAdminPanel={() => navigateTo('/admin_dashboard')}
          />

          {/* Main Content Area */}
          <main className="flex-1 w-full">
            {currentTab === 'party' && (
              <RoomsFeedView onOpenCreateRoom={() => setShowCreateRoom(true)} />
            )}

            {currentTab === 'leaderboard' && <CompetitionsView />}

            {currentTab === 'messages' && <MessagesView />}

            {currentTab === 'studio' && (
              currentUser.role === 'agency' ? (
                <AgencyDashboard />
              ) : (
                <HostStudio
                  onOpenCreateRoom={() => setShowCreateRoom(true)}
                  onOpenWallet={() => setShowWallet(true)}
                />
              )
            )}

            {currentTab === 'profile' && (
              <ProfileView
                onOpenWallet={() => setShowWallet(true)}
                onOpenVipStore={() => setShowVipStore(true)}
              />
            )}

            {currentTab === 'admin' && <AdminPanel />}
          </main>

          {/* Mobile Bottom Navigation */}
          <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
        </>
      )}

      {/* Floating Mini Audio Room Bar (visible when browsing dashboards while in room) */}
      <MiniRoomFloatingPlayer />

      {/* Fullscreen Animated Gift Overlay */}
      <GiftAnimationCanvas />

      {/* Global Toast Container */}
      <ToastContainer />

      {/* User Profile Inspection Sheet */}
      <UserProfileModal />

      {/* Modals */}
      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
      {showVipStore && (
        <VipStoreModal
          onClose={() => setShowVipStore(false)}
          onOpenWallet={() => {
            setShowVipStore(false);
            setShowWallet(true);
          }}
        />
      )}
      {showCreateRoom && (
        <CreateRoomModal onClose={() => setShowCreateRoom(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
