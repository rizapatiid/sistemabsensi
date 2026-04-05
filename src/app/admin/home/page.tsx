import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import { getSession } from "@/actions/auth"
import Link from "next/link"
import { getTodayJakarta, formatWIBTime, getJakartaDate } from "@/lib/date"

// World-Class Command Icons
const IconUsers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
const IconCheckIn = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
const IconMoney = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
const IconBell = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
const IconTrendingUp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
const IconCalendar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
const IconActivity = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>

export default async function AdminHomePage() {
    const session = await getSession()
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

    return (
        <div className={styles.pageContainer} style={{ background: '#f0f2f5', padding: '0px', minHeight: '100vh', gap: 0 }}>

            {/* 1. MASTER TOP BAR - PRESTIGIOUS & COMPACT */}
            <div className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: '#1e3a8a', color: 'white', padding: '8px', borderRadius: '10px', display: 'flex' }}><IconActivity /></div>
                    <div style={{ textAlign: 'left' }}>
                        <h4 style={{ color: 'white', margin: 0, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.05em' }}>RMP COMMAND CENTER</h4>
                        <div style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800 }}>Server ID: {user?.id}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 900 }}>ONLINE</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700 }}>{formatWIBTime(getJakartaDate())}</span>
                    </div>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><IconBell /></div>
                </div>
            </div>

            <div style={{ padding: '24px' }}>

                {/* 2. DYNAMIC HEADER & SEARCH - FLUID GRID */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 className={styles.pageTitle} style={{ margin: 0 }}>Dashboard Administrator</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, marginTop: '4px', fontSize: '0.9rem' }}>Selamat bekerja kembali, sistem berjalan optimal.</p>
                    </div>
                    <div className={styles.searchContainer}>
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><IconSearch /></div>
                        <input type="text" placeholder="Cari personil atau riwayat..." style={{ width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 16px 14px 48px', fontSize: '0.85rem', fontWeight: 700, outline: 'none' }} />
                    </div>
                </div>

                {/* 3. ANALYTICS SUMMARY - FLEXIBLE CARDS */}
                <div className={styles.summarySection}>
                    <div className={styles.card} style={{ padding: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '12px', borderRadius: '14px' }}><IconUsers /></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>TOTAL</span>
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{totalEmployees}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Staf Terdaftar</div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '100px', marginTop: '16px' }}>
                            <div style={{ width: '100%', height: '100%', background: '#1e3a8a' }}></div>
                        </div>
                    </div>

                    <div className={styles.card} style={{ padding: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ background: '#ecfdf5', color: '#059669', padding: '12px', borderRadius: '14px' }}><IconCheckIn /></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#059669', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>{Math.round(attendanceRate)}% RATE</span>
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{presentTodayCount}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Hadir Hari Ini</div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '100px', marginTop: '16px', overflow: 'hidden' }}>
                            <div style={{ width: `${attendanceRate}%`, height: '100%', background: '#059669' }}></div>
                        </div>
                    </div>

                    <div className={styles.card} style={{ padding: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ background: '#fff7ed', color: '#ea580c', padding: '12px', borderRadius: '14px' }}><IconMoney /></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 850, color: '#ea580c', background: '#ffedd5', padding: '4px 8px', borderRadius: '6px' }}>PENDING</span>
                        </div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ea580c' }}>{pendingPayrollCount}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Proses Payroll</div>
                        <div style={{ marginTop: '16px', fontSize: '0.75rem', fontWeight: 800, color: '#9a3412' }}>Audit harian berlanjut.</div>
                    </div>
                </div>

                {/* 4. MAIN INTERACTIVE MONITORING GRID */}
                <div className={styles.dashboardGrid}>

                    {/* COLUMN 1: LIVE ACTIVITY FEED */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Monitoring Real-Time</h3>
                            <Link href="/admin/absensi" style={{ fontSize: '0.75rem', fontWeight: 850, color: '#1e3a8a', textDecoration: 'none' }}>RIWAYAT</Link>
                        </div>
                        <div className={styles.card} style={{ padding: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            {recentAttendance.map((att, idx) => (
                                <div key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '20px', background: idx % 2 === 0 ? '#f8fafc' : 'transparent' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: att.status === 'HADIR' ? '#dcfce7' : '#fef3c7', color: att.status === 'HADIR' ? '#166534' : '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                        {att.user.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e293b' }}>{att.user.nama}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{att.waktuMasuk ? formatWIBTime(att.waktuMasuk) : '-'}</div>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 850, color: att.status === 'HADIR' ? '#10b981' : '#f59e0b' }}>{att.status}</span>
                                </div>
                            ))}
                            {recentAttendance.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 700 }}>No entry today.</p>}
                        </div>
                    </div>

                    {/* COLUMN 2: RAPID ACTION MATRIX */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>Akses Operasional</h3>
                        <div className={styles.quickNavGrid}>
                            <Link href="/admin/karyawan" style={{ textDecoration: 'none' }}>
                                <div className={styles.card} style={{ height: '100%', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
                                    <div style={{ background: '#eff6ff', color: '#1e3a8a', padding: '12px', borderRadius: '12px' }}><IconUsers /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e293b' }}>Personil</span>
                                </div>
                            </Link>
                            <Link href="/admin/kalender" style={{ textDecoration: 'none' }}>
                                <div className={styles.card} style={{ height: '100%', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
                                    <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '12px' }}><IconCalendar /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e293b' }}>Libur</span>
                                </div>
                            </Link>
                            <Link href="/admin/payroll" style={{ textDecoration: 'none' }}>
                                <div className={styles.card} style={{ height: '100%', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
                                    <div style={{ background: '#fff7ed', color: '#ea580c', padding: '12px', borderRadius: '12px' }}><IconMoney /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e293b' }}>Payroll</span>
                                </div>
                            </Link>
                            <Link href="/admin/kelola-admin" style={{ textDecoration: 'none' }}>
                                <div className={styles.card} style={{ height: '100%', padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
                                    <div style={{ background: '#f8fafc', color: '#64748b', padding: '12px', borderRadius: '12px' }}><IconActivity /></div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1e293b' }}>Otoritas</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* COLUMN 3: SYSTEM AUDIT & BROADCAST */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>Pusat Informasi</h3>
                        <div style={{ background: '#fffbeb', border: '1px dashed #f59e0b', borderRadius: '28px', padding: '28px', color: '#92400e' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <IconBell /> <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>Audit Berkala</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: '1.6', margin: 0 }}>
                                {pendingPayrollCount} transaksi penggajian menunggu eksekusi CMS. Pastikan verifikasi silang data personil dan nomor rekening sebelum finalisasi.
                            </p>
                            <Link href="/admin/kalender/tambah-pengumuman" style={{ display: 'inline-block', width: '100%', marginTop: '24px', background: '#92400e', color: 'white', padding: '12px', borderRadius: '14px', textAlign: 'center', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 900 }}>
                                KIRIM BROADCAST
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}
