
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TONConnectButton } from "@/components/TONConnectButton";
import { BalanceCard } from "@/components/BalanceCard";
import { TopUpDialog } from "@/components/TopUpDialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Calendar, Wallet, History, Car, DollarSign } from "lucide-react";
import { useTelegramProfile } from "@/hooks/useTelegramProfile";
import { useBalance } from "@/hooks/useBalance";
import { useCards } from "@/hooks/useCards";
import { useReferrals } from "@/hooks/useReferrals";
import { TelegramUser } from "@/types/telegram";

const Profile = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const { getTelegramProfile } = useTelegramProfile();
  const { balance, fetchBalance, updateBalance } = useBalance();
  const { userCards, fetchUserCards } = useCards();
  const { referrals, fetchReferrals } = useReferrals();

  useEffect(() => {
    const initializeProfile = async () => {
      // Получаем пользователя из Telegram WebApp
      if (window.Telegram?.WebApp) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
          
          // Получаем дополнительную информацию профиля
          await getTelegramProfile(telegramUser.id);
          await fetchBalance(telegramUser.id);
          await fetchUserCards(telegramUser.id);
          await fetchReferrals(telegramUser.id);
        }
      } else {
        // Тестовые данные
        const testUser = { 
          id: 123456789, 
          first_name: "Иван", 
          last_name: "Петров",
          username: "ivan_petrov"
        };
        setUser(testUser);
        await fetchBalance(testUser.id);
        await fetchUserCards(testUser.id);
        await fetchReferrals(testUser.id);
      }
    };

    initializeProfile();
  }, []);

  const handleTopUp = async (amount: number) => {
    if (!user) return;

    // Обновляем баланс в базе данных
    await updateBalance(user.id, {
      rub_balance: (balance?.rub_balance || 0) + amount
    });
    
    // Обновляем данные
    await fetchBalance(user.id);
  };

  const userStats = {
    totalCards: userCards.length,
    totalEarned: balance?.total_earned || 0,
    totalSpent: balance?.total_spent || 0,
    referrals: referrals.filter(r => r.status === 'active').length
  };

  const recentTransactions = [
    balance?.total_spent && balance.total_spent > 0 ? {
      id: 1,
      type: "purchase",
      description: "Покупка NFT карты",
      amount: -(balance.total_spent),
      date: new Date().toISOString(),
      currency: "рублей"
    } : null,
    referrals.length > 0 ? {
      id: 2,
      type: "referral",
      description: "Бонус за рефералов",
      amount: +referrals.reduce((sum, r) => sum + (r.bonus_amount || 0), 0),
      date: new Date().toISOString(),
      currency: "бонусов"
    } : null,
    balance?.bonus_points && balance.bonus_points > 0 ? {
      id: 3,
      type: "bonus",
      description: "Начисление бонусов",
      amount: +(balance.bonus_points),
      date: new Date().toISOString(),
      currency: "бонусов"
    } : null
  ].filter(Boolean);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white pb-20 flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Профиль</h1>
              <p className="text-xs text-muted-foreground">Ваши данные и статистика</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <Card className="glass-card p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-ton rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {user.first_name} {user.last_name || ''}
              </h2>
              <p className="text-muted-foreground">
                {user.username ? `@${user.username}` : `ID: ${user.id}`}
              </p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>Telegram ID: {user.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>В проекте с {new Date().toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Реферальный код:</span>
              <Badge variant="outline">REF{user.id}</Badge>
            </div>
          </div>
        </Card>

        {/* Balance Cards */}
        <div className="mb-8 animate-fade-in">
          <div className="grid gap-4 mb-6">
            <BalanceCard 
              title="На поездки"
              amount={balance?.bonus_points || 0}
              currency="бонусов"
              icon={Car}
              gradient="from-blue-500 to-cyan-500"
            />
            <BalanceCard 
              title="Баланс"
              amount={balance?.rub_balance || 0}
              currency="₽"
              icon={DollarSign}
              gradient="from-green-500 to-emerald-500"
              onTopUp={() => setTopUpDialogOpen(true)}
            />
          </div>
        </div>

        {/* Statistics */}
        <Card className="glass-card p-4 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Статистика
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">{userStats.totalCards}</div>
              <div className="text-xs text-muted-foreground">Карт в коллекции</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{Math.round(userStats.totalEarned)}</div>
              <div className="text-xs text-muted-foreground">бонусов заработано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{Math.round(userStats.totalSpent)}</div>
              <div className="text-xs text-muted-foreground">рублей потрачено</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userStats.referrals}</div>
              <div className="text-xs text-muted-foreground">Рефералов</div>
            </div>
          </div>
        </Card>

        {/* TON Wallet */}
        <div className="mb-6">
          <TONConnectButton userId={user.id} />
        </div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <Card className="glass-card p-4 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Последние операции
            </h3>
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className={`text-right ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span className="font-bold">
                        {transaction.amount > 0 ? '+' : ''}{Math.round(transaction.amount)}
                      </span>
                      <span className="text-xs ml-1">
                        {transaction.currency}
                      </span>
                    </div>
                  </div>
                  {index < recentTransactions.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Navigation />
      
      <TopUpDialog 
        open={topUpDialogOpen}
        onOpenChange={setTopUpDialogOpen}
        onTopUp={handleTopUp}
      />
    </div>
  );
};

export default Profile;
