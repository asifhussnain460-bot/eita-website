import React from 'react';
import { Maximize2, X, Mic, MicOff, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MiniRoomFloatingPlayer: React.FC = () => {
  const {
    activeRoom,
    isRoomMinimized,
    restoreRoom,
    leaveRoom,
    isMicMuted,
    toggleMic,
    userCurrentSeatIndex,
  } = useApp();

  if (!activeRoom || !isRoomMinimized) return null;

  const isSpeaker = userCurrentSeatIndex !== -1 && userCurrentSeatIndex !== null;

  return (
    <div className="fixed bottom-16 sm:bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 bg-[#121626]/95 border border-purple-500/40 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center justify-between gap-3">
        {/* Clickable Area to Restore Room */}
        <div
          onClick={restoreRoom}
          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
        >
          <div className="relative shrink-0">
            <img
              src={activeRoom.ownerAvatar}
              alt={activeRoom.ownerName}
              className="w-10 h-10 rounded-full object-cover border border-purple-500/50"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                {activeRoom.title}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-purple-300">
              <span className="flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-400" />
                Live Audio Party
              </span>
              <span>·</span>
              <span className="text-slate-400">{activeRoom.listenersCount} listeners</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isSpeaker && (
            <button
              onClick={toggleMic}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                isMicMuted
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-600 text-white'
              }`}
              title={isMicMuted ? 'Unmute' : 'Mute'}
            >
              {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={restoreRoom}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Expand Full Room"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={leaveRoom}
            className="w-8 h-8 rounded-full bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 flex items-center justify-center cursor-pointer transition-colors"
            title="Exit Room"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
