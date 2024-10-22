import { prisma } from "~/db.server";

export async function getSiteSettings() {
  return prisma.site.findFirst();
}

export async function upsertSiteSettings({
  id,
  name,
  tagline,
  lede,
  logo,
  logoDescription,
}: {
  id?: string;
  name: string;
  tagline: string;
  lede: string;
  logo?: string;
  logoDescription?: string;
}) {
  return await prisma.site.upsert({
    where: {
      id,
    },
    update: {
      name,
      tagline,
      lede,
      logo,
      logoDescription,
    },
    create: {
      name,
      tagline,
      lede,
      logo,
      logoDescription,
    },
  });
}
