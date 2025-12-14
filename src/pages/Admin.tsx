import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { RestockForm } from '@/components/sweets/RestockForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSweets } from '@/hooks/useSweets';
import { Sweet } from '@/types/database';
import { Package, DollarSign, ShoppingBag, AlertTriangle, Plus, Loader2 } from 'lucide-react';

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { sweets, isLoading, restockSweet } = useSweets();

  const [restockSweet_, setRestockSweet] = useState<Sweet | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const stats = {
    totalSweets: sweets.length,
    totalValue: sweets.reduce((sum, s) => sum + s.price * s.quantity, 0),
    lowStock: sweets.filter(s => s.quantity < 10 && s.quantity > 0).length,
    outOfStock: sweets.filter(s => s.quantity === 0).length,
  };

  const handleRestock = (sweet: Sweet) => {
    setRestockSweet(sweet);
    setIsRestockOpen(true);
  };

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
            Admin Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage inventory and monitor stock levels
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="sweet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">{stats.totalSweets}</div>
            </CardContent>
          </Card>

          <Card className="sweet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inventory Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold">
                ${stats.totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="sweet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-sweet-caramel" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold text-sweet-caramel">
                {stats.lowStock}
              </div>
            </CardContent>
          </Card>

          <Card className="sweet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </CardTitle>
              <Package className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl font-bold text-destructive">
                {stats.outOfStock}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card className="sweet-card">
          <CardHeader>
            <CardTitle className="font-display">Inventory Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sweets.map((sweet) => (
                  <TableRow key={sweet.id}>
                    <TableCell className="font-medium">{sweet.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{sweet.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${sweet.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          sweet.quantity === 0
                            ? 'destructive'
                            : sweet.quantity < 10
                            ? 'outline'
                            : 'secondary'
                        }
                      >
                        {sweet.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestock(sweet)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <RestockForm
          open={isRestockOpen}
          onOpenChange={setIsRestockOpen}
          sweet={restockSweet_}
          onRestock={restockSweet}
        />
      </main>
    </div>
  );
}
