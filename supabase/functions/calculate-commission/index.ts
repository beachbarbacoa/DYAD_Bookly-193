import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { reservation_id, business_id, concierge_id } = await req.json()
  
  const { data: commission } = await supabase.rpc('calculate_commission', {
    p_reservation_id: reservation_id,
    p_concierge_id: concierge_id, 
    p_business_id: business_id
  })

  return new Response(JSON.stringify({ commission }), {
    headers: { "Content-Type": "application/json" },
  })
})