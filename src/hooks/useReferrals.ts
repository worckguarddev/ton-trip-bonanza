
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Referral {
  id: string;
  referrer_telegram_id: number;
  referred_telegram_id: number;
  bonus_amount: number | null;
  status: 'pending' | 'active' | 'rewarded';
  created_at: string;
  referred_user?: {
    first_name: string;
    last_name?: string;
    username?: string;
  };
}

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = async (telegramId: number) => {
    try {
      setLoading(true);
      
      // Сначала создаем пользователя если его нет
      await supabase.rpc('create_user_if_not_exists', {
        telegram_id_param: telegramId,
        first_name_param: 'User',
        last_name_param: null,
        username_param: null
      });

      // Получаем рефералов где пользователь является рефереррм
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_user:telegram_users!referrals_referred_telegram_id_fkey(
            first_name,
            last_name,
            username
          )
        `)
        .eq('referrer_telegram_id', telegramId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        // Если ошибка с join, получаем данные без join
        const { data: simpleData, error: simpleError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_telegram_id', telegramId)
          .order('created_at', { ascending: false });

        if (simpleError) throw simpleError;
        
        const typedData = (simpleData || []).map(referral => ({
          ...referral,
          status: referral.status as 'pending' | 'active' | 'rewarded'
        }));
        
        setReferrals(typedData);
        return;
      }
      
      const typedData = (data || []).map(referral => ({
        ...referral,
        status: referral.status as 'pending' | 'active' | 'rewarded'
      }));
      
      setReferrals(typedData);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки рефералов');
    } finally {
      setLoading(false);
    }
  };

  const createReferral = async (referrerTelegramId: number, referredTelegramId: number) => {
    try {
      setLoading(true);
      
      // Создаем оба пользователя если они не существуют
      await supabase.rpc('create_user_if_not_exists', {
        telegram_id_param: referrerTelegramId,
        first_name_param: 'Referrer',
        last_name_param: null,
        username_param: null
      });

      await supabase.rpc('create_user_if_not_exists', {
        telegram_id_param: referredTelegramId,
        first_name_param: 'Referred',
        last_name_param: null,
        username_param: null
      });

      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_telegram_id: referrerTelegramId,
          referred_telegram_id: referredTelegramId,
          bonus_amount: 100,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      // Получаем текущий баланс реферера
      const { data: currentBalance } = await supabase
        .from('user_balances')
        .select('bonus_points, total_earned')
        .eq('user_telegram_id', referrerTelegramId)
        .single();

      // Начисляем бонус рефереру
      const { error: bonusError } = await supabase
        .from('user_balances')
        .update({
          bonus_points: (currentBalance?.bonus_points || 0) + 100,
          total_earned: (currentBalance?.total_earned || 0) + 100
        })
        .eq('user_telegram_id', referrerTelegramId);

      if (bonusError) {
        console.error('Error updating referrer balance:', bonusError);
      }
      
      toast.success('Реферал добавлен! Вы получили 100 бонусов.');
      return data;
    } catch (err) {
      console.error('Error creating referral:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания реферала';
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = (telegramId: number) => {
    return `https://t.me/TonTripBonanza_bot?start=ref_${telegramId}`;
  };

  return {
    referrals,
    loading,
    error,
    fetchReferrals,
    createReferral,
    generateReferralLink
  };
};
