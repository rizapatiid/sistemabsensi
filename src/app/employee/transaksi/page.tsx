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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const IconMoney = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="10" width="16" height="10" rx="2"/>
    <circle cx="10" cy="15" r="2"/>
    <path d="M6 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>
  </svg>
)

const IconRotate = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
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
        
        <div className={styles.mobileList}>
          {payrolls.map(p => (
            <PayrollDetailModal 
              key={p.id}
              autoOpen={p.id === activeId}
              p={{
                ...p,
                nama: user?.nama || "",
                jabatan: user?.jabatan || "",
                namaRekening: user?.namaRekening || "",
              }} 
            >
              <div className={styles.mobileHistoryRow}>
                <div className={styles.mobileHistoryIcon}>
                  <IconMoney />
                </div>
                <div className={styles.mobileHistoryLeft}>
                  <div className={styles.mobileHistoryTitle}>Gaji Bulan {new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(p.tahun, p.bulan - 1))} {p.tahun}</div>
                  <div className={styles.mobileHistoryDesc}>{p.tipeGaji === "HARIAN" ? `${p.jumlahAbsen} Hari Kerja` : 'Kehadiran Penuh'}</div>
                </div>
                <div className={styles.mobileHistoryRight}>
                  <div className={styles.mobileHistoryAmount}>Rp {p.totalGaji.toLocaleString("id-ID")}</div>
                  <div className={styles.mobileHistoryStatus}>
                    <span className={`${styles.badge} ${p.statusPembayaran === 'DIBAYAR' ? styles.badgeLunas : styles.badgeBelum}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', padding: '4px 8px' }}>
                      {p.statusPembayaran === 'DIBAYAR' ? <IconCheckFile /> : <IconRotate />}
                      {p.statusPembayaran === 'DIBAYAR' ? 'Telah dibayar' : 'Diproses'}
                    </span>
                  </div>
                </div>
              </div>
            </PayrollDetailModal>
          ))}
          {payrolls.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Belum ada riwayat slip gaji yang tercatat secara sistemtis.
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
