import { randomBytes } from "node:crypto";

import { faker } from "@faker-js/faker";
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

  Array(36)
    .fill(null)
    .forEach(async () => {
      await prisma.note.create({
        data: {
          name: faker.animal.bird(),
          body: faker.lorem.paragraph(),
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
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
