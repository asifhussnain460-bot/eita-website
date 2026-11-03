import React, { useState } from 'react';
import {
  Search,
  Plus,
  Radio,
  Users,
  Lock,
  Sparkles,
  Flame,
  Volume2,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoomCategory, VoiceRoom } from '../../types';

interface RoomsFeedViewProps {
  onOpenCreateRoom: () => void;
}

export const RoomsFeedView: React.FC<RoomsFeedViewProps> = ({ onOpenCreateRoom }) => {
  const { rooms, joinRoom, t } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Password prompt state
  const [selectedPrivateRoom, setSelectedPrivateRoom] = useState<VoiceRoom | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>('');

  const categories: string[] = ['All', 'Music', 'Gaming', 'Dating', 'Chill', 'Poetry', 'Chat'];

  const filteredRooms = rooms.filter((room) => {
    const matchesCat = activeCategory === 'All' || room.category === activeCategory;
    const matchesQuery =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleRoomClick = (room: VoiceRoom) => {
    if (room.isPrivate) {
      setSelectedPrivateRoom(room);
      setPasswordInput('');
    } else {
      joinRoom(room.id);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrivateRoom) return;
    const success = joinRoom(selectedPrivateRoom.id, passwordInput.trim());
    if (success) {
      setSelectedPrivateRoom(null);
      setPasswordInput('');
    }
  };

  const handleQuickJoin = () => {
    const publicRooms = rooms.filter((r) => !r.isPrivate);
    if (publicRooms.length > 0) {
      const randomRoom = publicRooms[Math.floor(Math.random() * publicRooms.length)];
      joinRoom(randomRoom.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-24">
      {/* Top Banner & Quick Join Strip */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-pink-900/60 border border-purple-500/30 p-4 sm:p-6 mb-5 shadow-2xl backdrop-blur-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Live Audio Entertainment
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Join 12-Seat Voice Parties 🎙️
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Hang out with hosts, sing karaoke, send animated luxury gifts, or create your own stage.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleQuickJoin}
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('quickJoin')}</span>
            </button>

            <button
              onClick={onOpenCreateRoom}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-xs font-extrabold shadow-lg shadow-purple-900/40 hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createRoom')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchRooms')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121626] border border-purple-900/40 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#121626] border border-white/5 text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="py-16 text-center">
          <Radio className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-50" />
          <h3 className="text-sm font-bold text-white">No active rooms found</h3>
          <p className="text-xs text-slate-400 mt-1">Try another category or create a new stage!</p>
          <button
            onClick={onOpenCreateRoom}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 cursor-pointer"
          >
            Create 12-Seat Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => {
            const occupiedSeatsCount = room.seats.filter((s) => s.user).length;

            return (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="group relative rounded-3xl bg-[#121626] border border-purple-900/30 hover:border-purple-500/50 p-4 transition-all duration-200 cursor-pointer hover:shadow-2xl hover:shadow-purple-950/50 flex flex-col justify-between overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Top line: Category Tag & Listeners */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                      {room.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {room.isPrivate && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px] text-slate-300 font-medium bg-black/40 px-2.5 py-0.5 rounded-full border border-white/5">
                        <Users className="w-3 h-3 text-emerald-400" />
                        {room.listenersCount}
                      </span>
                    </div>
                  </div>

                  {/* Room Title */}
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {room.title}
                  </h3>

                  {/* Host info */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="relative">
                      <img
                        src={room.ownerAvatar}
                        alt={room.ownerName}
                        className="w-7 h-7 rounded-full object-cover border border-purple-400/50"
                      />
                      <span className="absolute -bottom-1 -right-1 text-[8px]">👑</span>
                    </div>
                    <span className="text-xs text-slate-300 font-medium truncate">
                      {room.ownerName}
                    </span>
                  </div>
                </div>

                {/* Bottom: 12-Seat Occupancy Gauge & Tags */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  {/* 12-Seat Visual Mini Circles */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">
                      {occupiedSeatsCount}/12 Mics
                    </span>
                    <div className="flex items-center -space-x-1">
                      {room.seats.slice(0, 4).map((s, idx) => (
                        <div
                          key={idx}
                          className={`w-5 h-5 rounded-full border border-[#121626] flex items-center justify-center overflow-hidden ${
                            s.user ? 'bg-purple-600' : 'bg-slate-800'
                          }`}
                        >
                          {s.user ? (
                            <img
                              src={s.user.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[7px] text-slate-500 font-bold">
                              {idx + 1}
                            </span>
                          )}
                        </div>
                      ))}
                      {room.seats.length > 4 && (
                        <div className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 text-[8px] font-black border border-[#121626] flex items-center justify-center">
                          +8
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1">
                    {room.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PASSWORD PROMPT MODAL (FOR PRIVATE ROOMS) */}
      {selectedPrivateRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121626] border border-amber-500/40 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
              <KeyRound className="w-4 h-4" />
              Private Voice Room
            </div>
            <p className="text-xs text-slate-300 mb-4 font-semibold">
              "{selectedPrivateRoom.title}" requires a passcode to enter.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                autoFocus
                placeholder="Enter room password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPrivateRoom(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
                >
                  Unlock & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
