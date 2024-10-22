import xss from "xss";

import { prisma } from "~/db.server";

export function getPage({ id }: { id: string }) {
  return prisma.page.findFirst({
    where: {
      id,
    },
  });
}
export function getPageBySlug({ slug }: { slug: string }) {
  return prisma.page.findFirst({
    where: {
      slug,
    },
  });
}

export function getPages() {
  return prisma.page.findMany();
}

export async function upsertPage({
  id,
  title,
  slug,
  body,
}: {
  id?: string;
  title: string;
  slug: string;
  body: string;
}) {
  return await prisma.page.upsert({
    where: {
      id,
    },
    create: {
      title,
      slug,
      body: xss(body),
    },
    update: {
      title,
      slug,
      body: xss(body),
    },
  });
}

export function deletePage({ id }: { id: string }) {
  return prisma.page.delete({ where: { id } });
}
