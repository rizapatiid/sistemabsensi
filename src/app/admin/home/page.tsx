import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"

export default async function AdminHomePage() {
  const employeeCount = await prisma.user.count({ where: { role: "KARYAWAN" } })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const presentToday = await prisma.attendance.count({
    where: {
      tanggal: { gte: today },
      status: "HADIR"
    }
  })

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Dashboard Admin</h1>
      
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass`}>
          <div className={styles.statLabel}>Total Karyawan</div>
          <div className={styles.statValue}>{employeeCount}</div>
        </div>
        <div className={`${styles.statCard} glass`}>
          <div className={styles.statLabel}>Hadir Hari Ini</div>
          <div className={styles.statValue}>{presentToday}</div>
        </div>
        <div className={`${styles.statCard} glass`}>
          <div className={styles.statLabel}>Status Sistem</div>
          <div className={styles.statValue} style={{ color: "var(--secondary)" }}>Aktif</div>
        </div>
      </div>

      <div className={`${styles.section} glass`}>
        <h2>Aksi Cepat</h2>
        <div className={styles.actionsList}>
          <a href="/admin/karyawan" className={styles.actionBtn}>+ Tambah Karyawan</a>
          <a href="/admin/payroll" className={styles.actionBtn}>Kelola Payroll</a>
          <a href="/admin/kalender" className={styles.actionBtn}>Buat Pengumuman</a>
        </div>
      </div>
    </div>
  )
}
