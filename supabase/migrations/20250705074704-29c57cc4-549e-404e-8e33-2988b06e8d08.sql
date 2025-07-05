
-- Создаем таблицу для хранения пользователей Telegram
CREATE TABLE public.telegram_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT,
  language_code TEXT,
  bio TEXT,
  photo_url TEXT,
  is_subscribed BOOLEAN DEFAULT false,
  subscription_checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа (пользователи могут видеть только свои данные)
CREATE POLICY "Users can view their own data" 
  ON public.telegram_users 
  FOR SELECT 
  USING (telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

-- Создаем политику для вставки данных
CREATE POLICY "Users can insert their own data" 
  ON public.telegram_users 
  FOR INSERT 
  WITH CHECK (telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

-- Создаем политику для обновления данных
CREATE POLICY "Users can update their own data" 
  ON public.telegram_users 
  FOR UPDATE 
  USING (telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

-- Создаем индекс для быстрого поиска по telegram_id
CREATE INDEX idx_telegram_users_telegram_id ON public.telegram_users(telegram_id);
