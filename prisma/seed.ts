import { randomBytes } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sha256 } from "js-sha256";

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash("letmeinplease", 10);
  const newToken = randomBytes(16).toString("hex");
  const hashedNewToken = sha256(newToken);

  const user = await prisma.user.create({
    data: {
      email: "boaz@bocoup.com",
      token: hashedNewToken,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      name: "Blue",
      color: "#00a7ff",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      name: "Green",
      color: "#00b340",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      name: "Red",
      color: "#ff5a2f",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
