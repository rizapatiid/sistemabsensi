import { cache } from "react"
import { unstable_cache } from "next/cache"
import prisma from "./prisma"

// Cache per-request dengan React cache() agar tidak dipanggil berkali-kali dalam satu request
// Tambahan unstable_cache agar hasil di-cache 60 detik antar request (tidak perlu hit DB setiap halaman)
export const getSystemSettings = cache(
  unstable_cache(
    async () => {
      try {
        const result: any = await prisma.$queryRawUnsafe(
          "SELECT * FROM `SystemSetting` WHERE `id` = 'global' LIMIT 1"
        )

        let settings = result[0]

        if (!settings) {
          await prisma.$queryRawUnsafe(
            "INSERT IGNORE INTO `SystemSetting` (`id`, `maintenance`, `updatedAt`) VALUES ('global', false, NOW())"
          )
          const retry: any = await prisma.$queryRawUnsafe(
            "SELECT * FROM `SystemSetting` WHERE `id` = 'global' LIMIT 1"
          )
          settings = retry[0] || { maintenance: false }
        }

        return settings
      } catch (error) {
        console.error("Gagal mengambil pengaturan sistem:", error)
        return { maintenance: false }
      }
    },
    ["system-settings"],
    { revalidate: 60 } // Cache 60 detik — settings jarang berubah
  )
)

export async function toggleMaintenanceMode(value: boolean, reason?: string, until?: string) {
    const reasonValue = reason ? `'${reason.replace(/'/g, "''")}'` : 'NULL'
    const untilValue = until ? `'${until.replace(/'/g, "''")}'` : 'NULL'

    // MySQL: ON DUPLICATE KEY UPDATE (pengganti PostgreSQL ON CONFLICT DO UPDATE)
    return await prisma.$queryRawUnsafe(
        `INSERT INTO \`SystemSetting\` (\`id\`, \`maintenance\`, \`maintenanceReason\`, \`maintenanceUntil\`, \`updatedAt\`) 
         VALUES ('global', ${value}, ${reasonValue}, ${untilValue}, NOW())
         ON DUPLICATE KEY UPDATE 
            \`maintenance\` = VALUES(\`maintenance\`), 
            \`maintenanceReason\` = VALUES(\`maintenanceReason\`), 
            \`maintenanceUntil\` = VALUES(\`maintenanceUntil\`), 
            \`updatedAt\` = VALUES(\`updatedAt\`)`
    )
}
