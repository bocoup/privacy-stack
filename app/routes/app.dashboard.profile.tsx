import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useActionData,
  useRouteError,
} from "@remix-run/react";

import { InputConform } from "~/components/conform/input";
import { Field, FieldError } from "~/components/field";
import ImageUpload from "~/components/image-upload";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { updateProfile } from "~/models/user.server";
import { requireUser, requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { schema } from "~/validators/validate.profile";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);
  const formData = await request.clone().formData();

  const visualAvatar = formData.get("image");
  if (visualAvatar instanceof File) {
    await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        unstable_createFileUploadHandler({
          avoidFileConflicts: true,
          directory: `./public/media/${user.id}`,
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

  await updateProfile({
    ...submission.value,
    visualAvatar:
      visualAvatar instanceof File && visualAvatar.size > 0
        ? `/public/media/${user.id}`
        : undefined,
  });
  return redirect(`/app/profile`);
};

export default function DataPage() {
  const user = useUser();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    shouldValidate: "onSubmit",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      id={form.id}
      onSubmit={form.onSubmit}
      className="space-y-6 p-4"
    >
      <h2 className="font-bold text-2xl mb-2">Profile</h2>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Your Avatar</h3>
        <Card className="border-t border-gray-100 p-4">
          <ImageUpload
            image={user.visualAvatar || ""}
            imageDescription={user.visualAvatarDescription || ""}
          />

          <input type="hidden" name="id" value={user.id ? user.id : "new"} />

          <Field>
            <Label htmlFor={fields.visualAvatarDescription.id}>
              Image Description:
            </Label>
            <InputConform
              defaultValue={
                user && user.visualAvatarDescription
                  ? user.visualAvatarDescription
                  : ""
              }
              meta={fields.visualAvatarDescription}
              type="text"
              name="visualAvatarDescription"
              aria-invalid={
                fields.visualAvatarDescription.errors ? true : undefined
              }
              aria-errormessage={
                fields.visualAvatarDescription.errors
                  ? "visualAvatarDescription-error"
                  : undefined
              }
            />
            {fields.visualAvatarDescription.errors ? (
              <div id="visualAvatarDescription-error">
                <FieldError>{fields.visualAvatarDescription.errors}</FieldError>
              </div>
            ) : null}
          </Field>
        </Card>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Your details</h3>
        <Card className="border-t border-gray-100 p-4">{user.email}</Card>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Data rights </h3>
        <Card className="p-4 space-y-4">
          <p>
            Check out the{" "}
            <Link to="/app/data" className="underline">
              the data section
            </Link>{" "}
            for access to all your data, and the ability to delete it.
          </p>

          <p>Update your do not sell preferences here</p>
          <div className="flex items-center space-x-2">
            <Checkbox
              name="doNotSell"
              defaultChecked={user && user.doNotSell ? user.doNotSell : false}
              aria-invalid={fields.doNotSell.errors ? true : undefined}
              aria-errormessage={
                fields.doNotSell.errors ? "doNotSell-error" : undefined
              }
            />
            <label
              htmlFor="doNotSell"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do not sell my data
            </label>
            {fields.visualAvatarDescription.errors ? (
              <div id="doNotSell-error">
                <FieldError>{fields.doNotSell.errors}</FieldError>
              </div>
            ) : null}
          </div>
        </Card>{" "}
      </div>
      <Button type="submit">Save profile</Button>
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
