import { Dialog, Transition } from "@headlessui/react";
import * as solid from "@heroicons/react/20/solid";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Fragment, useState } from "react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

import Button from "./components/Button";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

const userNavigation = [
  { label: "Notes", to: "/notes", protected: true },
  { label: "Delete my data", to: "/data", protected: true },
];
const staticNavigation = [
  { label: "Privacy", to: "/privacy", protected: false },
  { label: "About", to: "/about", protected: false },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  const user = useOptionalUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavigation = (item: {
    label: string;
    to: string;
    protected: boolean;
  }) => {
    return (
      <Link
        key={item.label}
        to={item.to}
        className="p-4 text-sm font-semibold leading-6 text-slate-700 hover:text-slate-900"
        onClick={() => {
          setMobileMenuOpen(false);
        }}
      >
        {item.label}
      </Link>
    );
  };

  const Logo = () => {
    return (
      <h1 className="text-xl items-center font-bold  min-w-40 flex-1">
        <Link
          to="/"
          className="flex flex-wrap gap-2"
          onClick={() => {
            setMobileMenuOpen(false);
          }}
        >
          <img
            className="h-6"
            alt="An emoji of a baby chicken"
            src="/logo.png"
          />
          Notes App
        </Link>
      </h1>
    );
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-slate-100">
        <header className="p-8 flex w-full h-20">
          <nav className="hidden md:flex items-center flex-grow justify-between">
            {<Logo />}
            <div className="text-center flex-auto">
              {user ? userNavigation.map(renderNavigation) : null}
              {staticNavigation.map(renderNavigation)}
            </div>
            {user ? (
              <Form
                action="/logout"
                method="post"
                className="min-w-40 flex-1 flex justify-end"
                onSubmit={() => {
                  setMobileMenuOpen(false);
                }}
              >
                <Button type="submit">Log out</Button>
              </Form>
            ) : (
              <Link
                to="/login"
                className="text-sm font-semibold leading-6 min-w-40 flex-1  flex justify-end"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              className="p-2 bg-slate-800 rounded-full absolute top-4 right-4 z-10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <solid.Bars3Icon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </button>
            <Transition.Root show={mobileMenuOpen} as={Fragment}>
              <Dialog
                as="div"
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-900/80" />
                </Transition.Child>
                <div className="fixed inset-0 z-10" />
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="z-10 -m-2.5 rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <solid.XMarkIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="mt-6 space-y-8">
                      {<Logo />}
                      <div className="flex-col flex -mx-4 mb-8">
                        {user ? userNavigation.map(renderNavigation) : null}{" "}
                        {staticNavigation.map(renderNavigation)}
                        {!user ? (
                          <Link
                            to="/login"
                            className="p-4 text-sm font-semibold leading-6"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Log in <span aria-hidden="true">&rarr;</span>
                          </Link>
                        ) : null}
                      </div>
                      {user ? (
                        <Form
                          action="/logout"
                          method="post"
                          onSubmit={() => {
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Button type="submit">Log out</Button>
                        </Form>
                      ) : null}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </Dialog>
            </Transition.Root>
          </div>
        </header>
        <main className="w-full md:w-96 mx-auto p-4">
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
