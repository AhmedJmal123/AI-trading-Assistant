import { Outlet, NavLink } from 'react-router';
import { LayoutDashboard, TrendingUp, History, Wallet, Settings } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { Button } from './ui/button';
import { SetBalanceDialog } from './SetBalanceDialog';
import { useState } from 'react';

export function Layout() {
  const { balance, portfolioValue, setBalance } = useTrading();
  const totalValue = balance + portfolioValue;
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI Trading Assistant</h1>
                <p className="text-xs text-slate-500">Smart signals, simple trading</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-500">Total Value</div>
                <div className="text-lg font-bold text-slate-900">${totalValue.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Available Balance</div>
                <div className="text-lg font-bold text-green-600">${balance.toFixed(2)}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBalanceDialogOpen(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Set Balance
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-6 mt-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/trading"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <TrendingUp className="w-4 h-4" />
              Trading
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <History className="w-4 h-4" />
              History
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>

      <SetBalanceDialog
        open={balanceDialogOpen}
        onOpenChange={setBalanceDialogOpen}
        onSetBalance={setBalance}
        currentBalance={balance}
      />
    </div>
  );
}