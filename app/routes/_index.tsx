import { LockClosedIcon } from "@heroicons/react/20/solid";
import type { MetaFunction } from "@remix-run/node";

import ButtonLink from "~/components/ButtonLink";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Bocoup Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="py-32 sm:py-48 lg:py-56 space-y-4">
      <h1 className="font-bold text-6xl text-center">Notes App</h1>
      <p className="text-xl text-center">A privacy first notes app.</p>
      {user ? (
        <div className="flex flex-col gap-4">
          <ButtonLink to="/notes" className="w-full">
            Create a note
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ButtonLink to="/login" className="w-full">
            Log in
          </ButtonLink>
          <p className="w-full text-xs font-bold text-slate-700 bg-emerald-200 p-1 rounded text-center gap-2 mx-auto flex justify-center">
            <LockClosedIcon className="w-4" />
            We make it easy to undo signup.
          </p>{" "}
        </div>
      )}

      <p className="text-center">
        Built by{" "}
        <a href="https://bocoup.com" className="underline">
          Bocoup
        </a>
      </p>
    </div>
  );
}
