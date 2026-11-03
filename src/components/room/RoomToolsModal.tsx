import React, { useState } from 'react';
import {
  X,
  Dices,
  Volume2,
  Share2,
  Copy,
  Sparkles,
  Check,
  RotateCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface RoomToolsModalProps {
  onClose: () => void;
}

export const RoomToolsModal: React.FC<RoomToolsModalProps> = ({ onClose }) => {
  const { activeRoom, sendRoomChat, addToast, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'dice' | 'soundboard' | 'wheel' | 'share'>('dice');

  // Dice state
  const [diceNumber, setDiceNumber] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Wheel state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  // Share state
  const [copied, setCopied] = useState<boolean>(false);

  if (!activeRoom) return null;

  const roomLink = `https://eita.app/room/${activeRoom.id}`;

  const handleRollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    sounds.playDiceRoll();

    let counter = 0;
    const interval = setInterval(() => {
      setDiceNumber(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        const finalNumber = Math.floor(Math.random() * 6) + 1;
        setDiceNumber(finalNumber);
        setIsRolling(false);
        sendRoomChat(`🎲 rolled a ${finalNumber} on the lucky dice!`);
      }
    }, 80);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);
    sounds.playDiceRoll();

    const randomDeg = 1440 + Math.floor(Math.random() * 360);
    setWheelRotation((prev) => prev + randomDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const prizes = ['50 Coins 🪙', 'Rose Gift 🌹', 'VIP 1 Badge 👑', '100 Beans 💎', '10 Coins 🪙', 'Airhorn Party 📢'];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setWheelResult(prize);
      sounds.playCoin();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
      sendRoomChat(`🎡 won [${prize}] on the Lucky Party Wheel!`);
    }, 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(roomLink).catch(() => {});
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Room invite link copied to clipboard!',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-[#121626] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Room Tools & Entertainment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 rounded-2xl mt-4">
          <button
            onClick={() => setActiveTab('dice')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dice'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎲 Dice
          </button>
          <button
            onClick={() => setActiveTab('soundboard')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'soundboard'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📢 Sounds
          </button>
          <button
            onClick={() => setActiveTab('wheel')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wheel'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎡 Wheel
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'share'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔗 Share
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-5">
          {/* TAB 1: DICE */}
          {activeTab === 'dice' && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div
                className={`w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 p-[3px] shadow-2xl shadow-purple-900/50 transition-transform ${
                  isRolling ? 'rotate-180 scale-95' : 'hover:scale-105'
                }`}
              >
                <div className="w-full h-full bg-[#0d101c] rounded-[22px] flex items-center justify-center">
                  <span className="text-5xl font-black text-amber-300 tabular-nums">
                    {diceNumber}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 max-w-xs">
                Roll the dice for truth or dare, drinking games, or lucky speaker picks!
              </p>

              <button
                onClick={handleRollDice}
                disabled={isRolling}
                className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-900/40 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                {isRolling ? 'Rolling...' : '🎲 Roll Dice Now'}
              </button>
            </div>
          )}

          {/* TAB 2: SOUNDBOARD */}
          {activeTab === 'soundboard' && (
            <div className="space-y-4 py-2">
              <p className="text-xs text-slate-400">
                Play ambience and party sound effects into the live room audio:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    sounds.playApplause();
                    sendRoomChat('👏 triggered room applause sound effect');
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/40 text-left transition-all cursor-pointer group hover:bg-white/10"
                >
                  <div className="text-2xl">👏</div>
                  <div className="text-xs font-bold text-white mt-1 group-hover:text-purple-300">
                    Applause & Cheer
                  </div>
                  <div className="text-[10px] text-slate-400">Warm crowd clapping</div>
                </button>

                <button
                  onClick={() => {
                    sounds.playAirhorn();
                    sendRoomChat('📢 blasted the party DJ airhorn!');
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/40 text-left transition-all cursor-pointer group hover:bg-white/10"
                >
                  <div className="text-2xl">📢</div>
                  <div className="text-xs font-bold text-white mt-1 group-hover:text-purple-300">
                    DJ Airhorn
                  </div>
                  <div className="text-[10px] text-slate-400">Hype triple airhorn</div>
                </button>

                <button
                  onClick={() => {
                    sounds.playVipFanfare();
                    sendRoomChat('🎺 played imperial VIP fanfare');
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/40 text-left transition-all cursor-pointer group hover:bg-white/10"
                >
                  <div className="text-2xl">🎺</div>
                  <div className="text-xs font-bold text-white mt-1 group-hover:text-purple-300">
                    Royal Fanfare
                  </div>
                  <div className="text-[10px] text-slate-400">Brass triumph tune</div>
                </button>

                <button
                  onClick={() => {
                    sounds.playCoin();
                    sendRoomChat('🪙 played lucky gold coin ding');
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/40 text-left transition-all cursor-pointer group hover:bg-white/10"
                >
                  <div className="text-2xl">🪙</div>
                  <div className="text-xs font-bold text-white mt-1 group-hover:text-purple-300">
                    Coin Chime
                  </div>
                  <div className="text-[10px] text-slate-400">Crystal money clink</div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LUCKY WHEEL */}
          {activeTab === 'wheel' && (
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <div className="relative w-44 h-44 flex items-center justify-center my-2">
                <div
                  className="w-full h-full rounded-full border-4 border-amber-400 bg-gradient-to-tr from-purple-700 via-pink-600 to-indigo-800 shadow-xl transition-transform duration-3000 ease-out flex items-center justify-center"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  <div className="text-xs font-black text-white grid grid-cols-2 gap-4">
                    <span>🪙 50</span>
                    <span>🌹 Rose</span>
                    <span>💎 100</span>
                    <span>👑 VIP</span>
                  </div>
                </div>
                {/* Pointer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-amber-400 z-10 filter drop-shadow-md" />
              </div>

              {wheelResult && (
                <div className="mt-2 text-xs font-black text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full animate-bounce">
                  Prize: {wheelResult}
                </div>
              )}

              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-black font-extrabold text-xs shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                {isSpinning ? 'Spinning...' : '🎡 Spin Party Wheel'}
              </button>
            </div>
          )}

          {/* TAB 4: SHARE ROOM */}
          {activeTab === 'share' && (
            <div className="py-2 space-y-4">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-xs font-bold text-white mb-1">
                  {activeRoom.title}
                </div>
                <div className="text-[11px] text-slate-400">
                  Host: {activeRoom.ownerName} · {activeRoom.listenersCount} listeners online
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                  Room Invitation Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={roomLink}
                    className="flex-1 bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-around gap-2 pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=Join my voice party on EITA: ${roomLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center hover:bg-emerald-600/30 transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${roomLink}&text=Join voice party on EITA!`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold text-center hover:bg-cyan-600/30 transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
