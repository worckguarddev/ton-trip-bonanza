
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, User, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { useTelegramProfile } from "@/hooks/useTelegramProfile";
import { useReferralSystem } from "@/hooks/useReferralSystem";
import { supabase } from "@/integrations/supabase/client";
import { TelegramUser } from "@/types/telegram";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [telegramProfile, setTelegramProfile] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  
  const { getTelegramProfile, checkSubscription, loading, error } = useTelegramProfile();
  const { initializeReferralSystem } = useReferralSystem();

  // Проверяем, является ли пользователь админом
  const isAdmin = (userId: number) => {
    return userId === 7791568803 || userId === 249835432;
  };

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Index: Инициализация приложения...');
      try {
        // Инициализация Telegram WebApp
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
          
          const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
          if (telegramUser) {
            console.log('Index: Telegram пользователь найден:', telegramUser);
            setUser(telegramUser);
            
            // Инициализируем реферальную систему
            await initializeReferralSystem(telegramUser.id);
            
            // Загружаем профиль пользователя
            await loadTelegramProfile(telegramUser.id);
          } else {
            console.log('Index: Telegram пользователь не найден, используем тестовые данные');
            // Если пользователь не найден в Telegram WebApp, используем тестовые данные
            const testUser = {
              id: 123456789,
              first_name: "Тестовый",
              last_name: "Пользователь",
              username: "testuser"
            };
            setUser(testUser);
            await initializeReferralSystem(testUser.id);
            await loadTelegramProfile(testUser.id);
          }
        } else {
          console.log('Index: Telegram WebApp не обнаружен, используем тестовые данные');
          // Для тестирования без Telegram WebApp
          const testUser = {
            id: 123456789,
            first_name: "Тестовый",
            last_name: "Пользователь",
            username: "testuser"
          };
          setUser(testUser);
          await initializeReferralSystem(testUser.id);
          await loadTelegramProfile(testUser.id);
        }
      } catch (err) {
        console.error('Index: Ошибка инициализации приложения:', err);
        toast.error('Ошибка при загрузке приложения');
      } finally {
        console.log('Index: Инициализация завершена, убираем загрузку');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadTelegramProfile = async (userId: number) => {
    try {
      console.log('Index: Загрузка профиля для пользователя:', userId);
      const profileData = await getTelegramProfile(userId);
      if (profileData && profileData.result) {
        setTelegramProfile(profileData.result);
        console.log('Index: Профиль загружен и сохранен в базе:', profileData.result);
      }
    } catch (err) {
      console.error('Index: Ошибка загрузки профиля:', err);
      toast.error('Не удалось загрузить профиль пользователя');
    }
  };

  const handleSubscriptionCheck = async () => {
    if (!user?.id) {
      toast.error('Пользователь не найден');
      return;
    }

    console.log('Index: Проверяем подписку для пользователя:', user.id);
    
    try {
      const subscribed = await checkSubscription(user.id);
      console.log('Index: Результат проверки подписки:', subscribed);
      
      setIsSubscribed(subscribed);
      setSubscriptionChecked(true);
      
      if (subscribed) {
        console.log('Index: Подписка подтверждена, переходим к картам');
        toast.success('Подписка подтверждена! Переходим к картам...');
        setIsNavigating(true);
        
        // Переход с задержкой для показа сообщения
        setTimeout(() => {
          console.log('Index: Выполняем переход на /cards');
          navigate('/cards');
        }, 1500);
      } else {
        console.log('Index: Подписка не найдена');
        toast.error('Подписка не найдена. Пожалуйста, подпишитесь на канал TonTripBonanza.');
      }
    } catch (err) {
      console.error('Index: Ошибка проверки подписки:', err);
      toast.error('Ошибка при проверке подписки');
      setSubscriptionChecked(true);
    }
  };

  const handleDirectAccess = () => {
    console.log('Index: Прямой доступ к картам');
    setIsNavigating(true);
    navigate('/cards');
  };

  const handleAdminAccess = () => {
    console.log('Index: Переход в админ-панель');
    setIsNavigating(true);
    navigate('/admin');
  };

  if (error) {
    console.error('Index: Ошибка:', error);
  }

  // Показываем загрузку пока проверяем пользователя
  if (isLoading) {
    console.log('Index: Показываем экран загрузки');
    return (
      <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-ton rounded-full flex items-center justify-center animate-pulse">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <p className="text-muted-foreground">Загрузка приложения...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Инициализация пользователя и настроек
          </p>
        </div>
      </div>
    );
  }

  // Показываем экран навигации при переходе
  if (isNavigating) {
    console.log('Index: Показываем экран навигации');
    return (
      <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-ton rounded-full flex items-center justify-center animate-spin">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <p className="text-muted-foreground">Переходим...</p>
        </div>
      </div>
    );
  }

  console.log('Index: Рендерим основной интерфейс', {
    user: user?.id,
    subscriptionChecked,
    isSubscribed
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-ton-dark to-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-ton rounded-full flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            TON Trip Bonanza
          </h1>
          <p className="text-muted-foreground">
            {user ? `Добро пожаловать, ${user.first_name}!` : "Управляйте бонусами и NFT"}
          </p>
        </div>

        {/* Admin Panel Button */}
        {user && isAdmin(user.id) && (
          <Card className="glass-card mb-6 p-4 animate-fade-in">
            <div className="text-center">
              <h3 className="font-semibold mb-3 text-orange-400">Админ доступ</h3>
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={handleAdminAccess}
                disabled={loading}
              >
                <Settings className="w-4 h-4 mr-2" />
                Открыть админ панель
              </Button>
            </div>
          </Card>
        )}

        {/* User Profile Info */}
        {(user || telegramProfile) && (
          <Card className="glass-card mb-6 p-4 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {telegramProfile?.first_name || user?.first_name}
                  {(telegramProfile?.last_name || user?.last_name) && ` ${telegramProfile?.last_name || user?.last_name}`}
                </h3>
                {(telegramProfile?.username || user?.username) && (
                  <p className="text-sm text-muted-foreground">
                    @{telegramProfile?.username || user?.username}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  ID: {user?.id}
                </p>
              </div>
            </div>
            
            {telegramProfile?.bio && (
              <p className="text-sm text-muted-foreground mb-2">
                {telegramProfile.bio}
              </p>
            )}
            
            {loading && (
              <p className="text-sm text-blue-400">Загрузка и сохранение данных профиля...</p>
            )}
            
            {error && (
              <p className="text-sm text-red-400">Ошибка: {error}</p>
            )}
          </Card>
        )}

        {/* Subscription Check */}
        <Card className="glass-card mb-6 p-4 animate-fade-in">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              {subscriptionChecked ? (
                isSubscribed ? (
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 mr-2" />
                )
              ) : null}
              <h2 className="text-lg font-semibold">Подпишитесь на канал</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Для доступа ко всем функциям подпишитесь на канал TonTripBonanza
            </p>
            
            {subscriptionChecked && !isSubscribed && (
              <p className="text-sm text-red-400 mb-4">
                Подписка на TonTripBonanza не найдена. Подпишитесь и попробуйте снова.
              </p>
            )}
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-telegram-blue hover:bg-telegram-blue/80"
                onClick={() => window.open('https://t.me/TonTripBonanza', '_blank')}
              >
                Подписаться
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSubscriptionCheck}
                disabled={loading}
              >
                {loading ? 'Проверяем...' : 'Проверить'}
              </Button>
            </div>
            
            {/* Кнопка для прямого доступа (для тестирования) */}
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-xs"
              onClick={handleDirectAccess}
            >
              Войти без проверки (тест)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
