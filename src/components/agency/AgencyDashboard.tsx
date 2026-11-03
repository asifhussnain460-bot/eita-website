import React, { useState } from 'react';
import {
  Building2,
  Users,
  Gem,
  Award,
  UserPlus,
  Trash2,
  CheckCircle,
  Copy,
  DollarSign,
  TrendingUp,
  Search,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgencyDashboard: React.FC = () => {
  const {
    agency,
    currentUser,
    inviteHostToAgency,
    removeHostFromAgency,
    registerAgency,
    formatCurrency,
    addToast,
  } = useApp();

  const [inviteInput, setInviteInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchHost, setSearchHost] = useState('');

  // New Agency Form state (for non-agencies)
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyEmail, setNewAgencyEmail] = useState('');
  const [newAgencyRegion, setNewAgencyRegion] = useState('Middle East & Global');

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(agency.code).catch(() => {});
    setCopiedCode(true);
    addToast({
      type: 'success',
      title: 'Agency Code Copied',
      message: `Code ${agency.code} copied to clipboard!`,
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    const ok = inviteHostToAgency(inviteInput.trim());
    if (ok) setInviteInput('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName.trim() || !newAgencyEmail.trim()) return;
    registerAgency({
      name: newAgencyName.trim(),
      email: newAgencyEmail.trim(),
      region: newAgencyRegion,
    });
  };

  const filteredHosts = agency.hosts.filter(
    (h) =>
      h.displayName.toLowerCase().includes(searchHost.toLowerCase()) ||
      h.username.toLowerCase().includes(searchHost.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 space-y-5">
      {/* Top Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border border-cyan-500/30 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Agency Management & Recruitment
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {agency.name}
              {agency.verified && (
                <CheckCircle className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
              )}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Recruit voice hosts, track broadcaster performance, and collect monthly commission bonuses.
            </p>
          </div>

          {/* Agency Code Card */}
          <div className="bg-black/50 border border-cyan-500/40 px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0">
            <div>
              <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                Agency Referral Code
              </div>
              <div className="text-lg font-black text-white font-mono tracking-wider">
                {agency.code}
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Active Hosts</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {agency.hosts.length}
          </div>
          <div className="text-[10px] text-purple-300 mt-1">Broadcasters under contract</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <Gem className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Beans Volume</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {agency.monthlyBeans.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-300 mt-1">This month collection</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Commission Tier</span>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {(agency.commissionRate * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-cyan-300 mt-1">Tier 1 Elite Agency</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#121626] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Estimated Payout</span>
          </div>
          <div className="text-2xl font-black text-amber-300 tabular-nums">
            {formatCurrency(agency.monthlyEarningsUsd)}
          </div>
          <div className="text-[10px] text-amber-200/70 mt-1">Pending monthly settlement</div>
        </div>
      </div>

      {/* Host Recruitment Form */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#121626] border border-purple-900/30">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-purple-400" />
          Recruit Host by Username or User ID
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Enter an existing host username (e.g. <code>sophia_luna</code>, <code>kenji_beats</code>, <code>tariq_oud</code>) to add them to your agency roster.
        </p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-center gap-2 max-w-lg">
          <input
            type="text"
            required
            placeholder="Host username or ID..."
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
            className="flex-1 w-full bg-[#0d101c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Add to Agency
          </button>
        </form>
      </div>

      {/* Managed Hosts Table */}
      <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-4 sm:p-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Agency Roster ({agency.hosts.length} Hosts)
          </h3>
          <div className="relative max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roster..."
              value={searchHost}
              onChange={(e) => setSearchHost(e.target.value)}
              className="w-full bg-[#0d101c] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {filteredHosts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No hosts found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Host</th>
                  <th className="py-2.5 px-3">Live Streaming Hours</th>
                  <th className="py-2.5 px-3">Beans Collected</th>
                  <th className="py-2.5 px-3">Target Progress</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHosts.map((host) => (
                  <tr key={host.hostId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={host.avatar}
                          alt={host.displayName}
                          className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                        />
                        <div>
                          <div className="font-bold text-white">{host.displayName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            @{host.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 tabular-nums font-semibold text-slate-200">
                      {host.streamHoursThisMonth} hrs
                    </td>
                    <td className="py-3 px-3 tabular-nums font-bold text-emerald-400">
                      {host.beansCollectedThisMonth.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${Math.min(100, host.targetProgressPercent)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-purple-300">
                          {host.targetProgressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => removeHostFromAgency(host.hostId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remove Host"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Agency Registration Form (if user wants to register another agency) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/5">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Register New Regional Agency
        </h4>
        <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Agency Legal Name"
            value={newAgencyName}
            onChange={(e) => setNewAgencyName(e.target.value)}
            className="bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="email"
            required
            placeholder="Official Contact Email"
            value={newAgencyEmail}
            onChange={(e) => setNewAgencyEmail(e.target.value)}
            className="bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};
