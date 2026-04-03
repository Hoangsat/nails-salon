import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

const feedbackPanelVariants = cva("rounded-[calc(var(--radius)-0.25rem)] border px-4 py-4 text-sm shadow-sm", {
  variants: {
    variant: {
      default: "border-border/70 bg-background/85 text-muted-foreground",
      info: "border-primary/20 bg-primary/8 text-foreground",
      success: "border-emerald-200 bg-emerald-50 text-emerald-800",
      warning: "border-amber-200 bg-amber-50 text-amber-800",
      error: "border-rose-200 bg-rose-50 text-rose-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type FeedbackPanelProps = PropsWithChildren<
  VariantProps<typeof feedbackPanelVariants> & {
    title?: string;
    icon?: ReactNode;
    className?: string;
  }
>;

export function FeedbackPanel({ title, icon, variant, className, children }: FeedbackPanelProps) {
  return (
    <div className={cn(feedbackPanelVariants({ variant }), className)}>
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}
        <div className="space-y-1.5">
          {title ? <p className="font-medium text-foreground">{title}</p> : null}
          <div className="leading-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
