import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import Button from "~/components/Button";
import { deleteUserById } from "~/models/user.server";
import { requireUser } from "~/session.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await requireUser(request);
  if (user.token === params.token) await deleteUserById(user.id);
  return redirect("/");
};

export default function Welcome() {
  return (
    <div className="space-y-4 h-full p-4">
      <h2 className="font-bold text-2xl mb-8">Undo signup</h2>
      <Form method="post" className="mt-5 sm:mt-6 space-y-4">
        <p>
          Undoing sign up will delete the account you just created, including
          email, password, and email verification and any other data we have
          about you. This App will not keep a copy of your data.
        </p>
        <p className="mt-2 text-center border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-700">
          <b className="font-bold">This cannot be undone.</b> Once you press
          delete, your data will be deleted and you will be redirected to the
          home page.
        </p>

        <Button className="w-full bg-amber-600" type="submit">
          Undo signup
        </Button>
      </Form>
    </div>
  );
}
