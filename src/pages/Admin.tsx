
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Check, X, Settings, Users, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"cards" | "withdrawals" | "users">("cards");

  // Mock data for admin panel
  const pendingWithdrawals = [
    {
      id: 1,
      userId: "123456",
      username: "crypto_user",
      cardTitle: "Rare TON Card #001",
      walletAddress: "EQBoMnDj6u1IJWTFGMnlr_Tx5YRXs--aiKyktlOQLyziWJu3",
      requestDate: "2024-01-15"
    }
  ];

  const usersList = [
    {
      id: "123456",
      username: "crypto_user",
      firstName: "Александр",
      bonusBalance: 1250,
      tonBalance: 0.5,
      nftCards: 2,
      joinDate: "2024-01-10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Админ-панель</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("cards")}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Карты
          </Button>
          <Button
            variant={activeTab === "withdrawals" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("withdrawals")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Заявки
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("users")}
          >
            <Users className="w-4 h-4 mr-2" />
            Пользователи
          </Button>
        </div>

        {/* Cards Management */}
        {activeTab === "cards" && (
          <div className="space-y-4">
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Управление картами</h3>
                <Button size="sm" className="bg-gradient-ton">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить карту
                </Button>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Название карты</label>
                  <Input placeholder="Введите название" className="bg-black/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Описание</label>
                  <Input placeholder="Описание (до 33 символов)" className="bg-black/20" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Цена</label>
                    <Input placeholder="0.5" className="bg-black/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Валюта</label>
                    <Input placeholder="TON" className="bg-black/20" />
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Сохранить карту
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Withdrawal Requests */}
        {activeTab === "withdrawals" && (
          <div className="space-y-4">
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-4">Заявки на вывод</h3>
              {pendingWithdrawals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Нет активных заявок
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingWithdrawals.map((withdrawal) => (
                    <Card key={withdrawal.id} className="bg-black/20 p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-sm">{withdrawal.cardTitle}</h4>
                          <p className="text-xs text-muted-foreground">
                            @{withdrawal.username} (ID: {withdrawal.userId})
                          </p>
                        </div>
                        <Badge variant="secondary">Ожидает</Badge>
                      </div>
                      <div className="bg-black/20 rounded p-2 mb-3">
                        <p className="text-xs font-mono break-all text-muted-foreground">
                          {withdrawal.walletAddress}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                          <Check className="w-4 h-4 mr-1" />
                          Одобрить
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1">
                          <X className="w-4 h-4 mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-4">Пользователи</h3>
              <div className="space-y-3">
                {usersList.map((user) => (
                  <Card key={user.id} className="bg-black/20 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{user.firstName}</h4>
                        <p className="text-xs text-muted-foreground">
                          @{user.username} (ID: {user.id})
                        </p>
                      </div>
                      <Badge variant="secondary">Активен</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">{user.bonusBalance}</div>
                        <div className="text-muted-foreground">Бонусы</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{user.tonBalance}</div>
                        <div className="text-muted-foreground">TON</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{user.nftCards}</div>
                        <div className="text-muted-foreground">NFT</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Изменить баланс" 
                          className="bg-black/20 text-xs h-8" 
                        />
                        <Button size="sm" variant="outline" className="text-xs">
                          Обновить
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default Admin;
