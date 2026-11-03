import React, { useState } from 'react';
import { X, Coins, Sparkles, Plus, Users, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VirtualGift } from '../../types';

interface GiftSendModalProps {
  onClose: () => void;
  onOpenWallet: () => void;
  defaultSeatIndex?: number;
}

export const GiftSendModal: React.FC<GiftSendModalProps> = ({
  onClose,
  onOpenWallet,
  defaultSeatIndex = 0,
}) => {
  const { gifts, activeRoom, currentUser, sendGift } = useApp();

  const [activeCategory, setActiveCategory] = useState<'Popular' | 'Luxury' | 'Special' | 'Epic'>('Popular');
  const [selectedGiftId, setSelectedGiftId] = useState<string>(gifts[0]?.id || 'gift_rose');
  const [selectedTarget, setSelectedTarget] = useState<number | 'all'>(defaultSeatIndex);
  const [combo, setCombo] = useState<number>(1);

  if (!activeRoom) return null;

  const categories: ('Popular' | 'Luxury' | 'Special' | 'Epic')[] = ['Popular', 'Luxury', 'Special', 'Epic'];
  const combos = [1, 5, 10, 99, 520];

  const filteredGifts = gifts.filter((g) => g.category === activeCategory);
  const selectedGift = gifts.find((g) => g.id === selectedGiftId) || gifts[0];

  // Number of eligible target recipients
  const activeSpeakers = activeRoom.seats.filter((s) => s.user && s.user.id !== currentUser.id);
  const recipientCount = selectedTarget === 'all' ? Math.max(1, activeSpeakers.length) : 1;
  const totalCost = (selectedGift?.coinPrice || 10) * combo * recipientCount;

  const handleSend = () => {
    const success = sendGift(selectedGiftId, selectedTarget, combo);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111422] border-t border-purple-500/30 rounded-t-3xl shadow-2xl p-4 sm:p-5 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-8 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Virtual Gift Store
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins balance shortcut */}
            <button
              onClick={() => {
                onClose();
                onOpenWallet();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:border-amber-400 cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="tabular-nums font-semibold">
                {currentUser.coins.toLocaleString()}
              </span>
              <Plus className="w-3 h-3 text-amber-400 ml-0.5" />
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Recipient Selector */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 uppercase font-semibold shrink-0">
            Send to:
          </span>

          {/* Send to All Option */}
          <button
            onClick={() => setSelectedTarget('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
              selectedTarget === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-black shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            All Speakers ({activeSpeakers.length})
          </button>

          {/* Individual Speakers */}
          {activeRoom.seats.map((seat) => {
            if (!seat.user) return null;
            const isMe = seat.user.id === currentUser.id;
            if (isMe) return null;

            const isSelected = selectedTarget === seat.index;
            return (
              <button
                key={seat.index}
                onClick={() => setSelectedTarget(seat.index)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <img
                  src={seat.user.avatar}
                  alt={seat.user.displayName}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="truncate max-w-[80px]">
                  #{seat.index + 1} {seat.user.displayName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gift Categories */}
        <div className="flex items-center gap-1.5 py-2 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-purple-950/90 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gifts Grid (Scrollable) */}
        <div className="grid grid-cols-4 gap-2.5 py-3 overflow-y-auto max-h-56">
          {filteredGifts.map((gift) => {
            const isSelected = selectedGiftId === gift.id;
            return (
              <button
                key={gift.id}
                onClick={() => setSelectedGiftId(gift.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-purple-900/30 border-purple-400 shadow-lg shadow-purple-950/60 scale-[1.02]'
                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow-md py-1 animate-in zoom-in-75 duration-150">
                  {gift.icon}
                </span>
                <span className="text-[11px] font-bold text-white truncate max-w-full mt-1">
                  {gift.name}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold mt-0.5">
                  <Coins className="w-2.5 h-2.5" />
                  <span className="tabular-nums">{gift.coinPrice.toLocaleString()}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Combo & Send Action Bar */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          {/* Combo Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto">
            {combos.map((c) => (
              <button
                key={c}
                onClick={() => setCombo(c)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  combo === c
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                x{c}
              </button>
            ))}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={currentUser.coins < totalCost}
            className={`flex-1 h-11 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              currentUser.coins >= totalCost
                ? 'bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white hover:opacity-95 active:scale-95 shadow-purple-900/40'
                : 'bg-white/10 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              Send ({totalCost.toLocaleString()} Coins)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
