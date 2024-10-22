import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { Button } from "~/components/ui/button";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { timeFromNow } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  invariant(params.noteId, "noteId is required");

  const note = await getNote({ id: params.noteId });

  if (!note && params.noteId !== "new") {
    throw new Response("No note found", { status: 404 });
  }
  return json({ note });
};

export default function NoteEditPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center">
        <span className="rounded-full w-10 h-10 relative block mr-4 bg-slate-300">
          {data.note?.image ? (
            <img
              alt={data.note.imageDescription || ""}
              src={data.note.image}
              className="rounded w-10 h-10"
            />
          ) : null}
        </span>
        <h2 className="font-bold text-xl  space-y-1 ">
          {data.note ? `${data.note.name}` : "New note"}
          {data.note ? (
            <>
              <p className="text-xs font-light text-slate-500">
                Created {timeFromNow(data.note.createdAt)}
              </p>
            </>
          ) : null}
        </h2>
      </div>
      <p>{data.note?.body}</p>
      <Button asChild>
        <Link to={`/app/note/edit/${data.note?.id}`}>Edit</Link>
      </Button>
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
