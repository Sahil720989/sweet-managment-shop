import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SweetCard } from '@/components/sweets/SweetCard';
import { SweetFilters } from '@/components/sweets/SweetFilters';
import { SweetForm } from '@/components/sweets/SweetForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSweets } from '@/hooks/useSweets';
import { Sweet, SweetFormData } from '@/types/database';
import { Plus, Loader2, Package } from 'lucide-react';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { sweets, isLoading, addSweet, updateSweet, deleteSweet, purchaseSweet } = useSweets();

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const categories = useMemo(() => {
    const cats = [...new Set(sweets.map(s => s.category))];
    return cats.sort();
  }, [sweets]);

  const filteredSweets = useMemo(() => {
    return sweets.filter(sweet => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!sweet.name.toLowerCase().includes(search) &&
            !sweet.category.toLowerCase().includes(search) &&
            !(sweet.description?.toLowerCase().includes(search))) {
          return false;
        }
      }

      // Category filter
      if (category !== 'all' && sweet.category !== category) {
        return false;
      }

      // Price range filter
      if (priceRange !== 'all') {
        const price = sweet.price;
        switch (priceRange) {
          case '0-5':
            if (price >= 5) return false;
            break;
          case '5-10':
            if (price < 5 || price >= 10) return false;
            break;
          case '10-20':
            if (price < 10 || price >= 20) return false;
            break;
          case '20+':
            if (price < 20) return false;
            break;
        }
      }

      return true;
    });
  }, [sweets, searchTerm, category, priceRange]);

  const handlePurchase = async (id: string) => {
    setPurchasingId(id);
    await purchaseSweet(id);
    setPurchasingId(null);
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: SweetFormData) => {
    if (editingSweet) {
      return updateSweet(editingSweet.id, data);
    }
    return addSweet(data);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingSweet(null);
    }
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Sweet Shop
            </h1>
            <p className="mt-1 text-muted-foreground">
              Discover our handcrafted confectionery
            </p>
          </div>
          <Button variant="accent" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sweet
          </Button>
        </div>

        <div className="mb-6">
          <SweetFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            category={category}
            onCategoryChange={setCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            categories={categories}
          />
        </div>

        {filteredSweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/40" />
            <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
              No sweets found
            </h3>
            <p className="mt-2 text-muted-foreground">
              {sweets.length === 0
                ? 'Add your first sweet to get started!'
                : 'Try adjusting your search or filters'}
            </p>
            {sweets.length === 0 && (
              <Button variant="accent" className="mt-4" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Sweet
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSweets.map((sweet, index) => (
              <div
                key={sweet.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SweetCard
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  onEdit={handleEdit}
                  onDelete={deleteSweet}
                  isPurchasing={purchasingId === sweet.id}
                />
              </div>
            ))}
          </div>
        )}

        <SweetForm
          open={isFormOpen}
          onOpenChange={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingSweet}
          title={editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
        />
      </main>
    </div>
  );
}
