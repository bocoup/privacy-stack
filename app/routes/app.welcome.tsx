import { Dialog, Transition } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { Fragment, useState } from "react";

import { Button } from "~/components/ui/button";
import { deleteUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return {};
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  await deleteUserById(userId);
  return redirect("/");
};

export default function Welcome() {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-32 sm:py-48 lg:py-56 space-y-4 p-4 max-w-96 mx-auto">
      <div className="flex flex-col gap-4">
        <p>
          You just signed up for this App. Start by sharing creating a note, or
          adding a favorite action.
        </p>
        <Button asChild className="w-full">
          <Link to="/app/dashboard/note/edit/new">Create a note</Link>
        </Button>

        <p>
          If you changed your mind and would like to undo your sign up, you can!
          Press the &quot;Undo signup&quot; button to delete your account and
          all data about you from our system.
        </p>
        <Button
          className="w-full bg-slate-600"
          onClick={() => {
            setOpen(true);
          }}
        >
          Undo signup
        </Button>
        <p className="text-xs italic text-center">
          (you can do this later from the{" "}
          <Link to="/app/settings/data" className="underline">
            data page
          </Link>{" "}
          as well)
        </p>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <LockClosedIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Undo signup
                        </Dialog.Title>

                        <p>
                          Undoing sign up will delete the account you just
                          created, including email, password, and email
                          verification. This App will not keep a copy of your
                          data.
                        </p>
                        <p className="mt-2 text-center border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-700">
                          <b className="font-bold">This cannot be undone.</b>{" "}
                          Once you press delete, you will be logged out and
                          would need to create a new account if you want to
                          return here.
                        </p>
                      </div>
                    </div>
                    <Form method="post" className="mt-5 sm:mt-6 space-y-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-slate-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>{" "}
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                        >
                          Undo
                        </button>
                      </div>
                    </Form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
}
