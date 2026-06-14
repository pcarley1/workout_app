import { PrismaClient } from "@prisma/client";
import { baselineTests, exercises } from "../src/lib/seedData";

const prisma = new PrismaClient();

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      create: exercise,
      update: exercise
    });
  }

  for (const test of baselineTests) {
    await prisma.baselineTest.upsert({
      where: { slug: test.slug },
      create: test,
      update: test
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
