import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

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

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/app/dashboard/notes";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account.
        </p>
      </div>
      <Form method="post" className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <div>
            <Input
              ref={emailRef}
              id="email"
              required
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

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="ml-auto inline-block text-sm underline"
              to="/forgot"
            >
              Forgot password?
            </Link>
          </div>
          <div>
            <Input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              required
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
