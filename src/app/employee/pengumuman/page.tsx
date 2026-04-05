import prisma from "@/lib/prisma"
import { getJakartaDate } from "@/lib/date"
import styles from "@/styles/employee_home.module.css"
import AnnouncementGridClient from "./AnnouncementGridClient"

const IconAnnounce = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
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

  return (
    <div className={styles.pageContainer} style={{ background: '#f8fafc', minHeight: '100vh', gap: 0, padding: 0, maxWidth: '100%', margin: 0 }}>
      
      {/* Professional Responsive Header - Aligned Left with Sidebar Icons */}
      <div className={styles.pengumumanHeader} style={{ paddingLeft: '32px', paddingRight: '32px' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ color: 'white', background: '#1e40af', padding: '12px', borderRadius: '16px', display: 'flex', boxShadow: '0 10px 15px -3px rgba(30, 64, 175, 0.2)' }}>
                    <IconAnnounce />
                </div>
                <div style={{ background: '#eff6ff', color: '#1e40af', fontSize: '0.7rem', fontWeight: 900, padding: '6px 14px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Corporate Broadcast
                </div>
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.04em' }}>Pusat Pengumuman</h1>
            <p style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 500, margin: 0, maxWidth: '800px', lineHeight: '1.6' }}>
                Akses semua informasi resmi, pengumuman kebijakan, dan berita terbaru dari RMP Digitals dalam satu wadah terpadu.
            </p>
          </div>
      </div>

      <div style={{ padding: 'clamp(20px, 5vw, 44px) 32px' }}>
        <div style={{ width: '100%' }}>
            <AnnouncementGridClient announcements={serializedAnnouncements as any} />
        </div>
      </div>

    </div>
  )
}
