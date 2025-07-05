
-- Создаем таблицу для бонусных карт
CREATE TABLE public.bonus_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_available BOOLEAN DEFAULT true,
  benefits JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для приобретенных карт пользователей
CREATE TABLE public.user_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_telegram_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.bonus_cards(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_rented BOOLEAN DEFAULT false,
  rent_price DECIMAL(10,2),
  rent_until TIMESTAMP WITH TIME ZONE,
  blockchain_address TEXT,
  is_withdrawn BOOLEAN DEFAULT false,
  UNIQUE(user_telegram_id, card_id)
);

-- Создаем таблицу для поездок
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_telegram_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE,
  price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  bonus_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для рефералов
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_telegram_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_id) ON DELETE CASCADE,
  referred_telegram_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_id) ON DELETE CASCADE,
  bonus_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rewarded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_telegram_id, referred_telegram_id)
);

-- Добавляем таблицу для балансов пользователей
CREATE TABLE public.user_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_telegram_id BIGINT NOT NULL REFERENCES public.telegram_users(telegram_id) ON DELETE CASCADE UNIQUE,
  ton_balance DECIMAL(18,8) DEFAULT 0,
  bonus_points DECIMAL(10,2) DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.bonus_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;

-- Политики для bonus_cards (публичные для чтения)
CREATE POLICY "Anyone can view available cards" 
  ON public.bonus_cards 
  FOR SELECT 
  USING (is_available = true);

-- Политики для user_cards
CREATE POLICY "Users can view their own cards" 
  ON public.user_cards 
  FOR SELECT 
  USING (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can insert their own cards" 
  ON public.user_cards 
  FOR INSERT 
  WITH CHECK (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can update their own cards" 
  ON public.user_cards 
  FOR UPDATE 
  USING (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

-- Политики для trips
CREATE POLICY "Users can view their own trips" 
  ON public.trips 
  FOR SELECT 
  USING (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can insert their own trips" 
  ON public.trips 
  FOR INSERT 
  WITH CHECK (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can update their own trips" 
  ON public.trips 
  FOR UPDATE 
  USING (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

-- Политики для referrals
CREATE POLICY "Users can view their referrals" 
  ON public.referrals 
  FOR SELECT 
  USING (referrer_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint 
         OR referred_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can create referrals" 
  ON public.referrals 
  FOR INSERT 
  WITH CHECK (referrer_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

-- Политики для user_balances
CREATE POLICY "Users can view their own balance" 
  ON public.user_balances 
  FOR SELECT 
  USING (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can update their own balance" 
  ON public.user_balances 
  FOR UPDATE 
  USING (user_telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

-- Вставляем начальные данные для бонусных карт
INSERT INTO public.bonus_cards (title, description, image_url, price, rarity, benefits) VALUES
('Золотая карта VIP', 'Премиум доступ ко всем функциям', '/placeholder.svg', 5000.00, 'legendary', '{"discount": 20, "bonus_multiplier": 3, "free_trips": 2}'),
('Серебряная карта Pro', 'Расширенные возможности', '/placeholder.svg', 2500.00, 'epic', '{"discount": 15, "bonus_multiplier": 2, "free_trips": 1}'),
('Бронзовая карта Basic', 'Базовые функции системы', '/placeholder.svg', 1000.00, 'rare', '{"discount": 10, "bonus_multiplier": 1.5}'),
('Карта поездок', 'Бонусы на транспорт', '/placeholder.svg', 500.00, 'common', '{"transport_discount": 5}'),
('Партнерская карта', 'Скидки у партнеров', '/placeholder.svg', 1500.00, 'rare', '{"partner_discount": 12, "cashback": 3}');
