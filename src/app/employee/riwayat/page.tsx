import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import styles from "@/styles/admin.module.css"

export default async function EmployeeRiwayatPage() {
  const session = await getSession()
  const absensi = await prisma.attendance.findMany({
    where: { idKaryawan: session?.id },
    orderBy: { tanggal: "desc" }
  })

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Riwayat Kehadiran</h1>
      
      <div className={`${styles.section} glass`}>
        <h2>Data Historis</h2>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataGrid}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Waktu Masuk</th>
                <th>Status</th>
                <th>Selfie</th>
                <th>App</th>
              </tr>
            </thead>
            <tbody>
              {absensi.map((a) => (
                <tr key={a.id}>
                  <td>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(a.tanggal)}</td>
                  <td>{new Intl.DateTimeFormat("id-ID", { timeStyle: "medium" }).format(a.waktuMasuk)}</td>
                  <td>
                    <span className={`${styles.badge} ${a.status === 'HADIR' ? styles.hadir : styles.izin}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.foto ? (
                      <img src={a.foto} alt="Selfie" style={{ width: "35px", height: "35px", objectFit: "cover", borderRadius: "4px" }} />
                    ) : "-"}
                  </td>
                  <td>
                    {a.buktiApp ? (
                      <img src={a.buktiApp} alt="App" style={{ width: "35px", height: "35px", objectFit: "cover", borderRadius: "4px" }} />
                    ) : "-"}
                  </td>
                </tr>
              ))}
              {absensi.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                    Belum ada riwayat absensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
