import { useTrading } from '../context/TradingContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useState, useEffect } from 'react';

export function Dashboard() {
  const { balance, portfolioValue, positions, trades } = useTrading();
  const [portfolioHistory, setPortfolioHistory] = useState<{ time: string; value: number }[]>([]);
  
  const totalValue = balance + portfolioValue;
  const initialBalance = 10000;
  const totalProfit = totalValue - initialBalance;
  const profitPercent = ((totalProfit / initialBalance) * 100).toFixed(2);
  
  const closedTrades = trades.filter(t => t.status === 'closed');
  const winningTrades = closedTrades.filter(t => (t.profit || 0) > 0).length;
  const losingTrades = closedTrades.filter(t => (t.profit || 0) < 0).length;
  const winRate = closedTrades.length > 0 ? ((winningTrades / closedTrades.length) * 100).toFixed(1) : '0.0';
  
  const totalProfitFromTrades = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const avgProfit = closedTrades.length > 0 ? (totalProfitFromTrades / closedTrades.length).toFixed(2) : '0.00';

  // Initialize portfolio history with current value
  useEffect(() => {
    if (portfolioHistory.length === 0) {
      const initialHistory = [];
      const now = Date.now();
      for (let i = 10; i >= 0; i--) {
        const time = new Date(now - i * 5000);
        initialHistory.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: totalValue,
        });
      }
      setPortfolioHistory(initialHistory);
    }
  }, []);

  // Generate portfolio history
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioHistory(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: totalValue,
        }];
        return newData.slice(-20);
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalValue]);

  // Portfolio allocation
  const allocationData = positions.map(pos => ({
    name: pos.symbol,
    value: pos.currentPrice * pos.quantity,
  }));
  
  if (balance > 0) {
    allocationData.push({
      name: 'Cash',
      value: balance,
    });
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalValue.toFixed(2)}</div>
            <p className={`text-xs ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
              {totalProfit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {totalProfit >= 0 ? '+' : ''}{profitPercent}% from start
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${balance.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">
              {((balance / totalValue) * 100).toFixed(1)}% of portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Win Rate</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{winRate}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {winningTrades}W / {losingTrades}L
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Profit/Trade</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${parseFloat(avgProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${avgProfit}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {closedTrades.length} closed trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Value Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {allocationData.length > 0 ? (
              <div>
                <div style={{ width: '100%', height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {allocationData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-slate-900">
                        ${item.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-500">
                No positions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Open Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length > 0 ? (
            <div className="space-y-3">
              {positions.map(pos => {
                const profit = (pos.currentPrice - pos.entryPrice) * pos.quantity;
                const profitPercent = ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
                
                return (
                  <div key={pos.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">{pos.symbol}</div>
                      <div className="text-sm text-slate-500">
                        {pos.quantity} units @ ${pos.entryPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        ${pos.currentPrice.toFixed(2)}
                      </div>
                      <div className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No open positions. Go to Trading to start!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}