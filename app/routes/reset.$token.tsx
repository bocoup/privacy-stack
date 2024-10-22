import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useParams,
} from "@remix-run/react";

import { InputConform } from "~/components/conform/input";
import { Field, FieldError } from "~/components/field";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { getUserByToken, resetPassword } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { createSchema } from "~/validators/validate.reset";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const loggedInUser = await getUserId(request);
  if (loggedInUser) {
    return redirect("/app/notes");
  }

  const userByToken = await getUserByToken(params.token);

  if (!userByToken) {
    return json(
      {
        errors: {
          token: "Token is not valid.",
        },
      },
      { status: 400 },
    );
  }
  return json({ errors: null }, { status: 200 });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  let userId = "";
  const submission = await parseWithZod(formData, {
    schema: createSchema({
      async reset(token, password) {
        const maybeUser = await resetPassword(token, password);
        if (!maybeUser) {
          return false;
        }
        userId = maybeUser.id;
        return true;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  return createUserSession({
    redirectTo: "/app/notes",
    remember: false,
    request,
    userId,
  });
};

export const meta: MetaFunction = () => [{ title: "Reset password" }];

export default function LoginPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const params = useParams();

  const [form, fields] = useForm({
    shouldValidate: "onSubmit",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createSchema() });
    },
  });

  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        {loaderData?.errors?.token ? (
          <p className="text-center">
            {loaderData?.errors?.token}{" "}
            <Link to="/" className="underline">
              Return home
            </Link>
            .
          </p>
        ) : (
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            className="space-y-6"
          >
            <input type="hidden" name="token" value={params.token} />
            <Field>
              <Label htmlFor={fields.password.id}>Password</Label>
              <InputConform
                meta={fields.password}
                type="password"
                name="password"
                aria-invalid={fields.password.errors ? true : undefined}
                aria-errormessage={
                  fields.password.errors ? "password-error" : undefined
                }
              />
              {fields.password.errors ? (
                <div id="email-error">
                  <FieldError>{fields.password.errors}</FieldError>
                </div>
              ) : null}
            </Field>

            <Button type="submit" className="w-full">
              Reset and log in
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
