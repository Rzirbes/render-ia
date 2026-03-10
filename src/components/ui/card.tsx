import clsx from "clsx";
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx("bg-card border border-border rounded-xl p-6", className)}
    >
      {children}
    </div>
  );
}
