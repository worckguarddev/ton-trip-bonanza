
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Unlink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TONConnectWrapperProps {
  userId: number;
}

const TONConnectWrapper = ({ userId }: TONConnectWrapperProps) => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const previousWalletRef = useRef<string | null>(null);

  useEffect(() => {
    const saveWalletToDatabase = async () => {
      const currentWalletAddress = wallet?.account.address || null;
      
      // Проверяем, изменился ли адрес кошелька
      if (currentWalletAddress !== previousWalletRef.current) {
        previousWalletRef.current = currentWalletAddress;
        
        if (wallet && currentWalletAddress) {
          try {
            console.log('Сохранение кошелька в базу:', currentWalletAddress);
            
            // Сохраняем адрес кошелька в базу данных
            const { error } = await supabase
              .from('telegram_users')
              .update({
                wallet_address: currentWalletAddress,
                wallet_chain: wallet.account.chain,
                updated_at: new Date().toISOString()
              })
              .eq('telegram_id', userId);

            if (error) {
              console.error('Ошибка сохранения кошелька:', error);
            } else {
              console.log('Кошелек успешно сохранен в базу');
              toast.success("TON кошелёк подключен и сохранен!");
            }
          } catch (error) {
            console.error('Ошибка при сохранении кошелька:', error);
            toast.error("Ошибка сохранения кошелька");
          }
        }
      }
    };

    saveWalletToDatabase();
  }, [wallet, userId]);

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      previousWalletRef.current = null;
      
      // Удаляем адрес кошелька из базы данных
      const { error } = await supabase
        .from('telegram_users')
        .update({
          wallet_address: null,
          wallet_chain: null,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_id', userId);

      if (error) {
        console.error('Ошибка удаления кошелька:', error);
      } else {
        toast.success("TON кошелёк отключен");
      }
    } catch (error) {
      console.error('Ошибка отключения кошелька:', error);
      toast.error("Ошибка отключения кошелька");
    }
  };

  if (wallet) {
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
                {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
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
          Подключение необходимо для работы с блокчейном и получения дополнительных возможностей
        </p>
        <TonConnectButton className="w-full" />
      </div>
    </Card>
  );
};

interface TONConnectButtonProps {
  userId: number;
}

export const TONConnectButton = ({ userId }: TONConnectButtonProps) => {
  const manifestUrl = 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json';

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <TONConnectWrapper userId={userId} />
    </TonConnectUIProvider>
  );
};
