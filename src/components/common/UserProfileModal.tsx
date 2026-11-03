import React, { useState } from 'react';
import {
  X,
  Crown,
  Heart,
  MessageCircle,
  Gift,
  Share2,
  ShieldAlert,
  MapPin,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserProfileModalProps {
  onOpenGiftToUser?: (userSeatIndex?: number) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onOpenGiftToUser }) => {
  const {
    inspectedUser,
    closeUserProfile,
    currentUser,
    followingSet,
    toggleFollowUser,
    openDmWithUser,
    sendFriendRequest,
    submitReport,
    activeRoom,
    addToast,
  } = useApp();

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState<'harassment' | 'spam' | 'inappropriate_audio' | 'fraud' | 'other'>('harassment');
  const [reportDetails, setReportDetails] = useState('');

  if (!inspectedUser) return null;

  const isMe = inspectedUser.id === currentUser.id;
  const isFollowing = followingSet.has(inspectedUser.id);

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      reporterId: currentUser.id,
      reporterName: currentUser.displayName,
      targetId: inspectedUser.id,
      targetName: inspectedUser.displayName,
      targetType: 'user',
      reason: reportReason,
      details: reportDetails || 'Reported from user profile inspection modal.',
    });
    setShowReportDialog(false);
    setReportDetails('');
  };

  const handleInviteToRoom = () => {
    if (!activeRoom) {
      addToast({
        type: 'warning',
        title: 'No Room Active',
        message: 'Join a room before inviting friends.',
      });
      return;
    }
    addToast({
      type: 'success',
      title: 'Invite Sent',
      message: `Invitation to "${activeRoom.title}" sent to ${inspectedUser.displayName}!`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-md bg-[#121626] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
        {/* Header background banner */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-indigo-900/60" />

        {/* Close Button */}
        <button
          onClick={closeUserProfile}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Avatar with VIP Frame */}
        <div className="relative mt-8 flex flex-col items-center text-center">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full overflow-hidden p-[2px] ${
                inspectedUser.vipLevel >= 6
                  ? 'vip-gradient-dragon p-1'
                  : inspectedUser.vipLevel >= 3
                  ? 'vip-gradient-gold p-1'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            >
              <img
                src={inspectedUser.avatar}
                alt={inspectedUser.displayName}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            {inspectedUser.vipLevel > 0 && (
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black shadow-md flex items-center gap-0.5">
                <Crown className="w-3 h-3 text-black" />
                VIP {inspectedUser.vipLevel}
              </span>
            )}
          </div>

          {/* User Details */}
          <div className="mt-3">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {inspectedUser.displayName}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 font-bold">
                Lv.{inspectedUser.level}
              </span>
            </div>
            <p className="text-xs text-purple-300/70 font-mono mt-0.5">
              @{inspectedUser.username} · ID: {inspectedUser.id.replace('user_', '')}
            </p>

            <div className="flex items-center justify-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" />
                {inspectedUser.countryName}
              </span>
              <span>·</span>
              <span className="capitalize">{inspectedUser.role}</span>
              {inspectedUser.agencyName && (
                <>
                  <span>·</span>
                  <span className="text-amber-300">🏢 {inspectedUser.agencyName}</span>
                </>
              )}
            </div>

            {inspectedUser.bio && (
              <p className="text-xs text-slate-300 mt-3 max-w-sm px-4 italic leading-relaxed">
                "{inspectedUser.bio}"
              </p>
            )}
          </div>

          {/* Social Stats Strip */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4 py-2.5 px-3 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="text-sm font-black text-white tabular-nums">
                {inspectedUser.followersCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Followers</div>
            </div>
            <div>
              <div className="text-sm font-black text-white tabular-nums">
                {inspectedUser.followingCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Following</div>
            </div>
            <div>
              <div className="text-sm font-black text-white tabular-nums">
                {inspectedUser.friendsCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Friends</div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          {!isMe && (
            <div className="w-full flex items-center gap-2 mt-4">
              {/* Follow Button */}
              <button
                onClick={() => toggleFollowUser(inspectedUser.id)}
                className={`flex-1 h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-white/10 text-slate-200 border border-white/20 hover:bg-white/15'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/40 hover:opacity-90'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Following
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>

              {/* Direct Message Button */}
              <button
                onClick={() => {
                  openDmWithUser(inspectedUser);
                  closeUserProfile();
                }}
                className="flex-1 h-11 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-900/50 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-purple-400" />
                Chat DM
              </button>

              {/* Add Friend Request */}
              <button
                onClick={() => sendFriendRequest(inspectedUser)}
                title="Add as Friend"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                🤝
              </button>
            </div>
          )}

          {/* Secondary Actions: Send Gift, Invite to Room, Report */}
          <div className="w-full flex items-center justify-around gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-slate-300">
            {activeRoom && (
              <button
                onClick={handleInviteToRoom}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Invite to Room</span>
              </button>
            )}

            {!isMe && onOpenGiftToUser && (
              <button
                onClick={() => {
                  closeUserProfile();
                  onOpenGiftToUser();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 text-amber-300 transition-colors cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Send Gift</span>
              </button>
            )}

            {!isMe && (
              <button
                onClick={() => setShowReportDialog(!showReportDialog)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 text-rose-400 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            )}
          </div>

          {/* Report Dialog Overlay */}
          {showReportDialog && (
            <form
              onSubmit={handleSendReport}
              className="w-full mt-3 p-3 bg-red-950/40 border border-red-500/30 rounded-2xl text-left"
            >
              <h4 className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Report {inspectedUser.displayName}
              </h4>
              <div className="mt-2 flex flex-col gap-2">
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="harassment">Harassment / Toxic Language</option>
                  <option value="spam">Spam / Advertising</option>
                  <option value="inappropriate_audio">Inappropriate Microphone Audio</option>
                  <option value="fraud">Fraud / Impersonation</option>
                  <option value="other">Other Violation</option>
                </select>
                <textarea
                  rows={2}
                  placeholder="Optional details for platform moderation..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 resize-none"
                />
                <div className="flex items-center justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setShowReportDialog(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
