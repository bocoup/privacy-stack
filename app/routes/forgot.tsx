import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { InputConform } from "~/components/conform/input";
import { Field, FieldError } from "~/components/field";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { sendMail } from "~/email.server";
import { getUserByEmail, newToken } from "~/models/user.server";
import { getDomain } from "~/utils";
import { createSchema } from "~/validators/validate.forgot";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  let userId = "";
  const submission = await parseWithZod(formData, {
    schema: createSchema({
      async emailExists(email) {
        const maybeUser = await getUserByEmail(email);
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

  const userWithNewToken = await newToken({ userId });

  await sendMail({
    to: userWithNewToken.email,
    subject: "Notes App password reset",
    text: `Here is your password reset link: ${getDomain()}/reset/${
      userWithNewToken.token
    }. If you did not do this, please ignore this email.`,
    html: `Here is your <a href='${getDomain()}/reset/${
      userWithNewToken.token
    }'>password reset link</a>. If you did not do this, please ignore this email..`,
  });

  return {};
};

export const meta: MetaFunction = () => [{ title: "Forgot Password" }];

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
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
        {actionData && !fields.email.errors ? (
          <p className="text-center">
            Reset email sent. You can close this page.
          </p>
        ) : (
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            className="space-y-6"
          >
            <Field>
              <Label htmlFor={fields.email.id}>Email</Label>
              <InputConform
                meta={fields.email}
                type="email"
                name="email"
                aria-invalid={fields.email.errors ? true : undefined}
                aria-errormessage={
                  fields.email.errors ? "email-error" : undefined
                }
              />
              {fields.email.errors ? (
                <div id="email-error">
                  <FieldError>{fields.email.errors}</FieldError>
                </div>
              ) : null}
            </Field>

            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
