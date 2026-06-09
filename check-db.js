const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ select: { id: true, nama: true, role: true, phone: true } });
  console.log(users);
}
check();
