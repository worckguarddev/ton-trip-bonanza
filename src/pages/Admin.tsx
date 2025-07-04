
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Edit, Trash2, Users, CreditCard, Settings, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    price: "",
    rarity: "common"
  });

  const pendingWithdrawals = [
    {
      id: 1,
      userId: "123456",
      userName: "Иван Петров",
      cardTitle: "Золотая карта VIP",
      walletAddress: "UQBpH-7d8JEH...",
      requestDate: "2024-01-15",
      status: "pending"
    },
    {
      id: 2,
      userId: "789012",
      userName: "Анна Сидорова",
      cardTitle: "Серебряная карта Pro",
      walletAddress: "UQCxY-9f2MKL...",
      requestDate: "2024-01-14",
      status: "pending"
    }
  ];

  const usersList = [
    {
      id: "123456",
      name: "Иван Петров",
      username: "@ivan_petrov",
      balance: { ton: 0.5, bonuses: 1250 },
      cards: 3,
      referrals: 2,
      joinDate: "2024-01-01"
    },
    {
      id: "789012",
      name: "Анна Сидорова",
      username: "@anna_s",
      balance: { ton: 0.2, bonuses: 800 },
      cards: 1,
      referrals: 5,
      joinDate: "2024-01-05"
    }
  ];

  const handleAddCard = () => {
    if (!newCard.title || !newCard.price) {
      toast.error("Заполните все обязательные поля");
      return;
    }
    toast.success("Карта добавлена!");
    setNewCard({ title: "", description: "", price: "", rarity: "common" });
  };

  const handleApproveWithdrawal = (id: number) => {
    toast.success("Заявка на вывод одобрена");
  };

  const handleRejectWithdrawal = (id: number) => {
    toast.error("Заявка на вывод отклонена");
  };

  const handleUpdateBalance = (userId: string, type: 'ton' | 'bonuses', amount: number) => {
    toast.success(`Баланс пользователя обновлен: +${amount} ${type === 'ton' ? 'TON' : 'бонусов'}`);
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
          <h1 className="text-2xl font-bold">Админ панель</h1>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="cards" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="cards">Карты</TabsTrigger>
            <TabsTrigger value="withdrawals">Заявки</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
          </TabsList>

          {/* Cards Management */}
          <TabsContent value="cards" className="space-y-4">
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Добавить новую карту
              </h3>
              <div className="space-y-3">
                <Input
                  placeholder="Название карты"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                />
                <Textarea
                  placeholder="Описание карты"
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                />
                <Input
                  placeholder="Цена в TON"
                  type="number"
                  step="0.01"
                  value={newCard.price}
                  onChange={(e) => setNewCard({ ...newCard, price: e.target.value })}
                />
                <select
                  className="w-full p-2 rounded-md bg-background border border-border"
                  value={newCard.rarity}
                  onChange={(e) => setNewCard({ ...newCard, rarity: e.target.value })}
                >
                  <option value="common">Обычная</option>
                  <option value="rare">Редкая</option>
                  <option value="epic">Эпическая</option>
                  <option value="legendary">Легендарная</option>
                </select>
                <Button onClick={handleAddCard} className="w-full">
                  Добавить карту
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Withdrawals Management */}
          <TabsContent value="withdrawals" className="space-y-4">
            <h3 className="font-semibold mb-4">Заявки на вывод</h3>
            {pendingWithdrawals.map((withdrawal) => (
              <Card key={withdrawal.id} className="glass-card p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{withdrawal.userName}</h4>
                    <Badge variant="outline">#{withdrawal.userId}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{withdrawal.cardTitle}</p>
                  <p className="text-xs font-mono text-muted-foreground mb-2">
                    {withdrawal.walletAddress}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Заявка от {new Date(withdrawal.requestDate).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveWithdrawal(withdrawal.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Одобрить
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleRejectWithdrawal(withdrawal.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Отклонить
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-4">
            <h3 className="font-semibold mb-4">Управление пользователями</h3>
            {usersList.map((user) => (
              <Card key={user.id} className="glass-card p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{user.name}</h4>
                    <Badge variant="outline">#{user.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>TON: {user.balance.ton}</div>
                    <div>Бонусы: {user.balance.bonuses}</div>
                    <div>Карт: {user.cards}</div>
                    <div>Рефералы: {user.referrals}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleUpdateBalance(user.id, 'bonuses', 100)}
                  >
                    +100 бонусов
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleUpdateBalance(user.id, 'ton', 0.01)}
                  >
                    +0.01 TON
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Admin;
