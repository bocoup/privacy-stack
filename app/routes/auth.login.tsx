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
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";
import { createSchema } from "~/validators/validate.login";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");
  let userId = "";
  const submission = await parseWithZod(formData, {
    schema: createSchema({
      async verifyLogin(email, password) {
        const user = await verifyLogin(email, password);
        if (!user) {
          return false;
        }
        userId = user.id;
        return true;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/app/dashboard/notes";
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
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account.
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
          <div className="flex items-center">
            <Label htmlFor={fields.password.id}>Password</Label>
            <Link
              className="ml-auto inline-block text-sm underline"
              to="/forgot"
            >
              Forgot password?
            </Link>
          </div>
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
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </Form>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          className="underline"
          to={{
            pathname: "/auth/join",
            search: searchParams.toString(),
          }}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
