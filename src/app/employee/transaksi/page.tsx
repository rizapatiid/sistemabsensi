import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { updateRekeningAction } from "@/actions/employeeUser"
import styles from "@/styles/admin.module.css"
import RekeningForm from "./RekeningForm"
import PayrollDetailModal from "./PayrollDetailModal"

export default async function EmployeeTransaksiPage() {
  const session = await getSession()
  const user = await prisma.user.findUnique({ where: { id: session?.id } })
  const payrolls = await prisma.payroll.findMany({
    where: { idKaryawan: session?.id },
    orderBy: [{ tahun: "desc" }, { bulan: "desc" }]
  })

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Transaksi & Payroll</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "1000px" }}>
        
        {/* Kolom Informasi Rekening */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <RekeningForm 
            initialBank={user?.rekeningBank || ""} 
            initialNoRek={user?.noRekening || ""} 
            initialNamaRek={user?.namaRekening || ""} 
          />
        </div>

        {/* Kolom Riwayat Slip Gaji */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className={`${styles.section} glass`}>
            <h2>Riwayat Penerimaan Gaji</h2>
            <div style={{ overflowX: "auto" }}>
              <table className={styles.dataGrid}>
                <thead>
                  <tr>
                    <th>Periode</th>
                    <th>Tipe & Kehadiran</th>
                    <th>Gaji Pokok</th>
                    <th>Tunjangan</th>
                    <th>Total Diterima</th>
                    <th>Status</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map(p => (
                    <tr key={p.id}>
                      <td>Bulan {p.bulan} / {p.tahun}</td>
                      <td>
                        {p.tipeGaji} 
                        {p.tipeGaji === "HARIAN" && ` (${p.jumlahAbsen} Hari)`}
                      </td>
                      <td>Rp. {p.gajiPokok.toLocaleString("id-ID")}</td>
                      <td>
                        Rp. {p.tunjangan.toLocaleString("id-ID")}
                        {p.ketTunjangan && <div style={{ fontSize: "0.8rem", color: "var(--text-color)", opacity: 0.7 }}>{p.ketTunjangan}</div>}
                      </td>
                      <td><strong style={{ color: "#22c55e" }}>Rp. {p.totalGaji.toLocaleString("id-ID")}</strong></td>
                      <td>
                        <span className={`${styles.badge} ${p.statusPembayaran === 'LUNAS' ? styles.lunas : styles.belum}`}>
                          {p.statusPembayaran}
                        </span>
                      </td>
                      <td>
                        <PayrollDetailModal p={{
                          ...p,
                          nama: user?.nama || "",
                          jabatan: user?.jabatan || "",
                          namaRekening: user?.namaRekening || "",
                          bankSnapshot: p.bankSnapshot,
                          noRekeningSnapshot: p.noRekeningSnapshot,
                          namaRekeningSnapshot: p.namaRekeningSnapshot
                        }} />
                      </td>
                    </tr>
                  ))}
                  {payrolls.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: "1rem" }}>Data slip gaji kosong</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
