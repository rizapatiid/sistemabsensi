import prisma from "@/lib/prisma"
import { getJakartaDate } from "@/lib/date"
import styles from "@/styles/transaksi_karyawan.module.css"
import AnnouncementGridClient from "./AnnouncementGridClient"

const IconAnnounce = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
)
const IconMegaphone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
)
const IconExternal = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
)

export default async function EmployeePengumumanPage() {
  const now = getJakartaDate()

  const announcements = await prisma.announcement.findMany({ 
    where: { OR: [{ scheduleDate: null }, { scheduleDate: { lte: now } }] },
    orderBy: { tanggal: "desc" }
  })

  // Transform for client
  const serializedAnnouncements = announcements.map(a => ({
    ...a,
    tanggal: a.tanggal.toISOString()
  }))

  const countOfficial = announcements.length

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '12px' }}>
      
      {/* Premium Hero Header (Like Transaksi/Absensi) */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        padding: 'clamp(20px, 5vw, 32px)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
      }}>
        {/* Geometric Accents */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 'clamp(12px, 3vw, 20px)', alignItems: 'center' }}>
          <div style={{ 
            width: 'clamp(56px, 12vw, 64px)', height: 'clamp(56px, 12vw, 64px)', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: 'clamp(14px, 3vw, 20px)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60a5fa' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.75rem)', fontWeight: 900, margin: '0 0 clamp(4px, 1vw, 6px) 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Pusat Pengumuman</h1>
            <p style={{ margin: 0, color: '#93c5fd', fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)', fontWeight: 500, lineHeight: 1.4 }}>Akses informasi resmi dan kebijakan perusahaan terbaru.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '8px' }}>
          <AnnouncementGridClient announcements={serializedAnnouncements as any} />
      </div>

    </div>
  )
}
