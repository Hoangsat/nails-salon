import type { PropsWithChildren, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function AdminField({
  label,
  hint,
  children,
  className,
}: PropsWithChildren<{ label: string; hint?: string; className?: string }>) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-border/70 bg-background/80 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-border/70 bg-background/80 px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    />
  );
}

export function AdminCheckboxRow({
  label,
  description,
  inputProps,
}: {
  label: string;
  description?: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm">
      <input {...inputProps} type="checkbox" className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]" />
      <span className="grid gap-1">
        <span className="font-medium text-foreground">{label}</span>
        {description ? <span className="leading-6 text-muted-foreground">{description}</span> : null}
      </span>
    </label>
  );
}

export function AdminHint({ children }: PropsWithChildren) {
  return <p className="text-sm leading-6 text-muted-foreground">{children}</p>;
}

export function AdminDivider() {
  return <div className="h-px w-full bg-border/70" />;
}
