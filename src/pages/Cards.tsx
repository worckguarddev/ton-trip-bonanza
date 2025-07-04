import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NFTCard } from "@/components/NFTCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift } from "lucide-react";
import { toast } from "sonner";

const Cards = () => {
  const availableCards = [
    {
      id: "1",
      title: "Золотая карта VIP",
      description: "Премиум доступ ко всем функциям",
      image: "/placeholder.svg",
      price: 5000,
      rarity: "legendary" as const,
      owned: false
    },
    {
      id: "2",
      title: "Серебряная карта Pro",
      description: "Расширенные возможности",
      image: "/placeholder.svg",
      price: 2500,
      rarity: "epic" as const,
      owned: false
    },
    {
      id: "3",
      title: "Бронзовая карта Basic",
      description: "Базовые функции системы",
      image: "/placeholder.svg",
      price: 1000,
      rarity: "rare" as const,
      owned: false
    },
    {
      id: "4",
      title: "Карта поездок",
      description: "Бонусы на транспорт",
      image: "/placeholder.svg",
      price: 500,
      rarity: "common" as const,
      owned: false
    },
    {
      id: "5",
      title: "Партнерская карта",
      description: "Скидки у партнеров",
      image: "/placeholder.svg",
      price: 1500,
      rarity: "rare" as const,
      owned: false
    }
  ];

  const purchasedCards = [
    {
      id: "p1",
      title: "Студенческая карта",
      description: "Скидки для студентов",
      image: "/placeholder.svg",
      price: 300,
      rarity: "common" as const,
      owned: true
    },
    {
      id: "p2",
      title: "Карта лояльности",
      description: "Накопительная система бонусов",
      image: "/placeholder.svg",
      price: 800,
      rarity: "rare" as const,
      owned: true
    }
  ];

  const handlePurchase = (id: string) => {
    toast.success("Карта успешно приобретена!");
  };

  const handleWithdraw = (id: string) => {
    toast.success("Заявка на вывод отправлена администратору");
  };

  const handleRent = (id: string) => {
    toast.success("Карта выставлена на аренду");
  };

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
              <p className="text-xs text-muted-foreground">Управляйте вашими картами</p>
            </div>
          </div>
        </div>

        {/* Cards Tabs */}
        <Tabs defaultValue="available" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="available">Доступные</TabsTrigger>
            <TabsTrigger value="purchased">Мои карты</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4">
            {availableCards.map((card) => (
              <NFTCard
                key={card.id}
                {...card}
                onPurchase={handlePurchase}
                onWithdraw={handleWithdraw}
                onRent={handleRent}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="purchased" className="space-y-4">
            {purchasedCards.length > 0 ? (
              purchasedCards.map((card) => (
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
