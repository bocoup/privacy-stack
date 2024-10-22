import { Dialog, Transition } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "@remix-run/react";
import { Fragment, useRef, useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { deleteMostData } from "~/models/note.server";
import { deleteUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const deletionType = formData.get("deletionType")?.toString();
  const confirmationPhrase = formData.get("confirmationPhrase")?.toString();

  if (deletionType === "all") {
    if (confirmationPhrase !== "delete all of my data") {
      return json(
        {
          success: null,
          errors: {
            confirmationPhrase:
              "You didn't type the phrase 'delete my account'.",
          },
        },
        { status: 400 },
      );
    }

    await deleteUserById(userId);

    return json(
      {
        success: "🎉 You've deleted your account.",
        errors: null,
      },
      { status: 200 },
    );
  } else if (deletionType === "most") {
    if (confirmationPhrase !== "delete most of my data") {
      return json(
        {
          success: null,
          errors: {
            confirmationPhrase:
              "You didn't type the phrase 'delete most of my data'.",
          },
        },
        { status: 400 },
      );
    }

    await deleteMostData(userId);

    return json({
      success: "🎉 You've deleted most of your data.",
      errors: null,
    });
  } else {
    return json({ success: null, errors: null });
  }
};

export default function DataPage() {
  const user = useUser();
  const confirmationPhrase = useRef<HTMLInputElement>(null);
  const deleteFetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(false);
  const [deletionType, setDeletionType] = useState("most");

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-2xl mb-2">Data Checkin</h2>
      <p>
        Thank you for checking in on the data about you that is stored in this
        App. Consent is important to this App, and requires both you, and the
        developers of this App to check in from time to time about what data is
        being stored, and weather or not to keep it.
      </p>
      <Card className="mt-6 border-t border-gray-100 p-4">
        <h2 className="font-bold text-lg">The data this App has about you</h2>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Sign up date
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {new Date(user.createdAt).toDateString()}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Notes
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              You have{" "}
              <Badge>
                {user.notes.length} note{user.notes.length === 1 ? "" : "s"}
              </Badge>{" "}
              {user.notes.length ? (
                <>
                  which you can see on your{" "}
                  <Link to="/" className="underline">
                    home page
                  </Link>
                </>
              ) : null}
              .
            </dd>
          </div>
        </dl>
      </Card>
      <h3 className="font-bold text-lg">Deleting your data</h3>
      <Card className="p-4">
        <h4 className="font-bold text-md">Deleting most of your data</h4>
        {user.notes.length || user.notes.length ? (
          <div>
            <p className="mb-4">
              By pressing &quot;delete most data&quot;, most of the data we have
              about you will be deleted from our databases immediately, and your
              account will be reset to a new account. We will still keep a
              record of your email address, the date you originally created your
              account, and an email verification. You will remain logged in, but
              effectively become a new user. This cannot be undone.
            </p>
            <Button
              onClick={() => {
                setDeletionType("most");
                setOpen(true);
              }}
            >
              Delete Most Data
            </Button>
          </div>
        ) : (
          <p>
            We do not have any deletable data from you right now. Check back
            here after you have used the app some more.
          </p>
        )}
      </Card>
      <Card className="p-4">
        <h4 className="font-bold text-md">Deleting all of your data</h4>
        <p className="mb-4">
          If you would like to delete your account entirely, including the above
          data, as well as your email address and verification, you can press
          the &quot;delete account&quot; button. All of your data will be
          deleted, and you will be logged out. You will have to create a new
          account in order to use this app again. This cannot be undone.
        </p>
        <Button
          onClick={() => {
            setDeletionType("all");
            setOpen(true);
          }}
        >
          Delete Account
        </Button>
      </Card>{" "}
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
                        Delete {deletionType} data
                      </Dialog.Title>
                      {!deleteFetcher.data?.success ? (
                        <>
                          {deletionType === "most" ? (
                            <p>
                              Your favorites and usage history will be deleted
                              from your databases. This App will not keep a copy
                              of your data. This action cannot be undone. This
                              is good if you want to keep your behavior data
                              private.{" "}
                              <b className="font-bold">
                                This cannot be undone.
                              </b>
                            </p>
                          ) : (
                            <p>
                              Your account, including email, email varifiaction,
                              favorites and usage history will be deleted from
                              our databases. This App will not keep a copy of
                              your data. This action cannot be undone. This is
                              good if you want to completely erase all history
                              of your usage of This App.{" "}
                              <b className="font-bold">
                                This cannot be undone.
                              </b>
                            </p>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                  {!deleteFetcher.data?.success ? (
                    <deleteFetcher.Form
                      method="post"
                      className="mt-5 sm:mt-6 space-y-4"
                    >
                      <input
                        type="hidden"
                        name="deletionType"
                        value={deletionType}
                      />

                      <div>
                        <label className="flex w-full flex-col gap-1">
                          <span className="font-bold">Confirmation Phrase</span>
                          <p>
                            Type &quot;delete {deletionType} of my data&quot; in
                            the text box below.
                          </p>
                          <input
                            ref={confirmationPhrase}
                            name="confirmationPhrase"
                            type="text"
                            placeholder="type here"
                            className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6 "
                            aria-invalid={
                              deleteFetcher.data?.errors?.confirmationPhrase
                                ? true
                                : undefined
                            }
                            aria-errormessage={
                              deleteFetcher.data?.errors?.confirmationPhrase
                                ? "confirmationPhrase-error"
                                : undefined
                            }
                          />
                        </label>
                        {deleteFetcher.data?.errors?.confirmationPhrase ? (
                          <div
                            className="pt-1 text-red-700"
                            id="confirmationPhrase-error"
                          >
                            {deleteFetcher.data.errors.confirmationPhrase}
                          </div>
                        ) : null}
                      </div>
                      {deletionType === "all" ? (
                        <p className="text-center border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-700">
                          Once you press delete, you will be logged out
                          permenantly and will need to create a new account to
                          return here.
                        </p>
                      ) : null}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-slate-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                          onClick={() => setOpen(false)}
                        >
                          cancel
                        </button>{" "}
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                        >
                          Delete Data
                        </button>
                      </div>
                    </deleteFetcher.Form>
                  ) : (
                    <div>
                      <p className="rounded-md bg-green-50 p-4 text-center ml-3 mt-2 text-sm text-green-700">
                        {deleteFetcher?.data?.success}
                      </p>
                      <Button
                        className="mt-4 w-full"
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => {
                            deleteFetcher.data = {
                              success: null,
                              errors: null,
                            };
                          }, 500);
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
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
