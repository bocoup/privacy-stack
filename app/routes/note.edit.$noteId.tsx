import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

import Button from "~/components/Button";
import { createNote, getNote, updateNote } from "~/models/note.server";
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

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.clone().formData();
  const name = formData.get("name")?.toString();
  const body = formData.get("body")?.toString();
  const color = formData.get("color")?.toString() || undefined;
  const imageDescription =
    formData.get("imageDescription")?.toString() || undefined;

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { name: "Name is required", imageDescription: null } },
      { status: 400 },
    );
  }

  const imageFormField = formData.get("image");
  if (imageFormField instanceof File) {
    await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        unstable_createFileUploadHandler({
          avoidFileConflicts: true,
          directory: `./public/media/${userId}`,
          file: ({ filename }) => filename,
          maxPartSize: 5_000_000,
        }),
        unstable_createMemoryUploadHandler(),
      ),
    );

    if (
      imageFormField.size > 0 &&
      (typeof imageDescription !== "string" || imageDescription.length === 0)
    ) {
      return json(
        {
          errors: {
            name: null,
            imageDescription: "Image descriptions are required for images",
          },
        },
        { status: 400 },
      );
    }
  }

  invariant(params.noteId, "noteId required");
  invariant(name, "name required");
  invariant(color, "color required");

  const data = {
    id: params.noteId,
    name,
    body,
    color,
    image:
      imageFormField instanceof File && imageFormField.size > 0
        ? `/media/${userId}/${imageFormField.name}`
        : undefined,
    imageDescription,
    userId,
  };

  if (params.noteId === "new") {
    await createNote(data);
  } else {
    await updateNote(data);
  }

  return redirect(`/notes`);
};

export default function NoteEditPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const imageDescriptionRef = useRef<HTMLInputElement>(null);
  const createdAt = data.note ? new Date(data.note.createdAt) : new Date();
  const updatedAt = data.note ? new Date(data.note.updatedAt) : new Date();

  useEffect(() => {
    if (fetcher.data?.errors?.name) {
      nameRef.current?.focus();
    } else if (fetcher.data?.errors?.imageDescription) {
      imageDescriptionRef.current?.focus();
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form
      method="post"
      encType="multipart/form-data"
      className="space-y-4 h-full p-4"
    >
      <h2 className="font-bold text-xl mb-8 flex">
        {data.note?.image ? (
          <img
            alt={data.note.imageDescription || ""}
            src={data.note.image}
            className="rounded w-10 h-10"
          />
        ) : null}

        {data.note ? `Edit ${data.note.name}` : "New note"}
      </h2>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            defaultValue={data.note ? data.note.name : ""}
            name="name"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            aria-invalid={fetcher.data?.errors?.name ? true : undefined}
            aria-errormessage={
              fetcher.data?.errors?.name ? "name-error" : undefined
            }
          />
        </label>

        {fetcher?.data?.errors?.name ? (
          <div className="pt-1 text-red-700" id="name-error">
            {fetcher.data?.errors?.name}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            defaultValue={data.note && data.note.body ? data.note.body : ""}
            name="body"
            rows={8}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
          />
        </label>
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Image Description: </span>
          <input
            ref={imageDescriptionRef}
            defaultValue={
              data.note && data.note.imageDescription
                ? data.note.imageDescription
                : ""
            }
            name="imageDescription"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            aria-invalid={
              fetcher.data?.errors?.imageDescription ? true : undefined
            }
            aria-errormessage={
              fetcher.data?.errors?.imageDescription ? "name-error" : undefined
            }
          />
        </label>

        {fetcher?.data?.errors?.imageDescription ? (
          <div className="pt-1 text-red-700" id="name-error">
            {fetcher.data?.errors?.imageDescription}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>
            {data.note && data.note.image ? "Replace Image" : "Image"}:{" "}
          </span>
          <input
            type="file"
            name="image"
            className="
              text-sm text-stone-500
              file:rounded-md
              file:bg-white
              file:px-2.5
              file:py-1.5
              file:text-sm
              file:font-semibold
              file:text-gray-900
              file:shadow-sm
              file:ring-1
              file:ring-inset
              file:ring-gray-300
              file:hover:bg-gray-50
              file:border-[0px]"
          />{" "}
        </label>
      </div>
      {data.note ? (
        <>
          <p>
            <b className="font-bold">Date created</b>:{" "}
            <>
              {createdAt.toLocaleDateString()} at{" "}
              {createdAt.toLocaleTimeString()}
            </>
          </p>
          <p>
            <b className="font-bold">Last Updated</b>:{" "}
            <>
              {updatedAt.toLocaleDateString()} at{" "}
              {updatedAt.toLocaleTimeString()}
            </>
          </p>
        </>
      ) : null}
      <div>
        <label>
          <b className="font-bold">Color</b>:{" "}
          <input
            type="color"
            name="color"
            defaultValue={data.note && data.note.color ? data.note.color : ""}
          />
        </label>
      </div>

      <Button type="submit">Save</Button>
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
    return <div>Not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
