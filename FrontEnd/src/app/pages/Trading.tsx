import { useTrading } from '../context/TradingContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CandlestickChart } from '../components/CandlestickChart';
import { TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Activity, Clock } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';

export function Trading() {
  const { assets, balance, buyAsset, sellAsset, positions } = useTrading();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBuy = (assetId: string) => {
    setSelectedAsset(assetId);
    setDialogOpen(true);
  };

  const confirmBuy = () => {
    if (selectedAsset && parseFloat(quantity) > 0) {
      buyAsset(selectedAsset, parseFloat(quantity));
      setDialogOpen(false);
      setQuantity('1');
    }
  };

  const asset = assets.find(a => a.id === selectedAsset);
  const estimatedCost = asset ? asset.price * parseFloat(quantity || '0') : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Live Trading</h2>
          <p className="text-slate-500 flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" />
            AI signals updated every hour
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assets.map(asset => {
          const position = positions.find(p => p.assetId === asset.id);
          
          return (
            <Card key={asset.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                    <p className="text-sm text-slate-500">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      ${asset.price.toFixed(asset.type === 'forex' ? 4 : 2)}
                    </div>
                    <div className={`text-sm font-medium flex items-center gap-1 justify-end ${
                      asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {/* AI Signal */}
                <div className="mb-4 p-3 rounded-lg bg-slate-50 border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">AI Signal</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      asset.signal === 'buy' ? 'bg-green-100 text-green-700' :
                      asset.signal === 'sell' ? 'bg-red-100 text-red-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {asset.signal.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          asset.signal === 'buy' ? 'bg-green-500' :
                          asset.signal === 'sell' ? 'bg-red-500' :
                          'bg-slate-400'
                        }`}
                        style={{ width: `${asset.signalStrength}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{asset.signalStrength}%</span>
                  </div>
                </div>

                {/* Candlestick Chart */}
                <div className="mb-4">
                  <CandlestickChart data={asset.chartData} height={180} />
                </div>

                {/* Actions */}
                {position ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-blue-900 font-medium">Your Position</span>
                        <span className="text-sm font-semibold text-blue-900">
                          {position.quantity} units
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-blue-700">
                        <span>Entry: ${position.entryPrice.toFixed(2)}</span>
                        <span className={
                          (position.currentPrice - position.entryPrice) >= 0 ? 'text-green-600' : 'text-red-600'
                        }>
                          P/L: ${((position.currentPrice - position.entryPrice) * position.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => sellAsset(position.id)}
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <ArrowDownCircle className="w-4 h-4 mr-2" />
                      Sell Position
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleBuy(asset.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Buy {asset.symbol}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Buy Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {asset?.symbol}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Price per unit:</span>
                <span className="font-medium">${asset?.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Estimated cost:</span>
                <span className="font-bold text-slate-900">${estimatedCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Available balance:</span>
                <span className={`font-medium ${estimatedCost > balance ? 'text-red-600' : 'text-green-600'}`}>
                  ${balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBuy}
              disabled={estimatedCost > balance || parseFloat(quantity) <= 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm Buy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}