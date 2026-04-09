import { useTrading } from '../context/TradingContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function History() {
  const { trades } = useTrading();
  
  const closedTrades = trades.filter(t => t.status === 'closed');
  const openTrades = trades.filter(t => t.status === 'open');
  
  // Calculate daily profits
  const dailyProfits = closedTrades.reduce((acc, trade) => {
    if (!trade.exitTime) return acc;
    
    const date = new Date(trade.exitTime).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.profit += trade.profit || 0;
    } else {
      acc.push({ date, profit: trade.profit || 0 });
    }
    
    return acc;
  }, [] as { date: string; profit: number }[]);

  const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const winningTrades = closedTrades.filter(t => (t.profit || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.profit || 0) < 0);
  
  const avgWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / winningTrades.length
    : 0;
    
  const avgLoss = losingTrades.length > 0
    ? losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / losingTrades.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Trading History</h2>
        <p className="text-slate-500">Review your trading performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Trades</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{closedTrades.length}</div>
            <p className="text-xs text-slate-500 mt-1">
              {openTrades.length} currently open
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Profit/Loss</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From closed trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Win</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +${avgWin.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {winningTrades.length} winning trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Loss</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${avgLoss.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {losingTrades.length} losing trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profit Chart */}
      {dailyProfits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyProfits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trade History Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length > 0 ? (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Profit/Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.slice().reverse().map(trade => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(trade.entryTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {trade.exitTime ? new Date(trade.exitTime).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {trade.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {trade.profit !== undefined ? (
                          <span className={`font-semibold ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No trades yet. Start trading to see your history here!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}