import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import react from "react";
import invariant from "tiny-invariant";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { sendMail } from "~/email.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { getDomain, safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const doNotSell =
    formData.get("doNotSell")?.toString() === "on" ? true : false;
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/app/welcome");
  invariant(doNotSell, "doNotSell selection required");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 },
    );
  }
  const user = await createUser(email, password, doNotSell);

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
  const emailRef = react.useRef<HTMLInputElement>(null);
  const passwordRef = react.useRef<HTMLInputElement>(null);

  react.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Join</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email and password below to create and account. You can
          undo this later.
        </p>
      </div>
      <Form method="post" className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email address
          </label>
          <div>
            <Input
              ref={emailRef}
              id="email"
              required
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.email ? (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData.errors.email}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <div>
            <Input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.password ? (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            ) : null}
          </div>
        </div>

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
