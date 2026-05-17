import prisma from "./prisma"

export async function getSystemSettings() {
    try {
        const result: any = await prisma.$queryRawUnsafe(
            "SELECT * FROM `SystemSetting` WHERE `id` = 'global' LIMIT 1"
        )

        let settings = result[0]

        if (!settings) {
            // MySQL: INSERT IGNORE untuk handle race condition (tidak error kalau sudah ada)
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
}

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
