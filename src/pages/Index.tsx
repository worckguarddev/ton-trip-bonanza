
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { BalanceCard } from "@/components/BalanceCard";
import { Wallet, Gift, Users, Car, Settings } from "lucide-react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
      };
    };
  }
}

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (telegramUser) {
        setUser(telegramUser);
      }
    }
  }, []);

  const quickActions = [
    {
      icon: Gift,
      title: "Бонусные карты",
      description: "NFT и бонусные карты",
      path: "/cards",
      gradient: "from-pink-500 to-violet-500"
    },
    {
      icon: Car,
      title: "Бонусные поездки",
      description: "Используйте бонусы для поездок",
      path: "/trips",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Рефералы",
      description: "Приглашайте друзей",
      path: "/referrals",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Settings,
      title: "Профиль",
      description: "Настройки и кошелёк",
      path: "/profile",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-ton rounded-full flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            TON Trip Bonanza
          </h1>
          <p className="text-muted-foreground">
            {user ? `Добро пожаловать, ${user.first_name}!` : "Управляйте бонусами и NFT"}
          </p>
        </div>

        {/* Subscription Check */}
        {!isSubscribed && (
          <Card className="glass-card mb-6 p-4 animate-fade-in">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Подпишитесь на канал</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Для доступа ко всем функциям подпишитесь на наш канал
              </p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-telegram-blue hover:bg-telegram-blue/80">
                  Подписаться
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsSubscribed(true)}
                >
                  Проверить
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Balance Cards */}
        {isSubscribed && (
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
                title="TON баланс"
                amount={0.5}
                currency="TON"
                icon={Wallet}
                gradient="from-ton-blue to-telegram-blue"
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {isSubscribed && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <Card className="glass-card p-4 h-32 transition-all duration-300 hover:scale-105 hover:bg-white/10">
                    <div className="flex flex-col h-full">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-3`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-muted-foreground flex-1">{action.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        {isSubscribed && <Navigation />}
      </div>
    </div>
  );
};

export default Index;
