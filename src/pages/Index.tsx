
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

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
  const navigate = useNavigate();

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

  const handleSubscriptionCheck = () => {
    setIsSubscribed(true);
    // Перенаправляем на страницу с бонусными картами
    navigate('/cards');
  };

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
                onClick={handleSubscriptionCheck}
              >
                Проверить
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
