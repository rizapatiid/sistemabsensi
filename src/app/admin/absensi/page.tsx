import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import AbsensiAdminClient from "./AbsensiAdminClient"

export default async function AdminAbsensiPage() {
  const absensi = await prisma.attendance.findMany({
    include: {
      user: true
    },
    orderBy: {
      tanggal: "desc"
    }
  })

  return (
    <div className={styles.pageContainer}>
      <AbsensiAdminClient absensi={absensi} />
    </div>
  )
}
