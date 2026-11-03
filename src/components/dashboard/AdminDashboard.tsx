import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Ban,
  Coins,
  Gem,
  Download,
  Filter,
  ArrowUpRight,
  Sparkles,
  Mail,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getChartThemeOptions } from '../../utils/chartConfig';
import { DashboardSidebarTab } from './DashFlatLayout';
import { UserRole, VipTierLevel } from '../../types';

interface AdminDashboardProps {
  activeTab: DashboardSidebarTab;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const {
    currentUser,
    allUsers,
    withdrawals,
    rooms,
    theme,
    formatCurrency,
    adminBanUser,
    adminGrantCoins,
    adminGrantBeans,
    adminSetRole,
    adminSetVip,
    adminProcessWithdrawal,
    platformCommissionRate,
    setPlatformCommissionRate,
    addToast,
  } = useApp();

  const isDark = theme === 'dark';
  const baseChartOptions = getChartThemeOptions(isDark);

  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'user' | 'host' | 'agency'>('all');

  const adminEmail = 'syedsherazisyedsherazi02@gmail.com';

  // 1. Total Analytics: Platform Earning Graph ($32,456.65)
  const analyticsPlatformData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Platform Net Earnings ($ USD)',
        data: [14200, 16800, 19400, 22100, 24500, 26900, 28100, 29400, 30800, 31500, 32100, 32456.65],
        borderColor: '#10b981',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
      },
      {
        label: 'Creator Cashouts Paid',
        data: [8200, 9500, 11200, 12800, 14100, 15600, 16200, 17100, 18200, 18800, 19200, 19850],
        borderColor: '#a855f7',
        borderDash: [4, 4],
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: '#a855f7',
      },
    ],
  };

  // 2. Visitors: All Platform Visitors Line Chart
  const platformVisitorsData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Active Voice Room Listeners',
        data: [4200, 2100, 5800, 9400, 11200, 14280, 12900],
        borderColor: '#6366f1',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 240);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Unique Daily Visits',
        data: [6100, 3900, 8500, 14100, 18200, 22400, 19800],
        borderColor: '#06b6d4',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#06b6d4',
      },
    ],
  };

  // 3. Resources Overview: Active vs Inactive Users Bar Chart (Jan-Dec)
  const activeUsersBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Active Broadcasters & Users',
        data: [18000, 21500, 24200, 27800, 30100, 33400, 36200, 38900, 40500, 42100, 43200, 43981],
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
      {
        label: 'Inactive / Dormant Accounts',
        data: [4200, 4500, 4800, 5100, 5300, 5600, 5900, 6100, 6400, 6600, 6800, 7100],
        backgroundColor: isDark ? '#334155' : '#cbd5e1',
        borderRadius: 6,
      },
    ],
  };

  // 4. Sales Overview: Overall Sales ($429,536)
  const platformSalesDoughnutData = {
    labels: ['Rs 157 Coin Packages (68%)', 'VIP Subscriptions (22%)', 'Platform Gift Cut (10%)'],
    datasets: [
      {
        data: [292084, 94498, 42954],
        backgroundColor: ['#f59e0b', '#a855f7', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  const filteredUsers = allUsers.filter((u) => {
    const matchesQuery =
      u.displayName.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchUserQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesQuery && matchesRole;
  });

  // SUB-VIEW: USERS TAB
  if (activeTab === 'users') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Customers & Users Management (43,981 Registered)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Admin account authority: Ban, give Rs 157 coins, change roles and VIP tiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or @username..."
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                className={`text-xs rounded-xl pl-9 pr-3 py-2 border focus:outline-none ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border overflow-hidden ${
          isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-500'} uppercase text-[10px] font-semibold`}>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">VIP Tier</th>
                  <th className="py-3 px-4">Coins Balance</th>
                  <th className="py-3 px-4">Beans</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div>
                          <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {u.displayName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            @{u.username} · {u.countryName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => adminSetRole(u.id, e.target.value as UserRole)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold border ${
                          isDark ? 'bg-[#0d101c] border-white/10 text-purple-300' : 'bg-slate-50 border-slate-200 text-purple-700'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="host">Host</option>
                        <option value="agency">Agency</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.vipLevel}
                        onChange={(e) => adminSetVip(u.id, Number(e.target.value) as VipTierLevel)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold border ${
                          isDark ? 'bg-[#0d101c] border-white/10 text-amber-300' : 'bg-slate-50 border-slate-200 text-amber-700'
                        }`}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            VIP {lvl}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {u.coins.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {u.beans.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => adminGrantCoins(u.id, 250000)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold cursor-pointer"
                          title="Grant Rs 157 package coins"
                        >
                          +250k Coins
                        </button>
                        <button
                          onClick={() => adminBanUser(u.id, !u.isBanned)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            u.isBanned
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600/30 text-rose-300 hover:bg-rose-600/50'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT SUPER ADMIN DASHBOARD OVERVIEW
  return (
    <div className="space-y-6">
      {/* Top Banner with Admin Email confirmation */}
      <div className={`p-5 rounded-3xl border ${
        isDark
          ? 'bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900 border-red-500/30 shadow-xl'
          : 'bg-gradient-to-r from-red-50 to-purple-50 border-red-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              Super Admin Console · Full Platform Authority
            </div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Platform Executive Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              Admin Email: <strong className="text-purple-300 font-mono">{adminEmail}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* TOP 4 DASHFLAT METRIC CARDS (Exact values requested by user) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers (Users) */}
        <div
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Customers (Users)
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-black tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              43,981
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +12.4%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Platform wide accounts</div>
        </div>

        {/* Card 2: Total Orders (Recharge) */}
        <div
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Orders (Recharge)
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-black tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              55,543
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +8.1%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Completed coin recharges</div>
        </div>

        {/* Card 3: Growth */}
        <div
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Growth
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black tabular-nums text-emerald-400">
              58.86%
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              YoY +14.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Month-over-month trajectory</div>
        </div>

        {/* Card 4: Total Revenue */}
        <div
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] ${
            isDark ? 'bg-[#121626] border-amber-500/30' : 'bg-white border-amber-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black tabular-nums text-amber-400">
              USD 429,536
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              Rs 157 Pack
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Gross earnings from recharges</div>
        </div>
      </div>

      {/* MIDDLE SECTION: 2 CHARTS (Total Analytics $32,456.65 & Visitors) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Total Analytics ($32,456.65 Platform Earnings) */}
        <div
          className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Total Analytics
              </h3>
              <p className="text-xs text-slate-400">
                Platform net earning & broadcaster payouts
              </p>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-emerald-400 tabular-nums">
                $32,456.65
              </div>
              <span className="text-[10px] text-slate-400">Total platform earning</span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <Line data={analyticsPlatformData} options={baseChartOptions} />
          </div>
        </div>

        {/* Chart 2: Visitors (All platform visitors) */}
        <div
          className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                All Platform Visitors
              </h3>
              <p className="text-xs text-slate-400">
                Concurrent listeners & daily active unique visitors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Listeners (14.2k Peak)
              </span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <Line data={platformVisitorsData} options={baseChartOptions} />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 2 CHARTS (Resources Overview: Active vs Inactive & Sales Overview: Overall Sales) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottom 1: Resources Overview (Active vs Inactive Users Jan-Dec) */}
        <div
          className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Resources Overview
              </h3>
              <p className="text-xs text-slate-400">
                Active Broadcasters vs Inactive Users (Jan - Dec)
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-400">43,981 Active</span>
          </div>

          <div className="h-64 mt-4">
            <Bar data={activeUsersBarData} options={baseChartOptions} />
          </div>
        </div>

        {/* Bottom 2: Sales Overview (Overall Sales) */}
        <div
          className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Sales Overview
              </h3>
              <p className="text-xs text-slate-400">
                Overall platform gross revenue distribution
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-amber-400 font-mono">
                USD 429,536
              </span>
              <span className="text-[10px] text-emerald-400 block font-bold">55,543 Orders</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 mt-4">
            <div className="h-56 relative flex items-center justify-center">
              <Doughnut
                data={platformSalesDoughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: { legend: { display: false } },
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-semibold">Total Revenue</span>
                <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  $429,536
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Rs 157 Coin Packs
                </span>
                <span className="font-bold tabular-nums text-white">$292,084</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  VIP Subscriptions
                </span>
                <span className="font-bold tabular-nums text-white">$94,498</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Platform Gift Fee Cut
                </span>
                <span className="font-bold tabular-nums text-white">$42,954</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
