import { ChevronRightIcon } from "@radix-ui/react-icons";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { CirclePlus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getNotes } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { timeFromNow } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const notes = await getNotes(userId);
  if (!notes) {
    throw new Response("No notes", { status: 404 });
  }
  return json({ notes });
};

export default function NotePage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex-1 flex flex-col space-y-4">
      {data.notes.length ? (
        <ScrollArea>
          <div className="flex shrink items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">All Notes</h1>
            <Button
              asChild
              variant="ghost"
              aria-description="Click to add items to form"
            >
              <Link to="/app/page/new" className="p-4">
                <span className="sr-only">Add note</span>
                <CirclePlus />
              </Link>
            </Button>
          </div>
          <ul className="space-y-4 mb-8">
            {data.notes.map((note) => (
              <li key={note.id}>
                <Link
                  to={`/app/note/${note.id}`}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center">
                    <span className="rounded-full w-10 h-10 relative block mr-4 bg-slate-300">
                      {note.image ? (
                        <img
                          alt={note.imageDescription || ""}
                          src={note.image}
                          className="rounded w-10 h-10"
                        />
                      ) : null}
                    </span>
                    <div>
                      {note.name}
                      <span className="block text-xs text-slate-500">
                        created {timeFromNow(note.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon className="mr-4" />
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 items-center justify-center mt-10">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no notes
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Start by adding a note.
            </p>
            <Button asChild>
              <Link to="/app/note/edit/new"> New note</Link>
            </Button>
          </div>
        </div>
      )}
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
