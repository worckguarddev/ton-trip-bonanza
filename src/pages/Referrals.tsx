
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Copy, Gift } from "lucide-react";
import { toast } from "sonner";
import { useReferrals } from "@/hooks/useReferrals";
import { useBalance } from "@/hooks/useBalance";
import { useReferralSystem } from "@/hooks/useReferralSystem";
import { QRGenerator } from "@/components/QRGenerator";
import { TelegramUser } from "@/types/telegram";

const Referrals = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const { referrals, fetchReferrals } = useReferrals();
  const { balance, fetchBalance } = useBalance();
  const { generateReferralLink } = useReferralSystem();

  useEffect(() => {
    const initializeUser = async () => {
      if (window.Telegram?.WebApp) {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
          await fetchReferrals(telegramUser.id);
          await fetchBalance(telegramUser.id);
        }
      } else {
        // Тестовые данные
        const testUser = { id: 123456789, first_name: "Test", last_name: "User" };
        setUser(testUser);
        await fetchReferrals(testUser.id);
        await fetchBalance(testUser.id);
      }
    };

    initializeUser();
  }, []);

  const referralStats = {
    totalReferrals: referrals.filter(r => r.status === 'active').length,
    totalEarned: referrals.reduce((sum, r) => sum + (r.bonus_amount || 0), 0),
    pendingRewards: referrals.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.bonus_amount || 0), 0)
  };

  const referralLink = user ? generateReferralLink(user.id) : "";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Ссылка скопирована!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-4 border border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Реферальная программа</h1>
              <p className="text-xs text-muted-foreground">Приглашайте друзей</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold gradient-text mb-1">
              {referralStats.totalReferrals}
            </div>
            <div className="text-xs text-muted-foreground">Рефералов</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {Math.round(referralStats.totalEarned)}
            </div>
            <div className="text-xs text-muted-foreground">рублей заработано</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {Math.round(referralStats.pendingRewards)}
            </div>
            <div className="text-xs text-muted-foreground">в ожидании</div>
          </Card>
        </div>

        {/* Referral Link with QR */}
        <Card className="glass-card p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Ваша реферальная ссылка</h3>
              <p className="text-xs text-muted-foreground">Приглашайте друзей и получайте 3% с их покупок в рублях</p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <p className="text-xs font-mono break-all text-muted-foreground">
              {referralLink}
            </p>
          </div>

          <div className="mb-4">
            <QRGenerator 
              data={referralLink}
              title="QR-код реферальной ссылки"
              description="Покажите этот QR-код друзьям для быстрого перехода"
            />
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => copyToClipboard(referralLink)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Копировать ссылку
          </Button>
        </Card>

        {/* Reward Rules */}
        <Card className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Условия программы</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Получайте 3% с каждой покупки рефералом в рублях</p>
            <p>• Бонусы начисляются автоматически на рублевый баланс</p>
            <p>• Ссылка формата: t.me/bot?startapp=ref_ВашID</p>
            <p>• Один пользователь может быть приглашен только один раз</p>
          </div>
        </Card>

        {/* Referral History */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">История рефералов</h2>
          <div className="space-y-3">
            {referrals.length > 0 ? (
              referrals.map((referral) => (
                <Card key={referral.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium">ID: {referral.referred_telegram_id}</span>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      +{Math.round(referral.bonus_amount || 0)} рублей
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Присоединился: {new Date(referral.created_at).toLocaleDateString('ru-RU')}</span>
                    <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                      {referral.status === 'active' ? 'Активен' : referral.status === 'pending' ? 'Ожидание' : 'Неактивен'}
                    </Badge>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="glass-card p-6 text-center">
                <p className="text-muted-foreground">У вас пока нет рефералов</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Referrals;
