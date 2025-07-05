
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { toast } from "sonner";
import QRCode from 'qrcode';

interface QRGeneratorProps {
  data: string;
  title?: string;
  description?: string;
}

export const QRGenerator = ({ data, title = "QR-код", description }: QRGeneratorProps) => {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const generateQR = async () => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(qrCodeDataUrl);
      setQrGenerated(true);
      toast.success("QR-код создан!");
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error("Ошибка создания QR-кода");
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
          <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center p-2">
            <img 
              src={qrDataUrl} 
              alt="QR Code" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
