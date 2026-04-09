import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface MarketSymbol {
  symbol: string;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
}

const initialSymbols: MarketSymbol[] = [
  { symbol: 'EURUSD', bid: 1.08542, ask: 1.08558, change: 0.00032, changePercent: 0.29 },
  { symbol: 'GBPUSD', bid: 1.26234, ask: 1.26251, change: -0.00045, changePercent: -0.36 },
  { symbol: 'USDJPY', bid: 149.823, ask: 149.841, change: 0.156, changePercent: 0.10 },
  { symbol: 'AUDUSD', bid: 0.63845, ask: 0.63862, change: 0.00089, changePercent: 0.14 },
  { symbol: 'USDCAD', bid: 1.35672, ask: 1.35689, change: -0.00112, changePercent: -0.08 },
  { symbol: 'NZDUSD', bid: 0.58234, ask: 0.58251, change: 0.00067, changePercent: 0.12 },
  { symbol: 'USDCHF', bid: 0.88456, ask: 0.88473, change: -0.00034, changePercent: -0.04 },
  { symbol: 'EURGBP', bid: 0.86012, ask: 0.86029, change: 0.00023, changePercent: 0.03 },
];

export function MarketWatch({ onSymbolSelect }: { onSymbolSelect: (symbol: string) => void }) {
  const [symbols, setSymbols] = useState<MarketSymbol[]>(initialSymbols);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');

  // Simulate price updates
  useState(() => {
    const interval = setInterval(() => {
      setSymbols(prev => prev.map(s => {
        const changeAmount = (Math.random() - 0.5) * 0.0002;
        const newBid = parseFloat((s.bid + changeAmount).toFixed(5));
        const newAsk = parseFloat((s.ask + changeAmount).toFixed(5));
        const newChange = parseFloat((s.change + changeAmount).toFixed(5));
        const newChangePercent = parseFloat(((newChange / newBid) * 100).toFixed(2));
        
        return {
          ...s,
          bid: newBid,
          ask: newAsk,
          change: newChange,
          changePercent: newChangePercent,
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  });

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    onSymbolSelect(symbol);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
      <div className="p-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-200">Market Watch</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-zinc-800 text-zinc-400">
            <tr>
              <th className="text-left p-2">Symbol</th>
              <th className="text-right p-2">Bid</th>
              <th className="text-right p-2">Ask</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((symbol) => (
              <tr
                key={symbol.symbol}
                onClick={() => handleSymbolClick(symbol.symbol)}
                className={`cursor-pointer border-b border-zinc-800 hover:bg-zinc-800 transition-colors ${
                  selectedSymbol === symbol.symbol ? 'bg-zinc-800' : ''
                }`}
              >
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-200 font-medium">{symbol.symbol}</span>
                    {symbol.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                  <div className={`text-xs ${symbol.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {symbol.change >= 0 ? '+' : ''}{symbol.changePercent}%
                  </div>
                </td>
                <td className="text-right p-2 text-zinc-300">{symbol.bid.toFixed(5)}</td>
                <td className="text-right p-2 text-zinc-300">{symbol.ask.toFixed(5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
