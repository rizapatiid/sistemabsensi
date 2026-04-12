import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import styles from "@/styles/employee_home.module.css"
import Link from "next/link"
import AnnouncementClient from "./AnnouncementClient"
import { getTodayJakarta, formatWIBTime, getJakartaDate, formatIndonesianDate } from "@/lib/date"

// Institutional Icons
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const IconMoney = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
)
const IconMegaphone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
)
const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
)
const IconShield = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const IconChip = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

const MOTIVATIONAL_QUOTES = [
  "Semangat pagi! Langkah pertama hari ini menentukan kesuksesan hari esok.",
  "Kedisiplinan adalah jembatan antara cita-cita dan pencapaian.",
  "Fokuslah pada progres kecil setiap hari, itu adalah kunci keberhasilan.",
  "Integritas adalah melakukan hal yang benar, bahkan ketika tidak ada yang melihat.",
  "Kualitas kerja Anda adalah cerminan dari dedikasi dan profesionalisme Anda.",
  "Teruslah belajar, teruslah tumbuh. Batasan Anda adalah apa yang Anda impikan.",
  "Keberhasilan bukan tentang seberapa cepat Anda lari, tapi seberapa konsisten Anda melangkah.",
  "Mari kita bangun masa depan perusahaan ini dengan kerja keras dan kolaborasi.",
  "Setiap tantangan adalah peluang untuk membuktikan kemampuan terbaik Anda.",
  "Mulailah hari ini dengan syukur dan selesaikan dengan kepuasan hasil kerja.",
  "Kerja keras mengalahkan bakat ketika bakat tidak bekerja keras.",
  "Hari ini adalah kesempatan baru untuk menjadi lebih baik dari kemarin.",
  "Fokus pada solusi, bukan pada hambatan. Anda pasti bisa!",
  "Profesionalisme dimulai dari hal terkecil yang kita lakukan secara konsisten.",
  "Jadilah inspirasi bagi rekan kerja Anda melalui dedikasi yang tulus.",
  "Waktu adalah aset berharga, gunakan setiap menit untuk produktivitas maksimal.",
  "Keyakinan adalah modal utama untuk menaklukkan setiap target besar.",
  "Jangan menunggu instruksi, jadilah inisiatif yang membawa perubahan positif.",
  "Sinergi kita hari ini akan melahirkan prestasi besar di masa depan.",
  "Kesehatan dan keselamatan kerja adalah prioritas utama kita bersama.",
  "Setiap tetes keringat kerja keras akan membuahkan hasil yang manis.",
  "Kesalahan adalah pelajaran berharga jika kita berani memperbaikinya.",
  "Tetap positif, tetap produktif. Mari kita cetak skor tertinggi hari ini!",
  "Keunggulan bukan sebuah tindakan, melainkan sebuah kebiasaan.",
  "Visi tanpa aksi hanyalah mimpi, mari kita wujudkan visi perusahaan kita.",
  "Ketekunan adalah rahasi dari setiap pencapaian yang luar biasa.",
  "Semangat kolaborasi akan membuat pekerjaan berat terasa lebih ringan.",
  "Jadikan hari ini sebagai capaian terbaik dalam karir profesional Anda.",
  "Keberhasilan hari ini dimulai dari kedisiplinan absen di pagi hari.",
  "Berikan yang terbaik untuk tim, maka tim akan memberikan yang terbaik untuk Anda.",
  "Masa depan cerah menanti mereka yang bekerja dengan hati dan logika."
]

export default async function EmployeeHomePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession()
  if (!session) return null

  const today = getTodayJakarta()
  const now = getJakartaDate()

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)

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
    take: 4
  })

  const hadirCount = monthlyAttendances.filter(a => a.status === "HADIR").length
  const izinCount = monthlyAttendances.filter(a => a.status === "IZIN" || a.status === "LAINNYA").length

  // Select quote based on date (rotates through 31 quotes)
  const quoteIndex = today.getDate() - 1
  const dailyQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0]

  return (
    <div className={styles.pageContainer}>

      {/* 1. COMMAND CENTER HEADER */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1>Halo, {user?.nama} 👋</h1>
          <p>{dailyQuote}</p>
        </div>
      </section>

      {/* 2. LUSH METRICS GRID */}
      <section className={styles.metricsGrid}>
        
        {/* CARD 1: STATUS PRESENSI */}
        <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
                <div className={styles.metricTitleStack}>
                    <span className={styles.metricLabel}>Status Presensi</span>
                    <span className={styles.metricSublabel}>Hari In: {formatIndonesianDate(today, false)}</span>
                </div>
                <div className={styles.metricIconCircle}><IconClock /></div>
            </div>
            <div className={styles.metricBody}>
                {hasAbsenToday ? (
                    <div className={`${styles.statusBox} ${hasAbsenToday.status === "HADIR" ? styles.statusHadir : styles.statusAbsen}`}>
                        <span className={styles.statusTitle}>{hasAbsenToday.status === "HADIR" ? "PRESENSI TERVERIFIKASI" : "IZIN TERCATAT"}</span>
                        <div className={styles.statusValue}>{hasAbsenToday.status === "HADIR" ? formatWIBTime(hasAbsenToday.waktuMasuk) : "IZIN"}</div>
                    </div>
                ) : isWeekend || isHoliday ? (
                    <div className={`${styles.statusBox} ${styles.statusLibur}`}>
                        <span className={styles.statusTitle}>HARI LIBUR OPERASIONAL</span>
                        <div className={styles.statusValue}>{isHoliday?.keterangan || "Libur Pekan"}</div>
                    </div>
                ) : (
                    <div className={`${styles.statusBox} ${styles.statusAbsen}`} style={{ background: '#fef2f2', borderColor: '#fee2e2', color: '#991b1b' }}>
                        <span className={styles.statusTitle}>BELUM MELAKUKAN PRESENSI</span>
                        <Link href="/employee/absensi" style={{ fontSize: '1.25rem', fontWeight: 1000, color: '#991b1b', textDecoration: 'none' }}>Lapor Sekarang →</Link>
                    </div>
                )}
            </div>
        </div>

        {/* CARD 2: RINGKASAN KEHADIRAN */}
        <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
                <div className={styles.metricTitleStack}>
                    <span className={styles.metricLabel}>Ringkasan Kehadiran</span>
                    <span className={styles.metricSublabel}>Periode: {formatIndonesianDate(today, false).split(' ').slice(1).join(' ').toUpperCase()}</span>
                </div>
                <div className={styles.metricIconCircle}><IconCalendar /></div>
            </div>
            <div className={styles.metricBody}>
                <div className={styles.attendanceSummaryGrid}>
                    <div className={styles.summaryBox}>
                        <div className={styles.summaryVal}>{hadirCount}<span className={styles.summaryUnit}>Hari</span></div>
                        <div className={styles.summaryLabel}>HADIR</div>
                    </div>
                    <div className={styles.summaryBox}>
                        <div className={styles.summaryVal} style={{ color: '#ef4444' }}>{izinCount}<span className={styles.summaryUnit}>Hari</span></div>
                        <div className={styles.summaryLabel}>IZIN/ABSEN</div>
                    </div>
                </div>
            </div>
        </div>

        {/* CARD 3: PAYROLL TERAKHIR */}
        <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
                <div className={styles.metricTitleStack}>
                    <span className={styles.metricLabel}>Payroll Terakhir</span>
                    <span className={styles.metricSublabel}>Transper Berhasil</span>
                </div>
                <div className={styles.metricIconCircle}><IconMoney /></div>
            </div>
            <div className={styles.metricBody}>
                <div className={styles.payrollAmount}>
                    Rp {lastPayroll?.totalGaji.toLocaleString("id-ID") || "0"}
                </div>
                <div className={styles.payrollStatus}>
                    <div className={styles.statusIndicator} style={{ background: lastPayroll?.statusPembayaran === "DIBAYAR" ? '#22c55e' : '#f59e0b' }}></div>
                    <span style={{ color: lastPayroll?.statusPembayaran === "DIBAYAR" ? '#166534' : '#9a3412' }}>
                        {lastPayroll?.statusPembayaran === "DIBAYAR" ? "DIBAYAR" : "SEDANG DIPROSES"}
                    </span>
                    <Link href="/employee/transaksi" style={{ marginLeft: 'auto', color: '#3b82f6', textDecoration: 'none' }}>Slip Gaji →</Link>
                </div>
            </div>
        </div>

      </section>

      {/* 3. MAIN HUB GRID */}
      <main className={styles.mainContent}>
        
        {/* FEED COLL */}
        <div className={styles.feedCol}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}><IconMegaphone /> Feed Pengumuman</h2>
                    <Link href="/employee/pengumuman" className={styles.seeAllLink}>SELENGKAPNYA →</Link>
                </div>
                <AnnouncementClient announcements={announcements} />
            </div>
        </div>

        {/* SIDEBAR HUB */}
        <aside className={styles.sidebar}>
            
            {/* ELITE BANK CARD */}
            <div className={styles.bankWidget}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <label style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Institutional Payroll Account</label>
                    <IconChip />
                </div>
                <div className={styles.bankId}>
                    {user?.noRekening ? user.noRekening.replace(/(\d{4})/g, '$1 ') : "RESTRICTED"}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Atas Nama (a.n)</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 1000, color: 'white', marginTop: '2px' }}>{user?.namaRekening || user?.nama || "Restricted Access"}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8' }}>
                        {user?.rekeningBank || "Bank Transfer"}
                    </div>
                    <Link href="/employee/transaksi?openValidasi=true" className={styles.bankAction} style={{ margin: 0, padding: '8px 16px' }}>PERBARUI</Link>
                </div>
            </div>

            {/* UPCOMING HOLIDAYS */}
            <div className={styles.card} style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ color: '#0f172a' }}><IconCalendar /></div>
                    <h3 className={styles.cardTitle} style={{ fontSize: '1.1rem', border: 'none', padding: 0, margin: 0 }}>Kalender Hari Libur</h3>
                </div>
                <div className={styles.holidayList}>
                    {upcomingHolidays.map(h => (
                        <div key={h.id} className={styles.holidayItem}>
                            <div className={styles.holidayDateBlock}>
                                <span className={styles.holidayMonth}>{formatIndonesianDate(h.tanggal, false).split(' ')[1].slice(0, 3).toUpperCase()}</span>
                                <span className={styles.holidayDay}>{h.tanggal.getDate()}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1rem', fontWeight: 1000, color: '#0f172a', letterSpacing: '-0.02em' }}>{h.keterangan}</div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 800, marginTop: '2px' }}>
                                    Hari {new Intl.DateTimeFormat("id-ID", { weekday: 'long' }).format(h.tanggal)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data Kalender Operasional 2026</span>
                </div>
            </div>

            {/* PROTOCOL BLOCK */}
            <div className={styles.infoBlock}>
                <div style={{ color: '#0f172a', flexShrink: 0 }}><IconShield /></div>
                <div>
                   <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 1000, color: '#0f172a' }}>Pemberitahuan Sistem</h4>
                   <p style={{ margin: '12px 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', fontWeight: 600 }}>
                      Sistem presensi digital mewajibkan verifikasi wajah dan screenshot aplikasi sebagai bukti sah. Keterlambatan akan tercatat secara otomatis pada server pusat.
                   </p>
                </div>
            </div>

        </aside>
      </main>

    </div>
  )
}
