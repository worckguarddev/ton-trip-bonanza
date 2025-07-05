
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";

const Admin = () => {
  const {
    loading,
    createCard,
    updateCard,
    deleteCard,
    getAllCards,
    getAllUsers,
    updateUserBalance,
    getWithdrawalRequests,
    approveWithdrawal,
    rejectWithdrawal
  } = useAdmin();

  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    price: "",
    rarity: "common" as const,
    image_url: ""
  });

  const [cards, setCards] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [editingCard, setEditingCard] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cardsData, usersData, withdrawalsData] = await Promise.all([
      getAllCards(),
      getAllUsers(),
      getWithdrawalRequests()
    ]);
    
    setCards(cardsData);
    setUsers(usersData);
    setWithdrawalRequests(withdrawalsData);
  };

  const handleCreateCard = async () => {
    if (!newCard.title || !newCard.price) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    const success = await createCard({
      title: newCard.title,
      description: newCard.description,
      price: parseFloat(newCard.price),
      rarity: newCard.rarity,
      image_url: newCard.image_url || null
    });

    if (success) {
      setNewCard({ title: "", description: "", price: "", rarity: "common", image_url: "" });
      loadData();
    }
  };

  const handleUpdateCard = async (cardId: string, updates: any) => {
    const success = await updateCard(cardId, updates);
    if (success) {
      setEditingCard(null);
      loadData();
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту карту?')) {
      const success = await deleteCard(cardId);
      if (success) {
        loadData();
      }
    }
  };

  const handleUpdateUserBalance = async (telegramId: number, type: 'rub_balance' | 'bonus_points', amount: number) => {
    const success = await updateUserBalance(telegramId, type, amount);
    if (success) {
      loadData();
    }
  };

  const handleApproveWithdrawal = async (requestId: string) => {
    const success = await approveWithdrawal(requestId);
    if (success) {
      loadData();
    }
  };

  const handleRejectWithdrawal = async (requestId: string) => {
    const success = await rejectWithdrawal(requestId);
    if (success) {
      loadData();
    }
  };

  const toggleCardAvailability = async (cardId: string, currentStatus: boolean) => {
    await handleUpdateCard(cardId, { is_available: !currentStatus });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
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
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="withdrawals">Заявки</TabsTrigger>
          </TabsList>

          {/* Cards Management */}
          <TabsContent value="cards" className="space-y-4">
            {/* Add New Card */}
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Добавить новую карту
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Название карты"
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                />
                <Input
                  placeholder="Цена в рублях"
                  type="number"
                  step="0.01"
                  value={newCard.price}
                  onChange={(e) => setNewCard({ ...newCard, price: e.target.value })}
                />
                <Textarea
                  placeholder="Описание карты"
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  className="md:col-span-2"
                />
                <Input
                  placeholder="URL изображения"
                  value={newCard.image_url}
                  onChange={(e) => setNewCard({ ...newCard, image_url: e.target.value })}
                />
                <select
                  className="w-full p-2 rounded-md bg-background border border-border text-foreground"
                  value={newCard.rarity}
                  onChange={(e) => setNewCard({ ...newCard, rarity: e.target.value as any })}
                >
                  <option value="common">Обычная</option>
                  <option value="rare">Редкая</option>
                  <option value="epic">Эпическая</option>
                  <option value="legendary">Легендарная</option>
                </select>
              </div>
              <Button 
                onClick={handleCreateCard} 
                className="w-full mt-3"
                disabled={loading}
              >
                {loading ? 'Создание...' : 'Добавить карту'}
              </Button>
            </Card>

            {/* Cards List */}
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-4">Управление картами</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Редкость</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell className="font-medium">{card.title}</TableCell>
                        <TableCell>{card.price} ₽</TableCell>
                        <TableCell>
                          <Badge variant="outline">{card.rarity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={card.is_available ? "default" : "secondary"}>
                            {card.is_available ? "Доступна" : "Скрыта"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleCardAvailability(card.id, card.is_available)}
                            >
                              {card.is_available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCard(card)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCard(card.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-4">
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Управление пользователями ({users.length})
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Баланс</TableHead>
                      <TableHead>Карты</TableHead>
                      <TableHead>Рефералы</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name || ''}
                            </div>
                            {user.username && (
                              <div className="text-sm text-muted-foreground">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.telegram_id}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>₽{user.balance?.rub_balance || 0}</div>
                            <div className="text-muted-foreground">
                              Бонусы: {user.balance?.bonus_points || 0}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.cards_count || 0}</TableCell>
                        <TableCell>{user.referrals_count || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateUserBalance(user.telegram_id, 'rub_balance', 100)}
                            >
                              +100₽
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateUserBalance(user.telegram_id, 'bonus_points', 500)}
                            >
                              +500 бонусов
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Withdrawals Management */}
          <TabsContent value="withdrawals" className="space-y-4">
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-4">Заявки на вывод ({withdrawalRequests.length})</h3>
              {withdrawalRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Нет заявок на вывод
                </p>
              ) : (
                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <Card key={request.id} className="glass-card p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{request.user_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Карта: {request.card_title}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground mt-1">
                            {request.blockchain_address}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {new Date(request.requested_at).toLocaleDateString('ru-RU')}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveWithdrawal(request.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleRejectWithdrawal(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Отклонить
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Admin;
