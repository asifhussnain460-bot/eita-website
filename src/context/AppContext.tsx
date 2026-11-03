import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  UserRole,
  VipTierLevel,
  VoiceRoom,
  Seat,
  VirtualGift,
  ChatMessage,
  DirectMessageThread,
  FriendRequest,
  Transaction,
  WithdrawalRequest,
  Agency,
  DailyMission,
  ModerationReport,
  SupportedLanguage,
  SupportedCurrency
} from '../types';
import {
  DEMO_USERS,
  OTHER_COMMUNITY_USERS,
  VIRTUAL_GIFTS,
  INITIAL_ROOMS,
  INITIAL_AGENCY,
  DAILY_MISSIONS,
  COIN_PACKAGES,
  INITIAL_DMS,
  TRANSLATIONS,
  CURRENCY_RATES,
  CURRENCY_SYMBOLS,
  VIP_PRIVILEGES
} from '../data/initialData';
import { sounds } from '../utils/soundEffects';
import { MicrophoneAnalyzer } from '../utils/audioAnalyzer';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface ActiveGiftAnimationState {
  gift: VirtualGift;
  senderName: string;
  recipientName: string;
  combo: number;
}

interface AppContextType {
  currentUser: UserProfile;
  currentAccountKey: string;
  allUsers: UserProfile[];
  switchAccount: (key: 'alex' | 'layla' | 'golden_agency' | 'admin') => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  
  // Rooms
  rooms: VoiceRoom[];
  activeRoom: VoiceRoom | null;
  isRoomMinimized: boolean;
  userCurrentSeatIndex: number | null;
  isMicMuted: boolean;
  userVolume: number;
  isUserSpeaking: boolean;
  handRaiseQueue: UserProfile[];
  hasRaisedHand: boolean;
  createRoom: (roomData: { title: string; category: VoiceRoom['category']; description: string; isPrivate: boolean; password?: string; wallpaper: string; tags: string[] }) => string;
  joinRoom: (roomId: string, passwordInput?: string) => boolean;
  leaveRoom: () => void;
  minimizeRoom: () => void;
  restoreRoom: () => void;
  sitOnSeat: (seatIndex: number) => boolean;
  leaveSeat: () => void;
  toggleMic: () => Promise<void>;
  raiseHand: () => void;
  cancelRaiseHand: () => void;
  approveHandRaise: (user: UserProfile, seatIndex?: number) => void;
  rejectHandRaise: (userId: string) => void;
  moderatorMuteSeat: (seatIndex: number) => void;
  moderatorLockSeat: (seatIndex: number) => void;
  moderatorKickSeat: (seatIndex: number) => void;
  sendRoomChat: (content: string) => void;
  roomChatMessages: ChatMessage[];
  
  // Gifts
  gifts: VirtualGift[];
  activeGiftAnimation: ActiveGiftAnimationState | null;
  sendGift: (giftId: string, targetSeatIndex: number | 'all', combo?: number) => boolean;
  
  // Wallet & Monetization
  transactions: Transaction[];
  buyCoins: (packId: string, paymentMethod: string, cardInfo?: { name: string; number: string }) => boolean;
  subscribeVip: (vipLevel: VipTierLevel) => boolean;
  
  // Social
  dms: DirectMessageThread[];
  activeDmThread: DirectMessageThread | null;
  openDmWithUser: (user: UserProfile) => void;
  closeActiveDm: () => void;
  sendDmMessage: (text: string) => void;
  sendDmVoiceNote: (audioUrl: string, duration: number) => void;
  friendRequests: FriendRequest[];
  sendFriendRequest: (toUser: UserProfile) => void;
  respondFriendRequest: (requestId: string, accept: boolean) => void;
  toggleFollowUser: (userId: string) => void;
  followingSet: Set<string>;
  
  // Agency & Host System
  agency: Agency;
  registerAgency: (data: { name: string; email: string; region: string }) => void;
  inviteHostToAgency: (usernameOrId: string) => boolean;
  removeHostFromAgency: (hostId: string) => void;
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (beansAmount: number, method: WithdrawalRequest['paymentMethod'], accountDetails: WithdrawalRequest['accountDetails']) => boolean;
  
  // Missions
  dailyMissions: DailyMission[];
  claimMission: (missionId: string) => void;
  
  // Admin
  adminBanUser: (userId: string, ban: boolean) => void;
  adminGrantCoins: (userId: string, amount: number) => void;
  adminGrantBeans: (userId: string, amount: number) => void;
  adminSetRole: (userId: string, role: UserRole) => void;
  adminSetVip: (userId: string, level: VipTierLevel) => void;
  adminLockRoom: (roomId: string, lock: boolean) => void;
  adminTerminateRoom: (roomId: string) => void;
  adminProcessWithdrawal: (id: string, status: 'approved' | 'rejected' | 'paid', notes?: string) => void;
  moderationReports: ModerationReport[];
  submitReport: (report: Omit<ModerationReport, 'id' | 'createdAt' | 'status'>) => void;
  adminHandleReport: (reportId: string, status: ModerationReport['status']) => void;
  platformCommissionRate: number;
  setPlatformCommissionRate: (rate: number) => void;
  
  // UI & Global
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentRoute: string;
  navigateTo: (route: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currency: SupportedCurrency;
  setCurrency: (cur: SupportedCurrency) => void;
  t: (key: string) => string;
  formatCurrency: (usdAmount: number) => string;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Inspect Profile Sheet
  inspectedUser: UserProfile | null;
  openUserProfile: (user: UserProfile) => void;
  closeUserProfile: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts
  const [currentAccountKey, setCurrentAccountKey] = useState<'alex' | 'layla' | 'golden_agency' | 'admin'>('alex');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.alex);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    DEMO_USERS.alex,
    DEMO_USERS.layla,
    DEMO_USERS.golden_agency,
    DEMO_USERS.admin,
    ...OTHER_COMMUNITY_USERS,
  ]);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set(['user_layla', 'user_sophia']));

  // Theme & Dual Mode
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eita_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Client Routing
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/dashboard' || path === '/admin_dashboard') return path;
    }
    return '/dashboard'; // Default to User Dashboard per requirement
  });

  const navigateTo = useCallback((route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== route) {
        window.history.pushState({}, '', route);
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('eita_theme', next);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setCurrentRoute(window.location.pathname);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Localization & Audio
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');

  // Rooms
  const [rooms, setRooms] = useState<VoiceRoom[]>(INITIAL_ROOMS);
  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null);
  const [isRoomMinimized, setIsRoomMinimized] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(true);
  const [userVolume, setUserVolume] = useState<number>(0);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
  const [handRaiseQueue, setHandRaiseQueue] = useState<UserProfile[]>([]);
  const [roomChatMessages, setRoomChatMessages] = useState<ChatMessage[]>([]);

  // Gifts & Animations
  const [gifts] = useState<VirtualGift[]>(VIRTUAL_GIFTS);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<ActiveGiftAnimationState | null>(null);

  // Wallet
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_init_1',
      userId: DEMO_USERS.alex.id,
      type: 'purchase_coins',
      amount: 48500,
      currency: 'COINS',
      description: 'Coin Store - High Roller Pack',
      status: 'completed',
      createdAt: '2026-11-02 14:20',
    },
    {
      id: 'tx_init_2',
      userId: DEMO_USERS.alex.id,
      type: 'send_gift',
      amount: 1500,
      currency: 'COINS',
      description: 'Sent Cyber Sports Car to Layla Melody',
      status: 'completed',
      createdAt: '2026-11-02 18:30',
    },
  ]);

  // Social & DMs
  const [dms, setDms] = useState<DirectMessageThread[]>(INITIAL_DMS);
  const [activeDmThread, setActiveDmThread] = useState<DirectMessageThread | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: 'fr_1',
      fromUser: OTHER_COMMUNITY_USERS[2], // kenji
      toUserId: DEMO_USERS.alex.id,
      timestamp: '1 hour ago',
      status: 'pending',
    },
  ]);

  // Agency & Host
  const [agency, setAgency] = useState<Agency>(INITIAL_AGENCY);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    {
      id: 'w_demo_1',
      userId: 'user_layla',
      userName: 'Layla Melody 🎤',
      userRole: 'host',
      beansAmount: 100000,
      usdAmount: 100.0,
      paymentMethod: 'bank_transfer',
      accountDetails: {
        accountName: 'Layla Al-Mansoor',
        accountNumberOrEmail: 'AE820330000987654321',
        bankOrNetwork: 'Emirates NBD',
      },
      status: 'paid',
      createdAt: '2026-10-28 10:15',
      processedAt: '2026-10-29 09:00',
    },
    {
      id: 'w_demo_2',
      userId: 'user_agency_boss',
      userName: 'Golden Star Media Group',
      userRole: 'agency',
      beansAmount: 500000,
      usdAmount: 500.0,
      paymentMethod: 'usdt_crypto',
      accountDetails: {
        accountName: 'Golden Star Treasury',
        accountNumberOrEmail: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        bankOrNetwork: 'TRC-20 (Tron)',
      },
      status: 'pending',
      createdAt: '2026-11-02 08:30',
    },
  ]);

  // Missions & Admin
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(DAILY_MISSIONS);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([
    {
      id: 'rep_1',
      reporterId: 'user_alex',
      reporterName: 'Alex Rivers',
      targetId: 'user_spammer',
      targetName: 'TrollBot99',
      targetType: 'user',
      reason: 'spam',
      details: 'Repeated promotional spam links in public room chat.',
      status: 'pending',
      createdAt: '2026-11-02 12:40',
    },
  ]);
  const [platformCommissionRate, setPlatformCommissionRate] = useState<number>(0.3); // 30%

  // Global Toasts & Inspect Profile Modal
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [inspectedUser, setInspectedUser] = useState<UserProfile | null>(null);

  // Audio Analyzer Ref
  const micAnalyzerRef = useRef<MicrophoneAnalyzer>(new MicrophoneAnalyzer());

  // Toast Helpers
  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync sound setting
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    addToast({
      type: 'info',
      title: 'Sound Settings',
      message: next ? 'Audio effects enabled' : 'Audio effects muted',
    });
  };

  // Translation lookup
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  // Currency Formatter
  const formatCurrency = (usdAmount: number): string => {
    const rate = CURRENCY_RATES[currency] || 1;
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    const converted = usdAmount * rate;
    if (currency === 'IDR') {
      return `${symbol} ${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol}${converted.toFixed(2)}`;
  };

  // Account Switcher
  const switchAccount = (key: 'alex' | 'layla' | 'golden_agency' | 'admin') => {
    // If sitting on a seat, leave it first
    if (activeRoom) {
      leaveRoom();
    }
    setCurrentAccountKey(key);
    const user = DEMO_USERS[key];
    setCurrentUser(user);

    // Redirect user to /dashboard, and admin to /admin_dashboard
    if (key === 'admin') {
      navigateTo('/admin_dashboard');
    } else {
      navigateTo('/dashboard');
    }

    addToast({
      type: 'success',
      title: 'Role Switched',
      message: `Logged in as ${user.displayName} (${user.role.toUpperCase()})`,
    });
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      setAllUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    });
  };

  // Check if current user is on any seat in active room
  const userCurrentSeatIndex = activeRoom
    ? activeRoom.seats.findIndex((s) => s.user?.id === currentUser.id)
    : -1;

  const hasRaisedHand = activeRoom
    ? handRaiseQueue.some((u) => u.id === currentUser.id)
    : false;

  // Real-time Audio Capture handling
  const toggleMic = async () => {
    if (userCurrentSeatIndex === -1) {
      addToast({
        type: 'warning',
        title: 'Microphone Inactive',
        message: 'Take a speaker seat to unmute and talk.',
      });
      return;
    }

    sounds.playMicClick();

    if (!isMicMuted) {
      // Currently unmuted -> Mute
      micAnalyzerRef.current.stop();
      setIsMicMuted(true);
      setUserVolume(0);
      setIsUserSpeaking(false);
      updateSeatSpeaking(userCurrentSeatIndex, false, 0, true);
      addToast({
        type: 'info',
        title: 'Mic Muted',
        message: 'Your microphone is now muted.',
      });
    } else {
      // Currently muted -> Try real microphone access
      setIsMicMuted(false);
      updateSeatSpeaking(userCurrentSeatIndex, false, 0, false);

      const success = await micAnalyzerRef.current.start((vol, speaking) => {
        setUserVolume(vol);
        setIsUserSpeaking(speaking);
        if (activeRoom) {
          updateSeatSpeaking(userCurrentSeatIndex, speaking, vol, false);
        }
      });

      if (!success) {
        // Fallback: simulated voice activity so the feature still feels awesome!
        addToast({
          type: 'info',
          title: 'Mic Live (Simulated)',
          message: 'Microphone active! Speak to light up the seat ring.',
        });
      } else {
        addToast({
          type: 'success',
          title: 'Microphone Active',
          message: 'Real-time Web Audio analyzer listening to your mic!',
        });
      }
    }
  };

  const updateSeatSpeaking = (
    seatIdx: number,
    isSpeaking: boolean,
    volume: number,
    isMuted: boolean
  ) => {
    if (!activeRoom) return;
    setActiveRoom((prev) => {
      if (!prev) return null;
      const nextSeats = [...prev.seats];
      if (nextSeats[seatIdx]) {
        nextSeats[seatIdx] = {
          ...nextSeats[seatIdx],
          isSpeaking,
          volume,
          isMuted,
        };
      }
      return { ...prev, seats: nextSeats };
    });
  };

  // Join Voice Room
  const joinRoom = (roomId: string, passwordInput?: string): boolean => {
    const target = rooms.find((r) => r.id === roomId);
    if (!target) {
      addToast({ type: 'error', title: 'Room Error', message: 'Room not found.' });
      return false;
    }

    if (target.isPrivate && target.password) {
      if (passwordInput !== target.password) {
        addToast({
          type: 'error',
          title: 'Access Denied',
          message: 'Incorrect room password.',
        });
        return false;
      }
    }

    setActiveRoom(target);
    setIsRoomMinimized(false);
    setIsMicMuted(true);
    setUserVolume(0);
    setIsUserSpeaking(false);
    setHandRaiseQueue([]);

    // Initial greeting in room chat
    const entranceMsg: ChatMessage = {
      id: 'msg_ent_' + Date.now(),
      roomId: target.id,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderVip: currentUser.vipLevel,
      content: currentUser.vipLevel >= 3
        ? `✨ VIP ${currentUser.vipLevel} ${currentUser.displayName} has arrived in the party! ✨`
        : `${currentUser.displayName} entered the room`,
      type: 'entrance',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setRoomChatMessages([entranceMsg]);

    // Sound effect & confetti for VIP entrance
    if (currentUser.vipLevel >= 3) {
      sounds.playVipFanfare();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
      });
    }

    addToast({
      type: 'success',
      title: 'Joined Room',
      message: `Welcome to ${target.title}`,
    });

    return true;
  };

  // Leave Room
  const leaveRoom = () => {
    micAnalyzerRef.current.stop();
    if (activeRoom && userCurrentSeatIndex !== -1) {
      leaveSeat();
    }
    setActiveRoom(null);
    setIsRoomMinimized(false);
    setIsMicMuted(true);
    setUserVolume(0);
    setIsUserSpeaking(false);
    setHandRaiseQueue([]);
    setRoomChatMessages([]);
  };

  const minimizeRoom = () => {
    if (activeRoom) {
      setIsRoomMinimized(true);
    }
  };

  const restoreRoom = () => {
    setIsRoomMinimized(false);
  };

  // Create Room
  const createRoom = (data: {
    title: string;
    category: VoiceRoom['category'];
    description: string;
    isPrivate: boolean;
    password?: string;
    wallpaper: string;
    tags: string[];
  }): string => {
    const newRoomId = 'room_' + Date.now();
    const emptySeats: Seat[] = Array.from({ length: 12 }, (_, i) => ({
      index: i,
      user: i === 0 ? currentUser : null,
      isMuted: false,
      isLocked: false,
      isSpeaking: false,
      volume: 0,
    }));

    const newRoom: VoiceRoom = {
      id: newRoomId,
      title: data.title,
      description: data.description,
      category: data.category,
      ownerId: currentUser.id,
      ownerName: currentUser.displayName,
      ownerAvatar: currentUser.avatar,
      ownerVip: currentUser.vipLevel,
      wallpaper: data.wallpaper,
      isPrivate: data.isPrivate,
      password: data.password,
      seats: emptySeats,
      listenersCount: 1,
      tags: data.tags.length > 0 ? data.tags : ['Party', 'Voice'],
      totalGiftsReceived: 0,
      moderatorIds: [currentUser.id],
      createdAt: new Date().toISOString(),
    };

    setRooms((prev) => [newRoom, ...prev]);
    joinRoom(newRoomId, data.password);
    addToast({
      type: 'success',
      title: 'Room Created',
      message: 'Your 12-seat voice party room is now live!',
    });
    return newRoomId;
  };

  // Take a seat
  const sitOnSeat = (seatIndex: number): boolean => {
    if (!activeRoom) return false;
    const targetSeat = activeRoom.seats[seatIndex];
    if (targetSeat.isLocked) {
      addToast({
        type: 'warning',
        title: 'Seat Locked',
        message: 'This seat is locked by the room moderator.',
      });
      return false;
    }
    if (targetSeat.user && targetSeat.user.id !== currentUser.id) {
      addToast({
        type: 'warning',
        title: 'Seat Occupied',
        message: 'This seat is already taken.',
      });
      return false;
    }

    // Free any existing seat
    const updatedSeats = activeRoom.seats.map((s, i) => {
      if (s.user?.id === currentUser.id) {
        return { ...s, user: null, isSpeaking: false, volume: 0 };
      }
      if (i === seatIndex) {
        return { ...s, user: currentUser, isMuted: true, isSpeaking: false, volume: 0 };
      }
      return s;
    });

    setActiveRoom((prev) => (prev ? { ...prev, seats: updatedSeats } : null));
    setIsMicMuted(true);
    // Remove from hand raise queue if present
    setHandRaiseQueue((prev) => prev.filter((u) => u.id !== currentUser.id));

    sounds.playMicClick();
    addToast({
      type: 'success',
      title: 'Seat Taken',
      message: `You are now on Seat #${seatIndex + 1}. Unmute to speak!`,
    });
    return true;
  };

  // Leave seat
  const leaveSeat = () => {
    if (!activeRoom || userCurrentSeatIndex === -1) return;
    micAnalyzerRef.current.stop();
    setIsMicMuted(true);
    setUserVolume(0);
    setIsUserSpeaking(false);

    const updatedSeats = activeRoom.seats.map((s, i) => {
      if (i === userCurrentSeatIndex) {
        return { ...s, user: null, isSpeaking: false, volume: 0, isMuted: false };
      }
      return s;
    });

    setActiveRoom((prev) => (prev ? { ...prev, seats: updatedSeats } : null));
    addToast({
      type: 'info',
      title: 'Left Seat',
      message: 'You moved to the listener lounge.',
    });
  };

  // Hand raise
  const raiseHand = () => {
    if (!activeRoom) return;
    if (userCurrentSeatIndex !== -1) {
      addToast({ type: 'info', title: 'Already on Seat', message: 'You are already a speaker.' });
      return;
    }
    if (!handRaiseQueue.some((u) => u.id === currentUser.id)) {
      setHandRaiseQueue((prev) => [...prev, currentUser]);
      addToast({
        type: 'success',
        title: 'Hand Raised',
        message: 'Waiting for room host or moderator approval.',
      });
    }
  };

  const cancelRaiseHand = () => {
    setHandRaiseQueue((prev) => prev.filter((u) => u.id !== currentUser.id));
    addToast({ type: 'info', title: 'Hand Lowered', message: 'Canceled speaker request.' });
  };

  const approveHandRaise = (user: UserProfile, seatIndex?: number) => {
    if (!activeRoom) return;
    // Find first empty seat if none specified
    let targetIndex = seatIndex;
    if (targetIndex === undefined) {
      targetIndex = activeRoom.seats.findIndex((s) => !s.user && !s.isLocked);
    }
    if (targetIndex === -1 || targetIndex === undefined) {
      addToast({
        type: 'warning',
        title: 'All Seats Full',
        message: 'No available open seats in the 12-seat stage.',
      });
      return;
    }

    const updatedSeats = activeRoom.seats.map((s, i) => {
      if (i === targetIndex) {
        return { ...s, user, isMuted: true, isSpeaking: false, volume: 0 };
      }
      return s;
    });

    setActiveRoom((prev) => (prev ? { ...prev, seats: updatedSeats } : null));
    setHandRaiseQueue((prev) => prev.filter((u) => u.id !== user.id));
    addToast({
      type: 'success',
      title: 'Speaker Approved',
      message: `${user.displayName} is now on Seat #${targetIndex + 1}.`,
    });
  };

  const rejectHandRaise = (userId: string) => {
    setHandRaiseQueue((prev) => prev.filter((u) => u.id !== userId));
  };

  // Moderator Controls
  const moderatorMuteSeat = (seatIndex: number) => {
    if (!activeRoom) return;
    const seat = activeRoom.seats[seatIndex];
    if (!seat.user) return;

    const nextMuted = !seat.isMuted;
    setActiveRoom((prev) => {
      if (!prev) return null;
      const nextSeats = [...prev.seats];
      nextSeats[seatIndex] = { ...seat, isMuted: nextMuted, isSpeaking: false, volume: 0 };
      return { ...prev, seats: nextSeats };
    });

    addToast({
      type: 'info',
      title: nextMuted ? 'Speaker Muted' : 'Speaker Unmuted',
      message: `${seat.user.displayName} on Seat #${seatIndex + 1} was ${nextMuted ? 'muted' : 'unmuted'}.`,
    });
  };

  const moderatorLockSeat = (seatIndex: number) => {
    if (!activeRoom) return;
    const seat = activeRoom.seats[seatIndex];
    const nextLocked = !seat.isLocked;

    setActiveRoom((prev) => {
      if (!prev) return null;
      const nextSeats = [...prev.seats];
      nextSeats[seatIndex] = {
        ...seat,
        isLocked: nextLocked,
        user: nextLocked ? null : seat.user,
      };
      return { ...prev, seats: nextSeats };
    });

    addToast({
      type: 'info',
      title: nextLocked ? 'Seat Locked' : 'Seat Unlocked',
      message: `Seat #${seatIndex + 1} is now ${nextLocked ? 'locked' : 'available'}.`,
    });
  };

  const moderatorKickSeat = (seatIndex: number) => {
    if (!activeRoom) return;
    const seat = activeRoom.seats[seatIndex];
    if (!seat.user) return;

    setActiveRoom((prev) => {
      if (!prev) return null;
      const nextSeats = [...prev.seats];
      nextSeats[seatIndex] = { ...seat, user: null, isSpeaking: false, volume: 0 };
      return { ...prev, seats: nextSeats };
    });

    addToast({
      type: 'warning',
      title: 'Speaker Removed',
      message: `${seat.user.displayName} was removed from the microphone.`,
    });
  };

  // Send Room Chat Message
  const sendRoomChat = (content: string) => {
    if (!activeRoom || !content.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      roomId: activeRoom.id,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderVip: currentUser.vipLevel,
      content: content.trim(),
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setRoomChatMessages((prev) => [...prev, newMsg]);

    // Update mission progress
    setDailyMissions((missions) =>
      missions.map((m) => {
        if (m.id === 'm_chat' && !m.completed) {
          const p = Math.min(m.maxProgress, m.progress + 1);
          return { ...m, progress: p, completed: p >= m.maxProgress };
        }
        return m;
      })
    );
  };

  // Send Virtual Gift
  const sendGift = (
    giftId: string,
    targetSeatIndex: number | 'all',
    combo: number = 1
  ): boolean => {
    const gift = gifts.find((g) => g.id === giftId);
    if (!gift) return false;

    if (!activeRoom) {
      addToast({
        type: 'warning',
        title: 'No Active Room',
        message: 'Join a voice room to send virtual gifts.',
      });
      return false;
    }

    // Determine target recipients
    const targetSeats: Seat[] = [];
    if (targetSeatIndex === 'all') {
      activeRoom.seats.forEach((s) => {
        if (s.user && s.user.id !== currentUser.id) {
          targetSeats.push(s);
        }
      });
      if (targetSeats.length === 0) {
        addToast({
          type: 'warning',
          title: 'No Other Speakers',
          message: 'No other speakers are on the mic to receive gifts.',
        });
        return false;
      }
    } else {
      const seat = activeRoom.seats[targetSeatIndex];
      if (!seat || !seat.user) {
        addToast({
          type: 'warning',
          title: 'Seat Empty',
          message: 'Choose an occupied speaker seat.',
        });
        return false;
      }
      if (seat.user.id === currentUser.id) {
        addToast({
          type: 'warning',
          title: 'Self-Gifting',
          message: 'You cannot send gifts to yourself!',
        });
        return false;
      }
      targetSeats.push(seat);
    }

    const totalCoinsCost = gift.coinPrice * combo * targetSeats.length;
    if (currentUser.coins < totalCoinsCost) {
      addToast({
        type: 'error',
        title: 'Insufficient Coins',
        message: `You need ${totalCoinsCost.toLocaleString()} coins. Top up in the Wallet!`,
      });
      return false;
    }

    // Deduct coins
    updateCurrentUser({ coins: currentUser.coins - totalCoinsCost });

    // 70% converted to Beans for recipients
    const beansPerRecipient = Math.round(gift.coinPrice * combo * 0.7);

    // Audio & Confetti
    sounds.playGift();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Launch Fullscreen Animated Gift
    const recipientNames = targetSeats.map((s) => s.user!.displayName).join(', ');
    setActiveGiftAnimation({
      gift,
      senderName: currentUser.displayName,
      recipientName: recipientNames,
      combo,
    });
    setTimeout(() => {
      setActiveGiftAnimation(null);
    }, 4500);

    // Chat announcement
    const giftChatMsg: ChatMessage = {
      id: 'msg_gift_' + Date.now(),
      roomId: activeRoom.id,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderVip: currentUser.vipLevel,
      content: `sent ${gift.name} ${gift.icon} x${combo} to ${recipientNames}!`,
      type: 'gift',
      giftData: {
        giftName: gift.name,
        giftIcon: gift.icon,
        giftPrice: totalCoinsCost,
        recipientName: recipientNames,
        combo,
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setRoomChatMessages((prev) => [...prev, giftChatMsg]);

    // Record Transaction
    const newTx: Transaction = {
      id: 'tx_gift_' + Date.now(),
      userId: currentUser.id,
      type: 'send_gift',
      amount: totalCoinsCost,
      currency: 'COINS',
      description: `Sent ${gift.name} x${combo} to ${recipientNames}`,
      status: 'completed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update Room total gift points & PK battle if active
    setActiveRoom((prev) => {
      if (!prev) return null;
      let pk = prev.pkBattle;
      if (pk && pk.isActive) {
        // Red team is seat 0-5, blue team is seat 6-11
        const isRed = typeof targetSeatIndex === 'number' && targetSeatIndex < 6;
        pk = {
          ...pk,
          redTeamScore: isRed ? pk.redTeamScore + totalCoinsCost : pk.redTeamScore,
          blueTeamScore: !isRed ? pk.blueTeamScore + totalCoinsCost : pk.blueTeamScore,
        };
      }
      return {
        ...prev,
        totalGiftsReceived: prev.totalGiftsReceived + totalCoinsCost,
        pkBattle: pk,
      };
    });

    // Update mission progress
    setDailyMissions((missions) =>
      missions.map((m) => (m.id === 'm_gift' ? { ...m, progress: 1, completed: true } : m))
    );

    addToast({
      type: 'success',
      title: 'Gift Sent! 🎁',
      message: `Sent ${gift.name} x${combo} (${totalCoinsCost.toLocaleString()} Coins)`,
    });

    return true;
  };

  // Buy Coins
  const buyCoins = (packId: string, paymentMethod: string, _cardInfo?: { name: string; number: string }): boolean => {
    const pack = COIN_PACKAGES.find((p) => p.id === packId);
    if (!pack) return false;

    const totalCoins = pack.coins + pack.bonus;
    updateCurrentUser({ coins: currentUser.coins + totalCoins });

    sounds.playCoin();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    const tx: Transaction = {
      id: 'tx_buy_' + Date.now(),
      userId: currentUser.id,
      type: 'purchase_coins',
      amount: totalCoins,
      currency: 'COINS',
      description: `Purchased ${pack.tag} Pack (${paymentMethod.toUpperCase()})`,
      status: 'completed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referenceId: 'PAY_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    };
    setTransactions((prev) => [tx, ...prev]);

    addToast({
      type: 'success',
      title: 'Payment Successful',
      message: `Added ${totalCoins.toLocaleString()} Coins to your wallet!`,
    });

    return true;
  };

  // Subscribe VIP
  const subscribeVip = (vipLevel: VipTierLevel): boolean => {
    const privilege = VIP_PRIVILEGES.find((v) => v.level === vipLevel);
    if (!privilege) return false;

    if (currentUser.coins < privilege.priceCoins) {
      addToast({
        type: 'error',
        title: 'Insufficient Coins',
        message: `You need ${privilege.priceCoins.toLocaleString()} coins for ${privilege.name}.`,
      });
      return false;
    }

    updateCurrentUser({
      coins: currentUser.coins - privilege.priceCoins,
      vipLevel,
    });

    sounds.playVipFanfare();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.3 },
    });

    const tx: Transaction = {
      id: 'tx_vip_' + Date.now(),
      userId: currentUser.id,
      type: 'vip_subscribe',
      amount: privilege.priceCoins,
      currency: 'COINS',
      description: `Activated 30-Day ${privilege.name}`,
      status: 'completed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTransactions((prev) => [tx, ...prev]);

    addToast({
      type: 'success',
      title: 'VIP Activated! 👑',
      message: `You are now ${privilege.name}! Enjoy exclusive perks and frames.`,
    });

    return true;
  };

  // Social DMs
  const openDmWithUser = (user: UserProfile) => {
    let thread = dms.find((d) => d.participant.id === user.id);
    if (!thread) {
      thread = {
        id: 'dm_' + user.id,
        participant: user,
        lastMessage: 'Started conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [],
      };
      setDms((prev) => [thread!, ...prev]);
    }
    setActiveDmThread(thread);
  };

  const closeActiveDm = () => {
    setActiveDmThread(null);
  };

  const sendDmMessage = (text: string) => {
    if (!activeDmThread || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: 'dm_msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderVip: currentUser.vipLevel,
      content: text.trim(),
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDms((prev) =>
      prev.map((thread) => {
        if (thread.id === activeDmThread.id) {
          return {
            ...thread,
            lastMessage: text.trim(),
            lastMessageTime: 'Just now',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );

    setActiveDmThread((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    sounds.playMicClick();
  };

  const sendDmVoiceNote = (audioUrl: string, duration: number) => {
    if (!activeDmThread) return;

    const newMsg: ChatMessage = {
      id: 'dm_voice_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderVip: currentUser.vipLevel,
      content: '🎙️ Voice note',
      type: 'voice',
      voiceData: {
        audioUrl,
        duration,
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDms((prev) =>
      prev.map((thread) => {
        if (thread.id === activeDmThread.id) {
          return {
            ...thread,
            lastMessage: `🎙️ Voice Note (${duration}s)`,
            lastMessageTime: 'Just now',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );

    setActiveDmThread((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    addToast({
      type: 'success',
      title: 'Voice Note Sent',
      message: `Audio message sent (${duration} seconds)`,
    });
  };

  // Friend Requests & Follows
  const sendFriendRequest = (toUser: UserProfile) => {
    const existing = friendRequests.find(
      (fr) => fr.toUserId === toUser.id && fr.fromUser.id === currentUser.id
    );
    if (existing) {
      addToast({
        type: 'info',
        title: 'Already Sent',
        message: 'Friend request already pending.',
      });
      return;
    }

    const req: FriendRequest = {
      id: 'fr_' + Date.now(),
      fromUser: currentUser,
      toUserId: toUser.id,
      timestamp: 'Just now',
      status: 'pending',
    };
    setFriendRequests((prev) => [req, ...prev]);
    addToast({
      type: 'success',
      title: 'Friend Request Sent',
      message: `Sent request to ${toUser.displayName}`,
    });
  };

  const respondFriendRequest = (requestId: string, accept: boolean) => {
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: accept ? 'accepted' : 'declined' } : r))
    );
    if (accept) {
      updateCurrentUser({ friendsCount: currentUser.friendsCount + 1 });
      sounds.playCoin();
      addToast({
        type: 'success',
        title: 'Friend Request Accepted',
        message: 'You are now friends!',
      });
    } else {
      addToast({ type: 'info', title: 'Request Declined', message: 'Friend request ignored.' });
    }
  };

  const toggleFollowUser = (userId: string) => {
    setFollowingSet((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
        updateCurrentUser({ followingCount: Math.max(0, currentUser.followingCount - 1) });
        addToast({ type: 'info', title: 'Unfollowed', message: 'User removed from following.' });
      } else {
        next.add(userId);
        updateCurrentUser({ followingCount: currentUser.followingCount + 1 });
        addToast({ type: 'success', title: 'Followed', message: 'User added to following!' });
      }
      return next;
    });
  };

  // Agency System
  const registerAgency = (data: { name: string; email: string; region: string }) => {
    const newAgency: Agency = {
      id: 'agency_' + Date.now(),
      code: 'EITA' + Math.floor(1000 + Math.random() * 9000),
      name: data.name,
      ownerId: currentUser.id,
      ownerName: currentUser.displayName,
      ownerEmail: data.email,
      region: data.region,
      verified: true,
      commissionRate: 0.15,
      totalHosts: 0,
      monthlyBeans: 0,
      monthlyEarningsUsd: 0,
      hosts: [],
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setAgency(newAgency);
    updateCurrentUser({ role: 'agency', agencyId: newAgency.id, agencyName: newAgency.name });
    addToast({
      type: 'success',
      title: 'Agency Registered',
      message: `Agency ${data.name} verified! Your agency code is ${newAgency.code}`,
    });
  };

  const inviteHostToAgency = (usernameOrId: string): boolean => {
    const target = allUsers.find(
      (u) =>
        u.username.toLowerCase() === usernameOrId.toLowerCase() ||
        u.id.toLowerCase() === usernameOrId.toLowerCase()
    );
    if (!target) {
      addToast({ type: 'error', title: 'User Not Found', message: 'Could not find host account.' });
      return false;
    }

    if (agency.hosts.some((h) => h.hostId === target.id)) {
      addToast({
        type: 'warning',
        title: 'Already in Agency',
        message: `${target.displayName} is already on your roster.`,
      });
      return false;
    }

    const updatedHosts = [
      ...agency.hosts,
      {
        hostId: target.id,
        username: target.username,
        displayName: target.displayName,
        avatar: target.avatar,
        streamHoursThisMonth: 12.0,
        beansCollectedThisMonth: 45000,
        targetProgressPercent: 35,
        joinedDate: new Date().toISOString().substring(0, 10),
      },
    ];

    setAgency((prev) => ({
      ...prev,
      totalHosts: updatedHosts.length,
      hosts: updatedHosts,
    }));

    addToast({
      type: 'success',
      title: 'Host Recruited',
      message: `${target.displayName} added to ${agency.name} roster.`,
    });
    return true;
  };

  const removeHostFromAgency = (hostId: string) => {
    const updated = agency.hosts.filter((h) => h.hostId !== hostId);
    setAgency((prev) => ({
      ...prev,
      totalHosts: updated.length,
      hosts: updated,
    }));
    addToast({ type: 'info', title: 'Host Removed', message: 'Host departed from agency.' });
  };

  // Withdrawals (Host & Agency)
  const requestWithdrawal = (
    beansAmount: number,
    method: WithdrawalRequest['paymentMethod'],
    accountDetails: WithdrawalRequest['accountDetails']
  ): boolean => {
    if (currentUser.beans < beansAmount) {
      addToast({
        type: 'error',
        title: 'Insufficient Beans',
        message: 'You do not have enough beans for this withdrawal.',
      });
      return false;
    }

    // 1,000 beans = $1.00 USD
    const usdAmount = beansAmount / 1000;
    if (usdAmount < 20) {
      addToast({
        type: 'warning',
        title: 'Minimum Cashout',
        message: 'Minimum withdrawal amount is $20.00 (20,000 Beans).',
      });
      return false;
    }

    updateCurrentUser({ beans: currentUser.beans - beansAmount });

    const newReq: WithdrawalRequest = {
      id: 'w_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.displayName,
      userRole: currentUser.role === 'agency' ? 'agency' : 'host',
      beansAmount,
      usdAmount,
      paymentMethod: method,
      accountDetails,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setWithdrawals((prev) => [newReq, ...prev]);

    const tx: Transaction = {
      id: 'tx_w_' + Date.now(),
      userId: currentUser.id,
      type: 'withdraw_cash',
      amount: beansAmount,
      currency: 'BEANS',
      description: `Cashout Request ($${usdAmount.toFixed(2)} USD via ${method})`,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referenceId: newReq.id,
    };
    setTransactions((prev) => [tx, ...prev]);

    addToast({
      type: 'success',
      title: 'Withdrawal Requested',
      message: `Submitted $${usdAmount.toFixed(2)} USD for admin processing.`,
    });

    return true;
  };

  // Daily Missions
  const claimMission = (missionId: string) => {
    const mission = dailyMissions.find((m) => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    updateCurrentUser({ coins: currentUser.coins + mission.rewardCoins });
    setDailyMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
    );

    sounds.playCoin();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    const tx: Transaction = {
      id: 'tx_mission_' + Date.now(),
      userId: currentUser.id,
      type: 'mission_reward',
      amount: mission.rewardCoins,
      currency: 'COINS',
      description: `Mission Reward: ${mission.title}`,
      status: 'completed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTransactions((prev) => [tx, ...prev]);

    addToast({
      type: 'success',
      title: 'Reward Claimed!',
      message: `+${mission.rewardCoins} Coins added to your wallet.`,
    });
  };

  // Admin Actions
  const adminBanUser = (userId: string, ban: boolean) => {
    setAllUsers((users) => users.map((u) => (u.id === userId ? { ...u, isBanned: ban } : u)));
    if (currentUser.id === userId) {
      updateCurrentUser({ isBanned: ban });
    }
    addToast({
      type: ban ? 'warning' : 'success',
      title: ban ? 'User Banned' : 'User Unbanned',
      message: `Account status updated.`,
    });
  };

  const adminGrantCoins = (userId: string, amount: number) => {
    setAllUsers((users) =>
      users.map((u) => (u.id === userId ? { ...u, coins: u.coins + amount } : u))
    );
    if (currentUser.id === userId) {
      updateCurrentUser({ coins: currentUser.coins + amount });
    }
    addToast({
      type: 'success',
      title: 'Coins Granted',
      message: `Adjusted user coins by ${amount > 0 ? '+' : ''}${amount}.`,
    });
  };

  const adminGrantBeans = (userId: string, amount: number) => {
    setAllUsers((users) =>
      users.map((u) => (u.id === userId ? { ...u, beans: u.beans + amount } : u))
    );
    if (currentUser.id === userId) {
      updateCurrentUser({ beans: currentUser.beans + amount });
    }
    addToast({
      type: 'success',
      title: 'Beans Granted',
      message: `Adjusted user beans by ${amount > 0 ? '+' : ''}${amount}.`,
    });
  };

  const adminSetRole = (userId: string, role: UserRole) => {
    setAllUsers((users) => users.map((u) => (u.id === userId ? { ...u, role } : u)));
    if (currentUser.id === userId) {
      updateCurrentUser({ role });
    }
    addToast({
      type: 'info',
      title: 'Role Updated',
      message: `User role changed to ${role.toUpperCase()}.`,
    });
  };

  const adminSetVip = (userId: string, level: VipTierLevel) => {
    setAllUsers((users) => users.map((u) => (u.id === userId ? { ...u, vipLevel: level } : u)));
    if (currentUser.id === userId) {
      updateCurrentUser({ vipLevel: level });
    }
    addToast({
      type: 'success',
      title: 'VIP Updated',
      message: `User VIP level set to VIP ${level}.`,
    });
  };

  const adminLockRoom = (roomId: string, lock: boolean) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              isPrivate: lock,
              password: lock ? 'ADMIN' : undefined,
            }
          : r
      )
    );
    addToast({
      type: 'info',
      title: lock ? 'Room Locked' : 'Room Unlocked',
      message: `Room status updated by platform admin.`,
    });
  };

  const adminTerminateRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    if (activeRoom && activeRoom.id === roomId) {
      leaveRoom();
    }
    addToast({
      type: 'warning',
      title: 'Room Terminated',
      message: 'Room was closed by platform administration.',
    });
  };

  const adminProcessWithdrawal = (
    id: string,
    status: 'approved' | 'rejected' | 'paid',
    notes?: string
  ) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status,
              adminNotes: notes,
              processedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : w
      )
    );
    addToast({
      type: status === 'paid' ? 'success' : status === 'approved' ? 'info' : 'warning',
      title: 'Withdrawal Status Updated',
      message: `Request ${id} marked as ${status.toUpperCase()}.`,
    });
  };

  const submitReport = (report: Omit<ModerationReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: ModerationReport = {
      ...report,
      id: 'rep_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setModerationReports((prev) => [newReport, ...prev]);
    addToast({
      type: 'success',
      title: 'Report Submitted',
      message: 'Thank you for keeping EITA safe. Our moderators will review this.',
    });
  };

  const adminHandleReport = (reportId: string, status: ModerationReport['status']) => {
    setModerationReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
    addToast({
      type: 'info',
      title: 'Report Updated',
      message: `Report marked as ${status}.`,
    });
  };

  const openUserProfile = (user: UserProfile) => {
    setInspectedUser(user);
  };

  const closeUserProfile = () => {
    setInspectedUser(null);
  };

  // Cleanup mic on unmount
  useEffect(() => {
    const currentAnalyzer = micAnalyzerRef.current;
    return () => {
      currentAnalyzer.stop();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentAccountKey,
        allUsers,
        switchAccount,
        updateCurrentUser,
        rooms,
        activeRoom,
        isRoomMinimized,
        userCurrentSeatIndex,
        isMicMuted,
        userVolume,
        isUserSpeaking,
        handRaiseQueue,
        hasRaisedHand,
        createRoom,
        joinRoom,
        leaveRoom,
        minimizeRoom,
        restoreRoom,
        sitOnSeat,
        leaveSeat,
        toggleMic,
        raiseHand,
        cancelRaiseHand,
        approveHandRaise,
        rejectHandRaise,
        moderatorMuteSeat,
        moderatorLockSeat,
        moderatorKickSeat,
        sendRoomChat,
        roomChatMessages,
        gifts,
        activeGiftAnimation,
        sendGift,
        transactions,
        buyCoins,
        subscribeVip,
        dms,
        activeDmThread,
        openDmWithUser,
        closeActiveDm,
        sendDmMessage,
        sendDmVoiceNote,
        friendRequests,
        sendFriendRequest,
        respondFriendRequest,
        toggleFollowUser,
        followingSet,
        agency,
        registerAgency,
        inviteHostToAgency,
        removeHostFromAgency,
        withdrawals,
        requestWithdrawal,
        dailyMissions,
        claimMission,
        adminBanUser,
        adminGrantCoins,
        adminGrantBeans,
        adminSetRole,
        adminSetVip,
        adminLockRoom,
        adminTerminateRoom,
        adminProcessWithdrawal,
        moderationReports,
        submitReport,
        adminHandleReport,
        platformCommissionRate,
        setPlatformCommissionRate,
        theme,
        toggleTheme,
        currentRoute,
        navigateTo,
        soundEnabled,
        toggleSound,
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatCurrency,
        toasts,
        addToast,
        removeToast,
        inspectedUser,
        openUserProfile,
        closeUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
