import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
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
import { useEffect, useRef } from "react";

import ImageUpload from "~/components/image-upload";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { updateProfile } from "~/models/user.server";
import { requireUser, requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);
  const formData = await request.clone().formData();
  const doNotSell = formData.get("doNotSell")?.toString() === "on";

  const visualAvatarDescription =
    formData.get("visualAvatarDescription")?.toString() || undefined;

  const imageFormField = formData.get("image");

  if (imageFormField instanceof File) {
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

    if (
      imageFormField.size > 0 &&
      (typeof visualAvatarDescription !== "string" ||
        visualAvatarDescription.length === 0)
    ) {
      return json(
        {
          success: null,
          errors: {
            visualAvatarDescription:
              "Image descriptions are required for images",
          },
        },
        { status: 400 },
      );
    }
  }

  await updateProfile({
    id: user.id,
    email: user.email,
    visualAvatar:
      imageFormField instanceof File && imageFormField.size > 0
        ? `/media/${user.id}/${imageFormField.name}`
        : undefined,
    visualAvatarDescription,
    doNotSell,
  });

  return json(
    {
      success: "Saved",
      errors: null,
    },
    { status: 200 },
  );
};

export default function DataPage() {
  const user = useUser();
  const actionData = useActionData<typeof action>();
  const visualAvatarDescriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData && actionData.errors?.visualAvatarDescription) {
      visualAvatarDescriptionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post" encType="multipart/form-data" className="space-y-6 p-4">
      <h2 className="font-bold text-2xl mb-2">Profile</h2>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Your Avatar</h3>
        <Card className="border-t border-gray-100 p-4">
          <ImageUpload
            image={user.visualAvatar || ""}
            imageDescription={user.visualAvatarDescription || ""}
          />

          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Avatar Description: </span>
              <input
                ref={visualAvatarDescriptionRef}
                defaultValue={user.visualAvatarDescription || ""}
                name="visualAvatarDescription"
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                aria-invalid={
                  actionData?.errors?.visualAvatarDescription ? true : undefined
                }
                aria-errormessage={
                  actionData?.errors?.visualAvatarDescription
                    ? "name-error"
                    : undefined
                }
              />
            </label>

            {actionData?.errors?.visualAvatarDescription ? (
              <div className="pt-1 text-red-700" id="name-error">
                {actionData?.errors?.visualAvatarDescription}
              </div>
            ) : null}
          </div>
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
            <Link to="/app/settings/data" className="underline">
              the data section
            </Link>{" "}
            for access to all your data, and the ability to delete it.
          </p>

          <p>Update your do not sell preferences here</p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="doNotSell"
              name="doNotSell"
              defaultChecked={user.doNotSell}
            />
            <label
              htmlFor="doNotSell"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do not sell my data
            </label>
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
