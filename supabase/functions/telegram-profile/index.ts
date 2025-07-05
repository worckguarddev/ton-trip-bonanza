
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!telegramToken) {
      throw new Error('TELEGRAM_BOT_TOKEN не найден');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase конфигурация не найдена');
    }

    // Создаем Supabase клиент с service key для обхода RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        
        const profileData = await profileResponse.json();
        result = profileData;

        // Сохраняем/обновляем пользователя в базе данных
        if (profileData.ok && profileData.result) {
          const userData = profileData.result;
          
          const { error: upsertError } = await supabase
            .from('telegram_users')
            .upsert({
              telegram_id: userData.id,
              first_name: userData.first_name || '',
              last_name: userData.last_name || null,
              username: userData.username || null,
              language_code: userData.language_code || null,
              bio: userData.bio || null,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'telegram_id'
            });

          if (upsertError) {
            console.error('Ошибка сохранения пользователя:', upsertError);
          } else {
            console.log('Пользователь сохранен в базе данных');
          }
        }
        break;

      case 'checkSubscription':
        // Проверка подписки на канал TonTripBonanza
        const channelId = '@TonTripBonanza';
        
        const subscriptionResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/getChatMember?chat_id=${channelId}&user_id=${userId}`
        );
        
        if (!subscriptionResponse.ok) {
          throw new Error(`Ошибка проверки подписки: ${subscriptionResponse.statusText}`);
        }
        
        const subscriptionData = await subscriptionResponse.json();
        const isSubscribed = ['member', 'administrator', 'creator'].includes(
          subscriptionData.result?.status
        );
        
        result = {
          isSubscribed: isSubscribed
        };

        // Обновляем статус подписки в базе данных
        const { error: updateError } = await supabase
          .from('telegram_users')
          .update({
            is_subscribed: isSubscribed,
            subscription_checked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('telegram_id', userId);

        if (updateError) {
          console.error('Ошибка обновления статуса подписки:', updateError);
        } else {
          console.log('Статус подписки обновлен в базе данных');
        }
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
