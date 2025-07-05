
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Index from "./pages/Index";
import Cards from "./pages/Cards";
import Trips from "./pages/Trips";
import Referrals from "./pages/Referrals";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Конфигурация для TON Connect
const tonConnectOptions = {
  manifestUrl: "https://raw.githubusercontent.com/ton-connect/sdk/main/packages/ui/ton-connect-manifest.json"
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TonConnectUIProvider {...tonConnectOptions}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TonConnectUIProvider>
  </QueryClientProvider>
);

export default App;
