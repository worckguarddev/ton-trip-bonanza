
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Balance {
  id: string;
  ton_balance: number | null;
  bonus_points: number | null;
  total_earned: number | null;
  total_spent: number | null;
  updated_at: string;
}

export const useBalance = () => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async (telegramId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_telegram_id', telegramId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (!data) {
        // Создаем баланс если его нет
        const { data: newBalance, error: insertError } = await supabase
          .from('user_balances')
          .insert({
            user_telegram_id: telegramId,
            ton_balance: 0,
            bonus_points: 0,
            total_earned: 0,
            total_spent: 0
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setBalance(newBalance);
      } else {
        setBalance(data);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки баланса');
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async (telegramId: number, updates: Partial<Omit<Balance, 'id' | 'updated_at'>>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_balances')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_telegram_id', telegramId)
        .select()
        .single();

      if (error) throw error;
      
      setBalance(data);
      toast.success('Баланс обновлен');
      return data;
    } catch (err) {
      console.error('Error updating balance:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления баланса';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    balance,
    loading,
    error,
    fetchBalance,
    updateBalance
  };
};
