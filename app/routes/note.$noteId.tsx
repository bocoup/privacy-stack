import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import ButtonLink from "~/components/ButtonLink";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

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
  const createdAt = data.note ? new Date(data.note.createdAt) : new Date();
  const updatedAt = data.note ? new Date(data.note.updatedAt) : new Date();

  return (
    <div className="space-y-4 h-full p-4">
      <h2 className="font-bold text-xl flex items-center">
        <span
          className="rounded-full w-10 h-10 relative block mr-4"
          style={{ background: data.note?.color || "" }}
        >
          {data.note?.image ? (
            <img
              alt={data.note.imageDescription || ""}
              src={data.note.image}
              className="rounded w-10 h-10"
            />
          ) : null}
        </span>

        {data.note ? `${data.note.name}` : "New note"}
      </h2>

      {data.note ? (
        <>
          <p className="text-xs">
            Created on {createdAt.toLocaleDateString()} at{" "}
            {createdAt.toLocaleTimeString()}
          </p>
          <p className="text-xs">
            Updated on {updatedAt.toLocaleDateString()} at{" "}
            {updatedAt.toLocaleTimeString()}
          </p>
          <p>{data.note?.body}</p>
        </>
      ) : null}

      <ButtonLink to={`/note/edit/${data.note?.id}`}>Edit</ButtonLink>
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
