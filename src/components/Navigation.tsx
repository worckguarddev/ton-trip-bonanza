
import { Link, useLocation } from "react-router-dom";
import { Gift, Car, Users, User } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Gift, label: "Карты", path: "/cards" },
    { icon: Car, label: "Поездки", path: "/trips" },
    { icon: Users, label: "Рефералы", path: "/referrals" },
    { icon: User, label: "Профиль", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
