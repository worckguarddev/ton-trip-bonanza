
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
}

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = async (telegramId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .or(`referrer_telegram_id.eq.${telegramId},referred_telegram_id.eq.${telegramId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Safely cast the status type
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
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_telegram_id: referrerTelegramId,
          referred_telegram_id: referredTelegramId,
          bonus_amount: 100, // Бонус за реферала
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Реферал добавлен!');
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
