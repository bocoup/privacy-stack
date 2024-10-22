import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { ExternalLink, Save } from "lucide-react";
import { useRef, useState } from "react";
import slugify from "slugify";
import invariant from "tiny-invariant";

import { InputConform } from "~/components/conform/input";
import { Editor } from "~/components/editor";
import { Field, FieldError } from "~/components/field";
import { Button, buttonVariants } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { getPageBySlug, upsertPage } from "~/models/page.server";
import { requireUser, requireUserId } from "~/session.server";
import { getDomain } from "~/utils";
import { createSchema } from "~/validators/validate.page";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  invariant(params.slug, "slug is required");

  const page = await getPageBySlug({ slug: params.slug });

  if (!page && params.slug !== "new") {
    throw new Response("No page found", { status: 404 });
  }
  return json({ page, domain: getDomain() });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUser(request);
  const formData = await request.clone().formData();

  const submission = await parseWithZod(formData, {
    schema: createSchema({
      async isSlugUnique(slug) {
        const maybePage = await getPageBySlug({ slug });
        if (maybePage && maybePage.slug !== params.slug) {
          return false;
        }
        return true;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const page = await upsertPage(submission.value);

  return redirect(`/app/page/${page.slug}`);
};

export default function SiteSettingsEditPage() {
  const navigation = useNavigation();

  const { page, domain } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const slugRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState(page?.slug);

  const [form, fields] = useForm({
    shouldValidate: "onSubmit",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createSchema() });
    },
  });

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      id={form.id}
      onSubmit={form.onSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="id" value={page?.id ? page.id : "new"} />

      <div className="gap-4 space-y-4 md:space-y-0 flex-row-reverse md:flex">
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            className="flex-1"
            variant="secondary"
            disabled={navigation.state === "idle" ? false : true}
          >
            <Save className="w-5 mr-2" />
            Save page
          </Button>{" "}
          {page ? (
            <Link
              to={`/p/${page?.slug}`}
              target="new"
              className={buttonVariants({ variant: "secondary" })}
            >
              <ExternalLink className="w-5 mr-2" /> Preview
            </Link>
          ) : null}
        </div>

        <div className="flex-1">
          <Field>
            <Label htmlFor={fields.title.id} className="sr-only">
              Title
            </Label>
            <InputConform
              defaultValue={page && page.title ? page.title : ""}
              meta={fields.imageDescription}
              type="text"
              name="title"
              aria-invalid={fields.title.errors ? true : undefined}
              aria-errormessage={
                fields.title.errors ? "title-error" : undefined
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
            {fields.title.errors ? (
              <div id="title-error">
                <FieldError>{fields.title.errors}</FieldError>
              </div>
            ) : null}
          </Field>

          <label className="flex w-full text-gray-400 mt-1 text-sm">
            <span className="sr-only">Slug: </span>
            {domain}/p/
            <input
              ref={slugRef}
              defaultValue={slug}
              name="slug"
              className="focus:outline-none inline border-0 p-0 text-gray-400"
              type="text"
              aria-invalid={fields.slug.errors ? true : undefined}
              aria-errormessage={
                fields.imageDescription.errors ? "slug-error" : undefined
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
          {fields.slug.errors ? (
            <div id="slug-error" className="pt-1 text-red-700">
              <FieldError>{fields.slug.errors}</FieldError>
            </div>
          ) : null}
        </div>
      </div>

      <Editor content={page?.body ? page?.body : ""} />
      {fields.body.errors ? (
        <div id="slug-error" className="pt-1 text-red-700">
          <FieldError>{fields.body.errors}</FieldError>
        </div>
      ) : null}
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
    return <div>Page not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
