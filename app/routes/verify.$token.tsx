import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";

import Button from "~/components/Button";
import { sendMail } from "~/email.server";
import { verifyEmail } from "~/models/user.server";
import { requireUser, requireUserId } from "~/session.server";
import { getDomain } from "~/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await verifyEmail({ userId, token: params.token });
  if (user?.emailVerified) {
    return json({ error: null, success: "You are verified!" });
  } else {
    return json({
      error: "Something went wrong. Please request a new link",
      success: null,
    });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);
  await sendMail({
    to: user.email,
    subject: "Notes App email verification",
    text: `You just requested a new verification link. click here to verify: ${getDomain()}/verify/${
      user.token
    }.`,
    html: `You just requested a new verification link. click here to verify: <a href='${getDomain()}/verify/${
      user.token
    }'>click here</a>.`,
  });
  return json({
    success: "Sent!",
  });
};

export default function Welcome() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-4 h-full p-4">
      <h2 className="font-bold text-2xl mb-8">Verify your email</h2>
      <div className="mt-10">
        {loaderData.success ? (
          <p>
            {loaderData.success}{" "}
            <Link to="/" className="underline">
              Continue home
            </Link>
            .
          </p>
        ) : (
          <>
            {actionData?.success ? (
              <p className="mt-4">Sent!</p>
            ) : (
              <Form method="post" className="flex flex-col gap-4">
                Looks like this token is not valid anymore.
                <Button type="submit" className="w-full bg-emerald-800">
                  Send me a new link
                </Button>
              </Form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
