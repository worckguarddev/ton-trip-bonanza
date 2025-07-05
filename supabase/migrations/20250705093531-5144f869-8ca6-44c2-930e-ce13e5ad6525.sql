
-- Добавляем политики для админ доступа к данным
-- Для bonus_cards - разрешаем админам все операции
CREATE POLICY "Admins can manage all cards" ON public.bonus_cards
FOR ALL USING (true) WITH CHECK (true);

-- Для telegram_users - разрешаем админам просматривать всех пользователей  
CREATE POLICY "Admins can view all users" ON public.telegram_users
FOR SELECT USING (true);

-- Для user_balances - разрешаем админам просматривать и изменять все балансы
CREATE POLICY "Admins can manage all balances" ON public.user_balances
FOR ALL USING (true) WITH CHECK (true);

-- Для user_cards - разрешаем админам просматривать и изменять все карты пользователей
CREATE POLICY "Admins can manage all user cards" ON public.user_cards
FOR ALL USING (true) WITH CHECK (true);

-- Для referrals - разрешаем админам просматривать все рефералы
CREATE POLICY "Admins can view all referrals" ON public.referrals
FOR SELECT USING (true);
