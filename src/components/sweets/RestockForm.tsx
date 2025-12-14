import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sweet } from '@/types/database';
import { Package } from 'lucide-react';

interface RestockFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet | null;
  onRestock: (id: string, amount: number) => Promise<{ error: Error | null }>;
}

export function RestockForm({ open, onOpenChange, sweet, onRestock }: RestockFormProps) {
  const [amount, setAmount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sweet || amount <= 0) return;

    setIsSubmitting(true);
    const { error } = await onRestock(sweet.id, amount);
    setIsSubmitting(false);

    if (!error) {
      onOpenChange(false);
      setAmount(10);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            Restock {sweet?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Current stock</p>
            <p className="font-display text-2xl font-bold text-foreground">
              {sweet?.quantity} units
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Add quantity</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="sweet-input"
            />
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
            <p className="text-sm text-muted-foreground">New stock will be</p>
            <p className="font-display text-2xl font-bold text-accent">
              {(sweet?.quantity || 0) + amount} units
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isSubmitting || amount <= 0}>
              {isSubmitting ? 'Restocking...' : 'Restock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
