
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, action = 'getProfile' } = await req.json();
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');

    if (!telegramToken) {
      throw new Error('TELEGRAM_BOT_TOKEN не найден');
    }

    console.log(`Выполняется действие: ${action} для пользователя: ${userId}`);

    let result;

    switch (action) {
      case 'getProfile':
        // Получение информации о пользователе
        const profileResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/getChat?chat_id=${userId}`
        );
        
        if (!profileResponse.ok) {
          throw new Error(`Ошибка получения профиля: ${profileResponse.statusText}`);
        }
        
        result = await profileResponse.json();
        break;

      case 'checkSubscription':
        const { channelId } = await req.json();
        
        // Проверка подписки на канал
        const subscriptionResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/getChatMember?chat_id=${channelId}&user_id=${userId}`
        );
        
        if (!subscriptionResponse.ok) {
          throw new Error(`Ошибка проверки подписки: ${subscriptionResponse.statusText}`);
        }
        
        const subscriptionData = await subscriptionResponse.json();
        result = {
          isSubscribed: ['member', 'administrator', 'creator'].includes(
            subscriptionData.result?.status
          )
        };
        break;

      case 'getProfilePhotos':
        // Получение фотографий профиля
        const photosResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
        );
        
        if (!photosResponse.ok) {
          throw new Error(`Ошибка получения фото: ${photosResponse.statusText}`);
        }
        
        result = await photosResponse.json();
        break;

      default:
        throw new Error(`Неизвестное действие: ${action}`);
    }

    console.log('Результат:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Ошибка в telegram-profile function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        ok: false 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
