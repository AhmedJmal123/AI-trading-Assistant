import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'forex';
  price: number;
  change24h: number;
  signal: 'buy' | 'sell' | 'hold';
  signalStrength: number;
  chartData: { time: string; open: number; high: number; low: number; close: number }[];
}

export interface Position {
  id: string;
  assetId: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  timestamp: number;
}

export interface Trade {
  id: string;
  assetId: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  profit?: number;
  entryTime: number;
  exitTime?: number;
  status: 'open' | 'closed';
}

interface TradingContextType {
  balance: number;
  setBalance: (balance: number) => void;
  assets: Asset[];
  positions: Position[];
  trades: Trade[];
  portfolioValue: number;
  buyAsset: (assetId: string, quantity: number) => void;
  sellAsset: (positionId: string) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

function generateCandlestickData(basePrice: number): { time: string; open: number; high: number; low: number; close: number }[] {
  const data = [];
  const now = Date.now();
  let price = basePrice * 0.95;
  
  // Generate 24 hourly candles
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now - i * 60 * 60 * 1000); // Hourly candles
    const open = price;
    const volatility = basePrice * 0.015;
    
    // Generate realistic OHLC data
    const close = open + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    
    price = close;
  }
  
  return data;
}

const initialAssets: Asset[] = [
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 178.45,
    change24h: 2.3,
    signal: 'buy',
    signalStrength: 85,
    chartData: generateCandlestickData(178.45),
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    price: 142.32,
    change24h: -1.2,
    signal: 'hold',
    signalStrength: 45,
    chartData: generateCandlestickData(142.32),
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'stock',
    price: 412.89,
    change24h: 1.8,
    signal: 'buy',
    signalStrength: 72,
    chartData: generateCandlestickData(412.89),
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'stock',
    price: 189.76,
    change24h: -3.5,
    signal: 'sell',
    signalStrength: 68,
    chartData: generateCandlestickData(189.76),
  },
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro vs US Dollar',
    type: 'forex',
    price: 1.0855,
    change24h: 0.3,
    signal: 'buy',
    signalStrength: 78,
    chartData: generateCandlestickData(1.0855),
  },
];

export function TradingProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(10000);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Update prices and signals every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const priceChange = (Math.random() - 0.5) * (asset.price * 0.02);
        const newPrice = parseFloat((asset.price + priceChange).toFixed(asset.type === 'forex' ? 4 : 2));
        const newChange = parseFloat(((priceChange / asset.price) * 100).toFixed(2));
        
        // AI signal logic (simplified)
        let signal: 'buy' | 'sell' | 'hold' = 'hold';
        let signalStrength = 50;
        
        if (newChange > 0.5) {
          signal = 'buy';
          signalStrength = Math.min(95, 60 + Math.abs(newChange) * 10);
        } else if (newChange < -0.5) {
          signal = 'sell';
          signalStrength = Math.min(95, 60 + Math.abs(newChange) * 10);
        } else {
          signalStrength = 40 + Math.random() * 20;
        }
        
        // Update chart data - add new hourly candle
        const lastCandle = asset.chartData[asset.chartData.length - 1];
        const open = lastCandle.close;
        const volatility = asset.price * 0.015;
        const close = newPrice;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        
        const newChartData = [...asset.chartData.slice(1), {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
        }];
        
        return {
          ...asset,
          price: newPrice,
          change24h: asset.change24h + newChange,
          signal,
          signalStrength,
          chartData: newChartData,
        };
      }));
      
      // Update position prices
      setPositions(prev => prev.map(pos => {
        const asset = assets.find(a => a.id === pos.assetId);
        if (asset) {
          return { ...pos, currentPrice: asset.price };
        }
        return pos;
      }));
    }, 3600000); // Update every 1 hour
    
    return () => clearInterval(interval);
  }, [assets]);

  const buyAsset = (assetId: string, quantity: number) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    
    const cost = asset.price * quantity;
    if (cost > balance) {
      alert('Insufficient balance');
      return;
    }
    
    const newPosition: Position = {
      id: Date.now().toString(),
      assetId: asset.id,
      symbol: asset.symbol,
      type: 'buy',
      entryPrice: asset.price,
      currentPrice: asset.price,
      quantity,
      timestamp: Date.now(),
    };
    
    const newTrade: Trade = {
      id: Date.now().toString(),
      assetId: asset.id,
      symbol: asset.symbol,
      type: 'buy',
      entryPrice: asset.price,
      quantity,
      entryTime: Date.now(),
      status: 'open',
    };
    
    setPositions(prev => [...prev, newPosition]);
    setTrades(prev => [...prev, newTrade]);
    setBalance(prev => prev - cost);
  };

  const sellAsset = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;
    
    const asset = assets.find(a => a.id === position.assetId);
    if (!asset) return;
    
    const revenue = asset.price * position.quantity;
    const profit = (asset.price - position.entryPrice) * position.quantity;
    
    // Update trade
    setTrades(prev => prev.map(t => {
      if (t.assetId === position.assetId && t.status === 'open' && t.entryTime === position.timestamp) {
        return {
          ...t,
          exitPrice: asset.price,
          profit,
          exitTime: Date.now(),
          status: 'closed' as const,
        };
      }
      return t;
    }));
    
    // Remove position
    setPositions(prev => prev.filter(p => p.id !== positionId));
    setBalance(prev => prev + revenue);
  };

  const portfolioValue = positions.reduce((total, pos) => {
    return total + (pos.currentPrice * pos.quantity);
  }, 0);

  return (
    <TradingContext.Provider
      value={{
        balance,
        setBalance,
        assets,
        positions,
        trades,
        portfolioValue,
        buyAsset,
        sellAsset,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within TradingProvider');
  }
  return context;
}