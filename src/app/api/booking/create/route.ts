import { NextResponse } from "next/server";

import { BookingError, createBooking } from "@/lib/data/booking";
import { ANY_AVAILABLE_STAFF_ID } from "@/lib/booking/constants";
import type { BookingCreateRequest } from "@/types/booking";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BookingCreateRequest>;

    const payload: BookingCreateRequest = {
      salonId: body.salonId ?? "",
      serviceId: body.serviceId ?? "",
      addonIds: Array.isArray(body.addonIds) ? body.addonIds : [],
      bookingDate: body.bookingDate ?? "",
      selectedSlotStartAt: body.selectedSlotStartAt ?? "",
      staffSelection: body.staffSelection ?? ANY_AVAILABLE_STAFF_ID,
      customerFullName: body.customerFullName ?? "",
      customerEmail: body.customerEmail ?? "",
      customerPhone: body.customerPhone ?? "",
      customerNotes: body.customerNotes ?? "",
    };

    const response = await createBooking(payload);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unexpected booking creation error." }, { status: 500 });
  }
}
