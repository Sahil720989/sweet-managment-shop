import { useState, useEffect } from 'react';
import { Sweet, SweetFormData } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function useSweets() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSweets = async () => {
    try {
      const stored = localStorage.getItem('sweets');
      let sweetsData: Sweet[] = [];

      if (stored) {
        sweetsData = JSON.parse(stored);
      } else {
        // Add dummy data
        const dummySweets: Sweet[] = [
          { id: '1', name: 'Chocolate Cake', category: 'Cake', price: 25.00, quantity: 10, description: 'Rich and moist chocolate cake', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '2', name: 'Vanilla Cupcake', category: 'Cupcake', price: 5.00, quantity: 20, description: 'Classic vanilla cupcake with frosting', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '3', name: 'Strawberry Ice Cream', category: 'Ice Cream', price: 4.50, quantity: 15, description: 'Creamy strawberry flavored ice cream', image_url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '4', name: 'Lemon Tart', category: 'Tart', price: 8.00, quantity: 8, description: 'Tangy lemon tart with a buttery crust', image_url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '5', name: 'Caramel Popcorn', category: 'Snack', price: 3.00, quantity: 25, description: 'Sweet and crunchy caramel coated popcorn', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '6', name: 'Red Velvet Cookies', category: 'Cookie', price: 2.50, quantity: 30, description: 'Soft red velvet cookies with cream cheese frosting', image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '7', name: 'Mint Chocolate Chip Ice Cream', category: 'Ice Cream', price: 4.50, quantity: 12, description: 'Refreshing mint ice cream with chocolate chips', image_url: 'https://images.unsplash.com/photo-1541599468348-e96984315621?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '8', name: 'Apple Pie', category: 'Pie', price: 15.00, quantity: 5, description: 'Traditional apple pie with cinnamon', image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '9', name: 'Blueberry Muffins', category: 'Muffin', price: 3.50, quantity: 18, description: 'Fluffy muffins packed with blueberries', image_url: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '10', name: 'Chocolate Truffles', category: 'Chocolate', price: 6.00, quantity: 22, description: 'Handmade chocolate truffles', image_url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop', created_by: 'dummy', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ];
        localStorage.setItem('sweets', JSON.stringify(dummySweets));
        sweetsData = dummySweets;
      }

      setSweets(sweetsData);
    } catch (error) {
      console.error('Error fetching sweets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sweets',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSweets();
    }
  }, [user]);

  const addSweet = async (sweetData: SweetFormData) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('sweets')
        .insert({
          ...sweetData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSweets(prev => [data as Sweet, ...prev]);
      toast({
        title: 'Success',
        description: `${sweetData.name} has been added to the shop!`
      });
      return { error: null };
    } catch (error) {
      console.error('Error adding sweet:', error);
      toast({
        title: 'Error',
        description: 'Failed to add sweet',
        variant: 'destructive'
      });
      return { error: error as Error };
    }
  };

  const updateSweet = async (id: string, sweetData: Partial<SweetFormData>) => {
    try {
      const { data, error } = await supabase
        .from('sweets')
        .update(sweetData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSweets(prev => prev.map(s => s.id === id ? (data as Sweet) : s));
      toast({
        title: 'Success',
        description: 'Sweet updated successfully'
      });
      return { error: null };
    } catch (error) {
      console.error('Error updating sweet:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sweet',
        variant: 'destructive'
      });
      return { error: error as Error };
    }
  };

  const deleteSweet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSweets(prev => prev.filter(s => s.id !== id));
      toast({
        title: 'Success',
        description: 'Sweet deleted successfully'
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting sweet:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete sweet. Only admins can delete sweets.',
        variant: 'destructive'
      });
      return { error: error as Error };
    }
  };

  const purchaseSweet = async (sweetId: string, quantity: number = 1) => {
    const sweet = sweets.find(s => s.id === sweetId);
    if (!sweet) return { error: new Error('Sweet not found') };
    if (sweet.quantity < quantity) return { error: new Error('Not enough stock') };

    try {
      const updatedSweets = sweets.map(s =>
        s.id === sweetId ? { ...s, quantity: s.quantity - quantity, updated_at: new Date().toISOString() } : s
      );
      localStorage.setItem('sweets', JSON.stringify(updatedSweets));
      setSweets(updatedSweets);

      // Record the purchase
      const purchase = {
        id: Date.now().toString(),
        user_id: user?.id || 'anonymous',
        sweet_id: sweetId,
        quantity,
        total_price: sweet.price * quantity,
        purchased_at: new Date().toISOString()
      };

      const existingPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      existingPurchases.push(purchase);
      localStorage.setItem('purchases', JSON.stringify(existingPurchases));

      toast({
        title: 'Purchase Complete!',
        description: `You bought ${quantity} ${sweet.name}${quantity > 1 ? 's' : ''}`
      });
      return { error: null };
    } catch (error) {
      console.error('Error purchasing sweet:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete purchase',
        variant: 'destructive'
      });
      return { error: error as Error };
    }
  };

  const restockSweet = async (id: string, amount: number) => {
    const sweet = sweets.find(s => s.id === id);
    if (!sweet) return { error: new Error('Sweet not found') };

    return updateSweet(id, { quantity: sweet.quantity + amount });
  };

  return {
    sweets,
    isLoading,
    addSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
    refetch: fetchSweets
  };
}
