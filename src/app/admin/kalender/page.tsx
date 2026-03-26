import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import KalenderClient from "./KalenderClient"

export default async function AdminKalenderPage() {
  const holidays = await prisma.calendar.findMany({ orderBy: { tanggal: "desc" } })
  const announcements = await prisma.announcement.findMany({ orderBy: { tanggal: "desc" } })

  // Transform data untuk dikirim ke client component (keamanan date serialization)
  const formattedHolidays = holidays.map(h => ({ ...h, tanggal: h.tanggal.toISOString() }))
  const formattedAnnouncements = announcements.map(a => ({ ...a, tanggal: a.tanggal.toISOString() }))

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle}>Kelola Kalender & Pengumuman</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/kalender/tambah-libur" className={styles.actionBtn} style={{ textDecoration: "none" }}>
            + Set Hari Libur
          </Link>
          <Link href="/admin/kalender/tambah-pengumuman" className={styles.actionBtn} style={{ textDecoration: "none", backgroundColor: "#3b82f6" }}>
            + Buat Pengumuman
          </Link>
        </div>
      </div>
      
      <KalenderClient holidays={formattedHolidays} announcements={formattedAnnouncements} />
    </div>
  )
}
