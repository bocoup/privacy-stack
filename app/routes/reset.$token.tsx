import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

import Button from "~/components/Button";
import { getUserByToken, resetPassword } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const loggedInUser = await getUserId(request);
  if (loggedInUser) {
    return redirect("/notes");
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const password = formData.get("password");

  invariant(params.token, "No token found");

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

  const user = await resetPassword(params.token, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo: "/notes",
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

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
          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  autoComplete="current-password"
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

            <Button type="submit" className="w-full">
              Reset and log in
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
