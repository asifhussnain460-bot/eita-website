import React, { useState, useRef, useEffect } from 'react';
import {
  Minimize2,
  LogOut,
  Mic,
  MicOff,
  Hand,
  Gift,
  Dices,
  MoreVertical,
  Volume2,
  Lock,
  Plus,
  Send,
  Crown,
  Users,
  ShieldAlert,
  Flame,
  Swords,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Seat, UserProfile } from '../../types';
import { GiftSendModal } from './GiftSendModal';
import { RoomToolsModal } from './RoomToolsModal';
import { HandRaiseModal } from './HandRaiseModal';

export const VoiceRoomView: React.FC = () => {
  const {
    activeRoom,
    leaveRoom,
    minimizeRoom,
    currentUser,
    userCurrentSeatIndex,
    isMicMuted,
    toggleMic,
    sitOnSeat,
    leaveSeat,
    raiseHand,
    cancelRaiseHand,
    hasRaisedHand,
    handRaiseQueue,
    moderatorMuteSeat,
    moderatorLockSeat,
    moderatorKickSeat,
    sendRoomChat,
    roomChatMessages,
    openUserProfile,
    t,
  } = useApp();

  // Modals state
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [targetGiftSeatIndex, setTargetGiftSeatIndex] = useState<number>(0);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [showHandRaiseModal, setShowHandRaiseModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showSeatActionSheet, setShowSeatActionSheet] = useState(false);

  // Chat message input
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomChatMessages]);

  if (!activeRoom) return null;

  const isOwner = activeRoom.ownerId === currentUser.id;
  const isMod = isOwner || activeRoom.moderatorIds.includes(currentUser.id) || currentUser.role === 'admin';
  const isSpeaker = userCurrentSeatIndex !== -1 && userCurrentSeatIndex !== null;

  const handleSeatClick = (seat: Seat) => {
    if (!seat.user) {
      if (seat.isLocked && !isMod) return;
      // Sit on seat
      sitOnSeat(seat.index);
    } else {
      // Seat is occupied
      setSelectedSeat(seat);
      setShowSeatActionSheet(true);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendRoomChat(chatInput);
    setChatInput('');
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pb-20 sm:pb-6">
      {/* Dynamic Themed Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${activeRoom.wallpaper} opacity-90 -z-10`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-black/80 -z-10" />

      {/* 1. ROOM TOP HEADER */}
      <div className="px-3 pt-2.5 pb-2 border-b border-white/10 flex items-center justify-between gap-2 backdrop-blur-md bg-black/30">
        {/* Left: Minimize & Room Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={minimizeRoom}
            title="Minimize Room"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-extrabold text-white truncate">
                {activeRoom.title}
              </h2>
              {activeRoom.isPrivate && (
                <Lock className="w-3 h-3 text-amber-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <span className="text-purple-300 font-bold">{activeRoom.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Users className="w-2.5 h-2.5" />
                {activeRoom.listenersCount} listeners
              </span>
              <span>·</span>
              <span className="text-amber-300 font-semibold truncate">
                Host: {activeRoom.ownerName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Tools & Exit Room */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowToolsModal(true)}
            title="Room Tools & Games"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <Dices className="w-4 h-4 text-purple-300" />
          </button>

          <button
            onClick={leaveRoom}
            title="Leave Voice Room"
            className="h-8 px-2.5 rounded-full bg-rose-600/30 border border-rose-500/40 hover:bg-rose-600/50 text-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* 2. PK BATTLE BAR (If Active) */}
      {activeRoom.pkBattle && activeRoom.pkBattle.isActive && (
        <div className="px-3 py-1.5 bg-black/50 border-b border-white/5 backdrop-blur-sm">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-[10px] font-black tracking-wider uppercase mb-1">
              <span className="text-rose-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500" />
                Red Team ({activeRoom.pkBattle.redTeamScore.toLocaleString()})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                <Swords className="w-3 h-3 text-amber-400" />
                PK {activeRoom.pkBattle.timeLeft}s
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                Blue Team ({activeRoom.pkBattle.blueTeamScore.toLocaleString()})
                <Flame className="w-3 h-3 text-cyan-500" />
              </span>
            </div>
            {/* Health Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                style={{
                  width: `${
                    (activeRoom.pkBattle.redTeamScore /
                      Math.max(1, activeRoom.pkBattle.redTeamScore + activeRoom.pkBattle.blueTeamScore)) *
                    100
                  }%`,
                }}
              />
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300"
                style={{
                  width: `${
                    (activeRoom.pkBattle.blueTeamScore /
                      Math.max(1, activeRoom.pkBattle.redTeamScore + activeRoom.pkBattle.blueTeamScore)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. CENTER: 12-SEAT SPEAKER STAGE */}
      <div className="flex-1 px-3 py-3 max-w-lg md:max-w-2xl mx-auto w-full flex flex-col justify-start">
        {/* Seat 1 (Host Mic) + Seats 2-12 arranged in ergonomic 4x3 grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 my-auto">
          {activeRoom.seats.map((seat) => {
            const isHostSeat = seat.index === 0;
            const isOccupied = Boolean(seat.user);
            const isCurrentMe = seat.user?.id === currentUser.id;

            return (
              <div
                key={seat.index}
                onClick={() => handleSeatClick(seat)}
                className="flex flex-col items-center justify-center cursor-pointer group select-none"
              >
                {/* Avatar / Empty Seat Container */}
                <div className="relative">
                  {/* Speaking Pulsing Ring */}
                  {seat.isSpeaking && (
                    <div className="absolute inset-0 rounded-full speaking-ring border-2 border-emerald-400 pointer-events-none" />
                  )}

                  {isOccupied && seat.user ? (
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-[2px] transition-transform group-active:scale-95 ${
                        isHostSeat
                          ? 'vip-gradient-gold p-1 shadow-lg shadow-amber-500/30'
                          : seat.user.vipLevel >= 6
                          ? 'vip-gradient-dragon p-1'
                          : seat.user.vipLevel >= 3
                          ? 'vip-gradient-gold p-[2.5px]'
                          : 'bg-gradient-to-tr from-purple-500 to-pink-500'
                      }`}
                    >
                      <img
                        src={seat.user.avatar}
                        alt={seat.user.displayName}
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    /* Empty Seat Button */
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-all group-hover:scale-105 ${
                        seat.isLocked
                          ? 'border-slate-700 bg-black/40 text-slate-600'
                          : 'border-purple-500/40 bg-purple-950/20 text-purple-300 group-hover:border-purple-400 group-hover:bg-purple-900/30'
                      }`}
                    >
                      {seat.isLocked ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Plus className="w-5 h-5 text-purple-300 group-hover:text-white" />
                      )}
                    </div>
                  )}

                  {/* Seat Number Tag */}
                  <span
                    className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow-md ${
                      isHostSeat
                        ? 'bg-amber-400 text-black'
                        : 'bg-purple-950 border border-purple-500/40 text-purple-300'
                    }`}
                  >
                    {isHostSeat ? '👑' : seat.index + 1}
                  </span>

                  {/* Mute indicator or Volume Soundwave */}
                  {isOccupied && (
                    <div className="absolute -bottom-1 -right-1">
                      {seat.isMuted ? (
                        <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] shadow-sm">
                          <MicOff className="w-2.5 h-2.5" />
                        </span>
                      ) : seat.isSpeaking ? (
                        <div className="flex items-center gap-0.5 bg-emerald-500/90 px-1 py-0.5 rounded-full shadow-sm">
                          <div className="w-0.5 bg-white wave-bar-1" />
                          <div className="w-0.5 bg-white wave-bar-2" />
                          <div className="w-0.5 bg-white wave-bar-3" />
                        </div>
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[9px]">
                          <Mic className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Seat Name & Status */}
                <div className="mt-1.5 text-center max-w-[72px]">
                  <p className="text-[11px] font-bold text-white truncate leading-tight">
                    {isOccupied && seat.user
                      ? seat.user.displayName.split(' ')[0]
                      : seat.isLocked
                      ? 'Locked'
                      : `Seat ${seat.index + 1}`}
                  </p>
                  {isOccupied && seat.user && (
                    <span className="text-[9px] text-purple-300/80 font-mono">
                      Lv.{seat.user.level}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. LIVE IN-ROOM CHAT STREAM */}
      <div className="px-3 max-w-lg md:max-w-2xl mx-auto w-full flex-1 max-h-44 sm:max-h-52 overflow-y-auto mb-2 flex flex-col gap-1.5 scroll-smooth">
        {roomChatMessages.map((msg) => {
          if (msg.type === 'entrance') {
            return (
              <div
                key={msg.id}
                className="self-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-500/30 text-[11px] text-amber-200 font-bold backdrop-blur-sm animate-in fade-in"
              >
                {msg.content}
              </div>
            );
          }

          if (msg.type === 'gift' && msg.giftData) {
            return (
              <div
                key={msg.id}
                className="self-start max-w-sm px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-pink-950/80 border border-amber-500/40 text-[11px] text-white shadow-md flex items-center gap-2 backdrop-blur-md"
              >
                <span className="text-xl">{msg.giftData.giftIcon}</span>
                <div className="min-w-0">
                  <span className="font-extrabold text-amber-300">{msg.senderName}</span>
                  <span className="text-slate-300"> sent </span>
                  <span className="font-extrabold text-pink-300">{msg.giftData.giftName}</span>
                  <span className="text-slate-300"> to </span>
                  <span className="font-extrabold text-cyan-300">{msg.giftData.recipientName}</span>
                  {msg.giftData.combo > 1 && (
                    <span className="ml-1 text-amber-400 font-black">
                      x{msg.giftData.combo}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className="self-start max-w-[85%] px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 text-[11px] text-slate-200 flex items-start gap-1.5"
            >
              <span
                onClick={() => {
                  const targetUser = activeRoom.seats.find((s) => s.user?.id === msg.senderId)?.user;
                  if (targetUser) openUserProfile(targetUser);
                }}
                className="font-bold text-purple-300 hover:underline cursor-pointer shrink-0"
              >
                {msg.senderName}:
              </span>
              <span className="break-words text-white">{msg.content}</span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* 5. BOTTOM IN-ROOM ACTION CONTROLS */}
      <div className="px-3 py-2 bg-[#0d101c]/90 border-t border-purple-900/30 backdrop-blur-xl">
        <div className="max-w-lg md:max-w-2xl mx-auto flex items-center justify-between gap-2">
          {/* Chat Form */}
          <form onSubmit={handleSendChat} className="flex-1 flex items-center gap-1.5 min-w-0">
            <input
              type="text"
              placeholder="Send live message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Action Buttons: Mic, Hand, Tools, Gift */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mic Toggle (only enabled if sitting on a seat) */}
            {isSpeaker ? (
              <button
                onClick={toggleMic}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  isMicMuted
                    ? 'bg-rose-600/30 border border-rose-500 text-rose-300 hover:bg-rose-600/40'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 animate-pulse'
                }`}
                title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            ) : (
              /* Hand Raise button for listeners */
              <button
                onClick={hasRaisedHand ? cancelRaiseHand : raiseHand}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  hasRaisedHand
                    ? 'bg-amber-500 text-black font-bold animate-pulse'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={hasRaisedHand ? 'Cancel Speaker Request' : 'Raise Hand to Speak'}
              >
                <Hand className="w-4 h-4" />
              </button>
            )}

            {/* Moderator Hand Queue Manager */}
            {isMod && handRaiseQueue.length > 0 && (
              <button
                onClick={() => setShowHandRaiseModal(true)}
                className="relative w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center cursor-pointer animate-bounce"
                title="Review Waiting Speakers"
              >
                <Hand className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center">
                  {handRaiseQueue.length}
                </span>
              </button>
            )}

            {/* In-Room Entertainment & Tools */}
            <button
              onClick={() => setShowToolsModal(true)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Dice, Ambience & Games"
            >
              <Dices className="w-4 h-4 text-purple-300" />
            </button>

            {/* Send Gift Button */}
            <button
              onClick={() => {
                setTargetGiftSeatIndex(userCurrentSeatIndex === 0 ? 1 : 0);
                setShowGiftModal(true);
              }}
              className="h-10 px-3.5 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/50 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Gift</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. MODALS & DRAWERS */}
      {showGiftModal && (
        <GiftSendModal
          defaultSeatIndex={targetGiftSeatIndex}
          onClose={() => setShowGiftModal(false)}
          onOpenWallet={() => {}}
        />
      )}

      {showToolsModal && (
        <RoomToolsModal onClose={() => setShowToolsModal(false)} />
      )}

      {showHandRaiseModal && (
        <HandRaiseModal onClose={() => setShowHandRaiseModal(false)} />
      )}

      {/* SEAT ACTION SHEET (When clicking an occupied seat) */}
      {showSeatActionSheet && selectedSeat && selectedSeat.user && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#121626] border-t border-purple-500/30 rounded-t-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <img
                src={selectedSeat.user.avatar}
                alt={selectedSeat.user.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {selectedSeat.user.displayName}
                </h4>
                <p className="text-xs text-purple-300">
                  Seat #{selectedSeat.index + 1} · Lv.{selectedSeat.user.level} · VIP {selectedSeat.user.vipLevel}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => {
                  setShowSeatActionSheet(false);
                  openUserProfile(selectedSeat.user!);
                }}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                View Profile
              </button>

              <button
                onClick={() => {
                  setTargetGiftSeatIndex(selectedSeat.index);
                  setShowSeatActionSheet(false);
                  setShowGiftModal(true);
                }}
                className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Send Gift 🎁
              </button>
            </div>

            {/* Moderator controls if mod/owner and not clicking self */}
            {isMod && selectedSeat.user.id !== currentUser.id && (
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    moderatorMuteSeat(selectedSeat.index);
                    setShowSeatActionSheet(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-amber-600/20 text-amber-300 text-xs font-semibold hover:bg-amber-600/30 cursor-pointer"
                >
                  {selectedSeat.isMuted ? 'Unmute Seat' : 'Mute Seat'}
                </button>
                <button
                  onClick={() => {
                    moderatorKickSeat(selectedSeat.index);
                    setShowSeatActionSheet(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600/20 text-rose-300 text-xs font-semibold hover:bg-rose-600/30 cursor-pointer"
                >
                  Kick Speaker
                </button>
              </div>
            )}

            {/* Leave seat option if clicking own seat */}
            {selectedSeat.user.id === currentUser.id && (
              <button
                onClick={() => {
                  leaveSeat();
                  setShowSeatActionSheet(false);
                }}
                className="w-full mt-3 py-2.5 rounded-xl bg-rose-600/30 text-rose-200 text-xs font-bold hover:bg-rose-600/40 cursor-pointer"
              >
                Step Down from Microphone
              </button>
            )}

            <button
              onClick={() => setShowSeatActionSheet(false)}
              className="w-full mt-2 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
