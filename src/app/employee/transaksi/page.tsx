import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import styles from "@/styles/transaksi_karyawan.module.css"
import RekeningCombinedHero from "./RekeningCombinedHero"
import PayrollDetailModal from "./PayrollDetailModal"

// Clean Professional SVGs
const IconHistory = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
)
const IconClipboard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
)
const IconCheckFile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15.5l2 2 4-4"/></svg>
)
const IconMoney = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
)

export default async function EmployeeTransaksiPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  const activeId = params.payrollId as string
  const session = await getSession()
  const user = await prisma.user.findUnique({ where: { id: session?.id } })
  const payrolls = await prisma.payroll.findMany({
    where: { idKaryawan: session?.id },
    orderBy: [{ tahun: "desc" }, { bulan: "desc" }]
  })

  // Year summary calculation
  const totalGajiTahunIni = payrolls
    .filter(p => p.tahun === new Date().getFullYear())
    .reduce((acc, curr) => acc + curr.totalGaji, 0)

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. Header & Bank Details (Redesigned Hero) */}
      <RekeningCombinedHero 
        initialBank={user?.rekeningBank || ""}
        initialNoRek={user?.noRekening || ""}
        initialNamaRek={user?.namaRekening || ""}
        totalGajiTahunIni={totalGajiTahunIni}
      />

      {/* 2. Transaction History Table */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div style={{ color: '#1e3a8a' }}><IconClipboard /></div>
          <span className={styles.cardTitle}>Riwayat Transaksi</span>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconHistory /> Periode</div></th>
                <th>Detail Upah</th>
                <th>Gaji Pokok</th>
                <th>Tunjangan</th>
                <th><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconMoney /> Total Bersih</div></th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      {new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(p.tahun, p.bulan - 1))} {p.tahun}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '0.8rem', color: '#1e40af' }}>{p.tipeGaji}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {p.tipeGaji === "HARIAN" ? `${p.jumlahAbsen} Hari Kerja` : 'Kehadiran Penuh'}
                    </div>
                  </td>
                  <td style={{ fontWeight: '600', color: '#475569' }}>Rp {p.gajiPokok.toLocaleString("id-ID")}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>Rp {p.tunjangan.toLocaleString("id-ID")}</div>
                    {p.keteranganTunjangan && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.keteranganTunjangan}</div>}
                  </td>
                  <td>
                    <strong style={{ color: '#166534', fontSize: '1.05rem', fontWeight: '800' }}>
                      Rp {p.totalGaji.toLocaleString("id-ID")}
                    </strong>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${p.statusPembayaran === 'DIBAYAR' ? styles.badgeLunas : styles.badgeBelum}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {p.statusPembayaran === 'DIBAYAR' && <IconCheckFile />}
                      {p.statusPembayaran === 'DIBAYAR' ? 'DIBAYAR' : 'DIPROSES'}
                    </span>
                  </td>
                  <td>
                    <PayrollDetailModal 
                      autoOpen={p.id === activeId}
                      p={{
                        ...p,
                        nama: user?.nama || "",
                        jabatan: user?.jabatan || "",
                        namaRekening: user?.namaRekening || "",
                      }} 
                    />
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "60px", color: '#94a3b8', fontStyle: 'italic' }}>
                    Belum ada riwayat slip gaji yang tercatat secara sistemtis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
