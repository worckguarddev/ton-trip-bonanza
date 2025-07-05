
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Bot, Users, RefreshCw } from "lucide-react";
import { useBotSettings } from "@/hooks/useBotSettings";

interface BotSettingsProps {
  loading: boolean;
}

export const BotSettings = ({ loading: parentLoading }: BotSettingsProps) => {
  const { settings, loading, saveSettings, loadSettings } = useBotSettings();
  
  const [botToken, setBotToken] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelUrl, setChannelUrl] = useState("");

  // Загружаем данные из настроек при их изменении
  useEffect(() => {
    if (settings) {
      setBotToken(settings.bot_token || "");
      setChannelId(settings.channel_id || "");
      setChannelName(settings.channel_name || "");
      setChannelUrl(settings.channel_url || "");
    }
  }, [settings]);

  const handleSaveBotSettings = async () => {
    if (!botToken.trim()) {
      return;
    }

    if (!channelId.trim()) {
      return;
    }

    await saveSettings({
      bot_token: botToken.trim(),
      channel_id: channelId.trim(),
      channel_name: channelName.trim() || null,
      channel_url: channelUrl.trim() || null
    });
  };

  const handleRefresh = () => {
    loadSettings();
  };

  const isLoading = loading || parentLoading;

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Настройки бота</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {/* Bot Token Settings */}
      <Card className="glass-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Настройки Telegram бота
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="botToken">Токен бота</Label>
            <Input
              id="botToken"
              type="password"
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="font-mono text-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Получите токен у @BotFather в Telegram
            </p>
          </div>
        </div>
      </Card>

      {/* Channel Settings */}
      <Card className="glass-card p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Настройки канала для подписки
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="channelId">ID канала</Label>
            <Input
              id="channelId"
              placeholder="@mychannel или -1001234567890"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="font-mono text-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              ID канала или @username для публичных каналов
            </p>
          </div>
          
          <div>
            <Label htmlFor="channelName">Название канала</Label>
            <Input
              id="channelName"
              placeholder="Мой канал"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="channelUrl">Ссылка на канал</Label>
            <Input
              id="channelUrl"
              placeholder="https://t.me/mychannel"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="glass-card p-4">
        <h4 className="font-medium mb-2">Инструкция по настройке:</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>1. Создайте бота через @BotFather и получите токен</p>
          <p>2. Добавьте бота в ваш канал как администратора</p>
          <p>3. Получите ID канала (можно через @userinfobot)</p>
          <p>4. Укажите публичную ссылку на канал для пользователей</p>
        </div>
      </Card>

      {/* Current Settings Display */}
      {settings && (
        <Card className="glass-card p-4">
          <h4 className="font-medium mb-2">Текущие настройки:</h4>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Канал:</span> {settings.channel_name || 'Не указан'}</p>
            <p><span className="text-muted-foreground">ID:</span> {settings.channel_id || 'Не указан'}</p>
            <p><span className="text-muted-foreground">Токен:</span> {settings.bot_token ? '•••••••••' : 'Не указан'}</p>
            <p className="text-xs text-muted-foreground">
              Обновлено: {new Date(settings.updated_at).toLocaleString('ru-RU')}
            </p>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <Button 
        onClick={handleSaveBotSettings}
        disabled={isLoading || !botToken.trim() || !channelId.trim()}
        className="w-full"
      >
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? "Сохранение..." : "Сохранить настройки"}
      </Button>
    </div>
  );
};
