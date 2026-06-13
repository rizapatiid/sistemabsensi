import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import AnnouncementList from "@/components/AnnouncementList"
import styles from "@/styles/employee_home.module.css"
import Link from "next/link"
import AnnouncementClient from "./AnnouncementClient"
import { getTodayJakarta, formatWIBTime, getJakartaDate, formatIndonesianDate } from "@/lib/date"

// Institutional Icons
const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const IconMoney = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>
)
const IconMegaphone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
)
const IconCalendar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
)
const IconBank = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
  const tidakHadirCount = monthlyAttendances.filter(a => a.status !== "HADIR").length

  const quoteIndex = today.getDate() - 1
  const dailyQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0]

  return (
    <div className={styles.pageContainer}>
        <div className={styles.bentoGrid}>
            
            {/* 1. PROFILE BOX */}
            <section className={`${styles.bentoBox} ${styles.profileBox}`}>
                {/* Background Decor (Hand Icon) */}
                <svg className={styles.profileBgIcon} width="200" height="200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 11V6a2 2 0 0 0-4 0v-2a2 2 0 0 0-4 0v-1a2 2 0 0 0-4 0v8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 16.5c-1.5 1-3 1.5-5 1.5a9 9 0 0 1-6-7.5l-2-2.5a1.5 1.5 0 0 1 2.5-1.5l3 3.5V6" />
                </svg>
                <div className={styles.profileContent}>
                    <p className={styles.greeting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        SELAMAT DATANG,
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#fde047' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 11V6a2 2 0 0 0-4 0v-2a2 2 0 0 0-4 0v-1a2 2 0 0 0-4 0v8" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 16.5c-1.5 1-3 1.5-5 1.5a9 9 0 0 1-6-7.5l-2-2.5a1.5 1.5 0 0 1 2.5-1.5l3 3.5V6" />
                        </svg>
                    </p>
                    <h1 className={styles.userName}>{user?.nama}</h1>
                    <p className={styles.quote}>"{dailyQuote}"</p>
                </div>
            </section>

            {/* 2. TODAY STATUS BOX */}
            <section className={`${styles.bentoBox} ${styles.todayStatusBox}`}>
                {/* Background Decor (Clock Icon) */}
                <svg className={styles.statusBgIcon} width="160" height="160" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#64748b' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className={styles.todayTitle} style={{ margin: 0 }}>Status Presensi Hari Ini</h2>
                </div>
                {hasAbsenToday ? (
                    <div className={hasAbsenToday.status === "HADIR" ? styles.statusHadirBox : styles.statusAbsenBox}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                            {hasAbsenToday.status === "HADIR" ? (
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            )}
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{hasAbsenToday.status === "HADIR" ? "TERVERIFIKASI" : "IZIN TERCATAT"}</div>
                        </div>
                        <div className={styles.todayTime}>{hasAbsenToday.status === "HADIR" ? formatWIBTime(hasAbsenToday.waktuMasuk) : "IZIN"}</div>
                    </div>
                ) : isWeekend || isHoliday ? (
                    <div className={styles.statusLiburBox}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px', color: '#2563eb' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>LIBUR OPERASIONAL</div>
                        </div>
                        <div className={styles.todayTime} style={{ fontSize: '1.2rem', marginTop: '12px', color: '#1e3a8a' }}>{isHoliday?.keterangan || "Akhir Pekan"}</div>
                    </div>
                ) : (
                    <>
                        <Link href="/employee/absensi" className={styles.statusAbsenBox}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>BELUM PRESENSI</div>
                            </div>
                            <div className={styles.todayTime} style={{ fontSize: '1.4rem' }}>Lapor Sekarang</div>
                        </Link>
                    </>
                )}
            </section>

            {/* LEFT MIDDLE WRAPPER (Prevents metrics from stretching) */}
            <div className={styles.leftWrapper}>
                
                {/* 3. METRICS OVERVIEW */}
                <div className={styles.metricsRow}>
                    <div className={`${styles.bentoBox} ${styles.metricCard}`}>
                        <div className={`${styles.metricIconWrapper} ${styles.iconHadir}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                               <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                               <circle cx="8.5" cy="7" r="4" />
                               <polyline points="17 11 19 13 23 9" />
                            </svg>
                        </div>
                        <div className={styles.metricContent}>
                            <div className={styles.metricValueRow}>
                                <span className={styles.metricValue} style={{ color: '#16a34a' }}>{hadirCount}</span>
                                <span className={styles.metricUnit}>Hari</span>
                            </div>
                            <span className={styles.metricLabel}>Total Hadir</span>
                        </div>
                    </div>

                    <div className={`${styles.bentoBox} ${styles.metricCard}`}>
                        <div className={`${styles.metricIconWrapper} ${styles.iconIzin}`}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                               <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                               <circle cx="8.5" cy="7" r="4" />
                               <line x1="18" y1="8" x2="23" y2="13" />
                               <line x1="23" y1="8" x2="18" y2="13" />
                            </svg>
                        </div>
                        <div className={styles.metricContent}>
                            <div className={styles.metricValueRow}>
                                <span className={styles.metricValue} style={{ color: '#dc2626' }}>{tidakHadirCount}</span>
                                <span className={styles.metricUnit}>Hari</span>
                            </div>
                            <span className={styles.metricLabel}>Izin / Tidak Hadir</span>
                        </div>
                    </div>
                </div>

                {/* 5. ANNOUNCEMENTS */}
                <section className={`${styles.bentoBox} ${styles.announceBox}`}>
                    <div className={styles.boxHeader}>
                        <h2 className={styles.boxTitle}><IconMegaphone /> Pengumuman Terbaru</h2>
                        <Link href="/employee/pengumuman" className={styles.headerActionBtn} title="Lihat Semua Pengumuman">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    {announcements.length > 0 ? (
                      <AnnouncementList announcements={announcements} />
                    ) : (
                      <div className={styles.emptyState}>
                        <IconMegaphone />
                        <p>Belum ada pengumuman.</p>
                      </div>
                    )}
                </section>
            </div>

            {/* 4. FINANCE/PAYROLL/BANK WIDGETS */}
            <aside className={`${styles.financeStack}`}>
                {/* Bank Card */}
                <div className={`${styles.financeCard} ${styles.bank}`}>
                    <svg className={styles.bankBgIcon} width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ opacity: 0.8 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className={styles.bankLabel} style={{ margin: 0 }}>Rekening Terdaftar</span>
                        <Link 
                            href="/employee/transaksi?openValidasi=true"
                            style={{ 
                                marginLeft: 'auto', 
                                background: 'rgba(255,255,255,0.2)', 
                                border: 'none', 
                                color: 'white', 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none'
                            }}
                        >
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            PERBARUI
                        </Link>
                    </div>
                    <span className={styles.bankName}>{user?.rekeningBank || "Belum Diatur"}</span>
                    <span className={styles.accNumber}>{user?.noRekening ? user.noRekening.replace(/(\d{4})/g, '$1 ') : "----"}</span>
                    {user?.namaRekening && <span style={{ fontSize: '0.8rem', marginTop: '0px', opacity: 0.9, position: 'relative', zIndex: 1 }}>a.n. {user.namaRekening}</span>}
                </div>

                {/* Payroll Card */}
                <div className={`${styles.financeCard} ${styles.payroll}`}>
                    <svg className={styles.payrollBgIcon} width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#64748b' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={styles.payrollLabel} style={{ margin: 0 }}>Gaji Terakhir (Rp)</span>
                        <div className={styles.payrollStatus} style={{ marginLeft: 'auto' }}>
                            <div className={styles.statusDot} style={{ background: lastPayroll?.statusPembayaran === "DIBAYAR" ? '#10b981' : '#f59e0b' }}></div>
                            {lastPayroll?.statusPembayaran === "DIBAYAR" ? "Telah Dibayar" : "Diproses"}
                        </div>
                    </div>
                    <span className={styles.payrollAmount} style={{ position: 'relative', zIndex: 1 }}>
                        Rp {(lastPayroll?.totalGaji || 0).toLocaleString('id-ID')}
                    </span>
                    <Link href="/employee/transaksi" className={styles.slipLink} style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>Lihat Semua Slip Gaji &rarr;</Link>
                </div>

                {/* Upcoming Holidays Card */}
                <div className={styles.financeCard}>
                    <div className={styles.boxHeader}>
                        <h2 className={styles.boxTitle}><IconCalendar /> Libur Mendatang</h2>
                    </div>
                    {upcomingHolidays.length > 0 ? (
                        <div className={styles.holidayList}>
                            {upcomingHolidays.map(h => (
                                <div key={h.id} className={styles.holidayItem}>
                                    <div className={styles.holidayDateBlock}>
                                        <span className={styles.holidayMonth}>{formatIndonesianDate(h.tanggal, false).split(' ')[1].slice(0, 3).toUpperCase()}</span>
                                        <span className={styles.holidayDay}>{formatIndonesianDate(h.tanggal, false).split(' ')[0]}</span>
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
