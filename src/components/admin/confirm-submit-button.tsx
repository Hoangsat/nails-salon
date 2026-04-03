"use client";

import { useFormStatus } from "react-dom";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";

type ConfirmSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  confirmMessage: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function ConfirmSubmitButton({
  label,
  pendingLabel,
  confirmMessage,
  variant = "destructive",
  size = "sm",
  className,
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (pending) {
      return;
    }

    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
    }
  }

  return (
    <Button type="submit" variant={variant} size={size} className={className} disabled={pending} onClick={handleClick}>
      {pending ? pendingLabel ?? `${label}...` : label}
    </Button>
  );
}
