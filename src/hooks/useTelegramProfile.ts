
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramProfileData {
  ok: boolean;
  result?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    bio?: string;
    photo?: {
      small_file_id: string;
      big_file_id: string;
    };
  };
}

export const useTelegramProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTelegramProfile = async (userId: number): Promise<TelegramProfileData | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Получение профиля для пользователя: ${userId}`);

      const { data, error: functionError } = await supabase.functions.invoke('telegram-profile', {
        body: {
          userId,
          action: 'getProfile'
        }
      });

      if (functionError) {
        throw new Error(`Ошибка функции: ${functionError.message}`);
      }

      if (!data || !data.ok) {
        throw new Error(data?.description || 'Не удалось получить данные профиля');
      }

      console.log('Данные профиля получены:', data);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('Ошибка получения профиля:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async (userId: number, channelId: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Проверка подписки пользователя ${userId} на канал ${channelId}`);

      const { data, error: functionError } = await supabase.functions.invoke('telegram-profile', {
        body: {
          userId,
          channelId,
          action: 'checkSubscription'
        }
      });

      if (functionError) {
        throw new Error(`Ошибка функции: ${functionError.message}`);
      }

      console.log('Результат проверки подписки:', data);
      return data?.isSubscribed || false;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка проверки подписки';
      console.error('Ошибка проверки подписки:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getProfilePhotos = async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('telegram-profile', {
        body: {
          userId,
          action: 'getProfilePhotos'
        }
      });

      if (functionError) {
        throw new Error(`Ошибка функции: ${functionError.message}`);
      }

      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка получения фото';
      console.error('Ошибка получения фото:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getTelegramProfile,
    checkSubscription,
    getProfilePhotos,
    loading,
    error
  };
};
