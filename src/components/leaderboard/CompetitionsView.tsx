import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Award,
  Sparkles,
  Coins,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  INITIAL_LEADERBOARD_HOSTS,
  INITIAL_LEADERBOARD_GIFTERS,
  INITIAL_LEADERBOARD_AGENCIES,
} from '../../data/initialData';
import { LeaderboardEntry } from '../../types';

export const CompetitionsView: React.FC = () => {
  const { dailyMissions, claimMission, openUserProfile, allUsers } = useApp();

  const [activeTab, setActiveTab] = useState<'hosts' | 'gifters' | 'agencies'>('hosts');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const currentList: LeaderboardEntry[] =
    activeTab === 'hosts'
      ? INITIAL_LEADERBOARD_HOSTS
      : activeTab === 'gifters'
      ? INITIAL_LEADERBOARD_GIFTERS
      : INITIAL_LEADERBOARD_AGENCIES;

  const top1 = currentList[0];
  const top2 = currentList[1];
  const top3 = currentList[2];
  const rest = currentList.slice(3);

  const handleEntryClick = (id: string) => {
    const user = allUsers.find((u) => u.id === id);
    if (user) openUserProfile(user);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Hall of Fame & Competitions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time rankings of top broadcasters, high-rolling gifters, and partner agencies.
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center gap-1 bg-[#121626] p-1 rounded-2xl border border-white/5 self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Category selector */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-[#121626] rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveTab('hosts')}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'hosts'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🌟 Top Hosts
        </button>
        <button
          onClick={() => setActiveTab('gifters')}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gifters'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👑 Rich List (Gifters)
        </button>
        <button
          onClick={() => setActiveTab('agencies')}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'agencies'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🏢 Agency League
        </button>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="rounded-3xl bg-gradient-to-b from-purple-950/40 to-[#121626] border border-purple-500/20 p-5 sm:p-6 shadow-2xl">
        <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end justify-center max-w-lg mx-auto pt-6 pb-2 text-center">
          {/* #2 Silver */}
          {top2 && (
            <div
              onClick={() => handleEntryClick(top2.id)}
              className="flex flex-col items-center cursor-pointer group order-1"
            >
              <div className="relative mb-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 shadow-lg shadow-slate-500/20 group-hover:scale-105 transition-transform">
                  <img
                    src={top2.avatar}
                    alt={top2.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-400 text-black text-[10px] font-black shadow-md">
                  #2
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate max-w-[90px]">
                {top2.name.split(' ')[0]}
              </h4>
              <div className="text-[10px] font-black text-amber-300 tabular-nums mt-0.5">
                {top2.score.toLocaleString()} pts
              </div>
              {/* Podium Bar */}
              <div className="w-full h-16 sm:h-20 bg-slate-800/80 rounded-t-2xl mt-2 flex items-center justify-center border-t-2 border-slate-400">
                <span className="text-2xl font-black text-slate-500">2</span>
              </div>
            </div>
          )}

          {/* #1 Champion Gold */}
          {top1 && (
            <div
              onClick={() => handleEntryClick(top1.id)}
              className="flex flex-col items-center cursor-pointer group order-2 -mt-4"
            >
              <Crown className="w-7 h-7 text-amber-400 mb-1 animate-bounce" />
              <div className="relative mb-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 vip-gradient-gold shadow-xl shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <img
                    src={top1.avatar}
                    alt={top1.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black shadow-md">
                  #1
                </span>
              </div>
              <h4 className="text-sm font-black text-amber-300 truncate max-w-[110px]">
                {top1.name.split(' ')[0]}
              </h4>
              <div className="text-xs font-black text-amber-300 tabular-nums mt-0.5">
                {top1.score.toLocaleString()} pts
              </div>
              {/* Podium Bar */}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-b from-amber-950/60 to-purple-950/80 rounded-t-2xl mt-2 flex items-center justify-center border-t-2 border-amber-400 shadow-lg">
                <span className="text-3xl font-black text-amber-400">1</span>
              </div>
            </div>
          )}

          {/* #3 Bronze */}
          {top3 && (
            <div
              onClick={() => handleEntryClick(top3.id)}
              className="flex flex-col items-center cursor-pointer group order-3"
            >
              <div className="relative mb-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-b from-amber-600 via-amber-700 to-yellow-900 shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src={top3.avatar}
                    alt={top3.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-black shadow-md">
                  #3
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate max-w-[90px]">
                {top3.name.split(' ')[0]}
              </h4>
              <div className="text-[10px] font-black text-amber-300 tabular-nums mt-0.5">
                {top3.score.toLocaleString()} pts
              </div>
              {/* Podium Bar */}
              <div className="w-full h-12 sm:h-14 bg-slate-900/80 rounded-t-2xl mt-2 flex items-center justify-center border-t-2 border-amber-700">
                <span className="text-xl font-black text-amber-700">3</span>
              </div>
            </div>
          )}
        </div>

        {/* Rest of Ranking Table */}
        {rest.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 divide-y divide-white/5">
            {rest.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleEntryClick(entry.id)}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center text-xs font-black text-slate-400 font-mono">
                    #{entry.rank}
                  </span>
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{entry.name}</div>
                    {entry.tag && (
                      <span className="text-[10px] text-purple-300 font-semibold">
                        {entry.tag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-300 tabular-nums">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">points</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DAILY MISSIONS & QUEST CENTER */}
      <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Daily Missions & Quests
            </h3>
          </div>
          <span className="text-xs text-purple-300 font-semibold">
            Resets in 14h 22m
          </span>
        </div>

        <div className="space-y-2.5">
          {dailyMissions.map((mission) => {
            const isDone = mission.completed;
            const isClaimed = mission.claimed;

            return (
              <div
                key={mission.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">
                      {mission.title}
                    </h4>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Coins className="w-3 h-3" />
                      +{mission.rewardCoins}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {mission.description}
                  </p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (mission.progress / mission.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {mission.progress}/{mission.maxProgress}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  {isClaimed ? (
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-500 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={() => claimMission(mission.id)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-black text-xs font-extrabold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-400 text-xs font-medium">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
