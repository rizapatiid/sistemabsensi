import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import { getSession } from "@/actions/auth"
import Link from "next/link"
import { getTodayJakarta, formatWIBTime, getJakartaDate } from "@/lib/date"
import { getSystemSettings } from "@/lib/settings"
import MaintenanceToggle from "@/components/MaintenanceToggle"

// World-Class Command Icons
const IconUsers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
const IconCheckIn = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
const IconMoney = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
const IconBell = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
const IconTrendingUp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
const IconCalendar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
const IconActivity = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>

export default async function AdminHomePage() {
    const session = await getSession()
    const user = await prisma.user.findUnique({ where: { id: session.id } })

    const totalEmployees = await prisma.user.count({ where: { role: "KARYAWAN" } })
    const today = getTodayJakarta()
    const todayJakarta = getJakartaDate()

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

    // Fetch System Settings
    const settings = await getSystemSettings()

    // Check Holiday
    const holiday = await prisma.calendar.findFirst({
        where: {
            tanggal: {
                gte: today,
                lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            isHoliday: true
        }
    })

    const isWeekend = todayJakarta.getDay() === 0 || todayJakarta.getDay() === 6;
    const weekendName = todayJakarta.getDay() === 0 ? 'Minggu' : 'Sabtu';

    return (
        <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh', gap: 0 }}>

            {/* 1. STATUS BAR - PROFESSIONAL & SUBTLE */}
            <div className={styles.topBar} style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
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

            <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>

                {/* 2. HEADER SECTION - SIMPLE & CLEAN */}
                <div style={{ marginBottom: 'clamp(20px, 4vw, 32px)' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        marginBottom: '12px'
                    }}>
                        <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Sistem Optimal</span>
                    </div>

                    <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a' }}>
                        Dashboard Overview
                    </h1>
                    
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                        Selamat bekerja kembali, <span style={{ color: '#1e3a8a', fontWeight: 800 }}>{user?.nama}</span>
                    </p>
                </div>

                {/* 3. QUICK ACTIONS BAR - ALL ACCESS CODES AT THE TOP */}
                <div style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ height: '2px', width: '20px', background: '#1e3a8a', borderRadius: '2px' }}></span>
                        <h3 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Akses Operasional</h3>
                    </div>
                    <div className={styles.quickActionsBar}>
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

                    {/* HOLIDAY / WEEKEND NOTICE */}
                    {(holiday || isWeekend) && (
                        <div style={{ 
                            marginTop: '16px', 
                            padding: '14px 20px', 
                            background: '#fff1f2', 
                            border: '1px solid #fecdd3', 
                            borderRadius: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            animation: 'fadeIn 0.5s ease'
                        }}>
                            <div style={{ color: '#e11d48' }}><IconCalendar /></div>
                            <div>
                                <span style={{ color: '#e11d48', fontWeight: 800, fontSize: '0.85rem' }}>PEMBERITAHUAN LIBUR: </span>
                                <span style={{ color: '#9f1239', fontWeight: 600, fontSize: '0.85rem' }}>
                                    Hari ini adalah {isWeekend && !holiday ? `hari libur pekan (${weekendName})` : holiday?.keterangan}. Periksa jadwal operasional staf.
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. ANALYTICS SUMMARY */}
                <div className={styles.summarySection} style={{ marginBottom: 'clamp(24px, 5vw, 40px)' }}>
                    <div className={styles.card} style={{ padding: '24px', border: 'none', background: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ background: '#eff6ff', color: '#1e3a8a', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconUsers /></div>
                            <div className={styles.badge} style={{ color: '#1d4ed8', background: '#dbeafe' }}>TOTAL STAFF</div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a', lineHeight: '1', letterSpacing: '-0.02em' }}>{totalEmployees}</div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <span style={{ width: '6px', height: '6px', background: '#1d4ed8', borderRadius: '50%' }}></span> Personil Terdaftar
                        </p>
                    </div>

                    <div className={styles.card} style={{ padding: '24px', border: 'none', background: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ background: '#ecfdf5', color: '#059669', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconCheckIn /></div>
                            <div className={styles.badge} style={{ color: '#047857', background: '#d1fae5' }}>ATTENDANCE</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a', lineHeight: '1', letterSpacing: '-0.02em' }}>{presentTodayCount}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981', paddingBottom: '2px' }}>{Math.round(attendanceRate)}%</div>
                        </div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></span> Hadir Hari Ini
                        </p>
                    </div>

                    <div className={styles.card} style={{ padding: '24px', border: 'none', background: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ background: '#fff7ed', color: '#ea580c', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconMoney /></div>
                            <div className={styles.badge} style={{ color: '#b45309', background: '#ffedd5' }}>PAYROLL</div>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#ea580c', lineHeight: '1', letterSpacing: '-0.02em' }}>{pendingPayrollCount}</div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '6px', height: '6px', background: '#ea580c', borderRadius: '50%' }}></span> Transaksi Pending
                        </p>
                    </div>
                </div>

                {/* 5. MAIN CONTENT GRID */}
                <div className={styles.dashboardGrid}>

                    {/* LIVE ACTIVITY FEED */}
                    <div className={styles.card} style={{ border: 'none', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)' }}>
                        <div style={{ padding: 'clamp(20px, 4vw, 24px) clamp(20px, 4vw, 32px)', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ minWidth: 0 }}>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 950, color: '#0f172a', margin: 0, whiteSpace: 'nowrap' }}>Log Aktivitas</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                                    <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, margin: 0, whiteSpace: 'nowrap' }}>Real-time Monitoring</p>
                                </div>
                            </div>
                            <Link href="/admin/absensi" className={styles.btnSm} style={{ padding: '6px 12px', borderRadius: '10px', flexShrink: 0 }}>LIHAT SEMUA</Link>
                        </div>
                        <div style={{ padding: '8px' }}>
                            {recentAttendance.map((att, idx) => (
                                <div key={att.id} className={styles.activityItem} style={{ marginBottom: '4px', padding: '12px 16px' }}>
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
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={att.status === 'HADIR' ? styles.badgeHadir : styles.badgeIzin} style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '0.65rem' }}>
                                            {att.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentAttendance.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div className={styles.emptyStateIcon}><IconActivity /></div>
                                    <p style={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>Sistem siap menerima log.</p>
                                    <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.75rem', marginTop: '4px' }}>Belum ada aktivitas kehadiran hari ini.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SYSTEM AUDIT & INFORMATION */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        
                        {/* NOTICE PANEL */}
                        <div style={{ background: '#0f172a', borderRadius: '32px', padding: '36px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2)' }}>
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '140px', height: '140px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)', borderRadius: '50%' }}></div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '12px' }}><IconBell /></div>
                                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.02em' }}>Audit Center</h4>
                            </div>
                            <p style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 500, lineHeight: '1.7', marginBottom: '32px' }}>
                                <span style={{ color: 'white', fontWeight: 800 }}>Update:</span> {pendingPayrollCount} antrean penggajian menunggu eksekusi verifikasi admin.
                            </p>
                            <Link href="/admin/payroll" className={styles.verifyBtn} style={{ background: 'white', color: '#0f172a', border: 'none' }}>
                                VERIFIKASI SEKARANG
                            </Link>
                        </div>

                        {/* BROADCAST HUB */}
                        <div className={styles.card} style={{ padding: '32px', border: '2px dashed #e2e8f0', background: '#ffffff', textAlign: 'center', borderRadius: '32px' }}>
                            <div style={{ background: '#f8fafc', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#64748b' }}>
                                <IconTrendingUp />
                            </div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 950, color: '#1e293b', marginBottom: '8px' }}>Broadcast Hub</h4>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '28px', lineHeight: '1.5' }}>Push informasi penting ke seluruh dashboard staf secara instan.</p>
                            <Link href="/admin/kalender/tambah-pengumuman" style={{ color: '#1e3a8a', fontWeight: 900, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#eff6ff', borderRadius: '14px' }}>
                                BUAT PENGUMUMAN
                            </Link>
                        </div>

                    </div>

                </div>


            </div>

        </div>
    )
}
