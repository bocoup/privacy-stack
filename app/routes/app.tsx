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
import { useRef } from "react";
// @ts-expect-error this is here, I promise
import { ClientOnly } from "remix-utils/client-only";

import { Autocomplete } from "~/components/auto-complete";
import { Logo } from "~/components/logo";
import {
  dashboardNavigation,
  settingsNavigation,
} from "~/components/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { getNotes } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { usePages, useUser } from "~/utils";

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
  const user = useUser();
  const searchRef = useRef<HTMLDivElement>(null);
  const pages = usePages();
  return (
    <div className="min-h-screen w-full">
      <div className="w-full flex flex-col">
        <div className="flex w-full">
          <div className="hidden md:w-[220px] lg:w-[280px] md:flex items-center gap-2 border-r border-b bg-muted/40 px-2 lg:px-4">
            <Logo />
          </div>
          <header className="flex grow h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
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
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <img
                      className="h-6"
                      alt="An emoji of a baby chicken"
                      src="/logo.png"
                    />
                    Bocoup Notes
                  </Link>
                  {dashboardNavigation.map((navItem) => (
                    <Link
                      key={navItem.to}
                      to={navItem.to}
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      {<navItem.icon />}
                      {navItem.label}

                      {navItem.label === "Notes" ? (
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          {data.notes.length}
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
                {() => <Autocomplete items={data.notes} />}
              </ClientOnly>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  {user.visualAvatar ? (
                    <img
                      src={user.visualAvatar}
                      alt={
                        user.visualAvatarDescription || `${user.email}'s avatar`
                      }
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  ) : (
                    <CircleUser className="h-8 w-8" />
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {settingsNavigation.map((navItem) => (
                  <DropdownMenuItem key={navItem.to}>
                    <NavLink to={navItem.to}>{navItem.label}</NavLink>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <NavLink to="/app/dashboard">Dashboard</NavLink>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                {pages?.map((page) => (
                  <DropdownMenuItem key={page.slug}>
                    <NavLink to={`/p/${page.slug}`}>{page.title}</NavLink>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Form action="/logout" method="post">
                    <Button type="submit" variant="link" className="p-0">
                      Log out
                    </Button>
                  </Form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
        </div>
        <main className="flex flex-1 flex-col">
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
