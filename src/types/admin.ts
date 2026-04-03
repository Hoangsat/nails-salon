import type {
  BlackoutDatesRow,
  BookingServicesRow,
  BookingsRow,
  CustomersRow,
  NotificationsLogRow,
  SalonThemeSettingsRow,
  SalonsRow,
  ServiceAddonsRow,
  ServicesRow,
  StaffRow,
  StaffServicesRow,
  WorkingHoursRow,
} from "@/types/database";

export type AdminContext = {
  salon: SalonsRow;
  isDemoMode: boolean;
};

export type AdminDashboardData = {
  context: AdminContext;
  todayDate: string;
  metrics: {
    appointmentsToday: number;
    upcomingAppointments: number;
    activeServicesCount: number;
    activeStaffCount: number;
  };
  recentBookings: AdminAppointmentListItem[];
};

export type AdminAppointmentListItem = {
  booking: BookingsRow;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  staffName: string | null;
};

export type AdminAppointmentDetail = AdminAppointmentListItem & {
  customer: CustomersRow | null;
  lines: BookingServicesRow[];
};

export type AdminAppointmentsPageData = {
  context: AdminContext;
  dateFilter: string;
  statusFilter: string;
  appointments: AdminAppointmentListItem[];
  selectedAppointment: AdminAppointmentDetail | null;
};

export type AdminCalendarEvent = {
  bookingId: string;
  customerName: string;
  status: BookingsRow["status"];
  startsAt: string;
  endsAt: string;
  totalPriceCents: number;
  staffId: string | null;
  staffName: string | null;
};

export type AdminCalendarColumn = {
  staffId: string;
  staffName: string;
  role: string;
  events: AdminCalendarEvent[];
};

export type AdminCalendarData = {
  context: AdminContext;
  date: string;
  timezone: string;
  range: {
    startHour: number;
    endHour: number;
  };
  columns: AdminCalendarColumn[];
  unassignedEvents: AdminCalendarEvent[];
};

export type AdminCustomerListItem = {
  customer: CustomersRow;
  fullName: string;
  bookingCount: number;
  latestBookingDate: string | null;
};

export type AdminCustomersData = {
  context: AdminContext;
  customers: AdminCustomerListItem[];
};

export type AdminServiceRecord = {
  service: ServicesRow;
  addons: ServiceAddonsRow[];
  assignedStaffIds: string[];
};

export type AdminServicesData = {
  context: AdminContext;
  services: AdminServiceRecord[];
};

export type AdminStaffServiceAssignment = {
  serviceId: string;
  serviceName: string;
  category: string;
  customDurationMinutes: number | null;
  customPriceCents: number | null;
};

export type AdminStaffRecord = {
  staff: StaffRow;
  assignments: AdminStaffServiceAssignment[];
};

export type AdminStaffData = {
  context: AdminContext;
  services: ServicesRow[];
  staff: AdminStaffRecord[];
};

export type AdminSettingsData = {
  context: AdminContext;
  workingHours: WorkingHoursRow[];
  blackoutDates: BlackoutDatesRow[];
  staff: StaffRow[];
};

export type AdminThemeData = {
  context: AdminContext;
  themeSettings: SalonThemeSettingsRow;
};

export type AdminNotificationsData = {
  context: AdminContext;
  notifications: Array<{
    notification: NotificationsLogRow;
    bookingLabel: string | null;
    customerName: string | null;
  }>;
};

export type AdminReferenceData = {
  context: AdminContext;
  services: ServicesRow[];
  staff: StaffRow[];
  workingHours: WorkingHoursRow[];
  blackoutDates: BlackoutDatesRow[];
  themeSettings: SalonThemeSettingsRow;
};

export type StaffServiceLinkInput = Pick<
  StaffServicesRow,
  "service_id" | "custom_duration_minutes" | "custom_price_cents"
>;
