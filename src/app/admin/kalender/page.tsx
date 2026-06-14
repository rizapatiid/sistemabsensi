import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import KalenderClient from "./KalenderClient"

export default async function AdminKalenderPage() {
  const holidays = await prisma.calendar.findMany({ orderBy: { tanggal: "desc" } })

  const formattedHolidays = holidays.map(h => ({
    id: h.id,
    tanggal: h.tanggal.toISOString(),
    keterangan: h.keterangan,
    image: h.image
  }))

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '12px' }}>
      <KalenderClient holidays={formattedHolidays} />
    </div>
  )
}
