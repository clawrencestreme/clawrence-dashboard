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
  pool_address?: string;
}

interface StakingStats {
  totalStaked: string;
  poolShare: string;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPrice(price: number): string {
  if (price < 0.00001) return price.toExponential(2);
  return price.toFixed(6);
}

export function HomeTab() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contest end time: Feb 3, 2026 08:00 UTC
  const contestEnd = new Date('2026-02-03T08:00:00Z');
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
        setError('Failed to load token data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const diff = contestEnd.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Contest ended');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading $CLAWRENCE data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const market = tokenData?.marketData;
  const priceChange = market?.priceChange24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-4 px-4">
      {/* Token Header */}
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-white">$CLAWRENCE</h2>
            <p className="text-sm text-gray-400">Clawrence</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-mono text-white">
              ${market ? formatPrice(market.price) : '—'}
            </p>
            <p className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Market Cap</p>
            <p className="text-lg font-semibold text-white">
              {market ? formatNumber(market.marketCap) : '—'}
            </p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">24h Volume</p>
            <p className="text-lg font-semibold text-white">
              {market ? formatNumber(market.volume24h) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Staking Info */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <span>🥩</span> Staking
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400">Reward Pool</p>
            <p className="text-lg font-semibold text-white">
              {tokenData?.staking?.supply ? 
                `${(tokenData.staking.supply / 1_000_000_000).toFixed(0)}B` : 
                '10B'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Stream Duration</p>
            <p className="text-lg font-semibold text-white">1 Year</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Stake to earn streaming rewards via Superfluid GDA
        </p>
      </div>

      {/* Contest Banner */}
      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-xl p-4 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🏆</span>
          <h3 className="font-bold text-amber-200">The Butler's Commission</h3>
        </div>
        <p className="text-sm text-gray-300 mb-3">
          Holder with the most $CLAWRENCE when time runs out wins a custom mini-app build.
        </p>
        <div className="bg-black/40 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Time Remaining</p>
          <p className="text-2xl font-mono font-bold text-amber-300">{timeLeft}</p>
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-2">
        <a 
          href={`https://dexscreener.com/base/${CLAWRENCE_TOKEN}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-700/50 hover:bg-gray-700 rounded-lg p-3 text-center text-sm text-gray-300 transition-colors"
        >
          DexScreener
        </a>
        <a 
          href="https://streme.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-700/50 hover:bg-gray-700 rounded-lg p-3 text-center text-sm text-gray-300 transition-colors"
        >
          Streme
        </a>
        <a 
          href="https://warpcast.com/clawrencestreme"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-purple-700/50 hover:bg-purple-700 rounded-lg p-3 text-center text-sm text-gray-300 transition-colors"
        >
          Farcaster
        </a>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500 pt-2">
        Built by Clawrence • Powered by Streme
      </p>
    </div>
  );
}
