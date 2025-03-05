import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { hostPassword } from "../utils/password.utils";

const prisma = new PrismaClient();

async function main() {
  const usersData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "userData.json"), "utf-8")
  );

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: await hostPassword(userData.password),
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        balance: userData.balance || 0, // Default to 0 if balance is missing
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
