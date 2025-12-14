import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { useSweets } from '@/hooks/useSweets';
import { Loader2, ShoppingBag, Calendar, DollarSign, Package } from 'lucide-react';

export default function OrderHistory() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { purchases, isLoading } = useOrderHistory();
  const { sweets } = useSweets();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const orderHistory = useMemo(() => {
    return purchases.map(purchase => {
      const sweet = sweets.find(s => s.id === purchase.sweet_id);
      return {
        ...purchase,
        sweet
      };
    }).sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());
  }, [purchases, sweets]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Order History
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track all your successful purchases
          </p>
        </div>

        {orderHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
            <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
              No orders yet
            </h3>
            <p className="mt-2 text-muted-foreground">
              Your purchase history will appear here once you make your first order.
            </p>
            <Button variant="default" className="mt-4" onClick={() => navigate('/dashboard')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orderHistory.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-32 w-full sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden bg-secondary">
                    {order.sweet?.image_url ? (
                      <img
                        src={order.sweet.image_url}
                        alt={order.sweet.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {order.sweet?.name || 'Unknown Item'}
                        </CardTitle>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.purchased_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Quantity:</span>
                          <span className="font-medium">{order.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Unit Price:</span>
                          <span className="font-medium">${order.sweet?.price.toFixed(2) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Total:</span>
                          <span className="font-bold text-lg">${order.total_price.toFixed(2)}</span>
                        </div>
                      </div>
                      {order.sweet?.category && (
                        <div className="mt-4">
                          <Badge variant="outline">{order.sweet.category}</Badge>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}