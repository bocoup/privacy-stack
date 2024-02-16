import { MouseEventHandler, ReactNode } from "react";

import { classNames } from "~/utils";

export default function Button({
  onClick,
  className,
  type,
  children,
}: {
  onClick?: MouseEventHandler;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  children?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={classNames(
        "text-center rounded-md bg-slate-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600",
        className,
      )}
    >
      {children}
    </button>
  );
}
