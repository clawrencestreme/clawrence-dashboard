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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/50">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
        
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
                🫖
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
            <div className="bg-black/30 backdrop-blur rounded-xl p-3 border border-zinc-700/50">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Market Cap</p>
              <p className="text-lg font-bold text-white">{market ? formatNumber(market.marketCap) : '—'}</p>
            </div>
            <div className="bg-black/30 backdrop-blur rounded-xl p-3 border border-zinc-700/50">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">24h Volume</p>
              <p className="text-lg font-bold text-white">{market ? formatNumber(market.volume24h) : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Card - Featured */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900/80 via-orange-900/60 to-amber-900/80 border border-amber-500/40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="font-bold text-amber-100 text-lg">The Butler&apos;s Commission</h3>
              <p className="text-xs text-amber-200/70">Top holder wins a custom mini-app</p>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
            <p className="text-[10px] uppercase tracking-widest text-amber-300/70 text-center mb-2">Time Remaining</p>
            <p className="text-3xl font-mono font-bold text-center text-amber-100 tracking-wider">
              {timeLeft}
            </p>
          </div>
        </div>
      </div>

      {/* Staking Card */}
      <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <span className="text-lg">⚡</span>
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
          <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
          <span className="text-[10px] font-medium text-zinc-400 group-hover:text-emerald-400 transition-colors">Chart</span>
        </a>
        <a 
          href="https://streme.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">💧</span>
          <span className="text-[10px] font-medium text-zinc-400 group-hover:text-blue-400 transition-colors">Streme</span>
        </a>
        <a 
          href="https://warpcast.com/clawrencestreme"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🟣</span>
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
