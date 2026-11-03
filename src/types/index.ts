export type UserRole = 'user' | 'host' | 'agency' | 'admin';

export type VipTierLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  email?: string;
  bio: string;
  country: string; // ISO code e.g. 'US', 'SA', 'AE', 'TR', 'ID', 'FR'
  countryName: string;
  gender: 'male' | 'female' | 'other';
  level: number;
  exp: number;
  vipLevel: VipTierLevel;
  role: UserRole;
  coins: number;
  beans: number;
  likesCount?: number;
  agencyId?: string;
  agencyName?: string;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  isOnline: boolean;
  isMuted: boolean;
  isBanned: boolean;
  joinedAt: string;
  privacy: {
    allowDms: 'everyone' | 'friends';
    showOnline: boolean;
    incognitoRoom: boolean;
  };
}

export interface Seat {
  index: number; // 0 is Host (Seat 1), 1-11 are Guests (Seats 2-12)
  user: UserProfile | null;
  isMuted: boolean;
  isLocked: boolean;
  isSpeaking: boolean;
  volume: number; // 0 - 100
}

export type RoomCategory = 'Music' | 'Gaming' | 'Dating' | 'Chill' | 'Poetry' | 'Chat';

export interface VoiceRoom {
  id: string;
  title: string;
  description: string;
  category: RoomCategory;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerVip: VipTierLevel;
  wallpaper: string;
  isPrivate: boolean;
  password?: string;
  seats: Seat[];
  listenersCount: number;
  tags: string[];
  totalGiftsReceived: number;
  pkBattle?: {
    isActive: boolean;
    redTeamScore: number;
    blueTeamScore: number;
    timeLeft: number; // seconds
  };
  moderatorIds: string[];
  createdAt: string;
}

export interface VirtualGift {
  id: string;
  name: string;
  coinPrice: number;
  icon: string;
  category: 'Popular' | 'Luxury' | 'Special' | 'Epic';
  animationType: 'flying_car' | 'golden_dragon' | 'rocket' | 'crown' | 'rose_burst' | 'castle';
  description: string;
  bannerColor: string;
}

export interface ChatMessage {
  id: string;
  roomId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderVip: VipTierLevel;
  content: string;
  type: 'text' | 'gift' | 'system' | 'entrance' | 'voice';
  giftData?: {
    giftName: string;
    giftIcon: string;
    giftPrice: number;
    recipientName: string;
    combo: number;
  };
  voiceData?: {
    audioUrl: string;
    duration: number; // in seconds
  };
  timestamp: string;
}

export interface DirectMessageThread {
  id: string;
  participant: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface FriendRequest {
  id: string;
  fromUser: UserProfile;
  toUserId: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'purchase_coins' | 'send_gift' | 'receive_beans' | 'withdraw_cash' | 'vip_subscribe' | 'mission_reward';
  amount: number; // coins or beans or USD
  currency: 'COINS' | 'BEANS' | 'USD';
  description: string;
  status: 'completed' | 'pending' | 'rejected';
  createdAt: string;
  referenceId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: 'host' | 'agency';
  beansAmount: number;
  usdAmount: number;
  paymentMethod: 'bank_transfer' | 'paypal' | 'usdt_crypto' | 'wise';
  accountDetails: {
    accountName: string;
    accountNumberOrEmail: string;
    bankOrNetwork?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  adminNotes?: string;
  createdAt: string;
  processedAt?: string;
}

export interface Agency {
  id: string;
  code: string;
  name: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  region: string;
  verified: boolean;
  commissionRate: number; // e.g. 0.15 (15%)
  totalHosts: number;
  monthlyBeans: number;
  monthlyEarningsUsd: number;
  hosts: {
    hostId: string;
    username: string;
    displayName: string;
    avatar: string;
    streamHoursThisMonth: number;
    beansCollectedThisMonth: number;
    targetProgressPercent: number;
    joinedDate: string;
  }[];
  createdAt: string;
}

export interface HostTargetTier {
  tier: string;
  requiredBeans: number;
  requiredHours: number;
  rewardBonusUsd: number;
  badge: string;
}

export interface VipPrivilege {
  level: VipTierLevel;
  name: string;
  priceCoins: number;
  monthlyUsd: number;
  badgeColor: string;
  frameGradient: string;
  perks: string[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  score: number; // beans or coins
  vipLevel: VipTierLevel;
  tag?: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetName: string;
  targetType: 'user' | 'room';
  reason: 'harassment' | 'spam' | 'inappropriate_audio' | 'fraud' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  createdAt: string;
}

export type SupportedLanguage = 'en' | 'ar' | 'es' | 'fr' | 'tr' | 'id';
export type SupportedCurrency = 'USD' | 'EUR' | 'SAR' | 'AED' | 'IDR' | 'GBP';
