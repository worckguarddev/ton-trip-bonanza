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
import { useReferralSystem } from "@/hooks/useReferralSystem";
import { TelegramUser } from "@/types/telegram";

const Cards = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const { availableCards, userCards, loading, fetchAvailableCards, fetchUserCards, purchaseCard, rentCard, withdrawCard } = useCards();
  const { balance, fetchBalance } = useBalance();
  const { processReferralBonus, initializeReferralSystem } = useReferralSystem();

  useEffect(() => {
    const initializeUser = async () => {
      // Получаем пользователя из Telegram WebApp
      if (window.Telegram?.WebApp) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
          
          // Инициализируем реферальную систему
          await initializeReferralSystem(telegramUser.id);
          
          await fetchUserCards(telegramUser.id);
          await fetchBalance(telegramUser.id);
        }
      } else {
        // Тестовые данные
        const testUser = { id: 123456789, first_name: "Test", last_name: "User" };
        setUser(testUser);
        await fetchUserCards(testUser.id);
        await fetchBalance(testUser.id);
      }

      await fetchAvailableCards();
    };

    initializeUser();
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

    console.log('Покупка карты:', { cardId: id, userId: user.id, cardPrice: card.price, currentBalance: balance?.rub_balance });

    // Выполняем покупку
    const success = await purchaseCard(id, user.id, card.price);
    if (success) {
      console.log('Покупка успешна, обрабатываем реферальный бонус');
      
      // Обрабатываем реферальный бонус
      await processReferralBonus(user.id, card.price);

      // Обновляем данные пользователя
      await fetchUserCards(user.id);
      await fetchBalance(user.id);
      
      console.log('Все данные обновлены после покупки');
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
                Баланс: {balance?.rub_balance || 0} рублей
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
