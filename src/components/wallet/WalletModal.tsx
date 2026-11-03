import React, { useState } from 'react';
import {
  X,
  Coins,
  Gem,
  CreditCard,
  Crown,
  History,
  CheckCircle2,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { COIN_PACKAGES } from '../../data/initialData';
import { WithdrawalRequest } from '../../types';

interface WalletModalProps {
  onClose: () => void;
  defaultTab?: 'coins' | 'beans' | 'history';
}

export const WalletModal: React.FC<WalletModalProps> = ({
  onClose,
  defaultTab = 'coins',
}) => {
  const {
    currentUser,
    buyCoins,
    requestWithdrawal,
    transactions,
    formatCurrency,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'coins' | 'beans' | 'history'>(defaultTab);

  // Buy Coins state
  const [selectedPackId, setSelectedPackId] = useState<string>(COIN_PACKAGES[1].id);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'gpay' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardName, setCardName] = useState(currentUser.displayName);
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);

  // Cashout Beans state
  const [withdrawBeansAmount, setWithdrawBeansAmount] = useState<number>(50000); // $50
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawalRequest['paymentMethod']>('bank_transfer');
  const [accountName, setAccountName] = useState(currentUser.displayName);
  const [accountNumber, setAccountNumber] = useState('US89370400440532013000');
  const [bankOrNetwork, setBankOrNetwork] = useState('Chase Bank USA');

  const selectedPack = COIN_PACKAGES.find((p) => p.id === selectedPackId) || COIN_PACKAGES[1];

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingBuy(true);
    setTimeout(() => {
      buyCoins(selectedPack.id, paymentMethod, { name: cardName, number: cardNumber });
      setIsProcessingBuy(false);
    }, 800);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = requestWithdrawal(withdrawBeansAmount, withdrawMethod, {
      accountName,
      accountNumberOrEmail: accountNumber,
      bankOrNetwork,
    });
    if (success) {
      setActiveTab('history');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl bg-[#121626] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              EITA Wallet & Monetization
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Cards Summary */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Coins Balance Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-yellow-950/30 border border-amber-500/30">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
              <Coins className="w-3.5 h-3.5" />
              <span>Coins Balance</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">
              {currentUser.coins.toLocaleString()}
            </div>
            <p className="text-[10px] text-amber-200/70 mt-1">Used for gifts & VIP perks</p>
          </div>

          {/* Beans Earnings Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-teal-950/30 border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-1">
              <Gem className="w-3.5 h-3.5" />
              <span>Beans Earned</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">
              {currentUser.beans.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-200/70 mt-1">
              Value: {formatCurrency(currentUser.beans / 1000)} USD
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-2xl mt-4">
          <button
            onClick={() => setActiveTab('coins')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coins'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🪙 Buy Coins
          </button>
          <button
            onClick={() => setActiveTab('beans')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'beans'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💎 Cash Out Beans
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📜 Transactions
          </button>
        </div>

        {/* TAB 1: BUY COINS */}
        {activeTab === 'coins' && (
          <form onSubmit={handleBuySubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Select Coin Package
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {COIN_PACKAGES.map((pack) => {
                  const isSelected = selectedPackId === pack.id;
                  const total = pack.coins + pack.bonus;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-950/60'
                          : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {pack.bonus > 0 && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black text-[9px] font-black uppercase">
                          +{pack.bonus.toLocaleString()} Bonus
                        </span>
                      )}
                      <div>
                        <div className="text-base font-black text-white tabular-nums flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          {total.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-purple-300 font-semibold mt-0.5">
                          {pack.tag}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-amber-300 mt-2">
                        {formatCurrency(pack.priceUsd)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Gateway Options */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Payment Method (Secure 256-Bit SSL)
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  💳 Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  🅿️ PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gpay')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'gpay'
                      ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  G Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'crypto'
                      ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  ₮ USDT
                </button>
              </div>
            </div>

            {/* Card Inputs if Card chosen */}
            {paymentMethod === 'card' && (
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessingBuy}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isProcessingBuy
                  ? 'Processing Secure Checkout...'
                  : `Pay ${formatCurrency(selectedPack.priceUsd)} & Receive ${(
                      selectedPack.coins + selectedPack.bonus
                    ).toLocaleString()} Coins`}
              </span>
            </button>
          </form>
        )}

        {/* TAB 2: CASHOUT BEANS */}
        {activeTab === 'beans' && (
          <form onSubmit={handleWithdrawSubmit} className="mt-4 space-y-4">
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl">
              <div className="text-xs font-bold text-emerald-300">
                1,000 Beans = $1.00 USD
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Minimum cashout threshold is 20,000 Beans ($20.00 USD).
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Beans to Withdraw
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={20000}
                  step={5000}
                  max={currentUser.beans}
                  value={withdrawBeansAmount}
                  onChange={(e) => setWithdrawBeansAmount(Number(e.target.value))}
                  className="flex-1 bg-[#0d101c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setWithdrawBeansAmount(currentUser.beans)}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-emerald-300 cursor-pointer"
                >
                  All
                </button>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                You will receive:{' '}
                <span className="font-bold text-emerald-400">
                  {formatCurrency(withdrawBeansAmount / 1000)} USD
                </span>
              </div>
            </div>

            {/* Payout Method */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Payout Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('bank_transfer')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    withdrawMethod === 'bank_transfer'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  🏦 Bank Wire Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('paypal')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    withdrawMethod === 'paypal'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  🅿️ PayPal Email
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('usdt_crypto')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    withdrawMethod === 'usdt_crypto'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  ₮ USDT (TRC-20)
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawMethod('wise')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    withdrawMethod === 'wise'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-white/5 bg-white/5 text-slate-400'
                  }`}
                >
                  🌐 Wise Transfer
                </button>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Recipient Account Name
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Account Number / IBAN / Wallet Address
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={currentUser.beans < withdrawBeansAmount || withdrawBeansAmount < 20000}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>
                Submit Cashout Request ({formatCurrency(withdrawBeansAmount / 1000)} USD)
              </span>
            </button>
          </form>
        )}

        {/* TAB 3: TRANSACTION HISTORY */}
        {activeTab === 'history' && (
          <div className="mt-4 space-y-2">
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No past transactions recorded.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.map((tx) => {
                  const isPositive =
                    tx.type === 'purchase_coins' ||
                    tx.type === 'receive_beans' ||
                    tx.type === 'mission_reward';

                  return (
                    <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isPositive
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {tx.description}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {tx.createdAt} · {tx.status.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-xs font-bold tabular-nums ${
                            isPositive ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {isPositive ? '+' : '-'}
                          {tx.amount.toLocaleString()} {tx.currency}
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">
                          ID: {tx.id.replace('tx_', '')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
