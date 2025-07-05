
import { useState, useEffect } from 'react';
import { useCards } from '@/hooks/useCards';
import { useBalance } from '@/hooks/useBalance';
import { useReferralSystem } from '@/hooks/useReferralSystem';
import { NFTCard } from '@/components/NFTCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTonConnectUI } from '@tonconnect/ui-react';

export default function Cards() {
  const { availableCards, userCards, loading, fetchAvailableCards, fetchUserCards, purchaseCard, rentCard, withdrawCard } = useCards();
  const { balance, fetchBalance } = useBalance();
  const { initializeReferralSystem, processReferralBonus } = useReferralSystem();
  const [tonConnectUI] = useTonConnectUI();
  
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [rentPrice, setRentPrice] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  // Получаем telegram ID из window.Telegram или используем тестовый ID
  const getTelegramId = () => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      return window.Telegram.WebApp.initDataUnsafe.user.id;
    }
    return 123456789; // Тестовый ID
  };

  const telegramId = getTelegramId();
  const isWalletConnected = tonConnectUI.connected;

  useEffect(() => {
    const loadData = async () => {
      console.log('Cards: Загружаем данные для пользователя:', telegramId);
      
      try {
        // Загружаем все данные параллельно
        await Promise.all([
          fetchAvailableCards(),
          fetchBalance(telegramId),
          fetchUserCards(telegramId),
          initializeReferralSystem(telegramId)
        ]);
        
        console.log('Cards: Данные успешно загружены');
      } catch (error) {
        console.error('Cards: Ошибка загрузки данных:', error);
        toast.error('Ошибка загрузки данных');
      }
    };

    loadData();
  }, [telegramId]);

  const handlePurchase = async (cardId: string) => {
    const card = availableCards.find(c => c.id === cardId);
    if (!card) {
      toast.error('Карта не найдена');
      return;
    }

    console.log('Покупаем карту:', cardId, 'для пользователя:', telegramId);
    const success = await purchaseCard(cardId, telegramId, card.price);
    if (success) {
      await processReferralBonus(telegramId, card.price);
      fetchUserCards(telegramId);
      fetchBalance(telegramId);
    }
  };

  const handleRent = (cardId: string) => {
    if (!isWalletConnected) {
      toast.error('Подключите TON кошелёк для сдачи карты в аренду');
      return;
    }
    setSelectedCardId(cardId);
    setRentPrice('');
    setRentDialogOpen(true);
  };

  const handleWithdraw = (cardId: string) => {
    if (!isWalletConnected) {
      toast.error('Подключите TON кошелёк для вывода карты в блокчейн');
      return;
    }
    setSelectedCardId(cardId);
    setWithdrawAddress('');
    setWithdrawDialogOpen(true);
  };

  const confirmRent = async () => {
    const price = parseFloat(rentPrice);
    if (!price || price <= 0) {
      toast.error('Введите корректную цену аренды');
      return;
    }

    const userCard = userCards.find(c => c.id === selectedCardId);
    if (!userCard) {
      toast.error('Карта не найдена');
      return;
    }

    const success = await rentCard(userCard.user_card_id, price);
    if (success) {
      fetchUserCards(telegramId);
      setRentDialogOpen(false);
    }
  };

  const confirmWithdraw = async () => {
    if (!withdrawAddress.trim() || withdrawAddress.trim().length < 10) {
      toast.error('Введите корректный адрес TON кошелька');
      return;
    }

    const userCard = userCards.find(c => c.id === selectedCardId);
    if (!userCard) {
      toast.error('Карта не найдена');
      return;
    }

    const success = await withdrawCard(userCard.user_card_id, withdrawAddress.trim());
    if (success) {
      fetchUserCards(telegramId);
      setWithdrawDialogOpen(false);
    }
  };

  // Показываем загрузку только в самом начале
  if (loading && availableCards.length === 0 && userCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-ton rounded-full flex items-center justify-center animate-pulse">
            <div className="w-10 h-10 rounded-full bg-white/20"></div>
          </div>
          <p className="text-muted-foreground">Загрузка карт...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold gradient-text mb-2">Бонусные карты</h1>
          <p className="text-muted-foreground">
            Покупайте карты и получайте бонусы за путешествия
          </p>
          {balance && (
            <p className="text-sm text-muted-foreground mt-2">
              Баланс: {balance.rub_balance || 0} ₽
            </p>
          )}
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="available">Доступные карты</TabsTrigger>
            <TabsTrigger value="owned">Мои карты ({userCards.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            {availableCards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {loading ? 'Загрузка карт...' : 'Карты не найдены'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCards.map((card) => (
                  <NFTCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    description={card.description || ''}
                    image={card.image_url || '/placeholder.svg'}
                    price={card.price}
                    rarity={card.rarity}
                    owned={false}
                    hasWallet={isWalletConnected}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="owned" className="space-y-4">
            {userCards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  У вас пока нет карт
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCards.map((card) => (
                  <NFTCard
                    key={card.user_card_id}
                    id={card.id}
                    title={card.title}
                    description={card.description || ''}
                    image={card.image_url || '/placeholder.svg'}
                    price={card.price}
                    rarity={card.rarity}
                    owned={true}
                    hasWallet={isWalletConnected}
                    onWithdraw={handleWithdraw}
                    onRent={handleRent}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Диалог аренды */}
        <Dialog open={rentDialogOpen} onOpenChange={setRentDialogOpen}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Сдать карту в аренду</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rentPrice">Цена аренды (в рублях за месяц)</Label>
                <Input
                  id="rentPrice"
                  type="number"
                  placeholder="Например: 500"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmRent} className="flex-1">
                  Выставить на аренду
                </Button>
                <Button variant="outline" onClick={() => setRentDialogOpen(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Вывести карту в блокчейн</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="withdrawAddress">Адрес TON кошелька</Label>
                <Input
                  id="withdrawAddress"
                  placeholder="UQBx... (адрес вашего TON кошелька)"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmWithdraw} className="flex-1">
                  Отправить заявку
                </Button>
                <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
