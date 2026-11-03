import React, { useState } from 'react';
import {
  Mic,
  Gem,
  Award,
  Clock,
  TrendingUp,
  Building2,
  CheckCircle2,
  ArrowRight,
  Plus,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HOST_TARGET_TIERS } from '../../data/initialData';

interface HostStudioProps {
  onOpenCreateRoom: () => void;
  onOpenWallet: () => void;
}

export const HostStudio: React.FC<HostStudioProps> = ({
  onOpenCreateRoom,
  onOpenWallet,
}) => {
  const { currentUser, updateCurrentUser, agency, formatCurrency, addToast } = useApp();

  const [agencyCodeInput, setAgencyCodeInput] = useState('');

  // Host streaming metrics (simulated live performance)
  const currentHours = 58.5;
  const currentBeans = currentUser.beans;

  const handleJoinAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (agencyCodeInput.trim().toUpperCase() === agency.code) {
      updateCurrentUser({
        agencyId: agency.id,
        agencyName: agency.name,
      });
      addToast({
        type: 'success',
        title: 'Joined Agency!',
        message: `You are now affiliated with ${agency.name}. Target bonuses activated!`,
      });
      setAgencyCodeInput('');
    } else {
      addToast({
        type: 'error',
        title: 'Invalid Code',
        message: 'Agency code not found. Try entering GOLDEN99.',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-5">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 border border-purple-500/30 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
              <Mic className="w-4 h-4 text-amber-400" />
              Creator & Host Broadcaster Studio
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {currentUser.displayName}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Verified Host
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Broadcast high-quality audio sessions, reach monthly bean milestones, and unlock cash bonuses.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenWallet}
              className="h-10 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Gem className="w-3.5 h-3.5" />
              <span>Cash Out Beans</span>
            </button>

            <button
              onClick={onOpenCreateRoom}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-900/40 hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Go Live Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcasting Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Monthly On-Air Time</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {currentHours} <span className="text-sm font-normal text-slate-400">hours</span>
          </div>
          <div className="text-[10px] text-purple-300 mt-1">Goal: 60 hrs (97% achieved)</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <Gem className="w-3.5 h-3.5 text-emerald-400" />
            <span>Beans Collected</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 tabular-nums">
            {currentBeans.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Cash Value: {formatCurrency(currentBeans / 1000)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Peak Room Listeners</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            294 <span className="text-sm font-normal text-slate-400">peak</span>
          </div>
          <div className="text-[10px] text-cyan-300 mt-1">Top 5% across EITA</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Agency Partner</span>
          </div>
          <div className="text-sm font-black text-amber-300 truncate mt-1">
            {currentUser.agencyName || 'Independent Creator'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {currentUser.agencyName ? 'Receiving Agency Bonuses' : 'Join an Agency below'}
          </div>
        </div>
      </div>

      {/* Target Milestone Tiers */}
      <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Monthly Broadcasting Milestone Targets
          </h3>
          <span className="text-xs text-purple-300 font-semibold">
            Cycle ends in 26 days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {HOST_TARGET_TIERS.map((tier, idx) => {
            const beansProgress = Math.min(100, Math.round((currentBeans / tier.requiredBeans) * 100));
            const hoursProgress = Math.min(100, Math.round((currentHours / tier.requiredHours) * 100));
            const isCompleted = beansProgress >= 100 && hoursProgress >= 100;

            return (
              <div
                key={tier.tier}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-white/5 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{tier.badge}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black">
                    +{formatCurrency(tier.rewardBonusUsd)} Bonus
                  </span>
                </div>

                <div className="space-y-2 mt-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                      <span>Beans Target</span>
                      <span className="font-mono">{beansProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${beansProgress}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                      <span>Live Hours Target ({tier.requiredHours}h)</span>
                      <span className="font-mono">{hoursProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${hoursProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">
                    Req: {tier.requiredBeans.toLocaleString()} Beans
                  </span>
                  {isCompleted ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Eligible
                    </span>
                  ) : (
                    <span className="text-amber-300 font-semibold">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Join an Agency Form */}
      {!currentUser.agencyId && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/30 to-purple-950/30 border border-amber-500/30">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            Join an Agency via Code
          </h4>
          <p className="text-xs text-slate-300 mb-3">
            Joining an agency gives you access to official events, agency contests, and higher commission tiers. Enter code <code>GOLDEN99</code> to join Golden Star Media.
          </p>
          <form onSubmit={handleJoinAgency} className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              required
              placeholder="e.g. GOLDEN99"
              value={agencyCodeInput}
              onChange={(e) => setAgencyCodeInput(e.target.value)}
              className="flex-1 bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer transition-colors"
            >
              Affiliate with Agency
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
