import { randomBytes } from "node:crypto";

import type { Password, Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sha256 } from "js-sha256";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: { notes: true };
}>;

export async function getUsers() {
  return prisma.user.findMany({});
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      notes: true,
    },
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      notes: true,
    },
  });
}

export async function createUser(
  email: User["email"],
  password: string,
  doNotSell: boolean,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      doNotSell,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({
    where: { email },
    include: {
      notes: true,
    },
  });
}

export async function deleteUserById(id: User["id"]) {
  return prisma.user.delete({
    where: { id },
    include: {
      notes: true,
    },
  });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function verifyEmail({
  userId,
  token,
}: {
  userId: string;
  token: string | undefined;
}) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.token === token) {
    user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  return user;
}

export async function newToken({ userId }: { userId: string }) {
  const newToken = randomBytes(16).toString("hex");
  const hashedNewToken = sha256(newToken);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      token: hashedNewToken,
    },
  });

  return user;
}

export async function getUserByToken(token: string | undefined) {
  return await prisma.user.findUnique({ where: { token: token } });
}

export async function resetPassword(token: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: {
      token: token,
    },
    data: {
      token: "",
    },
  });

  if (user) {
    await prisma.password.update({
      where: {
        userId: user.id,
      },
      data: {
        hash: hashedPassword,
      },
    });
  }

  return user;
}
