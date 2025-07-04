
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wallet, User, Settings, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const userInfo = {
    id: "123456789",
    username: "crypto_user",
    firstName: "Александр",
    walletAddress: walletConnected ? "EQBoMnDj6u1IJWTFGMnlr_Tx5YRXs--aiKyktlOQLyziWJu3" : null
  };

  const connectWallet = () => {
    // В реальном приложении здесь будет интеграция с TON Connect
    setWalletConnected(true);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
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
          <h1 className="text-2xl font-bold">Профиль</h1>
        </div>

        {/* User Info */}
        <Card className="glass-card p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-ton rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{userInfo.firstName}</h2>
              <p className="text-sm text-muted-foreground">@{userInfo.username}</p>
              <p className="text-xs text-muted-foreground">ID: {userInfo.id}</p>
            </div>
          </div>
        </Card>

        {/* Wallet Section */}
        <Card className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-5 h-5 text-ton-blue" />
            <h3 className="font-semibold">TON Кошелёк</h3>
          </div>
          
          {walletConnected ? (
            <div>
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <p className="text-xs font-mono break-all text-muted-foreground">
                  {userInfo.walletAddress}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={disconnectWallet}>
                  Отвязать адрес
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Подключите кошелёк для вывода карт и управления средствами
              </p>
              <Button className="w-full bg-gradient-ton" onClick={connectWallet}>
                Подключить TON Connect
              </Button>
            </div>
          )}
        </Card>

        {/* Account Stats */}
        <Card className="glass-card p-4 mb-6">
          <h3 className="font-semibold mb-4">Статистика аккаунта</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">12</div>
              <div className="text-xs text-muted-foreground">NFT карт</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">3</div>
              <div className="text-xs text-muted-foreground">Бонусных карт</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">5</div>
              <div className="text-xs text-muted-foreground">Рефералов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">48</div>
              <div className="text-xs text-muted-foreground">Поездок</div>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Настройки</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Уведомления</span>
              <Badge variant="secondary">Включены</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Автообновление баланса</span>
              <Badge variant="secondary">Включено</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Приватность профиля</span>
              <Badge variant="secondary">Публичный</Badge>
            </div>
          </div>
        </Card>

        {/* Admin Access */}
        {isAdmin && (
          <Card className="glass-card p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold">Администрирование</h3>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="w-full">
                Панель администратора
              </Button>
            </Link>
          </Card>
        )}

        {/* Support */}
        <Card className="glass-card p-4 mb-6">
          <h3 className="font-semibold mb-3">Поддержка</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Канал поддержки
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Чат сообщества
            </Button>
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
