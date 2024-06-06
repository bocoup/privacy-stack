import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  NavLink,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { dashboardNavigation } from "~/components/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { getNotes } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const notes = await getNotes(userId);
  if (!notes) {
    throw new Response("No notes", { status: 404 });
  }
  return json({ notes });
};

export default function AppShell() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 w-full flex">
      <div className="hidden border-r bg-muted/40 md:flex min-h-screen flex-col gap-2 md:w-[220px] lg:w-[280px]">
        <nav className="hmt-4 px-2 text-sm font-medium lg:px-4 ">
          {dashboardNavigation.map((navItem) => (
            <NavLink
              key={navItem.to}
              to={navItem.to}
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl hover:bg-muted px-3 py-2 text-foreground hover:text-foreground"
            >
              {<navItem.icon />}
              {navItem.label}
              {navItem.label === "Notes" ? (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {data.notes.length}
                </Badge>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <Form action="/logout" method="post">
            <Button type="submit" variant="ghost">
              &larr; Log out
            </Button>
          </Form>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Outlet />
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
