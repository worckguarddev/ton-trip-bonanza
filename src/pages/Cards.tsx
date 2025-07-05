
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { NFTCard } from "@/components/NFTCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import { useCards } from "@/hooks/useCards";
import { useBalance } from "@/hooks/useBalance";
import { useReferrals } from "@/hooks/useReferrals";
import { TelegramUser } from "@/types/telegram";

const Cards = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const { availableCards, userCards, loading, fetchAvailableCards, fetchUserCards, purchaseCard, rentCard, withdrawCard } = useCards();
  const { balance, fetchBalance, updateBalance } = useBalance();
  const { createReferral } = useReferrals();

  useEffect(() => {
    // Получаем пользователя из Telegram WebApp
    if (window.Telegram?.WebApp) {
      const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (telegramUser) {
        setUser(telegramUser);
        fetchUserCards(telegramUser.id);
        fetchBalance(telegramUser.id);
      }
    } else {
      // Тестовые данные
      const testUser = { id: 123456789, first_name: "Test", last_name: "User" };
      setUser(testUser);
      fetchUserCards(testUser.id);
      fetchBalance(testUser.id);
    }

    fetchAvailableCards();
  }, []);

  const handlePurchase = async (id: string) => {
    if (!user?.id) {
      toast.error('Пользователь не найден');
      return;
    }

    // Находим карту для проверки цены
    const card = availableCards.find(c => c.id === id);
    if (!card) {
      toast.error('Карта не найдена');
      return;
    }

    // Проверяем баланс
    if (!balance || balance.bonus_points < card.price) {
      toast.error('Недостаточно бонусов для покупки');
      return;
    }

    const success = await purchaseCard(id, user.id);
    if (success) {
      // Обновляем баланс после покупки
      await updateBalance(user.id, {
        bonus_points: balance.bonus_points - card.price,
        total_spent: (balance.total_spent || 0) + card.price
      });

      // Проверяем и начисляем реферальный бонус
      await processReferralBonus(user.id, card.price);

      await fetchUserCards(user.id);
      await fetchBalance(user.id);
    }
  };

  const processReferralBonus = async (userId: number, purchaseAmount: number) => {
    try {
      // Здесь должна быть логика поиска реферера из параметров запуска бота
      // Для демонстрации используем фиксированный ID
      const referrerId = 987654321; // В реальности получаем из start параметра
      
      if (referrerId && referrerId !== userId) {
        const bonusAmount = purchaseAmount * 0.03; // 3% от покупки
        
        // Создаем запись о реферале если её нет
        await createReferral(referrerId, userId);
        
        // Начисляем бонус рефереру
        // Здесь нужно обновить баланс реферера
        console.log(`Начислен реферальный бонус ${bonusAmount} пользователю ${referrerId}`);
      }
    } catch (error) {
      console.error('Ошибка обработки реферального бонуса:', error);
    }
  };

  const handleWithdraw = async (id: string) => {
    // В реальном приложении здесь будет диалог для ввода адреса кошелька
    const success = await withdrawCard(id, 'EQD..._placeholder_address');
    if (success) {
      await fetchUserCards(user.id);
    }
  };

  const handleRent = async (id: string) => {
    // В реальном приложении здесь будет диалог для ввода цены
    const success = await rentCard(id, 100);
    if (success) {
      await fetchUserCards(user.id);
    }
  };

  const transformedAvailableCards = availableCards.map(card => ({
    id: card.id,
    title: card.title,
    description: card.description || '',
    image: card.image_url || '/placeholder.svg',
    price: Number(card.price),
    rarity: card.rarity,
    owned: false
  }));

  const transformedUserCards = userCards.map(card => ({
    id: card.user_card_id,
    title: card.title,
    description: card.description || '',
    image: card.image_url || '/placeholder.svg',
    price: Number(card.price),
    rarity: card.rarity,
    owned: true
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Бонусные карты</h1>
              <p className="text-xs text-muted-foreground">
                Баланс: {balance?.bonus_points || 0} бонусов
              </p>
            </div>
          </div>
        </div>

        {/* Cards Tabs */}
        <Tabs defaultValue="available" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="available">Доступные</TabsTrigger>
            <TabsTrigger value="purchased">Мои карты ({transformedUserCards.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            {loading ? (
              <Card className="glass-card p-6 text-center">
                <p className="text-muted-foreground">Загрузка карт...</p>
              </Card>
            ) : transformedAvailableCards.length > 0 ? (
              transformedAvailableCards.map((card) => (
                <NFTCard
                  key={card.id}
                  {...card}
                  onPurchase={handlePurchase}
                  onWithdraw={handleWithdraw}
                  onRent={handleRent}
                />
              ))
            ) : (
              <Card className="glass-card p-6 text-center">
                <p className="text-muted-foreground">Нет доступных карт</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="purchased" className="space-y-4">
            {loading ? (
              <Card className="glass-card p-6 text-center">
                <p className="text-muted-foreground">Загрузка ваших карт...</p>
              </Card>
            ) : transformedUserCards.length > 0 ? (
              transformedUserCards.map((card) => (
                <NFTCard
                  key={card.id}
                  {...card}
                  onPurchase={handlePurchase}
                  onWithdraw={handleWithdraw}
                  onRent={handleRent}
                />
              ))
            ) : (
              <Card className="glass-card p-6 text-center">
                <p className="text-muted-foreground">У вас пока нет купленных карт</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Cards;
