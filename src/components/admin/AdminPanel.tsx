import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Radio,
  DollarSign,
  AlertTriangle,
  Settings,
  CheckCircle2,
  XCircle,
  Ban,
  Unlock,
  Coins,
  Crown,
  Search,
  Check,
  Percent
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, VipTierLevel } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    allUsers,
    rooms,
    withdrawals,
    moderationReports,
    adminBanUser,
    adminGrantCoins,
    adminGrantBeans,
    adminSetRole,
    adminSetVip,
    adminLockRoom,
    adminTerminateRoom,
    adminProcessWithdrawal,
    adminHandleReport,
    platformCommissionRate,
    setPlatformCommissionRate,
    formatCurrency,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'rooms' | 'withdrawals' | 'reports' | 'economics'>('withdrawals');
  const [searchUser, setSearchUser] = useState('');

  // Selected user for quick balance/role adjustment modal
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<any | null>(null);
  const [coinsAdjustment, setCoinsAdjustment] = useState<number>(5000);
  const [beansAdjustment, setBeansAdjustment] = useState<number>(20000);

  const filteredUsers = allUsers.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const pendingReports = moderationReports.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-6">
      {/* Admin Header */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-purple-950 border border-red-500/40 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              EITA Executive Platform Administration
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Global Operations & Compliance Console
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Monitor broadcaster voice rooms, approve creator withdrawals, moderate bad actors, and tune platform economics.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="text-xs text-slate-400 font-semibold mb-1">Total Registered Users</div>
          <div className="text-2xl font-black text-white tabular-nums">
            {allUsers.length + 18400}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">+342 new today</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="text-xs text-slate-400 font-semibold mb-1">Active 12-Seat Rooms</div>
          <div className="text-2xl font-black text-white tabular-nums">{rooms.length}</div>
          <div className="text-[10px] text-purple-400 mt-1">
            {rooms.reduce((acc, r) => acc + r.listenersCount, 0)} live listeners
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="text-xs text-slate-400 font-semibold mb-1">Pending Cashouts</div>
          <div className="text-2xl font-black text-amber-300 tabular-nums">
            {pendingWithdrawals.length}
          </div>
          <div className="text-[10px] text-amber-200/70 mt-1">
            Total: {formatCurrency(pendingWithdrawals.reduce((acc, w) => acc + w.usdAmount, 0))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="text-xs text-slate-400 font-semibold mb-1">Pending Reports</div>
          <div className="text-2xl font-black text-rose-400 tabular-nums">
            {pendingReports.length}
          </div>
          <div className="text-[10px] text-rose-300 mt-1">Requires moderation audit</div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#121626] rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 relative ${
            activeTab === 'withdrawals'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💰 Cashout Approvals
          {pendingWithdrawals.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-black">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👥 User Directory & Bans
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'rooms'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🎙️ Live Room Control
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 relative ${
            activeTab === 'reports'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🛡️ Reports & Safety
          {pendingReports.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('economics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'economics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚙️ Platform Fees & Economics
        </button>
      </div>

      {/* TAB 1: WITHDRAWALS APPROVAL */}
      {activeTab === 'withdrawals' && (
        <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 overflow-hidden">
          <h3 className="text-sm font-bold text-white mb-3">
            Creator & Agency Payout Requests
          </h3>

          {withdrawals.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No withdrawal requests recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 uppercase text-[10px] font-semibold">
                    <th className="py-2.5 px-3">Beneficiary</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Beans Amount</th>
                    <th className="py-2.5 px-3">Payout USD</th>
                    <th className="py-2.5 px-3">Method & Details</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{w.userName}</td>
                      <td className="py-3 px-3 capitalize text-purple-300">{w.userRole}</td>
                      <td className="py-3 px-3 tabular-nums font-mono text-emerald-400">
                        {w.beansAmount.toLocaleString()} Beans
                      </td>
                      <td className="py-3 px-3 tabular-nums font-black text-white">
                        {formatCurrency(w.usdAmount)}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        <span className="uppercase font-bold text-[10px] text-amber-300 block">
                          {w.paymentMethod.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {w.accountDetails.accountNumberOrEmail}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            w.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : w.status === 'approved'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : w.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {w.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => adminProcessWithdrawal(w.id, 'paid', 'Verified wire transfer')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Pay Now
                            </button>
                            <button
                              onClick={() => adminProcessWithdrawal(w.id, 'rejected', 'Invalid credentials')}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER DIRECTORY & BANS */}
      {activeTab === 'users' && (
        <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white">Registered Users & Creators</h3>
            <div className="relative max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full bg-[#0d101c] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">VIP</th>
                  <th className="py-2.5 px-3">Coins</th>
                  <th className="py-2.5 px-3">Beans</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-white">{u.displayName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => adminSetRole(u.id, e.target.value as UserRole)}
                        className="bg-[#0d101c] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-purple-300 font-bold"
                      >
                        <option value="user">User</option>
                        <option value="host">Host</option>
                        <option value="agency">Agency</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.vipLevel}
                        onChange={(e) => adminSetVip(u.id, Number(e.target.value) as VipTierLevel)}
                        className="bg-[#0d101c] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-amber-300 font-bold"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            VIP {lvl}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3 tabular-nums font-mono text-amber-300 font-bold">
                      {u.coins.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-mono text-emerald-400 font-bold">
                      {u.beans.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isBanned
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {u.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => adminGrantCoins(u.id, 10000)}
                          className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold cursor-pointer"
                        >
                          +10k Coins
                        </button>
                        <button
                          onClick={() => adminBanUser(u.id, !u.isBanned)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            u.isBanned
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'bg-rose-600/30 text-rose-300 hover:bg-rose-600/50'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban User'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ROOM CONTROL */}
      {activeTab === 'rooms' && (
        <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Live Voice Party Rooms ({rooms.length})</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-300">{room.category}</span>
                    <span className="text-xs text-slate-400">
                      {room.listenersCount} listeners online
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{room.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Host: {room.ownerName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => adminLockRoom(room.id, !room.isPrivate)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-amber-300 cursor-pointer"
                  >
                    {room.isPrivate ? 'Unlock Room' : 'Lock Room'}
                  </button>
                  <button
                    onClick={() => adminTerminateRoom(room.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-xs font-bold text-rose-300 cursor-pointer"
                  >
                    Terminate Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS & SAFETY */}
      {activeTab === 'reports' && (
        <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">User Moderation Reports</h3>

          {moderationReports.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Zero pending reports! Community is clean.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {moderationReports.map((rep) => (
                <div key={rep.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                        {rep.reason.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-white">
                        Target: {rep.targetName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">"{rep.details}"</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Reported by {rep.reporterName} on {rep.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => adminHandleReport(rep.id, 'action_taken')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Ban Offender
                    </button>
                    <button
                      onClick={() => adminHandleReport(rep.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PLATFORM ECONOMICS */}
      {activeTab === 'economics' && (
        <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-5 space-y-5 max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-purple-400" />
            Platform Fee Revenue Distribution
          </h3>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1">
                <span>EITA Platform Cut:</span>
                <span className="text-purple-400 font-mono">
                  {(platformCommissionRate * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.5}
                step={0.05}
                value={platformCommissionRate}
                onChange={(e) => setPlatformCommissionRate(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400 block">Host Payout Share:</span>
                <span className="text-base font-black text-emerald-400">
                  {((1 - platformCommissionRate - 0.15) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400 block">Agency Commission Share:</span>
                <span className="text-base font-black text-cyan-400">15%</span>
              </div>
            </div>

            <button
              onClick={() =>
                addToast({
                  type: 'success',
                  title: 'Economics Updated',
                  message: 'Platform commission rates saved and synced across transactions.',
                })
              }
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
            >
              Save Platform Economics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
