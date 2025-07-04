
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, MapPin, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Trips = () => {
  const availableBonuses = 1250;
  
  const recentTrips = [
    {
      id: 1,
      from: "Центр города",
      to: "Аэропорт",
      date: "2024-01-15",
      bonusesUsed: 200,
      status: "completed"
    },
    {
      id: 2,
      from: "Дом",
      to: "Офис",
      date: "2024-01-14",
      bonusesUsed: 150,
      status: "completed"
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
          <h1 className="text-2xl font-bold">Бонусные поездки</h1>
        </div>

        {/* Available Bonuses */}
        <Card className="balance-card mb-6 animate-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Доступно бонусов</h2>
            <div className="text-3xl font-bold gradient-text mb-4">
              {availableBonuses.toLocaleString()}
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

        {/* Recent Trips */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Последние поездки</h2>
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <Card key={trip.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">{trip.from} → {trip.to}</span>
                  </div>
                  <Badge className={trip.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                    Завершена
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(trip.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <span>Использовано: {trip.bonusesUsed} бонусов</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Trips;
