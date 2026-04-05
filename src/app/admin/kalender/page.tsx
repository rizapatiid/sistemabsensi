import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import KalenderClient from "./KalenderClient"

export default async function AdminKalenderPage() {
  const holidays = await prisma.calendar.findMany({ orderBy: { tanggal: "desc" } })
  const announcements = await prisma.announcement.findMany({ orderBy: { tanggal: "desc" } })

  // Transform data untuk dikirim ke client component (keamanan date serialization)
  const formattedHolidays = holidays.map(h => ({
    id: h.id,
    tanggal: h.tanggal.toISOString(),
    keterangan: h.keterangan
  }))

  const formattedAnnouncements = announcements.map(a => ({
    id: a.id,
    judul: a.judul,
    konten: a.konten,
    image: a.image,
    tanggal: a.tanggal.toISOString()
  }))

  return (
    <div className={styles.pageContainer}>
      <KalenderClient holidays={formattedHolidays} announcements={formattedAnnouncements} />
    </div>
  )
}
