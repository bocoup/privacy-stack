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
  useRouteError,
} from "@remix-run/react";

import { InputConform } from "~/components/conform/input";
import { TextareaConform } from "~/components/conform/text-area";
import { Field, FieldError } from "~/components/field";
import ImageUpload from "~/components/image-upload";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { getSiteSettings, upsertSiteSettings } from "~/models/site.server";
import { requireUser, requireUserId } from "~/session.server";
import { useSettings, useUser } from "~/utils";
import { schema } from "~/validators/validate.site";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const siteSettings = await getSiteSettings();
  return json({ siteSettings });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUser(request);
  const formData = await request.clone().formData();

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
  }

  const submission = await parseWithZod(formData, {
    schema: schema,
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await upsertSiteSettings({
    ...submission.value,
    logo:
      logo instanceof File && logo.size > 0
        ? `/media/logo/${logo.name}`
        : undefined,
  });
  return redirect(`/app/dashboard/site-settings`);
};

export default function SiteSettingsEditPage() {
  const settings = useSettings();
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
      className="space-y-4 h-full p-4"
    >
      <input
        type="hidden"
        name="id"
        value={settings?.id ? settings?.id : "new"}
      />
      <input type="hidden" name="userId" value={user.id} />

      <div>
        <ImageUpload
          image={settings?.logo || ""}
          imageDescription={settings?.logoDescription || ""}
        />
      </div>

      <Field>
        <Label htmlFor={fields.logoDescription.id}>Image Description:</Label>
        <InputConform
          defaultValue={
            settings && settings.logoDescription ? settings.logoDescription : ""
          }
          meta={fields.logoDescription}
          type="text"
          name="logoDescription"
          aria-invalid={fields.logoDescription.errors ? true : undefined}
          aria-errormessage={
            fields.logoDescription.errors ? "logoDescription-error" : undefined
          }
        />
        {fields.logoDescription.errors ? (
          <div id="logoDescription-error">
            <FieldError>{fields.logoDescription.errors}</FieldError>
          </div>
        ) : null}
      </Field>

      <Field>
        <Label htmlFor={fields.logoDescription.id}>Name:</Label>
        <InputConform
          defaultValue={settings && settings.name ? settings.name : ""}
          meta={fields.name}
          type="text"
          name="name"
          aria-invalid={fields.name.errors ? true : undefined}
          aria-errormessage={fields.name.errors ? "name-error" : undefined}
        />
        {fields.name.errors ? (
          <div id="title-error">
            <FieldError>{fields.name.errors}</FieldError>
          </div>
        ) : null}
      </Field>

      <Field>
        <Label htmlFor={fields.tagline.id}>Tagline:</Label>
        <InputConform
          defaultValue={settings && settings.tagline ? settings.tagline : ""}
          meta={fields.tagline}
          type="text"
          name="tagline"
          aria-invalid={fields.tagline.errors ? true : undefined}
          aria-errormessage={
            fields.tagline.errors ? "tagline-error" : undefined
          }
        />
        {fields.tagline.errors ? (
          <div id="tagline-error">
            <FieldError>{fields.tagline.errors}</FieldError>
          </div>
        ) : null}
      </Field>

      <Field>
        <Label htmlFor={fields.lede.id}>Lede:</Label>
        <TextareaConform
          defaultValue={settings && settings.lede ? settings.lede : ""}
          meta={fields.lede}
          name="lede"
          aria-invalid={fields.lede.errors ? true : undefined}
          aria-errormessage={fields.lede.errors ? "lede-error" : undefined}
        />
        {fields.lede.errors ? (
          <div id="lede-error">
            <FieldError>{fields.lede.errors}</FieldError>
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
