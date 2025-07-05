
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, action, channelId } = await req.json()
    console.log(`Получен запрос: ${action} для пользователя ${userId}`)
    
    if (channelId) {
      console.log(`ID канала: ${channelId}`)
    }

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN не найден в переменных среды')
      throw new Error('Токен бота не настроен')
    }

    let response
    
    if (action === 'getProfile') {
      // Получение информации о пользователе
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`
      )
      
      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json()
        console.error('Ошибка Telegram API:', errorData)
        throw new Error(errorData.description || 'Ошибка получения профиля')
      }
      
      response = await telegramResponse.json()
      console.log('Получены данные профиля:', response)
      
    } else if (action === 'checkSubscription') {
      // Проверка подписки на канал
      const targetChannelId = channelId || '@TonTripBonanza' // Используем переданный канал или значение по умолчанию
      console.log(`Проверяем подписку пользователя ${userId} на канал ${targetChannelId}`)
      
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${targetChannelId}&user_id=${userId}`
      )
      
      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json()
        console.error('Ошибка проверки подписки:', errorData)
        
        // Если канал не найден или пользователь не является участником
        if (errorData.error_code === 400) {
          response = { 
            ok: true, 
            isSubscribed: false,
            description: 'Пользователь не подписан на канал'
          }
        } else {
          throw new Error(errorData.description || 'Ошибка проверки подписки')
        }
      } else {
        const chatMemberData = await telegramResponse.json()
        console.log('Данные участника канала:', chatMemberData)
        
        const memberStatus = chatMemberData.result?.status
        const isSubscribed = memberStatus && ['member', 'administrator', 'creator'].includes(memberStatus)
        
        response = { 
          ok: true, 
          isSubscribed: isSubscribed,
          status: memberStatus,
          channelId: targetChannelId
        }
        
        console.log(`Статус подписки: ${isSubscribed ? 'подписан' : 'не подписан'} (${memberStatus})`)
      }
      
    } else if (action === 'getProfilePhotos') {
      // Получение фотографий профиля
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
      )
      
      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json()
        console.error('Ошибка получения фото:', errorData)
        throw new Error(errorData.description || 'Ошибка получения фотографий')
      }
      
      response = await telegramResponse.json()
      console.log('Получены фотографии профиля:', response)
      
    } else {
      throw new Error('Неизвестное действие')
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Ошибка в функции telegram-profile:', error)
    
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error.message,
        description: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
