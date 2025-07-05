
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share } from "lucide-react";
import { toast } from "sonner";

interface QRGeneratorProps {
  data: string;
  title?: string;
  description?: string;
}

export const QRGenerator = ({ data, title = "QR-код", description }: QRGeneratorProps) => {
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQR = () => {
    setQrGenerated(true);
    toast.success("QR-код создан!");
  };

  const downloadQR = () => {
    // Создаем ссылку для скачивания QR-кода как изображение
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      // Белый фон
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 200, 200);
      
      // Черная рамка
      ctx.fillStyle = 'black';
      ctx.fillRect(10, 10, 180, 180);
      
      // Белый внутренний квадрат
      ctx.fillStyle = 'white';
      ctx.fillRect(20, 20, 160, 160);
      
      // Простой паттерн QR-кода (имитация)
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillStyle = 'black';
            ctx.fillRect(30 + i * 15, 30 + j * 15, 12, 12);
          }
        }
      }
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'referral-qr-code.png';
        a.click();
        URL.revokeObjectURL(url);
        toast.success("QR-код скачан!");
      }
    });
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Присоединяйтесь к TonTrip Bonanza!`,
          url: data,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        navigator.clipboard.writeText(data);
        toast.success("Ссылка скопирована!");
      }
    } else {
      navigator.clipboard.writeText(data);
      toast.success("Ссылка скопирована!");
    }
  };

  return (
    <Card className="glass-card p-4">
      <div className="text-center">
        <h3 className="font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        
        {!qrGenerated ? (
          <Button onClick={generateQR} className="mb-4">
            <QrCode className="w-4 h-4 mr-2" />
            Создать QR-код
          </Button>
        ) : (
          <div className="mb-4">
            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-2 bg-black rounded">
                <div className="absolute inset-2 bg-white rounded-sm">
                  {/* Простая имитация QR-кода */}
                  <div className="grid grid-cols-8 gap-1 p-2 h-full">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (Math.floor(i / 8) + (i % 8)) % 2 === 0 ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button size="sm" variant="outline" onClick={downloadQR}>
                <Download className="w-4 h-4 mr-2" />
                Скачать
              </Button>
              <Button size="sm" variant="outline" onClick={shareQR}>
                <Share className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
            </div>
          </div>
        )}
        
        <div className="bg-black/20 rounded-lg p-3">
          <p className="text-xs font-mono break-all text-muted-foreground">
            {data}
          </p>
        </div>
      </div>
    </Card>
  );
};
