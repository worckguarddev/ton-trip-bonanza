
-- Добавляем колонки для хранения информации о TON кошельке
ALTER TABLE public.telegram_users 
ADD COLUMN wallet_address TEXT,
ADD COLUMN wallet_chain TEXT;
