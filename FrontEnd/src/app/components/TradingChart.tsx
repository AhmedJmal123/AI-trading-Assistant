import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartData {
  time: string;
  price: number;
}

function generateChartData(basePrice: number): ChartData[] {
  const data: ChartData[] = [];
  const now = new Date();
  let price = basePrice;

  for (let i = 100; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    price += (Math.random() - 0.5) * 0.0005;
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(price.toFixed(5)),
    });
  }

  return data;
}

export function TradingChart({ symbol }: { symbol: string }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    // Get base price for symbol
    const basePrices: Record<string, number> = {
      EURUSD: 1.08550,
      GBPUSD: 1.26242,
      USDJPY: 149.832,
      AUDUSD: 0.63853,
      USDCAD: 1.35680,
      NZDUSD: 0.58242,
      USDCHF: 0.88464,
      EURGBP: 0.86020,
    };

    const basePrice = basePrices[symbol] || 1.0;
    const initialData = generateChartData(basePrice);
    setChartData(initialData);
    setCurrentPrice(initialData[initialData.length - 1].price);

    // Update price periodically
    const interval = setInterval(() => {
      setChartData(prev => {
        const lastPrice = prev[prev.length - 1].price;
        const newPrice = parseFloat((lastPrice + (Math.random() - 0.5) * 0.0003).toFixed(5));
        const now = new Date();
        const newData = [
          ...prev.slice(1),
          {
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            price: newPrice,
          },
        ];

        setCurrentPrice(newPrice);
        setPriceChange(newPrice - prev[0].price);

        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-200">{symbol}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-zinc-100">{currentPrice.toFixed(5)}</span>
            <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {['1M', '5M', '15M', '30M', '1H', '4H', '1D'].map(tf => (
            <button
              key={tf}
              className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis 
              dataKey="time" 
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
            />
            <YAxis 
              domain={['auto', 'auto']}
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(5)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '4px',
              }}
              labelStyle={{ color: '#a1a1aa' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
