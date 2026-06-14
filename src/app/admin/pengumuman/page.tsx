import prisma from "@/lib/prisma"
import styles from "@/styles/transaksi_karyawan.module.css"
import PengumumanClient from "./PengumumanClient"

export default async function AdminPengumumanPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { tanggal: "desc" } })

  const formattedAnnouncements = announcements.map(a => ({
    id: a.id,
    judul: a.judul,
    konten: a.konten,
    image: a.image,
    tanggal: a.tanggal.toISOString()
  }))

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '12px' }}>
      <PengumumanClient announcements={formattedAnnouncements} />
    </div>
  )
}
