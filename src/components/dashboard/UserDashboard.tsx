import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  Heart,
  Coins,
  DollarSign,
  TrendingUp,
  Eye,
  Video,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Sparkles,
  Plus,
  Play,
  Share2,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getChartThemeOptions } from '../../utils/chartConfig';
import { DashboardSidebarTab } from './DashFlatLayout';

interface UserDashboardProps {
  activeTab: DashboardSidebarTab;
  onOpenWallet: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ activeTab, onOpenWallet }) => {
  const { currentUser, theme, formatCurrency, addToast, navigateTo } = useApp();

  const isDark = theme === 'dark';
  const baseChartOptions = getChartThemeOptions(isDark);

  // Time filters
  const [analyticsRange, setAnalyticsRange] = useState<'6m' | '30d' | '7d'>('6m');
  const [visitorFilter, setVisitorFilter] = useState<'week' | 'month'>('week');

  // Video performance mock data
  const userVideos = [
    {
      id: 'v_1',
      title: 'Midnight Karaoke Session - Acoustic Cover 🎵',
      views: '24.5K',
      likes: '4.2K',
      shares: '850',
      duration: '03:42',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
      date: 'Nov 01, 2026',
    },
    {
      id: 'v_2',
      title: 'Golden Dragon Gift Shower Reaction! 🐉🔥',
      views: '58.9K',
      likes: '12.1K',
      shares: '2.4K',
      duration: '01:15',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
      date: 'Oct 28, 2026',
    },
    {
      id: 'v_3',
      title: 'PK Battle Victory Highlights vs Team Omega ⚔️',
      views: '41.2K',
      likes: '8.9K',
      shares: '1.7K',
      duration: '04:50',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      date: 'Oct 22, 2026',
    },
  ];

  // 1. Analytics Chart Data (Earnings last 6 months)
  const earningsChartData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'My Earnings ($ USD)',
        data: [12.5, 18.2, 24.0, 31.5, 38.0, 42.95],
        borderColor: '#a855f7',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 240);
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // 2. Visitors Chart Data (Who visited my profile)
  const visitorsChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Unique Visitors',
        data: [1420, 1850, 2100, 1920, 2450, 3120, 2890],
        borderColor: '#06b6d4',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 240);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
      },
      {
        label: 'Page Views',
        data: [2400, 3100, 3800, 3400, 4200, 5600, 5100],
        borderColor: '#ec4899',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#ec4899',
      },
    ],
  };

  // 3. Resources Overview: My Videos Performance (Bar chart Jan-Dec)
  const videosBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Video Views (x1000)',
        data: [12, 19, 28, 35, 42, 55, 68, 82, 94, 110, 128, 145],
        backgroundColor: '#8b5cf6',
        borderRadius: 6,
      },
      {
        label: 'Likes Received (x1000)',
        data: [4, 7, 11, 15, 18, 24, 29, 36, 42, 48, 52, 55.5],
        backgroundColor: '#ec4899',
        borderRadius: 6,
      },
    ],
  };

  // 4. Sales Overview: Gifts Received breakdown
  const salesDoughnutData = {
    labels: ['Roses & Flowers', 'Sports Cars', 'Golden Dragons', 'VIP Passes'],
    datasets: [
      {
        data: [18500, 12400, 7260, 3000],
        backgroundColor: ['#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'],
        borderWidth: 0,
      },
    ],
  };

  // Render Sub-Views based on activeTab
  if (activeTab === 'videos') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              My Videos & Broadcast Clips
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your published clips, video gifts, and viewer engagement.
            </p>
          </div>
          <button
            onClick={() =>
              addToast({
                type: 'info',
                title: 'Video Upload',
                message: 'Recorded live stream clips are synced automatically!',
              })
            }
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Reel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userVideos.map((video) => (
            <div
              key={video.id}
              className={`rounded-3xl border overflow-hidden transition-all hover:scale-[1.01] ${
                isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px]">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> {video.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-purple-400" /> {video.shares}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // DEFAULT DASHBOARD VIEW
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Hello, {currentUser.displayName}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 text-xs font-bold">
              User Dashboard
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            DashFlat Performance Console · Track your followers, coins, and gifts revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              addToast({
                type: 'success',
                title: 'Report Downloaded',
                message: 'Monthly performance statement exported to CSV.',
              })
            }
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* TOP 4 DASHFLAT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Followers */}
        <div
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Followers
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-black tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              12,450
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +5.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">This week active gain</div>
        </div>

        {/* Card 2: Total Likes */}
        <div
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Likes
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-black tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
              55,543
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +10%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across all videos & rooms</div>
        </div>

        {/* Card 3: My Coins */}
        <div
          onClick={onOpenWallet}
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] cursor-pointer ${
            isDark ? 'bg-[#121626] border-amber-500/30 hover:border-amber-400/50' : 'bg-white border-amber-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Coins
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-black tabular-nums text-amber-400`}>
              250,000
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              Rs 157 Pack
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Your Rs 157 package balance</div>
        </div>

        {/* Card 4: My Earnings */}
        <div
          onClick={onOpenWallet}
          className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] cursor-pointer ${
            isDark ? 'bg-[#121626] border-emerald-500/30 hover:border-emerald-400/50' : 'bg-white border-emerald-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Earnings
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-black tabular-nums text-emerald-400`}>
              USD 42.95
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              Ready to Cash
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">From room virtual gifts</div>
        </div>
      </div>

      {/* MIDDLE SECTION: 2 CHARTS (Analytics & Visitors) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Analytics Earnings Graph */}
        <div
          className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Analytics Overview
              </h3>
              <p className="text-xs text-slate-400">
                Monthly gift earnings revenue (last 6 months)
              </p>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-purple-400 tabular-nums">
                USD 42.95
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">+18.4% growth</span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <Line data={earningsChartData} options={baseChartOptions} />
          </div>
        </div>

        {/* Chart 2: Visitors Line Chart */}
        <div
          className={`p-5 rounded-3xl border ${
            isDark ? 'bg-[#121626] border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Profile Visitors
              </h3>
              <p className="text-xs text-slate-400">
                Who visited my profile (Unique Visitors vs Views)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Unique
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-pink-400">
                <span className="w-2 h-2 rounded-full bg-pink-400" /> Views
              </span>
            </div>
          </div>

          <div className="h-64 mt-4">
            <Line data={visitorsChartData} options={baseChartOptions} />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 2 CHARTS (Resources Overview & Sales Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottom 1: Resources Overview (My Videos Performance Jan-Dec) */}
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
                My Videos performance across Jan - Dec
              </p>
            </div>
            <span className="text-xs font-bold text-purple-400">145K Total Views</span>
          </div>

          <div className="h-64 mt-4">
            <Bar data={videosBarData} options={baseChartOptions} />
          </div>
        </div>

        {/* Bottom 2: Sales Overview */}
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
                Virtual gifts received performance
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Today: <strong className="text-emerald-400 font-mono">$14</strong></span>
              <span className="text-sm font-black text-amber-400 font-mono">Overall $41,160</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 mt-4">
            <div className="h-56 relative flex items-center justify-center">
              <Doughnut
                data={salesDoughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: { legend: { display: false } },
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400 font-semibold">Total</span>
                <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  $41,160
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Roses & Flowers
                </span>
                <span className="font-bold tabular-nums text-white">$18,500</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Sports Cars
                </span>
                <span className="font-bold tabular-nums text-white">$12,400</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Golden Dragons
                </span>
                <span className="font-bold tabular-nums text-white">$7,260</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  VIP Passes
                </span>
                <span className="font-bold tabular-nums text-white">$3,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
