import React from 'react';
import { X, Hand, Check, Ban, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HandRaiseModalProps {
  onClose: () => void;
}

export const HandRaiseModal: React.FC<HandRaiseModalProps> = ({ onClose }) => {
  const { handRaiseQueue, approveHandRaise, rejectHandRaise, activeRoom } = useApp();

  if (!activeRoom) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-[#121626] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Speaker Queue ({handRaiseQueue.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {handRaiseQueue.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <Hand className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            No listeners currently raising their hand.
          </div>
        ) : (
          <div className="divide-y divide-white/5 mt-2">
            {handRaiseQueue.map((user) => (
              <div key={user.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {user.vipLevel > 0 && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[9px] font-black">
                        {user.vipLevel}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                      {user.displayName}
                      <span className="text-[10px] text-purple-400">Lv.{user.level}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      @{user.username} · {user.countryName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      approveHandRaise(user);
                      if (handRaiseQueue.length <= 1) onClose();
                    }}
                    className="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => rejectHandRaise(user.id)}
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
