import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { useState } from "react";

import { useOptionalUser } from "~/utils";

import { Logo } from "./logo";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "Developers", href: "/developers" },
  { name: "About", href: "/about" },
  { name: "Privacy", href: "/privacy" },
];
export function NavigationSite() {
  const user = useOptionalUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <Link
              to="/app/dashboard"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Dashboard <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <Link
              to="/auth/login"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Login <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
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
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

export function NavigationSiteFooter() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 flex justify-center space-x-12"
          aria-label="Footer"
        >
          {navigation.map((item) => (
            <div key={item.name} className="pb-6">
              <a
                href={item.href}
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>

        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} Bocoup
        </p>
        <p className="mt-2 font-light text-center text-xs leading-5 text-gray-500">
          This notes app is the default app in the Privacy Stack from{" "}
          <a href="https://bocoup.com" className="underline">
            Bocoup
          </a>
          , and is based on the notes app that comes with the{" "}
          <a
            href="https://github.com/remix-run/indie-stack"
            className="underline"
          >
            Remix Indie Stack
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
