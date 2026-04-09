import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';

interface SetBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetBalance: (balance: number) => void;
  currentBalance: number;
}

export function SetBalanceDialog({ open, onOpenChange, onSetBalance, currentBalance }: SetBalanceDialogProps) {
  const [balance, setBalance] = useState(currentBalance.toString());

  const handleSubmit = () => {
    const amount = parseFloat(balance);
    if (amount > 0) {
      onSetBalance(amount);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Starting Balance</DialogTitle>
          <DialogDescription>
            Enter the amount you want to start trading with
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="balance">Balance Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="balance"
                type="number"
                min="0"
                step="100"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="pl-10"
                placeholder="10000"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={parseFloat(balance) <= 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Set Balance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
