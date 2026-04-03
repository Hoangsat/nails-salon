"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type AdminSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function AdminSubmitButton({
  label,
  pendingLabel,
  variant = "default",
  size = "default",
  className,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} size={size} className={className} disabled={pending}>
      {pending ? pendingLabel ?? `${label}...` : label}
    </Button>
  );
}
