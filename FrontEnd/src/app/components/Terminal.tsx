import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface Position {
  ticket: number;
  time: string;
  type: string;
  volume: number;
  symbol: string;
  price: number;
  sl: number;
  tp: number;
  currentPrice: number;
  profit: number;
}

const mockPositions: Position[] = [
  {
    ticket: 15234567,
    time: '2026-03-29 14:23:45',
    type: 'buy',
    volume: 1.00,
    symbol: 'EURUSD',
    price: 1.08523,
    sl: 1.08200,
    tp: 1.09000,
    currentPrice: 1.08558,
    profit: 35.00,
  },
  {
    ticket: 15234568,
    time: '2026-03-29 13:15:32',
    type: 'sell',
    volume: 0.50,
    symbol: 'GBPUSD',
    price: 1.26280,
    sl: 1.26500,
    tp: 1.26000,
    currentPrice: 1.26251,
    profit: 14.50,
  },
];

const mockHistory = [
  {
    ticket: 15234560,
    openTime: '2026-03-29 10:15:22',
    closeTime: '2026-03-29 12:45:10',
    type: 'buy',
    volume: 1.00,
    symbol: 'USDJPY',
    openPrice: 149.750,
    closePrice: 149.832,
    profit: 82.00,
  },
  {
    ticket: 15234559,
    openTime: '2026-03-29 09:30:15',
    closeTime: '2026-03-29 11:20:45',
    type: 'sell',
    volume: 0.75,
    symbol: 'AUDUSD',
    openPrice: 0.63900,
    closePrice: 0.63853,
    profit: 35.25,
  },
];

export function Terminal() {
  return (
    <div className="flex flex-col h-full bg-zinc-900 border-t border-zinc-800">
      <Tabs defaultValue="positions" className="flex flex-col h-full">
        <TabsList className="mx-3 mt-3 justify-start">
          <TabsTrigger value="positions">Trade</TabsTrigger>
          <TabsTrigger value="history">Account History</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="flex-1 overflow-auto p-3">
          <div className="bg-zinc-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-700 hover:bg-zinc-800">
                  <TableHead className="text-zinc-300">Ticket</TableHead>
                  <TableHead className="text-zinc-300">Time</TableHead>
                  <TableHead className="text-zinc-300">Type</TableHead>
                  <TableHead className="text-zinc-300">Volume</TableHead>
                  <TableHead className="text-zinc-300">Symbol</TableHead>
                  <TableHead className="text-zinc-300">Price</TableHead>
                  <TableHead className="text-zinc-300">S/L</TableHead>
                  <TableHead className="text-zinc-300">T/P</TableHead>
                  <TableHead className="text-zinc-300">Current</TableHead>
                  <TableHead className="text-zinc-300">Profit</TableHead>
                  <TableHead className="text-zinc-300"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPositions.map((position) => (
                  <TableRow key={position.ticket} className="border-zinc-700 hover:bg-zinc-700/50">
                    <TableCell className="text-zinc-300 font-mono text-xs">{position.ticket}</TableCell>
                    <TableCell className="text-zinc-400 text-xs">{position.time}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        position.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {position.type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-300 text-xs">{position.volume.toFixed(2)}</TableCell>
                    <TableCell className="text-zinc-100 font-medium text-xs">{position.symbol}</TableCell>
                    <TableCell className="text-zinc-300 text-xs">{position.price.toFixed(5)}</TableCell>
                    <TableCell className="text-zinc-400 text-xs">{position.sl.toFixed(5)}</TableCell>
                    <TableCell className="text-zinc-400 text-xs">{position.tp.toFixed(5)}</TableCell>
                    <TableCell className="text-zinc-300 text-xs">{position.currentPrice.toFixed(5)}</TableCell>
                    <TableCell className={`font-semibold text-xs ${
                      position.profit >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {position.profit >= 0 ? '+' : ''}${position.profit.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-zinc-400 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-auto p-3">
          <div className="bg-zinc-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-700 hover:bg-zinc-800">
                  <TableHead className="text-zinc-300">Ticket</TableHead>
                  <TableHead className="text-zinc-300">Open Time</TableHead>
                  <TableHead className="text-zinc-300">Close Time</TableHead>
                  <TableHead className="text-zinc-300">Type</TableHead>
                  <TableHead className="text-zinc-300">Volume</TableHead>
                  <TableHead className="text-zinc-300">Symbol</TableHead>
                  <TableHead className="text-zinc-300">Open Price</TableHead>
                  <TableHead className="text-zinc-300">Close Price</TableHead>
                  <TableHead className="text-zinc-300">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((trade) => (
                  <TableRow key={trade.ticket} className="border-zinc-700 hover:bg-zinc-700/50">
                    <TableCell className="text-zinc-300 font-mono text-xs">{trade.ticket}</TableCell>
                    <TableCell className="text-zinc-400 text-xs">{trade.openTime}</TableCell>
                    <TableCell className="text-zinc-400 text-xs">{trade.closeTime}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-300 text-xs">{trade.volume.toFixed(2)}</TableCell>
                    <TableCell className="text-zinc-100 font-medium text-xs">{trade.symbol}</TableCell>
                    <TableCell className="text-zinc-300 text-xs">{trade.openPrice.toFixed(5)}</TableCell>
                    <TableCell className="text-zinc-300 text-xs">{trade.closePrice.toFixed(5)}</TableCell>
                    <TableCell className={`font-semibold text-xs ${
                      trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 p-3">
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            No alerts set
          </div>
        </TabsContent>

        <TabsContent value="journal" className="flex-1 p-3">
          <div className="bg-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-400 space-y-1">
            <div>2026.03.29 14:23:45 Order #15234567 buy 1.00 EURUSD at 1.08523</div>
            <div>2026.03.29 13:15:32 Order #15234568 sell 0.50 GBPUSD at 1.26280</div>
            <div className="text-green-500">2026.03.29 12:45:10 Position #15234560 closed: profit +$82.00</div>
            <div className="text-green-500">2026.03.29 11:20:45 Position #15234559 closed: profit +$35.25</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
