
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Share, QrCode, Copy, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Referrals = () => {
  const [showQR, setShowQR] = useState(false);
  
  const referralStats = {
    totalReferrals: 5,
    totalEarned: 0.15,
    pendingRewards: 0.08
  };

  const referralLink = "https://t.me/TonTripBonanzaBot?ref=123456";

  const referralHistory = [
    {
      id: 1,
      username: "user123",
      joinDate: "2024-01-10",
      reward: 0.03,
      status: "active"
    },
    {
      id: 2,
      username: "crypto_lover",
      joinDate: "2024-01-08",
      reward: 0.05,
      status: "active"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Ссылка скопирована!");
  };

  const generateQR = () => {
    setShowQR(true);
    toast.success("QR-код создан!");
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
          <h1 className="text-2xl font-bold">Реферальная программа</h1>
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
              {referralStats.totalEarned}
            </div>
            <div className="text-xs text-muted-foreground">TON заработано</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {referralStats.pendingRewards}
            </div>
            <div className="text-xs text-muted-foreground">В ожидании</div>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="glass-card p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Share className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Ваша реферальная ссылка</h3>
              <p className="text-xs text-muted-foreground">Приглашайте друзей и получайте 3% с их покупок</p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <p className="text-xs font-mono break-all text-muted-foreground">
              {referralLink}
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => copyToClipboard(referralLink)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Копировать
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={generateQR}
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR-код
            </Button>
          </div>
        </Card>

        {/* QR Code Display */}
        {showQR && (
          <Card className="glass-card p-4 mb-6 text-center animate-fade-in">
            <h3 className="font-semibold mb-4">QR-код реферальной ссылки</h3>
            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-24 h-24 text-black" />
            </div>
            <p className="text-xs text-muted-foreground">
              Покажите этот QR-код друзьям для быстрого перехода
            </p>
          </Card>
        )}

        {/* Reward Rules */}
        <Card className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Условия программы</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Получайте 3% с каждой покупки рефералом</p>
            <p>• Минимальная сумма для вывода: 0.1 TON</p>
            <p>• Вывод доступен через 1 год после получения</p>
            <p>• Необходимо иметь бонусные и партнерские карты</p>
          </div>
        </Card>

        {/* Referral History */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">История рефералов</h2>
          <div className="space-y-3">
            {referralHistory.map((referral) => (
              <Card key={referral.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">@{referral.username}</span>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    +{referral.reward} TON
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Присоединился: {new Date(referral.joinDate).toLocaleDateString('ru-RU')}</span>
                  <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                    {referral.status === 'active' ? 'Активен' : 'Неактивен'}
                  </Badge>
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

export default Referrals;
