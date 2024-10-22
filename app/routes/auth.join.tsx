import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import { InputConform } from "~/components/conform/input";
import { Field, FieldError } from "~/components/field";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { sendMail } from "~/email.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { getDomain, safeRedirect } from "~/utils";
import { createSchema } from "~/validators/validate.join";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/app/welcome");

  const submission = await parseWithZod(formData, {
    schema: createSchema({
      async isEmailUsed(email) {
        const maybeUser = await getUserByEmail(email);
        if (maybeUser) {
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

  const user = await createUser(
    submission.value.email,
    submission.value.password,
    submission.value.doNotSell,
  );

  await sendMail({
    to: user.email,
    subject: "Notes App email verification",
    text: `You just signed up for the Notes App. To confirm your signup, click here: ${getDomain()}/verify/${
      user.token
    }. To undo your signup, click here: ${getDomain()}/undo-signup/${
      user.token
    }.`,
    html: `You just signed up for the Notes App. To confirm your signup, <a href='${getDomain()}/verify/${
      user.token
    }'>click here</a>. To undo your signup, <a href='${getDomain()}/undo-signup/${
      user.token
    }'>click here</a>.`,
  });

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    shouldValidate: "onSubmit",
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createSchema() });
    },
  });

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Join</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email and password below to create and account. You can
          undo this later.
        </p>
      </div>
      <Form
        method="post"
        id={form.id}
        onSubmit={form.onSubmit}
        className="grid gap-4"
      >
        <Field>
          <Label htmlFor={fields.email.id}>Email</Label>
          <InputConform
            meta={fields.email}
            type="email"
            name="email"
            aria-invalid={fields.email.errors ? true : undefined}
            aria-errormessage={fields.email.errors ? "email-error" : undefined}
          />
          {fields.email.errors ? (
            <div id="email-error">
              <FieldError>{fields.email.errors}</FieldError>
            </div>
          ) : null}
        </Field>

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

        <div className="flex justify-center items-center">
          <input
            defaultChecked={true}
            id="doNotSell"
            name="doNotSell"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-600"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-900"
          >
            Do not sell my data
          </label>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          className="underline"
          to={{
            pathname: "/auth/login",
            search: searchParams.toString(),
          }}
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
