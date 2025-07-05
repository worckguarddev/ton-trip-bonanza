
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CreditCard, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QRGenerator } from "./QRGenerator";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopUp: (amount: number) => void;
}

export const TopUpDialog = ({ open, onOpenChange, onTopUp }: TopUpDialogProps) => {
  const [amount, setAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");

  const handleAmountConfirm = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Введите корректную сумму");
      return;
    }
    
    if (numAmount < 100) {
      toast.error("Минимальная сумма пополнения 100 рублей");
      return;
    }

    // Генерируем ссылку для СБП (в реальном приложении это должно быть через API)
    const sbpLink = `https://qr.nspk.ru/AD100004BAI2M8CM4IA1QTT4HG09D4QO6K0?type=02&bank=100000000111&sum=${numAmount}&cur=RUB&crc=AB75`;
    setPaymentLink(sbpLink);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    const numAmount = parseFloat(amount);
    onTopUp(numAmount);
    toast.success(`Баланс пополнен на ${numAmount} рублей`);
    setShowPayment(false);
    setAmount("");
    onOpenChange(false);
  };

  const handleBack = () => {
    setShowPayment(false);
    setPaymentLink("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showPayment ? "Оплата через СБП" : "Пополнение баланса"}
          </DialogTitle>
        </DialogHeader>
        
        {!showPayment ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма пополнения (руб.)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Введите сумму"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="100"
                step="50"
              />
              <p className="text-sm text-muted-foreground">
                Минимальная сумма: 100 рублей
              </p>
            </div>
            
            <div className="grid gap-2">
              <Button 
                onClick={handleAmountConfirm}
                className="w-full flex items-center gap-2"
                disabled={!amount}
              >
                <CreditCard className="w-4 h-4" />
                Продолжить к оплате
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <div className="mb-4">
                <QrCode className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Оплата {amount} рублей</h3>
                <p className="text-sm text-muted-foreground">
                  Отсканируйте QR-код в приложении банка
                </p>
              </div>
              
              <div className="mb-4">
                <QRGenerator data={paymentLink} />
              </div>
              
              <p className="text-xs text-muted-foreground mb-4">
                Или перейдите по ссылке в мобильном банке
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={handlePaymentComplete}
                  className="w-full"
                  variant="default"
                >
                  Я оплатил
                </Button>
                <Button 
                  onClick={handleBack}
                  className="w-full"
                  variant="outline"
                >
                  Назад
                </Button>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
