
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Clock, ExternalLink, Plus } from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { useBalance } from "@/hooks/useBalance";
import { TelegramUser } from "@/types/telegram";

const Trips = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const { trips, loading: tripsLoading, fetchTrips } = useTrips();
  const { balance, loading: balanceLoading, fetchBalance } = useBalance();

  useEffect(() => {
    // Получаем пользователя из Telegram WebApp
    if (window.Telegram?.WebApp) {
      const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (telegramUser) {
        setUser(telegramUser);
        fetchTrips(telegramUser.id);
        fetchBalance(telegramUser.id);
      }
    } else {
      // Тестовые данные
      const testUser = { id: 123456789 };
      setUser(testUser);
      fetchTrips(testUser.id);
      fetchBalance(testUser.id);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'planned': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершена';
      case 'active': return 'Активна';
      case 'planned': return 'Запланирована';
      case 'cancelled': return 'Отменена';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-2xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Бонусные поездки</h1>
              <p className="text-xs text-muted-foreground">Используйте бонусы для поездок</p>
            </div>
          </div>
        </div>

        {/* Available Bonuses */}
        <Card className="balance-card mb-6 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Доступно бонусов</h2>
            <div className="text-3xl font-bold gradient-text mb-4">
              {balanceLoading ? '...' : (balance?.bonus_points || 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Используйте бонусы для оплаты поездок в приложении такси
            </p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
              Заказать поездку
            </Button>
          </div>
        </Card>

        {/* App Integration */}
        <Card className="glass-card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-ton rounded-lg flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Приложение такси</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Скачайте приложение для использования бонусов
              </p>
              <Button size="sm" variant="outline">
                Скачать из Google Play
              </Button>
            </div>
          </div>
        </Card>

        {/* Registration Instructions */}
        <Card className="glass-card p-4 mb-6">
          <h3 className="font-semibold mb-3">Инструкция по регистрации</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                1
              </div>
              <p>Скачайте приложение такси из Google Play</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                2
              </div>
              <p>Получите ссылку для входа в боте</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                3
              </div>
              <p>Войдите в приложение по полученной ссылке</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                4
              </div>
              <p>Используйте бонусы для оплаты поездок</p>
            </div>
          </div>
          <Button className="w-full mt-4" variant="outline">
            Получить ссылку для входа
          </Button>
        </Card>

        {/* User Trips */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Мои поездки ({trips.length})</h2>
            <Button size="sm" className="bg-gradient-ton">
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>
          <div className="space-y-3">
            {tripsLoading ? (
              <Card className="glass-card p-4 text-center">
                <p className="text-muted-foreground">Загрузка поездок...</p>
              </Card>
            ) : trips.length > 0 ? (
              trips.map((trip) => (
                <Card key={trip.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">{trip.from_location} → {trip.to_location}</span>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {getStatusText(trip.status)}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-1">{trip.title}</h4>
                  {trip.description && (
                    <p className="text-xs text-muted-foreground mb-2">{trip.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(trip.departure_date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {trip.bonus_earned && (
                      <span>Заработано: {trip.bonus_earned} бонусов</span>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="glass-card p-6 text-center">
                <p className="text-muted-foreground">У вас пока нет поездок</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Trips;
