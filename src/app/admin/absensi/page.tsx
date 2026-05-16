import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import AbsensiAdminClient from "./AbsensiAdminClient"

export default async function AdminAbsensiPage() {
  const employees = await prisma.user.findMany({
    where: { role: "KARYAWAN" },
    select: { id: true, nama: true },
    orderBy: { nama: "asc" }
  })

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const startOfMonth = new Date(currentYear, currentMonth, 1)
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

  const absensi = await prisma.attendance.findMany({
    where: {
      tanggal: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    },
    include: {
      user: true
    },
    orderBy: {
      tanggal: "desc"
    }
  })

  const countHadir = absensi.filter(a => a.status === 'HADIR').length
  const countIzin = absensi.filter(a => a.status === 'IZIN').length

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  const currentMonthName = monthNames[currentMonth]

  return (
    <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
      
      {/* 1. STATUS LINE - PROFESSIONAL */}
      <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
          <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '12px'
          }}>
              <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Rekapitulasi {currentMonthName} {currentYear} • Real-time Sync
              </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
            <div>
                <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Monitor Absensi
                </h1>
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Ringkasan kehadiran personil untuk periode {currentMonthName} {currentYear}.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{countHadir}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Hadir</div>
                    </div>
                </div>
                
                <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{countIzin}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Izin</div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
          <div className={styles.card} style={{ borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
            <AbsensiAdminClient absensi={absensi} initialEmployees={employees} />
          </div>
      </div>
    </div>
  )
}
