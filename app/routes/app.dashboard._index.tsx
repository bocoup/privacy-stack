import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";

import { Button } from "~/components/ui/button";
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
  return (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Welcome</h2>

          <Button asChild variant="link">
            <Link to="/app/dashboard/notes">Go to notes</Link>
          </Button>
        </div>
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
