import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import styles from "@/styles/employee_home.module.css"
import Link from "next/link"
import AnnouncementClient from "./AnnouncementClient"
import { getTodayJakarta, formatWIBTime, getJakartaDate, formatIndonesianDate } from "@/lib/date"

// Unified High-End Icons
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)
const IconCreditCard = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
)
const IconAnnounce = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
)
const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
)
const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
)

export default async function EmployeeHomePage() {
  const session = await getSession()
  if (!session) return null

  const today = getTodayJakarta()
  const now = getJakartaDate()

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  const monthlyAttendances = await prisma.attendance.findMany({
    where: { idKaryawan: session.id, tanggal: { gte: firstDay, lte: lastDay } }
  })

  const isHoliday = await prisma.calendar.findFirst({ where: { tanggal: today } })
  const hasAbsenToday = await prisma.attendance.findUnique({
    where: { idKaryawan_tanggal: { idKaryawan: session.id, tanggal: today } }
  })
  const isWeekend = today.getDay() === 0 || today.getDay() === 6

  const announcements = await prisma.announcement.findMany({ 
    where: { OR: [{ scheduleDate: null }, { scheduleDate: { lte: now } }] },
    orderBy: { tanggal: "desc" },
    take: 5
  })

  const lastPayroll = await prisma.payroll.findFirst({
    where: { idKaryawan: session.id },
    orderBy: [{ tahun: "desc" }, { bulan: "desc" }]
  })

  const upcomingHolidays = await prisma.calendar.findMany({
    where: { tanggal: { gte: today } },
    orderBy: { tanggal: "asc" },
    take: 3
  })

  const hadirCount = monthlyAttendances.filter(a => a.status === "HADIR").length
  const izinCount = monthlyAttendances.filter(a => a.status === "IZIN").length

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. Interactive Hero Banner (Blue) */}
      <section className={styles.heroSection}>
        <div className={styles.heroGreeting}>
          <p>Selamat datang,</p>
          <h1>{user?.nama?.toUpperCase()}</h1>
        </div>
        
        <div className={styles.heroInfoStack}>
          <div className={styles.heroMeta}>
            {user?.id} | {user?.jabatan || "Staff Officer"}
          </div>
        </div>
      </section>

      {/* 2. Professional Metrics Row */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHead}>
            <span className={styles.metricLabel}>STATUS ABSENSI HARI INI</span>
            <div className={styles.metricIcon}><IconClock /></div>
          </div>
          {hasAbsenToday ? (
            <div className={`${styles.attendanceStatus} ${hasAbsenToday.status === "HADIR" ? styles.statusHadir : styles.statusIzin}`}>
              <h4>{hasAbsenToday.status === "HADIR" ? "SUDAH PRESENSI" : "IZIN TERCATAT"}</h4>
              {hasAbsenToday.status === "HADIR" ? (
                <span>{formatWIBTime(hasAbsenToday.waktuMasuk)}</span>
              ) : (
                <p style={{ fontSize: '0.7rem', color: '#1a567e', fontWeight: '800', margin: '4px 0 0', textTransform: 'uppercase' }}>
                  {hasAbsenToday.alasan || "Alasan Izin"}
                </p>
              )}
            </div>
          ) : isWeekend || isHoliday ? (
            <div className={`${styles.attendanceStatus} ${styles.statusLibur}`}>
              <h4>HARI LIBUR</h4>
              <p>{isHoliday?.keterangan || "Libur Pekan"}</p>
            </div>
          ) : (
            <div className={`${styles.attendanceStatus} ${styles.statusAbsen}`}>
              <h4>BELUM PRESENSI</h4>
              <Link href="/employee/absensi">Lapor Sekarang →</Link>
            </div>
          )}
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHead}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span className={styles.metricLabel}>RINGKASAN KEHADIRAN</span>
               <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#1a567e', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                 PERIODE: {formatIndonesianDate(today).split(' ')[1].toUpperCase()}
               </span>
            </div>
            <div className={styles.metricIcon}><IconCalendar /></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <div style={{ flex: 1, padding: '14px', background: '#f0fdf4', borderRadius: '14px', border: '1px solid #dcfce7' }}>
               <h4 style={{ fontSize: '0.6rem', fontWeight: '900', color: '#166534', opacity: 0.7, margin: 0, letterSpacing: '0.05em' }}>HADIR</h4>
               <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#166534', letterSpacing: '-0.5px' }}>{hadirCount}</span>
               <span style={{ fontSize: '0.75rem', color: '#166534', marginLeft: '4px', fontWeight: '800' }}>Hari</span>
            </div>
            <div style={{ flex: 1, padding: '14px', background: '#fef2f2', borderRadius: '14px', border: '1px solid #fee2e2' }}>
               <h4 style={{ fontSize: '0.6rem', fontWeight: '900', color: '#991b1b', opacity: 0.7, margin: 0, letterSpacing: '0.05em' }}>IZIN/ABSEN</h4>
               <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#991b1b', letterSpacing: '-0.5px' }}>{izinCount}</span>
               <span style={{ fontSize: '0.75rem', color: '#991b1b', marginLeft: '4px', fontWeight: '800' }}>Hari</span>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHead}>
            <span className={styles.metricLabel}>PAYROLL TERAKHIR</span>
            <div className={styles.metricIcon}><IconCreditCard /></div>
          </div>
          <div className={styles.metricValue}>
            Rp {lastPayroll?.totalGaji.toLocaleString("id-ID") || "0"}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Status: <span style={{ fontWeight: '700', color: lastPayroll?.statusPembayaran === "LUNAS" ? "#166534" : "#991b1b" }}>{lastPayroll?.statusPembayaran || "N/A"}</span></p>
            <Link href="/employee/transaksi" style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1a567e', textDecoration: 'none' }}>Lihat Detail →</Link>
          </div>
        </div>
      </section>

      {/* 3. Main Split Layout */}
      <main className={styles.mainContent}>
        
        {/* Left Column: Interactive Announcements List */}
        <div className={styles.announceCol}>
          <h2 className={styles.sectionTitle}><IconAnnounce /> Pengumuman Terbaru</h2>
          <AnnouncementClient announcements={announcements} />
        </div>

        {/* Right Column: Sidebar Blocks */}
        <aside className={styles.sidebar}>
          
          <div className={styles.sidebarCard}>
            <h2 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: '20px' }}>Kalender Libur</h2>
            <div className={styles.holidayList}>
              {upcomingHolidays.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Tidak ada jadwal libur.</p>
              ) : (
                upcomingHolidays.map((h) => (
                  <div key={h.id} className={styles.holidayItem}>
                    <div className={styles.holidayDate}>
                      <span className={styles.holidayMonth}>{formatIndonesianDate(h.tanggal, false).split(' ')[1].toUpperCase()}</span>
                      <span className={styles.holidayDay}>{h.tanggal.getDate()}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{h.keterangan}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(h.tanggal)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.bankCard}>
            <label>REKENING PAYROLL</label>
            {user?.noRekening ? (
              <>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', marginTop: '8px' }}>{user.rekeningBank}</div>
                <div className={styles.bankNumber}>{user.noRekening.replace(/(\d{4})/g, '$1 ')}</div>
                <p className={styles.bankOwner}>A.N. {user?.namaRekening}</p>
              </>
            ) : (
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '12px' }}>Belum diatur.</p>
            )}
            <Link href="/employee/profil" className={styles.actionBtn}>PENGATURAN DATA</Link>
          </div>

          <div className={styles.sidebarCard} style={{ background: '#f8fafc', borderStyle: 'dashed' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconInfo /> Protokol Pelaporan
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.6', marginTop: '12px' }}>
              <strong>Presensi: 07.00 - 09.00 WIB.</strong> Keterlambatan tanpa konfirmasi akan otomatis tercatat oleh sistem.
            </p>
          </div>
        </aside>
      </main>
    </div>
  )
}
