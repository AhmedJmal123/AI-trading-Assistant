import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function OrderEntry({ symbol }: { symbol: string }) {
  const [volume, setVolume] = useState('1.00');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const handleBuy = () => {
    console.log('Buy order:', { symbol, volume, stopLoss, takeProfit });
  };

  const handleSell = () => {
    console.log('Sell order:', { symbol, volume, stopLoss, takeProfit });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
      <div className="p-3 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-200">Order Entry</h3>
      </div>
      
      <Tabs defaultValue="market" className="flex-1 flex flex-col">
        <TabsList className="mx-3 mt-3">
          <TabsTrigger value="market" className="flex-1">Market</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="flex-1 p-3 space-y-3">
          <div className="bg-zinc-800 p-3 rounded">
            <div className="text-xs text-zinc-400 mb-1">Symbol</div>
            <div className="text-lg font-semibold text-zinc-100">{symbol}</div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Volume (Lots)</Label>
            <Input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              step="0.01"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Stop Loss</Label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Optional"
              step="0.00001"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Take Profit</Label>
            <Input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Optional"
              step="0.00001"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleBuy}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              BUY
            </Button>
            <Button 
              onClick={handleSell}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              SELL
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="flex-1 p-3 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Order Type</Label>
            <select className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 text-sm">
              <option>Buy Limit</option>
              <option>Sell Limit</option>
              <option>Buy Stop</option>
              <option>Sell Stop</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Price</Label>
            <Input
              type="number"
              placeholder="Enter price"
              step="0.00001"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Volume (Lots)</Label>
            <Input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              step="0.01"
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Place Order
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
