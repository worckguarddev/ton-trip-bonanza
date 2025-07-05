
-- Создаем таблицу для хранения реферальных связей при запуске
CREATE TABLE IF NOT EXISTS public.referral_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_telegram_id BIGINT NOT NULL,
  referred_telegram_id BIGINT NOT NULL,
  start_param TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(referred_telegram_id) -- Один пользователь может быть приглашен только один раз
);

-- Добавляем RLS политики
ALTER TABLE public.referral_links ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть свои реферальные ссылки
CREATE POLICY "Users can view their referral links" 
  ON public.referral_links 
  FOR SELECT 
  USING (
    referrer_telegram_id = (((current_setting('request.jwt.claims'::text, true))::json ->> 'telegram_id'::text))::bigint 
    OR referred_telegram_id = (((current_setting('request.jwt.claims'::text, true))::json ->> 'telegram_id'::text))::bigint
  );

-- Пользователи могут создавать реферальные связи
CREATE POLICY "Users can create referral links" 
  ON public.referral_links 
  FOR INSERT 
  WITH CHECK (true); -- Разрешаем создание для всех, так как это происходит при первом запуске

-- Пользователи могут обновлять статус обработки
CREATE POLICY "Users can update referral links" 
  ON public.referral_links 
  FOR UPDATE 
  USING (
    referrer_telegram_id = (((current_setting('request.jwt.claims'::text, true))::json ->> 'telegram_id'::text))::bigint 
    OR referred_telegram_id = (((current_setting('request.jwt.claims'::text, true))::json ->> 'telegram_id'::text))::bigint
  );

-- Обновляем таблицу пользователей для хранения start параметра
ALTER TABLE public.telegram_users 
ADD COLUMN IF NOT EXISTS start_param TEXT,
ADD COLUMN IF NOT EXISTS referrer_id BIGINT;

-- Добавляем функцию для обработки реферального бонуса
CREATE OR REPLACE FUNCTION public.process_referral_bonus(
  referrer_id BIGINT,
  purchase_amount NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Обновляем баланс реферера (добавляем 3% от покупки)
  UPDATE public.user_balances 
  SET 
    bonus_points = COALESCE(bonus_points, 0) + (purchase_amount * 0.03),
    total_earned = COALESCE(total_earned, 0) + (purchase_amount * 0.03),
    updated_at = now()
  WHERE user_telegram_id = referrer_id;
  
  -- Если у реферера нет баланса, создаем его
  INSERT INTO public.user_balances (user_telegram_id, bonus_points, total_earned)
  VALUES (referrer_id, purchase_amount * 0.03, purchase_amount * 0.03)
  ON CONFLICT (user_telegram_id) DO NOTHING;
END;
$$;
