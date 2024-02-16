<button type="submit">Logout</button>;
import { ReactNode } from "react";

import { classNames } from "~/utils";

export default function Pill({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      className={classNames(
        "rounded bg-slate-300 text-xs p-1 text-white-100",
        className,
      )}
    >
      {children}
    </button>
  );
}
