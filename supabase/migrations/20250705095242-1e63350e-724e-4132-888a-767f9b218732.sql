
-- Очищаем все пользовательские данные из базы
DELETE FROM user_cards;
DELETE FROM user_balances;
DELETE FROM referrals;
DELETE FROM referral_links;
DELETE FROM trips;
DELETE FROM telegram_users;

-- Сбрасываем счетчики автоинкремента если они есть
-- (в данном случае используются UUID, поэтому сброс не нужен)

-- Оставляем только bonus_cards для демонстрации
-- DELETE FROM bonus_cards; -- раскомментируйте если хотите удалить и карты
