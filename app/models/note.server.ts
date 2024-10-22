import type { User, Note } from "@prisma/client";

import { prisma } from "~/db.server";

interface NoteProps {
  id: Note["id"] | undefined;
  userId: User["id"];
  name: Note["name"];
  body?: Note["body"] | undefined;
  image?: Note["image"] | undefined;
  imageDescription?: Note["imageDescription"] | undefined;
}

export function getNotes(userId: string) {
  return prisma.note.findMany({
    where: {
      userId,
    },
  });
}

export function getNote({ id }: Pick<Note, "id">) {
  return prisma.note.findUnique({
    where: {
      id,
    },
  });
}

export async function upsertNote({
  id,
  name,
  body,
  image,
  imageDescription,
  userId,
}: NoteProps) {
  return await prisma.note.upsert({
    where: {
      id,
    },
    update: {
      name,
      body,
      image,
      imageDescription,
      userId,
    },
    create: {
      name,
      body,
      image,
      imageDescription,
      userId,
    },
  });
}

export async function deleteMostData(id: User["id"]) {
  return prisma.user.update({
    where: { id },
    data: {
      notes: {
        deleteMany: {},
      },
    },
  });
}
