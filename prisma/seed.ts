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
      isAdmin: true,
    },
  });

  await prisma.site.create({
    data: {
      name: "Privacy Stack",
      tagline: "We make it easy to undo signup.",
      lede: "The Privacy Stack is an open source web app with consent-centered privacy design and accessible components. You get self-serve GDPR and CCPA user flows out of the box with easy data access and deletion, and undo-signup. We also packed in a lot of other goodies, like user profiles, file uploads, and a UI library with lots of patterns to choose from. The Privacy Stack comes with a demo notes app, which you can try out here:",
      logo: "",
      logoDescription: "",
    },
  });

  await prisma.page.create({
    data: {
      slug: "about",
      title: "About",
      body: "<h1><strong>Example about page</strong></h1><p>Omnis ea quibusdam vero. Sunt ipsam facere commodi. Dolor qui magnam sequi. Dignissimos vel assumenda laudantium.</p><p>Qui qui labore vel esse eaque. Ipsum saepe consequatur labore sed ut qui explicabo eligendi. Amet reiciendis quo veniam sed repudiandae modi est. Culpa deserunt ad in eos ad quo officiis cumque. Rerum odio minima sit quis.</p><h2><strong>We built the Privacy Stack with these features</strong></h2><p>Id quos praesentium sit ut. Voluptas cum mollitia omnis odit nulla consequatur. Expedita voluptates enim nesciunt aut voluptatem consectetur unde. Corrupti numquam cupiditate quis.</p><ul><li><p>Et rerum dolores mollitia adipisci voluptatum mollitia. Laudantium fuga cum fugit. Repellendus distinctio perferendis at dolores quod dolores tempore placeat.</p></li><li><p>Eum sed voluptatibus quia aliquam quae quia placeat non. Ut mollitia enim nostrum nobis sed quia.</p></li><li><p>Sit qui sed expedita aut. Sed corrupti beatae enim et cum aut fuga delectus. Dicta officiis dignissimos deserunt. Perspiciatis unde accusamus voluptatem ullam assumenda.</p></li><li><p>Voluptas autem tempore nam nihil. Sunt perferendis esse cumque est cum voluptas consectetur vero.</p></li><li><p>Voluptatem odit ad qui esse commodi sequi corrupti voluptas. Aut dolor ut ipsa quo quas rem.</p></li></ul><p>Assumenda perferendis quia vel. Porro itaque quaerat sint quidem praesentium occaecati omnis iste. Quos dolorem a hic culpa ut voluptates. Fuga est nemo a. Asperiores minima nemo ut ut. Neque eligendi quo iusto perferendis quos doloribus.</p><p>Praesentium aut eum accusamus. Dolorem perferendis est ipsam quasi consequatur et nihil. Eos hic sint omnis.</p>",
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
