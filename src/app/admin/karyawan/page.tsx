import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import KaryawanTableClient from "./KaryawanTableClient"

const IconPlus = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
)

const IconUserCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
)

const IconUserX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
)

export default async function AdminKaryawanPage() {
  // Gunakan queryRaw karena prisma generate gagal akibat file lock di Windows (EPERM)
  const karyawan = await prisma.$queryRaw<any[]>`
    SELECT * FROM \`User\` WHERE role = 'KARYAWAN' ORDER BY \`createdAt\` DESC
  `

  const countTotal = karyawan.length
  const countAktif = karyawan.filter(k => k.status === 'AKTIF').length
  const countBlokir = karyawan.filter(k => k.status !== 'AKTIF').length

  // Format data untuk client component
  const formattedKaryawan = karyawan.map(k => ({
    id: k.id,
    nama: k.nama,
    jabatan: k.jabatan,
    phone: k.phone,
    email: k.email,
    alamat: k.alamat,
    rekeningBank: k.rekeningBank,
    noRekening: k.noRekening,
    namaRekening: k.namaRekening,
    status: k.status,
    absensiEnabled: k.absensiEnabled ?? true
  }))

  return (
    <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
      
      <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Database Karyawan • Real-time Sync</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
            <div>
                <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Kelola Karyawan
                </h1>
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Manajemen data personil dan kontrol akses staf perusahaan.
                </p>
                
                <div style={{ marginTop: '24px' }}>
                    <Link 
                      href="/admin/karyawan/tambah" 
                      style={{ 
                          padding: '12px 28px', 
                          borderRadius: '14px', 
                          background: '#0f172a', 
                          color: 'white', 
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          textDecoration: 'none'
                      }}
                    >
                      <IconPlus />
                      Tambah Karyawan
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#1e40af' }}><IconUserCheck /></div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{countAktif}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Aktif</div>
                    </div>
                </div>
                
                <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div className={styles.statIcon} style={{ background: '#fef2f2', color: '#dc2626' }}><IconUserX /></div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{countBlokir}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Terblokir</div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
          <div className={styles.card} style={{ borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
            <KaryawanTableClient karyawanInitial={formattedKaryawan} />
          </div>
      </div>
    </div>
  )
}
