import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import styles from "@/styles/riwayat_karyawan.module.css"
import ImageModal from "./ImageModal"
import { formatWIBTime, formatIndonesianDate } from "@/lib/date"

export const dynamic = "force-dynamic"

// Professional Line Icons
const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
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
    totalIzin: absensi.filter(a => a.status === "IZIN").length,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ color: '#1e3a8a' }}><IconCalendar /></div>
            <h1>Riwayat Kehadiran</h1>
          </div>
          <p>Laporan presensi karyawan periode {months.find(m => m.v === selectedMonth)?.n} {selectedYear}.</p>

          <form className={styles.filterBar} method="GET">
            <select name="month" className={styles.filterSelect} defaultValue={selectedMonth}>
              {months.map(m => (
                <option key={m.v} value={m.v}>{m.n}</option>
              ))}
            </select>
            <select name="year" className={styles.filterSelect} defaultValue={selectedYear}>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button type="submit" className={styles.filterAction}>
              <IconFilter />
              Filter Data
            </button>
          </form>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div style={{ color: '#166534', background: '#dcfce7', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconUserCheck />
            </div>
            <div>
              <span className={styles.statValue}>{stats.totalHadir}</span>
              <span className={styles.statLabel}>Hadir</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div style={{ color: '#1e40af', background: '#dbeafe', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconUserX />
            </div>
            <div>
              <span className={styles.statValue}>{stats.totalIzin}</span>
              <span className={styles.statLabel}>Izin</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACTIVITY LOG CARD */}
      <section className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div style={{ color: '#64748b' }}><IconClipboard /></div>
          <span className={styles.cardTitle}>Data Log Kehadiran Digital</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tanggal & Hari</th>
                <th>Waktu</th>
                <th>Status</th>
                <th>Keterangan / Alasan</th>
                <th style={{ textAlign: 'center' }}>Dokumentasi</th>
              </tr>
            </thead>
            <tbody>
              {absensi.map((a) => (
                <tr key={a.id}>
                  <td>
                    <span className={styles.dateMain}>
                      {formatIndonesianDate(a.tanggal)}
                    </span>
                    <span className={styles.dateSub}>
                      {new Intl.DateTimeFormat("id-ID", { weekday: 'long', timeZone: "Asia/Jakarta" }).format(a.tanggal)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', color: '#1e3a8a' }}>
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
