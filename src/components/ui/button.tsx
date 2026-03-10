import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        {
          "bg-primary hover:bg-primary-hover text-white": variant === "primary",

          "bg-card hover:bg-zinc-900 border border-border text-foreground":
            variant === "secondary",

          "hover:bg-card text-muted": variant === "ghost",
        },

        className,
      )}
      {...props}
    />
  );
}
