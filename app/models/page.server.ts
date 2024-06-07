import xss from "xss";

import { prisma } from "~/db.server";

export async function createPage({
  title,
  slug,
  body,
}: {
  title: string;
  slug: string;
  body: string;
}) {
  return await prisma.page.create({
    data: {
      title,
      slug,
      body: xss(body),
    },
  });
}

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

export async function updatePage({
  id,
  title,
  slug,
  body,
}: {
  id: string;
  title: string;
  slug: string;
  body: string;
}) {
  return await prisma.page.update({
    where: {
      id,
    },
    data: {
      title,
      slug,
      body: xss(body),
    },
  });
}

export function deletePage({ id }: { id: string }) {
  return prisma.page.delete({ where: { id } });
}
