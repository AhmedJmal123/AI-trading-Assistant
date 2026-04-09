import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Activity } from 'lucide-react';

export function AccountInfo() {
  const [balance, setBalance] = useState(10000.00);
  const [equity, setEquity] = useState(10234.56);
  const [margin, setMargin] = useState(1245.32);
  const [freeMargin, setFreeMargin] = useState(8989.24);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 50;
      setEquity(prev => parseFloat((prev + change).toFixed(2)));
      setFreeMargin(prev => parseFloat((prev + change * 0.5).toFixed(2)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const profitLoss = equity - balance;
  const marginLevel = ((equity / margin) * 100).toFixed(2);

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-zinc-400" />
            <div>
              <div className="text-xs text-zinc-400">Balance</div>
              <div className="text-sm font-semibold text-zinc-100">${balance.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-400" />
            <div>
              <div className="text-xs text-zinc-400">Equity</div>
              <div className="text-sm font-semibold text-zinc-100">${equity.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <div>
              <div className="text-xs text-zinc-400">P/L</div>
              <div className={`text-sm font-semibold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-700" />

          <div>
            <div className="text-xs text-zinc-400">Margin</div>
            <div className="text-sm font-semibold text-zinc-100">${margin.toFixed(2)}</div>
          </div>

          <div>
            <div className="text-xs text-zinc-400">Free Margin</div>
            <div className="text-sm font-semibold text-zinc-100">${freeMargin.toFixed(2)}</div>
          </div>

          <div>
            <div className="text-xs text-zinc-400">Margin Level</div>
            <div className="text-sm font-semibold text-zinc-100">{marginLevel}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-zinc-400">Server: </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-300">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
