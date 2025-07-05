
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Bot, Users } from "lucide-react";
import { toast } from "sonner";

interface BotSettingsProps {
  loading: boolean;
}

export const BotSettings = ({ loading }: BotSettingsProps) => {
  const [botToken, setBotToken] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelUrl, setChannelUrl] = useState("");

  const handleSaveBotSettings = async () => {
    if (!botToken.trim()) {
      toast.error("Токен бота обязателен");
      return;
    }

    if (!channelId.trim()) {
      toast.error("ID канала обязателен");
      return;
    }

    try {
      // Here you would typically save to database or environment variables
      // For now, we'll just show success message
      toast.success("Настройки бота сохранены");
      console.log("Bot settings:", {
        botToken,
        channelId,
        channelName,
        channelUrl
      });
    } catch (error) {
      console.error("Error saving bot settings:", error);
      toast.error("Ошибка сохранения настроек");
    }
  };

  return (
    <div className="space-y-4">
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
              placeholder="-1001234567890"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ID канала (начинается с -100 для супергрупп)
            </p>
          </div>
          
          <div>
            <Label htmlFor="channelName">Название канала</Label>
            <Input
              id="channelName"
              placeholder="Мой канал"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="channelUrl">Ссылка на канал</Label>
            <Input
              id="channelUrl"
              placeholder="https://t.me/mychannel"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
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

      {/* Save Button */}
      <Button 
        onClick={handleSaveBotSettings}
        disabled={loading}
        className="w-full"
      >
        <Save className="w-4 h-4 mr-2" />
        {loading ? "Сохранение..." : "Сохранить настройки"}
      </Button>
    </div>
  );
};
