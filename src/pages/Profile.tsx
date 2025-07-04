
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TONConnectButton } from "@/components/TONConnectButton";
import { BalanceCard } from "@/components/BalanceCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Calendar, Wallet, History, Car, DollarSign } from "lucide-react";

const Profile = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  const userInfo = {
    firstName: "Иван",
    lastName: "Петров", 
    username: "@ivan_petrov",
    phone: "+7 (999) 123-45-67",
    joinDate: "2024-01-01",
    referralCode: "REF123456"
  };

  const userStats = {
    totalCards: 5,
    totalEarned: 250,
    totalSpent: 150,
    referrals: 3
  };

  const recentTransactions = [
    {
      id: 1,
      type: "purchase",
      description: "Покупка NFT карты",
      amount: -100,
      date: "2024-01-15"
    },
    {
      id: 2,
      type: "referral",
      description: "Бонус за реферала",
      amount: +30,
      date: "2024-01-14"
    },
    {
      id: 3,
      type: "bonus",
      description: "Начисление бонусов",
      amount: +150,
      date: "2024-01-13",
      currency: "бонусов"
    }
  ];

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
              <h2 className="text-xl font-bold">{userInfo.firstName} {userInfo.lastName}</h2>
              <p className="text-muted-foreground">{userInfo.username}</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{userInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>В проекте с {new Date(userInfo.joinDate).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Реферальный код:</span>
              <Badge variant="outline">{userInfo.referralCode}</Badge>
            </div>
          </div>
        </Card>

        {/* Balance Cards */}
        <div className="mb-8 animate-fade-in">
          <div className="grid gap-4 mb-6">
            <BalanceCard 
              title="На поездки"
              amount={1250}
              currency="бонусов"
              icon={Car}
              gradient="from-blue-500 to-cyan-500"
            />
            <BalanceCard 
              title="Баланс"
              amount={500}
              currency="₽"
              icon={DollarSign}
              gradient="from-green-500 to-emerald-500"
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
              <div className="text-2xl font-bold text-green-400">{userStats.totalEarned}</div>
              <div className="text-xs text-muted-foreground">₽ заработано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{userStats.totalSpent}</div>
              <div className="text-xs text-muted-foreground">₽ потрачено</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userStats.referrals}</div>
              <div className="text-xs text-muted-foreground">Рефералов</div>
            </div>
          </div>
        </Card>

        {/* TON Wallet */}
        <div className="mb-6">
          <TONConnectButton
            isConnected={isWalletConnected}
            address={isWalletConnected ? "UQBpH-7d8JEH..." : ""}
            onConnect={() => setIsWalletConnected(true)}
            onDisconnect={() => setIsWalletConnected(false)}
          />
        </div>

        {/* Recent Transactions */}
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
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </span>
                    <span className="text-xs ml-1">
                      {transaction.currency || '₽'}
                    </span>
                  </div>
                </div>
                {index < recentTransactions.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
