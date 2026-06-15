import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import employeeStyles from "@/styles/employee_home.module.css"
import { getSession } from "@/actions/auth"
import Link from "next/link"
import { getTodayJakarta, formatWIBTime, getJakartaDate, formatIndonesianDate } from "@/lib/date"
import { getSystemSettings } from "@/lib/settings"
import LiveServerTime from "@/components/LiveServerTime"

// World-Class Command Icons
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)
const IconCheckIn = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.3 3"/><path d="M14 22a10 10 0 0 0-4-4"/><path d="M18 12a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 2.21.12 4.41.34 6.61"/><path d="M22 12a10 10 0 0 0-10-10A10 10 0 0 0 2 12c0 4.23 1.01 8.42 3 12"/><path d="M8 22a10 10 0 0 1-1-4 10 10 0 0 1 10-10"/></svg>
)
const IconMoney = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
)

const IconChat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
)

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)

const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
)
const IconActivity = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
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

export default async function AdminHomePage() {
    const session = await getSession()
    if (!session) return null

    const user = await prisma.user.findUnique({ where: { id: session.id } })
    const totalEmployees = await prisma.user.count({ where: { role: "KARYAWAN" } })
    const today = getTodayJakarta()


    const presentTodayCount = await prisma.attendance.count({
        where: { tanggal: { gte: today }, status: "HADIR" }
    })

    const diprosesPayrolls = await prisma.payroll.findMany({
        where: { statusPembayaran: "DIPROSES" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 5
    })

    const recentEmployees = await prisma.user.findMany({
        where: { role: "KARYAWAN", status: "AKTIF" },
        select: { id: true, nama: true, jabatan: true },
        orderBy: { createdAt: "desc" },
        take: 5
    })

    const recentAttendance = await prisma.attendance.findMany({
        where: { tanggal: { gte: today } },
        include: { user: true },
        orderBy: { waktuMasuk: "desc" },
        take: 5
    })

    const attendanceRate = totalEmployees > 0 ? (presentTodayCount / totalEmployees) * 100 : 0
    const settings = await getSystemSettings()
    const nowJakarta = getJakartaDate()
    const formattedTime = formatWIBTime(nowJakarta)
    const formattedDate = formatIndonesianDate(nowJakarta, true)
    const dayName = new Intl.DateTimeFormat("id-ID", { weekday: 'long', timeZone: 'Asia/Jakarta' }).format(nowJakarta)

    const upcomingHolidays = await prisma.calendar.findMany({
        where: { tanggal: { gte: today } },
        orderBy: { tanggal: "asc" },
        take: 4
    })

    const quoteIndex = today.getDate() - 1
    const dailyQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0]

    return (
        <div className={employeeStyles.pageContainer} style={{ maxWidth: 'none' }}>
                {/* 4. THE BENTO GRID */}
                <div className={employeeStyles.bentoGrid}>
                    
                    {/* BENTO BOX 1: PROFILE */}
                    <section className={`${employeeStyles.bentoBox} ${employeeStyles.profileBox} ${styles.adminProfileBox}`}>
                        {/* Background Decor (Shield/Activity Icon) */}
                        <svg className={employeeStyles.profileBgIcon} width="200" height="200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div className={employeeStyles.profileContent}>
                            <p className={employeeStyles.greeting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                SELAMAT DATANG,
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#fde047' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </p>
                            <h1 className={employeeStyles.userName}>{user?.nama}</h1>
                            <p className={employeeStyles.quote}>&quot;{dailyQuote}&quot;</p>
                        </div>
                    </section>

                    {/* BENTO BOX 2: SYSTEM HEALTH STATUS */}
                    <section className={`${employeeStyles.bentoBox} ${employeeStyles.todayStatusBox} ${styles.adminTodayStatusBox}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', textAlign: 'left', padding: '24px' }}>
                        {/* Background Decor (Server Grid Icon) */}
                        <svg className={employeeStyles.statusBgIcon} width="160" height="160" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8} style={{ opacity: 0.025, right: '-15px', bottom: '-15px', position: 'absolute', pointerEvents: 'none' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>

                        {/* Card Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <div style={{ background: '#f1f5f9', color: '#475569', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                                </svg>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Command Center Status</span>
                        </div>

                        {/* Info Grid (Side-by-side on Desktop, Stacked on Mobile) */}
                        <div className={styles.statusContainer}>
                            {/* Server Status Box */}
                            <Link href="/admin/pengaturan" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: settings?.maintenance ? 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: settings?.maintenance ? '1px solid #fca5a5' : '1px solid #86efac', padding: '14px 18px', borderRadius: '16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: settings?.maintenance ? '0 4px 12px rgba(239, 68, 68, 0.05)' : '0 4px 12px rgba(16, 185, 129, 0.05)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                                            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: settings?.maintenance ? '#ef4444' : '#22c55e', opacity: 0.4, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}></span>
                                            <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: settings?.maintenance ? '#ef4444' : '#22c55e' }}></span>
                                        </span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: settings?.maintenance ? '#dc2626' : '#15803d', letterSpacing: '0.02em' }}>Status Operasional</span>
                                    </div>
                                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: settings?.maintenance ? '#991b1b' : '#166534', letterSpacing: '-0.3px' }}>
                                        {settings?.maintenance ? 'Mode Perawatan' : 'Sistem Online'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.8)', padding: '7px 12px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', letterSpacing: '0.01em' }}>Kelola</span>
                                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#94a3b8' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>

                            {/* Details Grid */}
                            <LiveServerTime initialTime={formattedTime} initialDate={formattedDate} initialDayName={dayName} />
                        </div>
                    </section>

                    {/* BENTO BOX 2.5: OPERATIONAL ACCESS BAR */}
                    <section className={`${employeeStyles.quickActionsSection} ${styles.adminQuickActionsSection}`}>
                        <div className={styles.quickActionsBar} style={{ paddingBottom: '4px', marginBottom: 0 }}>
                            <Link href="/admin/absensi" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #f0fdf8)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', color: '#059669', boxShadow: '0 4px 12px rgba(5,150,105,0.15)' }}><IconCheckIn /></div>
                                Absensi
                            </Link>
                            <Link href="/admin/payroll" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #fff7ed)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #ffedd5, #fed7aa)', color: '#ea580c', boxShadow: '0 4px 12px rgba(234,88,12,0.15)' }}><IconMoney /></div>
                                Payroll
                            </Link>
                            <Link href="/admin/pengumuman" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #fffbeb)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#d97706', boxShadow: '0 4px 12px rgba(217,119,6,0.15)' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
                                </div>
                                Pengumuman
                            </Link>
                            <Link href="/admin/kalender" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #fff5f5)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#ef4444', boxShadow: '0 4px 12px rgba(239,68,68,0.15)' }}><IconCalendar /></div>
                                Kalender
                            </Link>
                            <Link href="/admin/karyawan" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #eff6ff)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#2563eb', boxShadow: '0 4px 12px rgba(37,99,235,0.15)' }}><IconUsers /></div>
                                Karyawan
                            </Link>
                            <Link href="/admin/kelola-admin" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #fdf2f8)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', color: '#ec4899', boxShadow: '0 4px 12px rgba(236,72,153,0.15)' }}><IconShield /></div>
                                Tim Admin
                            </Link>
                            <Link href="/admin/chat" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #f5f3ff)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', color: '#8b5cf6', boxShadow: '0 4px 12px rgba(139,92,246,0.15)' }}><IconChat /></div>
                                Chat
                            </Link>
                            <Link href="/admin/pengaturan" className={styles.quickActionBtn} style={{'--card-bg': 'linear-gradient(145deg, #ffffff, #f8fafc)'} as React.CSSProperties}>
                                <div className={styles.quickActionIcon} style={{ background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', color: '#475569', boxShadow: '0 4px 12px rgba(71,85,105,0.12)' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                </div>
                                Sistem
                            </Link>
                        </div>
                    </section>

                    {/* BENTO GRID LEFT: METRICS & RECENT ACTIVITY */}
                    <div className={employeeStyles.leftWrapper}>
                        
                        {/* METRICS ROW */}
                        <div className={employeeStyles.metricsRow}>
                            <div className={`${employeeStyles.bentoBox} ${employeeStyles.metricCard}`}>
                                <div className={`${employeeStyles.metricIconWrapper} ${employeeStyles.iconHadir}`} style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#1e40af' }}>
                                    <IconUsers />
                                </div>
                                <div className={employeeStyles.metricContent}>
                                    <div className={employeeStyles.metricValueRow}>
                                        <span className={employeeStyles.metricValue} style={{ color: '#1e40af' }}>{totalEmployees}</span>
                                        <span className={employeeStyles.metricUnit}>Staf</span>
                                    </div>
                                    <span className={employeeStyles.metricLabel}>Total Karyawan</span>
                                </div>
                            </div>

                            <div className={`${employeeStyles.bentoBox} ${employeeStyles.metricCard}`}>
                                <div className={`${employeeStyles.metricIconWrapper} ${employeeStyles.iconIzin}`} style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', color: '#166534' }}>
                                    <IconCheckIn />
                                </div>
                                <div className={employeeStyles.metricContent} style={{ flex: 1 }}>
                                    <div className={employeeStyles.metricValueRow}>
                                        <span className={employeeStyles.metricValue} style={{ color: '#16a34a' }}>{presentTodayCount}</span>
                                        <span className={employeeStyles.metricUnit}>({Math.round(attendanceRate)}%)</span>
                                    </div>
                                    <span className={employeeStyles.metricLabel}>Hadir Hari Ini</span>

                                </div>
                            </div>
                        </div>

                        {/* LIVE ACTIVITY FEED */}
                        <section className={`${employeeStyles.bentoBox} ${employeeStyles.announceBox}`}>
                            <div className={employeeStyles.boxHeader}>
                                <h2 className={employeeStyles.boxTitle}><IconClock /> Log Aktivitas Kehadiran</h2>
                                <Link href="/admin/absensi" className={employeeStyles.headerActionBtn} title="Lihat Semua Log">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {recentAttendance.map((att) => (
                                    <div key={att.id} className={styles.activityItem} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ 
                                            width: '42px', 
                                            height: '42px', 
                                            borderRadius: '12px', 
                                            background: att.status === 'HADIR' ? '#eefdf5' : '#fff7ed', 
                                            color: att.status === 'HADIR' ? '#059669' : '#ea580c', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            fontWeight: 900,
                                            fontSize: '1.1rem',
                                            border: '1px solid rgba(0,0,0,0.03)'
                                        }}>
                                            {att.user.nama.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.user.nama}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                {formatWIBTime(att.waktuMasuk)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className={att.status === 'HADIR' ? styles.badgeHadir : styles.badgeIzin} style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem' }}>
                                                {att.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {recentAttendance.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                        <IconActivity />
                                        <p style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '8px' }}>Belum ada log kehadiran hari ini.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* BENTO GRID RIGHT: FINANCE/WIDGETS */}
                    <aside className={employeeStyles.financeStack}>
                        {/* Audit Center Card */}
                        <div className={employeeStyles.financeCard} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                            {/* Background SVG Decor */}
                            <svg style={{ position: 'absolute', right: '-18px', bottom: '-18px', opacity: 0.045, pointerEvents: 'none', zIndex: 0 }} width="140" height="140" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {/* Content */}
                            <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0 }}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Audit Center</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Payroll Diproses</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, background: diprosesPayrolls.length > 0 ? '#eff6ff' : '#f8fafc', color: diprosesPayrolls.length > 0 ? '#3b82f6' : '#94a3b8', border: diprosesPayrolls.length > 0 ? '1px solid #bfdbfe' : '1px solid #e2e8f0', padding: '3px 10px', borderRadius: '20px' }}>
                                    {diprosesPayrolls.length} item
                                </span>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '14px' }} />

                            {/* List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {diprosesPayrolls.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#cbd5e1' }}>
                                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ margin: '0 auto 6px', display: 'block', color: '#e2e8f0' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>Tidak ada payroll diproses</p>
                                    </div>
                                ) : (
                                    diprosesPayrolls.map((p) => (
                                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '10px 12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#4f46e5', flexShrink: 0 }}>
                                                    {p.user.nama.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>{p.user.nama}</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>Periode {p.bulan}/{p.tahun}</div>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap' }}>
                                                Rp {p.totalGaji.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer Link */}
                            <Link 
                                href="/admin/payroll"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textDecoration: 'none', letterSpacing: '0.02em' }}
                            >
                                Lihat Semua Payroll
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </Link>
                            </div>
                        </div>

                        {/* Daftar Karyawan Card */}
                        <div className={employeeStyles.financeCard} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                            {/* Background SVG Decor */}
                            <svg style={{ position: 'absolute', right: '-18px', bottom: '-18px', opacity: 0.045, pointerEvents: 'none', zIndex: 0 }} width="140" height="140" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            {/* Content */}
                            <div style={{ position: 'relative', zIndex: 1 }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0 }}>
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Personil</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Daftar Karyawan</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', padding: '3px 10px', borderRadius: '20px' }}>
                                    {totalEmployees} orang
                                </span>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '14px' }} />

                            {/* List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {recentEmployees.map((emp, i) => {
                                    const colors = ['#eff6ff','#f0fdf4','#faf5ff','#fff7ed','#fef2f2']
                                    const textColors = ['#3b82f6','#22c55e','#a855f7','#f97316','#ef4444']
                                    return (
                                        <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '10px 12px' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: textColors[i % textColors.length], flexShrink: 0 }}>
                                                {emp.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.nama}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, marginTop: '1px' }}>{emp.jabatan ?? 'Tidak ada jabatan'}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Footer */}
                            <Link
                                href="/admin/karyawan"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textDecoration: 'none', letterSpacing: '0.02em' }}
                            >
                                Lihat Semua Karyawan
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </Link>
                            </div>
                        </div>

                        {/* Upcoming Holidays Card */}
                        <div className={employeeStyles.financeCard}>
                            <div className={employeeStyles.boxHeader}>
                                <h2 className={employeeStyles.boxTitle}><IconCalendar /> Libur Mendatang</h2>
                            </div>
                            {upcomingHolidays.length > 0 ? (
                                <div className={employeeStyles.holidayList}>
                                    {upcomingHolidays.map(h => (
                                        <div key={h.id} className={employeeStyles.holidayItem}>
                                            <div className={employeeStyles.holidayDateBlock}>
                                                <span className={employeeStyles.holidayMonth}>{formatIndonesianDate(h.tanggal, false).split(' ')[1].slice(0, 3).toUpperCase()}</span>
                                                <span className={employeeStyles.holidayDay}>{formatIndonesianDate(h.tanggal, false).split(' ')[0]}</span>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.3', textTransform: 'uppercase' }}>{h.keterangan}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                                                    Hari {new Intl.DateTimeFormat("id-ID", { weekday: 'long', timeZone: 'Asia/Jakarta' }).format(h.tanggal)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: '0.9rem' }}>
                                    Tidak ada libur dalam waktu dekat.
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
        </div>
    )
}
