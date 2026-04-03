import { DateTime } from "luxon";

import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { formatCurrency } from "@/lib/data/formatters";
import type { AdminCalendarData } from "@/types/admin";

const HOUR_HEIGHT = 84;

function getTopOffset(iso: string, date: string, timezone: string, startHour: number) {
  const slot = DateTime.fromISO(iso, { zone: "utc" }).setZone(timezone);
  const dayStart = DateTime.fromISO(date, { zone: timezone }).set({ hour: startHour, minute: 0, second: 0, millisecond: 0 });
  return Math.max(slot.diff(dayStart, "minutes").minutes, 0);
}

function getHeight(startsAt: string, endsAt: string, timezone: string) {
  const start = DateTime.fromISO(startsAt, { zone: "utc" }).setZone(timezone);
  const end = DateTime.fromISO(endsAt, { zone: "utc" }).setZone(timezone);
  return Math.max(end.diff(start, "minutes").minutes, 48);
}

export function CalendarDayView({ data, currencyCode }: { data: AdminCalendarData; currencyCode: string }) {
  const hours = Array.from(
    { length: Math.max(data.range.endHour - data.range.startHour, 1) + 1 },
    (_, index) => data.range.startHour + index,
  );
  const height = Math.max((data.range.endHour - data.range.startHour) * HOUR_HEIGHT, HOUR_HEIGHT * 8);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[840px] rounded-[calc(var(--radius)+0.2rem)] border border-border/70 bg-card/90 shadow-soft backdrop-blur-sm">
        <div className="grid border-b border-border/70" style={{ gridTemplateColumns: `88px repeat(${Math.max(data.columns.length, 1)}, minmax(220px, 1fr))` }}>
          <div className="p-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Time</div>
          {data.columns.map((column) => (
            <div key={column.staffId} className="border-l border-border/70 p-4">
              <p className="font-medium text-foreground">{column.staffName}</p>
              <p className="text-sm text-muted-foreground">{column.role}</p>
            </div>
          ))}
        </div>

        <div className="grid" style={{ gridTemplateColumns: `88px repeat(${Math.max(data.columns.length, 1)}, minmax(220px, 1fr))` }}>
          <div className="relative border-r border-border/70" style={{ height }}>
            {hours.map((hour, index) => (
              <div key={hour} className="absolute inset-x-0" style={{ top: index * HOUR_HEIGHT }}>
                <div className="-translate-y-3 px-3 text-xs text-muted-foreground">{`${hour.toString().padStart(2, "0")}:00`}</div>
              </div>
            ))}
          </div>

          {data.columns.map((column) => (
            <div key={column.staffId} className="relative border-l border-border/70" style={{ height }}>
              {hours.map((hour, index) => (
                <div
                  key={`${column.staffId}-${hour}`}
                  className="absolute inset-x-0 border-t border-dashed border-border/70"
                  style={{ top: index * HOUR_HEIGHT }}
                />
              ))}

              {column.events.map((event) => {
                const top = getTopOffset(event.startsAt, data.date, data.timezone, data.range.startHour);
                const heightValue = getHeight(event.startsAt, event.endsAt, data.timezone);
                const startLabel = DateTime.fromISO(event.startsAt, { zone: "utc" }).setZone(data.timezone).toFormat("HH:mm");
                const endLabel = DateTime.fromISO(event.endsAt, { zone: "utc" }).setZone(data.timezone).toFormat("HH:mm");

                return (
                  <div
                    key={event.bookingId}
                    className="absolute left-3 right-3 overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 p-3 shadow-soft"
                    style={{ top, height: heightValue }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{event.customerName}</p>
                        <p className="text-xs text-muted-foreground">{startLabel} - {endLabel}</p>
                      </div>
                      <BookingStatusBadge status={event.status} />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {formatCurrency(event.totalPriceCents, currencyCode)}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
