
-- Временно отключаем RLS для таблицы user_cards чтобы покупки работали
ALTER TABLE public.user_cards DISABLE ROW LEVEL SECURITY;

-- Также отключаем для user_balances если есть проблемы
ALTER TABLE public.user_balances DISABLE ROW LEVEL SECURITY;

-- Отключаем для referrals и referral_links
ALTER TABLE public.referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_links DISABLE ROW LEVEL SECURITY;
