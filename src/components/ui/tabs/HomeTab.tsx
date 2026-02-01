"use client";

import { useEffect, useState } from "react";
import { CLAWRENCE_TOKEN, STREME_API } from "~/lib/constants";

interface TokenData {
  name: string;
  symbol: string;
  contract_address: string;
  marketData?: {
    marketCap: number;
    price: number;
    priceChange24h: number;
    volume24h: number;
  };
  staking?: {
    supply: number;
  };
}

// Contest end time: Feb 3, 2026 08:00 UTC (constant)
const CONTEST_END = new Date('2026-02-03T08:00:00Z');

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPrice(price: number): string {
  if (price < 0.0001) return price.toExponential(2);
  if (price < 0.01) return price.toFixed(6);
  return price.toFixed(4);
}

// SVG Icons
const TeapotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V9a2 2 0 00-2-2h-3l-1.5-3h-5L7 7H4a2 2 0 00-2 2v8a2 2 0 002 2z" />
    <circle cx="12" cy="12" r="8" strokeDasharray="2 2" />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5h2.25A2.25 2.25 0 0121 5.75v1.5a2.25 2.25 0 01-2.25 2.25H18M7.5 3.5H5.25A2.25 2.25 0 003 5.75v1.5A2.25 2.25 0 005.25 9.5H6M7.5 3.5h9v6a4.5 4.5 0 11-9 0v-6zM12 13.5v3m-3 4.5h6" />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 004.644-15.09A8.21 8.21 0 0012 4.5c-1.676 0-3.242.502-4.644 1.41A8.25 8.25 0 0012 21z" />
  </svg>
);

const CastIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

export function HomeTab() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const res = await fetch(`${STREME_API}?address=${CLAWRENCE_TOKEN}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const token = data.find((t: TokenData) => 
            t.contract_address.toLowerCase() === CLAWRENCE_TOKEN.toLowerCase()
          );
          setTokenData(token || data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diff = CONTEST_END.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('ENDED');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const market = tokenData?.marketData;
  const priceChange = market?.priceChange24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-5 px-3 pb-6">
      {/* Hero Price Card */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-700/50">
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-900 shadow-lg">
                <TeapotIcon />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">$CLAWRENCE</h2>
                <p className="text-xs text-zinc-400 font-medium">Streaming Butler Token</p>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              isPositive 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}%
            </div>
          </div>

          {/* Price */}
          <div className="mb-5">
            <p className="text-4xl font-bold text-white font-mono tracking-tight">
              ${market ? formatPrice(market.price) : '—'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-xl p-3 border border-zinc-700/50">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Market Cap</p>
              <p className="text-lg font-bold text-white">{market ? formatNumber(market.marketCap) : '—'}</p>
            </div>
            <div className="bg-zinc-800 rounded-xl p-3 border border-zinc-700/50">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">24h Volume</p>
              <p className="text-lg font-bold text-white">{market ? formatNumber(market.volume24h) : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Card - Featured */}
      <div className="relative overflow-hidden rounded-2xl bg-amber-900/80 border border-amber-500/40">
        <div className="relative p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-900">
              <TrophyIcon />
            </div>
            <div>
              <h3 className="font-bold text-amber-100 text-lg">The Butler&apos;s Commission</h3>
              <p className="text-xs text-amber-200/70">Top holder wins a custom mini-app</p>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-xl p-4 border border-amber-500/20">
            <p className="text-[10px] uppercase tracking-widest text-amber-300/70 text-center mb-2">Time Remaining</p>
            <p className="text-3xl font-mono font-bold text-center text-amber-100 tracking-wider">
              {timeLeft}
            </p>
          </div>
        </div>
      </div>

      {/* Staking Card */}
      <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
            <BoltIcon />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Staking Rewards</h3>
            <p className="text-[10px] text-zinc-400">Superfluid streaming</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-xl bg-zinc-900/50">
            <p className="text-2xl font-bold text-purple-400">10B</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Reward Pool</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-zinc-900/50">
            <p className="text-2xl font-bold text-purple-400">1yr</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Stream Duration</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-2">
        <a 
          href={`https://dexscreener.com/base/${CLAWRENCE_TOKEN}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
        >
          <span className="text-zinc-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all">
            <ChartIcon />
          </span>
          <span className="text-[10px] font-medium text-zinc-400 group-hover:text-emerald-400 transition-colors">Chart</span>
        </a>
        <a 
          href="https://streme.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
        >
          <span className="text-zinc-400 group-hover:text-blue-400 group-hover:scale-110 transition-all">
            <DropletIcon />
          </span>
          <span className="text-[10px] font-medium text-zinc-400 group-hover:text-blue-400 transition-colors">Streme</span>
        </a>
        <a 
          href="https://warpcast.com/clawrencestreme"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
        >
          <span className="text-zinc-400 group-hover:text-purple-400 group-hover:scale-110 transition-all">
            <CastIcon />
          </span>
          <span className="text-[10px] font-medium text-zinc-400 group-hover:text-purple-400 transition-colors">Farcaster</span>
        </a>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-zinc-600 pt-2">
        Built by Clawrence · Powered by Streme & Superfluid
      </p>
    </div>
  );
}
