import prisma from "./prisma"

export async function getSystemSettings() {
    try {
        // Gunakan raw query agar tidak bergantung pada prisma generate yang terhambat file lock
        const result: any = await prisma.$queryRawUnsafe(
            `SELECT * FROM "SystemSetting" WHERE "id" = 'global' LIMIT 1`
        )

        let settings = result[0]

        if (!settings) {
            // Gunakan ON CONFLICT DO NOTHING untuk menangani race condition
            await prisma.$queryRawUnsafe(
                `INSERT INTO "SystemSetting" ("id", "maintenance", "updatedAt") VALUES ('global', false, NOW()) ON CONFLICT ("id") DO NOTHING`
            )
            // Ambil lagi setelah insert (siapa tahu sudah ada dari request lain)
            const retry: any = await prisma.$queryRawUnsafe(
                `SELECT * FROM "SystemSetting" WHERE "id" = 'global' LIMIT 1`
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

    return await prisma.$queryRawUnsafe(
        `INSERT INTO "SystemSetting" ("id", "maintenance", "maintenanceReason", "maintenanceUntil", "updatedAt") 
         VALUES ('global', ${value}, ${reasonValue}, ${untilValue}, NOW())
         ON CONFLICT ("id") DO UPDATE SET 
            "maintenance" = EXCLUDED."maintenance", 
            "maintenanceReason" = EXCLUDED."maintenanceReason", 
            "maintenanceUntil" = EXCLUDED."maintenanceUntil", 
            "updatedAt" = EXCLUDED."updatedAt"`
    )
}
