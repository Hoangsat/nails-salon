"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";

import { FeedbackPanel } from "@/components/ui/feedback-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ANY_AVAILABLE_STAFF_ID } from "@/lib/booking/constants";
import { formatCurrency, formatDuration } from "@/lib/data/formatters";
import { cn } from "@/lib/utils";
import type {
  BookingAvailabilityResponse,
  BookingCreateResponse,
  BookingPageProps,
  StaffSelectionValue,
} from "@/types/booking";

const fieldClasses =
  "h-12 w-full rounded-2xl border border-border/70 bg-background/80 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClasses =
  "min-h-28 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

export function BookingFlow({ salon, minBookingDate, services, staff }: BookingPageProps) {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [staffSelection, setStaffSelection] = useState<StaffSelectionValue>(ANY_AVAILABLE_STAFF_ID);
  const [bookingDate, setBookingDate] = useState(minBookingDate);
  const [selectedSlotStartAt, setSelectedSlotStartAt] = useState("");
  const [availability, setAvailability] = useState<BookingAvailabilityResponse | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [customerFullName, setCustomerFullName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0],
    [selectedServiceId, services],
  );

  const eligibleStaff = useMemo(() => {
    if (!selectedService) {
      return [];
    }

    return staff.filter((member) => selectedService.staffIds.includes(member.id));
  }, [selectedService, staff]);

  const selectedAddons = useMemo(
    () => selectedService?.addons.filter((addon) => selectedAddonIds.includes(addon.id)) ?? [],
    [selectedAddonIds, selectedService],
  );

  const selectedSlot = useMemo(
    () => availability?.slots.find((slot) => slot.startAt === selectedSlotStartAt) ?? null,
    [availability?.slots, selectedSlotStartAt],
  );

  const customerValidation = {
    fullName: customerFullName.trim().length > 1,
    email: customerEmail.trim().includes("@"),
    phone: customerPhone.trim().length > 3,
  };

  const hasEligibleStaff = eligibleStaff.length > 0;
  const quoteTotal =
    selectedSlot?.totalPriceCents ?? availability?.quote.totalPriceCents ?? selectedService?.priceFromCents ?? 0;
  const quoteDuration =
    selectedSlot?.totalDurationMinutes ??
    availability?.quote.totalDurationMinutes ??
    selectedService?.durationMinutes ??
    0;

  const canSubmit =
    !!selectedService &&
    !!selectedSlot &&
    customerValidation.fullName &&
    customerValidation.email &&
    customerValidation.phone &&
    !slotsLoading &&
    !isSubmitting;

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    setSelectedAddonIds((current) =>
      current.filter((addonId) => selectedService.addons.some((addon) => addon.id === addonId)),
    );

    if (
      staffSelection !== ANY_AVAILABLE_STAFF_ID &&
      !eligibleStaff.some((member) => member.id === staffSelection)
    ) {
      setStaffSelection(ANY_AVAILABLE_STAFF_ID);
    }
  }, [eligibleStaff, selectedService, staffSelection]);

  useEffect(() => {
    if (!selectedService || !bookingDate) {
      return;
    }

    let isCancelled = false;

    async function loadAvailability() {
      setSlotsLoading(true);
      setSlotsError(null);
      setSelectedSlotStartAt("");

      try {
        const response = await fetch("/api/booking/availability", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salonId: salon.id,
            serviceId: selectedService.id,
            addonIds: selectedAddonIds,
            bookingDate,
            staffSelection,
          }),
        });

        const data = (await response.json()) as BookingAvailabilityResponse & { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load available slots.");
        }

        if (!isCancelled) {
          setAvailability(data);
        }
      } catch (error) {
        if (!isCancelled) {
          setAvailability(null);
          setSlotsError(error instanceof Error ? error.message : "Unable to load available slots.");
        }
      } finally {
        if (!isCancelled) {
          setSlotsLoading(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      isCancelled = true;
    };
  }, [bookingDate, salon.id, selectedAddonIds, selectedService, staffSelection]);

  async function handleSubmit() {
    setShowValidation(true);

    if (!selectedService || !selectedSlot || !customerValidation.fullName || !customerValidation.email || !customerValidation.phone) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salonId: salon.id,
          serviceId: selectedService.id,
          addonIds: selectedAddonIds,
          bookingDate,
          selectedSlotStartAt: selectedSlot.startAt,
          staffSelection,
          customerFullName,
          customerEmail,
          customerPhone,
          customerNotes,
        }),
      });

      const data = (await response.json()) as BookingCreateResponse & { error?: string };

      if (!response.ok || !data.bookingId) {
        throw new Error(data.error ?? "Unable to confirm booking.");
      }

      const query = new URLSearchParams({ bookingId: data.bookingId });
      if (data.notificationStatus) {
        query.set("emailStatus", data.notificationStatus);
      }
      if (data.notificationMessage) {
        query.set("emailMessage", data.notificationMessage);
      }

      router.push(`/booking/success?${query.toString()}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to confirm booking.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!services.length) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardDescription>Booking</CardDescription>
              <CardTitle>No services are currently bookable</CardTitle>
            </CardHeader>
            <CardContent>
              <FeedbackPanel
                variant="warning"
                title="The booking flow is ready, but the catalogue needs at least one active service."
                icon={<AlertCircle className="h-4 w-4" />}
              >
                Add active services and staff-service links in the admin to begin accepting appointments.
              </FeedbackPanel>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.2fr,0.8fr] lg:px-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardDescription>1. Select a service</CardDescription>
              <CardTitle>Choose the appointment foundation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {services.map((service) => {
                const active = service.id === selectedService?.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={cn(
                      "rounded-[calc(var(--radius)-0.4rem)] border p-4 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border/70 bg-background/80 hover:bg-secondary/40",
                    )}
                  >
                    <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                      {service.category}
                    </p>
                    <p className="mt-2 font-medium text-foreground">{service.name}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {service.shortDescription ?? service.description}
                    </p>
                    <p className="mt-3 text-sm text-foreground">
                      {formatCurrency(service.priceFromCents, salon.currencyCode)} / {formatDuration(service.durationMinutes)}
                    </p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>2. Add-ons</CardDescription>
              <CardTitle>Customize the appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedService?.addons.length ? (
                selectedService.addons.map((addon) => {
                  const checked = selectedAddonIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={cn(
                        "flex cursor-pointer items-start justify-between gap-4 rounded-[calc(var(--radius)-0.4rem)] border p-4",
                        checked ? "border-primary bg-primary/5" : "border-border/70 bg-background/80",
                      )}
                    >
                      <div>
                        <p className="font-medium text-foreground">{addon.name}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{addon.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-muted-foreground">
                          + {formatCurrency(addon.priceCents, salon.currencyCode)} / {formatDuration(addon.durationMinutes)}
                        </p>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedAddonIds((current) =>
                              checked
                                ? current.filter((id) => id !== addon.id)
                                : [...current, addon.id],
                            )
                          }
                          className="h-4 w-4 accent-[hsl(var(--primary))]"
                        />
                      </div>
                    </label>
                  );
                })
              ) : (
                <FeedbackPanel title="No add-ons linked to this service yet.">
                  You can still continue with the main appointment exactly as priced above.
                </FeedbackPanel>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>3. Choose your artist</CardDescription>
              <CardTitle>Specific artist or any available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasEligibleStaff ? (
                <FeedbackPanel
                  variant="warning"
                  title="This service is not assigned to a live team member yet."
                  icon={<AlertCircle className="h-4 w-4" />}
                >
                  Assign at least one staff member to <span className="font-medium text-foreground">{selectedService?.name}</span> in the admin before taking live bookings for it.
                </FeedbackPanel>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setStaffSelection(ANY_AVAILABLE_STAFF_ID)}
                  className={cn(
                    "rounded-[calc(var(--radius)-0.4rem)] border p-4 text-left transition-colors",
                    staffSelection === ANY_AVAILABLE_STAFF_ID
                      ? "border-primary bg-primary/5"
                      : "border-border/70 bg-background/80 hover:bg-secondary/40",
                  )}
                >
                  <p className="font-medium text-foreground">Any available</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    We will choose a valid artist for the selected slot.
                  </p>
                </button>

                {eligibleStaff.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setStaffSelection(member.id)}
                    className={cn(
                      "rounded-[calc(var(--radius)-0.4rem)] border p-4 text-left transition-colors",
                      staffSelection === member.id
                        ? "border-primary bg-primary/5"
                        : "border-border/70 bg-background/80 hover:bg-secondary/40",
                    )}
                  >
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-secondary/50">
                      {member.profileImageUrl ? (
                        <Image
                          src={member.profileImageUrl}
                          alt={member.displayName}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="font-medium text-foreground">{member.displayName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardDescription>4. Select a date</CardDescription>
                <CardTitle>Pick your preferred day</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  type="date"
                  value={bookingDate}
                  min={minBookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  className={fieldClasses}
                />
                <p className="text-sm leading-6 text-muted-foreground">
                  Availability refreshes automatically as you change service, add-ons, date, or artist preference.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>5. Choose a slot</CardDescription>
                <CardTitle>Available times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {slotsLoading ? (
                  <FeedbackPanel
                    variant="info"
                    title="Refreshing live availability"
                    icon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                  >
                    Checking {selectedService?.name.toLowerCase()} availability for {bookingDate} now.
                  </FeedbackPanel>
                ) : null}
                {slotsError ? (
                  <FeedbackPanel variant="error" title="We could not load slots just now." icon={<AlertCircle className="h-4 w-4" />}>
                    {slotsError}
                  </FeedbackPanel>
                ) : null}
                {!slotsLoading && !slotsError && !hasEligibleStaff ? (
                  <FeedbackPanel variant="warning" title="No slots can be shown for this service yet." icon={<AlertCircle className="h-4 w-4" />}>
                    Once an eligible staff member is assigned, this date view will begin returning live bookable times.
                  </FeedbackPanel>
                ) : null}
                {!slotsLoading && !slotsError && hasEligibleStaff && !availability?.slots.length ? (
                  <FeedbackPanel variant="warning" title="No bookable slots were found for this date." icon={<CalendarDays className="h-4 w-4" />}>
                    Try another day or switch to any available to widen the search.
                  </FeedbackPanel>
                ) : null}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availability?.slots.map((slot) => (
                    <button
                      key={slot.startAt}
                      type="button"
                      onClick={() => setSelectedSlotStartAt(slot.startAt)}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                        slot.startAt === selectedSlotStartAt
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border/70 bg-background/80 text-muted-foreground hover:bg-secondary/40",
                      )}
                    >
                      <p className="font-medium">{slot.label}</p>
                      <p className="mt-1 text-xs">
                        {slot.availableStaffCount > 1 ? `${slot.availableStaffCount} artists available` : slot.assignedStaffName}
                      </p>
                    </button>
                  ))}
                </div>
                {showValidation && !selectedSlot ? (
                  <p className="text-sm text-destructive">Choose an available time to continue.</p>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardDescription>6. Your details</CardDescription>
              <CardTitle>Tell us where to send the confirmation</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-foreground">Full name</span>
                <input
                  value={customerFullName}
                  onChange={(event) => setCustomerFullName(event.target.value)}
                  className={cn(fieldClasses, showValidation && !customerValidation.fullName && "border-destructive")}
                  placeholder="Alex Morgan"
                  autoComplete="name"
                />
                {showValidation && !customerValidation.fullName ? (
                  <p className="text-sm text-destructive">Enter the guest name.</p>
                ) : null}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Email</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  className={cn(fieldClasses, showValidation && !customerValidation.email && "border-destructive")}
                  placeholder="alex@example.com"
                  autoComplete="email"
                />
                {showValidation && !customerValidation.email ? (
                  <p className="text-sm text-destructive">Enter a valid email address.</p>
                ) : null}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Phone</span>
                <input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  className={cn(fieldClasses, showValidation && !customerValidation.phone && "border-destructive")}
                  placeholder="+44 7700 900000"
                  autoComplete="tel"
                />
                {showValidation && !customerValidation.phone ? (
                  <p className="text-sm text-destructive">Enter a contact phone number.</p>
                ) : null}
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-foreground">Notes (optional)</span>
                <textarea
                  value={customerNotes}
                  onChange={(event) => setCustomerNotes(event.target.value)}
                  className={textareaClasses}
                  placeholder="Anything you'd like the studio to know before your appointment"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground">Optional and visible to the salon team only.</p>
              </label>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="lg:sticky lg:top-24 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/15">
            <CardHeader>
              <CardDescription>Review</CardDescription>
              <CardTitle>Appointment summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <FeedbackPanel variant="info" title="Your quote updates live" icon={<Sparkles className="h-4 w-4" />}>
                Final pricing already includes selected add-ons and any staff-specific override returned by availability.
              </FeedbackPanel>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Service</p>
                <p>{selectedService?.name ?? "Select a service"}</p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Add-ons</p>
                <p>{selectedAddons.length ? selectedAddons.map((addon) => addon.name).join(", ") : "No add-ons selected"}</p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Artist</p>
                <p>
                  {staffSelection === ANY_AVAILABLE_STAFF_ID
                    ? selectedSlot?.assignedStaffName ?? "Any available"
                    : eligibleStaff.find((member) => member.id === staffSelection)?.displayName ?? "Select an artist"}
                </p>
              </div>
              <div className="rounded-2xl bg-background/85 p-4">
                <p className="font-medium text-foreground">Date and time</p>
                <p>{selectedSlot ? `${bookingDate} at ${selectedSlot.label}` : bookingDate || "Choose a date"}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-background/85 p-4">
                  <p className="font-medium text-foreground">Estimated total</p>
                  <p>{formatCurrency(quoteTotal, salon.currencyCode)}</p>
                </div>
                <div className="rounded-2xl bg-background/85 p-4">
                  <p className="font-medium text-foreground">Duration</p>
                  <p>{formatDuration(quoteDuration)}</p>
                </div>
              </div>
              <FeedbackPanel title="What happens next" icon={<CheckCircle2 className="h-4 w-4 text-primary" />}>
                Once confirmed, the appointment is saved immediately and a confirmation email is attempted automatically.
              </FeedbackPanel>
              {submitError ? (
                <FeedbackPanel variant="error" title="Booking could not be confirmed." icon={<AlertCircle className="h-4 w-4" />}>
                  {submitError}
                </FeedbackPanel>
              ) : null}
              <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit} size="lg">
                {isSubmitting ? "Confirming appointment..." : "Confirm booking"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
