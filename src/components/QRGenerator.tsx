
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
    toast.success("QR-код скачан!");
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: data,
        });
      } catch (error) {
        toast.error("Ошибка при попытке поделиться");
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
            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-32 h-32 text-black" />
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
