import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const data = await request.json()

  // Verify availability
  const { count } = await supabase
    .from("reservations")
    .select("*", { count: "exact" })
    .eq("business_id", data.businessId)
    .eq("reservation_time", data.reservationTime)

  if (count && count > 0) {
    return NextResponse.json(
      { error: "That time slot was just booked" },
      { status: 400 }
    )
  }

  // Create reservation
  const { error } = await supabase.from("reservations").insert({
    business_id: data.businessId,
    concierge_id: data.affiliateId, // from URL params if present
    customer_name: data.name,
    customer_email: data.email,
    customer_phone: data.phone,
    reservation_time: data.reservationTime,
    party_size: data.partySize,
    seating_preference: data.seatingPreference,
    requires_pickup: data.requiresPickup,
    special_requests: data.specialRequests,
    status: "confirmed",
    fee_paid: 1.00, // $1 fee
  })

  if (error) {
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}