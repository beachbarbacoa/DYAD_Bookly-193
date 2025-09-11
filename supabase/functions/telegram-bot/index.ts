import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

serve(async (req) => {
  try {
    const body = await req.json()
    const chatId = body.message.chat.id
    const text = body.message.text

    // Handle /start command
    if (text === '/start') {
      await sendMessage(chatId, 
        `Welcome to Bookly Bot! Use these commands:
        /link - Get your business dashboard link
        /stats - View booking stats
        /help - Show help menu`
      )
    }

    // Handle business linking
    if (text === '/link') {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      )
      
      const { data } = await supabase
        .from('business_telegram_configs')
        .select('business_id')
        .eq('telegram_chat_id', chatId)
        .single()

      if (data) {
        await sendMessage(chatId, 
          `Your business dashboard: ${Deno.env.get("SITE_URL")}/business/dashboard?id=${data.business_id}`
        )
      } else {
        await sendMessage(chatId, 
          "No business linked. Please connect in your Bookly settings first."
        )
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})

async function sendMessage(chatId: string, text: string) {
  const response = await fetch(`${API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    })
  })
  return await response.json()
}