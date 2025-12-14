import { useState, useEffect } from 'react';
import { Purchase } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';

export function useOrderHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchPurchases = async () => {
    try {
      const stored = localStorage.getItem('purchases');
      let purchasesData: Purchase[] = [];

      if (stored) {
        purchasesData = JSON.parse(stored);
        // Filter purchases for current user
        if (user) {
          purchasesData = purchasesData.filter(p => p.user_id === user.id);
        }
      }

      setPurchases(purchasesData);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  return {
    purchases,
    isLoading,
    refetch: fetchPurchases
  };
}