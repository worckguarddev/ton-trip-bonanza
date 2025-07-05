
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";

interface BalanceCardProps {
  title: string;
  amount: number;
  currency: string;
  icon: LucideIcon;
  gradient: string;
  onTopUp?: () => void;
}

export const BalanceCard = ({ title, amount, currency, icon: Icon, gradient, onTopUp }: BalanceCardProps) => {
  return (
    <Card className="balance-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{amount}</span>
              <span className="text-sm text-muted-foreground">{currency}</span>
            </div>
          </div>
        </div>
        {onTopUp && (
          <Button size="sm" variant="outline" className="w-10 h-10 rounded-full p-0" onClick={onTopUp}>
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
