
-- Создаем таблицу для настроек бота
CREATE TABLE public.bot_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_token TEXT,
  channel_id TEXT,
  channel_name TEXT,
  channel_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для безопасности
ALTER TABLE public.bot_settings ENABLE ROW LEVEL SECURITY;

-- Политика для админов (полный доступ)
CREATE POLICY "Admins can manage bot settings" 
  ON public.bot_settings 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Вставляем текущие настройки как начальные данные
INSERT INTO public.bot_settings (bot_token, channel_id, channel_name, channel_url) 
VALUES (
  NULL, -- токен будет добавлен через админ панель
  '@TonTripBonanza', -- текущий канал из кода
  'TonTripBonanza',
  'https://t.me/TonTripBonanza'
);
