
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TONConnectButton } from "@/components/TONConnectButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Phone, Calendar, Wallet, History, Settings } from "lucide-react";
import { Link } from "react-router-dom";

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
    totalEarned: 0.25,
    totalSpent: 0.15,
    referrals: 3
  };

  const recentTransactions = [
    {
      id: 1,
      type: "purchase",
      description: "Покупка NFT карты",
      amount: -0.1,
      date: "2024-01-15"
    },
    {
      id: 2,
      type: "referral",
      description: "Бонус за реферала",
      amount: +0.03,
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
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Профиль</h1>
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
              <div className="text-xs text-muted-foreground">TON заработано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{userStats.totalSpent}</div>
              <div className="text-xs text-muted-foreground">TON потрачено</div>
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
                      {transaction.currency || 'TON'}
                    </span>
                  </div>
                </div>
                {index < recentTransactions.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Settings */}
        <Card className="glass-card p-4 mb-6">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-5 h-5 mr-3" />
            Настройки
          </Button>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
