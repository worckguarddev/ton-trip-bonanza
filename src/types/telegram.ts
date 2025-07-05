
// Unified Telegram WebApp types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramInitDataUnsafe {
  user?: TelegramUser;
  start_param?: string;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
  };
  initDataUnsafe: TelegramInitDataUnsafe;
}

// Single global declaration to avoid conflicts
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
