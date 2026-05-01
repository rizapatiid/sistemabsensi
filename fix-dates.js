const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const holidays = await prisma.calendar.findMany();
  for (const h of holidays) {
    // If it's saved with offset, fix it. 
    // e.g. 2026-04-30T17:00:00.000Z -> we want 2026-05-01T00:00:00.000Z
    // Because it was set using local time at midnight (00:00 WIB = 17:00 UTC previous day)
    
    // An easy way to fix is: if hour is 17 (UTC), it was meant for the NEXT day.
    const d = new Date(h.tanggal);
    if (d.getUTCHours() === 17) {
      d.setUTCHours(24, 0, 0, 0); // Adds 7 hours to make it 00:00 next day
      await prisma.calendar.update({
        where: { id: h.id },
        data: { tanggal: d }
      });
      console.log(`Updated ${h.keterangan} from ${h.tanggal} to ${d}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
