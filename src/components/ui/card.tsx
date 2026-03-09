import clsx from "clsx";
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-zinc-900/60 border border-white/5 rounded-xl p-6 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
