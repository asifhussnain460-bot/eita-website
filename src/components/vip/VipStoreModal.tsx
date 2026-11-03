import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Coins, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VIP_PRIVILEGES } from '../../data/initialData';
import { VipTierLevel } from '../../types';

interface VipStoreModalProps {
  onClose: () => void;
  onOpenWallet: () => void;
}

export const VipStoreModal: React.FC<VipStoreModalProps> = ({ onClose, onOpenWallet }) => {
  const { currentUser, subscribeVip, formatCurrency } = useApp();
  const [selectedVip, setSelectedVip] = useState<VipTierLevel>(
    (currentUser.vipLevel > 0 ? currentUser.vipLevel : 3) as VipTierLevel
  );

  const privilege = VIP_PRIVILEGES.find((v) => v.level === selectedVip) || VIP_PRIVILEGES[2];

  const handleActivate = () => {
    const success = subscribeVip(privilege.level);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl bg-[#121626] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              VIP Aristocracy & Privileges
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VIP Level Horizontal Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 mt-1">
          {VIP_PRIVILEGES.map((vip) => {
            const isSelected = selectedVip === vip.level;
            const isCurrent = currentUser.vipLevel === vip.level;

            return (
              <button
                key={vip.level}
                onClick={() => setSelectedVip(vip.level)}
                className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-1 rounded-2xl border transition-all cursor-pointer relative shrink-0 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 scale-105 shadow-md shadow-amber-950/60'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 px-1 rounded-full bg-emerald-500 text-black text-[8px] font-black uppercase">
                    Active
                  </span>
                )}
                <Crown
                  className={`w-5 h-5 mb-1 ${
                    vip.level >= 6
                      ? 'text-rose-400'
                      : vip.level >= 3
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
                <span className="text-xs font-bold text-white">VIP {vip.level}</span>
                <span className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[60px]">
                  {vip.name.split(' ')[2] || 'Pass'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected VIP Frame Preview Hero Box */}
        <div className="relative rounded-3xl overflow-hidden p-6 mt-3 bg-gradient-to-b from-purple-900/40 via-black/40 to-black/60 border border-purple-500/20 text-center">
          <div className="flex flex-col items-center">
            {/* Avatar with selected animated frame */}
            <div className="relative mb-3">
              <div
                className={`w-24 h-24 rounded-full overflow-hidden p-1 ${
                  privilege.level >= 6
                    ? 'vip-gradient-dragon p-1.5'
                    : privilege.level >= 3
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
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black shadow-lg">
                VIP {privilege.level}
              </span>
            </div>

            <h3 className="text-lg font-black text-white mt-1">{privilege.name}</h3>
            <p className="text-xs text-amber-300 font-semibold mt-0.5">
              30-Day Royal Privilege Pass
            </p>
          </div>

          {/* Perks checklist */}
          <div className="mt-5 space-y-2 text-left bg-black/40 p-4 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Exclusive Tier Privileges:
            </div>
            {privilege.perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Price & Action */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
            <div className="text-left">
              <div className="text-xs text-slate-400">Upgrade Investment</div>
              <div className="flex items-center gap-1.5 text-base font-black text-amber-300 tabular-nums">
                <Coins className="w-4 h-4" />
                <span>{privilege.priceCoins.toLocaleString()} Coins</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({formatCurrency(privilege.monthlyUsd)})
                </span>
              </div>
            </div>

            <button
              onClick={handleActivate}
              disabled={currentUser.vipLevel >= privilege.level}
              className={`w-full sm:w-auto px-6 h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                currentUser.vipLevel >= privilege.level
                  ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:opacity-95 text-white active:scale-95 shadow-purple-900/40'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>
                {currentUser.vipLevel >= privilege.level
                  ? 'Privilege Active'
                  : `Activate VIP ${privilege.level}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
