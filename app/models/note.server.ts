import type { User, Note } from "@prisma/client";

import { prisma } from "~/db.server";

interface entityProps {
  id: string | undefined;
  name: string;
  body: string | undefined;
  image: string | undefined;
  imageDescription: string | undefined;
  userId: User["id"];
}

export function getNotes() {
  return prisma.note.findMany();
}

export function getNote({ id }: Pick<Note, "id">) {
  return prisma.note.findUnique({
    where: {
      id,
    },
  });
}

export async function createNote({
  name,
  body,
  image,
  imageDescription,
  userId,
}: entityProps) {
  return prisma.note.create({
    data: {
      name,
      body,
      image,
      imageDescription,
      userId,
    },
  });
}

export async function updateNote({
  id,
  name,
  body,
  image,
  imageDescription,
  userId,
}: entityProps) {
  return await prisma.note.update({
    where: {
      id,
    },
    data: {
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
