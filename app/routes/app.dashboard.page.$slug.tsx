import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { ExternalLink, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import slugify from "slugify";
import invariant from "tiny-invariant";

import { Editor } from "~/components/editor";
import { Button, buttonVariants } from "~/components/ui/button";
import { createPage, getPageBySlug, updatePage } from "~/models/page.server";
import { requireUser, requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  invariant(params.slug, "slug is required");

  const page = await getPageBySlug({ slug: params.slug });

  if (!page && params.slug !== "new") {
    throw new Response("No page found", { status: 404 });
  }
  return json({ page });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUser(request);
  const formData = await request.clone().formData();
  const id = formData.get("id")?.toString();
  const slug = formData.get("slug")?.toString();
  const title = formData.get("title")?.toString();
  const body = formData.get("body")?.toString();

  if (typeof slug !== "string" || slug.length === 0) {
    return json(
      { errors: { slug: "slug is required", title: null } },
      { status: 400 },
    );
  }

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "title is required", slug: null } },
      { status: 400 },
    );
  }

  if (typeof id !== "string" || id.length === 0) {
    createPage({
      slug,
      title,
      body: body || "",
    });
  } else {
    updatePage({
      id,
      slug,
      title,
      body: body || "",
    });
  }

  return redirect(`/app/dashboard/page/${slug}`);
};

export default function SiteSettingsEditPage() {
  const navigation = useNavigation();

  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState(data.page?.slug);

  useEffect(() => {
    if (fetcher.data?.errors?.title) {
      titleRef.current?.focus();
    } else if (fetcher.data?.errors?.slug) {
      slugRef.current?.focus();
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      className="space-y-4 h-full p-4"
    >
      <input type="hidden" name="id" value={data.page?.id} />
      <div className="space-x-2">
        <Button
          variant="secondary"
          disabled={navigation.state === "idle" ? false : true}
        >
          <Save className="w-5 mr-2" />
          Save page
        </Button>{" "}
        {data.page ? (
          <Link
            to={`/p/${data.page?.slug}`}
            target="new"
            className={buttonVariants({ variant: "secondary" })}
          >
            <ExternalLink className="w-5 mr-2" /> Preview
          </Link>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            defaultValue={data.page && data.page.title ? data.page.title : ""}
            name="title"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            aria-invalid={fetcher.data?.errors?.title ? true : undefined}
            aria-errormessage={
              fetcher.data?.errors?.title ? "name-error" : undefined
            }
            onKeyUp={(e) => {
              const target = e.target as HTMLInputElement;
              const val = slugify(target.value.toLowerCase());
              const slugShow = document.getElementById(
                "slug-show",
              ) as HTMLInputElement;

              if (slugShow) {
                slugShow.value = val;
              }
              setSlug(val);
            }}
          />
        </label>

        {fetcher?.data?.errors?.title ? (
          <div className="pt-1 text-red-700" id="name-error">
            {fetcher.data?.errors?.title}
          </div>
        ) : null}
      </div>

      <div>
        /p/
        <label className="flex w-full flex-col gap-1">
          <span className="sr-only">Slug: </span>
          <input
            ref={slugRef}
            defaultValue={slug}
            name="slug"
            className="focus:outline-none block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 "
            aria-invalid={fetcher.data?.errors?.slug ? true : undefined}
            aria-errormessage={
              fetcher.data?.errors?.slug ? "name-error" : undefined
            }
            id="slug-show"
            onKeyUp={(e) => {
              const target = e.target as HTMLInputElement;
              const val = slugify(target.value.toLowerCase());
              target.value = val;
              setSlug(val);
            }}
          />
        </label>
        {fetcher?.data?.errors?.slug ? (
          <div className="pt-1 text-red-700" id="name-error">
            {fetcher.data?.errors?.slug}
          </div>
        ) : null}
      </div>

      <div>
        <Editor content={data.page?.body ? data.page?.body : ""} />
      </div>
    </fetcher.Form>
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
    return <div>Page not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
