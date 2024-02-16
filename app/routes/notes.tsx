import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import ButtonLink from "~/components/ButtonLink";
import { getNotes } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const notes = await getNotes();
  if (!notes) {
    throw new Response("No notes", { status: 404 });
  }
  return json({ notes });
};

export default function NotePage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="h-full p-4">
      <h2 className="font-bold text-xl mb-8">All Notes</h2>
      <ul className="space-y-4 mb-8">
        {data.notes.map((note) => (
          <li key={note.id} className="flex gap-2 ">
            <Link to={`/note/${note.id}`} className="">
              <span
                className="rounded-full w-10 h-10 relative block mr-4"
                style={{ background: note.color || "" }}
              >
                {note.image ? (
                  <img
                    alt={note.imageDescription || ""}
                    src={note.image}
                    className="rounded w-10 h-10"
                  />
                ) : null}
              </span>
            </Link>
            <Link to={`/note/${note.id}`} className="">
              {note.name}{" "}
              <span className="block text-xs text-slate-500">
                created on {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink to="/note/edit/new" className="w-full">
        New note
      </ButtonLink>
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
