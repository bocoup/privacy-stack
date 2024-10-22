import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { CircleUser, Menu, Search } from "lucide-react";
import { useRef, useState } from "react";
// @ts-expect-error this is here, I promise
import { ClientOnly } from "remix-utils/client-only";

import { Autocomplete } from "~/components/auto-complete";
import { Logo } from "~/components/logo";
import { dashboardNavigation } from "~/components/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { getNotes } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const notes = await getNotes(userId);
  if (!notes) {
    throw new Response("No notes", { status: 404 });
  }
  return json({ notes });
};

export default function AppShell() {
  const { notes } = useLoaderData<typeof loader>();
  const user = useUser();
  const [openSheet, setOpenSheet] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen max-h-screen w-full flex">
      <div className="hidden border-r bg-muted/40 md:flex min-h-max flex-col gap-2 md:w-[220px] lg:w-[280px]">
        <div className="h-14 flex md:w-[220px] lg:w-[280px] items-center gap-2 border-r border-b bg-muted/40 px-2 lg:px-4">
          <Logo />
        </div>
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
                  {notes.length}
                </Badge>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4 flex">
          {user.visualAvatar ? (
            <img
              src={user.visualAvatar}
              alt={user.visualAvatarDescription || `${user.email}'s avatar`}
              className="w-8 h-8 object-cover rounded-full"
            />
          ) : (
            <CircleUser className="h-8 w-8" />
          )}{" "}
          <Form action="/logout" method="post">
            <Button type="submit" variant="ghost">
              Log out
            </Button>
          </Form>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex min-h-14 max-h-14 flex-1 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Logo />
                {dashboardNavigation.map((navItem) => (
                  <Link
                    key={navItem.to}
                    to={navItem.to}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setOpenSheet(false);
                    }}
                  >
                    {<navItem.icon />}
                    {navItem.label}

                    {navItem.label === "Notes" ? (
                      <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        {notes.length}
                      </Badge>
                    ) : null}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Form action="/logout" method="post">
                  <Button type="submit" variant="ghost">
                    &larr; Log out
                  </Button>
                </Form>
              </div>
            </SheetContent>
          </Sheet>
          <div className="relative grow flex" ref={searchRef}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <ClientOnly
              fallback={
                <Input
                  placeholder="Note name or body text"
                  className="w-full flex-1 appearance-none bg-background pl-8 shadow-none"
                />
              }
            >
              {() => <Autocomplete items={notes} />}
            </ClientOnly>
          </div>
        </header>
        <main className="p-4 overflow-y-scroll">
          <Outlet />
        </main>
      </div>
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
