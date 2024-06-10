import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPageBySlug } from "~/models/page.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "slug is required");
  const page = await getPageBySlug({ slug: params.slug });
  if (!page) {
    throw new Response("No page found", { status: 404 });
  }
  return json({ page });
};

export default function SiteSettingsEditPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div
        className="prose max-w-[600px] mx-10 md:mx-auto mt-10"
        dangerouslySetInnerHTML={{ __html: data.page.body }}
      ></div>
    </div>
  );
}
