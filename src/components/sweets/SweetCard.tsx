import { Sweet } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  isPurchasing?: boolean;
}

export function SweetCard({ sweet, onPurchase, onEdit, onDelete, isPurchasing }: SweetCardProps) {
  const { isAdmin, user } = useAuth();
  const isOutOfStock = sweet.quantity === 0;
  const canEdit = isAdmin || sweet.created_by === user?.id;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      chocolate: 'bg-primary/20 text-primary',
      candy: 'bg-sweet-pink/20 text-sweet-pink',
      cake: 'bg-sweet-caramel/20 text-sweet-caramel',
      cookie: 'bg-accent/20 text-accent-foreground',
      ice_cream: 'bg-sweet-mint/20 text-sweet-mint',
      pastry: 'bg-sweet-berry/20 text-sweet-berry',
    };
    return colors[category.toLowerCase()] || 'bg-secondary text-secondary-foreground';
  };

  return (
    <Card className="sweet-card group overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-secondary">
        {sweet.image_url ? (
          <img
            src={sweet.image_url}
            alt={sweet.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
            {sweet.name}
          </h3>
          <Badge className={getCategoryColor(sweet.category)}>
            {sweet.category}
          </Badge>
        </div>
        {sweet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {sweet.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-accent">
            ${sweet.price.toFixed(2)}
          </span>
          <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
            {sweet.quantity} in stock
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="accent"
          className="flex-1"
          disabled={isOutOfStock || isPurchasing}
          onClick={() => onPurchase(sweet.id)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isPurchasing ? 'Processing...' : 'Purchase'}
        </Button>
        {canEdit && onEdit && (
          <Button variant="outline" size="icon" onClick={() => onEdit(sweet)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {isAdmin && onDelete && (
          <Button variant="destructive" size="icon" onClick={() => onDelete(sweet.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
