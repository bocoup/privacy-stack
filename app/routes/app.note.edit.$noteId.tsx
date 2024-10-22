import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
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
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { InputConform } from "~/components/conform/input";
import { TextareaConform } from "~/components/conform/text-area";
import { Field, FieldError } from "~/components/field";
import ImageUpload from "~/components/image-upload";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { getNote, upsertNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { timeFromNow, useUser } from "~/utils";
import { schema } from "~/validators/validate.note";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  invariant(params.noteId, "noteId is required");

  const note = await getNote({ id: params.noteId });

  if (!note && params.noteId !== "new") {
    throw new Response("No note found", { status: 404 });
  }
  return json({ note });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.clone().formData();

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
  }

  const submission = await parseWithZod(formData, {
    schema: schema,
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await upsertNote({
    ...submission.value,
    image:
      imageFormField instanceof File && imageFormField.size > 0
        ? `/media/${userId}/${imageFormField.name}`
        : undefined,
  });

  return redirect(`/app/notes`);
};

export default function NoteEditPage() {
  const { note } = useLoaderData<typeof loader>();
  const user = useUser();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldRevalidate: "onSubmit",
  });

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      id={form.id}
      onSubmit={form.onSubmit}
      className="space-y-6"
    >
      <div>
        <h2 className="font-bold text-xl flex">
          {note?.image ? (
            <img
              alt={note.imageDescription || ""}
              src={note.image}
              className="rounded w-10 h-10"
            />
          ) : null}

          {note ? `Edit ${note.name}` : "New note"}
        </h2>
        {note ? (
          <p className="text-sm text-slate-500">
            Created {timeFromNow(note?.createdAt)} and last updated{" "}
            {timeFromNow(note?.updatedAt)}
          </p>
        ) : null}
      </div>

      <div>
        <ImageUpload
          image={note?.image || ""}
          imageDescription={note?.imageDescription || ""}
        />
      </div>

      <input type="hidden" name="id" value={note ? note.id : "new"} />
      <input type="hidden" name="userId" value={user.id} />

      <Field>
        <Label htmlFor={fields.imageDescription.id}>Image Description:</Label>
        <InputConform
          defaultValue={
            note && note.imageDescription ? note.imageDescription : ""
          }
          meta={fields.imageDescription}
          type="text"
          name="imageDescription"
          aria-invalid={fields.imageDescription.errors ? true : undefined}
          aria-errormessage={
            fields.imageDescription.errors
              ? "imageDescription-error"
              : undefined
          }
        />
        {fields.imageDescription.errors ? (
          <div id="imageDescription-error">
            <FieldError>{fields.imageDescription.errors}</FieldError>
          </div>
        ) : null}
      </Field>

      <Field>
        <Label htmlFor={fields.name.id}>Name:</Label>
        <InputConform
          defaultValue={note && note.name ? note.name : ""}
          meta={fields.name}
          type="text"
          name="name"
          aria-invalid={fields.name.errors ? true : undefined}
          aria-errormessage={fields.name.errors ? "error" : undefined}
        />
        {fields.name.errors ? (
          <div id="name-error">
            <FieldError>{fields.name.errors}</FieldError>
          </div>
        ) : null}
      </Field>

      <Field>
        <Label htmlFor={fields.name.id}>Body:</Label>
        <TextareaConform
          defaultValue={note && note.body ? note.body : ""}
          meta={fields.body}
          name="body"
          aria-invalid={fields.body.errors ? true : undefined}
          aria-errormessage={fields.body.errors ? "error" : undefined}
        />
        {fields.body.errors ? (
          <div id="body-error">
            <FieldError>{fields.body.errors}</FieldError>
          </div>
        ) : null}
      </Field>

      <Button type="submit">Save</Button>
    </Form>
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
