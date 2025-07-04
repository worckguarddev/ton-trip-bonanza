
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Link, Unlink } from "lucide-react";
import { toast } from "sonner";

interface TONConnectButtonProps {
  isConnected?: boolean;
  address?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const TONConnectButton = ({ 
  isConnected = false, 
  address = "",
  onConnect,
  onDisconnect 
}: TONConnectButtonProps) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Здесь будет интеграция с TON Connect
      toast.success("TON кошелёк подключен!");
      onConnect?.();
    } catch (error) {
      toast.error("Ошибка подключения кошелька");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    toast.success("TON кошелёк отключен");
    onDisconnect?.();
  };

  if (isConnected) {
    return (
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-ton rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">TON кошелёк подключен</p>
              <p className="text-xs text-muted-foreground font-mono">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDisconnect}
          >
            <Unlink className="w-4 h-4 mr-2" />
            Отключить
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-4">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-ton rounded-full flex items-center justify-center">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-semibold mb-2">Подключите TON кошелёк</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Для покупки карт и вывода в блокчейн необходимо подключить кошелёк
        </p>
        <Button 
          className="w-full bg-gradient-ton"
          onClick={handleConnect}
          disabled={connecting}
        >
          <Link className="w-4 h-4 mr-2" />
          {connecting ? "Подключение..." : "Подключить кошелёк"}
        </Button>
      </div>
    </Card>
  );
};
