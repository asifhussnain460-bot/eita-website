import React, { useState } from 'react';
import {
  User,
  Crown,
  Coins,
  Gem,
  Settings,
  Shield,
  Volume2,
  Globe,
  DollarSign,
  Edit3,
  Check,
  LogOut,
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage, SupportedCurrency } from '../../types';

interface ProfileViewProps {
  onOpenWallet: () => void;
  onOpenVipStore: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenWallet,
  onOpenVipStore,
}) => {
  const {
    currentUser,
    updateCurrentUser,
    switchAccount,
    currentAccountKey,
    soundEnabled,
    toggleSound,
    language,
    setLanguage,
    currency,
    setCurrency,
    formatCurrency,
    addToast,
    t,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      displayName: displayName.trim() || currentUser.displayName,
      bio: bio.trim(),
    });
    setIsEditing(false);
    addToast({
      type: 'success',
      title: 'Profile Saved',
      message: 'Your profile information has been updated.',
    });
  };

  const handleToggleOnlinePrivacy = () => {
    const next = !currentUser.privacy.showOnline;
    updateCurrentUser({
      privacy: { ...currentUser.privacy, showOnline: next },
      isOnline: next,
    });
    addToast({
      type: 'info',
      title: 'Privacy Updated',
      message: next ? 'You are now visible as online' : 'You are now appearing offline',
    });
  };

  const handleToggleIncognito = () => {
    const next = !currentUser.privacy.incognitoRoom;
    updateCurrentUser({
      privacy: { ...currentUser.privacy, incognitoRoom: next },
    });
    addToast({
      type: 'info',
      title: 'Incognito Mode',
      message: next ? 'Stealth room entry activated' : 'Standard room entrance active',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-5">
      {/* Profile Card Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#121626] to-pink-950 border border-purple-500/30 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar with VIP Frame */}
          <div className="relative shrink-0">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-[2.5px] ${
                currentUser.vipLevel >= 6
                  ? 'vip-gradient-dragon p-1.5'
                  : currentUser.vipLevel >= 3
                  ? 'vip-gradient-gold p-1'
                  : 'bg-gradient-to-tr from-purple-500 to-pink-500'
              }`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {currentUser.vipLevel > 0 && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black shadow-md flex items-center gap-1">
                <Crown className="w-3 h-3 text-black" />
                VIP {currentUser.vipLevel}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-2">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-[#0d101c] border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold w-full max-w-xs"
                />
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-[#0d101c] border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white w-full max-w-sm resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                    {currentUser.displayName}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold self-center sm:self-auto">
                    Level {currentUser.level}
                  </span>
                </div>

                <p className="text-xs text-purple-300/80 font-mono mt-0.5">
                  @{currentUser.username} · ID: {currentUser.id.replace('user_', '')} ·{' '}
                  {currentUser.countryName}
                </p>

                {currentUser.bio && (
                  <p className="text-xs text-slate-300 mt-2 max-w-md italic">
                    "{currentUser.bio}"
                  </p>
                )}
              </div>
            )}

            {/* Social Counts */}
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-4 pt-3 border-t border-white/5">
              <div>
                <span className="text-sm font-black text-white mr-1.5">
                  {currentUser.followersCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400">Followers</span>
              </div>
              <div>
                <span className="text-sm font-black text-white mr-1.5">
                  {currentUser.followingCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400">Following</span>
              </div>
              <div>
                <span className="text-sm font-black text-white mr-1.5">
                  {currentUser.friendsCount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400">Friends</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Coins Card */}
        <div
          onClick={onOpenWallet}
          className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/40 to-[#121626] border border-amber-500/30 hover:border-amber-400/50 transition-all cursor-pointer shadow-lg flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Coins Balance</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {currentUser.coins.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-200/80 mt-1 block">
              Tap to Buy Coins & Packages
            </span>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors">
            Top Up
          </button>
        </div>

        {/* Beans Earnings Card */}
        <div
          onClick={onOpenWallet}
          className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-[#121626] border border-emerald-500/30 hover:border-emerald-400/50 transition-all cursor-pointer shadow-lg flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold mb-1">
              <Gem className="w-4 h-4 text-emerald-400" />
              <span>Beans Earnings</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {currentUser.beans.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-200/80 mt-1 block">
              Cash Value: {formatCurrency(currentUser.beans / 1000)}
            </span>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors">
            Cash Out
          </button>
        </div>
      </div>

      {/* VIP Upgrade Banner */}
      <div
        onClick={onOpenVipStore}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-900/60 via-pink-900/50 to-amber-900/40 border border-purple-500/40 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-400 transition-all shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              VIP Aristocracy Store
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-black uppercase">
                Tier 1-8
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Unlock animated avatar frames, room entrance chimes, and kick immunity.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-black text-xs font-black shrink-0 hover:opacity-95">
          Explore VIP
        </button>
      </div>

      {/* Privacy & Account Settings */}
      <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          Security, Privacy & Preferences
        </h3>

        <div className="space-y-3 divide-y divide-white/5">
          {/* Show Online Status */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-bold text-white">Show Online Status</div>
              <div className="text-[11px] text-slate-400">
                Allow friends to see when you are active on EITA
              </div>
            </div>
            <button
              onClick={handleToggleOnlinePrivacy}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                currentUser.privacy.showOnline ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentUser.privacy.showOnline ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Incognito Room Mode (VIP perk) */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Stealth / Incognito Room Presence
                <Crown className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-[11px] text-slate-400">
                Join rooms without broadcasting entrance announcements
              </div>
            </div>
            <button
              onClick={handleToggleIncognito}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                currentUser.privacy.incognitoRoom ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentUser.privacy.incognitoRoom ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Synthesizer Audio */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-white">Audio Sound Effects</div>
              <div className="text-[11px] text-slate-400">
                Play Web Audio chimes for gifts, dice, and coins
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEnabled ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  soundEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Currency Display */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-white">Preferred Currency</div>
              <div className="text-[11px] text-slate-400">
                Display coin values and cashouts in your local currency
              </div>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              className="bg-[#0d101c] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="SAR">SAR (﷼)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="IDR">IDR (Rp)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
