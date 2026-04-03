import { Badge } from "@/components/ui/badge";

const statusClasses: Record<string, string> = {
  confirmed: "border-emerald-300 bg-emerald-50 text-emerald-700",
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  cancelled: "border-rose-300 bg-rose-50 text-rose-700",
  completed: "border-sky-300 bg-sky-50 text-sky-700",
  no_show: "border-zinc-300 bg-zinc-100 text-zinc-700",
};

export function BookingStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={statusClasses[status] ?? "border-border bg-secondary text-secondary-foreground"}
      variant="outline"
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
