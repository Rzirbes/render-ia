import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export function Container({ children }: ContainerProps) {
  return <div className="max-w-6xl mx-auto px-6">{children}</div>;
}
