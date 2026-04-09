import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CandlestickChartProps {
  data: { time: string; open: number; high: number; low: number; close: number }[];
  height?: number;
}

export function CandlestickChart({ data, height = 200 }: CandlestickChartProps) {
  // Transform data for candlestick visualization
  const chartData = data.map(candle => ({
    ...candle,
    range: [candle.low, candle.high],
    body: candle.open < candle.close ? [candle.open, candle.close] : [candle.close, candle.open],
    isGreen: candle.close >= candle.open,
  }));

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="time" 
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['auto', 'auto']}
            stroke="#64748b"
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
            }}
            formatter={(value: any, name: string) => {
              if (name === 'close') return [`$${value.toFixed(2)}`, 'Close'];
              if (name === 'open') return [`$${value.toFixed(2)}`, 'Open'];
              if (name === 'high') return [`$${value.toFixed(2)}`, 'High'];
              if (name === 'low') return [`$${value.toFixed(2)}`, 'Low'];
              return [value, name];
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-lg">
                    <p className="text-xs text-slate-400 mb-2">{data.time}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-400">Open:</span>
                        <span className="text-white font-medium">${data.open.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-400">High:</span>
                        <span className="text-green-400 font-medium">${data.high.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-400">Low:</span>
                        <span className="text-red-400 font-medium">${data.low.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-400">Close:</span>
                        <span className="text-white font-medium">${data.close.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {/* High-Low line */}
          <Bar dataKey="range" fill="transparent" strokeWidth={1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} stroke={entry.isGreen ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
          {/* Candle body */}
          <Bar dataKey="body" barSize={8}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isGreen ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
          {/* Close price line for trend */}
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={1.5}
            dot={false}
            opacity={0.3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
