import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full px-3 py-2",
        "bg-surface/60 border border-border/60",
        "rounded-lg",
        "text-text-primary",
        "placeholder:text-text-muted",
        "focus:outline-none",
        "focus:border-brand/50",
        "focus:ring-2 focus:ring-brand/20",
        "transition-colors",
        className,
      )}
      {...props}
    />
  );
}