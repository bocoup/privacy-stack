import { ReactNode } from "react";

import { cn } from "~/utils";

export default function BrowserMockup({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flow-root", className)}>
      <div className="w-full h-11 rounded-t-lg bg-slate-200 flex justify-start items-center space-x-1.5 px-3 shadow">
        <span className="w-3 h-3 rounded-full bg-red-400"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-400"></span>
      </div>
      <div className="bg-slate-200 border-t-0 w-full p-0.5 rounded-b-md">
        {children}
      </div>
    </div>
  );
}
