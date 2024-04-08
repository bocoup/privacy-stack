import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Button } from "~/components/ui/button";
import { sendMail } from "~/email.server";
import { getUserByEmail, newToken } from "~/models/user.server";
import { getDomain, validateEmail } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null }, success: null },
      { status: 400 },
    );
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return json(
      { errors: { email: "Invalid email", password: null }, success: null },
      { status: 400 },
    );
  }

  const userWithNewToken = await newToken({ userId: user.id });

  await sendMail({
    to: user.email,
    subject: "Notes App password reset",
    text: `Here is your password reset link: ${getDomain()}/reset/${
      userWithNewToken.token
    }. If you did not do this, please ignore this email.`,
    html: `Here is your <a href='${getDomain()}/reset/${
      userWithNewToken.token
    }'>password reset link</a>. If you did not do this, please ignore this email..`,
  });

  return json(
    { errors: null, success: "Reset email sent. You can close this page." },
    { status: 200 },
  );
};

export const meta: MetaFunction = () => [{ title: "Forgot Password" }];

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        {actionData?.success ? (
          <p className="text-center">{actionData.success}</p>
        ) : (
          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <div className="mt-1">
                <input
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

            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
