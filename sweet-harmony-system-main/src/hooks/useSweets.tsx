import { useState, useEffect } from 'react';
import { Sweet, SweetFormData } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export function useSweets() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchSweets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sweets`);
      if (!response.ok) throw new Error('Failed to fetch sweets');
      const data = await response.json();
      setSweets(data);
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
      const response = await fetch(`${API_BASE_URL}/sweets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sweetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setSweets(prev => [data, ...prev]);
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
      const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(sweetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setSweets(prev => prev.map(s => s.id === id ? data : s));
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
      const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

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
        description: 'Failed to delete sweet',
        variant: 'destructive'
      });
      return { error: error as Error };
    }
  };

  const purchaseSweet = async (sweetId: string, quantity: number = 1) => {
    if (!user) return { error: new Error('Not authenticated') };

    const sweet = sweets.find(s => s.id === sweetId);
    if (!sweet) return { error: new Error('Sweet not found') };
    if (sweet.quantity < quantity) return { error: new Error('Not enough stock') };

    try {
      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          sweet_id: sweetId,
          quantity,
          total_price: sweet.price * quantity
        });

      if (purchaseError) throw purchaseError;

      // Update sweet quantity
      const { error: updateError } = await supabase
        .from('sweets')
        .update({ quantity: sweet.quantity - quantity })
        .eq('id', sweetId);

      if (updateError) throw updateError;

      setSweets(prev => prev.map(s => 
        s.id === sweetId ? { ...s, quantity: s.quantity - quantity } : s
      ));

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
