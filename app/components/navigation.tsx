import { Link } from "@remix-run/react";
import { Home, Notebook, PanelTop, Settings2, Menu } from "lucide-react";

import { Logo } from "~/components/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useOptionalUser, usePages } from "~/utils";

export function NavigationSite() {
  const user = useOptionalUser();
  const pages = usePages();

  return (
    <header className="">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <h1 className="font-bold text-xl">
            <Logo />
          </h1>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <nav>
            <ul className="text-sm font-semibold leading-6 text-gray-900 flex gap-8">
              {pages?.map((item) => (
                <li key={item.title}>
                  <a
                    href={`/p/${item.slug}`}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {item.title}
                  </a>
                </li>
              ))}

              <li>
                {user ? (
                  <Link
                    to="/app/dashboard"
                    className="text-sm leading-6 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/auth/login"
                    className="text-sm leading-6 hover:text-gray-900"
                  >
                    Log in
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex lg:hidden">
              <button type="button">
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {pages?.map((item) => (
                    <a
                      key={item.title}
                      href={`/p/${item.slug}`}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  {user ? (
                    <Link
                      to="/app/dashboard"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/auth/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

export function NavigationSiteFooter() {
  const user = useOptionalUser();
  const pages = usePages();
  return (
    <footer className="min-h-28 items-start py-20 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl px-6 flex justify-center">
        <nav>
          <ul className="text-sm leading-6 hover:text-gray-900 flex gap-8">
            {pages?.map((item) => (
              <li key={item.title}>
                <Link to={`/p/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
            <li>
              {user ? (
                <Link to="/app/dashboard">Dashboard</Link>
              ) : (
                <Link to="/auth/login">Log in</Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div className="my-4">
        <p className="mt-2 font-light text-center text-xs leading-5 text-gray-500">
          Built with the Privacy Stack by{" "}
          <a href="https://bocoup.com" className="underline">
            Bocoup
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export const dashboardNavigation = [
  { label: "Dashboard", to: "/app/dashboard", icon: Home },
  { label: "Notes", to: "/app/dashboard/notes", icon: Notebook },
  { label: "Pages", to: "/app/dashboard/pages", icon: PanelTop },
  {
    label: "Site Settings",
    to: "/app/dashboard/site-settings",
    icon: Settings2,
  },
];
export const settingsNavigation = [
  { label: "Profile", to: "/app/settings/profile" },
  { label: "Data", to: "/app/settings/data" },
];
