
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Coins, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Cards = () => {
  const [activeTab, setActiveTab] = useState<"nft" | "bonus">("nft");

  const nftCards = [
    {
      id: 1,
      title: "Rare TON Card #001",
      description: "Эксклюзивная карта с особыми привилегиями",
      price: 0.5,
      currency: "TON",
      rarity: "Rare",
      image: "/placeholder.svg",
      owned: false
    },
    {
      id: 2,
      title: "Epic TON Card #025",
      description: "Редкая карта с уникальным дизайном",
      price: 1.2,
      currency: "TON",
      rarity: "Epic",
      image: "/placeholder.svg",
      owned: true
    }
  ];

  const bonusCards = [
    {
      id: 1,
      title: "Базовая бонусная карта",
      description: "Стандартные привилегии для поездок",
      price: 500,
      currency: "бонусов",
      benefits: ["5% скидка", "Приоритет в очереди"],
      image: "/placeholder.svg",
      owned: false
    },
    {
      id: 2,
      title: "Премиум карта",
      description: "Расширенные возможности",
      price: 1200,
      currency: "бонусов",
      benefits: ["15% скидка", "VIP поддержка", "Бесплатная отмена"],
      image: "/placeholder.svg",
      owned: true
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-500";
      case "Rare": return "bg-blue-500";
      case "Epic": return "bg-purple-500";
      case "Legendary": return "bg-orange-500";
      default: return "bg-gray-500";
    }
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
          <h1 className="text-2xl font-bold">Карты</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "nft" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActiveTab("nft")}
          >
            NFT Карты
          </Button>
          <Button
            variant={activeTab === "bonus" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActiveTab("bonus")}
          >
            Бонусные карты
          </Button>
        </div>

        {/* NFT Cards */}
        {activeTab === "nft" && (
          <div className="space-y-4">
            {nftCards.map((card) => (
              <Card key={card.id} className="glass-card p-4 animate-fade-in">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-nft rounded-lg flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{card.title}</h3>
                      <Badge className={`${getRarityColor(card.rarity)} text-white text-xs`}>
                        {card.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{card.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-ton-blue" />
                        <span className="text-sm font-medium">{card.price} {card.currency}</span>
                      </div>
                      {card.owned ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Вывести
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Сдать в аренду
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" className="bg-gradient-ton">
                          Купить
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Bonus Cards */}
        {activeTab === "bonus" && (
          <div className="space-y-4">
            {bonusCards.map((card) => (
              <Card key={card.id} className="glass-card p-4 animate-fade-in">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-bonus rounded-lg flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">{card.price} {card.currency}</span>
                      </div>
                      {card.owned ? (
                        <Badge className="bg-green-500 text-white">
                          Активна
                        </Badge>
                      ) : (
                        <Button size="sm" className="bg-gradient-bonus">
                          Купить
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Link to GetGems */}
        <Card className="glass-card p-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm mb-1">Маркетплейс GetGems</h3>
              <p className="text-xs text-muted-foreground">Покупайте и продавайте NFT</p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Открыть
            </Button>
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Cards;
