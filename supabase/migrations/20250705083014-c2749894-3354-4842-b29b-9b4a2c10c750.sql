
-- Добавляем поле для баланса в рублях
ALTER TABLE user_balances 
ADD COLUMN IF NOT EXISTS rub_balance NUMERIC DEFAULT 0;

-- Обновляем существующие записи, конвертируя TON в рубли (примерно 1 TON = 500 рублей)
UPDATE user_balances 
SET rub_balance = COALESCE(ton_balance, 0) * 500 
WHERE rub_balance IS NULL OR rub_balance = 0;

-- Создаем функцию для автоматического создания пользователей
CREATE OR REPLACE FUNCTION create_user_if_not_exists(
  telegram_id_param BIGINT,
  first_name_param TEXT,
  last_name_param TEXT DEFAULT NULL,
  username_param TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Проверяем, существует ли пользователь
  SELECT id INTO user_uuid
  FROM telegram_users
  WHERE telegram_id = telegram_id_param;
  
  -- Если пользователь не существует, создаем его
  IF user_uuid IS NULL THEN
    INSERT INTO telegram_users (telegram_id, first_name, last_name, username)
    VALUES (telegram_id_param, first_name_param, last_name_param, username_param)
    RETURNING id INTO user_uuid;
    
    -- Создаем начальный баланс для нового пользователя
    INSERT INTO user_balances (user_telegram_id, ton_balance, bonus_points, rub_balance)
    VALUES (telegram_id_param, 0, 1000, 2500); -- Стартовые 2500 рублей
  END IF;
  
  RETURN user_uuid;
END;
$$;
