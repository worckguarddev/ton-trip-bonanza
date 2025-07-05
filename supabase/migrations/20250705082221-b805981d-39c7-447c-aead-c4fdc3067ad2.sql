
-- Обновляем политики для referral_links, чтобы они работали с Edge Functions
DROP POLICY IF EXISTS "Users can create referral links" ON referral_links;
DROP POLICY IF EXISTS "Users can view their referral links" ON referral_links;
DROP POLICY IF EXISTS "Users can update referral links" ON referral_links;

-- Создаем более гибкие политики для referral_links
CREATE POLICY "Allow referral link creation" 
  ON referral_links 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view referral links" 
  ON referral_links 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update referral links" 
  ON referral_links 
  FOR UPDATE 
  USING (true);

-- Обновляем политики для user_balances
DROP POLICY IF EXISTS "Users can view their own balance" ON user_balances;
DROP POLICY IF EXISTS "Users can update their own balance" ON user_balances;

-- Создаем политику для создания записей в user_balances
CREATE POLICY "Allow balance creation" 
  ON user_balances 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view balances" 
  ON user_balances 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update balances" 
  ON user_balances 
  FOR UPDATE 
  USING (true);

-- Обновляем политики для referrals
DROP POLICY IF EXISTS "Users can create referrals" ON referrals;
DROP POLICY IF EXISTS "Users can view their referrals" ON referrals;

CREATE POLICY "Allow referral creation" 
  ON referrals 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view referrals" 
  ON referrals 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow referral updates" 
  ON referrals 
  FOR UPDATE 
  USING (true);
