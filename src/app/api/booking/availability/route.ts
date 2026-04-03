import { NextResponse } from "next/server";

import { BookingError, getBookingAvailability } from "@/lib/data/booking";
import { ANY_AVAILABLE_STAFF_ID } from "@/lib/booking/constants";
import type { BookingAvailabilityRequest } from "@/types/booking";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BookingAvailabilityRequest>;

    const payload: BookingAvailabilityRequest = {
      salonId: body.salonId ?? "",
      serviceId: body.serviceId ?? "",
      addonIds: Array.isArray(body.addonIds) ? body.addonIds : [],
      bookingDate: body.bookingDate ?? "",
      staffSelection: body.staffSelection ?? ANY_AVAILABLE_STAFF_ID,
    };

    const response = await getBookingAvailability(payload);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unexpected availability error." }, { status: 500 });
  }
}
