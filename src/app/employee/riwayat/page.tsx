import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import styles from "@/styles/riwayat_karyawan.module.css"
import CustomSelect from "@/components/CustomSelect"
import ImageModal from "./ImageModal"
import { formatWIBTime, formatIndonesianDate } from "@/lib/date"

export const dynamic = "force-dynamic"

// Professional Line Icons
const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
)
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
)
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
)
const IconCheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
)
const IconAlertCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
)
const IconUserCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>
)
const IconUserX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="18" y1="8" x2="23" y2="13" /><line x1="23" y1="8" x2="18" y2="13" /></svg>
)

export default async function EmployeeRiwayatPage({
  searchParams
}: {
  searchParams: Promise<{ month?: string, year?: string }>
}) {
  const session = await getSession()
  const params = await searchParams

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const selectedMonth = params.month ? parseInt(params.month) : currentMonth
  const selectedYear = params.year ? parseInt(params.year) : currentYear

  // Date Range Filtering
  const startDate = new Date(selectedYear, selectedMonth - 1, 1)
  const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59)

  const absensi = await prisma.attendance.findMany({
    where: {
      idKaryawan: session?.id,
      tanggal: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { tanggal: "desc" }
  })

  const stats = {
    totalHadir: absensi.filter(a => a.status === "HADIR").length,
    totalTidakHadir: absensi.filter(a => a.status !== "HADIR").length,
  }

  const months = [
    { v: 1, n: "Januari" }, { v: 2, n: "Februari" }, { v: 3, n: "Maret" },
    { v: 4, n: "April" }, { v: 5, n: "Mei" }, { v: 6, n: "Juni" },
    { v: 7, n: "Juli" }, { v: 8, n: "Agustus" }, { v: 9, n: "September" },
    { v: 10, n: "Oktober" }, { v: 11, n: "November" }, { v: 12, n: "Desember" }
  ]

  const years = []
  for (let y = currentYear; y >= currentYear - 3; y--) {
    years.push(y)
  }

  return (
    <div className={styles.pageContainer}>

      {/* 1. CLEAN HEADER SECTION */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
              color: '#1d4ed8',
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(29, 78, 216, 0.08)'
            }}>
              <IconCalendar />
            </div>
            <div>
              <h1 style={{ lineHeight: 1.2, margin: 0 }}>Riwayat Kehadiran</h1>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
            Laporan presensi periode {months.find(m => m.v === selectedMonth)?.n} {selectedYear}
          </p>

          <form className={styles.filterBar} method="GET">
            <CustomSelect 
              name="month" 
              className={styles.filterSelect} 
              defaultValue={selectedMonth}
              options={months.map(m => ({ value: m.v, label: m.n }))}
            />
            <CustomSelect 
              name="year" 
              className={styles.filterSelect} 
              defaultValue={selectedYear}
              options={years.map(y => ({ value: y, label: y.toString() }))}
            />
            <button type="submit" className={styles.filterAction}>
              <IconFilter />
              Filter Data
            </button>
          </form>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.metricIconWrapper} ${styles.iconHadir}`}>
              <IconUserCheck />
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricValueRow}>
                <span className={styles.statValue} style={{ color: '#0f172a' }}>{stats.totalHadir}</span>
              </div>
              <span className={styles.statLabel}>Hadir</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.metricIconWrapper} ${styles.iconIzin}`}>
              <IconUserX />
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricValueRow}>
                <span className={styles.statValue} style={{ color: '#0f172a' }}>{stats.totalTidakHadir}</span>
              </div>
              <span className={styles.statLabel}>Tidak Hadir</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACTIVITY LOG CARD */}
      <section className={styles.mainCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <span className={styles.hideOnMobile}>Tanggal & Hari</span>
                  <span className={styles.hideOnDesktop}>Tanggal & Waktu</span>
                </th>
                <th className={styles.hideOnMobile}>Waktu</th>
                <th>Status</th>
                <th>Keterangan / Alasan</th>
                <th style={{ textAlign: 'center' }}>Dokumentasi</th>
              </tr>
            </thead>
            <tbody>
              {absensi.map((a) => (
                <tr key={a.id}>
                  <td>
                    {/* Desktop Version */}
                    <div className={styles.hideOnMobile} style={{ whiteSpace: 'nowrap' }}>
                      <span className={styles.dateMain}>
                        {new Intl.DateTimeFormat("id-ID", { weekday: 'long', timeZone: "Asia/Jakarta" }).format(a.tanggal)}, {formatIndonesianDate(a.tanggal)}
                      </span>
                    </div>

                    {/* Mobile Version */}
                    <div className={styles.hideOnDesktop} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ whiteSpace: 'nowrap' }}>
                        <span className={styles.dateMain}>
                          {new Intl.DateTimeFormat("id-ID", { weekday: 'long', timeZone: "Asia/Jakarta" }).format(a.tanggal)}, {formatIndonesianDate(a.tanggal)}
                        </span>
                      </div>
                      <div style={{ color: '#475569', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {formatWIBTime(a.waktuMasuk)}
                      </div>
                    </div>
                  </td>
                  <td className={styles.hideOnMobile}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', color: '#1e3a8a', whiteSpace: 'nowrap' }}>
                      <IconClock />
                      {formatWIBTime(a.waktuMasuk)}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${a.status === 'HADIR' ? styles.badgeHadir : styles.badgeIzin}`}>
                      {a.status === 'HADIR' ? <IconCheckCircle /> : <IconAlertCircle />}
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div style={{
                      maxWidth: '220px',
                      fontSize: '0.8rem',
                      color: '#64748b',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      fontWeight: '600'
                    }}>
                      {a.status === 'IZIN' ? (a.alasan || 'Tidak ada alasan.') : 'Telah melakukan absensi.'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'center' }}>
                      {a.foto && <ImageModal src={a.foto} alt="Selfie" />}
                      {a.buktiApp && <ImageModal src={a.buktiApp} alt="App" />}
                      {!a.foto && !a.buktiApp && <span style={{ color: '#cbd5e1' }}>-</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {absensi.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    Tidak ditemukan rekaman aktivitas untuk periode ini.
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
