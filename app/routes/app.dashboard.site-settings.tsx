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
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef } from "react";

import ImageUpload from "~/components/image-upload";
import { Button } from "~/components/ui/button";
import { getSiteSettings, updateSiteSettings } from "~/models/site.server";
import { requireUser, requireUserId } from "~/session.server";
import { useSettings } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const siteSettings = await getSiteSettings();
  return json({ siteSettings });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUser(request);
  const formData = await request.clone().formData();
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString();
  const lede = formData.get("lede")?.toString();
  const tagline = formData.get("tagline")?.toString();
  if (typeof id !== "string" || id.length === 0) {
    return json(
      {
        errors: {
          id: "id is required",
          lede: null,
          name: null,
          tagline: null,
          logoDescription: null,
        },
      },
      { status: 400 },
    );
  }

  if (typeof lede !== "string" || lede.length === 0) {
    return json(
      {
        errors: {
          lede: "lede is required",
          name: null,
          tagline: null,
          id: null,
          logoDescription: null,
        },
      },
      { status: 400 },
    );
  }

  if (typeof name !== "string" || name.length === 0) {
    return json(
      {
        errors: {
          name: "name is required",
          lede: null,
          tagline: null,
          id: null,
          logoDescription: null,
        },
      },
      { status: 400 },
    );
  }

  if (typeof tagline !== "string" || tagline.length === 0) {
    return json(
      {
        errors: {
          tagline: "tagline is required",
          lede: null,
          name: null,
          id: null,
          logoDescription: null,
        },
      },
      { status: 400 },
    );
  }

  const logoDescription =
    formData.get("logoDescription")?.toString() || undefined;

  const logo = formData.get("image");
  if (logo instanceof File) {
    await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        unstable_createFileUploadHandler({
          avoidFileConflicts: true,
          directory: `./public/media/logo`,
          file: ({ filename }) => filename,
          maxPartSize: 5_000_000,
        }),
        unstable_createMemoryUploadHandler(),
      ),
    );

    if (
      logo.size > 0 &&
      (typeof logoDescription !== "string" || logoDescription.length === 0)
    ) {
      return json(
        {
          errors: {
            name: null,
            logoDescription: "Descriptions are required for images",
            lede: null,
            tagline: null,
          },
        },
        { status: 400 },
      );
    }
  }

  await updateSiteSettings({
    id,
    name,
    lede,
    tagline,
    logo:
      logo instanceof File && logo.size > 0
        ? `/media/logo/${logo.name}`
        : undefined,
    logoDescription,
  });

  return redirect(`/app/dashboard/site-settings`);
};

export default function SiteSettingsEditPage() {
  const settings = useSettings();
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>(null);
  const ledeRef = useRef<HTMLTextAreaElement>(null);
  const taglineRef = useRef<HTMLInputElement>(null);
  const logoDescriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.lede) {
      ledeRef.current?.focus();
    } else if (actionData?.errors?.tagline) {
      taglineRef.current?.focus();
    } else if (actionData?.errors?.logoDescription) {
      logoDescriptionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      encType="multipart/form-data"
      method="post"
      className="space-y-4 h-full p-4"
    >
      <input type="hidden" name="id" value={settings?.id} />
      <div>
        <ImageUpload
          image={settings?.logo || ""}
          imageDescription={settings?.logoDescription || ""}
        />
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Image Description: </span>
          <input
            ref={logoDescriptionRef}
            defaultValue={
              settings && settings.logoDescription
                ? settings.logoDescription
                : ""
            }
            name="logoDescription"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            aria-invalid={
              actionData?.errors?.logoDescription ? true : undefined
            }
            aria-errormessage={
              actionData?.errors?.logoDescription ? "name-error" : undefined
            }
          />
        </label>

        {actionData?.errors?.logoDescription ? (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData?.errors?.logoDescription}
          </div>
        ) : null}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Name: </span>
          <input
            ref={nameRef}
            defaultValue={settings && settings.name ? settings.name : ""}
            name="name"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.name ? "name-error" : undefined
            }
          />
        </label>

        {actionData?.errors?.name ? (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData?.errors?.name}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Tagline: </span>
          <input
            ref={nameRef}
            defaultValue={settings && settings.tagline ? settings.tagline : ""}
            name="tagline"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-errormessage={
              actionData?.errors?.tagline ? "tagline-error" : undefined
            }
          />
        </label>

        {actionData?.errors?.tagline ? (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData?.errors?.tagline}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>lede: </span>
          <textarea
            ref={ledeRef}
            defaultValue={settings && settings.lede ? settings.lede : ""}
            name="lede"
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            aria-invalid={actionData?.errors?.lede ? true : undefined}
            aria-errormessage={
              actionData?.errors?.lede ? "name-error" : undefined
            }
          />
        </label>

        {actionData?.errors?.lede ? (
          <div className="pt-1 text-red-700" id="name-error">
            {actionData?.errors?.lede}
          </div>
        ) : null}
      </div>
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
