
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReferralLink {
  id: string;
  referrer_telegram_id: number;
  referred_telegram_id: number;
  start_param: string;
  created_at: string;
  processed: boolean;
}

export const useReferralSystem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получение start параметра из Telegram WebApp
  const getStartParam = (): string | null => {
    try {
      if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
        return window.Telegram.WebApp.initDataUnsafe.start_param;
      }
      
      // Альтернативный способ получения из URL
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('tgWebAppStartParam');
    } catch (error) {
      console.error('Error getting start param:', error);
      return null;
    }
  };

  // Парсинг реферального кода из start параметра
  const parseReferralCode = (startParam: string): number | null => {
    try {
      // Ожидаем формат: ref_123456789
      if (startParam.startsWith('ref_')) {
        const referrerId = parseInt(startParam.replace('ref_', ''), 10);
        return isNaN(referrerId) ? null : referrerId;
      }
      return null;
    } catch (error) {
      console.error('Error parsing referral code:', error);
      return null;
    }
  };

  // Создание реферальной связи
  const createReferralLink = async (referrerId: number, userId: number, startParam: string) => {
    try {
      setLoading(true);
      
      // Проверяем, что пользователь не приглашает сам себя
      if (referrerId === userId) {
        console.log('User cannot refer themselves');
        return false;
      }

      // Проверяем, не был ли пользователь уже приглашен
      const { data: existingLink } = await supabase
        .from('referral_links')
        .select('*')
        .eq('referred_telegram_id', userId)
        .single();

      if (existingLink) {
        console.log('User already has a referrer');
        return false;
      }

      // Создаем реферальную связь
      const { data, error } = await supabase
        .from('referral_links')
        .insert({
          referrer_telegram_id: referrerId,
          referred_telegram_id: userId,
          start_param: startParam,
          processed: false
        })
        .select()
        .single();

      if (error) throw error;

      // Обновляем информацию пользователя
      await supabase
        .from('telegram_users')
        .update({
          start_param: startParam,
          referrer_id: referrerId,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_id', userId);

      // Создаем запись в таблице referrals
      await supabase
        .from('referrals')
        .insert({
          referrer_telegram_id: referrerId,
          referred_telegram_id: userId,
          bonus_amount: 0, // Бонус начислится при первой покупке
          status: 'pending'
        });

      console.log('Referral link created successfully:', data);
      toast.success('Вы присоединились по реферальной ссылке!');
      return true;
    } catch (err) {
      console.error('Error creating referral link:', err);
      setError(err instanceof Error ? err.message : 'Ошибка создания реферальной связи');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Обработка реферального бонуса при покупке
  const processReferralBonus = async (userId: number, purchaseAmount: number) => {
    try {
      // Получаем информацию о рефере пользователя
      const { data: userInfo } = await supabase
        .from('telegram_users')
        .select('referrer_id')
        .eq('telegram_id', userId)
        .single();

      if (!userInfo?.referrer_id) {
        return false;
      }

      // Вызываем функцию базы данных для начисления бонуса
      const { error } = await supabase.rpc('process_referral_bonus', {
        referrer_id: userInfo.referrer_id,
        purchase_amount: purchaseAmount
      });

      if (error) throw error;

      // Обновляем статус реферала на активный
      await supabase
        .from('referrals')
        .update({ 
          status: 'active',
          bonus_amount: purchaseAmount * 0.03
        })
        .match({
          referrer_telegram_id: userInfo.referrer_id,
          referred_telegram_id: userId
        });

      console.log(`Referral bonus processed: ${purchaseAmount * 0.03} for referrer ${userInfo.referrer_id}`);
      return true;
    } catch (err) {
      console.error('Error processing referral bonus:', err);
      return false;
    }
  };

  // Генерация реферальной ссылки
  const generateReferralLink = (telegramId: number, botUsername: string = 'TonTripBonanzaBot') => {
    return `https://t.me/${botUsername}?startapp=ref_${telegramId}`;
  };

  // Инициализация реферальной системы при загрузке приложения
  const initializeReferralSystem = async (userId: number) => {
    try {
      const startParam = getStartParam();
      console.log('Start param detected:', startParam);

      if (startParam) {
        const referrerId = parseReferralCode(startParam);
        if (referrerId && referrerId !== userId) {
          await createReferralLink(referrerId, userId, startParam);
        }
      }
    } catch (error) {
      console.error('Error initializing referral system:', error);
    }
  };

  return {
    loading,
    error,
    getStartParam,
    parseReferralCode,
    createReferralLink,
    processReferralBonus,
    generateReferralLink,
    initializeReferralSystem
  };
};
