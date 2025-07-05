
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BotSettings {
  id: string;
  bot_token: string | null;
  channel_id: string | null;
  channel_name: string | null;
  channel_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useBotSettings = () => {
  const [settings, setSettings] = useState<BotSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bot_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        console.error('Ошибка загрузки настроек:', fetchError);
        throw fetchError;
      }

      setSettings(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки настроек';
      console.error('Ошибка загрузки настроек бота:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updates: {
    bot_token?: string;
    channel_id?: string;
    channel_name?: string;
    channel_url?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      if (!settings?.id) {
        // Создаем новые настройки если их нет
        const { data, error } = await supabase
          .from('bot_settings')
          .insert([{
            ...updates,
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        
        setSettings(data);
        toast.success('Настройки сохранены');
        return true;
      } else {
        // Обновляем существующие настройки
        const { data, error } = await supabase
          .from('bot_settings')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        
        setSettings(data);
        toast.success('Настройки обновлены');
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сохранения настроек';
      console.error('Ошибка сохранения настроек:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    loadSettings,
    saveSettings
  };
};
