import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  NavLink,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { settingsNavigation } from "~/components/navigation";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return json({});
};

export default function SettingsShell() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            {settingsNavigation.map((navItem) => (
              <NavLink
                key={navItem.to}
                to={navItem.to}
                className={({ isActive, isPending }) =>
                  isPending
                    ? "animate-pulse"
                    : isActive
                    ? "font-bold text-primary"
                    : ""
                }
              >
                {navItem.label}
              </NavLink>
            ))}
          </nav>
          <div className="grid gap-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
