import type { User, Note } from "@prisma/client";

import { prisma } from "~/db.server";

interface NoteProps {
  id: Note["id"] | undefined;
  name: Note["name"];
  body: Note["body"] | undefined;
  image: Note["image"] | undefined;
  imageDescription: Note["imageDescription"] | undefined;
  userId: User["id"];
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

export async function createNote({
  name,
  body,
  image,
  imageDescription,
  userId,
}: NoteProps) {
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
}: NoteProps) {
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
