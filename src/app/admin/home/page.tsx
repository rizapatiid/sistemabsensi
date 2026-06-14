import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import employeeStyles from "@/styles/employee_home.module.css"
import { getSession } from "@/actions/auth"
import Link from "next/link"
import { getTodayJakarta, formatWIBTime, getJakartaDate, formatIndonesianDate } from "@/lib/date"

// World-Class Command Icons
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)
const IconCheckIn = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
)
const IconMoney = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
)
const IconBell = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
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

    const pendingPayrollCount = await prisma.payroll.count({
        where: { statusPembayaran: "BELUM_LUNAS" }
    })

    const recentAttendance = await prisma.attendance.findMany({
        where: { tanggal: { gte: today } },
        include: { user: true },
        orderBy: { waktuMasuk: "desc" },
        take: 5
    })

    const attendanceRate = totalEmployees > 0 ? (presentTodayCount / totalEmployees) * 100 : 0



    const upcomingHolidays = await prisma.calendar.findMany({
        where: { tanggal: { gte: today } },
        orderBy: { tanggal: "asc" },
        take: 4
    })

    const quoteIndex = today.getDate() - 1
    const dailyQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0]

    return (
        <div className={employeeStyles.pageContainer} style={{ padding: '0px 0px 24px 0px', maxWidth: 'none' }}>
            {/* 1. TOP BAR */}
            <div className={styles.topBar} style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '10px', borderRadius: '12px', display: 'flex' }}><IconActivity /></div>
                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                        <h4 style={{ color: '#0f172a', margin: 0, fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>RMP COMMAND CENTER</h4>
                        <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            V 4.2.0 • {user?.nama.split(' ')[0]}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end' }}>
                            <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                            <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 900 }}>ACTIVE</span>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 800 }}>{formatWIBTime(getJakartaDate())}</span>
                    </div>
                    <div style={{ width: '38px', height: '38px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                        <IconBell />
                        <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '10px', height: '10px', background: '#ef4444', border: '2px solid white', borderRadius: '50%' }}></div>
                    </div>
                </div>
            </div>

            {/* 2. HEADER */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        marginBottom: '12px'
                    }}>
                        <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Sistem Optimal</span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.04em' }}>
                        Dashboard Overview
                    </h1>
                    
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                        Selamat bekerja kembali, <span style={{ color: '#1e3a8a', fontWeight: 800 }}>{user?.nama}</span>
                    </p>
                </div>

                {/* 4. THE BENTO GRID */}
                <div className={employeeStyles.bentoGrid}>
                    
                    {/* BENTO BOX 1: PROFILE */}
                    <section className={`${employeeStyles.bentoBox} ${employeeStyles.profileBox}`}>
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
                    <section className={`${employeeStyles.bentoBox} ${employeeStyles.todayStatusBox}`}>
                        {/* Background Decor (Clock Icon) */}
                        <svg className={employeeStyles.statusBgIcon} width="160" height="160" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#64748b' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h2 className={employeeStyles.todayTitle} style={{ margin: 0 }}>Status Sistem</h2>
                        </div>
                        <div className={employeeStyles.statusHadirBox} style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>RMP COMMAND CENTER</div>
                            </div>
                            <div className={employeeStyles.todayTime} style={{ fontSize: '1.4rem' }}>AKTIF & AMAN</div>
                        </div>
                    </section>

                    {/* BENTO BOX 2.5: OPERATIONAL ACCESS BAR */}
                    <section className={employeeStyles.quickActionsSection}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ height: '2px', width: '20px', background: '#1e3a8a', borderRadius: '2px' }}></span>
                            <h3 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Akses Operasional</h3>
                        </div>
                        <div className={styles.quickActionsBar} style={{ paddingBottom: '4px', marginBottom: 0 }}>
                            <Link href="/admin/karyawan" className={styles.quickActionBtn}>
                                <div className={styles.quickActionIcon} style={{ background: '#eff6ff', color: '#2563eb' }}><IconUsers /></div>
                                Personil
                            </Link>
                            <Link href="/admin/absensi" className={styles.quickActionBtn}>
                                <div className={styles.quickActionIcon} style={{ background: '#ecfdf5', color: '#059669' }}><IconCheckIn /></div>
                                Absensi
                            </Link>
                            <Link href="/admin/payroll" className={styles.quickActionBtn}>
                                <div className={styles.quickActionIcon} style={{ background: '#fff7ed', color: '#ea580c' }}><IconMoney /></div>
                                Payroll
                            </Link>
                            <Link href="/admin/kalender" className={styles.quickActionBtn}>
                                <div className={styles.quickActionIcon} style={{ background: '#fef2f2', color: '#ef4444' }}><IconCalendar /></div>
                                Kalender
                            </Link>
                            <Link href="/admin/pengaturan" className={styles.quickActionBtn}>
                                <div className={styles.quickActionIcon} style={{ background: '#f8fafc', color: '#1e293b' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
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
                                <div className={employeeStyles.metricContent}>
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
                        <div className={`${employeeStyles.financeCard} ${employeeStyles.bank}`} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                            <svg className={employeeStyles.bankBgIcon} width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ opacity: 0.8 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className={employeeStyles.bankLabel} style={{ margin: 0 }}>Audit Center</span>
                            </div>
                            <span className={employeeStyles.bankName} style={{ fontSize: '1.25rem' }}>Verifikasi Penggajian</span>
                            <span className={employeeStyles.accNumber} style={{ fontSize: '1.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 800, marginTop: '8px' }}>
                                {pendingPayrollCount} Pending
                            </span>
                            <Link 
                                href="/admin/payroll" 
                                style={{ 
                                    background: 'white', 
                                    color: '#4f46e5', 
                                    border: 'none', 
                                    padding: '12px 18px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 800, 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    textDecoration: 'none',
                                    marginTop: '20px',
                                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                VERIFIKASI SEKARANG &rarr;
                            </Link>
                        </div>

                        {/* Broadcast Hub Card */}
                        <div className={`${employeeStyles.financeCard} ${employeeStyles.payroll}`} style={{ border: '1px solid #e2e8f0' }}>
                            <svg className={employeeStyles.payrollBgIcon} width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#64748b' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className={employeeStyles.payrollLabel} style={{ margin: 0 }}>Broadcast Hub</span>
                            </div>
                            <span className={employeeStyles.payrollAmount} style={{ fontSize: '1.25rem', margin: '4px 0 8px 0', position: 'relative', zIndex: 1 }}>
                                Pesan Broadcast
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, lineHeight: '1.4', position: 'relative', zIndex: 1 }}>
                                Push informasi penting ke seluruh dashboard karyawan.
                            </span>
                            <Link 
                                href="/admin/kalender/tambah-pengumuman" 
                                style={{ 
                                    background: '#eff6ff', 
                                    color: '#1e3a8a', 
                                    border: '1px solid #dbeafe', 
                                    padding: '12px 18px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 800, 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    textDecoration: 'none',
                                    marginTop: '20px',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                BUAT PENGUMUMAN &rarr;
                            </Link>
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
