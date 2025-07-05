
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertCircle } from "lucide-react";

interface NFTCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned?: boolean;
  hasWallet?: boolean;
  onPurchase?: (id: string) => void;
  onWithdraw?: (id: string) => void;
  onRent?: (id: string) => void;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const rarityGradients = {
  common: 'from-gray-500 to-gray-600',
  rare: 'from-blue-500 to-blue-600',
  epic: 'from-purple-500 to-purple-600',
  legendary: 'from-yellow-500 to-yellow-600'
};

export const NFTCard = ({ 
  id, 
  title, 
  description, 
  image, 
  price, 
  rarity, 
  owned = false,
  hasWallet = false,
  onPurchase,
  onWithdraw,
  onRent
}: NFTCardProps) => {
  return (
    <Card className="nft-card relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityGradients[rarity]}`} />
      
      <div className="p-4">
        <div className="relative mb-4">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Badge className={`absolute top-2 right-2 ${rarityColors[rarity]} text-white`}>
            {rarity.toUpperCase()}
          </Badge>
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold gradient-text">{price} ₽</span>
          </div>
        </div>

        {owned ? (
          <div className="space-y-2">
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
              onClick={() => onWithdraw?.(id)}
              disabled={!hasWallet}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {hasWallet ? 'Вывести в блокчейн' : 'Подключите кошелёк'}
            </Button>
            {!hasWallet && (
              <div className="flex items-center gap-2 text-xs text-yellow-500">
                <AlertCircle className="w-4 h-4" />
                <span>Для вывода необходимо подключить TON кошелёк</span>
              </div>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onRent?.(id)}
              disabled={!hasWallet}
            >
              {hasWallet ? 'Сдать в аренду' : 'Подключите кошелёк для аренды'}
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full bg-gradient-ton"
            onClick={() => onPurchase?.(id)}
          >
            Купить бонусную карту
          </Button>
        )}
      </div>
    </Card>
  );
};
