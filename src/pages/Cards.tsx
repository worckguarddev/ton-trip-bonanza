
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NFTCard } from "@/components/NFTCard";
import { TONConnectButton } from "@/components/TONConnectButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cards = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userBalance, setUserBalance] = useState({ ton: 0.5, bonuses: 1250 });

  const nftCards = [
    {
      id: "1",
      title: "Золотая карта VIP",
      description: "Премиум доступ ко всем функциям",
      image: "/placeholder.svg",
      price: 0.1,
      rarity: "legendary" as const,
      owned: false
    },
    {
      id: "2",
      title: "Серебряная карта Pro",
      description: "Расширенные возможности",
      image: "/placeholder.svg",
      price: 0.05,
      rarity: "epic" as const,
      owned: true
    },
    {
      id: "3",
      title: "Бронзовая карта Basic",
      description: "Базовые функции системы",
      image: "/placeholder.svg",
      price: 0.02,
      rarity: "rare" as const,
      owned: false
    }
  ];

  const bonusCards = [
    {
      id: "b1",
      title: "Карта поездок",
      description: "Бонусы на транспорт",
      image: "/placeholder.svg",
      price: 100,
      rarity: "common" as const,
      owned: true
    },
    {
      id: "b2",
      title: "Партнерская карта",
      description: "Скидки у партнеров",
      image: "/placeholder.svg",
      price: 200,
      rarity: "rare" as const,
      owned: false
    }
  ];

  const handlePurchase = (id: string) => {
    if (!isWalletConnected) {
      toast.error("Подключите TON кошелёк для покупки");
      return;
    }
    toast.success("Покупка инициирована");
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
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Бонусные карты</h1>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="glass-card p-3 text-center">
            <Wallet className="w-6 h-6 mx-auto mb-2 text-ton-blue" />
            <div className="text-lg font-bold">{userBalance.ton}</div>
            <div className="text-xs text-muted-foreground">TON</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <Gift className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-bold">{userBalance.bonuses}</div>
            <div className="text-xs text-muted-foreground">Бонусов</div>
          </Card>
        </div>

        {/* TON Connect */}
        <div className="mb-6">
          <TONConnectButton
            isConnected={isWalletConnected}
            address={isWalletConnected ? "UQBpH-..." : ""}
            onConnect={() => setIsWalletConnected(true)}
            onDisconnect={() => setIsWalletConnected(false)}
          />
        </div>

        {/* Cards Tabs */}
        <Tabs defaultValue="nft" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="nft">NFT карты</TabsTrigger>
            <TabsTrigger value="bonus">Бонусные</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nft" className="space-y-4">
            {nftCards.map((card) => (
              <NFTCard
                key={card.id}
                {...card}
                onPurchase={handlePurchase}
                onWithdraw={handleWithdraw}
                onRent={handleRent}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="bonus" className="space-y-4">
            {bonusCards.map((card) => (
              <NFTCard
                key={card.id}
                {...card}
                onPurchase={handlePurchase}
                onWithdraw={handleWithdraw}
                onRent={handleRent}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Cards;
