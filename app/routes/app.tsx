import { ChevronRightIcon } from "@heroicons/react/20/solid";
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
import Fuse from "fuse.js";
import { CircleUser, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "~/components/logo";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { getNotes } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import {
  dashboardNavigation,
  settingsNavigation,
  staticNavigation,
  useUser,
} from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const notes = await getNotes();
  if (!notes) {
    throw new Response("No notes", { status: 404 });
  }
  return json({ notes });
};

export default function AppShell() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState(data.notes);
  const [searchOpen, setSearchOpen] = useState(false);
  const fuse = new Fuse(data.notes, {
    includeScore: true,
    keys: ["name", "body"],
    threshold: 0,
  });

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    const pointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLInputElement;

      if (!searchRef.current?.contains(target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", keyDown);
    document.addEventListener("pointerdown", pointerDown);
    return () => {
      document.removeEventListener("keydown", keyDown);
      //@ts-expect-error ts is ok with the binding but not the unbinding of this one
      document.removeEventListener("pointerDown", pointerDown);
    };
  }, []);

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
              <Input
                type="search"
                ref={searchInputRef}
                placeholder="Search products..."
                className="w-full flex-1 appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                onFocus={() => {
                  setSearchOpen(true);
                }}
                onKeyDown={(e: React.KeyboardEvent<Element>) => {
                  const firstResult = document.querySelectorAll(
                    ".result",
                  )[0] as HTMLElement;
                  if (e.key === "ArrowDown" && firstResult) {
                    firstResult.focus();
                    return;
                  }

                  searchInputRef.current?.focus();
                }}
                onChange={(e) => {
                  if (e.target.value.length) {
                    setNotes(fuse.search(e.target.value).map((r) => r.item));
                  } else {
                    setNotes(data.notes);
                  }
                }}
              />
              {searchOpen && notes.length ? (
                <div
                  className="absolute top-[37px] left-4 w-[90%]"
                  ref={resultsRef}
                >
                  <ScrollArea className="max-h-96 z-50 bg-white border-b-md shadow p-2">
                    <ul className="w-full p-1 flex flex-col">
                      {notes.map((note) => (
                        <Link
                          key={note.id}
                          to={`/app/dashboard/note/${note.id}`}
                          onClick={() => {
                            setSearchOpen(false);
                          }}
                          onKeyDown={(e: React.KeyboardEvent<Element>) => {
                            if (e.key === "Enter") {
                              return;
                            }

                            const target = e.target as HTMLInputElement;
                            const previousElement =
                              target.previousElementSibling as HTMLElement;
                            const nextElement =
                              target.nextElementSibling as HTMLElement;

                            e.preventDefault();

                            if (e.key === "ArrowUp" && previousElement) {
                              previousElement.focus();
                              return;
                            }

                            if (
                              (e.key === "ArrowDown" || e.key === "Tab") &&
                              nextElement
                            ) {
                              nextElement.focus();
                              return;
                            }

                            searchInputRef.current?.focus();
                          }}
                          className="result p-2 flex w-[98%] mx-auto justify-between  hover:bg-slate-100"
                        >
                          {note.name}
                          <ChevronRightIcon className="w-4" />
                        </Link>
                      ))}{" "}
                    </ul>
                  </ScrollArea>
                </div>
              ) : null}
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
                {staticNavigation.map((navItem) => (
                  <DropdownMenuItem key={navItem.to}>
                    <NavLink to={navItem.to}>{navItem.label}</NavLink>
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
