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
          "bg-brand hover:bg-brand-hover text-white": variant === "primary",

          "bg-surface hover:bg-zinc-800 border border-border text-text-primary":
            variant === "secondary",

          "hover:bg-surface text-text-secondary": variant === "ghost",
        },

        className,
      )}
      {...props}
    />
  );
}
