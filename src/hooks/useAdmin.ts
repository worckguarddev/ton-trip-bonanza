import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminCard {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  rarity: string; // Изменили на string вместо строгого типа
  is_available: boolean | null;
  benefits: any;
  created_at: string;
}

interface AdminUser {
  id: string;
  telegram_id: number;
  first_name: string;
  last_name: string | null;
  username: string | null;
  is_subscribed: boolean | null;
  created_at: string;
  wallet_address: string | null;
  wallet_chain: string | null;
  balance?: {
    rub_balance: number;
    ton_balance: number;
    bonus_points: number;
    total_earned: number;
    total_spent: number;
  };
  cards_count?: number;
  referrals_count?: number;
}

interface WithdrawalRequest {
  id: string;
  user_telegram_id: number;
  card_id: string;
  blockchain_address: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
  user_name?: string;
  card_title?: string;
  user_wallet_address?: string;
}

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Управление картами
  const createCard = async (cardData: {
    title: string;
    description: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    image_url?: string;
    benefits?: any;
  }) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bonus_cards')
        .insert([{
          ...cardData,
          is_available: true
        }]);

      if (error) throw error;
      
      toast.success('Карта успешно создана!');
      return true;
    } catch (err) {
      console.error('Error creating card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания карты';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (cardId: string, updates: Partial<AdminCard>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bonus_cards')
        .update(updates)
        .eq('id', cardId);

      if (error) throw error;
      
      toast.success('Карта обновлена!');
      return true;
    } catch (err) {
      console.error('Error updating card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления карты';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bonus_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;
      
      toast.success('Карта удалена!');
      return true;
    } catch (err) {
      console.error('Error deleting card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления карты';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAllCards = async (): Promise<AdminCard[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bonus_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching cards:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки карт';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Управление пользователями
  const getAllUsers = async (): Promise<AdminUser[]> => {
    try {
      setLoading(true);
      console.log('Загружаем пользователей...');
      
      // Получаем всех пользователей с их кошельками
      const { data: users, error: usersError } = await supabase
        .from('telegram_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Ошибка загрузки пользователей:', usersError);
        throw usersError;
      }

      console.log('Загружено пользователей:', users?.length || 0);

      if (!users || users.length === 0) {
        return [];
      }

      // Получаем балансы пользователей
      const { data: balances, error: balancesError } = await supabase
        .from('user_balances')
        .select('*');

      if (balancesError) {
        console.error('Ошибка загрузки балансов:', balancesError);
      }

      // Получаем количество карт у каждого пользователя
      const { data: userCards, error: cardsError } = await supabase
        .from('user_cards')
        .select('user_telegram_id');

      if (cardsError) {
        console.error('Ошибка загрузки карт пользователей:', cardsError);
      }

      // Получаем количество рефералов
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('referrer_telegram_id');

      if (referralsError) {
        console.error('Ошибка загрузки рефералов:', referralsError);
      }

      // Объединяем данные
      const enrichedUsers = users.map(user => {
        const balance = balances?.find(b => b.user_telegram_id === user.telegram_id);
        const cardsCount = userCards?.filter(c => c.user_telegram_id === user.telegram_id).length || 0;
        const referralsCount = referrals?.filter(r => r.referrer_telegram_id === user.telegram_id).length || 0;

        return {
          ...user,
          balance: balance ? {
            rub_balance: balance.rub_balance || 0,
            ton_balance: balance.ton_balance || 0,
            bonus_points: balance.bonus_points || 0,
            total_earned: balance.total_earned || 0,
            total_spent: balance.total_spent || 0,
          } : undefined,
          cards_count: cardsCount,
          referrals_count: referralsCount
        };
      });

      console.log('Обогащенные данные пользователей:', enrichedUsers);
      return enrichedUsers;
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки пользователей';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateUserBalance = async (telegramId: number, balanceType: 'rub_balance' | 'ton_balance' | 'bonus_points', amount: number) => {
    try {
      setLoading(true);
      
      // Получаем текущий баланс
      const { data: currentBalance } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_telegram_id', telegramId)
        .single();

      const updateData = {
        [balanceType]: (currentBalance?.[balanceType] || 0) + amount,
        updated_at: new Date().toISOString()
      };

      if (balanceType === 'bonus_points' && amount > 0) {
        updateData.total_earned = (currentBalance?.total_earned || 0) + amount;
      }

      const { error } = await supabase
        .from('user_balances')
        .upsert({
          user_telegram_id: telegramId,
          ...updateData
        });

      if (error) throw error;
      
      toast.success(`Баланс обновлен: +${amount} ${balanceType === 'rub_balance' ? 'рублей' : balanceType === 'ton_balance' ? 'TON' : 'бонусов'}`);
      return true;
    } catch (err) {
      console.error('Error updating balance:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления баланса';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Управление заявками на вывод
  const getWithdrawalRequests = async (): Promise<WithdrawalRequest[]> => {
    try {
      setLoading(true);
      console.log('Загружаем заявки на вывод...');
      
      const { data, error } = await supabase
        .from('user_cards')
        .select(`
          id,
          user_telegram_id,
          card_id,
          blockchain_address,
          purchased_at,
          is_withdrawn,
          bonus_cards (
            title
          ),
          telegram_users!user_cards_user_telegram_id_fkey (
            first_name,
            last_name,
            wallet_address
          )
        `)
        .eq('is_withdrawn', true)
        .not('blockchain_address', 'is', null);

      if (error) {
        console.error('Ошибка загрузки заявок:', error);
        throw error;
      }

      console.log('Загружено заявок на вывод:', data?.length || 0);

      const requests = (data || []).map(item => ({
        id: item.id,
        user_telegram_id: item.user_telegram_id,
        card_id: item.card_id,
        blockchain_address: item.blockchain_address || '',
        requested_at: item.purchased_at,
        status: 'pending' as const,
        user_name: item.telegram_users ? `${item.telegram_users.first_name} ${item.telegram_users.last_name || ''}`.trim() : 'Неизвестный',
        card_title: item.bonus_cards?.title || 'Неизвестная карта',
        user_wallet_address: item.telegram_users?.wallet_address || null
      }));

      console.log('Обработанные заявки:', requests);
      return requests;
    } catch (err) {
      console.error('Error fetching withdrawal requests:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки заявок';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const approveWithdrawal = async (requestId: string) => {
    try {
      setLoading(true);
      // Здесь можно добавить логику для реального вывода в блокчейн
      // Пока просто отмечаем как обработанную
      toast.success('Заявка на вывод одобрена');
      return true;
    } catch (err) {
      console.error('Error approving withdrawal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка одобрения заявки';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectWithdrawal = async (requestId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_cards')
        .update({
          is_withdrawn: false,
          blockchain_address: null
        })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Заявка на вывод отклонена');
      return true;
    } catch (err) {
      console.error('Error rejecting withdrawal:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отклонения заявки';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    // Cards management
    createCard,
    updateCard,
    deleteCard,
    getAllCards,
    // Users management
    getAllUsers,
    updateUserBalance,
    // Withdrawal management
    getWithdrawalRequests,
    approveWithdrawal,
    rejectWithdrawal
  };
};
