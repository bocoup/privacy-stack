import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { CirclePlus, Edit, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { deletePage, getPages } from "~/models/page.server";
import { requireUser } from "~/session.server";
import { timeFromNow } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);

  const pages = await getPages();
  if (!pages) {
    throw new Response("No pages", { status: 404 });
  }
  return json({ pages });
};
export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUser(request);
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  if (id) {
    await deletePage({ id });
  }

  return {};
};

export default function PagePage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex-1 flex flex-col space-y-4">
      {data.pages.length ? (
        <ScrollArea>
          <div className="flex shrink items-center justify-items-start">
            <h1 className="text-lg font-semibold md:text-2xl w-full">
              All Pages
            </h1>
            <Button
              asChild
              variant="ghost"
              aria-description="Click to add items to form"
            >
              <Link to="/app/page/new" className="p-4">
                <span className="sr-only">Add page</span>
                <CirclePlus />
              </Link>
            </Button>
          </div>{" "}
          <ul className="space-y-4 mb-8">
            {data.pages.map((page) => (
              <li key={page.id} className="flex">
                <Link
                  to={`/app/page/${page.slug}`}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center">
                    <div>
                      {page.title}
                      <span className="block text-xs text-slate-500">
                        last updated {timeFromNow(page.updatedAt)}
                      </span>
                    </div>
                  </div>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      aria-description="Click to add items to form"
                    >
                      <EllipsisVerticalIcon className="w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 mr-2">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="gap-2 rounded-none">
                        <Link
                          to={`/app/page/${page.slug}`}
                          className="w-full flex gap-2 items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem className="gap-2 rounded-none">
                        <Form method="post">
                          <input type="hidden" name="id" value={page.id} />
                          <button
                            className="flex gap-2 text-destructive"
                            type="submit"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </Form>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 items-center justify-center mt-10">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no pages
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Start by adding a page.
            </p>
            <Button asChild>
              <Link to="/app/page/new"> New page</Link>
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
