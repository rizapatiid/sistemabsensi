import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import { togglePayrollStatusAction } from "@/actions/admin"
import PayrollForm from "./PayrollForm"

export default async function AdminPayrollPage() {
  const users = await prisma.user.findMany({ where: { role: "KARYAWAN" } })
  const payrolls = await prisma.payroll.findMany({ 
    include: { user: true },
    orderBy: [{ tahun: "desc" }, { bulan: "desc" }] 
  })

  // Basic Month List
  const bulanList = Array.from({length: 12}, (_, i) => i + 1)
  const currentYear = new Date().getFullYear()

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Kelola Penggajian (Payroll)</h1>
      
      <PayrollForm users={users} />

      <div className={`${styles.section} glass`}>
        <h2>Riwayat & Status Slip Gaji</h2>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataGrid}>
            <thead>
              <tr>
                <th>Periode (Bln/Thn)</th>
                <th>ID Karyawan</th>
                <th>Nama Karyawan</th>
                <th>Tot. Absensi</th>
                <th>Tipe</th>
                <th>Tunjangan</th>
                <th>Total Gaji</th>
                <th>Bank</th>
                <th>No. Rekening</th>
                <th>Status Pembayaran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map(p => (
                <tr key={p.id}>
                  <td>{p.bulan} / {p.tahun}</td>
                  <td>{p.idKaryawan}</td>
                  <td>{p.user.nama}</td>
                  <td>{p.tipeGaji === "HARIAN" ? p.jumlahAbsen : "-"}</td>
                  <td>{p.tipeGaji}</td>
                  <td>
                    Rp. {p.tunjangan.toLocaleString("id-ID")}
                    {p.ketTunjangan && <div style={{ fontSize: "0.8rem", color: "var(--text-color)", opacity: 0.7 }}>{p.ketTunjangan}</div>}
                  </td>
                  <td><strong style={{ color: "#22c55e" }}>Rp. {p.totalGaji.toLocaleString("id-ID")}</strong></td>
                  <td>{p.user.rekeningBank || '-'}</td>
                  <td>
                    {p.user.noRekening || '-'}
                    {p.user.namaRekening && <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>a.n. {p.user.namaRekening}</div>}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${p.statusPembayaran === 'LUNAS' ? styles.lunas : styles.belum}`}>
                      {p.statusPembayaran}
                    </span>
                  </td>
                  <td>
                    <form action={togglePayrollStatusAction.bind(null, p.id, p.statusPembayaran)}>
                      <button type="submit" className={`${styles.btnSm} ${p.statusPembayaran === 'LUNAS' ? styles.btnSecondary : styles.btnPrimary}`}>
                        {p.statusPembayaran === "LUNAS" ? "Set Belum Lunas" : "Set Lunas"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "2rem" }}>
                    Belum ada data gaji
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
