import { prisma } from "~/db.server";

export function getSiteSettings() {
  return prisma.site.findFirst();
}

export async function updateSiteSettings({
  id,
  name,
  tagline,
  lede,
  logo,
  logoDescription,
}: {
  id: string;
  name: string;
  tagline: string;
  lede: string;
  logo: string | undefined;
  logoDescription: string | undefined;
}) {
  return await prisma.site.update({
    where: {
      id,
    },
    data: {
      name,
      tagline,
      lede,
      logo,
      logoDescription,
    },
  });
}
