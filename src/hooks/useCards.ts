
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BonusCard {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  is_available: boolean | null;
  benefits: any;
}

interface UserCard extends BonusCard {
  user_card_id: string;
  purchased_at: string;
  is_rented: boolean | null;
  rent_price: number | null;
  is_withdrawn: boolean | null;
}

export const useCards = () => {
  const [availableCards, setAvailableCards] = useState<BonusCard[]>([]);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableCards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bonus_cards')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(card => ({
        ...card,
        rarity: card.rarity as 'common' | 'rare' | 'epic' | 'legendary'
      }));
      
      setAvailableCards(typedData);
    } catch (err) {
      console.error('Error fetching available cards:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки карт');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCards = async (telegramId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_cards')
        .select(`
          id,
          purchased_at,
          is_rented,
          rent_price,
          is_withdrawn,
          bonus_cards (
            id,
            title,
            description,
            image_url,
            price,
            rarity,
            benefits
          )
        `)
        .eq('user_telegram_id', telegramId);

      if (error) throw error;
      
      const transformedData = (data || []).map(item => ({
        user_card_id: item.id,
        purchased_at: item.purchased_at,
        is_rented: item.is_rented,
        rent_price: item.rent_price,
        is_withdrawn: item.is_withdrawn,
        id: item.bonus_cards.id,
        title: item.bonus_cards.title,
        description: item.bonus_cards.description,
        image_url: item.bonus_cards.image_url,
        price: item.bonus_cards.price,
        rarity: item.bonus_cards.rarity as 'common' | 'rare' | 'epic' | 'legendary',
        is_available: true,
        benefits: item.bonus_cards.benefits
      }));

      setUserCards(transformedData);
    } catch (err) {
      console.error('Error fetching user cards:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки карт пользователя');
    } finally {
      setLoading(false);
    }
  };

  const purchaseCard = async (cardId: string, telegramId: number, cardPrice: number) => {
    try {
      setLoading(true);
      
      console.log('Начало покупки карты:', { cardId, telegramId, cardPrice });
      
      // Сначала проверяем текущий баланс
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_balances')
        .select('rub_balance, total_spent')
        .eq('user_telegram_id', telegramId)
        .single();

      if (balanceError) {
        console.error('Ошибка получения баланса:', balanceError);
        throw new Error('Не удалось получить баланс пользователя');
      }

      const currentBalance = balanceData?.rub_balance || 0;
      console.log('Текущий баланс:', currentBalance, 'Цена карты:', cardPrice);

      if (currentBalance < cardPrice) {
        toast.error('Недостаточно средств на балансе');
        return false;
      }

      // Покупаем карту
      const { error: purchaseError } = await supabase
        .from('user_cards')
        .insert({
          user_telegram_id: telegramId,
          card_id: cardId
        });

      if (purchaseError) {
        console.error('Ошибка покупки карты:', purchaseError);
        throw purchaseError;
      }

      console.log('Карта успешно добавлена в user_cards');

      // Обновляем баланс пользователя
      const newBalance = currentBalance - cardPrice;
      const newTotalSpent = (balanceData?.total_spent || 0) + cardPrice;

      const { error: updateError } = await supabase
        .from('user_balances')
        .update({
          rub_balance: newBalance,
          total_spent: newTotalSpent,
          updated_at: new Date().toISOString()
        })
        .eq('user_telegram_id', telegramId);

      if (updateError) {
        console.error('Ошибка обновления баланса:', updateError);
        throw updateError;
      }

      console.log('Баланс успешно обновлен:', { newBalance, newTotalSpent });
      
      toast.success('Карта успешно приобретена за ' + cardPrice + ' рублей!');
      return true;
    } catch (err) {
      console.error('Error purchasing card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка покупки карты';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rentCard = async (userCardId: string, rentPrice: number) => {
    try {
      setLoading(true);
      const rentUntil = new Date();
      rentUntil.setDate(rentUntil.getDate() + 30);

      const { error } = await supabase
        .from('user_cards')
        .update({
          is_rented: true,
          rent_price: rentPrice,
          rent_until: rentUntil.toISOString()
        })
        .eq('id', userCardId);

      if (error) throw error;
      
      toast.success('Карта выставлена на аренду!');
      return true;
    } catch (err) {
      console.error('Error renting card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка выставления на аренду';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const withdrawCard = async (userCardId: string, blockchainAddress: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_cards')
        .update({
          is_withdrawn: true,
          blockchain_address: blockchainAddress
        })
        .eq('id', userCardId);

      if (error) throw error;
      
      toast.success('Заявка на вывод отправлена администратору');
      return true;
    } catch (err) {
      console.error('Error withdrawing card:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка вывода карты';
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    availableCards,
    userCards,
    loading,
    error,
    fetchAvailableCards,
    fetchUserCards,
    purchaseCard,
    rentCard,
    withdrawCard
  };
};
