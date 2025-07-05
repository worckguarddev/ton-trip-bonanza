
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
      setAvailableCards(data || []);
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
      
      const transformedData = data?.map(item => ({
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
        rarity: item.bonus_cards.rarity,
        is_available: true,
        benefits: item.bonus_cards.benefits
      })) || [];

      setUserCards(transformedData);
    } catch (err) {
      console.error('Error fetching user cards:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки карт пользователя');
    } finally {
      setLoading(false);
    }
  };

  const purchaseCard = async (cardId: string, telegramId: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_cards')
        .insert({
          user_telegram_id: telegramId,
          card_id: cardId
        });

      if (error) throw error;
      
      toast.success('Карта успешно приобретена!');
      await fetchUserCards(telegramId);
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
      rentUntil.setDate(rentUntil.getDate() + 30); // Аренда на 30 дней

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
